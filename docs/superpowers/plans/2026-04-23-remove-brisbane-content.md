# Remove Brisbane Content Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Pivot the ACE Eucalypts Melbourne site from a dual-book landing (Melbourne + Brisbane) to a Melbourne-only single-book site, while preserving the one intended mention of the Brisbane guide in Rod Fensham's author bio as methodology lineage.

**Architecture:** Static Astro site. Changes are page-level edits, asset deletion, layout-grid collapse from 2-col to 1-col on the index and buy pages, prose rewrites on about and faq, and deletion of `src/pages/brisbane.astro`. No new components, no new abstractions. Tests updated to assert the post-change state; historical spec/plan docs preserved with a dated header note.

**Tech Stack:** Astro 6, TypeScript, Playwright (e2e + integration), `@astrojs/sitemap`, `@axe-core/playwright` for a11y.

**Spec:** `docs/superpowers/specs/2026-04-23-remove-brisbane-content-design.md`

---

## Prerequisites

- Node `>=22.12.0` (per `package.json` engines).
- `npm install` already run.
- Working tree clean on `main` (or acceptable to branch from current state).

## Known pre-existing test drift

A dry inspection reveals the current test suite has assertions that don't match current code (e.g., `tests/e2e/navigation.test.ts` expects 4 nav links, and Nav.astro has 6; `tests/integration/content-loading.test.ts` looks for `.hero-cover` and `.showcase-grid` selectors not present on the current index). This plan treats those as **pre-existing drift**, not our problem. Chunk 0 captures the baseline so anything we don't touch keeps its current pass/fail status; we're responsible only for assertions that are about Brisbane or about the pages we modify.

---

## Chunk 0: Branch and baseline

### Task 0.1: Create working branch

**Files:**
- None (git operation)

- [ ] **Step 1: Create and switch to the feature branch**

```bash
git checkout -b remove-brisbane-content
```

- [ ] **Step 2: Confirm clean starting state**

```bash
git status
```

Expected: `On branch remove-brisbane-content` and `nothing to commit, working tree clean` (or only untracked items the user previously had — do NOT stage those).

### Task 0.2: Capture test baseline

**Files:**
- Create (scratch, gitignored): `/tmp/ace-brisbane-baseline.txt`

- [ ] **Step 1: Run a full build to confirm starting state compiles**

```bash
npm run build
```

Expected: Build completes with exit code 0. Note any warnings; they're part of the baseline.

- [ ] **Step 2: Run the full test suite and capture results**

```bash
npm test 2>&1 | tee /tmp/ace-brisbane-baseline.txt
```

Expected: Some tests may fail (see "Known pre-existing test drift"). Record exit code, passing count, failing count. Do not fix unrelated failures.

- [ ] **Step 3: Grep the codebase for Brisbane references and save the list**

```bash
grep -rn -i "brisbane" src/ docs/ tests/ 2>/dev/null | grep -v ".worktrees" | tee /tmp/ace-brisbane-references.txt
```

