import { test, expect } from '@playwright/test';

test.describe('Schema.org JSON-LD', () => {
  test('home page has Book and BreadcrumbList schema', async ({ page }) => {
    await page.goto('/');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = schemas.map(s => JSON.parse(s)['@type']);
    expect(types).toContain('BreadcrumbList');
    expect(types).toContain('Book');
  });

  test('species page has Article schema with speakable', async ({ page }) => {
    await page.goto('/species/messmate-stringybark/');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const article = schemas.map(s => JSON.parse(s)).find(s => s['@type'] === 'Article');
    expect(article).toBeTruthy();
    expect(article.speakable).toBeTruthy();
    expect(article.headline).toContain('Messmate Stringybark');
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

  test('identify page has HowTo schema', async ({ page }) => {
    await page.goto('/identify/');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const types = schemas.map(s => JSON.parse(s)['@type']);
    expect(types).toContain('HowTo');
  });

  test('buy page has Book schema with offers', async ({ page }) => {
    await page.goto('/buy/');
    const schemas = await page.locator('script[type="application/ld+json"]').allTextContents();
    const book = schemas.map(s => JSON.parse(s)).find(s => s['@type'] === 'Book');
    expect(book).toBeTruthy();
    expect(book.offers).toBeTruthy();
    expect(book.isbn).toBe('9780645232615');
  });
});
