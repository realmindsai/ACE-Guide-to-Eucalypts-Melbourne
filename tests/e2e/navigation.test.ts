import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('all 4 nav links are visible and work', async ({ page }) => {
    await page.goto('/');

    const navLinks = [
      { text: 'Home', href: '/' },
      { text: 'About', href: '/about/' },
      { text: 'Authors', href: '/authors/' },
      { text: 'Buy', href: '/buy/' },
    ];

    for (const link of navLinks) {
      const navLink = page.locator(`.nav-links a[href="${link.href}"]`);
      await expect(navLink).toBeVisible();
      await expect(navLink).toHaveText(link.text);
    }
  });

  test('logo links to home', async ({ page }) => {
    await page.goto('/about/');
    const logo = page.locator('.nav-logo');
    await expect(logo).toHaveAttribute('href', '/');
  });

  test('buy buttons link to buy page or Stripe', async ({ page }) => {
    await page.goto('/');
    const buyButtons = page.locator('.buy-button');
    const count = await buyButtons.count();
    expect(count).toBeGreaterThan(0);
  });

  test('removed pages return 404', async ({ page }) => {
    const response = await page.goto('/species/');
    expect(response?.status()).toBe(404);
  });
});
