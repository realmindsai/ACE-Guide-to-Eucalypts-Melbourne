> **Note (2026-04-23):** Brisbane content has been removed from the live site.
> This document is preserved as a historical record of the original dual-book design.
> For the current single-book design, see
> `docs/superpowers/specs/2026-04-23-remove-brisbane-content-design.md`.

---

# ACE Guide to Eucalypts Melbourne — Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a static Astro website for the *ACE Guide to Eucalypts Melbourne* book that sells the book, showcases 5-8 sample species, and is optimised for generative AI search citation.

**Architecture:** Static site built with Astro, using Content Collections for species data, CSS custom properties for the design system, and JSON-LD for schema markup. No JavaScript shipped to the client (except ~1KB analytics). All content in markdown with frontmatter. Deployed to Netlify or Cloudflare Pages.

**Tech Stack:** Astro 5.x, CSS custom properties (no preprocessor), Google Fonts (Fraunces + Source Sans 3), Plausible Analytics, Playwright for e2e tests, JSON-LD for Schema.org markup.

**Spec:** `docs/superpowers/specs/2026-04-06-ace-eucalypts-website-design.md`

**Important — placeholder content:** Real photography and copy will be supplied by the book's authors later. This build creates the complete structure with placeholder images (solid colour blocks with alt text overlaid) and realistic placeholder text. Every placeholder is clearly marked with `<!-- PLACEHOLDER: description of what goes here -->` comments so content can be swapped in without touching structure.

---

## File Map

Every file created or modified in this plan, grouped by responsibility:

### Configuration
| File | Responsibility |
|---|---|
| `package.json` | Dependencies and scripts |
| `astro.config.mjs` | Astro config: site URL, integrations, sitemap |
| `tsconfig.json` | TypeScript config (Astro default) |
| `.gitignore` | Standard Astro gitignore |
| `netlify.toml` | Netlify deploy config (build command, publish dir) |

### Design System
| File | Responsibility |
|---|---|
| `src/styles/tokens.css` | All CSS custom properties (colours, type, spacing) |
| `src/styles/global.css` | Reset, base element styles, utility classes |
| `src/styles/presets/field-companion.css` | Default tone preset overrides (minimal — base tokens are tuned for this) |

### Layouts
| File | Responsibility |
|---|---|
| `src/layouts/Base.astro` | HTML shell: `<head>` (fonts, meta, OG, schema JSON-LD), `<nav>`, `<footer>`, Plausible script |
| `src/layouts/Species.astro` | Extends Base. Species page structure: hero, ID panel, gallery, CTA |
| `src/layouts/Page.astro` | Extends Base. Generic content page with `<article>` wrapper at `--content-width` |

### Components
| File | Responsibility |
|---|---|
| `src/components/Nav.astro` | Six-link nav bar, logo/home link, mobile wrap |
| `src/components/Footer.astro` | Buy links, copyright, Eucalypt Australia credit |
| `src/components/Hero.astro` | Full-bleed image with overlay text and optional CTA button |
| `src/components/SpeciesCard.astro` | Card for species index: photo, common name, scientific name, group tag |
| `src/components/BuyButton.astro` | Terracotta CTA button with configurable text and href |
| `src/components/Endorsement.astro` | Pull quote with attribution (name + credential) |
| `src/components/PhotoGallery.astro` | CSS grid of `<figure>` elements with `<figcaption>` |
| `src/components/AcknowledgmentOfCountry.astro` | Structural AoC block with proper semantic markup |
| `src/components/IdentificationPanel.astro` | Structured data card: bark, leaf, height, flowering, locations |
| `src/components/AuthorCard.astro` | Portrait + name + short bio + link to full bio |
| `src/components/SchemaMarkup.astro` | JSON-LD `<script>` generator for Book, Article, Person, HowTo, BreadcrumbList |

### Content Collections
| File | Responsibility |
|---|---|
| `src/content.config.ts` | Zod schemas for `species` and `endorsements` collections |
| `src/content/species/messmate-stringybark/index.md` | Placeholder species 1 (stringybark group) |
| `src/content/species/manna-gum/index.md` | Placeholder species 2 (gum group) |
| `src/content/species/red-box/index.md` | Placeholder species 3 (box group) |
| `src/content/species/narrow-leaf-peppermint/index.md` | Placeholder species 4 (peppermint group) |
| `src/content/species/red-ironbark/index.md` | Placeholder species 5 (ironbark group) |
| `src/content/species/*/images/` | Placeholder images per species (generated SVGs) |
| `src/content/endorsements/pascoe.md` | Placeholder endorsement 1 |
| `src/content/endorsements/eucalypt-australia.md` | Placeholder endorsement 2 |

### Pages
| File | Responsibility |
|---|---|
| `src/pages/index.astro` | Home: hero, problem/promise, teaser strip, about, endorsements, authors, AoC |
| `src/pages/species/index.astro` | Species index: card grid of all published species |
| `src/pages/species/[slug].astro` | Dynamic species page using Species layout |
| `src/pages/about.astro` | About the Book |
| `src/pages/authors.astro` | Author bios with Person schema |
| `src/pages/identify.astro` | Identification Tips with HowTo schema |
| `src/pages/buy.astro` | Buy page with retailer links and Book schema |
| `src/pages/404.astro` | Branded 404 |

### Static Assets
| File | Responsibility |
|---|---|
| `public/robots.txt` | Welcome all crawlers including AI bots |
| `public/favicon.svg` | SVG favicon (eucalypt leaf motif) |
| `public/apple-touch-icon.png` | 180x180 iOS icon |
| `public/site.webmanifest` | Web app manifest |
| `public/images/book/cover-placeholder.svg` | Placeholder book cover |
| `public/images/authors/vicky-placeholder.svg` | Placeholder portrait |
| `public/images/authors/rod-placeholder.svg` | Placeholder portrait |

### Tests
| File | Responsibility |
|---|---|
| `tests/e2e/build.test.ts` | Astro build succeeds, outputs expected pages |
| `tests/e2e/a11y.test.ts` | Axe-core accessibility audit on all pages |
| `tests/e2e/schema.test.ts` | JSON-LD schema markup present and valid on each page type |
| `tests/e2e/navigation.test.ts` | All nav links work, species cards link correctly |
| `tests/e2e/responsive.test.ts` | Key layouts render correctly at mobile/tablet/desktop |
| `tests/unit/content-schema.test.ts` | Zod schema validation: valid and invalid frontmatter |
| `tests/integration/content-loading.test.ts` | Content collections load all species and endorsements |
| `playwright.config.ts` | Playwright config for e2e tests against Astro preview server |

---

## Chunk 1: Foundation

Scaffold the project, install dependencies, set up the design system, base layout, and 404 page. After this chunk, you can run `npm run dev` and see a styled page with nav and footer.

### Task 1: Scaffold Astro Project

**Files:**
- Create: `package.json`
- Create: `astro.config.mjs`
- Create: `tsconfig.json`
- Create: `.gitignore`

- [ ] **Step 1: Initialise the project**

```bash
cd /Users/dewoller/code/people/Vicky-Shukuroglou-ACE-Guide-to-Eucalypts-Melbourne
npm create astro@latest . -- --template minimal --no-install --typescript strict
```

Accept defaults. If it asks about overwriting, allow it — directory is empty except for `docs/`.

- [ ] **Step 2: Install dependencies**

```bash
npm install
npm install -D @astrojs/sitemap playwright @playwright/test @axe-core/playwright
```

- [ ] **Step 3: Configure Astro**

Replace `astro.config.mjs` with:

```javascript
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://ace-eucalypts-melbourne.com.au', // Update when domain is secured
  integrations: [sitemap()],
  build: {
    inlineStylesheets: 'auto',
  },
});
```

- [ ] **Step 4: Create Netlify config**

Create `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"

[[headers]]
  for = "/_astro/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"

[[headers]]
  for = "*.svg"
  [headers.values]
    Cache-Control = "public, max-age=86400"
```

- [ ] **Step 5: Verify build runs**

```bash
npm run build
```

Expected: Build succeeds with default Astro minimal template output.

- [ ] **Step 6: Initialise git and commit**

```bash
git init
git add -A
git commit -m "feat: scaffold Astro project with sitemap and Netlify config"
```

---

### Task 2: Design Tokens and Global CSS

**Files:**
- Create: `src/styles/tokens.css`
- Create: `src/styles/global.css`
- Create: `src/styles/presets/field-companion.css`

- [ ] **Step 1: Create tokens.css**

```css
/* src/styles/tokens.css
   Design tokens for ACE Guide to Eucalypts Melbourne.
   Base values are tuned for the "Field Companion" preset.
   See spec Section 2 for colour rationale and WCAG compliance notes.
*/
:root {
  /* Earth layer (primary) */
  --color-bg:             #F5F0EB;
  --color-text:           #2C2C2A;
  --color-text-secondary: #6B6560;

  /* Canopy layer (accent) — see spec for usage constraints */
  --color-green:          #4D6A4F;  /* Large text / headings only against bg (3.1:1) */
  --color-olive:          #7A6F3A;  /* Decorative use preferred (4.5:1) */

  /* Signal layer (functional) */
  --color-cta:            #A8532E;  /* AA compliant against bg (4.71:1); button text uses --color-bg */
  --color-cta-hover:      #8C4425;

  /* Typography */
  --font-heading:         'Fraunces', serif;
  --font-body:            'Source Sans 3', sans-serif;
  --font-size-base:       1.125rem; /* Applied to body, not html — rem stays 16px-based */
  --line-height-body:     1.65;
  --line-height-heading:  1.2;

  /* Spacing */
  --space-xs:  0.5rem;
  --space-sm:  1rem;
  --space-md:  2rem;
  --space-lg:  4rem;
  --space-xl:  6rem;

  /* Layout */
  --content-width:  45rem;
  --wide-width:     72rem;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

- [ ] **Step 2: Create global.css**

```css
/* src/styles/global.css
   Base element styles. No component styles here — those live in .astro files.
*/
@import './tokens.css';
@import './presets/field-companion.css';

/* Reset */
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html {
  /* Do NOT set font-size here — keep 16px default for rem calculations */
  -webkit-text-size-adjust: 100%;
}

