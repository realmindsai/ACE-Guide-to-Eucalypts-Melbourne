// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const species = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/species' }),
  schema: ({ image }) => z.object({
    common_name: z.string(),
    scientific_name: z.string(),
    group: z.enum(['stringybark', 'gum', 'box', 'peppermint', 'ironbark', 'ash', 'other']),
    aboriginal_name: z.string().optional(),
    aboriginal_language: z.string().optional(),
    aboriginal_attribution: z.string().optional(),
    bark_type: z.string(),
    leaf_description: z.string(),
    bud_fruit_description: z.string(),
    height_range: z.string(),
    flowering_season: z.string(),
    locations: z.array(z.string()),
    hero_image: image(),
    gallery: z.array(z.object({
      src: image(),
      alt: z.string(),
      caption: z.string(),
    })),
    featured: z.boolean().default(false),
    last_reviewed: z.string().optional(),
  }),
});

const endorsements = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/endorsements' }),
  schema: z.object({
    name: z.string(),
    credential: z.string(),
    quote: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { species, endorsements };
