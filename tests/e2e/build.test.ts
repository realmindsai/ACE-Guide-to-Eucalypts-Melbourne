import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';

// Build is handled by playwright.config.ts webServer — no need to build here
test.describe('Build output', () => {
  test('generates index.html', () => {
    expect(existsSync('dist/index.html')).toBe(true);
  });

  test('generates species index', () => {
    expect(existsSync('dist/species/index.html')).toBe(true);
  });

  test('generates species pages', () => {
    expect(existsSync('dist/species/messmate-stringybark/index.html')).toBe(true);
    expect(existsSync('dist/species/manna-gum/index.html')).toBe(true);
  });

  test('generates content pages', () => {
    expect(existsSync('dist/about/index.html')).toBe(true);
    expect(existsSync('dist/authors/index.html')).toBe(true);
    expect(existsSync('dist/identify/index.html')).toBe(true);
    expect(existsSync('dist/buy/index.html')).toBe(true);
  });

  test('generates 404 page', () => {
    expect(existsSync('dist/404.html')).toBe(true);
  });

  test('generates sitemap', () => {
    expect(existsSync('dist/sitemap-index.xml')).toBe(true);
  });

  test('includes robots.txt', () => {
    expect(existsSync('dist/robots.txt')).toBe(true);
  });
});
