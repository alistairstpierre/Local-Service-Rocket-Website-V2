# Local Service Rocket — Marketing Website

Astro marketing site for Local Service Rocket (LSR). Built from the HTML design references in `Claude Design Files/`. Static output, ready for Vercel.

## Quick start

```powershell
npm install
npm run dev
```

Open http://localhost:4321

```powershell
npm run build
npm run preview
```

### Images and fonts

Raster originals live in `assets-src/` (never deployed). `public/assets/` holds only
generated output, so **do not edit files in `public/assets/` by hand**.

```powershell
npm run images    # regenerate AVIF + WebP + fallbacks, then minify SVGs
npm run weight    # after a build: report real first-load transfer weight
```

To add an image: drop the original in `assets-src/`, add an entry to
`src/data/images.js` (source file, the widths it renders at, fallback format),
run `npm run images`, then use it with `<Picture name="your-key" alt="..." />`.
Manrope is self-hosted from `public/fonts/`, so no Google Fonts request is made.

## Deploy to Vercel

1. Push this repo to GitHub (or import the folder in the Vercel dashboard).
2. Framework Preset: **Astro** (auto-detected).
3. Build command: `npm run build` · Output: `dist`
4. Deploy. No adapter needed — `output: 'static'` in `astro.config.mjs`.

### Weekly blog cron

One queued post ships each week (Sunday 20:00 UTC / Monday 08:00 NZ) via the GitHub
Action `.github/workflows/publish-blog.yml`. It commits the next ready draft from
`blog-queue/`; Vercel redeploys from `main` automatically.

**No PAT, Deploy Hook, or Vercel Cron needed** — a Deploy Hook only rebuilds existing
code; it cannot move a queued post into the repo. The Action uses GitHub’s built-in
`GITHUB_TOKEN` to push.

Smoke test: GitHub → **Actions** → **Publish next blog post** → **Run workflow**.

```powershell
npm run blog:publish-dry
```

Details: `blog-queue/README.md`.

## Pages

