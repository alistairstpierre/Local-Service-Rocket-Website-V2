/**
 * One-shot generator: trade-specific blog drafts into blog-queue/posts/
 * and append them to queue.json on weekly Mondays after the existing queue.
 * Run: node scripts/generate-trade-queue-posts.mjs
 * Editorial: posts use real Evidence Bank receipts + trade SEO titles;
 * they do not invent fake {trade} clients. See docs/BLOG-FRAMEWORK.md.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { trades } from '../src/data/trades.ts';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const postsDir = path.join(root, 'blog-queue', 'posts');
const queuePath = path.join(root, 'blog-queue', 'queue.json');

const proof = {
  rewired: {
    name: 'Rewired',
    href: '/case-studies/rewired',
    line: 'Rewired (electrical, Des Moines) went from about $60k to $220k+ months and 5 to 12 crew over 3+ years',
  },
  'honest-hanks': {
    name: "Honest Hank's",
    href: '/case-studies/honest-hanks',
    line: "Honest Hank's (electrician, Tampa) went from about $25k to $80k months in roughly eight months, starting on a ~$500 LSA setup",
  },
  'dry-duck': {
    name: 'Dry Duck',
    href: '/case-studies/dry-duck',
    line: 'Dry Duck (basement waterproofing, Iowa) went from nothing to roughly $200k months and five staff in about six months',
  },
  'hooked-up': {
    name: 'Hooked Up Electric',
    href: '/case-studies/hooked-up',
    line: 'Hooked Up Electric ran on the order of 100-200 Google leads a month for 2+ years on an LSA-led setup across 1 to 4 counties',
  },
};

/** Skip electrician — already covered by live + early queue posts. */
const SKIP = new Set(['electrician-marketing']);

function addDaysISO(iso, days) {
  const d = new Date(`${iso}T12:00:00Z`);
  d.setUTCDate(d.getUTCDate() + days);
  return d.toISOString().slice(0, 10);
}

