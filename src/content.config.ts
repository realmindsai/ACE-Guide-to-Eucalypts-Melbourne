// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const endorsements = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/endorsements' }),
  schema: z.object({
    name: z.string(),
    credential: z.string(),
    quote: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { endorsements };