| Route | Notes |
| --- | --- |
| `/` | Homepage — electrician-led (`marketing for electricians`) |
| `/marketing-for-service-companies` | Broader all-trades offer (former homepage) |
| `/about` | Alistair + agency story (from brain dumps) |
| `/flight-plan` | The System: Pre-flight / Liftoff / Orbit stages |
| `/get-started` | Get Started funnel |
| `/services` | Services overview |
| `/services/local-seo` | Local SEO & Reviews |
| `/services/paid-ads` | Paid Ads & LSAs |
| `/services/websites` | Websites That Convert |
| `/services/hiring` | Hiring & Recruiting |
| `/services/branding` | Branding |
| `/services/tracking` | Tracking & Reporting |
| `/for/electrician-marketing` (etc.) | Trade SEO/ad landings for each Who We Help trade |
| `/case-studies` | Case studies hub: three ways in (Rewired / Honest Hank's / Dry Duck) |
| `/case-studies/rewired` | Rewired case study |
| `/case-studies/honest-hanks` | Honest Hank's case study |
| `/case-studies/dry-duck` | Dry Duck case study |
| `/case-studies/hooked-up` | Hooked Up Electric case study |
| `/blog` | Blog index |
| `/blog/rewired-big-agency-rebuild` | Rewired big-agency rebuild story |
| `/blog/electrician-local-services-ads` | Hooked Up / LSA for electricians |
| `/blog/hiring-electricians-facebook-vs-indeed` | Facebook hiring vs Indeed |
| `/blog/bad-vs-good-agency` | Bad vs good agencies |
| `/blog/realistic-marketing-expectations` | Marketing expectations |
| `/blog/good-google-marketing` | What good Google marketing looks like |
| `/blog/ai-websites-arent-slop` | AI website myths |
| `/blog/google-category-relevance` | GBP category lesson |
| `/blog/dry-duck-launch` | Dry Duck launch story |
| `/privacy` | Privacy Policy |
| `/terms` | Terms of Service |

## Project structure

```
├── Claude Design Files/          # Design handoff (reference only)
├── Found By Friday Brain Dumps/  # Source transcripts for content
├── assets-src/                   # Raster ORIGINALS (not deployed) - input to npm run images
├── content/
│   ├── CONTENT-GAPS-AND-INTERVIEW.md  # Gaps checklist + dump prompts
│   └── VSL-SCRIPT.md             # As-recorded transcript + timecoded graphics brief for the /get-started video
├── blog-queue/                   # Weekly publish queue (ready drafts + queue.json)
│   ├── README.md                 # How the GitHub Action publishes one post/week
│   ├── queue.json                 # Ordered schedule (publishAfter + status)
│   └── posts/                    # .astro drafts waiting to go live
├── .github/workflows/
│   └── publish-blog.yml          # Weekly schedule: publish-next-blog.mjs → commit → Vercel rebuilds
├── docs/
│   ├── BLOG-FRAMEWORK.md         # Editorial standard, Evidence Bank, trade-keyword SEO + topic queue
│   ├── KEYWORD-RESEARCH-ELECTRICIANS.md  # Planner volumes + primary organic/paid targets for electrician domination
│   └── SITE-STRUCTURE-AND-SEO-GUIDE.md  # Client home-service site SEO/IA playbook
├── scripts/
│   ├── optimize-images.mjs       # assets-src -> AVIF/WebP/fallback + image-sizes.json
│   ├── optimize-svg.mjs          # Strips C2PA metadata, minifies public/assets SVGs
│   ├── page-weight.mjs           # Reports first-load transfer weight of built pages
│   ├── publish-next-blog.mjs     # Moves next due queue post onto src/pages/blog/
│   └── generate-trade-queue-posts.mjs  # Seeds trade-specific drafts into blog-queue/
├── public/
│   ├── robots.txt                # Allow all + Sitemap URL for GSC / crawlers
│   ├── assets/                   # GENERATED images + trade/service SVGs (do not hand-edit)
│   └── fonts/                    # Self-hosted Manrope variable woff2
├── src/
│   ├── components/
│   │   ├── Footer.astro
│   │   ├── GooglePartnerBadge.astro  # Official 2026 Partner snippet (Hero + PricingOffer)
│   │   ├── Hero.astro
│   │   ├── Logo.astro
│   │   ├── Nav.astro
│   │   ├── Picture.astro         # <picture> AVIF/WebP wrapper used for every raster
│   │   └── PricingOffer.astro    # Flight Plan pricing tiers (/ and /get-started)
│   ├── data/
│   │   ├── blog-posts.js         # Blog hub cards (cron prepends here on publish)
│   │   ├── images.js             # Image manifest (widths, formats) shared by script + Picture
│   │   ├── image-sizes.json      # GENERATED intrinsic sizes, prevents layout shift
│   │   ├── pricing-tiers.ts      # Shared Pre-flight / Liftoff / Orbit fee cards
│   │   ├── schema.ts             # Shared JSON-LD helpers (Part 5 of SEO guide)
│   │   └── trades.ts             # Who We Help trade landing copy + slugs
│   ├── layouts/
│   │   ├── BaseLayout.astro      # Shell + canonical/OG/Twitter (+ optional JSON-LD)
│   │   ├── BlogLayout.astro      # Blog article shell + author block, FAQ block, BlogPosting/FAQPage JSON-LD
│   │   ├── CaseStudyLayout.astro # Shared client story template
│   │   ├── LegalLayout.astro
│   │   ├── ServiceLayout.astro   # Shared service detail template
│   │   └── TradeLayout.astro     # /for/[slug] SEO/ad landings (guide service order)
│   ├── pages/
│   │   ├── index.astro           # Electrician-led homepage
│   │   ├── marketing-for-service-companies.astro  # All-trades offer (former homepage)
│   │   ├── about.astro
│   │   ├── flight-plan.astro     # Stage layout w/ tilted photo cards (design: The Flight Plan.dc.html)
│   │   ├── get-started.astro
│   │   ├── privacy.astro
│   │   ├── terms.astro
│   │   ├── for/
│   │   │   └── [slug].astro      # Trade landings (electrician-marketing, etc.)
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   ├── ai-websites-arent-slop.astro
│   │   │   ├── bad-vs-good-agency.astro
│   │   │   ├── dry-duck-launch.astro
│   │   │   ├── electrician-local-services-ads.astro
│   │   │   ├── good-google-marketing.astro
│   │   │   ├── google-category-relevance.astro
│   │   │   ├── hiring-electricians-facebook-vs-indeed.astro
│   │   │   ├── realistic-marketing-expectations.astro
│   │   │   └── rewired-big-agency-rebuild.astro
│   │   ├── case-studies/
│   │   │   ├── index.astro
│   │   │   ├── dry-duck.astro
│   │   │   ├── hooked-up.astro
│   │   │   ├── honest-hanks.astro
│   │   │   └── rewired.astro
│   │   └── services/
│   │       ├── index.astro
│   │       ├── branding.astro
│   │       ├── hiring.astro
│   │       ├── local-seo.astro
│   │       ├── paid-ads.astro
│   │       ├── tracking.astro
│   │       └── websites.astro
│   └── styles/
│       └── global.css
├── astro.config.mjs              # static + sitemap + prefetch + inlined CSS
├── vercel.json                   # Cache-Control for /fonts, /_astro, /assets
├── package.json
└── tsconfig.json
```

## Performance

The site ships no third-party requests and ~2 kB of JavaScript. Keep it that way:

- **Images** always go through `<Picture>` (AVIF → WebP → JPG/PNG fallback, intrinsic
  width/height, `loading="lazy"` by default). Only the LCP image on a page should get
  `loading="eager" fetchpriority="high"`.
- **Fonts** are one self-hosted variable woff2 (24 kB, weights 400–800), preloaded in
  `BaseLayout` with `font-display: swap`.
- **CSS** is inlined per page (`build.inlineStylesheets: 'always'`) so nothing blocks
  render; `prefetch` on hover makes internal navigation feel instant.
- **Scoped styles gotcha:** `<Picture>` renders its `<img>` from a child component, so
  parent rules must use `:global()` (e.g. `.cs-media :global(img)`) or they will not match.
- **Video is always click-to-play.** Never ship a YouTube or Loom `<iframe>` in the initial
  HTML — it would undo the zero-third-party-request rule on its own. Both players
  (`.why-video-facade` on `/`, `.vsl-facade` on `/get-started`) render a styled button and
  inject the iframe on click. The injected iframe needs **inline** styles: Astro's scoped CSS
  can't reach an element created at runtime, and it will otherwise default to 300x150.
- Run `npm run weight` after a build to check a page has not regressed.

## SEO notes

- **Sitemap (GSC):** `@astrojs/sitemap` runs on every `npm run build` / Vercel deploy and writes
  `sitemap-index.xml` + `sitemap-0.xml` from the live page set (new pages, renamed routes, and
  removals are picked up automatically). Submit this once in Google Search Console:
  `https://localservicerocket.com/sitemap-index.xml`
  `public/robots.txt` also points crawlers at that index. Head tags include `rel=sitemap`.
  Format matches Google’s preferred shape: UTF-8 XML at site root, absolute `https` URLs only,
  no fake `lastmod` / `changefreq` / `priority` (Google ignores or distrusts those when inaccurate).
- **Agency site (this repo):** `BaseLayout` sets canonical, Open Graph, Twitter Card, `lang=en-US`, and `rel=sitemap`. Pages emit JSON-LD via `src/data/schema.ts` (Organization, WebSite, WebPage/Service/FAQ/Breadcrumb as relevant). Document titles and meta descriptions follow Part 7 length/keyword rules where adapted for a national agency (location omitted when scope is US-wide). H1s are kept reader-first; trade landings and services use keyword-led titles. Homepage is intentionally left as the brand entry.
- **Client trade sites:** Follow `docs/SITE-STRUCTURE-AND-SEO-GUIDE.md` (one location, service/city pages, schema, Part 7 copy rules). Do not force that full client page map onto the LSR agency marketing site.
- **Blog posts:** Follow `docs/BLOG-FRAMEWORK.md`. Every post must carry a *receipt* — a real client number, a named company, or a mistake we made — and score 7+ on the Ship Test before it goes live. Posts open with the answer in sentence one (BLUF), use question-shaped H2s, and pass a `faqs` array to `BlogLayout` so `FAQPage` schema and the FAQ block render. Keep `readTime` honest: measure it, don't guess. Any client figure used in a post must already exist on a case study page, and the Evidence Bank in the framework doc is the canonical list. Owners search with their **trade in the query** (`electrician Local Services Ads`, `hire electricians Facebook`) — put the trade in the title when the receipt belongs to that trade, cross-link `/for/{trade}-marketing`, and only write trade spins when you have a second real receipt (see the framework’s trade-keyword section).
## Design tokens (summary)

- Font: Manrope (400–800), self-hosted variable woff2 from `public/fonts/`
- Accent: `#e8590c` · Dark panels: `#1b1d23` · Page shell max width: **1280px** (`--max`, `.container`) — same on every page as the homepage
- Long-form reading uses `.measure` (orange spine + hatch rail) so copy can stay narrower without shrinking the page shell; `--prose` / `--prose-wide` are only for that rail, never for whole-page containers
- Soft section bands: `.band` / `.band-tight`
- Booking CTA: `https://api.leadconnectorhq.com/widget/booking/Tp6doLoKjJfMEvnKPOn1`

## Still placeholders / later

See `content/CONTENT-GAPS-AND-INTERVIEW.md` for the full checklist and interview prompts.

- Loom video on `/get-started`
- Rewired “Where they started” copy
- Case studies: Honest Hank's, Dry Duck, others
- Hooked Up Electric team photo