function formatDisplay(iso) {
  const d = new Date(`${iso}T12:00:00Z`);
  return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

function slugFor(trade) {
  return `${trade.ownerNoun.replace(/\s+/g, '-').toLowerCase().replace(/-owner$/, '')}-google-marketing`;
}

function titleFor(trade) {
  const k = trade.keyword;
  // "HVAC marketing" / "plumber marketing" style
  return `${k[0].toUpperCase()}${k.slice(1)} that books jobs: GBP, LSA, then Search`;
}

function buildPost(trade, iso) {
  const p = proof[trade.spotlight];
  const display = formatDisplay(iso);
  const forHref = `/for/${trade.slug}`;
  const noun = trade.ownerNoun;
  const companies = trade.companyPlural;
  const slug = slugFor(trade);

  const body = `---
/* Queued trade post: ${trade.keyword}.
   Primary SEO: ${trade.keyword} / ${noun} Google ads / ${noun} Local Services Ads.
   Receipts stay tied to named case studies (no invented ${noun} clients).
   Ships via blog-queue + .github/workflows/publish-blog.yml. */
import BlogLayout from '../../layouts/BlogLayout.astro';

const faqs = [
  {
    q: 'What does ${trade.keyword} include?',
    a: 'Google Business Profile and local SEO foundations, a site that converts map and ad traffic, Local Services Ads early when the trade qualifies, Search ads when the foundation books work, review velocity, and optional hiring when trucks are the bottleneck. We measure booked jobs, not vanity lead dumps.',
  },
  {
    q: 'Do you have ${noun} case studies?',
    a: 'Our deepest named proofs today are electrical and waterproofing companies — ${p.line}. The Google spine is the same for ${companies}: relevance, reviews, converting pages, cheap proof before expensive Search. Trade landings and this post exist so owners searching ${trade.keyword} find that system.',
  },
  {
    q: 'How much does ${trade.keyword} cost to start?',
    a: 'Starter lanes often begin around $500/month, with Local Services Ads setup around $500 when that channel fits. We publish full Pre-flight / Liftoff / Orbit bands on the get-started page instead of hiding them behind a sales call.',
  },
  {
    q: 'How long before a ${noun} sees booked jobs from Google?',
    a: 'Foundation fixes and LSA can move calls in days or weeks. Meaningful compounding often sits on a roughly two-month clock, with organic map-pack gains taking longer. We would rather name a sixty-day proof point than guarantee overnight domination.',
  },
  {
    q: 'Should ${companies} start with Search ads or Local Services Ads?',
    a: 'Start with profile relevance and a converting page, then Local Services Ads when available for your trade — pay per lead, Google Guaranteed trust, top of page. Search is the expensive lane after that spine is booking work. Hooked Up Electric is the multi-year LSA proof; the sequence is the same for ${companies}.',
  },
];
---

<BlogLayout
  title=${JSON.stringify(titleFor(trade))}
  seoTitle=${JSON.stringify(`${trade.keyword[0].toUpperCase()}${trade.keyword.slice(1)} That Books Jobs | LSR`)}
  description=${JSON.stringify(
    `${trade.keyword[0].toUpperCase()}${trade.keyword.slice(1)} on Google: Business Profile, Local Services Ads, Search, and a site that books work. Same system as ${p.name} — built for ${companies}.`
  )}
  date="${display}"
  datePublished="${iso}"
  dateModified="${iso}"
  readTime="4 min"
  faqs={faqs}
>
  <p>
    <strong>${trade.keyword[0].toUpperCase()}${trade.keyword.slice(1)}</strong> that actually fills a
    calendar is the same Google spine we run for home service companies that already grew with us:
    correct Business Profile, review velocity, a converting website, Local Services Ads for cheap
    proof, then Search when the foundation holds. ${p.line}. If you are a ${noun} shopping partners,
    start there — not with a $10k day-one package.
  </p>
  <p>
    Full offer for your trade:
    <a href="${forHref}">${trade.keyword}</a>. Named proofs live on
    <a href="${p.href}">${p.name}</a>.
  </p>

  <h2>What does Google look like for ${companies}?</h2>
  <p>
    ${trade.problemBody[0]}
  </p>
  <p>
    ${trade.problemBody[1] ?? 'Owners feel it as feast-or-famine weeks, then panic spend. Marketing that cannot book work is just another bill.'}
  </p>

  <h2>What is the system, in order?</h2>
  <ol>
    <li>
      <strong>Relevance.</strong> Teach Google what you are — primary category, services, service
      areas, titles and H1s in the words homeowners type. The electrician category mistake at Motha
      (wrong dropdown, 1-3 calls a day after a thirty-second fix) is the warning for every trade.
    </li>
    <li>
      <strong>Trust and conversion.</strong> Review velocity beats dusty totals. A homepage that
      answers trust, services, area, and what happens if they call —
      <a href="/services/websites">structure first</a>.
    </li>
    <li>
      <strong>Cheap proof.</strong>
      <a href="/services/local-seo">Local SEO</a> and
      <a href="/services/paid-ads">Local Services Ads</a> before pouring money into Search.
    </li>
    <li>
      <strong>Scale and people.</strong> Search when CPA is honest; hiring when trucks are the
      bottleneck — same Flight Plan stages as electrical shops.
    </li>
  </ol>
  <div class="receipt">
    <div class="receipt-label">NAMED PROOF (SAME SPINE)</div>
    <p>
      ${p.line}. We are not inventing a fake ${noun} client for this post. We are showing ${companies}
      the playbook that already produced those numbers.
    </p>
  </div>

  <h2>How does that map to ${trade.keyword}?</h2>
  <p>
    ${trade.solutionBody[0]}
  </p>
  <p>
    ${trade.solutionBody[1] ?? 'Fees start small and step up when revenue does — Pre-flight proof before Orbit spend.'}
  </p>
  <blockquote>
    Prove booked work before you spend like a national franchise.
  </blockquote>

  <h2>What should a ${noun} check this week?</h2>
  <ul>
    <li>Primary GBP category matches the words people search for your trade.</li>
    <li>Homepage title and H1 say the trade and the city without stuffing every line.</li>
    <li>New reviews landing weekly — velocity over lifetime trophy counts.</li>
    <li>LSA on if your trade and market support it; Search only after the page converts.</li>
    <li>
      Pricing you are comparing is published —
      <a href="/get-started">ours is on get started</a>.
    </li>
  </ul>
  <p>
    If you want the trade-specific landing with FAQs and a clear CTA, use
    <a href="${forHref}">${forHref}</a>. If you want the long proofs, read
    <a href="${p.href}">${p.name}</a>, then
    <a href="/blog/good-google-marketing">what good Google marketing looks like</a>.
  </p>
</BlogLayout>
`;

  return { slug, file: `${slug}.astro`, title: titleFor(trade), body, display };
}

// Existing queue dates end 2026-10-06; continue Mondays.
let next = '2026-10-13';
const queue = JSON.parse(fs.readFileSync(queuePath, 'utf8'));
const existingSlugs = new Set(queue.items.map((i) => i.slug));

fs.mkdirSync(postsDir, { recursive: true });

const added = [];
for (const trade of trades) {
  if (SKIP.has(trade.slug)) continue;
  const { slug, file, title, body, display } = buildPost(trade, next);
  if (existingSlugs.has(slug)) {
    console.log('skip existing', slug);
    continue;
  }
  fs.writeFileSync(path.join(postsDir, file), body);
  queue.items.push({
    slug,
    file,
    title,
    dek: `${trade.keyword[0].toUpperCase()}${trade.keyword.slice(1)} on Google — same spine as ${proof[trade.spotlight].name}. GBP, LSA, Search, booked jobs.`,
    date: display,
    publishAfter: next,
    status: 'ready',
    seo: trade.keyword,
  });
  added.push(`${next} ${slug}`);
  next = addDaysISO(next, 7);
}

fs.writeFileSync(queuePath, `${JSON.stringify(queue, null, 2)}\n`);
console.log(`Added ${added.length} trade posts:`);
added.forEach((l) => console.log(' ', l));
