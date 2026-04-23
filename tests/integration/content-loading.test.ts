import { test, expect } from '@playwright/test';

test.describe('Content loads correctly', () => {
  test('home page shows book cover image', async ({ page }) => {
    await page.goto('/');
    const cover = page.locator('.hero-cover img');
    await expect(cover).toBeVisible();
  });

  test('home page shows interior showcase images', async ({ page }) => {
    await page.goto('/');
    const showcaseImages = page.locator('.showcase-grid figure');
    await expect(showcaseImages).toHaveCount(3);
  });

  test('home page shows endorsement', async ({ page }) => {
    await page.goto('/');
    const endorsements = page.locator('.endorsement');
    const count = await endorsements.count();
    expect(count).toBeGreaterThanOrEqual(1);
  });

  test('buy page has Stripe payment link', async ({ page }) => {
    await page.goto('/buy/');
    const stripeLink = page.locator('a[href*="stripe.com"]');
    await expect(stripeLink).toBeVisible();
  });

  test('index hero renders exactly one book card', async ({ page }) => {
    await page.goto('/');
    const bookCards = page.locator('.books-spread .book-card');
    await expect(bookCards).toHaveCount(1);
  });

  test('buy page renders exactly one edition card', async ({ page }) => {
    await page.goto('/buy/');
    const editionCards = page.locator('.editions-grid .edition-card');
    await expect(editionCards).toHaveCount(1);
  });

  test('FAQ contains no Brisbane edition references', async ({ page }) => {
    await page.goto('/faq/');
    const bodyText = (await page.locator('body').textContent())?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('brisbane edition');
    expect(bodyText).not.toContain('jagera');
    expect(bodyText).not.toContain('turrbal');
  });
});
