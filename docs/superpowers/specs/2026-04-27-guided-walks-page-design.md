# Guided Walks Page — Design Spec

**Date:** 2026-04-27
**Status:** Draft for approval

## Goal

Add a Guided Walks offering to the site. Vicky leads guided eucalypt walks across Melbourne (and a few peri-urban locations); the site currently has no way to surface or book them. This work creates a dedicated page, integrates a teaser onto the home page, renames the existing "Melbourne" nav item, and adds a real contact channel via a Netlify-hosted enquiry form.

## Scope

In scope:
- New page at `/walks/`
- Nav rename: `Melbourne` → `The Book` (label only; URL `/melbourne/` unchanged)
- Home-page band linking to walks, between Endorsements and Method
- Netlify Forms enquiry form (primary contact) + `mailto:` fallback
- Three new images (1 portrait, 2 group walk shots) under `src/assets/walks/`
- `Service` schema.org JSON-LD on the walks page
- Footer/contact-link audit (no separate `/contact` page yet — the walks form serves)

Out of scope:
- Online booking / payment for walks (deferred — "from $500" + "PPP coming soon")
- Schools program landing page (mentioned as "coming soon" inline)
- Gift voucher purchase flow (mentioned inline; enquiry-driven)
- General-purpose `/contact` page (revisit if non-walk enquiries grow)

## Decisions made during brainstorming

| Decision | Choice | Why |
|---|---|---|
| Nav label | "The Book" | Disambiguates from city; future-proofs for other titles |
| Nav URL | Keep `/melbourne/` | Avoids breaking inbound links / search results |
| Contact mechanism | Netlify Forms | Site is on Netlify; free 100/mo tier; no third-party dependency; lower drop-off than `mailto:` |
| Email destination | `info@eucalyptsmelbourne.au` | Consistent with existing site |
| Bio photo | `~/Downloads/image.png` | In-the-field portrait; reads as "the guide" |
| Hero photo | `IMG_0738.jpeg` | Group circle — shows the *experience* |
| Lower-band photo | `IMG_0747.jpeg` | Group walking under canopy — shows the *setting* |
| Pricing displayed | "From $500 per group · per-person pricing coming soon" | Vicky's wording; transparent without committing to a rate card |

## Page architecture

### Route map

| Route | File | Notes |
|---|---|---|
| `/walks/` | `src/pages/walks.astro` | New |
| `/melbourne/` | `src/pages/melbourne.astro` | Unchanged URL; nav label change only |

### Component reuse

- `Base.astro` layout — pass `title`, `description`, `schemaJson`, `breadcrumbs`
- `Nav.astro` — edit `navLinks` array (label change + new entry)
- `Footer.astro` — confirm walks link surfaces (or add)
- `AcknowledgmentOfCountry.astro` — include at page bottom (consistent with index/melbourne)
- New: `EnquiryForm.astro` — Netlify-attributed `<form>` component, reused if ever needed elsewhere

### Walks page section order

1. **Hero** — H1 "Walks with Vicky", subtitle (the brief opening line), `IMG_0738` as hero image, CTA button → `#enquire` anchor
2. **Why these walks** — 2 paragraphs from Vicky's draft (slow down, look closely, etc.) + the rich Pound Bend / Yarra Riverkeeper sample-walk descriptions
3. **What you'll learn** — bullet list (recognise species, bark/buds/gumnuts/leaves, seasonal change, ecosystem reading)
4. **Sample walk** — concrete: Pound Bend, "several different species; testing ID machinery; watching people 'get their eye in'; not about being right, it's about learning together"
5. **Locations** — named list: Pound Bend, Long Forest (Bacchus Marsh), Blackburn Lake, Royal Park, Royal Botanic Gardens. `IMG_0747` placed here.
6. **Practicalities** — duration (90–120 min), group size (max 30), pace ("not particularly fit"), accessibility ("wheelchair access requires advance notice"), seasonality (year-round), pricing line ("From $500 per group · per-person pricing coming soon")
7. **Who walks are for** — bullet list (community groups, garden clubs, schools, corporate, visitors)
8. **About Vicky** — short bio + portrait. Bio: "Vicky Shukuroglou is co-author of the *ACE Guide to Eucalypts Melbourne*, an artist and ecologist, and founder of Nillumbio — a biodiversity-focused engagement practice through which she has led many walks."
9. **Testimonials** — Robert (walk participant) and Madeline (Senior Ranger, Banyule). Reuse `Endorsement.astro` component.
10. **Also available** — one-line bullets: "Gift vouchers available · Schools program coming soon · Contact for more information"
11. **Enquiry form** (`#enquire` anchor) — Netlify form
12. `AcknowledgmentOfCountry`