body {
  font-family: var(--font-body);
  font-size: var(--font-size-base);
  line-height: var(--line-height-body);
  color: var(--color-text);
  background-color: var(--color-bg);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

h1, h2, h3, h4 {
  font-family: var(--font-heading);
  line-height: var(--line-height-heading);
  color: var(--color-text);
}

h1 { font-size: 2.5rem; }
h2 { font-size: 1.75rem; }
h3 { font-size: 1.375rem; }
h4 { font-size: 1.125rem; }

a {
  color: var(--color-cta);
  text-decoration-thickness: 1px;
  text-underline-offset: 0.15em;
  transition: color 150ms ease;
}

a:hover {
  color: var(--color-cta-hover);
}

img {
  max-width: 100%;
  height: auto;
  display: block;
}

/* Scientific names — italic serif, always */
.scientific-name {
  font-family: var(--font-heading);
  font-style: italic;
}

/* Content container */
.content-width {
  max-width: var(--content-width);
  margin-inline: auto;
  padding-inline: var(--space-sm);
}

.wide-width {
  max-width: var(--wide-width);
  margin-inline: auto;
  padding-inline: var(--space-sm);
}

/* Section spacing */
.section {
  padding-block: var(--space-lg);
}

/* Visually hidden but accessible */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

- [ ] **Step 3: Create field-companion.css preset**

```css
/* src/styles/presets/field-companion.css
   "Field Companion" — the default tone preset.
   Warm & Inviting. Generous with context.
   Base tokens.css is already tuned for this preset; this file contains only
   the overrides that distinguish Field Companion from neutral.
*/
:root {
  --color-bg: #F7F2EC; /* Slightly warmer than base — toward cream */
  --line-height-body: 1.7;
}
```

- [ ] **Step 4: Commit**

```bash
git add src/styles/
git commit -m "feat: add design system — tokens, global styles, Field Companion preset"
```

---

### Task 3: Base Layout with Nav and Footer

**Files:**
- Create: `src/layouts/Base.astro`
- Create: `src/components/Nav.astro`
- Create: `src/components/Footer.astro`

- [ ] **Step 1: Create Nav component**

```astro
---
// src/components/Nav.astro
const navLinks = [
  { href: '/', label: 'Home' },
  { href: '/species/', label: 'Species' },
  { href: '/identify/', label: 'Identify' },
  { href: '/about/', label: 'About' },
  { href: '/authors/', label: 'Authors' },
  { href: '/buy/', label: 'Buy' },
];

const currentPath = Astro.url.pathname;

function isActive(linkHref: string, current: string): boolean {
  if (linkHref === '/') return current === '/';
  return current === linkHref || current.startsWith(linkHref);
}
---

<nav aria-label="Main navigation">
  <div class="nav-inner wide-width">
    <a href="/" class="nav-logo" aria-label="ACE Guide to Eucalypts Melbourne — Home">
      ACE Eucalypts Melbourne
    </a>
    <ul class="nav-links" role="list">
      {navLinks.map(link => (
        <li>
          <a
            href={link.href}
            aria-current={isActive(link.href, currentPath) ? 'page' : undefined}
          >
            {link.label}
          </a>
        </li>
      ))}
    </ul>
  </div>
</nav>

<style>
  nav {
    border-bottom: 1px solid var(--color-olive);
    padding-block: var(--space-sm);
  }

  .nav-inner {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: var(--space-sm) var(--space-md);
  }

  .nav-logo {
    font-family: var(--font-heading);
    font-size: 1.25rem;
    color: var(--color-text);
    text-decoration: none;
  }

  .nav-links {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs) var(--space-sm);
    list-style: none;
  }

  .nav-links a {
    color: var(--color-text-secondary);
    text-decoration: none;
    padding: var(--space-xs);
    min-height: 44px;
    min-width: 44px;
    display: inline-flex;
    align-items: center;
  }

  .nav-links a:hover {
    color: var(--color-cta);
  }

  .nav-links a[aria-current='page'] {
    color: var(--color-text);
    font-weight: 600;
  }
</style>
```

- [ ] **Step 2: Create Footer component**

```astro
---
// src/components/Footer.astro
const retailers = [
  { name: 'Australian Koala Foundation', href: 'https://savethekoala.com/shop/products/book-ace-guide-to-eucalypts/' },
  { name: 'Booktopia', href: '#' },
  { name: 'Dymocks', href: '#' },
  { name: 'Amazon AU', href: '#' },
  { name: 'Fishpond', href: '#' },
];

const currentYear = new Date().getFullYear();
---

<footer>
  <div class="footer-inner content-width">
    <div class="footer-buy">
      <h2>Get the Book</h2>
      <ul role="list">
        {retailers.map(r => (
          <li><a href={r.href} target="_blank" rel="noopener">{r.name}</a></li>
        ))}
      </ul>
      <p class="footer-indie">Or ask your local bookshop.</p>
    </div>

    <div class="footer-meta">
      <p>&copy; {currentYear} Vicky Shukuroglou &amp; Roderick Fensham. All rights reserved.</p>
      <p>
        Supported by <a href="https://eucalyptaustralia.org.au/" target="_blank" rel="noopener">Eucalypt Australia</a>
        through the Dahl Fellowship.
      </p>
      <p>Photography by Vicky Shukuroglou.</p>
    </div>
  </div>
</footer>

<style>
  footer {
    border-top: 1px solid var(--color-olive);
    padding-block: var(--space-lg);
    margin-top: var(--space-xl);
  }

  .footer-inner {
    display: grid;
    gap: var(--space-md);
  }

  .footer-buy h2 {
    font-size: 1.125rem;
    margin-bottom: var(--space-xs);
  }

  .footer-buy ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs) var(--space-sm);
  }

  .footer-buy a {
    font-size: 0.9rem;
  }

  .footer-indie {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
    margin-top: var(--space-xs);
  }

  .footer-meta {
    font-size: 0.875rem;
    color: var(--color-text-secondary);
  }

  .footer-meta p + p {
    margin-top: var(--space-xs);
  }
</style>
```

- [ ] **Step 3: Create Base layout**

```astro
---
// src/layouts/Base.astro
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  schemaJson?: object | object[];
  breadcrumbs?: { name: string; href: string }[];
}

const {
  title,
  description,
  ogImage = '/images/book/cover-placeholder.svg',
  schemaJson,
  breadcrumbs = [],
} = Astro.props;

const canonicalUrl = new URL(Astro.url.pathname, Astro.site);

const breadcrumbSchema = {
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: [
    { '@type': 'ListItem', position: 1, name: 'Home', item: new URL('/', Astro.site).toString() },
    ...breadcrumbs.map((b, i) => ({
      '@type': 'ListItem',
      position: i + 2,
      name: b.name,
      item: new URL(b.href, Astro.site).toString(),
    })),
  ],
};

const allSchemas = [
  breadcrumbSchema,
  ...(Array.isArray(schemaJson) ? schemaJson : schemaJson ? [schemaJson] : []),
];
---

<!doctype html>
<html lang="en-AU">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonicalUrl} />

  <!-- Favicon -->
  <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/site.webmanifest" />

  <!-- Fonts — preconnect + swap for performance -->
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link
    href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,600;0,9..144,700;1,9..144,400&family=Source+Sans+3:wght@400;600&display=swap"
    rel="stylesheet"
  />

  <!-- Open Graph -->
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={new URL(ogImage, Astro.site)} />
  <meta property="og:url" content={canonicalUrl} />
  <meta property="og:type" content="website" />
  <meta property="og:locale" content="en_AU" />

  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={new URL(ogImage, Astro.site)} />

  <!-- Schema.org JSON-LD -->
  {allSchemas.map(schema => (
    <script type="application/ld+json" set:html={JSON.stringify(schema)} />
  ))}

  <!-- Analytics — Plausible (privacy-respecting, no cookies) -->
  <!-- PLACEHOLDER: Replace data-domain with actual domain when secured -->
  <script defer data-domain="ace-eucalypts-melbourne.com.au" src="https://plausible.io/js/script.outbound-links.js"></script>
</head>
<body>
  <Nav />
  <main id="main-content">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

- [ ] **Step 4: Create a minimal index page to test the layout**

Replace `src/pages/index.astro` with:

```astro
---
// src/pages/index.astro — temporary, will be replaced in Task 8
import Base from '../layouts/Base.astro';
---

<Base
  title="ACE Guide to Eucalypts Melbourne — Identify Melbourne's Indigenous Eucalypts"
  description="An identification guide to Melbourne's 33 indigenous eucalypt species by Vicky Shukuroglou and Rod Fensham."
>
  <section class="section">
    <div class="content-width">
      <h1>ACE Guide to Eucalypts Melbourne</h1>
      <p>Site under construction. Layout and design system working.</p>
    </div>
  </section>
</Base>
```

- [ ] **Step 5: Verify dev server shows styled page with nav and footer**

```bash
npm run dev
```

Check: page loads at localhost:4321, nav shows 6 links, footer shows retailers, fonts load, background is warm off-white.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/ src/components/Nav.astro src/components/Footer.astro src/pages/index.astro
git commit -m "feat: add Base layout with nav, footer, meta tags, and schema markup"
```

---

### Task 4: Static Assets and 404 Page

**Files:**
- Create: `public/robots.txt`
- Create: `public/favicon.svg`
- Create: `public/site.webmanifest`
- Create: `public/images/book/cover-placeholder.svg`
- Create: `public/images/authors/vicky-placeholder.svg`
- Create: `public/images/authors/rod-placeholder.svg`
- Create: `src/pages/404.astro`

- [ ] **Step 1: Create robots.txt**

```
# public/robots.txt
# Welcome all crawlers — including AI search bots
User-agent: *
Allow: /

Sitemap: https://ace-eucalypts-melbourne.com.au/sitemap-index.xml
```

- [ ] **Step 2: Create favicon.svg**

A simple eucalypt leaf silhouette in the green accent colour:

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <path d="M16 2C12 8 6 14 6 20c0 6 4 10 10 10s10-4 10-10C26 14 20 8 16 2z" fill="#4D6A4F"/>
  <path d="M16 8v18" stroke="#F5F0EB" stroke-width="1.5" fill="none"/>
</svg>
```

- [ ] **Step 3: Create site.webmanifest**

```json
{
  "name": "ACE Guide to Eucalypts Melbourne",
  "short_name": "ACE Eucalypts",
  "icons": [
    {
      "src": "/apple-touch-icon.png",
      "sizes": "180x180",
      "type": "image/png"
    }
  ],
  "theme_color": "#F5F0EB",
  "background_color": "#F5F0EB",
  "display": "browser"
}
```

- [ ] **Step 4: Create placeholder SVG images**

These are simple coloured rectangles with text labels. They exist so every `<img>` tag has a valid `src` during development. Create three files:

`public/images/book/cover-placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600" width="400" height="600">
  <rect width="400" height="600" fill="#4D6A4F"/>
  <text x="200" y="300" text-anchor="middle" fill="#F5F0EB" font-family="serif" font-size="20">Book Cover Placeholder</text>
</svg>
```

`public/images/authors/vicky-placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" fill="#6B6560"/>
  <text x="150" y="150" text-anchor="middle" fill="#F5F0EB" font-family="sans-serif" font-size="16">Vicky Shukuroglou</text>
</svg>
```

`public/images/authors/rod-placeholder.svg`:
```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" width="300" height="300">
  <rect width="300" height="300" fill="#6B6560"/>
  <text x="150" y="150" text-anchor="middle" fill="#F5F0EB" font-family="sans-serif" font-size="16">Rod Fensham</text>
</svg>
```

- [ ] **Step 5: Create apple-touch-icon.png**

Generate a 180x180 PNG from the favicon SVG:

```bash
# If ImageMagick is available:
convert -background none -size 180x180 public/favicon.svg public/apple-touch-icon.png
# Otherwise, create a simple placeholder:
# We'll use a green square PNG as a fallback — replace with proper icon later
```

If `convert` isn't available, create a simple placeholder script:

```bash
python3 -c "
import struct, zlib
# 180x180 solid green PNG
w, h = 180, 180
def chunk(t, d): return struct.pack('>I',len(d)) + t + d + struct.pack('>I',zlib.crc32(t+d)&0xffffffff)
raw = b''.join(b'\x00' + bytes([77,106,79])*w for _ in range(h))
with open('public/apple-touch-icon.png','wb') as f:
    f.write(b'\x89PNG\r\n\x1a\n')
    f.write(chunk(b'IHDR', struct.pack('>IIBBBBB',w,h,8,2,0,0,0)))
    f.write(chunk(b'IDAT', zlib.compress(raw)))
    f.write(chunk(b'IEND', b''))
"
```

- [ ] **Step 6: Create 404 page**

```astro
---
// src/pages/404.astro
import Base from '../layouts/Base.astro';
---

<Base
  title="Page Not Found — ACE Guide to Eucalypts Melbourne"
  description="This page doesn't exist. Find your way back to Melbourne's eucalypts."
>
  <section class="not-found section">
    <div class="content-width">
      <h1>This tree doesn't grow here.</h1>
      <p>The page you're looking for doesn't exist. Try browsing the <a href="/species/">species index</a> or head <a href="/">home</a>.</p>
    </div>
  </section>
</Base>

<style>
  .not-found {
    text-align: center;
    padding-block: var(--space-xl);
  }

  .not-found h1 {
    margin-bottom: var(--space-sm);
  }
</style>
```

- [ ] **Step 7: Verify 404 page renders**

```bash
npm run dev
# Visit http://localhost:4321/nonexistent-page
```

Expected: 404 page with styled nav, footer, and "This tree doesn't grow here" message.

- [ ] **Step 8: Commit**

```bash
git add public/ src/pages/404.astro
git commit -m "feat: add static assets (favicon, manifest, robots.txt) and 404 page"
```

---

### Task 5: Page Layout

**Files:**
- Create: `src/layouts/Page.astro`

- [ ] **Step 1: Create generic page layout**

```astro
---
// src/layouts/Page.astro
// Generic content page layout — wraps content in an article at content-width.
import Base from './Base.astro';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  schemaJson?: object | object[];
  breadcrumbs?: { name: string; href: string }[];
}

