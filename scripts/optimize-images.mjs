/* Build-time image compressor. Run with `npm run images`.
   Reads the originals listed in src/data/images.js from /assets-src and writes
   AVIF + WebP variants plus one compressed fallback into /public/assets.
   Nothing else touches /public/assets rasters, so this script owns them - the
   originals stay out of the deployed bundle. Also renders the 1200x630 social
   card used as the default og:image in BaseLayout. */

import { mkdir, readdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';
import { images } from '../src/data/images.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SRC_DIR = path.join(root, 'assets-src');
const OUT_DIR = path.join(root, 'public', 'assets');
const SIZES_FILE = path.join(root, 'src', 'data', 'image-sizes.json');

// AVIF is ~30% smaller than WebP but slow to encode; effort 6 is a good trade.
const AVIF = { quality: 52, effort: 6, chromaSubsampling: '4:2:0' };
const WEBP = { quality: 78, effort: 6 };
const JPEG = { quality: 78, mozjpeg: true, progressive: true, chromaSubsampling: '4:2:0' };
const PNG = { compressionLevel: 9, palette: true, quality: 82, effort: 10 };

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}kB`;

async function sizeOf(file) {
  return (await stat(file)).size;
}

/** Removes previously generated rasters so renamed/resized entries never linger. */
async function cleanGenerated() {
  const files = await readdir(OUT_DIR);
  await Promise.all(
    files
      .filter((file) => /\.(avif|webp|jpg|jpeg|png)$/i.test(file))
      .map((file) => unlink(path.join(OUT_DIR, file)))
  );
}

async function buildEntry(name, entry) {
  const input = path.join(SRC_DIR, entry.source);
  const base = sharp(input).rotate();
  const meta = await base.metadata();
  let sourceBytes = await sizeOf(input);
  let outputBytes = 0;

  const prepare = (width) => {
    let pipeline = sharp(input).rotate().resize({ width, withoutEnlargement: true });
    if (entry.flatten || entry.fallback === 'jpg') {
      pipeline = pipeline.flatten({ background: '#ffffff' });
    }
    return pipeline;
  };

  for (const width of entry.widths) {
    if (width > meta.width) {
      console.warn(`  ! ${name}: requested ${width}px but source is only ${meta.width}px`);
    }
    const avif = path.join(OUT_DIR, `${name}-${width}.avif`);
    const webp = path.join(OUT_DIR, `${name}-${width}.webp`);
    await prepare(width).avif(AVIF).toFile(avif);
    await prepare(width).webp(WEBP).toFile(webp);
    outputBytes += await sizeOf(avif);
  }

  // One fallback at the largest size for browsers without AVIF/WebP.
  const largest = Math.max(...entry.widths);
  const fallback = path.join(OUT_DIR, `${name}.${entry.fallback}`);
  const pipeline = prepare(largest);
  await (entry.fallback === 'png' ? pipeline.png(PNG) : pipeline.jpeg(JPEG)).toFile(fallback);

  const info = await sharp(fallback).metadata();

  console.log(`  ${name.padEnd(24)} ${kb(sourceBytes).padStart(9)} -> ${kb(outputBytes).padStart(9)} (avif set)`);
  return { sourceBytes, outputBytes, size: { w: info.width, h: info.height } };
}

/** Social cards need ~1200x630; the raw badge is far too small to preview well. */
async function buildSocialCard() {
  const badge = await sharp(path.join(SRC_DIR, 'badge-google-partner.png'))
    .resize({ width: 520 })
    .toBuffer();

  await sharp({
    create: { width: 1200, height: 630, channels: 3, background: '#ffffff' },
  })
    .composite([{ input: badge, gravity: 'centre' }])
    .jpeg(JPEG)
    .toFile(path.join(OUT_DIR, 'og-default.jpg'));

  console.log('  og-default.jpg           1200x630 social card');
}

async function main() {
  await mkdir(OUT_DIR, { recursive: true });
  await cleanGenerated();

  let totalIn = 0;
  let totalOut = 0;
  const sizes = {};

  console.log(`Optimizing ${Object.keys(images).length} images...`);
  for (const [name, entry] of Object.entries(images)) {
    const { sourceBytes, outputBytes, size } = await buildEntry(name, entry);
    totalIn += sourceBytes;
    totalOut += outputBytes;
    sizes[name] = size;
  }
  await buildSocialCard();

  // Picture.astro reads this so width/height always match the real output.
  await writeFile(SIZES_FILE, `${JSON.stringify(sizes, null, 2)}\n`, 'utf8');

  const saved = ((1 - totalOut / totalIn) * 100).toFixed(1);
  console.log(`\nOriginals ${kb(totalIn)} -> AVIF ${kb(totalOut)} (${saved}% smaller)`);
}

await main();
