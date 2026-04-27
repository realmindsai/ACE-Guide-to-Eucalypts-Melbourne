# Guided Walks Page Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a `/walks/` page promoting Vicky's guided eucalypt walks, with a Netlify enquiry form, a home-page teaser band, and a nav rename ("Melbourne" → "The Book" + new "Walks" link).

**Architecture:** Plain Astro static page following existing patterns (`Base.astro` layout, `<Image>` component for responsive images, content-collection-free single-file pages like `melbourne.astro`/`about.astro`). Form uses Netlify Forms (HTML attribute-driven, no JS). Schema.org `Service` JSON-LD on the walks page. No new build dependencies.

**Tech Stack:** Astro 6, Astro `<Image>` component, Netlify Forms, Playwright + axe-core for tests, `sips` (macOS) for image prep.

**Spec:** `docs/superpowers/specs/2026-04-27-guided-walks-page-design.md`

---

## File Structure

| Path | Action | Responsibility |
|---|---|---|
| `src/assets/walks/vicky-portrait.jpg` | Create | Bio block portrait |
| `src/assets/walks/group-listening.jpg` | Create | Hero photo + home band photo |
| `src/assets/walks/group-walking.jpg` | Create | "Locations" section photo |
| `src/components/Nav.astro` | Modify | Rename label, add Walks link |
| `src/components/EnquiryForm.astro` | Create | Netlify-attributed enquiry form |
| `src/pages/walks.astro` | Create | The walks page itself |
| `src/pages/walks/thanks.astro` | Create | Form submission confirmation |
| `src/pages/index.astro` | Modify | Insert walks band between Endorsements and Method |
| `tests/e2e/navigation.test.ts` | Modify | Update stale nav assertions; add Walks |
| `tests/e2e/walks.test.ts` | Create | Walks page smoke + form + a11y |
| `tests/e2e/schema.test.ts` | Modify | Assert Service schema on /walks/ |

**Notes on existing state:**
- `tests/e2e/navigation.test.ts` is currently stale — it asserts only 4 nav links (Home/About/Authors/Buy) when the live nav has 5 (Home/Melbourne/About/FAQ/Buy). This work will bring it back into sync.
- `melbourne.astro` URL is **kept unchanged**. Only the nav *label* changes to "The Book". This avoids breaking inbound links.

---

## Chunk 1: Image preparation and import

### Task 1: Import and prepare the three walks images

**Files:**
- Create: `src/assets/walks/vicky-portrait.jpg`
- Create: `src/assets/walks/group-listening.jpg`
- Create: `src/assets/walks/group-walking.jpg`