const props = Astro.props;
---

<Base {...props}>
  <article class="page section">
    <div class="content-width">
      <slot />
    </div>
  </article>
</Base>
```

- [ ] **Step 2: Commit**

```bash
git add src/layouts/Page.astro
git commit -m "feat: add Page layout for generic content pages"
```

---

## Chunk 2: Reusable Components

Build all shared components. After this chunk, every building block exists and can be composed into pages.

### Task 6: Core UI Components

**Files:**
- Create: `src/components/Hero.astro`
- Create: `src/components/BuyButton.astro`
- Create: `src/components/Endorsement.astro`
- Create: `src/components/AcknowledgmentOfCountry.astro`
- Create: `src/components/AuthorCard.astro`

- [ ] **Step 1: Create Hero component**

```astro
---
// src/components/Hero.astro
// Full-bleed hero image with overlaid title, subtitle, and optional CTA.
import BuyButton from './BuyButton.astro';

interface Props {
  imageSrc: string;
  imageAlt: string;
  title: string;
  subtitle?: string;
  ctaText?: string;
  ctaHref?: string;
}

const { imageSrc, imageAlt, title, subtitle, ctaText, ctaHref } = Astro.props;
---

<section class="hero" aria-label="Page hero">
  <div class="hero-image-wrap">
    <img src={imageSrc} alt={imageAlt} loading="eager" fetchpriority="high" />
  </div>
  <div class="hero-content content-width">
    <h1>{title}</h1>
    {subtitle && <p class="hero-subtitle">{subtitle}</p>}
    {ctaText && ctaHref && <BuyButton text={ctaText} href={ctaHref} />}
  </div>
</section>

<style>
  .hero {
    position: relative;
    min-height: 60vh;
    display: flex;
    align-items: flex-end;
    overflow: hidden;
  }

  .hero-image-wrap {
    position: absolute;
    inset: 0;
    z-index: 0;
  }

  .hero-image-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-content {
    position: relative;
    z-index: 1;
    padding-block: var(--space-lg);
    /* Semi-transparent overlay for text readability */
    background: linear-gradient(to top, rgba(44, 44, 42, 0.7), transparent);
    width: 100%;
    max-width: none;
    padding-inline: var(--space-md);
  }

  .hero h1 {
    color: var(--color-bg);
    font-size: clamp(2rem, 5vw, 3.5rem);
  }

  .hero-subtitle {
    color: var(--color-bg);
    font-size: 1.25rem;
    margin-top: var(--space-xs);
    max-width: var(--content-width);
  }

  .hero :global(.buy-button) {
    margin-top: var(--space-sm);
  }
</style>
```

- [ ] **Step 2: Create BuyButton component**

```astro
---
// src/components/BuyButton.astro
// Terracotta CTA button. Used on every page.
interface Props {
  text?: string;
  href?: string;
  external?: boolean;
}

const { text = 'Get the Guide', href = '/buy/', external = false } = Astro.props;
---

<a
  class="buy-button"
  href={href}
  {...(external ? { target: '_blank', rel: 'noopener' } : {})}
>
  {text}
</a>

<style>
  .buy-button {
    display: inline-block;
    background-color: var(--color-cta);
    color: var(--color-bg);
    font-family: var(--font-body);
    font-size: 1rem;
    font-weight: 600;
    text-decoration: none;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    min-height: 44px;
    min-width: 44px;
    transition: background-color 150ms ease;
  }

  .buy-button:hover {
    background-color: var(--color-cta-hover);
    color: var(--color-bg);
  }
</style>
```

- [ ] **Step 3: Create Endorsement component**

```astro
---
// src/components/Endorsement.astro
interface Props {
  quote: string;
  name: string;
  credential: string;
}

const { quote, name, credential } = Astro.props;
---

<blockquote class="endorsement">
  <p>{quote}</p>
  <footer>
    <cite>&mdash; {name}, {credential}</cite>
  </footer>
</blockquote>

<style>
  .endorsement {
    border-left: 3px solid var(--color-olive);
    padding-left: var(--space-sm);
    margin-block: var(--space-md);
  }

  .endorsement p {
    font-family: var(--font-heading);
    font-size: 1.125rem;
    font-style: italic;
    color: var(--color-text);
  }

  .endorsement cite {
    display: block;
    margin-top: var(--space-xs);
    font-style: normal;
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }
</style>
```

- [ ] **Step 4: Create AcknowledgmentOfCountry component**

```astro
---
// src/components/AcknowledgmentOfCountry.astro
// Structural, prominent — not a footer afterthought. See spec Section 5.3.
---

<section class="acknowledgment-of-country section" aria-label="Acknowledgment of Country">
  <div class="content-width">
    <h2>Acknowledgment of Country</h2>
    <!-- PLACEHOLDER: Replace with project-specific Acknowledgment of Country text
         written for this project, naming Wurundjeri Woi-wurrung and Bunurong/Boon Wurrung
         peoples specifically. Should be reviewed by relevant Traditional Owner groups. -->
    <p>
      The eucalypts in this guide grow on the lands of the Wurundjeri Woi-wurrung and
      Bunurong/Boon Wurrung peoples of the Eastern Kulin Nation. These trees have been
      known, named, and cared for by Aboriginal people for tens of thousands of years.
      We pay our respects to Elders past, present, and emerging, and acknowledge that
      sovereignty was never ceded.
    </p>
  </div>
</section>

<style>
  .acknowledgment-of-country {
    border-top: 1px solid var(--color-olive);
    padding-block: var(--space-lg);
  }

  .acknowledgment-of-country h2 {
    font-size: 1.25rem;
    margin-bottom: var(--space-sm);
    color: var(--color-green);
  }

  .acknowledgment-of-country p {
    max-width: var(--content-width);
    color: var(--color-text-secondary);
    line-height: 1.8;
  }
</style>
```

- [ ] **Step 5: Create AuthorCard component**

```astro
---
// src/components/AuthorCard.astro
interface Props {
  name: string;
  role: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

const { name, role, imageSrc, imageAlt, href } = Astro.props;
---

<a class="author-card" href={href}>
  <img src={imageSrc} alt={imageAlt} loading="lazy" width="150" height="150" />
  <div>
    <h3>{name}</h3>
    <p>{role}</p>
  </div>
</a>

<style>
  .author-card {
    display: flex;
    align-items: center;
    gap: var(--space-sm);
    text-decoration: none;
    color: var(--color-text);
  }

  .author-card:hover h3 {
    color: var(--color-cta);
  }

  .author-card img {
    width: 100px;
    height: 100px;
    object-fit: cover;
    border-radius: 4px;
  }

  .author-card h3 {
    font-size: 1.125rem;
    transition: color 150ms ease;
  }

  .author-card p {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }
</style>
```

- [ ] **Step 6: Commit**

```bash
git add src/components/
git commit -m "feat: add Hero, BuyButton, Endorsement, AoC, and AuthorCard components"
```

---

### Task 7: Species-Specific Components

**Files:**
- Create: `src/components/SpeciesCard.astro`
- Create: `src/components/IdentificationPanel.astro`
- Create: `src/components/PhotoGallery.astro`

- [ ] **Step 1: Create SpeciesCard component**

```astro
---
// src/components/SpeciesCard.astro
// Used in the species index grid and home page teaser strip.
interface Props {
  commonName: string;
  scientificName: string;
  group: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

const { commonName, scientificName, group, imageSrc, imageAlt, href } = Astro.props;
---

<a class="species-card" href={href}>
  <img src={imageSrc} alt={imageAlt} loading="lazy" width="400" height="300" />
  <div class="species-card-body">
    <h3>{commonName}</h3>
    <p class="scientific-name">{scientificName}</p>
    <span class="species-group-tag">{group}</span>
  </div>
</a>

<style>
  .species-card {
    display: block;
    text-decoration: none;
    color: var(--color-text);
    border-radius: 4px;
    overflow: hidden;
    transition: box-shadow 150ms ease;
  }

  .species-card:hover {
    box-shadow: 0 2px 12px rgba(44, 44, 42, 0.1);
  }

  .species-card img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
  }

  .species-card-body {
    padding: var(--space-sm);
  }

  .species-card h3 {
    font-size: 1.125rem;
  }

