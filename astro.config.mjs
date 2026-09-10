// Astro config for Local Service Rocket marketing site (static output for Vercel).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://localservicerocket.com',
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
