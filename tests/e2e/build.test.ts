import { test, expect } from '@playwright/test';
import { existsSync } from 'fs';

// Build is handled by playwright.config.ts webServer — no need to build here
test.describe('Build output', () => {
  test('generates index.html', () => {
    expect(existsSync('dist/index.html')).toBe(true);
  });

  test('generates content pages', () => {
    expect(existsSync('dist/about/index.html')).toBe(true);
    expect(existsSync('dist/authors/index.html')).toBe(true);
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

  test('does not generate removed pages', () => {
    expect(existsSync('dist/identify/index.html')).toBe(false);
    expect(existsSync('dist/species/index.html')).toBe(false);
    expect(existsSync('dist/brisbane/index.html')).toBe(false);
  });
});
