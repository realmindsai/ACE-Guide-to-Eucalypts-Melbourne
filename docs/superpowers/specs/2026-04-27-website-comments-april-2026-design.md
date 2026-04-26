# Design — Website Comments April 2026

**Date:** 2026-04-27
**Source:** `~/Downloads/website comments april 2026.docx` (Vicky Shukuroglou)
**Companion image:** `~/Downloads/goniocalyx leaf juv - www.tif`

## Purpose

Apply Vicky's April 2026 round of edits to the ACE Guide to Eucalypts Melbourne website. This is a content-and-polish pass, not a feature change: navigation behaviour, the Acknowledgment of Country text, the home/melbourne/about/FAQ page copy, one cosmetic CSS change, and a candidate species photo swap.

The work is intentionally scoped to what Vicky listed. No unrelated refactoring.

## Decisions made during brainstorming

1. **Sticky navbar** — pin on all pages (Vicky asked the question; Dennis chose option A: sticky on all pages).
2. **Eucalypt Australia quote** — *comment out*, do not delete. Preserves the entry so it can be restored by toggling `featured: true`.
3. **Sharp corners — site-wide** — apply `border-radius: 0` to every image on the site, including species detail macro photos. Dennis's call: simpler than carving out exceptions, and consistent with the visual direction Vicky asked for on the cover.
4. **Goniocalyx juvenile leaf trial** — convert the `.tif` to `.jpg`, check it in alongside existing book-images, and swap it into the "Photographed with care" figure in place of `fulgens-leaf.jpg`. Treat as a "compare in browser" trial; revertible if it doesn't look better.

## Scope

### 1. Navigation (`src/components/Nav.astro`)

- Make `<nav>` sticky: `position: sticky; top: 0; z-index: 10;` plus a solid background colour so content doesn't bleed through on scroll.
- Rename the brand text: `ACE Eucalypts` → `ACE Guide to Eucalypts Melbourne`.
- Make the brand text inactive — Vicky says it does not need to be a clickable button. Replace the `<a href={url('/')}>` with a `<span class="nav-logo">` (still styled the same; aria-label preserved as a `title` or removed).

### 2. Acknowledgment of Country (`src/components/AcknowledgmentOfCountry.astro`)

Replace the `<p>` body with Vicky's revised text:

> The eucalypts in this guide grow on the lands of the Wurundjeri Woi-wurrung, Bunurong/Boon Wurrung and Wadawurrung/Wathaurong peoples of the Eastern Kulin Nation. These trees and their connected environments have been known, named, and cared for by Aboriginal people for tens of thousands of years. We pay our respects to Elders and all communities in care of Country. We acknowledge that sovereignty was never ceded.

Diff vs. current:

- Adds **Wadawurrung/Wathaurong** as a third People named.
- Adds **"and their connected environments"** after "These trees".
- Replaces "We pay our respects to Elders past, present, and emerging" with **"We pay our respects to Elders and all communities in care of Country"**.
- Keeps the explicit sovereignty acknowledgment.
- Component is shared by `index.astro` and `melbourne.astro`, so one edit covers both pages.
- Update the placeholder comment block at the top of the file (lines 9-11) — drop "PLACEHOLDER", note that the wording is the author's reviewed copy.

### 3. Endorsements collection (`src/content/endorsements/`)

- `eucalypt-australia.md` — set `featured: false` and add an inline comment `# REMOVED PER VICKY APRIL 2026 — restore by setting featured: true`. This is the content-collection equivalent of "comment out": the file stays, the entry stops appearing on the site.
- `just.md` — change `uses by first peoples` → `uses by First Peoples` (capital F, capital P).

### 4. Home page (`src/pages/index.astro`)

- The page title "ACE Guide to Eucalypts Melbourne" already includes Melbourne; Vicky's note is about the **visible heading**. Inspect: the current visible h1 is "Know the trees around you" with eyebrow "ACE Guide to Eucalypts". The fix per her note: change the eyebrow to **"ACE GUIDE TO EUCALYPTS MELBOURNE"**, all caps as written, so the visible top-of-page label includes "MELBOURNE".
- The Eucalypt Australia quote removal is handled by the endorsements collection change above (no markup change in `index.astro`). The featured filter `e.data.featured === true` will skip it automatically.
- The "Identified by bark, fruit, bud, and leaf" section: replace the two `<p>` paragraphs with Vicky's revised copy:
  > Identify trees year-round with a simple, step-by-step method.
  >
  > No botanical training required. Life-scaled photography reveals each detail clearly, so you can compare it with the tree in front of you.

### 5. Melbourne page (`src/pages/melbourne.astro`)

- "Photographed with care" figure swap: replace the `fulgsLeaf` import and its figure with a new `goniLeafJuv` import (`../assets/book-images/goniocalyx-leaf-juv.jpg`). Update alt text and figcaption from "Peppermint (Eucalyptus fulgens)" to "Long-leafed Box (Eucalyptus goniocalyx) — juvenile leaf". Keep the `figure.leaf-crop` wrapper if the new image benefits from it; remove if not.
- "Identified by bark, fruit, bud, and leaf" section paragraphs: replace with Vicky's revised copy. Note her wording change "32 indigenous and 4 of the introduced" — preserve verbatim.
- Eucalypt Australia quote: handled via the endorsements `featured: false` change.

