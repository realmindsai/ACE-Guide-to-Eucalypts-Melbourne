// src/utils/url.ts
// Prepends the Astro base path so internal links work on GitHub Pages.
// Handles whether BASE_URL has a trailing slash or not.
const base = import.meta.env.BASE_URL.replace(/\/$/, ''); // strip trailing slash

export const url = (path: string) =>
  `${base}/${path.replace(/^\//, '')}`;
