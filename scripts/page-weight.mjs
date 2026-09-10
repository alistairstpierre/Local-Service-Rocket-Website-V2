/* Reports the real first-load transfer weight of built pages.
   Run with `npm run weight` after `npm run build`. Parses each dist HTML file,
   resolves the asset a modern browser would actually pick (AVIF at 1x, the
   preloaded font, scripts) and gzips everything to approximate what Vercel
   serves. Used to sanity check performance work; it reads dist/ only. */

import { gzipSync } from 'node:zlib';
import { readFile, readdir, stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(root, 'dist');

const PAGES = process.argv.slice(2).length
  ? process.argv.slice(2)
  : ['index.html', 'case-studies/index.html', 'for/electrician-marketing/index.html'];

const kb = (bytes) => `${(bytes / 1024).toFixed(1)} kB`;

async function transferSize(urlPath, { compress }) {
  const file = path.join(DIST, urlPath.replace(/^\//, ''));
  try {
    if (!compress) return (await stat(file)).size;
    return gzipSync(await readFile(file)).length;
  } catch {
    return 0;
  }
}

/** Viewport assumed when resolving `sizes`, at 1x device pixel ratio. */
const VIEWPORT = 1280;

/** Resolves which srcset candidate a browser would actually pick. */
function chosenAvif(sourceTag) {
  const srcset = sourceTag.match(/srcset="([^"]+)"/)?.[1];
  if (!srcset) return null;

  const candidates = srcset.split(',').map((part) => {
    const [url, descriptor] = part.trim().split(/\s+/);
    return { url, width: descriptor ? parseInt(descriptor, 10) : 0 };
  });
  if (candidates.length === 1) return candidates[0].url;

  // The last `sizes` entry is the default (no media condition).
  const sizes = sourceTag.match(/sizes="([^"]+)"/)?.[1] ?? '100vw';
  const fallback = sizes.split(',').pop().trim();
  const needed = fallback.endsWith('vw')
    ? (parseFloat(fallback) / 100) * VIEWPORT
    : parseFloat(fallback);

  const sorted = candidates.sort((a, b) => a.width - b.width);
  return (sorted.find((c) => c.width >= needed) ?? sorted.at(-1)).url;
}

async function weigh(page) {
  const html = await readFile(path.join(DIST, page), 'utf8');
  const parts = [];

  parts.push(['html', gzipSync(Buffer.from(html)).length]);

  for (const match of html.matchAll(/<source type="image\/avif"[^>]*>/g)) {
    const url = chosenAvif(match[0]);
    if (url) parts.push([url, await transferSize(url, { compress: false })]);
  }

  // Plain <img> that is not inside a <picture> (the SVG icon sets).
  for (const match of html.matchAll(/<img[^>]+src="(\/assets\/[^"]+\.svg)"/g)) {
    parts.push([match[1], await transferSize(match[1], { compress: true })]);
  }

  for (const match of html.matchAll(/<script[^>]+src="([^"]+)"/g)) {
    parts.push([match[1], await transferSize(match[1], { compress: true })]);
  }

  if (html.includes('manrope-variable-latin.woff2')) {
    // woff2 is already compressed.
    parts.push(['font', await transferSize('/fonts/manrope-variable-latin.woff2', { compress: false })]);
  }

  const unique = new Map(parts);
  const total = [...unique.values()].reduce((sum, size) => sum + size, 0);
  const images = [...unique].filter(([key]) => key.startsWith('/assets/'));

  console.log(`\n${page}`);
  console.log(`  requests      ${unique.size}`);
  console.log(`  images        ${kb(images.reduce((sum, [, size]) => sum + size, 0))} across ${images.length} files`);
  console.log(`  TOTAL         ${kb(total)} (gzipped where applicable)`);
}

for (const page of PAGES) await weigh(page);
