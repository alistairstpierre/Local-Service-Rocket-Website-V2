// Astro config for Local Service Rocket marketing site (static output for Vercel).
// @astrojs/sitemap rebuilds sitemap-index.xml + sitemap-0.xml on every `astro build`
// (so Vercel deploys always ship a fresh URL list for Google Search Console).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  // Must match the host Vercel serves (apex redirects to www) so canonicals are self-referential.
  site: 'https://www.localservicerocket.com',
  // One URL per page: /services (never /services/). Paired with cleanUrls + trailingSlash:false
  // in vercel.json so the slash variant 308-redirects instead of serving a duplicate.
  trailingSlash: 'never',
  // Plain URL list only: Google ignores changefreq/priority, and inaccurate lastmod
  // (e.g. build timestamps) can cause Google to distrust dates sitewide.
  integrations: [sitemap()],

  // Fetch a page as soon as the pointer touches its link. Hover (rather than
  // viewport) keeps the homepage from pulling all 40+ linked pages on mobile.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  build: {
    // services.html rather than services/index.html, so Astro.url and the sitemap have no slash.
    format: 'file',
    // Pages are mostly unique scoped CSS, so inlining removes a render-blocking
    // request instead of trading it for a shared cached file.
    inlineStylesheets: 'always',
  },

  vite: {
    build: {
      cssMinify: 'lightningcss',
      // Small helper chunks cost more in requests than they save in caching.
      assetsInlineLimit: 2048,
    },
  },
});
