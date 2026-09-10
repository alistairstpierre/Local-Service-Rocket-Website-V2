<!--
  How the weekly blog queue works. Interacts with:
  - blog-queue/posts/*.astro (drafts waiting to go live)
  - scripts/publish-next-blog.mjs (moves one post onto the site)
  - api/cron/publish-blog.js + vercel.json crons (Vercel trigger)
  - .github/workflows/publish-blog.yml (commit + push → redeploy)
  Editorial standard: docs/BLOG-FRAMEWORK.md
-->

# Blog queue — one post per week

## Schedule

| Trigger | When | What |
| --- | --- | --- |
| **Vercel Cron** | Sunday 20:00 UTC (Monday 08:00 NZ) | `GET /api/cron/publish-blog` |
| **GitHub Action** (backup) | Same cron | Runs the publish script if Vercel misses |

Only **one** ready post ships per run: the earliest `publishAfter <= today`.

## Add a post to the queue

1. Write the full `.astro` file under `blog-queue/posts/` (same shape as `src/pages/blog/*`).
2. Append an item to `queue.json` with `status: "ready"` and a future `publishAfter`.
3. Pass the Ship Test in `docs/BLOG-FRAMEWORK.md` before marking ready.
4. Put the trade in the title when the receipt is trade-specific.

## Env vars (Vercel project)

| Name | Purpose |
| --- | --- |
| `CRON_SECRET` | Shared secret; Vercel sends `Authorization: Bearer …` |
| `BLOG_PUBLISH_GITHUB_TOKEN` | Fine-grained or classic PAT with `actions:write` on this repo |
| `BLOG_PUBLISH_GITHUB_REPO` | Optional override, default `alistairstpierre/Local-Service-Rocket-Website-V2` |

## Local commands

```powershell
npm run blog:publish-dry    # show which post would ship
npm run blog:publish-next   # actually move it onto the site (then commit yourself)
```

## After it publishes

Vercel rebuilds from the new commit on `main`. The queue file is deleted; `queue.json` keeps `status: "published"` and `publishedOn` for the trail.