**Source files (on user's Mac, outside the repo):**
- `~/Downloads/image.png` → portrait
- `~/Downloads/IMG_0738.jpeg` → group listening (rotated 90°)
- `~/Downloads/IMG_0747.jpeg` → group walking (rotated 90°)

`sips` rotates by EXIF when re-saving; passing `-r 0` is a no-op rotation that *bakes* the orientation into the pixel data and clears the EXIF orientation tag, so downstream tools (Astro `<Image>`, screen readers, OG consumers) see an upright image.

- [ ] **Step 1: Create the assets directory**

```bash
mkdir -p src/assets/walks
```

- [ ] **Step 2: Convert and resize the portrait**

```bash
sips -s format jpeg \
     -s formatOptions 85 \
     -Z 800 \
     ~/Downloads/image.png \
     --out src/assets/walks/vicky-portrait.jpg
```

Expected: `src/assets/walks/vicky-portrait.jpg` exists, ≤200KB, max dimension 800px.

- [ ] **Step 3: Convert, rotate-bake, and resize group-listening**

```bash
cp ~/Downloads/IMG_0738.jpeg /tmp/walks-listening.jpg
sips -r 0 /tmp/walks-listening.jpg
sips -s format jpeg \
     -s formatOptions 85 \
     -Z 1600 \
     /tmp/walks-listening.jpg \
     --out src/assets/walks/group-listening.jpg
```

Expected: `src/assets/walks/group-listening.jpg` exists, max dimension 1600px, opens upright in Preview.

- [ ] **Step 4: Convert, rotate-bake, and resize group-walking**

```bash
cp ~/Downloads/IMG_0747.jpeg /tmp/walks-walking.jpg
sips -r 0 /tmp/walks-walking.jpg
sips -s format jpeg \
     -s formatOptions 85 \
     -Z 1600 \
     /tmp/walks-walking.jpg \
     --out src/assets/walks/group-walking.jpg
```

Expected: `src/assets/walks/group-walking.jpg` exists, max dimension 1600px, opens upright in Preview.

- [ ] **Step 5: Visually verify orientation**

```bash
open src/assets/walks/vicky-portrait.jpg src/assets/walks/group-listening.jpg src/assets/walks/group-walking.jpg
```

Expected: all three open upright in Preview. If any is sideways, repeat the corresponding step (the EXIF orientation may differ — re-run `sips -r 90` or `sips -r -90` as needed before resizing).

- [ ] **Step 6: Commit**

```bash
git add src/assets/walks/
git commit -m "assets: add guided-walks photos (portrait + 2 group shots)"
```

---

## Chunk 2: Nav rename and Walks link

### Task 2: Update the navigation test first (TDD)

The existing nav test is stale. We bring it in sync with the *target* state (post-change), watch it fail, then make the nav match.

**Files:**
- Modify: `tests/e2e/navigation.test.ts`

- [ ] **Step 1: Replace the nav-links assertion with the target state**

Replace the `navLinks` array in `tests/e2e/navigation.test.ts` (around line 7) with:

```typescript
const navLinks = [
  { text: 'Home',    href: '/' },
  { text: 'The Book', href: '/melbourne/' },
  { text: 'Walks',   href: '/walks/' },
  { text: 'About',   href: '/about/' },
  { text: 'FAQ',     href: '/faq/' },
  { text: 'Buy',     href: '/buy/' },
];
```

Update the `test('all 4 nav links...')` description to `test('all nav links are visible and work', …)`.

- [ ] **Step 2: Update the logo assertion (it currently checks `href="/"` but our nav-logo is a `<span>`, not a link)**

Look at `src/components/Nav.astro:23` — `.nav-logo` is a `<span>`, the existing test for `toHaveAttribute('href', '/')` is broken. Replace the `'logo links to home'` test with:

```typescript
test('logo text is present', async ({ page }) => {
  await page.goto('/about/');
  const logo = page.locator('.nav-logo');
  await expect(logo).toHaveText('ACE Guide to Eucalypts Melbourne');
});
```

- [ ] **Step 3: Run the nav test, expect failure**

```bash
npx playwright test tests/e2e/navigation.test.ts --project=chromium 2>&1 | tail -30
```

Expected: at least one assertion fails — either "The Book" / "Walks" not found, or current "Melbourne" link still labelled "Melbourne".

- [ ] **Step 4: Commit the failing test**

```bash
git add tests/e2e/navigation.test.ts
git commit -m "test(nav): expect renamed Book label and new Walks link"
```

### Task 3: Update the Nav component to match

**Files:**
- Modify: `src/components/Nav.astro:5-11`

- [ ] **Step 1: Replace the navLinks array**

In `src/components/Nav.astro`, replace lines 5-11 with:

```astro
const navLinks = [
  { href: url('/'),           label: 'Home' },
  { href: url('/melbourne/'), label: 'The Book' },
  { href: url('/walks/'),     label: 'Walks' },
  { href: url('/about/'),     label: 'About' },
  { href: url('/faq/'),       label: 'FAQ' },
  { href: url('/buy/'),       label: 'Buy' },
];
```

Note: `/walks/` doesn't exist yet. The nav test will still fail at `toBeVisible()` for that link until Task 5 builds the page. That's expected — the test will be green by the end of Chunk 3.

- [ ] **Step 2: Build to confirm no compile errors**

```bash
npm run build 2>&1 | tail -20
```

Expected: build succeeds. The `/walks/` href is a string literal — Astro doesn't validate hrefs at build time.

- [ ] **Step 3: Commit**

```bash
git add src/components/Nav.astro
git commit -m "nav: rename Melbourne to The Book; add Walks link"
```

---

## Chunk 3: Walks page

### Task 4: Create a minimal walks page that responds 200

**Files:**
- Create: `src/pages/walks.astro`

This is the smallest viable page so the nav test goes green. We'll fill in the real content in Task 5.

- [ ] **Step 1: Create the placeholder page**

```astro
---
// src/pages/walks.astro
import Base from '../layouts/Base.astro';
---

<Base
  title="Guided Eucalypt Walks in Melbourne — Walks with Vicky"
  description="Guided eucalypt walks across Melbourne with author and ecologist Vicky Shukuroglou. For community groups, schools, garden clubs, and curious visitors. From $500 per group."
  breadcrumbs={[{ name: 'Walks', href: '/walks/' }]}
>
  <h1>Walks with Vicky</h1>
</Base>
```

- [ ] **Step 2: Run the nav test, expect pass**

```bash
npx playwright test tests/e2e/navigation.test.ts --project=chromium 2>&1 | tail -20
```

Expected: all nav assertions pass (page exists, link is visible, label is "Walks").

- [ ] **Step 3: Commit**

```bash
git add src/pages/walks.astro
git commit -m "feat(walks): scaffold minimal /walks/ page so nav resolves"
```

### Task 5: Fill in walks page content (sections 1-7)

**Files:**
- Modify: `src/pages/walks.astro`

Build the bulk of the page as one commit since the sections share styles. The form, bio, testimonials, and schema each get their own task afterward.

- [ ] **Step 1: Replace `walks.astro` with the full content scaffold**

```astro
---
// src/pages/walks.astro
import { Image } from 'astro:assets';
import Base from '../layouts/Base.astro';
import BuyButton from '../components/BuyButton.astro';
import AcknowledgmentOfCountry from '../components/AcknowledgmentOfCountry.astro';
import { url } from '../utils/url';

import groupListening from '../assets/walks/group-listening.jpg';
import groupWalking from '../assets/walks/group-walking.jpg';
import vickyPortrait from '../assets/walks/vicky-portrait.jpg';

const serviceSchema = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: 'Guided Eucalypt Walks',
  provider: { '@type': 'Person', name: 'Vicky Shukuroglou' },
  areaServed: { '@type': 'City', name: 'Melbourne' },
  serviceType: 'Guided nature walk',
  description:
    'Guided eucalypt walks across Melbourne — Pound Bend, Long Forest, Blackburn Lake, Royal Park, Royal Botanic Gardens. 90–120 minutes, groups up to 30.',
  offers: {
    '@type': 'Offer',
    priceCurrency: 'AUD',
    price: '500',
    priceSpecification: {
      '@type': 'PriceSpecification',
      minPrice: '500',
      priceCurrency: 'AUD',
      valueAddedTaxIncluded: true,
    },
  },
};
---

<Base
  title="Guided Eucalypt Walks in Melbourne — Walks with Vicky"
  description="Guided eucalypt walks across Melbourne with author and ecologist Vicky Shukuroglou. For community groups, schools, garden clubs, and curious visitors. From $500 per group."
  schemaJson={serviceSchema}
  breadcrumbs={[{ name: 'Walks', href: '/walks/' }]}
>

  <!-- Hero -->
  <section class="hero">
    <div class="hero-inner wide-width">
      <div class="hero-text">
        <p class="hero-eyebrow">GUIDED WALKS</p>
        <h1>Walks with Vicky</h1>
        <p class="hero-subtitle">
          Step into the world of eucalypts and discover Melbourne through its most iconic trees.
        </p>
        <div class="hero-cta">
          <a href="#enquire" class="buy-button">Enquire about a walk</a>
        </div>
      </div>
      <div class="hero-image">
        <Image
          src={groupListening}
          alt="A group standing in a clearing, listening as Vicky points out details of a eucalypt"
          width={1200}
          loading="eager"
          fetchpriority="high"
        />
      </div>
    </div>
  </section>

  <!-- Why these walks -->
  <section class="section">
    <div class="content-width">
      <h2>Why these walks</h2>
      <p>
        Eucalypts are at the heart of the Australian landscape — remarkably diverse, deeply
        adapted, and culturally significant. With hundreds of species across Australia, each
        tree tells a story through its bark, leaves, scent, and form.
      </p>
      <p>
        These guided walks offer a chance to slow down, look closely, and begin to recognise
        the subtle and striking differences between species that most people walk past every day.
      </p>
      <p>
        Each walk is designed as an immersive, conversational experience rather than a formal
        tour. Whether you are a complete beginner or already have an interest in Australian
        plants, the walks are tailored to suit your level of knowledge and curiosity.
      </p>
    </div>
  </section>

  <!-- What you'll learn -->
  <section class="section section-alt">
    <div class="content-width">
      <h2>What you'll learn</h2>
      <ul class="learn-list">
        <li>Recognise different eucalypt species</li>
        <li>Read bark, buds, gumnuts and leaves as pieces of an identification puzzle</li>
        <li>Notice seasonal changes and how trees vary across the year</li>
        <li>Read the landscape through its trees</li>
        <li>Become more familiar with the ecosystems eucalypts support — birds, insects, possums, koalas, soil life and mycorrhizal activity</li>
      </ul>
      <p>
        Deepen your connection to place by seeing what is usually overlooked.
      </p>
    </div>
  </section>

  <!-- Sample walk -->
  <section class="section">
    <div class="content-width">
      <h2>A sample walk: Pound Bend</h2>
      <p>
        At Pound Bend you'll meet several different species in a short stretch — perfect for
        testing the identification machinery without being overwhelming. We watch the demeanour
        of each tree: the texture and shape, the size and form of fruits (champagne flute,
        thick-walled, conical), the buds, the bark.
      </p>
      <p>
        Along the Yarra, the habitat shifts from riverine flats up the slope, and the trees
        change with it — a quick lesson in how eucalypts respond to their place. We make
        guesses, tie things together, and celebrate the tricky ones. It isn't about being
        right; it's about <em>we are learning</em>.
      </p>
      <p>
        The longer we look, the more we understand — every walk is accessible to every level
        of knowledge. That's the joy of it: connecting more intimately with place.
      </p>
    </div>
  </section>

  <!-- Locations -->
  <section class="section section-alt">
    <div class="content-width">
      <h2>Locations</h2>
      <p>Walks can be arranged at:</p>
      <ul>
        <li>Pound Bend (Warrandyte)</li>
        <li>Long Forest, Bacchus Marsh</li>
        <li>Blackburn Lake</li>
        <li>Royal Park</li>
        <li>Royal Botanic Gardens</li>
      </ul>
      <p>Other Melbourne locations on request.</p>

      <figure class="locations-figure">
        <Image
          src={groupWalking}
          alt="A group walking through open eucalypt woodland under a high canopy"
          width={1200}
          loading="lazy"
        />
      </figure>
    </div>
  </section>

  <!-- Practicalities -->
  <section class="section">
    <div class="content-width">
      <h2>Practicalities</h2>
      <dl class="practicalities">
        <dt>Duration</dt>          <dd>90–120 minutes</dd>
        <dt>Group size</dt>        <dd>Up to 30 people</dd>
        <dt>Pace and fitness</dt>  <dd>Relaxed pace; suitable for most fitness levels</dd>
        <dt>Accessibility</dt>     <dd>Wheelchair-accessible walks available with advance notice</dd>
        <dt>When</dt>              <dd>Year-round</dd>
        <dt>Pricing</dt>           <dd>From $500 per group · per-person pricing coming soon</dd>
      </dl>
    </div>
  </section>

  <!-- Who walks are for -->
  <section class="section section-alt">
    <div class="content-width">
      <h2>Who these walks are for</h2>
      <ul>
        <li>Community and interest groups</li>
        <li>Garden clubs and horticultural societies</li>
        <li>Schools and educational groups</li>
        <li>Corporate or team experiences</li>
        <li>Visitors wanting a uniquely Australian experience</li>
      </ul>
    </div>
  </section>

  <AcknowledgmentOfCountry />

</Base>

<style>
  .hero {
    padding-block: var(--space-lg);
  }

  .hero-inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-lg);
    align-items: center;
  }

  @media (min-width: 720px) {
    .hero-inner {
      grid-template-columns: 1fr 1fr;
    }
  }

  .hero-eyebrow {
    font-size: 0.85rem;
    font-weight: 600;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    color: var(--color-olive);
    margin-bottom: var(--space-xs);
  }

  .hero-text h1 {
    font-size: clamp(2rem, 5vw, 3.5rem);
    line-height: 1.15;
    margin-bottom: var(--space-sm);
  }

  .hero-subtitle {
    font-size: 1.15rem;
    line-height: 1.7;
    color: var(--color-text-secondary);
    max-width: 52ch;
  }

  .hero-cta {
    margin-top: var(--space-md);
  }

  .hero-image img {
    width: 100%;
    height: auto;
    border-radius: 0;
    box-shadow: 0 6px 28px rgba(44, 44, 42, 0.18);
    display: block;
  }

  .section {
    padding-block: var(--space-lg);
  }

  .section-alt {
    background-color: #f0ebe4;
  }

  .section h2 {
    margin-bottom: var(--space-sm);
  }

  .section p + p {
    margin-top: var(--space-sm);
  }

  .section ul {
    padding-left: 1.25rem;
    line-height: 1.7;
  }

  .section ul li + li {
    margin-top: 0.25rem;
  }

  .learn-list {
    margin-bottom: var(--space-md);
  }

  .locations-figure {
    margin: var(--space-md) 0 0;
  }

  .locations-figure img {
    width: 100%;
    height: auto;
    display: block;
  }

  .practicalities {
    display: grid;
    grid-template-columns: max-content 1fr;
    gap: var(--space-xs) var(--space-md);
  }

  .practicalities dt {
    font-weight: 600;
    color: var(--color-text);
  }

  .practicalities dd {
    margin: 0;
    color: var(--color-text-secondary);
  }
</style>
```

- [ ] **Step 2: Build and visually inspect**

```bash
npm run build && npm run preview &
sleep 3
open http://localhost:4321/walks/
```

Expected: page renders with hero, all sections, both group photos visible and upright. Kill the preview when done (`pkill -f "astro preview"`).

- [ ] **Step 3: Commit**

```bash
git add src/pages/walks.astro
git commit -m "feat(walks): add full page content (hero, learn, sample walk, locations, practicalities, audience)"
```

### Task 6: Add About Vicky bio block + testimonials

**Files:**
- Modify: `src/pages/walks.astro` (insert two sections before `<AcknowledgmentOfCountry />`)

- [ ] **Step 1: Add the import for the Endorsement component**

At the top of the frontmatter (after the existing imports), add:

```astro
import Endorsement from '../components/Endorsement.astro';
```

- [ ] **Step 2: Add the About Vicky and Testimonials sections**

Insert these two sections immediately before the `<AcknowledgmentOfCountry />` line:

```astro
  <!-- About Vicky -->
  <section class="section">
    <div class="content-width about-vicky">
      <div class="about-vicky-image">
        <Image
          src={vickyPortrait}
          alt="Vicky Shukuroglou, in front of a eucalypt"
          width={400}
          loading="lazy"
        />
      </div>
      <div class="about-vicky-text">
        <h2>About Vicky</h2>
        <p>
          Vicky Shukuroglou is co-author of the <a href={url('/melbourne/')}><em>ACE Guide to
          Eucalypts Melbourne</em></a>, an artist and ecologist, and founder of Nillumbio —
          a biodiversity-focused engagement practice through which she has led many walks.
        </p>
      </div>
    </div>
  </section>

  <!-- Testimonials -->
  <section class="section section-alt">
    <div class="content-width">
      <h2>What people say</h2>
      <Endorsement
        quote="Vicky really helped me see the important details and understand the differences between the trees. I feel so much more confident now."
        name="Robert"
        credential="walk participant"
      />
      <Endorsement
        quote="Vicky's approach is holistic and generous. She shares her understanding of ecology and human connection in ways that are deeply felt and accessible."
        name="Madeline"
        credential="Senior Ranger, Banyule"
      />
    </div>
  </section>

  <!-- Also available -->
  <section class="section">
    <div class="content-width">
      <h2>Also available</h2>
      <ul>
        <li>Gift vouchers</li>
        <li>Schools program <em>(coming soon — contact for more information)</em></li>
        <li>Custom themes for community or corporate groups</li>
      </ul>
    </div>
  </section>
```

- [ ] **Step 3: Add styles for the About Vicky two-column layout**

Append to the `<style>` block:

```css
  .about-vicky {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
    align-items: center;
  }

  @media (min-width: 600px) {
    .about-vicky {
      grid-template-columns: 200px 1fr;
    }
  }

  .about-vicky-image img {
    width: 100%;
    height: auto;
    border-radius: 50%;
    display: block;
  }
```

- [ ] **Step 4: Build and inspect**

```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds.

- [ ] **Step 5: Commit**

```bash
git add src/pages/walks.astro
git commit -m "feat(walks): add About Vicky bio, testimonials, and Also-available section"
```

---

## Chunk 4: Enquiry form and thank-you page

### Task 7: Create the EnquiryForm component

**Files:**
- Create: `src/components/EnquiryForm.astro`

Netlify Forms requires a static HTML form with `data-netlify="true"`. At build time, Netlify scans `dist/` for these forms and registers them. **Crucially**, on Astro this works best with a hidden static form in the HTML — which Astro produces automatically since this is a static `<form>` element.

The honeypot (`netlify-honeypot="bot-field"`) blocks form submissions where the hidden field is populated (i.e., bot fills every field).

- [ ] **Step 1: Write the component**

```astro
---
// src/components/EnquiryForm.astro
// Netlify-handled enquiry form. The form is auto-detected at deploy time
// because of the data-netlify and name attributes on the static HTML form.
---

<form
  name="walk-enquiry"
  method="POST"
  data-netlify="true"
  netlify-honeypot="bot-field"
  action="/walks/thanks/"
  class="enquiry-form"
>
  <input type="hidden" name="form-name" value="walk-enquiry" />

  <p class="hp-field" hidden>
    <label>Don't fill this out if you're human: <input name="bot-field" /></label>
  </p>

  <div class="field">
    <label for="enquiry-name">Name <span aria-hidden="true">*</span></label>
    <input id="enquiry-name" name="name" type="text" required autocomplete="name" />
  </div>

  <div class="field">
    <label for="enquiry-email">Email <span aria-hidden="true">*</span></label>
    <input id="enquiry-email" name="email" type="email" required autocomplete="email" />
  </div>

  <div class="field">
    <label for="enquiry-phone">Phone <span class="optional">(optional)</span></label>
    <input id="enquiry-phone" name="phone" type="tel" autocomplete="tel" />
  </div>

  <div class="field">
    <label for="enquiry-group-size">Group size</label>
    <input id="enquiry-group-size" name="group_size" type="number" min="1" max="30" />
  </div>

  <div class="field">
    <label for="enquiry-location">Preferred location</label>
    <select id="enquiry-location" name="preferred_location">
      <option value="">— Choose one —</option>
      <option>Pound Bend (Warrandyte)</option>
      <option>Long Forest, Bacchus Marsh</option>
      <option>Blackburn Lake</option>
      <option>Royal Park</option>
      <option>Royal Botanic Gardens</option>
      <option>Other / not sure</option>
    </select>
  </div>

  <div class="field">
    <label for="enquiry-dates">Preferred dates</label>
    <input
      id="enquiry-dates"
      name="preferred_dates"
      type="text"
      placeholder="e.g. weekends in May"
    />
  </div>

  <div class="field">
    <label for="enquiry-message">What are you hoping to get from the walk?</label>
    <textarea id="enquiry-message" name="message" rows="5"></textarea>
  </div>

  <button type="submit" class="buy-button">Send enquiry</button>

  <p class="enquiry-fallback">
    Prefer email? Reach Vicky at
    <a href="mailto:info@eucalyptsmelbourne.au">info@eucalyptsmelbourne.au</a>.
  </p>
</form>

<style>
  .enquiry-form {
    display: grid;
    gap: var(--space-sm);
    max-width: 36rem;
  }

  .hp-field {
    position: absolute;
    left: -10000px;
  }

  .field {
    display: grid;
    gap: 0.25rem;
  }

  .field label {
    font-weight: 600;
    color: var(--color-text);
  }

  .field .optional {
    font-weight: 400;
    color: var(--color-text-secondary);
    font-size: 0.875rem;
  }

  .field input,
  .field select,
  .field textarea {
    font: inherit;
    padding: 0.5rem 0.75rem;
    border: 1px solid var(--color-olive);
    background-color: var(--color-bg);
    color: var(--color-text);
    border-radius: 0;
  }

  .field textarea {
    resize: vertical;
    min-height: 6rem;
  }

  .enquiry-form button {
    justify-self: start;
    margin-top: var(--space-sm);
    border: none;
    cursor: pointer;
  }

  .enquiry-fallback {
    font-size: 0.9rem;
    color: var(--color-text-secondary);
    margin: 0;
  }
</style>
```

- [ ] **Step 2: Commit**

```bash
git add src/components/EnquiryForm.astro
git commit -m "feat(walks): add EnquiryForm component (Netlify Forms)"
```

### Task 8: Mount the form on the walks page

**Files:**
- Modify: `src/pages/walks.astro`

- [ ] **Step 1: Add the import**

In the frontmatter, after the existing imports:

```astro
import EnquiryForm from '../components/EnquiryForm.astro';
```

- [ ] **Step 2: Add the enquiry section**

Insert immediately before `<AcknowledgmentOfCountry />`:

```astro
  <!-- Enquiry -->
  <section id="enquire" class="section section-alt">
    <div class="content-width">
      <h2>Booking enquiries</h2>
      <p>
        If you're interested in organising a walk, Vicky would be delighted to hear from you.
        Tell her about your group, where you'd like to walk, when, and what you're hoping for.
      </p>
      <EnquiryForm />
    </div>
  </section>
```

- [ ] **Step 3: Build, then visually verify the form anchor works**

```bash
npm run build && npm run preview &
sleep 3
open http://localhost:4321/walks/#enquire
```

Expected: page jumps to the enquiry section; form renders with all 7 fields; "Send enquiry" button visible. Kill preview when done.

- [ ] **Step 4: Commit**

```bash
git add src/pages/walks.astro
git commit -m "feat(walks): mount EnquiryForm under #enquire anchor"
```

### Task 9: Create the thank-you page

**Files:**
- Create: `src/pages/walks/thanks.astro`

Astro requires a directory + file for nested routes; `src/pages/walks/thanks.astro` produces `/walks/thanks/`.

- [ ] **Step 1: Create the directory and page**

```bash
mkdir -p src/pages/walks
```

Then write `src/pages/walks/thanks.astro`:

```astro
---
// src/pages/walks/thanks.astro
import Base from '../../layouts/Base.astro';
import { url } from '../../utils/url';
---

<Base
  title="Thanks — your walk enquiry is on its way"
  description="Your guided eucalypt walk enquiry has been received."
  breadcrumbs={[
    { name: 'Walks', href: '/walks/' },
    { name: 'Thanks', href: '/walks/thanks/' },
  ]}
>
  <section class="section">
    <div class="content-width">
      <h1>Thanks — your enquiry is on its way</h1>
      <p>
        Vicky will be in touch within a few days to discuss your walk. If it's urgent,
        you can also email <a href="mailto:info@eucalyptsmelbourne.au">info@eucalyptsmelbourne.au</a>.
      </p>
      <p>
        <a href={url('/walks/')}>← Back to Walks</a>
        &nbsp;·&nbsp;
        <a href={url('/')}>Home</a>
      </p>
    </div>
  </section>
</Base>

<style>
  .section {
    padding-block: var(--space-lg);
  }

  .section h1 {
    margin-bottom: var(--space-sm);
  }
</style>
```

- [ ] **Step 2: Build and verify**

```bash
npm run build 2>&1 | tail -10
```

Expected: build succeeds; `dist/walks/thanks/index.html` exists.

```bash
ls dist/walks/
```

Expected: `index.html` and `thanks/` both present.

- [ ] **Step 3: Commit**

```bash
git add src/pages/walks/thanks.astro
git commit -m "feat(walks): add /walks/thanks/ post-submit page"
```

---

## Chunk 5: Home-page walks band

### Task 10: Add the walks band to the home page

**Files:**
- Modify: `src/pages/index.astro`

Per the spec, the band sits **between the Endorsements section and the Method section** (above method, below endorsements).

- [ ] **Step 1: Add the import for the band image**

In the frontmatter, after the existing `melbourneCover` import:

```astro
import walksBandImage from '../assets/walks/group-listening.jpg';
```

- [ ] **Step 2: Insert the new section**

Locate the closing `</section>` of the Endorsements block (around line 79) and the opening of the Method section (`<!-- What the ACE method is -->`). Between them, insert:

```astro
  <!-- Walks band -->
  <section class="section walks-band">
    <div class="wide-width walks-band-inner">
      <div class="walks-band-image">
        <Image
          src={walksBandImage}
          alt="A group on a guided walk, listening as Vicky points out details of a eucalypt"
          width={640}
          loading="lazy"
        />
      </div>
      <div class="walks-band-text">
        <h2>Walks with Vicky</h2>
        <p>
          Step into the world of eucalypts and discover Melbourne through its most iconic trees.
        </p>
        <p>
          <a href={url('/walks/')} class="buy-button">Book a walk</a>
        </p>
      </div>
    </div>
  </section>
```

- [ ] **Step 3: Add the band styles**

In the `<style>` block, append:

```css
  .walks-band {
    padding-block: var(--space-lg);
  }

  .walks-band-inner {
    display: grid;
    grid-template-columns: 1fr;
    gap: var(--space-md);
    align-items: center;
  }

  @media (min-width: 720px) {
    .walks-band-inner {
      grid-template-columns: 1fr 1fr;
    }
  }

  .walks-band-image img {
    width: 100%;
    height: auto;
    display: block;
    box-shadow: 0 4px 20px rgba(44, 44, 42, 0.15);
  }

  .walks-band-text h2 {
    margin-bottom: var(--space-sm);
  }

  .walks-band-text p {
    margin-bottom: var(--space-sm);
  }
```

- [ ] **Step 4: Build and visually verify**

```bash
npm run build && npm run preview &
sleep 3
open http://localhost:4321/
```

Expected: home page now shows the walks band between endorsements and method, with the group image and "Book a walk" button. Kill preview when done.

- [ ] **Step 5: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat(home): add Walks-with-Vicky band between endorsements and method"
```

---

## Chunk 6: Tests

### Task 11: Add a walks page e2e test

**Files:**
- Create: `tests/e2e/walks.test.ts`

- [ ] **Step 1: Write the test file**

```typescript
import { test, expect } from '@playwright/test';

test.describe('Walks page', () => {
  test('renders hero, sections, and images', async ({ page }) => {
    const response = await page.goto('/walks/');
    expect(response?.status()).toBe(200);

    await expect(page.locator('h1')).toHaveText('Walks with Vicky');

    for (const heading of [
      'Why these walks',
      "What you'll learn",
      'A sample walk: Pound Bend',
      'Locations',
      'Practicalities',
      'Who these walks are for',
      'About Vicky',
      'What people say',
      'Booking enquiries',
    ]) {
      await expect(page.getByRole('heading', { name: heading })).toBeVisible();
    }

    // Three walks images
    await expect(page.locator('img[alt*="listening"]').first()).toBeVisible();
    await expect(page.locator('img[alt*="walking"]').first()).toBeVisible();
    await expect(page.locator('img[alt*="Vicky Shukuroglou"]').first()).toBeVisible();
  });

  test('enquiry form is Netlify-attributed and has required fields', async ({ page }) => {
    await page.goto('/walks/');
    const form = page.locator('form[name="walk-enquiry"]');
    await expect(form).toHaveAttribute('data-netlify', 'true');
    await expect(form).toHaveAttribute('netlify-honeypot', 'bot-field');
    await expect(form).toHaveAttribute('action', '/walks/thanks/');

    await expect(form.locator('input[name="name"]')).toHaveAttribute('required', '');
    await expect(form.locator('input[name="email"]')).toHaveAttribute('required', '');
    await expect(form.locator('input[name="email"]')).toHaveAttribute('type', 'email');
  });

  test('submitting empty form triggers browser validation', async ({ page }) => {
    await page.goto('/walks/');
    await page.locator('form[name="walk-enquiry"] button[type="submit"]').click();
    // Browser blocks submit; URL doesn't change to /walks/thanks/
    await expect(page).toHaveURL(/\/walks\/$/);
  });

  test('thanks page is reachable and has correct content', async ({ page }) => {
    const response = await page.goto('/walks/thanks/');
    expect(response?.status()).toBe(200);
    await expect(page.locator('h1')).toContainText('Thanks');
  });

  test('home page walks band links to /walks/', async ({ page }) => {
    await page.goto('/');
    const bandLink = page.locator('.walks-band a.buy-button');
    await expect(bandLink).toBeVisible();
    await expect(bandLink).toHaveAttribute('href', '/walks/');
  });

  test('old /melbourne/ URL still works', async ({ page }) => {
    const response = await page.goto('/melbourne/');
    expect(response?.status()).toBe(200);
  });
});
```

- [ ] **Step 2: Run the test**

```bash
npx playwright test tests/e2e/walks.test.ts --project=chromium 2>&1 | tail -30
```

Expected: all 6 tests pass.

- [ ] **Step 3: Commit**

```bash
git add tests/e2e/walks.test.ts
git commit -m "test(walks): add e2e coverage for /walks/, form, thanks, home band"
```

### Task 12: Extend the schema test for the Service schema

**Files:**
- Modify: `tests/e2e/schema.test.ts`

- [ ] **Step 1: Read the current schema test to find the right place to add a case**

```bash
cat tests/e2e/schema.test.ts
```

- [ ] **Step 2: Add a test case asserting Service schema on /walks/**

Append a new test inside the existing `describe` block (or matching style):

```typescript
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
```

- [ ] **Step 3: Run the schema test**

```bash
npx playwright test tests/e2e/schema.test.ts --project=chromium 2>&1 | tail -20
```

Expected: all schema tests pass, including the new one.

- [ ] **Step 4: Commit**

```bash
git add tests/e2e/schema.test.ts
git commit -m "test(schema): assert Service schema on /walks/"
```

### Task 13: Run the full test suite

- [ ] **Step 1: Run everything**

```bash
npx playwright test 2>&1 | tail -30
```

Expected: all tests pass. If failures appear in unrelated tests (e.g., a11y), investigate before continuing — the new content may have introduced an accessibility issue (missing alt text, weak contrast, etc.).

- [ ] **Step 2: If anything failed, fix and re-run; otherwise proceed.**

---

## Chunk 7: Build and handover

### Task 14: Final build, sanity checks, and handover notes

- [ ] **Step 1: Clean build**

```bash
rm -rf dist && npm run build 2>&1 | tail -20
```

Expected: build succeeds with no warnings. The walks page should appear in the build output.

- [ ] **Step 2: Verify Netlify form static-HTML detection**

Netlify scans `dist/` for static HTML forms. Confirm the form HTML is present in the built page:

```bash
grep -c 'name="walk-enquiry"' dist/walks/index.html
```

Expected: at least `1`. If `0`, Netlify won't detect the form.

- [ ] **Step 3: Verify thanks page is built**

```bash
ls dist/walks/thanks/index.html
```

Expected: file exists.

- [ ] **Step 4: Open the built site locally to sanity-check**

```bash
npm run preview &
sleep 3
open http://localhost:4321/
open http://localhost:4321/walks/
```

Walk through:
- Nav shows: Home · The Book · Walks · About · FAQ · Buy
- Home page shows walks band between endorsements and method
- /walks/ renders all sections with three upright photos
- "Enquire about a walk" button jumps to the form
- Form has all 7 fields plus the hidden honeypot
- /melbourne/ still works (URL unchanged)

Kill preview when done.

- [ ] **Step 5: Add the handover note to the spec**

Append to `docs/superpowers/specs/2026-04-27-guided-walks-page-design.md` under the "Out-of-repo / handover items" section, prefix each with status:

```markdown
### Implementation status (2026-04-27)

Code complete on branch `<branch-name>`. The following must be done **after** the first deploy lands on Netlify:

1. ☐ In Netlify dashboard → Forms → `walk-enquiry` → enable email notifications to `info@eucalyptsmelbourne.au`
2. ☐ Submit a test enquiry on the deploy preview to confirm email delivery
3. ☐ Confirm `info@eucalyptsmelbourne.au` mailbox is monitored
4. ☐ Decide per-person pricing before the "PPP coming soon" line gets stale (review 2026-Q3)
```

- [ ] **Step 6: Commit and push**

```bash
git add docs/superpowers/specs/2026-04-27-guided-walks-page-design.md
git commit -m "docs(walks): add post-deploy handover checklist"
git push
```

- [ ] **Step 7: Tell the user**

Output a one-screen summary of what shipped, the URL on the deploy preview to test, and the four manual handover items they need to action.

---

## Risks during implementation

| Risk | Mitigation in plan |
|---|---|
| EXIF orientation differs between source files | Step 5 of Task 1 is a visual verify — re-rotate if needed before resizing |
| Netlify form not detected in `dist/` | Task 14 Step 2 greps for the form name in built HTML |
| Stale `navigation.test.ts` masking real failures | Task 2 brings it in sync as the *first* nav-related step |
| Existing `'logo links to home'` test broken (logo is a `<span>`, not `<a>`) | Task 2 Step 2 fixes it |
| New content breaks existing a11y tests | Task 13 runs the full suite, including a11y |
| User wants a different bio photo later | Photo source is one file — easy to swap and rebuild |