### 6. About page (`src/pages/about.astro`)

- Replace the **About the Guide** intro and three follow-up paragraphs with Vicky's new copy (mentions year-round method, intimate photography, Indigenous knowledge, 36 species across greater Melbourne). Preserve the existing `<p class="lead">` styling on the lead paragraph.
- Replace **Vicky's bio** with the new version. Notable changes: drops "Hardie Grant" publisher, drops "multidisciplinary" intro, adds **Booktopia Best Beautiful Books 2020** + **2021 ABIA shortlisting**, reframes the Melbourne collaboration as "worked closely with Rod Fensham on the text, jointly developing and refining the content."
- Replace **Rod's bio** with the new version. Notable changes: drops the "developed the ACE identification method" framing in favour of the "Fellowship of the Spring" credential and the **2020 pandemic origin story** for the Brisbane edition. The Brisbane method is described as "using bark texture and leaf colour" (Vicky's exact phrasing — preserve, even though it differs from the bark/fruit/bud/leaf framing used elsewhere).
- **Dahl Fellowship** section: already at the bottom (per recent commit `79b1a48`). Confirm copy matches Vicky's new wording — minor tweak: "supporting research and education" → "contributing to research and education" if that's how she wrote it. Preserve the existing link to eucalyptaustralia.org.au.

### 7. FAQ page (`src/pages/faq.astro`)

The current FAQ array has 14 entries. Vicky's docx provides revised copy for 8 of them (the ones that weren't already updated by commit `5cab71b`):

1. Do I need any botanical knowledge to use these guides?
2. Will I actually learn to identify eucalypts, or will I just be looking things up each time?
3. Do I need to know botanical language?
4. What does each species entry include?
5. Will I learn about the local ecology — not just the names?
6. Is it actually pocket-sized?
7. Can I use it with children or in an educational setting?
8. Is it just for botanists and serious naturalists?

Replace the `a:` template-literal value for each of these eight entries with Vicky's revised text. Preserve formatting conventions (template literals, leading whitespace per existing style). Do not touch the other 6 entries (suburb, species key, flowering, indigenous knowledge, beginner identification, how-to-buy).

### 8. CSS — sharp corners site-wide

Set `border-radius: 0` on every image on the site. Affected selectors:

- `src/pages/index.astro` `.book-card img`
- `src/pages/melbourne.astro` `.hero-cover img`
- `src/pages/melbourne.astro` `.spreads-grid img`
- `src/pages/melbourne.astro` `.botany-grid img` (species macro photos)

Implementation: rather than editing each rule individually, prefer a single global rule in `src/styles/global.css` (e.g. `img { border-radius: 0; }`) that overrides the per-page 4px declarations. If any per-page declaration still wins by specificity, override locally. Verify by inspecting at least one image on each page.

No exceptions: cover, spreads, species photos, and any future imagery all render with square corners.

### 9. New asset: `goniocalyx-leaf-juv.jpg`

- Source: `~/Downloads/goniocalyx leaf juv - www.tif` (3.6MB TIFF).
- Convert to JPEG using `sips` (macOS native) at quality ~85, output to `src/assets/book-images/goniocalyx-leaf-juv.jpg`.
- Strip any EXIF orientation metadata if it causes display rotation issues.
- Resize if needed to match the dimensions of the existing leaf images (~1500-2000px on the long edge is sufficient given the `width={500}` rendered size).
- Commit alongside the markup change.

## Out of scope

- No design system changes, no new components, no new pages.
- No FAQ schema/markup restructure — only answer text changes.
- No changes to the Stripe link, ISBN, price, or other commerce details.
- No `Endorsement` component code changes — the `featured: false` toggle is content-side only.

## Testing & verification

- `npm run build` succeeds with no Astro/TypeScript errors.
- `npm run dev`: visit each page (`/`, `/melbourne/`, `/about/`, `/faq/`, `/buy/`) and confirm:
  - Sticky navbar stays visible on scroll across all pages, on desktop and at narrow viewport.
  - Brand text reads "ACE Guide to Eucalypts Melbourne" and is not clickable.
  - Eucalypt Australia endorsement is absent from home and melbourne pages.
  - Karl's quote shows "First Peoples".
  - New AoC text appears on home and melbourne pages.
  - All images render with square corners (cover, spreads, species macro photos, everything).
  - The new goniocalyx juvenile leaf image renders in "Photographed with care" — visual comparison with previous fulgens version (Dennis + Vicky decide together whether to keep).
  - All eight updated FAQ answers match Vicky's wording.
  - About page copy matches Vicky's new versions for both bios and the intro.
- Existing Playwright tests in `tests/` still pass (`npx playwright test`).

## Rollback

Every change is a single git commit (or a small batch of commits grouped by section). Revert is straightforward via `git revert`. The Eucalypt Australia endorsement returns by flipping `featured: true`. The leaf photo swap reverts by re-importing `fulgens-leaf.jpg` and reverting the figure block.