  .species-group-tag {
    display: inline-block;
    font-size: 0.75rem;
    color: var(--color-text-secondary);
    border: 1px solid var(--color-olive);
    border-radius: 2px;
    padding: 0.125rem 0.5rem;
    margin-top: var(--space-xs);
    text-transform: capitalize;
  }
</style>
```

- [ ] **Step 2: Create IdentificationPanel component**

```astro
---
// src/components/IdentificationPanel.astro
// Structured data card shown on every species page.
interface Props {
  barkType: string;
  leafDescription: string;
  budFruitDescription: string;
  heightRange: string;
  floweringSeason: string;
  locations: string[];
}

const { barkType, leafDescription, budFruitDescription, heightRange, floweringSeason, locations } = Astro.props;
---

<aside class="id-panel" aria-label="Identification summary">
  <h2>Identification</h2>
  <dl>
    <dt>Bark</dt>
    <dd>{barkType}</dd>

    <dt>Leaf</dt>
    <dd>{leafDescription}</dd>

    <dt>Buds &amp; Fruit</dt>
    <dd>{budFruitDescription}</dd>

    <dt>Height</dt>
    <dd>{heightRange}</dd>

    <dt>Flowering</dt>
    <dd>{floweringSeason}</dd>

    <dt>Where to find it</dt>
    <dd>
      <ul>
        {locations.map(loc => <li>{loc}</li>)}
      </ul>
    </dd>
  </dl>
</aside>

<style>
  .id-panel {
    background-color: rgba(122, 111, 58, 0.08);
    border-left: 3px solid var(--color-olive);
    padding: var(--space-sm) var(--space-md);
    margin-block: var(--space-md);
    border-radius: 0 4px 4px 0;
  }

  .id-panel h2 {
    font-size: 1.125rem;
    margin-bottom: var(--space-sm);
  }

  .id-panel dl {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-xs) var(--space-sm);
  }

  .id-panel dt {
    font-weight: 600;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  .id-panel dd {
    font-size: 0.95rem;
  }

  .id-panel ul {
    list-style: none;
    display: flex;
    flex-wrap: wrap;
    gap: 0 var(--space-sm);
  }

  .id-panel li::before {
    content: '\2022 ';
    color: var(--color-olive);
  }

  .id-panel li:first-child::before {
    content: '';
  }
</style>
```

- [ ] **Step 3: Create PhotoGallery component**

```astro
---
// src/components/PhotoGallery.astro
// Static CSS grid of figures — no JavaScript, no lightbox.
// See spec Section 8: "gallery fully usable without JS"
interface GalleryImage {
  src: string;
  alt: string;
  caption: string;
}

interface Props {
  images: GalleryImage[];
  credit?: string;
}

const { images, credit = 'Photography by Vicky Shukuroglou' } = Astro.props;
---

<section class="photo-gallery" aria-label="Photo gallery">
  <div class="gallery-grid">
    {images.map(img => (
      <figure>
        <img src={img.src} alt={img.alt} loading="lazy" width="600" height="450" />
        <figcaption>{img.caption}</figcaption>
      </figure>
    ))}
  </div>
  {credit && <p class="gallery-credit">{credit}</p>}
</section>

<style>
  .gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-sm);
    margin-block: var(--space-md);
  }

  figure {
    margin: 0;
  }

  figure img {
    width: 100%;
    aspect-ratio: 4 / 3;
    object-fit: cover;
    border-radius: 4px;
  }

  figcaption {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin-top: var(--space-xs);
    padding-inline: 0.25rem;
  }

  .gallery-credit {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    text-align: right;
    margin-top: var(--space-xs);
  }
</style>
```

- [ ] **Step 4: Commit**

```bash
git add src/components/SpeciesCard.astro src/components/IdentificationPanel.astro src/components/PhotoGallery.astro
git commit -m "feat: add SpeciesCard, IdentificationPanel, and PhotoGallery components"
```

---

## Chunk 3: Content Collections and Species Pages

Define the content schemas, create placeholder species data, build the species page template and index.

### Task 8: Content Collection Schemas

**Files:**
- Create: `src/content.config.ts`

- [ ] **Step 1: Create content config with Zod schemas**

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const species = defineCollection({
  loader: glob({ pattern: '*/index.md', base: './src/content/species' }),
  schema: ({ image }) => z.object({
    common_name: z.string(),
    scientific_name: z.string(),
    group: z.enum(['stringybark', 'gum', 'box', 'peppermint', 'ironbark', 'ash', 'other']),
    aboriginal_name: z.string().optional(),
    aboriginal_language: z.string().optional(),
    aboriginal_attribution: z.string().optional(),
    bark_type: z.string(),
    leaf_description: z.string(),
    bud_fruit_description: z.string(),
    height_range: z.string(),
    flowering_season: z.string(),
    locations: z.array(z.string()),
    hero_image: image(),
    gallery: z.array(z.object({
      src: image(),
      alt: z.string(),
      caption: z.string(),
    })),
    featured: z.boolean().default(false),
    last_reviewed: z.string().optional(),
  }),
});

const endorsements = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/endorsements' }),
  schema: z.object({
    name: z.string(),
    credential: z.string(),
    quote: z.string(),
    featured: z.boolean().default(false),
  }),
});

export const collections = { species, endorsements };
```

**Note on Astro 5 content layer API:** We use the `glob()` loader (Astro 5) instead of the legacy `type: 'content'`. This gives us `entry.id` as the folder name (e.g., `messmate-stringybark`) and proper image resolution via `image()`. Species images are co-located with their markdown files and processed through Astro's image pipeline automatically.

- [ ] **Step 2: Verify build still passes with empty collections**

```bash
npm run build
```

Expected: Build succeeds (collections exist but have no entries yet).

- [ ] **Step 3: Commit**

```bash
git add src/content.config.ts
git commit -m "feat: add content collection schemas for species and endorsements"
```

---

### Task 9: Placeholder Species Content

**Files:**
- Create: `src/content/species/messmate-stringybark/index.md`
- Create: `src/content/species/messmate-stringybark/images/` (placeholder SVGs)
- Create: 4 more species directories with same structure

- [ ] **Step 1: Create placeholder image generator script**

Create a helper script to generate placeholder SVGs for species. Run once, then delete:

```bash
mkdir -p src/content/species/messmate-stringybark/images
mkdir -p src/content/species/manna-gum/images
mkdir -p src/content/species/red-box/images
mkdir -p src/content/species/narrow-leaf-peppermint/images
mkdir -p src/content/species/red-ironbark/images
```

For each species directory, create placeholder SVGs. Example for messmate-stringybark:

```bash
for type in hero bark leaf buds habitat; do
  cat > "src/content/species/messmate-stringybark/images/${type}.svg" << 'SVGEOF'
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600">
  <rect width="800" height="600" fill="#4D6A4F" opacity="0.3"/>
  <text x="400" y="300" text-anchor="middle" fill="#2C2C2A" font-family="serif" font-size="24">PLACEHOLDER_TEXT</text>
</svg>
SVGEOF
  # Replace PLACEHOLDER_TEXT with specific label
  sed -i '' "s/PLACEHOLDER_TEXT/Messmate Stringybark — ${type}/" "src/content/species/messmate-stringybark/images/${type}.svg"
done
```

Repeat for each species (manna-gum, red-box, narrow-leaf-peppermint, red-ironbark), changing the species name in the text.

- [ ] **Step 2: Create Messmate Stringybark content**

Create `src/content/species/messmate-stringybark/index.md`:

```markdown
---
common_name: "Messmate Stringybark"
scientific_name: "Eucalyptus obliqua"
group: "stringybark"
bark_type: "Stringybark — long fibrous strips, grey-brown, persistent to small branches"
leaf_description: "Discolorous, broad-lanceolate, 8-15cm, dark green above, paler below. Base distinctly oblique (uneven)."
bud_fruit_description: "Buds in clusters of 7-11, club-shaped. Fruit hemispherical, 7-9mm diameter."
height_range: "20-45m"
flowering_season: "January-April"
locations:
  - "Warrandyte State Park"
  - "Yarra Bend Park"
  - "Dandenong Ranges"
  - "Kinglake National Park"
hero_image: "./images/hero.svg"
gallery:
  - src: "./images/bark.svg"
    alt: "Thick fibrous stringybark peeling in long strips from trunk"
    caption: "Bark — long fibrous strips, persistent to small branches"
  - src: "./images/leaf.svg"
    alt: "Broad lanceolate leaf with distinctly oblique (uneven) base"
    caption: "Leaf — note the uneven base that gives obliqua its name"
  - src: "./images/buds.svg"
    alt: "Clusters of eucalypt buds in leaf axils"
    caption: "Buds in clusters of 7-11"
  - src: "./images/habitat.svg"
    alt: "Tall messmate stringybark trees in open forest setting"
    caption: "Messmate in open forest habitat"
featured: true
last_reviewed: "2026-04-06"
---

<!-- PLACEHOLDER: Replace with real species description written in citable, authoritative register -->

Messmate Stringybark (*Eucalyptus obliqua*) is one of Melbourne's most widespread and recognisable eucalypts. Its name comes from the distinctly oblique (uneven) leaf base — one side of the leaf extends further down the stalk than the other.

You'll find Messmate in open forests and woodlands across Melbourne's eastern and northern suburbs, particularly in parks with well-drained soils. It's a tall tree, often reaching 30 metres or more, with characteristic rough, fibrous bark that peels in long strips.

The bark is the key identification feature: thick, stringy, grey-brown, and persistent right out to the smaller branches. This distinguishes it from other stringybarks where rough bark may stop partway up the trunk.

Messmate provides critical habitat for a range of wildlife, from nesting hollows for parrots and owls to the loose bark that shelters insects and small mammals.
```

- [ ] **Step 3: Create remaining 4 species**

Create similar markdown files for:

`src/content/species/manna-gum/index.md` — group: "gum", featured: true
`src/content/species/red-box/index.md` — group: "box", featured: true
`src/content/species/narrow-leaf-peppermint/index.md` — group: "peppermint", featured: true
`src/content/species/red-ironbark/index.md` — group: "ironbark", featured: true

Each follows the same structure as Messmate but with species-appropriate data. Key details:

**Manna Gum** (*Eucalyptus viminalis*): Smooth white bark with rough stocking at base. Lanceolate leaves, 10-18cm. Buds in clusters of 3, fruit small and hemispherical. Found along waterways — Yarra River corridor, Warrandyte, Studley Park. 15-30m. Flowering Oct-Feb.

**Red Box** (*Eucalyptus polyanthemos*): Short-fibred box bark, grey, persistent. Distinctive round juvenile leaves, adult leaves ovate. Buds in clusters of 7, small rounded fruit. Dry hills — Plenty Gorge, You Yangs, Organ Pipes. 10-25m. Flowering Sep-Jan.

