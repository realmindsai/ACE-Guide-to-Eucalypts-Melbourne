import { test, expect } from '@playwright/test';

const viewports = [
  { name: 'mobile', width: 375, height: 667 },
  { name: 'tablet', width: 768, height: 1024 },
  { name: 'desktop', width: 1280, height: 800 },
];

for (const vp of viewports) {
  test.describe(`${vp.name} (${vp.width}px)`, () => {
    test.use({ viewport: { width: vp.width, height: vp.height } });

    test('nav links are visible (no hamburger)', async ({ page }) => {
      await page.goto('/');
      const navLinks = page.locator('.nav-links a');
      const count = await navLinks.count();
      expect(count).toBe(6);
      for (let i = 0; i < count; i++) {
        await expect(navLinks.nth(i)).toBeVisible();
      }
    });

    test('content does not overflow horizontally', async ({ page }) => {
      await page.goto('/');
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(vp.width);
    });
  });
}