Keep this handy — it's your checklist of every line to either remove or preserve. The only lines that should remain at the end are:
- `src/pages/authors.astro` (Rod's bio, line ~68)
- `src/pages/about.astro` (Rod's bio, line ~75)
- `docs/superpowers/specs/2026-04-06-ace-eucalypts-website-design.md` (historical)
- `docs/superpowers/plans/2026-04-06-ace-eucalypts-website.md` (historical)
- `docs/superpowers/specs/2026-04-23-remove-brisbane-content-design.md` (this work's spec)
- `docs/superpowers/plans/2026-04-23-remove-brisbane-content.md` (this plan)

---

## Chunk 1: Remove Brisbane from Nav and Footer

### Task 1.1: Remove Brisbane nav link

**Files:**
- Modify: `src/components/Nav.astro:8`

- [ ] **Step 1: Open the file and delete the Brisbane entry**

Delete line 8 (the Brisbane nav item):

```astro
  { href: url('/brisbane/'),  label: 'Brisbane' },
```

Final `navLinks` array (lines 5–12):

```astro
const navLinks = [
  { href: url('/'),           label: 'Home' },
  { href: url('/melbourne/'), label: 'Melbourne' },
  { href: url('/about/'),     label: 'About' },
  { href: url('/faq/'),       label: 'FAQ' },
  { href: url('/buy/'),       label: 'Buy' },
];
```

- [ ] **Step 2: Verify the build still compiles**

```bash
npm run build
```

Expected: exit 0.

### Task 1.2: Remove Brisbane retailer from Footer and replace with link to /buy/

**Files:**
- Modify: `src/components/Footer.astro`

- [ ] **Step 1: Replace the retailers array and list with a single link to the buy page**

Change lines 3–5 from:

```astro
const retailers = [
  { name: 'Australian Koala Foundation (Brisbane edition)', href: 'https://savethekoala.com/shop/products/book-ace-guide-to-eucalypts/' },
];
```

to (remove the array entirely):

```astro
// retailers removed — site is Melbourne-only
```

(Actually, simpler: delete lines 3–5 entirely and remove `retailers` references below.)

Change the footer body (lines 14–18) from:

```astro
      <ul role="list">
        {retailers.map(r => (
          <li><a href={r.href} target="_blank" rel="noopener">{r.name}</a></li>
        ))}
      </ul>
```

to:

```astro
      <p><a href="/buy/">Buy the guide</a></p>
```

Keep `<h2>Get the Book</h2>` (line 13) and keep `<p class="footer-indie">Or ask your local bookshop.</p>` (line 19).

Also delete the now-orphaned CSS rule `.footer-buy ul` (lines 50–55) and `.footer-buy a` (lines 57–59) since there's no `<ul>` or repeated link styling needed. Leave `.footer-indie` and the rest alone.

Final `src/components/Footer.astro` frontmatter (lines 1–7) becomes:

```astro
---
// src/components/Footer.astro
const currentYear = new Date().getFullYear();
---
```

- [ ] **Step 2: Build and spot-check footer**

```bash
npm run build
npm run preview &
sleep 2
curl -s http://localhost:4321/ | grep -A 6 'Get the Book'
pkill -f "astro preview" || true
```

Expected: footer section rendered; "Koala Foundation" does not appear; there's a link to `/buy/`.

### Task 1.3: Commit Chunk 1

- [ ] **Step 1: Stage the changes**

```bash
git add src/components/Nav.astro src/components/Footer.astro
git status
```

Expected: only `Nav.astro` and `Footer.astro` staged.

- [ ] **Step 2: Commit**

```bash
git commit -m "$(cat <<'EOF'
chore: remove Brisbane nav, footer, and retailer references

Drops the Brisbane item from the primary nav, removes the
Koala Foundation (Brisbane edition) retailer from the footer,
and replaces the footer retailer list with a direct link to /buy/.
EOF
)"
```

---

## Chunk 2: Collapse index.astro to single-book hero

### Task 2.1: Remove Brisbane import and rewrite meta

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Remove the `brisbaneCover` import**

Delete line 12:

```astro
import brisbaneCover  from '../assets/book-images/brisbane-cover.jpg';
```

- [ ] **Step 2: Rewrite `siteSchema.description` (line 22)**

Change:

```astro
  description: 'Pocket field guides to eucalypt species in Melbourne and Brisbane — identified by bark, fruit, bud, and leaf.',
```

to:

```astro
  description: 'A pocket field guide to Melbourne\'s eucalypt species — identified by bark, fruit, bud, and leaf.',
```

- [ ] **Step 3: Rewrite the Base page title and description (lines 27–28)**

Change:

```astro
  title="ACE Guide to Eucalypts — Melbourne &amp; Brisbane"
  description="Pocket field guides to Melbourne and Brisbane's eucalypt species. Identified by bark, fruit, bud, and leaf, photographed in intimate detail."
```

to:

```astro
  title="ACE Guide to Eucalypts Melbourne"
  description="A pocket field guide to Melbourne's eucalypt species. Identified by bark, fruit, bud, and leaf, photographed in intimate detail."
```

- [ ] **Step 4: Rewrite the hero subtitle (lines 38–41)**

Change:

```astro
        <p class="hero-subtitle">
          Pocket field guides to Melbourne and Brisbane's eucalypt species —
          identified by bark, fruit, bud, and leaf, photographed in intimate detail.
        </p>
```

to:

```astro
        <p class="hero-subtitle">
          A pocket field guide to Melbourne's eucalypt species —
          identified by bark, fruit, bud, and leaf, photographed in intimate detail.
        </p>
```

### Task 2.2: Collapse the books-spread grid

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Remove the Brisbane `book-card` anchor**

Delete lines 59–71 (the entire second `<a class="book-card">` block for Brisbane):

```astro
        <a href={url('/brisbane/')} class="book-card">
          <Image
            src={brisbaneCover}
            alt="ACE Guide to Eucalypts Brisbane — softcover field guide"
            width={320}
            loading="eager"
            fetchpriority="high"
          />
          <div class="book-label">
            <span class="book-city">Brisbane</span>
            <span class="book-species">37 species</span>
          </div>
        </a>
```

After this edit, `<div class="books-spread">` contains only the Melbourne anchor.

- [ ] **Step 2: Update `.books-spread` CSS for single-book layout**

Replace lines 158–172 (the `.books-spread` rule block + mobile override):

```css
  .books-spread {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-md);
    max-width: 680px;
    margin-inline: auto;
  }

  @media (max-width: 480px) {
    .books-spread {
      grid-template-columns: 1fr 1fr;
      gap: var(--space-sm);
    }
  }
```

with:

```css
  .books-spread {
    max-width: 360px;
    margin-inline: auto;
  }
```

Remove the `@media (max-width: 480px)` override entirely — no grid, no override needed.

### Task 2.3: Remove Brisbane CTA button and method-section link

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Delete the Buy Brisbane button**

Delete line 76:

```astro
        <BuyButton text="Buy Brisbane — $30 AUD" href="https://buy.stripe.com/4gM6ozcwSguW5m78KhgjC02" external={true} />
```

- [ ] **Step 2: Delete the "See the Brisbane guide →" link in the method section**

Delete line 112:

```astro
        <a href={url('/brisbane/')}>See the Brisbane guide →</a>
```

After this edit, `.method-links` contains only the Melbourne link. **Keep** the surrounding `<div class="method-links">...</div>` and its CSS rules unchanged — no visual risk, no CSS cleanup required. (If later visual review finds the single-link row awkward, a follow-up can flatten it — out of scope here.)

- [ ] **Step 3: Build and preview**

```bash
npm run build
```

Expected: exit 0, no "brisbane-cover" referenced in any generated HTML. Manually run `npm run dev` to check visual balance of the collapsed hero and method section before committing.

### Task 2.4: Commit Chunk 2

- [ ] **Step 1: Verify no Brisbane hits remain in index.astro**

```bash
grep -in "brisbane" src/pages/index.astro
```

Expected: zero lines returned.

- [ ] **Step 2: Stage and commit**

```bash
git add src/pages/index.astro
git commit -m "$(cat <<'EOF'
feat: collapse index hero to single-book layout

Removes the Brisbane book card, Buy Brisbane button, and the "See the
Brisbane guide" link from the method section. Rewrites meta title,
description, and hero subtitle for a Melbourne-only site. Collapses
the two-column books-spread grid to a single centered cover.
EOF
)"
```

---

## Chunk 3: Collapse buy.astro to single edition

### Task 3.1: Remove Brisbane imports, constants, and schema entry

**Files:**
- Modify: `src/pages/buy.astro`

- [ ] **Step 1: Remove `brisbaneCover` import (line 8) and `brisbaneStripeLink` constant (line 13)**

Delete these two lines.

- [ ] **Step 2: Simplify `pageSchema` from ItemList to a single Book**

Replace lines 15–63 (the entire `pageSchema` with `ItemList` wrapper) with:

```astro
const pageSchema = {
  '@context': 'https://schema.org',
  '@type': 'Book',
  name: 'ACE Guide to Eucalypts Melbourne',
  author: [
    { '@type': 'Person', name: 'Vicky Shukuroglou' },
    { '@type': 'Person', name: 'Roderick Fensham' },
  ],
  isbn: '9780645232615',
  publisher: { '@type': 'Organization', name: 'ACE Publishing' },
  description: "A field guide to Melbourne's 36 eucalypt species, identified by bark, fruit, bud, and leaf.",
  offers: {
    '@type': 'Offer',
    availability: 'https://schema.org/InStock',
    priceCurrency: 'AUD',
    price: '30',
    url: melbourneStripeLink,
  },
};
```

This aligns with the existing `tests/e2e/schema.test.ts` assertion that the buy page has a `@type: 'Book'` schema with ISBN `9780645232615`.

- [ ] **Step 3: Remove the `otherRetailers` array**

Delete lines 65–67:

```astro
const otherRetailers = [
  { name: 'Australian Koala Foundation (Brisbane edition)', href: 'https://savethekoala.com/shop/products/book-ace-guide-to-eucalypts/' },
];
```

### Task 3.2: Rewrite page meta and heading

**Files:**
- Modify: `src/pages/buy.astro`

- [ ] **Step 1: Rewrite the Base title and description (lines 71–72)**

Change:

```astro
  title="Buy the ACE Guide to Eucalypts — Melbourne &amp; Brisbane"
  description="Purchase the ACE Guide to Eucalypts — Melbourne or Brisbane edition. $30 + $7.50 postage &amp; handling. Secure Stripe checkout."
```

to:

```astro
  title="Buy the ACE Guide to Eucalypts Melbourne"
  description="Purchase the ACE Guide to Eucalypts Melbourne. $30 + $7.50 postage &amp; handling. Secure Stripe checkout."
```

- [ ] **Step 2: Change the `<h1>` from "Choose your edition" to "Buy the Guide" (line 78)**

Change:

```astro
      <h1 class="buy-heading">Choose your edition</h1>
```

to:

```astro
      <h1 class="buy-heading">Buy the Guide</h1>
```

### Task 3.3: Remove the Brisbane edition card and collapse layout

**Files:**
- Modify: `src/pages/buy.astro`

- [ ] **Step 1: Delete the Brisbane edition card**

Delete lines 126–168 (the entire Brisbane `<div class="edition-card">` block, including its comment).

- [ ] **Step 2: Delete the "Also available from" section**

Delete lines 174–185 (`.buy-secondary` block). **Do not** delete line 173 (`<div class="buy-shared">`) — that wrapper must stay. The block to remove is:

```astro
        <div class="buy-secondary">
          <h2>Also available from</h2>
          <div class="retailer-buttons">
            {otherRetailers.map(r => (
              <BuyButton
                text={r.name}
                href={r.href}
                external={true}
              />
            ))}
          </div>
        </div>
```

- [ ] **Step 3: Simplify the "buy-indie" copy to drop "either edition"**

Change (around line 187–189):

```astro
        <p class="buy-indie">
          Or ask your local bookshop — they can order either edition by ISBN.
        </p>
```

to:

```astro
        <p class="buy-indie">
          Or ask your local bookshop — they can order it by ISBN.
        </p>
```

- [ ] **Step 4: Simplify the "buy-gift" copy from plural to singular (optional, consistency)**

Change:

```astro
        <p class="buy-gift">
          Know someone who walks in the bush? These make a meaningful gift.
        </p>
```

to:

```astro
        <p class="buy-gift">
          Know someone who walks in the bush? It makes a meaningful gift.
        </p>
```

- [ ] **Step 5: Collapse `.editions-grid` CSS to single column**

Replace lines 208–220:

```css
  .editions-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--space-lg);
    align-items: start;
    margin-bottom: var(--space-lg);
  }

  @media (max-width: 860px) {
    .editions-grid {
      grid-template-columns: 1fr;
    }
  }
```

with:

```css
  .editions-grid {
    max-width: 640px;
    margin-inline: auto;
    margin-bottom: var(--space-lg);
  }
```

Leave `.edition-card` and nested rules alone — they still render a single card.

- [ ] **Step 6: Remove now-orphaned CSS for `.buy-secondary` and `.retailer-buttons`**

Delete lines 282–306 (the `.buy-secondary`, `.buy-secondary h2`, `.retailer-buttons`, and two `:global(.buy-button)` rules inside `.retailer-buttons`). They no longer have any markup to target.

### Task 3.4: Commit Chunk 3

- [ ] **Step 1: Verify no Brisbane hits remain**

```bash
grep -in "brisbane" src/pages/buy.astro
```

Expected: zero lines.

- [ ] **Step 2: Verify the build and that schema.test.ts assertions still hold**

```bash
npm run build
npm test -- tests/e2e/schema.test.ts 2>&1 | tail -20
```

Expected: build exits 0. schema.test.ts "buy page has Book schema with Stripe offer" passes (or, if it was failing in baseline for unrelated reasons, at least does not newly fail for Brisbane reasons).

- [ ] **Step 3: Commit**

```bash
git add src/pages/buy.astro
git commit -m "$(cat <<'EOF'
feat: collapse buy page to single edition layout

Removes the Brisbane edition card, Brisbane Stripe link constant,
Brisbane JSON-LD ListItem, and the Koala Foundation retailer block.
Simplifies pageSchema from ItemList to a bare Book. Rewrites meta
and heading for a single-product buy page. Collapses the two-column
editions-grid to a single centered card.
EOF
)"
```

---

## Chunk 4: Rewrite about.astro and faq.astro

### Task 4.1: Edit about.astro

**Files:**
- Modify: `src/pages/about.astro`

- [ ] **Step 1: Rewrite the meta description (line 12)**

Change:

```astro
  description="About the ACE Guide to Eucalypts — field guides to Melbourne and Brisbane's eucalypt species, by Vicky Shukuroglou and Rod Fensham."
```

to:

```astro
  description="About the ACE Guide to Eucalypts Melbourne — by Vicky Shukuroglou and Rod Fensham."
```

- [ ] **Step 2: Rewrite the intro paragraph (lines 17–20)**

Change:

```astro
  <p class="lead">
    The ACE Guide to Eucalypts is a series of pocket field guides to Australia's eucalypt
    species — practical, beautiful, and built to be used in the bush, not just on a bookshelf.
  </p>
```

to:

```astro
  <p class="lead">
    The ACE Guide to Eucalypts Melbourne is a pocket field guide to Melbourne's eucalypt
    species — practical, beautiful, and built to be used in the bush, not just on a bookshelf.
  </p>
```

- [ ] **Step 3: Remove the Brisbane sentence from paragraph 3 (lines 29–33)**

Change:

```astro
  <p>
    The Melbourne edition covers 36 species — 32 indigenous and 4 introduced — across
    greater Melbourne. The Brisbane edition covers 37 species across greater Brisbane's
    bushland reserves.
  </p>
```

to:

```astro
  <p>
    The Melbourne edition covers 36 species — 32 indigenous and 4 introduced — across
    greater Melbourne.
  </p>
```

- [ ] **Step 4: Preserve Rod's bio paragraph (lines 69–80) — no changes**

Confirm lines 71–76 (Rod's bio) still reference the Brisbane guide as "where the method was first published". This is the one Brisbane mention we intentionally keep.

- [ ] **Step 5: Remove the Brisbane buy button (line 86)**

Change the `.about-cta` div from:

```astro
  <div class="about-cta">
    <BuyButton text="Get the Melbourne Edition" href="https://buy.stripe.com/00w3cn2Wi7Yq7uf3pXgjC01" external={true} />
    <BuyButton text="Get the Brisbane Edition" href="https://buy.stripe.com/4gM6ozcwSguW5m78KhgjC02" external={true} />
  </div>
```

to:

```astro
  <div class="about-cta">
    <BuyButton text="Get the Melbourne Edition" href="https://buy.stripe.com/00w3cn2Wi7Yq7uf3pXgjC01" external={true} />
  </div>
```

(Alternatively rename the text to just "Get the Guide" — but keeping "Melbourne Edition" remains informative and consistent with the buy page heading. Implementer's call.)

- [ ] **Step 6: Verify the only remaining Brisbane reference is Rod's methodology citation**

```bash
grep -n -i "brisbane" src/pages/about.astro
```

Expected: exactly one hit — Rod's bio paragraph around line 75 ("ACE Guide to Eucalypts: Brisbane").

### Task 4.2: Edit faq.astro

**Files:**
- Modify: `src/pages/faq.astro`

- [ ] **Step 1: Rewrite the "Does the guide cover my suburb?" answer (lines 20–26)**

Change:

```astro
    a: `The Melbourne edition covers the greater Melbourne region — broadly from the Dandenong
        Ranges in the east toward the Otway foothills, including many of Melbourne's parks
        and bushland reserves. If you're on the urban fringe or in a less common habitat type,
        you may occasionally encounter species not covered.

        The Brisbane edition focuses on greater Brisbane's bushland reserves, with a map
        and quick-reference list to help you find particular species. Coverage varies by area.`,
```

to:

```astro
    a: `The Melbourne edition covers the greater Melbourne region — broadly from the Dandenong
        Ranges in the east toward the Otway foothills, including many of Melbourne's parks
        and bushland reserves. If you're on the urban fringe or in a less common habitat type,
        you may occasionally encounter species not covered.`,
```

- [ ] **Step 2: Rewrite the "Does it include indigenous knowledge?" answer (the object spanning lines 44–52, with the `a:` backtick string on lines 46–51)**

Change:

```astro
    a: `Yes, where it was available to include. Species entries acknowledge Aboriginal
        knowledge connected to that species and include names in local language —
        Wurundjeri Woi-wurrung and Bunurong/Boon Wurrung for Melbourne, local Jagera
        and Turrbal language names for Brisbane. The guides recognise that these trees
        have been known, named, and used by Aboriginal people for a very long time,
        though the coverage of this knowledge varies by species.`,
```

to:

```astro
    a: `Yes, where it was available to include. Species entries acknowledge Aboriginal
        knowledge connected to that species and include names in Wurundjeri Woi-wurrung
        and Bunurong/Boon Wurrung language. The guide recognises that these trees
        have been known, named, and used by Aboriginal people for a very long time,
        though the coverage of this knowledge varies by species.`,
```

- [ ] **Step 3: Delete the "What's the difference between the Melbourne and Brisbane editions?" FAQ item (lines 93–100)**

Delete the entire object literal:

```astro
  {
    q: 'What\'s the difference between the Melbourne and Brisbane editions?',
    a: `They cover different regions and largely different species — 36 for Melbourne
        (32 indigenous, 4 introduced) and 37 for Brisbane (36 local, 1 naturalised).
        The Melbourne edition was co-authored by Vicky Shukuroglou and Rod Fensham;
        the Brisbane edition is by Rod Fensham alone. Both use the same ACE identification
        method and similar format. There's some species overlap between regions.`,
  },
```

Ensure the comma handling is correct — the item that follows ("Is it actually pocket-sized?") now has a leading comma from the removed item's trailing comma; that's fine in a JS array literal.

- [ ] **Step 4: Rewrite the "How do I buy a copy?" answer (lines 125–131)**

Change:

```astro
    a: `Both editions are available directly through this website via secure Stripe checkout —
        $30 AUD per copy plus $7.50 postage &amp; handling anywhere in Australia. No account needed.
        You can also order either edition through any Australian bookshop using the ISBN,
        or find them at selected retailers including the Australian Koala Foundation.
        Bulk and wholesale orders: email aceguidetoeucalypts@gmail.com.`,
```

to:

```astro
    a: `The guide is available directly through this website via secure Stripe checkout —
        $30 AUD per copy plus $7.50 postage &amp; handling anywhere in Australia. No account needed.
        You can also order through any Australian bookshop using the ISBN.
        Bulk and wholesale orders: email aceguidetoeucalypts@gmail.com.`,
```

- [ ] **Step 5: Rewrite the page meta description (line 150)**

Change:

```astro
  description="Frequently asked questions about the ACE Guide to Eucalypts — Melbourne and Brisbane editions. Do you need botanical knowledge? Does it cover your suburb? Does it include indigenous knowledge?"
```

to:

```astro
  description="Frequently asked questions about the ACE Guide to Eucalypts Melbourne. Do you need botanical knowledge? Does it cover your suburb? Does it include indigenous knowledge?"
```

- [ ] **Step 6: Remove the Buy Brisbane button in the CTA row (line 178)**

Delete line 178:

```astro
      <BuyButton text="Buy Brisbane — $30 AUD" href="https://buy.stripe.com/4gM6ozcwSguW5m78KhgjC02" external={true} />
```

The `.faq-buttons` div now contains only the Melbourne button.

- [ ] **Step 7: Verify no Brisbane hits remain in faq.astro**

```bash
grep -in "brisbane\|jagera\|turrbal" src/pages/faq.astro
```

Expected: zero lines returned.

### Task 4.3: Commit Chunk 4

- [ ] **Step 1: Build**

```bash
npm run build
```

Expected: exit 0.

- [ ] **Step 2: Stage and commit**

```bash
git add src/pages/about.astro src/pages/faq.astro
git commit -m "$(cat <<'EOF'
chore: rewrite about and faq copy for single-book site

Drops Brisbane-specific paragraphs from about (intro, coverage
paragraph, and Brisbane CTA button) and from faq (suburb coverage,
language names, and the "what's the difference" FAQ item entirely).
Simplifies the buy answer to singular. Preserves Rod's bio citation
of the Brisbane guide as the methodology origin.
EOF
)"
```

---

## Chunk 5: Remove the Brisbane page and cover asset

### Task 5.1: Delete brisbane.astro

**Files:**
- Delete: `src/pages/brisbane.astro`

- [ ] **Step 1: Remove the file**

```bash
git rm src/pages/brisbane.astro
```

- [ ] **Step 2: Build — confirm no broken imports / no orphaned route**

```bash
npm run build
```

Expected: exit 0. The `dist/brisbane/` directory should not be generated.

```bash
ls dist/brisbane/ 2>&1 || echo "absent (expected)"
```

Expected: "absent (expected)".

### Task 5.2: Delete the Brisbane cover asset

**Files:**
- Delete: `src/assets/book-images/brisbane-cover.jpg`

- [ ] **Step 1: Confirm no remaining references**

```bash
grep -rn "brisbane-cover" src/ 2>/dev/null
```

Expected: zero lines. If anything returns, fix before deleting.

- [ ] **Step 2: Remove the file**

```bash
git rm src/assets/book-images/brisbane-cover.jpg
```

- [ ] **Step 3: Build to confirm Astro's asset pipeline is clean**

```bash
npm run build
```

Expected: exit 0, no warnings about unresolved imports.

### Task 5.3: Commit Chunk 5

- [ ] **Step 1: Stage and commit**

```bash
git status
git commit -m "$(cat <<'EOF'
chore: remove Brisbane page and cover asset

Deletes src/pages/brisbane.astro and src/assets/book-images/brisbane-cover.jpg.
The /brisbane/ route now returns 404 (Astro emits no route for a
deleted page). The site is pre-launch, so no redirect is needed.
EOF
)"
```

---

## Chunk 6: Update tests for single-book site

### Task 6.1: Add a /brisbane 404 assertion to navigation.test.ts

**Files:**
- Modify: `tests/e2e/navigation.test.ts`

- [ ] **Step 1: Extend the "removed pages return 404" test**

Change (lines 34–37):

```typescript
  test('removed pages return 404', async ({ page }) => {
    const response = await page.goto('/species/');
    expect(response?.status()).toBe(404);
  });
```

to:

```typescript
  test('removed pages return 404', async ({ page }) => {
    const speciesResponse = await page.goto('/species/');
    expect(speciesResponse?.status()).toBe(404);

    const brisbaneResponse = await page.goto('/brisbane/');
    expect(brisbaneResponse?.status()).toBe(404);
  });
```

- [ ] **Step 2: Run the navigation test**

```bash
npm test -- tests/e2e/navigation.test.ts 2>&1 | tail -20
```

Expected: "removed pages return 404" test passes. (Other tests in the file may still have pre-existing drift — don't fix unrelated failures.)

### Task 6.2: Add a build.test.ts assertion that /brisbane/ is not generated

**Files:**
- Modify: `tests/e2e/build.test.ts`

- [ ] **Step 1: Extend the "does not generate removed pages" test**

Change (lines 28–31):

```typescript
  test('does not generate removed pages', () => {
    expect(existsSync('dist/identify/index.html')).toBe(false);
    expect(existsSync('dist/species/index.html')).toBe(false);
  });
```

to:

```typescript
  test('does not generate removed pages', () => {
    expect(existsSync('dist/identify/index.html')).toBe(false);
    expect(existsSync('dist/species/index.html')).toBe(false);
    expect(existsSync('dist/brisbane/index.html')).toBe(false);
  });
```

- [ ] **Step 2: Run the build test**

```bash
npm test -- tests/e2e/build.test.ts 2>&1 | tail -20
```

Expected: "does not generate removed pages" passes.

### Task 6.3: Add a Brisbane-absence assertion to navigation or content-loading

**Files:**
- Modify: `tests/e2e/navigation.test.ts`

- [ ] **Step 1: Add a new test asserting Brisbane is gone from nav and footer**

Append inside the `test.describe('Navigation', () => { ... })` block:

```typescript
  test('nav and footer contain no Brisbane references', async ({ page }) => {
    await page.goto('/');

    const navText = await page.locator('nav').textContent();
    expect(navText?.toLowerCase()).not.toContain('brisbane');

    const footerText = await page.locator('footer').textContent();
    expect(footerText?.toLowerCase()).not.toContain('brisbane');
    expect(footerText?.toLowerCase()).not.toContain('koala foundation');
  });
```

- [ ] **Step 2: Run the test**

```bash
npm test -- tests/e2e/navigation.test.ts 2>&1 | tail -20
```

Expected: new test passes.

### Task 6.4: Assert index renders exactly one book card and buy renders exactly one edition card

**Files:**
- Modify: `tests/integration/content-loading.test.ts`

These two assertions come directly from the spec's "New assertions to add" section: "Index hero renders exactly one book card" and "Buy page renders exactly one edition card".

- [ ] **Step 1: Add the two assertions inside the `test.describe('Content loads correctly', ...)` block**

```typescript
  test('index hero renders exactly one book card', async ({ page }) => {
    await page.goto('/');
    const bookCards = page.locator('.books-spread .book-card');
    await expect(bookCards).toHaveCount(1);
  });

  test('buy page renders exactly one edition card', async ({ page }) => {
    await page.goto('/buy/');
    const editionCards = page.locator('.editions-grid .edition-card');
    await expect(editionCards).toHaveCount(1);
  });
```

- [ ] **Step 2: Run both new tests**

```bash
npm test -- tests/integration/content-loading.test.ts -g "exactly one" 2>&1 | tail -20
```

Expected: both new tests pass.

### Task 6.5: Add a Brisbane-absence assertion to FAQ

**Files:**
- Modify: `tests/integration/content-loading.test.ts`

- [ ] **Step 1: Add a test for FAQ content**

Append inside the `test.describe('Content loads correctly', () => { ... })` block:

```typescript
  test('FAQ contains no Brisbane edition references', async ({ page }) => {
    await page.goto('/faq/');
    const bodyText = (await page.locator('body').textContent())?.toLowerCase() ?? '';
    expect(bodyText).not.toContain('brisbane edition');
    expect(bodyText).not.toContain('jagera');
    expect(bodyText).not.toContain('turrbal');
  });
```

- [ ] **Step 2: Run the test**

```bash
npm test -- tests/integration/content-loading.test.ts 2>&1 | tail -20
```

Expected: new test passes.

### Task 6.6: Commit Chunk 6

- [ ] **Step 1: Stage and commit**

```bash
git add tests/e2e/navigation.test.ts tests/e2e/build.test.ts tests/integration/content-loading.test.ts
git commit -m "$(cat <<'EOF'
test: assert /brisbane 404 and single-book invariants

Adds e2e assertions that /brisbane/ returns 404 and is not emitted
by the build, plus navigation and FAQ content assertions that no
Brisbane edition, Jagera, Turrbal, or Koala Foundation references
remain. Asserts the index hero renders exactly one book card and
the buy page renders exactly one edition card.
EOF
)"
```

---

## Chunk 7: Preserve historical docs and close out

### Task 7.1: Prepend historical note to the 2026-04-06 spec

**Files:**
- Modify: `docs/superpowers/specs/2026-04-06-ace-eucalypts-website-design.md` (top of file)

- [ ] **Step 1: Prepend the following block to the very top of the file (before any existing content)**

```markdown
> **Note (2026-04-23):** Brisbane content has been removed from the live site.
> This document is preserved as a historical record of the original dual-book design.
> For the current single-book design, see
> `docs/superpowers/specs/2026-04-23-remove-brisbane-content-design.md`.

---

```

### Task 7.2: Prepend historical note to the 2026-04-06 plan

**Files:**
- Modify: `docs/superpowers/plans/2026-04-06-ace-eucalypts-website.md` (top of file)

- [ ] **Step 1: Prepend the same block**

Same text as Task 7.1. The block goes before the existing `# ...` heading so the historical note is the first thing a reader sees.

### Task 7.3: Commit Chunk 7

- [ ] **Step 1: Stage and commit**

```bash
git add docs/superpowers/specs/2026-04-06-ace-eucalypts-website-design.md docs/superpowers/plans/2026-04-06-ace-eucalypts-website.md
git commit -m "$(cat <<'EOF'
docs: mark 2026-04-06 spec and plan as historical

Prepends a dated note to both the original dual-book design spec and
its implementation plan, redirecting readers to the current single-book
spec at docs/superpowers/specs/2026-04-23-remove-brisbane-content-design.md.
EOF
)"
```

---

## Chunk 8: Final verification

### Task 8.1: Whole-codebase Brisbane sweep

- [ ] **Step 1: Grep everywhere (excluding node_modules, dist, .worktrees, the two spec docs, this plan)**

```bash
grep -rn -i "brisbane" src/ tests/ 2>/dev/null
```

Expected output — **exactly** these two lines (or equivalent, depending on line numbers after edits):

```
src/pages/authors.astro:<N>:        <em>ACE Guide to Eucalypts: Brisbane</em> (2021), establishing the bark-and-leaf
src/pages/about.astro:<N>:        character — and first published it in the <em>ACE Guide to Eucalypts: Brisbane</em> (2021).
```

Any other hit is a miss — fix it before proceeding.

### Task 8.2: Full build and full test run

- [ ] **Step 1: Clean build**

```bash
rm -rf dist
npm run build
```

Expected: exit 0. No warnings about missing assets or unresolved imports.

- [ ] **Step 2: Full test suite**

```bash
npm test 2>&1 | tee /tmp/ace-brisbane-final.txt
```

Expected: all tests that passed in the baseline (Task 0.2) still pass. New tests from Chunk 6 pass. No new failures introduced. Compare final exit status to baseline — if baseline had `N` failing and final has `M` failing where `M > N`, investigate which failure is new.

### Task 8.3: Visual spot check

- [ ] **Step 1: Run the dev server and walk every page**

```bash
npm run dev
```

In a browser at `http://localhost:4321/`:

- [ ] `/` — hero shows one centered Melbourne cover, no Brisbane text anywhere, CTA row has exactly one Buy button.
- [ ] `/about/` — intro says "Melbourne" not "series"; no "Brisbane edition covers 37 species" sentence; Rod's bio still mentions the Brisbane guide as methodology precursor.
- [ ] `/faq/` — no "Brisbane edition" question, no Jagera/Turrbal mentions, CTA has one Buy button.
- [ ] `/buy/` — one centered edition card, no "Also available from" section, no Brisbane card.
- [ ] `/authors/` — unchanged, Rod's bio methodology-lineage sentence still reads naturally.
- [ ] `/melbourne/` — unchanged.
- [ ] `/brisbane/` — returns 404.

- [ ] **Step 2: Check mobile viewport (375px)**

In browser devtools, resize to 375px width for each page above. Verify:
- [ ] Index hero doesn't look orphaned — single cover centered.
- [ ] Buy page edition card is full-width-ish and balanced.
- [ ] Nav doesn't overflow (5 items: Home, Melbourne, About, FAQ, Buy).

### Task 8.4: Stop and hand back for review

- [ ] **Step 1: Summarize the branch for the user**

```bash
git log --oneline main..HEAD
```

Expected: 7 commits (one per chunk).

- [ ] **Step 2: Report to the user**

Tell the user:

> "Brisbane content removed from the website. Branch `remove-brisbane-content` has 7 commits ready to merge. Build passes, new test assertions pass, and the only remaining Brisbane mentions are the two methodology citations in Rod's bio (authors.astro, about.astro) — as spec'd. Review the diff and merge when happy."

Do not merge or push — that's the user's call.

---

## Rollback

If anything regresses after a commit:

- Last commit only: `git reset --soft HEAD~1` (keeps changes staged to amend) **or** `git revert HEAD`.
- Whole branch: stay on branch, simply never merge. Branch is disposable.
- Pre-launch site, no external bookmarks, no redirect infrastructure to unwind. Stripe Brisbane checkout URL is untouched — it still exists at Stripe; the site simply stops surfacing it.

## Out of scope

- Fixing pre-existing test drift (`navigation.test.ts` expecting 4 nav links when there are now 5, `content-loading.test.ts` selectors that don't match current index.astro structure, etc.). These predate this work.
- Domain / site-name decision (tracked separately in the `euc`-based shortlist brainstorm).
- Refactoring shared components (e.g., extracting a reusable `BookCard`) — the site now has one book; abstraction would be speculative.
- SEO / indexing cleanup — the site is pre-launch.