**Narrow-leaf Peppermint** (*Eucalyptus radiata*): Rough bark at base transitioning to smooth upper trunk. Fine, narrow leaves with peppermint scent when crushed. Buds in clusters of 11-30, very small fruit. Healesville, Yarra Ranges, Kinglake. 15-30m. Flowering Sep-Jan.

**Red Ironbark** (*Eucalyptus tricarpa*): Deeply furrowed, dark reddish-black ironbark. Hard and dense. Lanceolate leaves, 10-15cm. Buds in clusters of 3, large woody fruit 10-15mm. Drier western and northern areas — Brisbane Ranges, Lerderderg. 15-25m. Flowering Mar-Sep.

Each species markdown must include all schema fields, including `bud_fruit_description`.

- [ ] **Step 4: Create endorsement content**

Create `src/content/endorsements/pascoe.md`:

```markdown
---
name: "Bruce Pascoe"
credential: "Author of Dark Emu"
quote: "This guide invites Melburnians to truly see the remarkable trees they walk past every day — to join a conversation about Country that has been going on for millennia."
featured: true
---
```

Create `src/content/endorsements/eucalypt-australia.md`:

```markdown
---
name: "Eucalypt Australia"
credential: "Dahl Fellowship Program"
quote: "An essential resource for anyone wanting to connect with Melbourne's indigenous eucalypt heritage."
featured: true
---
```

<!-- PLACEHOLDER: Both endorsement quotes are fictional placeholders. Replace with real quotes. -->

- [ ] **Step 5: Verify build with content collections**

```bash
npm run build
```

Expected: Build succeeds, content collections are detected.

- [ ] **Step 6: Commit**

```bash
git add src/content/
git commit -m "feat: add placeholder species and endorsement content (5 species, 2 endorsements)"
```

---

### Task 10: Species Layout and Dynamic Route

**Files:**
- Create: `src/layouts/Species.astro`
- Create: `src/components/SchemaMarkup.astro`
- Create: `src/pages/species/[slug].astro`

- [ ] **Step 1: Create SchemaMarkup component**

```astro
---
// src/components/SchemaMarkup.astro
// Generates JSON-LD for various Schema.org types.
// Used by Base layout — pass the appropriate schema object per page.

// This file is intentionally empty of rendering —
// schema is passed via Base layout's schemaJson prop.
// This component exists as documentation and a factory for schema objects.

// Usage examples in page files:
//
// Book schema (home/buy pages):
// const bookSchema = {
//   '@context': 'https://schema.org',
//   '@type': 'Book',
//   name: 'ACE Guide to Eucalypts Melbourne',
//   author: [
//     { '@type': 'Person', name: 'Vicky Shukuroglou' },
//     { '@type': 'Person', name: 'Roderick Fensham' },
//   ],
//   isbn: '9780645232615',
//   publisher: { '@type': 'Organization', name: 'ACE Publishing' },
// };
//
// Article schema (species pages):
// const articleSchema = {
//   '@context': 'https://schema.org',
//   '@type': 'Article',
//   headline: 'Messmate Stringybark (Eucalyptus obliqua)',
//   author: { '@type': 'Person', name: 'Vicky Shukuroglou' },
//   datePublished: '2026-04-06',
//   speakable: {
//     '@type': 'SpeakableSpecification',
//     cssSelector: ['.species-summary'],
//   },
// };
---
<!-- SchemaMarkup is a data-only component — no HTML output. See usage notes above. -->
```

- [ ] **Step 2: Create Species layout**

```astro
---
// src/layouts/Species.astro
import { Image } from 'astro:assets';
import Base from './Base.astro';
import IdentificationPanel from '../components/IdentificationPanel.astro';
import PhotoGallery from '../components/PhotoGallery.astro';
import BuyButton from '../components/BuyButton.astro';

// Props type matches Astro 5 content layer entry shape
const { entry } = Astro.props;
const { data } = entry;

const title = `${data.common_name} (${data.scientific_name}) — ACE Guide to Eucalypts Melbourne`;
const description = `How to identify ${data.common_name} (${data.scientific_name}) in Melbourne. Bark: ${data.bark_type.split('—')[0].trim()}. Found at ${data.locations.slice(0, 2).join(', ')}.`;

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: `${data.common_name} (${data.scientific_name})`,
  author: [
    { '@type': 'Person', name: 'Vicky Shukuroglou' },
    { '@type': 'Person', name: 'Roderick Fensham' },
  ],
  datePublished: '2026-04-06',
  dateModified: data.last_reviewed || '2026-04-06',
  about: {
    '@type': 'Thing',
    name: data.scientific_name,
  },
  speakable: {
    '@type': 'SpeakableSpecification',
    cssSelector: ['.species-summary'],
  },
  image: data.gallery.map(img => ({
    '@type': 'ImageObject',
    contentUrl: img.src.src, // Resolved by Astro image()
    description: img.alt,
    caption: img.caption,
    creator: { '@type': 'Person', name: 'Vicky Shukuroglou' },
  })),
};

// In Astro 5 glob loader, entry.id = folder name (e.g., "messmate-stringybark")
const breadcrumbs = [
  { name: 'Species', href: '/species/' },
  { name: data.common_name, href: `/species/${entry.id}/` },
];
---

<Base
  title={title}
  description={description}
  ogImage={data.hero_image}
  schemaJson={articleSchema}
  breadcrumbs={breadcrumbs}
>
  <article class="species-page">
    <!-- Hero — uses Astro Image component for optimised output -->
    <div class="species-hero">
      <Image src={data.hero_image} alt={`${data.common_name} in its natural habitat`} loading="eager" fetchpriority="high" widths={[600, 900, 1200]} />
    </div>

    <div class="content-width">
      <!-- Title -->
      <header class="species-header">
        <h1>{data.common_name}</h1>
        <p class="scientific-name">{data.scientific_name}</p>
        {data.last_reviewed && (
          <p class="last-reviewed">Last reviewed: {data.last_reviewed}</p>
        )}
      </header>

      <!-- Summary — used by speakable schema -->
      <div class="species-summary">
        <slot />
      </div>

      <!-- Identification Panel -->
      <IdentificationPanel
        barkType={data.bark_type}
        leafDescription={data.leaf_description}
        budFruitDescription={data.bud_fruit_description}
        heightRange={data.height_range}
        floweringSeason={data.flowering_season}
        locations={data.locations}
      />

      <!-- Aboriginal knowledge (only if permission granted) -->
      {data.aboriginal_name && data.aboriginal_language && (
        <section class="aboriginal-knowledge" aria-label="Aboriginal knowledge">
          <h2>Aboriginal Knowledge</h2>
          <p>
            Known as <strong>{data.aboriginal_name}</strong> in {data.aboriginal_language} language.
          </p>
          {data.aboriginal_attribution && (
            <p class="attribution">Shared with permission by {data.aboriginal_attribution}.</p>
          )}
        </section>
      )}

      <!-- Photo Gallery -->
      <PhotoGallery images={data.gallery} />

      <!-- CTA -->
      <section class="species-cta section">
        <p>This is one of 33 indigenous eucalypt species in Melbourne. The ACE Guide covers them all.</p>
        <BuyButton text="Get the Guide" />
      </section>
    </div>
  </article>
</Base>

<style>
  .species-hero img {
    width: 100%;
    max-height: 50vh;
    object-fit: cover;
  }

  .species-header {
    padding-top: var(--space-lg);
  }

  .species-header h1 {
    margin-bottom: var(--space-xs);
  }

  .last-reviewed {
    font-size: 0.8rem;
    color: var(--color-text-secondary);
    margin-top: var(--space-xs);
  }

  .species-summary {
    margin-top: var(--space-md);
  }

  .species-summary :global(p) {
    margin-bottom: var(--space-sm);
  }

  .aboriginal-knowledge {
    margin-block: var(--space-md);
    padding: var(--space-sm) var(--space-md);
    border-left: 3px solid var(--color-green);
    border-radius: 0 4px 4px 0;
  }

  .aboriginal-knowledge h2 {
    font-size: 1.125rem;
    margin-bottom: var(--space-xs);
    color: var(--color-green);
  }

  .aboriginal-knowledge .attribution {
    font-size: 0.85rem;
    color: var(--color-text-secondary);
    margin-top: var(--space-xs);
  }

  .species-cta {
    text-align: center;
    border-top: 1px solid var(--color-olive);
  }

  .species-cta p {
    margin-bottom: var(--space-sm);
    color: var(--color-text-secondary);
  }
</style>
```

- [ ] **Step 3: Create dynamic species route**

```astro
---
// src/pages/species/[slug].astro
// Single-segment dynamic route — species IDs are flat folder names
import { getCollection } from 'astro:content';
import Species from '../../layouts/Species.astro';

export async function getStaticPaths() {
  const speciesEntries = await getCollection('species');
  return speciesEntries.map(entry => ({
    params: { slug: entry.id },  // Astro 5 glob loader: entry.id = folder name
    props: { entry },
  }));
}

const { entry } = Astro.props;
const { Content } = await entry.render();
---

<Species entry={entry}>
  <Content />
</Species>
```

- [ ] **Step 4: Verify a species page renders**

```bash
npm run dev
# Visit http://localhost:4321/species/messmate-stringybark/
```

Expected: Species page renders with hero image, identification panel, gallery, and CTA.

- [ ] **Step 5: Commit**

```bash
git add src/layouts/Species.astro src/components/SchemaMarkup.astro src/pages/species/
git commit -m "feat: add species page layout and dynamic routing"
```

---

### Task 11: Species Index Page

**Files:**
- Create: `src/pages/species/index.astro`

- [ ] **Step 1: Create species index page**

```astro
---
// src/pages/species/index.astro
import { getCollection } from 'astro:content';
import Base from '../../layouts/Base.astro';
import SpeciesCard from '../../components/SpeciesCard.astro';

const allSpecies = await getCollection('species');

const breadcrumbs = [{ name: 'Species', href: '/species/' }];
---

<Base
  title="Melbourne's Indigenous Eucalypt Species — ACE Guide to Eucalypts"
  description="Browse the indigenous eucalypt species of Melbourne. Identification guides for stringybarks, gums, boxes, peppermints, and ironbarks."
  breadcrumbs={breadcrumbs}
>
  <section class="section">
    <div class="content-width">
      <h1>Melbourne's Eucalypts</h1>
      <p>
        Melbourne is home to 33 indigenous eucalypt species. Explore a selection below, or
        <a href="/buy/">get the full guide</a> to identify them all.
      </p>
    </div>

    <div class="species-grid wide-width">
      {allSpecies.map(entry => (
        <SpeciesCard
          commonName={entry.data.common_name}
          scientificName={entry.data.scientific_name}
          group={entry.data.group}
          imageSrc={entry.data.hero_image}
          imageAlt={`${entry.data.common_name} — ${entry.data.group}`}
          href={`/species/${entry.id}/`}
        />
      ))}
    </div>
  </section>
</Base>

<style>
  .species-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: var(--space-md);
    margin-top: var(--space-lg);
  }
</style>
```

