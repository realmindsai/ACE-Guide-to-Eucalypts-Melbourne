import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'About', path: '/about/' },
  { name: 'Authors', path: '/authors/' },
  { name: 'Buy', path: '/buy/' },
];

for (const pg of pages) {
  test(`${pg.name} page passes axe accessibility audit`, async ({ page }) => {
    await page.goto(pg.path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
