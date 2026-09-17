// Astro config for Local Service Rocket marketing site (static output for Vercel).
// @astrojs/sitemap rebuilds sitemap-index.xml + sitemap-0.xml on every `astro build`
// (so Vercel deploys always ship a fresh URL list for Google Search Console).
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  output: 'static',
  site: 'https://localservicerocket.com',
  integrations: [
    sitemap({
      // Stamp every URL with this build's time so GSC sees the file as updated on deploy.
      lastmod: new Date(),
      serialize(item) {
        // Homepage and main conversion paths get a slight priority nudge; GSC mostly uses presence.
        const loc = item.url;
        if (loc === 'https://localservicerocket.com/') {
          return { ...item, priority: 1.0, changefreq: 'weekly' };
        }
        if (
          loc.includes('/get-started') ||
          loc.includes('/for/electrician-marketing') ||
          loc.includes('/marketing-for-service-companies')
        ) {
          return { ...item, priority: 0.9, changefreq: 'weekly' };
        }
        if (loc.includes('/blog/') && !loc.endsWith('/blog/')) {
          return { ...item, priority: 0.7, changefreq: 'monthly' };
        }
        return { ...item, priority: 0.8, changefreq: 'weekly' };
      },
    }),
  ],

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
