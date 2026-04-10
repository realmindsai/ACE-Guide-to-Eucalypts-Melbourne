// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://realmindsai.github.io',
  base: '/ACE-Guide-to-Eucalypts-Melbourne',
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
