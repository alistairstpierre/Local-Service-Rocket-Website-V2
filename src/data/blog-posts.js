/* Blog hub listing. Newest first. The weekly publish cron
   (api/cron/publish-blog.js -> scripts/publish-next-blog.mjs) prepends
   entries here when a post leaves blog-queue/. Keep href/title/dek in
   sync with the live Astro file under src/pages/blog/. */
export const blogPosts = [
  {
    href: '/blog/orbit-fees-risk-not-hours',
    title: "Why marketing fees go up at $200k months (it's risk, not busywork)",
    dek: "Orbit is ~$1.5k/mo + 20% of ad spend so the calendar and the trucks don't collapse when budgets scale. Rewired's plateau made the point.",
    date: "September 22, 2026",
  },
  {
    href: '/blog/honest-hanks-stack-small-wins',
    title: "Honest Hank's: stack $500 electrician wins before the $10k package",
    dek: "Rewired referral, ~$500 LSA setup first, $25k to $80k months and a third van, without a bet-the-shop invoice.",
    date: "September 15, 2026",
  },
  {
    href: '/blog/rewired-big-agency-rebuild',
    title: 'Rewired: Big Agencies Made Electrician Ads Worse',
    dek: 'A dozen agencies, two flashy rebuilds, tens of thousands burned, then $60k to $220k+ months once John stopped shopping.',
    date: 'September 8, 2026',
  },
  {
    href: '/blog/electrician-local-services-ads',
    title: 'Local Services Ads for Electricians That Scale',
    dek: '1 to 4 counties, 2+ years of LSA volume, Jason 600% year. Why Search can wait.',
    date: 'September 1, 2026',
  },
  {
    href: '/blog/hiring-electricians-facebook-vs-indeed',
    title: 'Hiring Electricians With Facebook Ads, Not Indeed',
    dek: '~$500 setup, ~10-day Meta sprint, Rewired 5 to 12 crew. What to do when trucks are the bottleneck.',
    date: 'August 25, 2026',
  },
  {
    href: '/blog/bad-vs-good-agency',
    title: 'Electrician Marketing Agencies: Bad vs Good',
    dek: 'Rewired burned through a dozen agencies. Motha paid for SEO while one wrong GBP category kept them invisible. How to tell the difference before you sign.',
    date: 'August 18, 2026',
  },
  {
    href: '/blog/realistic-marketing-expectations',
    title: 'Realistic expectations for home-service marketing',
    dek: 'Two months, eight months, three years: the real timelines from four accounts, plus the month-two cliff nobody warns you about.',
    date: 'August 11, 2026',
  },
  {
    href: '/blog/good-google-marketing',
    title: 'What good Google marketing looks like for trades',
    dek: 'Profile, site, LSA, then Search. The spine that took Honest Hanks from $25k to $80k months and Rewired to $220k+.',
    date: 'August 4, 2026',
  },
  {
    href: '/blog/ai-websites-arent-slop',
    title: "AI websites aren't automatically slop. Lazy briefs are.",
    dek: 'Google cannot tell how your site was built. Dry Duck launched from a ~$500 AI-assisted brief and hit $200k months.',
    date: 'July 28, 2026',
  },
  {
    href: '/blog/google-category-relevance',
    title: 'Electrician GBP Mistake That Silently Kills Leads',
    dek: 'Motha Electric category said electrical installation service. Changing one dropdown produced 1-3 calls a day within a week.',
    date: 'July 21, 2026',
  },
  {
    href: '/blog/dry-duck-launch',
    title: 'Dry Duck: $500 Brief to $200k/Month Waterproofing',
    dek: 'Zero to roughly $200k months and five staff in six months, on SEO before ads, including the month-two collapse in the middle.',
    date: 'July 14, 2026',
  },
];
