<!--
  How the weekly blog queue works. Interacts with:
  - blog-queue/posts/*.astro (drafts waiting to go live)
  - scripts/publish-next-blog.mjs (moves one post onto the site)
  - .github/workflows/publish-blog.yml (schedule + commit; Vercel redeploys from git)
  Editorial standard: docs/BLOG-FRAMEWORK.md
-->

# Blog queue — one post per week

## Schedule

GitHub Action **Publish next blog post** runs Sunday 20:00 UTC (Monday 08:00 NZ).
It moves the next ready draft into `src/pages/blog/`, commits, and pushes.
Vercel then rebuilds from `main` via the normal Git integration — no Deploy Hook,
no PAT, no Vercel Cron.

Only **one** ready post ships per run: the earliest `publishAfter <= today`.

## Add a post to the queue

1. Write the full `.astro` file under `blog-queue/posts/` (same shape as `src/pages/blog/*`).
2. Append an item to `queue.json` with `status: "ready"` and a future `publishAfter`.
3. Pass the Ship Test in `docs/BLOG-FRAMEWORK.md` before marking ready.
4. Put the trade in the title when the receipt is trade-specific.

## Setup checklist

1. Repo → **Settings → Actions → General** → allow Actions / allow GitHub Actions to create PRs / push (default is usually fine).
2. Confirm the workflow file exists: `.github/workflows/publish-blog.yml`.
3. Optional smoke test: **Actions → Publish next blog post → Run workflow**.

No Vercel env vars required for publishing.

## Local commands

```powershell
npm run blog:publish-dry    # show which post would ship
npm run blog:publish-next   # actually move it onto the site (then commit yourself)
```

## After it publishes

Vercel rebuilds from the new commit on `main`. The queue file is deleted; `queue.json`
keeps `status: "published"` and `publishedOn` for the trail.
