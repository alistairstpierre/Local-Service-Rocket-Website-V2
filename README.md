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

## Deploy to Vercel

1. Push this repo to GitHub (or import the folder in the Vercel dashboard).
2. Framework Preset: **Astro** (auto-detected).
3. Build command: `npm run build` · Output: `dist`
4. Deploy. No adapter needed — `output: 'static'` in `astro.config.mjs`.

## Pages

| Route | Source design |
| --- | --- |
| `/` | Homepage + Hero Section |
| `/get-started` | Get Started funnel |
| `/services` | Services overview |
| `/services/paid-ads` | Paid Ads & LSAs |
| `/case-studies/rewired` | Rewired case study |

## Project structure

```
├── Claude Design Files/     # Design handoff (reference only — not shipped)
├── public/
│   └── assets/              # Logos, icons, photos, trade SVGs
├── src/
│   ├── components/
│   │   ├── Footer.astro     # Shared site footer
│   │   ├── Hero.astro       # Homepage hero + client carousel
│   │   ├── Logo.astro       # LSR logo mark SVG
│   │   └── Nav.astro        # Sticky header / nav
│   ├── layouts/
│   │   └── BaseLayout.astro # HTML shell, fonts, global CSS
│   ├── pages/
│   │   ├── index.astro      # Homepage
│   │   ├── get-started.astro
│   │   ├── case-studies/
│   │   │   └── rewired.astro
│   │   └── services/
│   │       ├── index.astro
│   │       └── paid-ads.astro
│   └── styles/
│       └── global.css       # Design tokens + base styles
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## Design tokens (summary)

- Font: Manrope (400–800)
- Accent: `#e8590c` · Dark panels: `#1b1d23` · Max width: 1160px
- Booking CTA: `https://api.leadconnectorhq.com/widget/booking/XW2ajInOeQMAUDTg9d1R`

## Still placeholders / later

- Loom video on `/get-started`
- Rewired “Where they started” copy
- Case studies: Honest Hank's, Dry Duck, others
- Service detail pages: Local SEO, Websites, Hiring, Branding, Tracking
- Privacy policy / terms (footer)
- Hooked Up Electric team photo