- [ ] **Step 2: Verify index page renders with all species cards**

```bash
npm run dev
# Visit http://localhost:4321/species/
```

Expected: Grid of 5 species cards, each linking to its species page.

- [ ] **Step 3: Commit**

```bash
git add src/pages/species/index.astro
git commit -m "feat: add species index page with card grid"
```

---

## Chunk 4: Content Pages

Build all remaining pages: Home, About, Authors, Identify, Buy.

### Task 12: Home Page

**Files:**
- Modify: `src/pages/index.astro` (replace temporary content)

- [ ] **Step 1: Build the full home page**

Replace `src/pages/index.astro` with:

```astro
---
// src/pages/index.astro
import { getCollection } from 'astro:content';
import Base from '../layouts/Base.astro';
import Hero from '../components/Hero.astro';
import SpeciesCard from '../components/SpeciesCard.astro';
import Endorsement from '../components/Endorsement.astro';
import AuthorCard from '../components/AuthorCard.astro';
import AcknowledgmentOfCountry from '../components/AcknowledgmentOfCountry.astro';
import BuyButton from '../components/BuyButton.astro';

const allSpecies = await getCollection('species');
const featuredSpecies = allSpecies.filter(s => s.data.featured);

const allEndorsements = await getCollection('endorsements');
const featuredEndorsements = allEndorsements.filter(e => e.data.featured);

const bookSchema = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: 'ACE Guide to Eucalypts Melbourne',
  author: [
    { '@type': 'Person', name: 'Vicky Shukuroglou' },
    { '@type': 'Person', name: 'Roderick Fensham' },
  ],
  isbn: '9780645232615',
  publisher: { '@type': 'Organization', name: 'ACE Publishing' },
  description: 'An identification guide to Melbourne\'s 33 indigenous eucalypt species.',
  image: '/images/book/cover-placeholder.svg',
};
---

<Base
  title="ACE Guide to Eucalypts Melbourne — Identify Melbourne's Indigenous Eucalypts"
  description="An identification guide to Melbourne's 33 indigenous eucalypt species. Learn to recognise the stringybarks, gums, boxes, peppermints, and ironbarks of your local bushland."
  schemaJson={bookSchema}
>
  <!-- Hero -->
  <Hero
    imageSrc="/images/book/cover-placeholder.svg"
    imageAlt="Eucalypt canopy viewed from below, sunlight filtering through leaves"
    title="ACE Guide to Eucalypts Melbourne"
    subtitle="An identification guide to Melbourne's 33 indigenous eucalypt species"
    ctaText="Get the Book"
    ctaHref="/buy/"
  />

  <!-- Problem / Promise -->
  <section class="section">
    <div class="content-width">
      <!-- PLACEHOLDER: Replace with final copy -->
      <p class="promise-text">
        Most Melburnians walk past eucalypts every day without knowing what they are.
        These 33 species have shaped this landscape for millennia — and this guide helps
        you see them clearly for the first time. Using a simple bark-and-leaf method,
        you'll learn to tell a Messmate from a Manna Gum, a Red Box from a Red Ironbark.
      </p>
    </div>
  </section>

  <!-- Species Teaser Strip -->
  <section class="section" aria-label="Featured species">
    <div class="wide-width">
      <h2 class="content-width">A taste of what's inside</h2>
      <div class="teaser-strip">
        {featuredSpecies.slice(0, 4).map(entry => (
          <SpeciesCard
            commonName={entry.data.common_name}
            scientificName={entry.data.scientific_name}
            group={entry.data.group}
            imageSrc={entry.data.hero_image}
            imageAlt={`${entry.data.common_name} — ${entry.data.group}`}
            href={`/species/${entry.id}/`}
          />
        ))}
      </div>
      <p class="content-width teaser-more">
        <a href="/species/">See all published species</a>
      </p>
    </div>
  </section>

  <!-- About the Book (brief) -->
  <section class="section">
    <div class="content-width">
      <h2>About the Guide</h2>
      <!-- PLACEHOLDER: Replace with final copy -->
      <p>
        The ACE Guide to Eucalypts Melbourne uses a bark-and-leaf identification method
        to help you distinguish all 33 indigenous eucalypt species found across the Melbourne
        region. Compact enough for your pocket, detailed enough for confident identification.
        Part of the ACE field guide series alongside guides to Brisbane and Tasmania.
      </p>
      <BuyButton text="Find the Book" />
    </div>
  </section>

  <!-- Endorsements -->
  {featuredEndorsements.length > 0 && (
    <section class="section" aria-label="Endorsements">
      <div class="content-width">
        {featuredEndorsements.map(e => (
          <Endorsement
            quote={e.data.quote}
            name={e.data.name}
            credential={e.data.credential}
          />
        ))}
      </div>
    </section>
  )}

  <!-- Authors -->
  <section class="section" aria-label="Authors">
    <div class="content-width">
      <h2>The Authors</h2>
      <div class="author-grid">
        <AuthorCard
          name="Vicky Shukuroglou"
          role="Author, photographer, artist"
          imageSrc="/images/authors/vicky-placeholder.svg"
          imageAlt="Portrait of Vicky Shukuroglou"
          href="/authors/"
        />
        <AuthorCard
          name="Rod Fensham"
          role="Ecologist, University of Queensland"
          imageSrc="/images/authors/rod-placeholder.svg"
          imageAlt="Portrait of Rod Fensham"
          href="/authors/"
        />
      </div>
    </div>
  </section>

  <!-- Acknowledgment of Country -->
  <AcknowledgmentOfCountry />
</Base>

<style>
  .promise-text {
    font-size: 1.25rem;
    max-width: var(--content-width);
    line-height: 1.8;
  }

  .teaser-strip {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: var(--space-sm);
    margin-top: var(--space-sm);
  }

  .teaser-more {
    margin-top: var(--space-sm);
  }

  .author-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: var(--space-md);
    margin-top: var(--space-sm);
  }
</style>
```

- [ ] **Step 2: Verify home page renders with all sections**

```bash
npm run dev
# Visit http://localhost:4321/
```

Expected: Hero, problem/promise, species teaser strip, about, endorsements, authors, AoC, footer — all styled.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: build complete home page with all sections"
```

---

### Task 13: About, Authors, Identify, and Buy Pages

**Files:**
- Create: `src/pages/about.astro`
- Create: `src/pages/authors.astro`
- Create: `src/pages/identify.astro`
- Create: `src/pages/buy.astro`

- [ ] **Step 1: Create About the Book page**

```astro
---
// src/pages/about.astro
import Page from '../layouts/Page.astro';

const breadcrumbs = [{ name: 'About', href: '/about/' }];
---

<Page
  title="About the ACE Guide to Eucalypts Melbourne"
  description="How the ACE Guide to Eucalypts Melbourne was created, the bark-and-leaf identification method, and the Dahl Fellowship that made it possible."
  breadcrumbs={breadcrumbs}
>
  <h1>About the Guide</h1>

  <h2>The ACE Identification Method</h2>
  <!-- PLACEHOLDER: Replace with detailed method description -->
  <p>
    The ACE method combines bark texture and leaf colour to group eucalypts into
    identifiable categories. By looking first at whether bark is rough or smooth, then
    at whether leaves are the same colour on both sides (concolorous) or different
    (discolorous), you can narrow down any Melbourne eucalypt to a small group of
    possibilities.
  </p>

  <h2>What's Inside</h2>
  <!-- PLACEHOLDER: Replace with real book details -->
  <p>
    The guide covers all 33 indigenous eucalypt species found in the greater Melbourne
    region. Each species entry includes high-resolution photography of bark, leaves, buds,
    and fruit, along with identification notes, habitat information, and where to find
    each species in Melbourne's parks and reserves.
  </p>
  <!-- PLACEHOLDER: Add sample interior spread photograph -->

  <h2>The Dahl Fellowship</h2>
  <!-- PLACEHOLDER: Replace with real Eucalypt Australia story -->
  <p>
    This guide was made possible through a Dahl Fellowship from
    <a href="https://eucalyptaustralia.org.au/" target="_blank" rel="noopener">Eucalypt Australia</a>,
    supporting research and education about Australia's iconic eucalypt heritage.
  </p>

  <h2>The ACE Series</h2>
  <p>
    The ACE Guide to Eucalypts Melbourne joins a growing series of accessible eucalypt
    identification guides, including the
    <em>ACE Guide to Eucalypts: Brisbane</em> by Rod Fensham and
    <em>EucaFlip: Tasmania</em> by Rob Wiltshire and Brad Potts.
  </p>
</Page>
```

- [ ] **Step 2: Create Authors page**

```astro
---
// src/pages/authors.astro
import Page from '../layouts/Page.astro';

const breadcrumbs = [{ name: 'Authors', href: '/authors/' }];

const personSchemas = [
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Vicky Shukuroglou',
    jobTitle: 'Author, Photographer, Artist',
    url: 'https://www.shukuroglou.org',
    sameAs: [
      'https://au.linkedin.com/in/vicky-shukuroglou-1b61a969',
      'https://www.bundanon.com.au/artist/vicky-shukuroglou/',
    ],
  },
  {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: 'Roderick Fensham',
    jobTitle: 'Ecologist',
    affiliation: { '@type': 'Organization', name: 'University of Queensland' },
    url: 'https://environment.uq.edu.au/profile/21635/rod-fensham',
  },
];
---

<Page
  title="Authors — ACE Guide to Eucalypts Melbourne"
  description="Meet the authors: Vicky Shukuroglou (artist, photographer, educator) and Rod Fensham (ecologist, University of Queensland)."
  schemaJson={personSchemas}
  breadcrumbs={breadcrumbs}
>
  <h1>The Authors</h1>
  <p class="authors-intro">
    The ACE Guide to Eucalypts Melbourne is a collaboration between an artist-photographer
    and an ecologist — bringing together intimate observation and rigorous science.
  </p>

  <section class="author-bio">
    <img src="/images/authors/vicky-placeholder.svg" alt="Portrait of Vicky Shukuroglou" width="200" height="200" />
    <div>
      <h2>Vicky Shukuroglou</h2>
      <p class="author-role">Author, Photographer, Artist &amp; Educator</p>
      <!-- PLACEHOLDER: Replace with Vicky's real bio -->
      <p>
        Vicky Shukuroglou is a multidisciplinary artist, photographer, and educator whose
        work explores intimate connections with the natural world. She co-authored
        <em>Loving Country: A Guide to Sacred Australia</em> with Bruce Pascoe (Hardie Grant, 2020),
        creating all the photography for a book that documents sacred sites across Australia
        in consultation with Indigenous communities and Elders.
      </p>
      <p>
        Vicky co-founded <a href="https://www.nillumbio.org" target="_blank" rel="noopener">Nillumbio</a>,
        a biodiversity-focused organisation in Nillumbik Shire, and convenes Friends of Biodiversity
        at Hohnes Hill reserve in Eltham. Her photographic style is characterised by intimate
        observation — "not just looking at Uluru, but looking at the insects around Uluru."
      </p>
    </div>
  </section>

  <section class="author-bio">
    <img src="/images/authors/rod-placeholder.svg" alt="Portrait of Rod Fensham" width="200" height="200" />
    <div>
      <h2>Rod Fensham</h2>
      <p class="author-role">Ecologist, University of Queensland &amp; Queensland Herbarium</p>
      <!-- PLACEHOLDER: Replace with Rod's real bio -->
      <p>
        Professor Rod Fensham is an ecologist at the University of Queensland with extensive
        research experience in Australian flora and vegetation. He created the
        <em>ACE Guide to Eucalypts: Brisbane</em> (2021), establishing the bark-and-leaf
        identification method that the Melbourne guide builds upon.
      </p>
    </div>
  </section>
