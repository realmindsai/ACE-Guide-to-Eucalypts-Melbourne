# Remove Brisbane content from the ACE Eucalypts website

**Date:** 2026-04-23
**Status:** Approved design
**Supersedes dual-book framing in:** `docs/superpowers/specs/2026-04-06-ace-eucalypts-website-design.md`, `docs/superpowers/plans/2026-04-06-ace-eucalypts-website.md`

## Context

The site was originally designed as a dual-book landing for two products — the *ACE Guide to Eucalypts Melbourne* (co-authored by Vicky Shukuroglou and Rod Fensham) and the *ACE Guide to Eucalypts Brisbane* (Rod Fensham's earlier solo book, 2021). The Melbourne guide's bark-and-leaf identification method was first published in the Brisbane guide, so the two are linked by lineage.

The site is pivoting to **Melbourne-only**. The Brisbane book is still a real product — it simply doesn't belong on this site. It will be acknowledged only as methodology lineage inside Rod's author bio (no outbound link).

## Intent

- Visitors arriving at this site see a single-book site for the Melbourne guide.
- Brisbane is mentioned exactly once (Rod's bio, as the book that established the method) and not linked.
- `/brisbane/` URL returns 404. Site is pre-launch, so there are no bookmarks to preserve.
- The layout — hero, buy page, FAQ — is rebalanced for a single product, not visibly trimmed from a two-product design.

## Decisions locked upstream

| Decision | Chosen | Rationale |
|---|---|---|
| Brisbane presence on site | Mentioned only in Rod's bio as methodology lineage | Brisbane book exists but is a separate product |
| Link to Brisbane from Rod's bio | **No link** | Citation only; outbound link not wanted |
| `/brisbane/` URL handling | **Return 404** | Pre-launch, no traffic bookmarks exist |
| Koala Foundation retailer link | **Remove entirely** | Labelled as Brisbane edition; not kept |
| Historical spec + plan docs | **Preserve with dated header note** | Retains design provenance |
| Scope | **Thorough rebrand** (Approach 2) | Surgical removal leaves unbalanced grids and stale dual-book copy |

## Files removed

- `src/pages/brisbane.astro`
- `src/assets/book-images/brisbane-cover.jpg`

## Files edited

### `src/components/Nav.astro`
- Remove the Brisbane nav item (line 8 of current file: `{ href: url('/brisbane/'), label: 'Brisbane' }`).

### `src/components/Footer.astro`
- Delete the `retailers` array (contained only the Koala Foundation "Brisbane edition" link) and the retailer `<ul>`.
- Keep the `<h2>Get the Book</h2>` heading. Replace the retailer list with a single link to `/buy/` ("Buy the guide"). Keep "Or ask your local bookshop."

### `src/pages/index.astro`
- Remove `brisbaneCover` import.
- Rewrite `siteSchema.description`, page `title`, page `description`, and hero subtitle to singular Melbourne framing.
- Collapse `<div class="books-spread">` from two-card grid to a single centered Melbourne cover (max-width ~360px, `margin-inline: auto`).
- Remove the `Buy Brisbane` `<BuyButton>`.
- Remove the "See the Brisbane guide →" link in the method section. Keep the Melbourne link (or drop the `.method-links` div if a single link reads orphaned — implementer's call).
- CSS: change `.books-spread` from `grid-template-columns: 1fr 1fr` to single centered image; remove the mobile grid `@media` override.

### `src/pages/buy.astro`
- Remove `brisbaneCover` import and `brisbaneStripeLink` constant.
- Remove the Brisbane `ListItem` from `pageSchema.itemListElement`. With only Melbourne remaining, optionally simplify the wrapper from `ItemList` to a bare `Book` schema (either is acceptable).
- Delete `otherRetailers` array and the entire `.buy-secondary` "Also available from" block.
- Page `title`: "Buy the ACE Guide to Eucalypts Melbourne". Page `description`: singular framing.
- `<h1>`: "Choose your edition" → "Buy the Guide".
- Delete the Brisbane `<div class="edition-card">` block entirely.
- CSS: `.editions-grid` drops to single-column; remove the `@media (max-width: 860px)` override.

### `src/pages/about.astro`
- Rewrite meta `description` to drop Brisbane.
- Rewrite the intro paragraph from "series of pocket field guides" to singular Melbourne framing.
- Delete the sentence "The Brisbane edition covers 37 species across greater Brisbane's bushland reserves." Keep the Melbourne sentence in the same paragraph.
- **Keep** the paragraph in Rod's bio referencing the Brisbane guide as where the method was first published — this is the methodology-precursor mention we're preserving.
- Remove the `Get the Brisbane Edition` `<BuyButton>`.

### `src/pages/faq.astro`
- "Does the guide cover my suburb?" — remove the Brisbane paragraph; keep the Melbourne answer only.
- "Does it include indigenous knowledge?" — drop the Jagera/Turrbal/Brisbane clause; language names become just "Wurundjeri Woi-wurrung and Bunurong/Boon Wurrung."
- **Delete entirely** the FAQ item "What's the difference between the Melbourne and Brisbane editions?"
- "How do I buy a copy?" — rewrite singular: "The guide is available directly through this website via secure Stripe checkout — $30 AUD per copy plus $7.50 postage & handling anywhere in Australia. No account needed. You can also order through any Australian bookshop using the ISBN. Bulk and wholesale orders: email aceguidetoeucalypts@gmail.com."
- Rewrite page meta `description` for a single guide.
- Remove the `Buy Brisbane` `<BuyButton>` in the CTA row.

### `src/pages/authors.astro`
- **No changes.** Rod's existing bio already handles Brisbane as methodology lineage (no link).

## Files preserved with historical note

Prepend this block to the top of both files:

```markdown
> **Note (2026-04-23):** Brisbane content has been removed from the live site.
> This document is preserved as a historical record of the original dual-book design.
> For the current single-book design, see
> `docs/superpowers/specs/2026-04-23-remove-brisbane-content-design.md`.
```

- `docs/superpowers/specs/2026-04-06-ace-eucalypts-website-design.md`
- `docs/superpowers/plans/2026-04-06-ace-eucalypts-website.md`

## Testing

### Audit existing tests
Read every file in `tests/e2e/` and `tests/integration/` and classify:
- **Brisbane-only** (visits `/brisbane/`, asserts the Brisbane Stripe link, checks the Brisbane cover loads) → delete.
- **Dual-book** (asserts nav contains both cities, asserts two buy cards, asserts two book-cards in the hero grid) → update to single-book.
- **Melbourne-only / generic** → no changes.

### New assertions to add
- `/brisbane/` returns 404.
- Nav contains no "Brisbane" link.
- Footer contains no "Koala Foundation" text and no "(Brisbane edition)" label.
- Index hero renders exactly one book card (Melbourne, centered).
- Buy page renders exactly one edition card; no "Also available from" section.
- FAQ does not contain the strings "Brisbane edition", "Jagera", or "Turrbal".

### Pre-commit verification
- `npm run build` succeeds (no broken imports, no missing routes).
- Case-insensitive grep for `brisbane` in `src/` returns **only** the mentions in Rod's bio on `authors.astro` and `about.astro`. Any other hit is a miss to fix.
- Playwright e2e suite passes.
- `npm run dev` visual spot-check across home, about, faq, buy, authors, melbourne, and `/brisbane/` (expect 404). Check mobile viewport — the collapsed single-book hero and single-column buy page should not look orphaned.

### Out of scope
Writing net-new tests for Melbourne features not previously covered. The existing suite's coverage is the baseline; we don't backfill.

## Implementation commit sequence

Branch: `remove-brisbane-content`. Each commit builds and tests clean on its own.

1. **`chore: remove Brisbane nav, footer, and retailer references`** — `Nav.astro`, `Footer.astro`.
2. **`feat: collapse index hero to single-book layout`** — `index.astro` (imports, meta, books-spread, CTA, method link, CSS).
3. **`feat: collapse buy page to single edition layout`** — `buy.astro` (imports, Stripe constant, JSON-LD, edition cards, retailers section, CSS).
4. **`chore: rewrite about and faq copy for single-book site`** — `about.astro`, `faq.astro`.
5. **`chore: remove Brisbane page and cover asset`** — delete `src/pages/brisbane.astro` and `src/assets/book-images/brisbane-cover.jpg`. The 404 is emergent from the page's absence.
6. **`test: update e2e and integration tests for single-book site`** — test file changes plus the new 404 assertion.
7. **`docs: mark 2026-04-06 spec and plan as historical`** — prepend the note block to both and add this spec.

Order 1–4 is narrative, not structural; reviewers can follow the pivot page by page.

## Rollback

Pre-launch, no external bookmarks. If a regression appears, `git revert` the specific commit or the whole range. No redirect infrastructure to unwind. Stripe Brisbane checkout URL is untouched — it still lives at Stripe; the site merely stops surfacing it. If Brisbane ever returns to this site, no commerce rebuild is needed.

## Out of scope

- Domain / site-name decision (tracked separately — the `euc`-based shortlist brainstorm).
- Any content changes to the Melbourne product itself (species entries, photos, endorsements).
- SEO / indexing cleanup, since the site is pre-launch.
- Refactoring shared components (e.g., extracting a reusable `BookCard`) — the site now has one book; any such abstraction would be speculative.
