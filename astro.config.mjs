// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ace-eucalypts-melbourne.com.au', // Update when domain is secured
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