</Page>

<style>
  .authors-intro {
    font-size: 1.125rem;
    margin-bottom: var(--space-lg);
    color: var(--color-text-secondary);
  }

  .author-bio {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: var(--space-md);
    margin-bottom: var(--space-lg);
    padding-bottom: var(--space-lg);
    border-bottom: 1px solid var(--color-olive);
  }

  .author-bio:last-of-type {
    border-bottom: none;
  }

  .author-bio img {
    width: 200px;
    height: 200px;
    object-fit: cover;
    border-radius: 4px;
  }

  .author-role {
    color: var(--color-text-secondary);
    margin-bottom: var(--space-sm);
  }

  .author-bio p + p {
    margin-top: var(--space-sm);
  }

  @media (max-width: 640px) {
    .author-bio {
      grid-template-columns: 1fr;
    }

    .author-bio img {
      width: 150px;
      height: 150px;
    }
  }
</style>
```

- [ ] **Step 3: Create Identification Tips page**

```astro
---
// src/pages/identify.astro
import Page from '../layouts/Page.astro';
import BuyButton from '../components/BuyButton.astro';

const breadcrumbs = [{ name: 'Identify', href: '/identify/' }];

const howToSchema = {
  '@context': 'https://schema.org',
  '@type': 'HowTo',
  name: 'How to Identify Eucalypts in Melbourne',
  description: 'Learn the bark-and-leaf method to identify Melbourne\'s 33 indigenous eucalypt species.',
  step: [
    {
      '@type': 'HowToStep',
      name: 'Look at the bark',
      text: 'Is the bark rough (stringybark, box, ironbark) or smooth (gum)? Does rough bark persist to the small branches or stop partway up?',
    },
    {
      '@type': 'HowToStep',
      name: 'Look at the leaves',
      text: 'Are the leaves the same colour on both sides (concolorous) or different — darker above, paler below (discolorous)?',
    },
    {
      '@type': 'HowToStep',
      name: 'Check buds and fruit',
      text: 'Count buds per cluster. Look at the shape of the gum nut cap and the size of the fruit.',
    },
    {
      '@type': 'HowToStep',
      name: 'Consider habitat and location',
      text: 'Where are you? Wet gullies, dry ridgetops, and river flats each favour different species.',
    },
  ],
};
---

<Page
  title="How to Identify Eucalypts in Melbourne — ACE Guide"
  description="Learn the bark-and-leaf method to identify Melbourne's indigenous eucalypts. Free identification tips from the ACE Guide."
  schemaJson={howToSchema}
  breadcrumbs={breadcrumbs}
>
  <h1>How to Identify Eucalypts in Melbourne</h1>

  <!-- PLACEHOLDER: Replace with real identification content and photo examples -->

  <p>
    Melbourne is home to 33 indigenous eucalypt species. That sounds like a lot, but with a
    systematic approach you can learn to tell them apart. The ACE method starts with two
    questions: <strong>what does the bark look like?</strong> and <strong>are the leaves
    the same colour on both sides?</strong>
  </p>

  <h2>Step 1: Look at the Bark</h2>
  <p>
    Bark is the single most useful feature for eucalypt identification. Melbourne's eucalypts
    fall into clear bark groups:
  </p>
  <ul>
    <li><strong>Stringybarks</strong> — rough, fibrous bark that peels in long strips</li>
    <li><strong>Boxes</strong> — rough, short-fibred bark that doesn't peel easily</li>
    <li><strong>Ironbarks</strong> — deeply furrowed, very hard, dark bark</li>
    <li><strong>Gums</strong> — smooth bark, often shedding in patches to reveal fresh colours</li>
    <li><strong>Peppermints</strong> — rough bark at the base transitioning to smooth above</li>
  </ul>

  <h2>Step 2: Look at the Leaves</h2>
  <p>
    Pick a mature leaf from an adult branch (not the juvenile growth near the base).
    Hold it up to the light. Is the upper surface noticeably darker than the lower?
    If so, the leaf is <em>discolorous</em>. If both sides are similar, it's <em>concolorous</em>.
    This one distinction eliminates half the possibilities.
  </p>

  <h2>Step 3: Check Buds and Fruit</h2>
  <p>
    Count the buds per cluster — this narrows identification further. The shape of the
    gum nut (technically the fruit) and the cap that covers the stamens before flowering
    are diagnostic features for many species.
  </p>

  <h2>Step 4: Consider Where You Are</h2>
  <p>
    Habitat matters. Some species prefer wet gullies, others dry ridgetops, others river
    flats. Knowing your location within Melbourne narrows the possibilities significantly.
  </p>

  <h2>Common Confusions</h2>
  <!-- PLACEHOLDER: Replace with real confusion pairs and resolution tips -->
  <p>
    Messmate Stringybark and Brown Stringybark can look similar from a distance. The key
    difference is where the rough bark stops: Messmate has rough bark right out to the small
    branches, while Brown Stringybark transitions to smooth bark in the upper trunk.
  </p>

  <section class="identify-cta">
    <h2>Ready to Identify All 33?</h2>
    <p>
      These tips give you the method. The ACE Guide gives you every species — with
      photography, detailed identification notes, and habitat maps.
    </p>
    <BuyButton text="Get the Guide" />
  </section>
</Page>

<style>
  ul {
    margin-block: var(--space-sm);
    padding-left: var(--space-md);
  }

  li {
    margin-bottom: var(--space-xs);
  }

  h2 {
    margin-top: var(--space-lg);
    margin-bottom: var(--space-sm);
  }

  .identify-cta {
    text-align: center;
    padding-top: var(--space-lg);
    margin-top: var(--space-lg);
    border-top: 1px solid var(--color-olive);
  }

  .identify-cta p {
    margin-bottom: var(--space-sm);
    color: var(--color-text-secondary);
  }
</style>
```

- [ ] **Step 4: Create Buy page**

```astro
---
// src/pages/buy.astro
import Base from '../layouts/Base.astro';
import BuyButton from '../components/BuyButton.astro';

const breadcrumbs = [{ name: 'Buy', href: '/buy/' }];

const bookSchema = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: 'ACE Guide to Eucalypts Melbourne',
  author: [
    { '@type': 'Person', name: 'Vicky Shukuroglou' },
    { '@type': 'Person', name: 'Roderick Fensham' },
  ],
  isbn: '9780645232615',
  publisher: { '@type': 'Organization', name: 'ACE Publishing' },
  description: 'Identification guide to the eucalypts of Melbourne. Covers 33 indigenous species.',
  image: '/images/book/cover-placeholder.svg',
  offers: {
    '@type': 'AggregateOffer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'AUD',
    offerCount: 5,
  },
};

const retailers = [
  { name: 'Australian Koala Foundation', href: 'https://savethekoala.com/shop/products/book-ace-guide-to-eucalypts/', primary: true },
  { name: 'Booktopia', href: '#', primary: false },
  { name: 'Dymocks', href: '#', primary: false },
  { name: 'Amazon AU', href: '#', primary: false },
  { name: 'Fishpond', href: '#', primary: false },
];
---

<Base
  title="Buy the ACE Guide to Eucalypts Melbourne"
  description="Purchase the ACE Guide to Eucalypts Melbourne — available from Australian Koala Foundation, Booktopia, Dymocks, Amazon AU, and Fishpond."
  schemaJson={bookSchema}
  breadcrumbs={breadcrumbs}
>
  <section class="buy-page section">
    <div class="content-width">
      <div class="buy-grid">
        <div class="buy-cover">
          <img
            src="/images/book/cover-placeholder.svg"
            alt="Cover of the ACE Guide to Eucalypts Melbourne"
            width="400"
            height="600"
            loading="eager"
          />
        </div>

        <div class="buy-details">
          <h1>ACE Guide to Eucalypts Melbourne</h1>
          <p class="buy-subtitle">
            An identification guide to Melbourne's 33 indigenous eucalypt species
          </p>

          <dl class="book-facts">
            <dt>Authors</dt>
            <dd>Vicky Shukuroglou &amp; Roderick Fensham</dd>

            <dt>Publisher</dt>
            <dd>ACE Publishing</dd>

            <dt>ISBN</dt>
            <dd>9780645232615</dd>

            <!-- PLACEHOLDER: Add page count, dimensions, format when available -->
            <dt>Format</dt>
            <dd>Softcover pocket guide</dd>
          </dl>

          <p class="buy-price">Prices vary by retailer.</p>

          <div class="retailer-buttons">
            {retailers.map(r => (
              <BuyButton
                text={r.name}
                href={r.href}
                external={true}
              />
            ))}
          </div>

          <p class="buy-indie">
            Or ask your local bookshop — they can order it by ISBN.
          </p>

          <p class="buy-gift">
            Know someone who walks in Melbourne's bushland? This makes a meaningful gift.
          </p>
        </div>
      </div>
    </div>
  </section>
</Base>

<style>
  .buy-grid {
    display: grid;
    grid-template-columns: 1fr 2fr;
    gap: var(--space-lg);
    align-items: start;
  }

  @media (max-width: 640px) {
    .buy-grid {
      grid-template-columns: 1fr;
    }

    .buy-cover {
      max-width: 300px;
      margin-inline: auto;
    }
  }

  .buy-cover img {
    width: 100%;
    border-radius: 4px;
    box-shadow: 0 4px 20px rgba(44, 44, 42, 0.1);
  }

  .buy-subtitle {
    font-size: 1.125rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-md);
  }

  .book-facts {
    display: grid;
    grid-template-columns: auto 1fr;
    gap: var(--space-xs) var(--space-sm);
    margin-bottom: var(--space-md);
  }

  .book-facts dt {
    font-weight: 600;
    color: var(--color-text-secondary);
    font-size: 0.9rem;
  }

  .buy-price {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin-bottom: var(--space-sm);
  }

  .retailer-buttons {
    display: flex;
    flex-wrap: wrap;
    gap: var(--space-xs);
    margin-bottom: var(--space-md);
  }

  .retailer-buttons :global(.buy-button) {
    font-size: 0.9rem;
    padding: 0.5rem 1rem;
  }

  .buy-indie {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
  }

  .buy-gift {
    margin-top: var(--space-sm);
    font-style: italic;
    color: var(--color-text-secondary);
  }
