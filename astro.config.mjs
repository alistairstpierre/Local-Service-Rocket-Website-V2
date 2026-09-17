// Astro config for Local Service Rocket marketing site (static output for Vercel).
// @astrojs/sitemap rebuilds sitemap-index.xml + sitemap-0.xml on every `astro build`
// (so Vercel deploys always ship a fresh URL list for Google Search Console).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://localservicerocket.com',
  // Plain URL list only: Google ignores changefreq/priority, and inaccurate lastmod
  // (e.g. build timestamps) can cause Google to distrust dates sitewide.
  integrations: [sitemap()],

  // Fetch a page as soon as the pointer touches its link. Hover (rather than
  // viewport) keeps the homepage from pulling all 40+ linked pages on mobile.
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },

  build: {
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
