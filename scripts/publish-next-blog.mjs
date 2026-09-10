/**
 * Publish the next ready post from blog-queue/ onto the live site.
 *
 * Used by:
 *   - `npm run blog:publish-next` (local)
 *   - `.github/workflows/publish-blog.yml` (weekly schedule + manual dispatch)
 *
 * Flow: pick earliest ready item with publishAfter <= today → copy .astro into
 * src/pages/blog/ → prepend card to src/data/blog-posts.js → mark queue item published.
 * Docs: docs/BLOG-FRAMEWORK.md (trade keywords + topic queue) and blog-queue/README.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');
const queuePath = path.join(root, 'blog-queue', 'queue.json');
const postsDir = path.join(root, 'blog-queue', 'posts');
const liveDir = path.join(root, 'src', 'pages', 'blog');
const listingPath = path.join(root, 'src', 'data', 'blog-posts.js');

function todayUTC() {
  return new Date().toISOString().slice(0, 10);
}

function loadQueue() {
  return JSON.parse(fs.readFileSync(queuePath, 'utf8'));
}

function saveQueue(queue) {
  fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`, 'utf8');
}

function pickNext(queue, asOf = todayUTC()) {
  return (
    queue.items.find(
      (item) => item.status === 'ready' && item.publishAfter <= asOf && item.file
    ) ?? null
  );
}

function prependListing(item) {
  const src = fs.readFileSync(listingPath, 'utf8');
  const marker = 'export const blogPosts = [';
  const idx = src.indexOf(marker);
  if (idx === -1) throw new Error('Could not find blogPosts array in blog-posts.js');

  const entry = `  {
    href: '/blog/${item.slug}',
    title: ${JSON.stringify(item.title)},
    dek: ${JSON.stringify(item.dek)},
    date: ${JSON.stringify(item.date)},
  },
`;
  const insertAt = idx + marker.length + 1; // after "[\n"
  const next = src.slice(0, insertAt) + entry + src.slice(insertAt);
  fs.writeFileSync(listingPath, next, 'utf8');
}

/**
 * @param {{ dryRun?: boolean, asOf?: string }} opts
 * @returns {{ ok: boolean, reason?: string, published?: object }}
 */
export function publishNextBlog(opts = {}) {
  const dryRun = Boolean(opts.dryRun);
  const asOf = opts.asOf ?? todayUTC();
  const queue = loadQueue();
  const item = pickNext(queue, asOf);

  if (!item) {
    return { ok: true, reason: 'nothing-due', asOf };
  }

  const srcFile = path.join(postsDir, item.file);
  const destFile = path.join(liveDir, `${item.slug}.astro`);

  if (!fs.existsSync(srcFile)) {
    return { ok: false, reason: `missing-file:${item.file}` };
  }
  if (fs.existsSync(destFile)) {
    return { ok: false, reason: `already-live:${item.slug}` };
  }

  if (dryRun) {
    return { ok: true, reason: 'dry-run', published: item, asOf };
  }

  fs.copyFileSync(srcFile, destFile);
  prependListing(item);

  item.status = 'published';
  item.publishedOn = asOf;
  saveQueue(queue);

  // Drop the queue copy so we don't re-publish; keep a trail in queue.json.
  fs.unlinkSync(srcFile);

  return { ok: true, reason: 'published', published: item, asOf };
}

// CLI
const isMain = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
  const dryRun = process.argv.includes('--dry-run');
  const result = publishNextBlog({ dryRun });
  console.log(JSON.stringify(result, null, 2));
  if (!result.ok) process.exit(1);
}
