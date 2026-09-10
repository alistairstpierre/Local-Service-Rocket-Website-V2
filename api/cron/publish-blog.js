/**
 * Vercel Cron endpoint: every week, publish the next ready blog from blog-queue/.
 *
 * Set project env CRON_SECRET — Vercel sends Authorization: Bearer <CRON_SECRET>.
 * Set BLOG_PUBLISH_GITHUB_TOKEN with actions:write on the repo so this can
 * workflow_dispatch .github/workflows/publish-blog.yml (which commits + pushes).
 *
 * Schedule: vercel.json → Sundays 20:00 UTC (Monday 08:00 NZ).
 */
const CRON_SECRET = process.env.CRON_SECRET;
const GITHUB_TOKEN = process.env.BLOG_PUBLISH_GITHUB_TOKEN || process.env.GITHUB_TOKEN;
const GITHUB_REPO =
  process.env.BLOG_PUBLISH_GITHUB_REPO || 'alistairstpierre/Local-Service-Rocket-Website-V2';
const WORKFLOW_FILE = 'publish-blog.yml';

function json(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  if (req.method !== 'GET' && req.method !== 'POST') {
    return json(res, 405, { ok: false, error: 'method-not-allowed' });
  }

  if (!CRON_SECRET) {
    return json(res, 500, { ok: false, error: 'CRON_SECRET not configured' });
  }

  const auth = req.headers.authorization || '';
  const querySecret = new URL(req.url || '/', 'http://localhost').searchParams.get('secret');
  const authorized = auth === `Bearer ${CRON_SECRET}` || querySecret === CRON_SECRET;
  if (!authorized) {
    return json(res, 401, { ok: false, error: 'unauthorized' });
  }

  if (!GITHUB_TOKEN) {
    return json(res, 200, {
      ok: true,
      mode: 'noop',
      message:
        'Set BLOG_PUBLISH_GITHUB_TOKEN (repo scope: actions:write) so cron can dispatch publish-blog.yml.',
    });
  }

  const dispatch = await fetch(
    `https://api.github.com/repos/${GITHUB_REPO}/actions/workflows/${WORKFLOW_FILE}/dispatches`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${GITHUB_TOKEN}`,
        Accept: 'application/vnd.github+json',
        'X-GitHub-Api-Version': '2022-11-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ref: 'main' }),
    }
  );

  if (!dispatch.ok) {
    const text = await dispatch.text();
    return json(res, 502, {
      ok: false,
      error: 'github-dispatch-failed',
      status: dispatch.status,
      body: text.slice(0, 500),
    });
  }

  return json(res, 200, {
    ok: true,
    mode: 'dispatched',
    workflow: WORKFLOW_FILE,
    repo: GITHUB_REPO,
  });
}
