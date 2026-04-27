import { test, expect } from '@playwright/test';

test.describe('Walks page', () => {
  test('renders hero, sections, and images', async ({ page }) => {
    const response = await page.goto('/walks/');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toHaveText('Walks with Vicky');

    for (const heading of [
      'Why these walks',
      "What you'll learn",
      'A sample walk: Pound Bend',
      'Locations',
      'Practicalities',
      'Who these walks are for',
      'About Vicky',
      'What people say',
      'Booking enquiries',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }

    await expect(page.locator('img[alt*="listening"]').first()).toBeVisible();
    await expect(page.locator('img[alt*="walking"]').first()).toBeVisible();
    await expect(page.locator('img[alt*="Vicky Shukuroglou"]').first()).toBeVisible();
  });

  test('enquiry form is Netlify-attributed and has required fields', async ({ page }) => {
    await page.goto('/walks/');
    const form = page.locator('form[name="walk-enquiry"]');
    await expect(form).toHaveAttribute('data-netlify', 'true');
    await expect(form).toHaveAttribute('netlify-honeypot', 'bot-field');
    await expect(form).toHaveAttribute('action', '/walks/thanks/');

    await expect(form.locator('input[name="name"]')).toHaveAttribute('required', '');
    await expect(form.locator('input[name="email"]')).toHaveAttribute('required', '');
    await expect(form.locator('input[name="email"]')).toHaveAttribute('type', 'email');
  });

  test('submitting empty form does not navigate to thanks', async ({ page }) => {
    await page.goto('/walks/');
    await page.locator('form[name="walk-enquiry"] button[type="submit"]').click();
    await expect(page).toHaveURL(/\/walks\/$/);
  });

  test('thanks page is reachable and has correct content', async ({ page }) => {
    const response = await page.goto('/walks/thanks/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Thanks');
  });

  test('home page walks band links to /walks/', async ({ page }) => {
    await page.goto('/');
    const bandLink = page.locator('.walks-band a.buy-button');
    await expect(bandLink).toBeVisible();
    await expect(bandLink).toHaveAttribute('href', '/walks/');
  });

  test('old /melbourne/ URL still works', async ({ page }) => {
    const response = await page.goto('/melbourne/');
    expect(response?.status()).toBe(200);
  });
});
