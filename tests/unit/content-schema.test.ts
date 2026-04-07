import { test, expect } from '@playwright/test';
import { z } from 'astro/zod';

// Mirror the species schema from content.config.ts (without image() since we're testing outside Astro)
const speciesFrontmatterSchema = z.object({
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
  locations: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  last_reviewed: z.string().optional(),
});

test.describe('Species schema validation', () => {
  test('accepts valid frontmatter', () => {
    const valid = {
      common_name: 'Messmate Stringybark',
      scientific_name: 'Eucalyptus obliqua',
      group: 'stringybark',
      bark_type: 'Stringybark',
      leaf_description: 'Discolorous',
      bud_fruit_description: 'Buds in clusters of 7-11',
      height_range: '20-45m',
      flowering_season: 'January-April',
      locations: ['Warrandyte'],
    };
    expect(() => speciesFrontmatterSchema.parse(valid)).not.toThrow();
  });

  test('rejects missing required fields', () => {
    const invalid = { common_name: 'Test' };
    expect(() => speciesFrontmatterSchema.parse(invalid)).toThrow();
  });

  test('rejects invalid group', () => {
    const invalid = {
      common_name: 'Test',
      scientific_name: 'Test',
      group: 'palm',
      bark_type: 'X', leaf_description: 'X', bud_fruit_description: 'X',
      height_range: 'X', flowering_season: 'X', locations: ['X'],
    };
    expect(() => speciesFrontmatterSchema.parse(invalid)).toThrow();
  });

  test('rejects empty locations array', () => {
    const invalid = {
      common_name: 'Test', scientific_name: 'Test', group: 'gum',
      bark_type: 'X', leaf_description: 'X', bud_fruit_description: 'X',
      height_range: 'X', flowering_season: 'X', locations: [],
    };
    expect(() => speciesFrontmatterSchema.parse(invalid)).toThrow();
  });
});
