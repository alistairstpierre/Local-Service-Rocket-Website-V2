# Handoff: Local Service Rocket — Marketing Website

## Overview
Marketing website for Local Service Rocket (LSR), a marketing/recruiting/AI agency for home service businesses (electricians, plumbers, etc.) run by Alistair St Pierre from Wellington, NZ, serving US clients. The site's job: convince trade business owners to enter a no-sales-call funnel — watch an explainer video, then self-schedule an onboarding call (services start at $500/month).

## About the Design Files
The `.dc.html` files in this bundle are **design references created in HTML** — high-fidelity prototypes showing intended look and behavior, not production code to copy directly. The task is to **recreate these designs in your target stack** (Next.js/React/plain HTML — whatever the site is built in) using its patterns. The design markup lives inside `<x-dc>…</x-dc>` in each file with all styling inline; the surrounding scaffolding (`support.js`, `<script data-dc-script>`) is preview runtime — ignore it. To preview a page, keep `support.js` next to the files and open the page in a browser.

## Fidelity
**High-fidelity.** Colors, type, spacing, and copy are final unless marked `[PLACEHOLDER: …]`. Recreate pixel-perfectly.

## Files / Pages
- `Local Service Rocket - Homepage.dc.html` — homepage. Imports the hero via `<dc-import name="Hero Section">` — mount `Hero Section.dc.html`'s content there.
- `Hero Section.dc.html` — sticky nav + hero (rotating client carousel with stats overlay, JS logic in the file's `class Component`) + aggregate stats band. The carousel: 4 clients, 6.5s per cycle, lazy-susan rotation (incoming/outgoing images 620px apart), frosted glass stats card bottom-right moves with each slide.
- `Get Started.dc.html` — onboarding funnel page ("No sales calls. Ever."), Loom video placeholder, 3 steps, pricing transparency card.
- `Case Study - Rewired.dc.html` — case study template (breadcrumb → logo header + headline + team photo → 4-stat band → story sections → dark quote panel → CTA). Honest Hank's and Dry Duck pages should follow this template.
- `Services.dc.html` — services overview, 6 cards linking to individual service pages (only Paid Ads exists so far).
- `Service - Paid Ads.dc.html` — individual service page template (hero + dark proof panel → 6 "what's included" cards → CTA).
- `assets/` — all logos, icons, team photos, headshots. Icon set: `icon-*-v2.svg` (services), `trade-*.svg` (trades grid).

## Design Tokens
- **Font**: Manrope (Google Fonts), weights 400–800
- **Colors**: ink `#1a1a1a`; body text `#4a4a4a`/`#6b6b6b`; muted `#8a8a8a`/`#999`; hairlines `#ececec`/`#e7e7e7`; page bg `#fff`; section bg `#fafafa`; accent orange `#e8590c` (hover `#c2400b`); orange on dark `#ff8f52`; orange tint bg `#fff7f2`; dark panels `#1b1d23` (hero carousel overlay `#1a1a1a` at 88%)
- **Radii**: cards 14–16px; large panels 18–22px; pills/buttons 99px
- **Buttons**: primary = orange pill, 700–800 weight, white text; secondary = 1.5px `#d9d9d9` border pill (on dark: `rgba(255,255,255,.3)` border)
- **Section rhythm**: max-width 1160px, 48px side padding, 64–72px vertical gaps; eyebrow labels 11px/700/letter-spacing .1em in orange; H2s 28–34px/800/-.02em
- **Stat pattern**: big number 800 weight (orange for the lead stat), small muted label below

## Interactions & Behavior
- Hero carousel: auto-advances every 6.5s; stats panel rotates with image
- Trust strip logos: grayscale + 62% opacity, full color on hover (`transition .2s`); each links to its case study page (most pages not built yet)
- Service cards on Services page: border turns orange on hover
- All "Schedule onboarding" buttons → `https://api.leadconnectorhq.com/widget/booking/XW2ajInOeQMAUDTg9d1R`
- Funnel: any CTA → Get Started page (video + convince) → booking link. No lead-capture form anymore.
- Video embeds: founder video `https://www.youtube.com/embed/-A8YbbilhA0` (iframe on homepage); John Senn testimonial `https://www.youtube.com/watch?v=1DnfD-5fWL8`; Lewis Carter Short `https://youtube.com/shorts/UtGKH_Aqv1U`

## Known placeholders (marked `[PLACEHOLDER: …]` in files)
- Loom walkthrough video on Get Started
- Rewired case study "Where they started" paragraph
- Hooked Up Electric team photo
- Privacy policy / terms links in footer
- Case study pages for the other logo-strip clients

## Remaining pages to build (follow existing templates)
Case studies: Honest Hank's, Dry Duck (+ others as approved). Services: Local SEO, Websites, Hiring, Branding, Tracking (follow `Service - Paid Ads.dc.html`).
