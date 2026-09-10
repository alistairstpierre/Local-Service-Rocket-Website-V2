/* SVG minifier. Run with `npm run svg` (also runs as part of `npm run images`).
   The trade/service icons in public/assets ship with embedded C2PA provenance
   manifests that dwarf the artwork itself, so this strips metadata and minifies
   paths in place while keeping viewBox and accessibility attributes intact. */

import { readdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { optimize } from 'svgo';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(root, 'public', 'assets');

/* preset-default removes <metadata>, which leaves the c2pa namespace unused;
   multipass then lets removeUnusedNS strip the xmlns:c2pa declaration too.
   ARIA attributes are preserved by preset-default, so the icons stay labelled. */
const config = { multipass: true, plugins: ['preset-default'] };

const kb = (bytes) => `${(bytes / 1024).toFixed(1)}kB`;

const files = (await readdir(DIR)).filter((file) => file.endsWith('.svg'));
let totalIn = 0;
let totalOut = 0;

for (const file of files) {
  const filePath = path.join(DIR, file);
  const input = await readFile(filePath, 'utf8');
  const { data } = optimize(input, { path: filePath, ...config });
  await writeFile(filePath, data, 'utf8');

  totalIn += Buffer.byteLength(input);
  totalOut += Buffer.byteLength(data);
}

console.log(
  `Optimized ${files.length} SVGs: ${kb(totalIn)} -> ${kb(totalOut)} ` +
    `(${((1 - totalOut / totalIn) * 100).toFixed(1)}% smaller)`
);
