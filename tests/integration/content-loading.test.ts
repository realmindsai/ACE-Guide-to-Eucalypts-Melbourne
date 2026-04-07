import { test, expect } from '@playwright/test';

test.describe('Content collections load correctly', () => {
  test('species index shows all 5 species', async ({ page }) => {
    await page.goto('/species/');
    const cards = page.locator('.species-card');
    await expect(cards).toHaveCount(5);
  });

  test('each species page has required sections', async ({ page }) => {
    const speciesSlugs = [
      'messmate-stringybark',
      'manna-gum',
      'red-box',
      'narrow-leaf-peppermint',
      'red-ironbark',
    ];

    for (const slug of speciesSlugs) {
      await page.goto(`/species/${slug}/`);
      await expect(page.locator('h1')).toBeVisible();
      await expect(page.locator('.id-panel')).toBeVisible();
      await expect(page.locator('.photo-gallery')).toBeVisible();
      await expect(page.locator('.species-cta')).toBeVisible();
    }
  });

  test('home page shows featured endorsements', async ({ page }) => {
    await page.goto('/');
    const endorsements = page.locator('.endorsement');
    await expect(endorsements).toHaveCount(2);
  });

  test('home page shows featured species in teaser strip', async ({ page }) => {
    await page.goto('/');
    const teaserCards = page.locator('.teaser-strip .species-card');
    const count = await teaserCards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
