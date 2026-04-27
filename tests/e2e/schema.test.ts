import { test, expect } from '@playwright/test';

test.describe('Schema.org JSON-LD', () => {
  test('home page has WebSite and BreadcrumbList schema', async ({ page }) => {
    await page.goto('/');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = schemas.map(s => JSON.parse(s)['@type']);
    expect(types).toContain('BreadcrumbList');
    expect(types).toContain('WebSite');
  });

  test('authors page has Person schema', async ({ page }) => {
    await page.goto('/authors/');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = schemas.flatMap(s => {
      const obj = JSON.parse(s);
      return Array.isArray(obj) ? obj : [obj];
    });
    const persons = parsed.filter(s => s['@type'] === 'Person');
    expect(persons.length).toBeGreaterThanOrEqual(2);
  });

  test('buy page has Book schema with Stripe offer', async ({ page }) => {
    await page.goto('/buy/');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const book = schemas.map(s => JSON.parse(s)).find(s => s['@type'] === 'Book');
    expect(book).toBeTruthy();
    expect(book.offers).toBeTruthy();
    expect(book.offers.url).toContain('stripe.com');
    expect(book.isbn).toBe('9780645232615');
  });

  test('walks page exposes Service schema', async ({ page }) => {
    await page.goto('/walks/');
    const scripts = await page.locator('script[type="application/ld+json"]').allTextContents();
    const parsed = scripts.map(s => JSON.parse(s));
    const service = parsed.find(s => s['@type'] === 'Service');
    expect(service).toBeDefined();
    expect(service.name).toBe('Guided Eucalypt Walks');
    expect(service.provider.name).toBe('Vicky Shukuroglou');
    expect(service.offers.price).toBe('500');
  });
});
