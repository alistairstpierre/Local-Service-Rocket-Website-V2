/* Single source of truth for every raster image on the site.
   Read by two consumers:
     - scripts/optimize-images.mjs (build-time) reads originals from /assets-src
       and writes AVIF + WebP + a compressed fallback into /public/assets. It
       also records the real output dimensions in src/data/image-sizes.json.
     - src/components/Picture.astro (render-time) reads the same entries plus
       those recorded sizes to emit <picture> markup without layout shift.
   Adding an image = drop the original in /assets-src, add an entry here,
   run `npm run images`, then reference it by key with <Picture name="..." />.

   `widths` should be the largest size the image is ever displayed at, times
   the device pixel ratio you want to serve crisply (2x). Generating more than
   that is wasted bytes. */

/**
 * @typedef {Object} ImageEntry
 * @property {string} source     File name inside /assets-src
 * @property {number[]} widths   Rendered widths to generate (CSS px * DPR)
 * @property {'jpg'|'png'} fallback  Format for browsers without AVIF/WebP
 * @property {boolean} [flatten] Drop an unused alpha channel onto white
 */

/** Logos never render taller than ~50px, so 120px covers 2x displays. */
const LOGO = 120;

/** @type {Record<string, ImageEntry>} */
export const images = {
  // Hero carousel: 430px square on desktop, 320px on mobile.
  'client-rewired': { source: 'client-rewired.png', widths: [430, 860], fallback: 'jpg' },
  'client-motha-electric': { source: 'client-motha-electric.png', widths: [430, 860], fallback: 'jpg' },
  'client-honest-hanks': { source: 'client-honest-hanks.png', widths: [430, 860], fallback: 'jpg' },
  'client-dry-duck': { source: 'client-dry-duck.png', widths: [430, 860], fallback: 'jpg' },
  // Also used full-width as the Hooked Up case study team photo, hence the extra size.
  'client-hooked-up': { source: 'client-hooked-up.png', widths: [430, 860, 1254], fallback: 'jpg' },

  // Branding showcase: 2-col ~620px CSS, full-bleed mobile. Sources are
  // trimmed studio mockups (~1050px); largest step matches source width.
  'wrap-rewired': { source: 'wrap-rewired.jpg', widths: [640, 1048], fallback: 'jpg' },
  'wrap-honest-hanks': { source: 'wrap-honest-hanks.jpg', widths: [640, 1040], fallback: 'jpg' },
  'wrap-dry-duck': { source: 'wrap-dry-duck.jpg', widths: [640, 1056], fallback: 'jpg' },
  'wrap-coastal-current': { source: 'wrap-coastal-current.jpg', widths: [640, 1027], fallback: 'jpg' },

  // Team photos: case study heroes, half-width feature cards, and the small
  // polaroid cards on /flight-plan (hence the 320 step).
  'team-rewired': { source: 'team-rewired.png', widths: [320, 640, 1173], fallback: 'jpg', flatten: true },
  'team-honest-hanks': { source: 'team-honest-hanks.png', widths: [320, 640, 1280], fallback: 'jpg' },
  'team-dry-duck': { source: 'team-dry-duck.jpg', widths: [320, 640, 1280], fallback: 'jpg' },

  // Headshots render between 28px and 40px.
  'john-headshot': { source: 'john-headshot.png', widths: [96], fallback: 'jpg', flatten: true },
  'lewis-carter': { source: 'lewis-carter.png', widths: [96], fallback: 'jpg', flatten: true },
  'jason-hooked-up': { source: 'jason-hooked-up.png', widths: [96], fallback: 'jpg', flatten: true },

  // Alistair's portrait on /about, shown at 96px. The original is only 200x200,
  // so 200 is the ceiling here - swap in a larger source before rendering bigger.
  'alistair-photo': { source: 'alistair-photo.jpg', widths: [200], fallback: 'jpg' },

  // Poster frame for the founder story facade. Self-hosted so the homepage makes
  // no third-party request until someone actually clicks play.
  'video-founder-story': { source: 'video-founder-story.jpg', widths: [640, 1280], fallback: 'jpg' },

  // Google Partner badge — OFF the live site until Partner status is active.
  // Restore checklist (Sep 18+ / when Badge status shows Partner):
  // 1. Ads → Admin → Partners program → Badge status → Download HTML snippet
  //    (must link to the public company profile; bare image alone is non-compliant)
  // 2. Put that snippet on Hero + get-started (or wrap Picture in the profile URL
  //    only if the snippet is unavailable and Google still shows Partner status)
  // 3. Confirm localservicerocket.com is listed under badged websites in Company details
  'badge-google-partner': { source: 'badge-google-partner.png', widths: [235], fallback: 'png' },

  // Client logo strips. Only Coastal Current and Dry Duck have real transparency.
  'logo-rewired': { source: 'logo-rewired.png', widths: [LOGO], fallback: 'jpg', flatten: true },
  'logo-honest-hanks': { source: 'logo-honest-hanks.png', widths: [LOGO], fallback: 'jpg', flatten: true },
  'logo-dry-duck': { source: 'logo-dry-duck.png', widths: [LOGO], fallback: 'png' },
  'logo-hooked-up': { source: 'logo-hooked-up.png', widths: [LOGO], fallback: 'jpg' },
  'logo-motha': { source: 'logo-motha.jpg', widths: [LOGO], fallback: 'jpg' },
  'logo-coastal-current': { source: 'logo-coastal-current.png', widths: [LOGO], fallback: 'png' },
  'logo-pacific': { source: 'logo-pacific.jpg', widths: [LOGO], fallback: 'jpg' },
  'logo-definite': { source: 'logo-definite.jpg', widths: [LOGO], fallback: 'jpg' },
  'logo-austral': { source: 'logo-austral.png', widths: [LOGO], fallback: 'jpg', flatten: true },
  'logo-c-tinting': { source: 'logo-c-tinting.png', widths: [LOGO], fallback: 'jpg' },
};

/** Path to the always-supported fallback file, e.g. "/assets/logo-motha.jpg". */
export function imagePath(name) {
  const entry = images[name];
  if (!entry) throw new Error(`Unknown image "${name}" - add it to src/data/images.js`);
  return `/assets/${name}.${entry.fallback}`;
}

/** srcset for one format. Single-width images skip the "w" descriptor so they
    do not need a `sizes` attribute to resolve correctly. */
export function srcSet(name, format) {
  const entry = images[name];
  if (!entry) throw new Error(`Unknown image "${name}" - add it to src/data/images.js`);
  if (entry.widths.length === 1) return `/assets/${name}-${entry.widths[0]}.${format}`;
  return entry.widths.map((width) => `/assets/${name}-${width}.${format} ${width}w`).join(', ');
}