</style>
```

- [ ] **Step 5: Verify all four pages render**

```bash
npm run dev
# Visit each: /about/, /authors/, /identify/, /buy/
```

Expected: All pages render with correct layout, nav highlighting, and content.

- [ ] **Step 6: Commit**

```bash
git add src/pages/about.astro src/pages/authors.astro src/pages/identify.astro src/pages/buy.astro
git commit -m "feat: add About, Authors, Identify, and Buy pages"
```

---

## Chunk 5: Testing and Performance

### Task 14: Set Up Playwright and Write Tests

**Files:**
- Create: `playwright.config.ts`
- Create: `tests/build.test.ts`
- Create: `tests/navigation.test.ts`
- Create: `tests/schema.test.ts`
- Create: `tests/a11y.test.ts`
- Create: `tests/responsive.test.ts`

- [ ] **Step 1: Install Playwright browsers**

```bash
npx playwright install chromium
```

- [ ] **Step 2: Create Playwright config**

```typescript
// playwright.config.ts
import { defineConfig } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  webServer: {
    command: 'npm run preview',
    port: 4321,
    reuseExistingServer: true,
  },
  use: {
    baseURL: 'http://localhost:4321',
  },
});
```

- [ ] **Step 3: Add preview script to package.json**

Ensure `package.json` has:
```json
"scripts": {
  "preview": "astro preview --port 4321"
}
```

- [ ] **Step 4: Create build test**

```typescript
// tests/e2e/build.test.ts
import { test, expect } from '@playwright/test';
import { execSync } from 'child_process';
import { existsSync } from 'fs';

test.describe('Build output', () => {
  test.beforeAll(() => {
    execSync('npm run build', { stdio: 'inherit' });
  });

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
```

- [ ] **Step 5: Create navigation test**

```typescript
// tests/e2e/navigation.test.ts
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
      const navLink = page.locator(`nav a[href="${link.href}"]`);
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
```

- [ ] **Step 6: Create schema markup test**

```typescript
// tests/e2e/schema.test.ts
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
```

- [ ] **Step 7: Create accessibility test**

```typescript
// tests/e2e/a11y.test.ts
import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const pages = [
  { name: 'Home', path: '/' },
  { name: 'Species Index', path: '/species/' },
  { name: 'Messmate Stringybark', path: '/species/messmate-stringybark/' },
  { name: 'About', path: '/about/' },
  { name: 'Authors', path: '/authors/' },
  { name: 'Identify', path: '/identify/' },
  { name: 'Buy', path: '/buy/' },
];

for (const pg of pages) {
  test(`${pg.name} page passes axe accessibility audit`, async ({ page }) => {
    await page.goto(pg.path);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });
}
```

- [ ] **Step 8: Create responsive test**

```typescript
// tests/e2e/responsive.test.ts
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

    test('species grid adapts to viewport', async ({ page }) => {
      await page.goto('/species/');
      const grid = page.locator('.species-grid');
      await expect(grid).toBeVisible();
    });

    test('content does not overflow horizontally', async ({ page }) => {
      await page.goto('/');
      const bodyWidth = await page.evaluate(() => document.body.scrollWidth);
      expect(bodyWidth).toBeLessThanOrEqual(vp.width);
    });
  });
}
```

- [ ] **Step 9: Create unit test for content schema validation**

```typescript
// tests/unit/content-schema.test.ts
import { test, expect } from '@playwright/test';
import { z } from 'astro/zod';

// Mirror the species schema from content.config.ts (without image() since we're testing outside Astro)
const speciesFrontmatterSchema = z.object({
  common_name: z.string(),
  scientific_name: z.string(),
  group: z.enum(['stringybark', 'gum', 'box', 'peppermint', 'ironbark', 'ash', 'other']),
  aboriginal_name: z.string().optional(),
  aboriginal_language: z.string().optional(),
  aboriginal_attribution: z.string().optional(),
  bark_type: z.string(),
  leaf_description: z.string(),
  bud_fruit_description: z.string(),
  height_range: z.string(),
  flowering_season: z.string(),
  locations: z.array(z.string()).min(1),
  featured: z.boolean().default(false),
  last_reviewed: z.string().optional(),
});

test.describe('Species schema validation', () => {
  test('accepts valid frontmatter', () => {
    const valid = {
      common_name: 'Messmate Stringybark',
      scientific_name: 'Eucalyptus obliqua',
      group: 'stringybark',
      bark_type: 'Stringybark',
      leaf_description: 'Discolorous',
      bud_fruit_description: 'Buds in clusters of 7-11',
      height_range: '20-45m',
      flowering_season: 'January-April',
      locations: ['Warrandyte'],
    };
    expect(() => speciesFrontmatterSchema.parse(valid)).not.toThrow();
  });

  test('rejects missing required fields', () => {
    const invalid = { common_name: 'Test' };
    expect(() => speciesFrontmatterSchema.parse(invalid)).toThrow();
  });

  test('rejects invalid group', () => {
    const invalid = {
      common_name: 'Test',
      scientific_name: 'Test',
      group: 'palm',  // Not a valid eucalypt group
      bark_type: 'X', leaf_description: 'X', bud_fruit_description: 'X',
      height_range: 'X', flowering_season: 'X', locations: ['X'],
    };
    expect(() => speciesFrontmatterSchema.parse(invalid)).toThrow();
  });

  test('rejects empty locations array', () => {
    const invalid = {
      common_name: 'Test', scientific_name: 'Test', group: 'gum',
      bark_type: 'X', leaf_description: 'X', bud_fruit_description: 'X',
      height_range: 'X', flowering_season: 'X', locations: [],
    };
    expect(() => speciesFrontmatterSchema.parse(invalid)).toThrow();
  });
});
```

- [ ] **Step 10: Create integration test for content loading**

```typescript
// tests/integration/content-loading.test.ts
import { test, expect } from '@playwright/test';

test.describe('Content collections load correctly', () => {
  test('species index shows all 5 species', async ({ page }) => {
    await page.goto('/species/');
    const cards = page.locator('.species-card');
    await expect(cards).toHaveCount(5);
  });

  test('each species page has required sections', async ({ page }) => {
    const speciesSlugs = [
      'messmate-stringybark',
      'manna-gum',
      'red-box',
      'narrow-leaf-peppermint',
      'red-ironbark',
    ];

    for (const slug of speciesSlugs) {
      await page.goto(`/species/${slug}/`);
      // Has title
      await expect(page.locator('h1')).toBeVisible();
      // Has identification panel
      await expect(page.locator('.id-panel')).toBeVisible();
      // Has photo gallery
      await expect(page.locator('.photo-gallery')).toBeVisible();
      // Has buy CTA
      await expect(page.locator('.species-cta')).toBeVisible();
    }
  });

  test('home page shows featured endorsements', async ({ page }) => {
    await page.goto('/');
    const endorsements = page.locator('.endorsement');
    await expect(endorsements).toHaveCount(2);
  });

  test('home page shows featured species in teaser strip', async ({ page }) => {
    await page.goto('/');
    const teaserCards = page.locator('.teaser-strip .species-card');
    const count = await teaserCards.count();
    expect(count).toBeGreaterThanOrEqual(4);
  });
});
```

- [ ] **Step 11: Build and run all tests**

```bash
npm run build && npx playwright test
```

Expected: All tests pass. If any accessibility violations are found, fix them before committing.

- [ ] **Step 12: Commit**

```bash
git add playwright.config.ts tests/ package.json
git commit -m "feat: add tests — unit (schema), integration (content), e2e (nav, a11y, schema, responsive)"
```

---

### Task 15: Performance Audit and Final Polish

**Files:**
- Possibly modify: various files based on Lighthouse audit results

- [ ] **Step 1: Run Lighthouse CI**

```bash
npm run build
npx @lhci/cli autorun --collect.staticDistDir=dist --assert.preset=lighthouse:recommended
```

If `@lhci/cli` isn't installed:
```bash
npx lighthouse http://localhost:4321 --output=json --output-path=./lighthouse-report.json --chrome-flags="--headless"
```

(Start preview server first: `npm run preview &`)

- [ ] **Step 2: Review and fix any Lighthouse issues**

Common issues to check:
- Image alt text present on all `<img>` tags
- Heading hierarchy is logical (no skipped levels)
- Colour contrast passes (already designed for AA, but verify)
- Font loading doesn't block render (using `display=swap`)
- No layout shift from lazy-loaded images (width/height attributes set)

- [ ] **Step 3: Verify critical path weight**

```bash
# Check HTML + CSS size of home page
ls -la dist/index.html
# CSS should be inlined by Astro — check total HTML file size
wc -c dist/index.html
```

Target: <150KB for the HTML file (which includes inlined CSS).

- [ ] **Step 4: Commit any fixes**

```bash
git add -u
git commit -m "fix: address Lighthouse audit findings"
```

---

### Task 16: Final Build Verification

- [ ] **Step 1: Clean build**

```bash
rm -rf dist node_modules/.astro
npm run build
```

- [ ] **Step 2: Run all tests**

```bash
npx playwright test
```

Expected: All tests pass.

- [ ] **Step 3: Manual review**

Start preview server and visually check every page:

```bash
npm run preview
```

Checklist:
- [ ] Home page: hero, promise, teaser strip, about, endorsements, authors, AoC, footer
- [ ] Species index: grid of 5 cards, all linking correctly
- [ ] Each species page: hero, ID panel, gallery, CTA
- [ ] About: method, book details, fellowship, series
- [ ] Authors: both bios with photos, links
- [ ] Identify: all 4 steps, common confusions, CTA
- [ ] Buy: cover, facts, retailer buttons, gift line
- [ ] 404: "This tree doesn't grow here"
- [ ] Nav: all 6 links visible at all screen sizes
- [ ] Footer: retailers, credits, Eucalypt Australia
- [ ] Fonts load correctly (Fraunces for headings, Source Sans for body)
- [ ] Colours match spec tokens
- [ ] Mobile: everything readable and tappable at 375px

- [ ] **Step 4: Final commit**

```bash
git add -A
git commit -m "chore: final build verification — all pages and tests passing"
```

---

## Summary

| Chunk | Tasks | What you get after |
|---|---|---|
| **1: Foundation** | 1-5 | Astro project with design system, Base layout, nav, footer, 404 |
| **2: Components** | 6-7 | All reusable components built and ready to compose |
| **3: Content** | 8-11 | 5 species with data, species layout, species index |
| **4: Pages** | 12-13 | All 8 page types complete with placeholder content |
| **5: Testing** | 14-16 | Full e2e test suite, Lighthouse audit, manual verification |

Total: **16 tasks**, each independently committable. Every placeholder is marked with `<!-- PLACEHOLDER: ... -->` for easy content swap.