### Home page changes (`src/pages/index.astro`)

Add a new section between Endorsements and Method:

```
[ small section, full-width band, lighter background ]
  Walks with Vicky
  "Step into the world of eucalypts and discover Melbourne through its most iconic trees."
  [ IMG_0738, ~480px wide, alongside text on desktop, stacked on mobile ]
  → Book a walk
```

Reuses existing `--space-*` and colour tokens. No new CSS variables.

### Nav change (`src/components/Nav.astro`)

```
Home · The Book · Walks · About · FAQ · Buy
```

- Rename `'Melbourne'` → `'The Book'` (line 7)
- Insert `{ href: url('/walks/'), label: 'Walks' }` between `melbourne` and `about`
- Active-state logic unchanged (`isActive` already handles arbitrary paths)

## Enquiry form design

### Markup (Netlify Forms)

```html
<form
  name="walk-enquiry"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  action="/walks/thanks/"
>
  <input type="hidden" name="form-name" value="walk-enquiry" />
  <p hidden><label>Don't fill this out: <input name="bot-field" /></label></p>

  Name *           [text]
  Email *          [email]
  Phone (optional) [tel]
  Group size       [number, min 1, max 30]
  Preferred location [select: Pound Bend, Long Forest, Blackburn Lake, Royal Park, Royal Botanic Gardens, Other / not sure]
  Preferred dates  [text — free form, e.g. "weekends in May"]
  What are you hoping to get from the walk? [textarea]

  [ Send enquiry ]
</form>
```

### Companion thank-you page

`src/pages/walks/thanks.astro` — confirms receipt, sets expectation ("Vicky will reply within a few days"), links back to `/walks/` and `/`.

### Email notification

Configured in Netlify dashboard (out-of-repo): notification → `info@eucalyptsmelbourne.au`. Document this step in the implementation plan so it's not forgotten.

### Fallback

Below the form: small line — "Prefer email? Reach Vicky at `info@eucalyptsmelbourne.au`."

### Spam protection

- Netlify built-in honeypot (`netlify-honeypot="bot-field"`)
- No reCAPTCHA initially — add only if spam volume warrants

## Image handling

| Source | Destination | Use | Notes |
|---|---|---|---|
| `~/Downloads/image.png` | `src/assets/walks/vicky-portrait.jpg` | Bio block | Convert PNG→JPG, ~800px wide |
| `~/Downloads/IMG_0738.jpeg` | `src/assets/walks/group-listening.jpg` | Walks hero, home band | **EXIF rotation fix required** (currently rotated 90°); resize ~1600px wide |
| `~/Downloads/IMG_0747.jpeg` | `src/assets/walks/group-walking.jpg` | Walks "Locations" section | **EXIF rotation fix required**; resize ~1600px wide |

Use Astro's `<Image>` component (already used elsewhere) for automatic responsive sizing and format negotiation (AVIF/WebP/JPEG). Provide descriptive alt text:
- Portrait: "Vicky Shukuroglou, author and walk leader, in front of a eucalypt"
- Hero: "A group standing in a clearing, listening as Vicky points out details of a eucalypt"
- Locations: "A group walking through open eucalypt woodland under a high canopy"

Orientation fix preferred at-source (re-save with corrected EXIF) rather than CSS rotation, so screen readers and OG-image consumers get the right thing.

## SEO / schema

### Walks page meta

- `<title>`: "Guided Eucalypt Walks in Melbourne — Walks with Vicky"
- `<meta description>`: "Guided eucalypt walks across Melbourne with author and ecologist Vicky Shukuroglou. For community groups, schools, gardens clubs, and curious visitors. From $500 per group."

### `Service` schema (JSON-LD)

