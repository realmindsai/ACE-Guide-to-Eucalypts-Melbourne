// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // Update this to the final domain once DNS is live
  site: 'https://ace-eucalypts-melbourne.com.au',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
