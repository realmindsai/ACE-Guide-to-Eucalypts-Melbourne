import { test, expect } from '@playwright/test';

test.describe('Navigation', () => {
  test('all nav links are visible and work', async ({ page }) => {
    await page.goto('/');

    const navLinks = [
      { text: 'Home', href: '/' },
      { text: 'Species', href: '/species/' },
      { text: 'Identify', href: '/identify/' },
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

  test('species cards link to species pages', async ({ page }) => {
    await page.goto('/species/');
    const firstCard = page.locator('.species-card').first();
    await expect(firstCard).toBeVisible();
    const href = await firstCard.getAttribute('href');
    expect(href).toMatch(/^\/species\/.+\/$/);
  });

  test('logo links to home', async ({ page }) => {
    await page.goto('/about/');
    const logo = page.locator('.nav-logo');
    await expect(logo).toHaveAttribute('href', '/');
  });

  test('buy buttons link to buy page or external retailers', async ({ page }) => {
    await page.goto('/');
    const buyButtons = page.locator('.buy-button');
    const count = await buyButtons.count();
    expect(count).toBeGreaterThan(0);
  });
});