```json
{
  "@context": "https://schema.org",
  "@type": "Service",
  "name": "Guided Eucalypt Walks",
  "provider": {
    "@type": "Person",
    "name": "Vicky Shukuroglou"
  },
  "areaServed": { "@type": "City", "name": "Melbourne" },
  "serviceType": "Guided nature walk",
  "offers": {
    "@type": "Offer",
    "priceCurrency": "AUD",
    "price": "500",
    "priceSpecification": {
      "@type": "PriceSpecification",
      "minPrice": "500",
      "priceCurrency": "AUD",
      "valueAddedTaxIncluded": true
    }
  },
  "description": "Guided eucalypt walks across Melbourne — Pound Bend, Long Forest, Blackburn Lake, Royal Park, Royal Botanic Gardens. 90–120 minutes, groups up to 30."
}
```

### Breadcrumbs

`[{ name: 'Walks', href: '/walks/' }]` — handled automatically by `Base.astro`.

## Testing

The repo has Playwright (`playwright.config.ts`, `tests/`). Following the project's existing test convention:

1. **Build smoke test** — `npm run build` succeeds with no warnings
2. **Playwright e2e**:
   - Nav contains "The Book" and "Walks" labels
   - `/walks/` renders, contains "Walks with Vicky" h1, all section headings, three images load
   - Form has `name="walk-enquiry"` and `data-netlify="true"`
   - Submitting required fields without value shows browser validation
   - Home-page walks band renders and links to `/walks/`
   - Old `/melbourne/` URL still resolves (unchanged)
3. **A11y check** — axe-core run on `/walks/`: no critical violations; form fields have labels; images have alt text
4. **Manual on Netlify deploy preview**:
   - Submit a real form, confirm it lands in Netlify dashboard
   - Confirm email notification reaches `info@eucalyptsmelbourne.au`
   - Confirm thank-you page renders
5. **Lighthouse** on `/walks/` — perf > 90 (image weight is the main risk; the resize step covers it)

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Form spam exceeds 100/mo free tier | Honeypot first; add reCAPTCHA only if exceeded |
| Inbound links / search to "Melbourne" page break | URL kept; only nav label changes |
| `IMG_0738`/`IMG_0747` published rotated | Fix EXIF at-source during the import step |
| Vicky needs to update prices/locations later without dev help | Keep page content in `walks.astro` (simple Astro file); document in handover that text is editable in the file directly. Future enhancement: move to content collection. |
| "Schools program coming soon" / "PPP coming soon" lingers stale | Add a `// TODO 2026-Q3 review` comment beside each phrase |

## Out-of-repo / handover items

These are not code, but the work is incomplete without them:

1. Netlify dashboard: enable form notifications to `info@eucalyptsmelbourne.au` after first deploy detects the form
2. Confirm `info@eucalyptsmelbourne.au` mailbox is monitored (Vicky)
3. Decide per-person pricing before "PPP coming soon" line gets stale
4. Source any additional/preferred photos if Vicky has better ones than the three selected

## Open questions for implementation

None blocking. The implementation plan can proceed.

---

## Implementation status (2026-04-27)

Code complete on `main`. The following must be done **after** the first deploy lands on Netlify:

1. ☐ Netlify dashboard → Forms → `walk-enquiry` → enable email notifications to `info@eucalyptsmelbourne.au`
2. ☐ Submit a test enquiry on the deploy preview to confirm email delivery
3. ☐ Confirm `info@eucalyptsmelbourne.au` mailbox is monitored
4. ☐ Decide per-person pricing before the "PPP coming soon" line gets stale (review 2026-Q3)

### Pre-existing test failures observed but not fixed (out of spec scope)

These were failing on `main` before this work; they are noted here so a follow-up can address them:

- `tests/e2e/a11y.test.ts` home page: `.method-links a` contrast 4.49:1 (needs 4.5:1) — terracotta `--color-cta` on `#f0ebe4` cream alt-section background. Fix by darkening `--color-cta` slightly or lightening the alt-section background.
- `tests/integration/content-loading.test.ts`: asserts `.showcase-grid figure` and a single `a[href*="stripe.com"]` on home/buy. The site has since simplified — the showcase grid was removed and the buy page now has 2 stripe links. Update assertions to match current structure.
