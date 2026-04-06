# ACE Guide to Eucalypts Melbourne — Website Design Specification

**Project**: Book website for *ACE Guide to Eucalypts Melbourne*
**Authors**: Roderick Fensham & Vicky Shukuroglou
**Publisher**: ACE Publishing | **ISBN**: 9780645232615
**Date**: 2026-04-06
**Status**: Approved design — ready for implementation planning

---

## 1. Design Philosophy & Tone Presets

### Core Principle: "Quiet Authority"

The site should feel like the book itself — expert knowledge delivered without ego, beauty that earns attention rather than demanding it. Vicky's aesthetic of intimate observation over spectacle governs everything.

### Three Selectable Tone Presets

Choose at build time. Each adjusts colour warmth, spacing, animation speed, and copy voice. **Default preset: "Field Companion"** — the most balanced option. Build and test this first. The other two presets are documented for future selection but are Phase C scope (the CSS architecture supports them from day one via custom properties, but only one ships at launch).

#### Preset 1 — "Dawn Walk" (Reverent & Still)

- Maximum whitespace, oversized photography, minimal text visible above the fold
- Subtle scroll-triggered opacity fade-ins only (200ms+). No animation on page load. No parallax.
- Copy voice: sparse, poetic. Let images carry meaning.
- Risk: may feel too sparse to convert. Mitigation: strong CTA placement.

#### Preset 2 — "Field Companion" (Warm & Inviting)

- Generous but not excessive whitespace, text and image balanced
- Gentle fade-in on scroll, warm colour temperature
- Copy voice: knowledgeable friend, second person ("You'll notice the rough bark..."), generous with context
- Risk: can drift into "lifestyle blog." Mitigation: ground in scientific specificity.

#### Preset 3 — "The Guide" (Grounded & Authoritative)

- Tighter grid, clear information hierarchy, structured layouts
- Minimal animation, snappy transitions
- Copy voice: confident, third person, field-guide register ("Messmate Stringybark occurs across...")
- Risk: can feel clinical. Mitigation: let Vicky's photography carry warmth.

### Shared Across All Presets

- Photography is always the hero — never decorative, always doing identification work
- Acknowledgment of Country is structurally prominent, not a footer afterthought
- No visual clutter, no stock imagery, no generic nature iconography
- Accessibility: WCAG AA minimum, respecting the "quiet design" principle that good design includes everyone

---

## 2. Visual Design System

### Colour Palette

Three palette layers, each tone preset emphasises different layers.

#### Earth Layer (primary)

| Token | Hex | Usage |
|---|---|---|
| `--color-bg` | `#F5F0EB` | Warm off-white background (bleached bark) |
| `--color-text` | `#2C2C2A` | Deep charcoal for body text (wet bark) |
| `--color-text-secondary` | `#6B6560` | Mid-warm grey for secondary text |

#### Canopy Layer (accent)

| Token | Hex | Usage |
|---|---|---|
| `--color-green` | `#4D6A4F` | Muted grey-green (mature eucalypt leaf). WCAG AA compliant for large text (3.1:1+ against bg). Use for headings, subheadings, and decorative accents only — not body text. |
| `--color-olive` | `#7A6F3A` | Darkened golden-olive (new growth). WCAG AA compliant (4.5:1+ against bg). Decorative use preferred — borders, subtle backgrounds, botanical motifs. |

#### Signal Layer (functional)

| Token | Hex | Usage |
|---|---|---|
| `--color-cta` | `#A8532E` | Terracotta/ochre for CTAs and links. WCAG AA compliant (4.71:1 against bg). Button text: use `--color-bg` (light on dark). |
| `--color-cta-hover` | `#8C4425` | Darker variant for hover/active states |

**What the palette is NOT:** saturated "eco-green," bright primary colours, anything that looks like a national parks brochure or a wellness brand.

### Typography

- **Headings**: Fraunces (or similar organic serif — Lora, Newsreader). Bookish without being stuffy, conveys authority and warmth.
- **Body**: Source Sans 3 (or similar humanist sans — Inter, Nunito Sans). Readable at all sizes, quietly modern.
- **Species names** (Latin binomials): italic serif, always. Field-guide convention, non-negotiable.
- **All fonts open-source** (Google Fonts or similar) for static site hosting.

| Token | Value |
|---|---|
| `--font-heading` | `'Fraunces', serif` |
| `--font-body` | `'Source Sans 3', sans-serif` |
| `--font-size-base` | `1.125rem` (18px). Applied to `body` element only — `html` retains browser default 16px so all `rem` calculations remain 16px-based. |
| `--line-height-body` | `1.65` |
| `--line-height-heading` | `1.2` |

### Spacing & Layout

| Token | Value |
|---|---|
| `--space-xs` | `0.5rem` |
| `--space-sm` | `1rem` |
| `--space-md` | `2rem` |
| `--space-lg` | `4rem` |
| `--space-xl` | `6rem` |
| `--content-width` | `45rem` (~720px for text readability) |
| `--wide-width` | `72rem` (card grids) |

- Full-bleed for hero photography
- Generous vertical rhythm — minimum 4rem between major sections
- Mobile-first responsive. The book is a pocket guide — the site must work in your hand on a bushwalk.
- Grid: single column for content pages, 2-3 column card grid for species index

### Photography Treatment

- Never cropped to circles, never overlaid with gradients, never in auto-rotating carousels
- Full-width or generous aspect ratios. Let Vicky's compositions stand.
- Optional subtle warm colour grade to unify, but prefer her natural colour
- All images served as responsive `srcset` with WebP + fallback — performance matters for mobile in bushland with poor signal

### Iconography

- Minimal. Simple line-drawn botanical motifs (leaf outlines, bark texture patterns) if needed
- Never clip-art, never emoji, never stock SVG packs

---

## 3. Site Structure & Pages

Eight page types at launch: 6 fixed pages + 5-8 species sub-pages + 404.

### Navigation

Six nav links visible at all screen sizes (no hamburger menu). Order: **Home** | **Species** | **Identify** | **About** | **Authors** | **Buy**. The site title/logo also links home. On mobile (<640px), nav wraps to two lines if needed — still no hamburger. Species sub-pages and the 404 page are not in the nav; species sub-pages are accessed via the Species index and home page teaser strip.

### 404 Page

A branded 404 page with a eucalypt photograph and a friendly message: "This tree doesn't grow here. Try the species index or head home." Links to home and species index. Uses the same Base layout.

### Dark Mode

Not in scope for initial launch. The warm off-white palette is integral to the design identity. Note: if added later, the earth/canopy palette inverts well to dark backgrounds.

### 3.1 Home / Landing Page

The conversion engine. Structure top to bottom:

1. **Hero**: Full-bleed photograph (eucalypt canopy or bark close-up), book title, one-line positioning statement ("An identification guide to Melbourne's 33 indigenous eucalypt species"), primary CTA button ("Get the Book")
2. **The Problem/Promise**: 2-3 sentences — why this book exists, why it matters. Frame around connection to place: most Melburnians walk past eucalypts daily without knowing what they are. This book changes that.
3. **Visual Teaser Strip**: 3-4 species photos in a horizontal row, each linked to its species page. Tactile preview of what's inside.
4. **About the Book**: What it covers, how it works (bark + leaf identification method), physical format, who it's for. One paragraph.
5. **Social Proof**: Endorsement quotes (2-3 maximum, static display).
6. **Authors**: Compact author cards with portraits, linked to full Authors page.
7. **Acknowledgment of Country**: Prominent placement — after authors, before footer. (See Section 5.)
8. **Footer**: Buy links (multiple retailers), contact, copyright, Eucalypt Australia credit.

### 3.2 Species Index Page

A browseable grid of all published species. At launch this shows the initial 5-8 species as cards (photo, common name, scientific name, bark group tag). Cards link to the full species page. As the site grows toward 33 species in Phase C, this page gains filtering by bark group. Also serves as a GEO target for "what eucalypts grow in Melbourne."

### 3.3 Species Pages (5-8 individual pages)

The GEO workhorses. Each page is a mini field-guide entry:

- **Species name**: Common name as H1, Latin binomial as subtitle
- **Hero photo**: The tree in habitat or a key identifying feature
- **Identification panel**: Structured data — bark type, leaf shape/colour, bud/fruit description, height range, flowering season. Consistent layout across all species pages.
- **Photo gallery**: 3-5 images — bark close-up, leaf (upper and lower surface), buds, fruit, whole tree silhouette. Captioned with meaningful alt text.
- **Where to find it**: Melbourne locations/habitats where this species grows.
- **Aboriginal names and knowledge**: Where available and where permission has been given. (See Section 5.) If not available, section is omitted — no placeholder.
- **CTA**: "This is one of 33 indigenous eucalypt species in Melbourne. The ACE Guide covers them all." with link to buy page.

**Species selection criteria:** Choose for variety across identification groups (a stringybark, a gum, a box, a peppermint, an ironbark) and for recognisability (species people encounter in common Melbourne parks).

### 3.4 About the Book

- The ACE identification method explained (bark texture x leaf colour)
- What's inside — structure, page count, format
- The Dahl Fellowship and Eucalypt Australia story — how the book came to exist
- The ACE series context (Brisbane guide, EucaFlip Tasmania) — part of something larger
- Sample interior spread photograph

### 3.5 Authors

- **Vicky Shukuroglou**: Artist, photographer, educator, environmental advocate. Her path from *Loving Country* with Bruce Pascoe to eucalypt identification. Her work with Nillumbio and biodiversity in Nillumbik.
- **Rod Fensham**: Ecologist at University of Queensland, Queensland Herbarium. Creator of the ACE Brisbane guide.
- Frame as collaboration: artist-scientist partnership. Neither subordinate to the other.

### 3.6 Identification Tips

A generous freebie page — teaches the bark-and-leaf method without giving away the full guide:

- "How to look at a eucalypt" — what to notice (bark, leaves, buds, fruit, habitat)
- The ACE method in brief with 2-3 photo examples
- Common confusions and how to resolve them
- CTA: "Ready to identify all 33? Get the guide."
- Strong GEO target for queries like "how to identify eucalypts Melbourne"

### 3.7 Buy the Book

Dedicated purchase page:

- Book cover image (large, high-quality)
- Key facts: authors, ISBN, publisher, page count, dimensions, format
- Price (or "prices vary by retailer")
- Retailer buttons: Australian Koala Foundation (lead), Booktopia, Dymocks, Amazon AU, Fishpond
- Text note: "Ask your local bookshop" — supports indie retail
- Gift framing: "Know someone who walks in Melbourne's bushland? This makes a meaningful gift."

---

## 4. Generative AI Search Engine Optimization (GEO) Strategy

### How GEO Differs from Traditional SEO

Traditional SEO optimises for Google's link-ranking algorithm. GEO optimises for citation by language models — AI systems that retrieve, summarise, and attribute. The emphasis shifts:

- Structured, authoritative content matters more than keyword density
- Direct answers to specific questions get cited; vague overview pages don't
- Schema markup and clean HTML semantics help AI systems parse and attribute correctly
- Unique factual content that doesn't exist elsewhere is preferentially cited

### GEO Tactics

#### 4.1 Question-Anchored Content Architecture

Every species page and the ID tips page should be structured around the questions people actually ask. Not as an FAQ — as natural, authoritative content that opens with a direct answer.

Target queries:
- "How do I identify a Messmate Stringybark?" -> Messmate species page
- "What eucalypts are native to Melbourne?" -> Home page + species index
- "What's the difference between a stringybark and a gum?" -> ID tips page
- "Where can I see eucalypts in [Melbourne park name]?" -> Species pages with location data

#### 4.2 Structured Data (Schema.org)

| Page | Schema Type |
|---|---|
| Home + Buy | `Book` (title, author, ISBN, publisher, image, purchase links) |
| Species pages | `Article` (with `speakable` markup for key identification summary) + `WebPage` with `author`, `datePublished`, `about` |
| Authors | `Person` |
| Identification Tips | `HowTo` |
| All pages | `BreadcrumbList` |

Implemented as JSON-LD `<script>` tags in the `<head>`.

#### 4.3 Canonical Authority Signals

- Every page has a clear `<title>` and `meta description` that reads like a direct answer
- Author pages link to verifiable external profiles (LinkedIn, Bundanon, UQ staff page)
- Outbound links to authoritative sources (Royal Botanic Gardens Melbourne, Eucalypt Australia, relevant academic papers)
- Pursue inbound links from Eucalypt Australia, savethekoala.com, Nillumbio, local councils

#### 4.4 Content Uniqueness Strategy

Unfair advantages AI systems will preferentially cite:
- **Vicky's photography** — unique images no other site has
- **Melbourne-specific species data** — fills a genuine gap (most resources cover all of Australia or a single state)
- **The bark + leaf identification method** explained for a lay audience
- **Aboriginal names and ecological knowledge** (where permission is given)

#### 4.5 Freshness and Citability

- Each species page includes a "Last reviewed" date
- Factual content written in a citable register: "Messmate Stringybark (*Eucalyptus obliqua*) is Melbourne's most widespread eucalypt species, found in..."
- Definitive statements where the science supports it. Avoid hedging in factual sections.

#### 4.6 Technical GEO Hygiene

- Clean semantic HTML: `<article>`, `<section>`, `<figure>`, `<figcaption>`, proper heading hierarchy
- Fast page loads (static site)
- `robots.txt` and `sitemap.xml` that welcome crawlers (do NOT block GPTBot, ClaudeBot, etc.)
- Open Graph and Twitter Card meta tags. **`og:image`**: book cover on home/buy pages; species hero photo on species pages; a default site image on other pages.
- RSS feed for species pages (Phase C — useful once new species are being added regularly; omit at launch)
- Single canonical URL per page

#### 4.7 Measuring GEO Success

- Periodically search target queries in ChatGPT, Perplexity, Gemini, Claude — check for citation
- Track referral traffic from AI-powered search in analytics
- Google Search Console for impressions and clicks on target queries

---

## 5. Aboriginal & Country Sensibilities

### Guiding Principles

#### 5.1 Country Is Not a Theme — It's the Foundation

These 33 species have lived on Wurundjeri and Bunurong Country for millennia. Aboriginal people have known, named, used, and cared for these trees since long before European botanical classification. The site should convey that eucalypt identification is joining a conversation, not starting one.

#### 5.2 Nothing About Us Without Us

Any Aboriginal knowledge, language, names, or cultural information on the site must be:
- Sourced with explicit permission from appropriate knowledge holders
- Attributed to the community or individual who shared it
- Reviewed by those same people before publication
- Never presented as generic "Aboriginal knowledge" — it belongs to specific peoples and places

#### 5.3 Acknowledgment of Country Is Structural, Not Decorative

- Appears on the home page in a prominent position (after authors, before footer)
- Not a dismissable banner, not hidden in the footer
- Written specifically for this project, not a boilerplate template
- Names the Wurundjeri Woi-wurrung and Bunurong/Boon Wurrung peoples specifically
- Acknowledges ongoing custodianship and deep ecological knowledge
- Should be reviewed by relevant Traditional Owner groups if possible

#### 5.4 Language and Naming

- Where Aboriginal names for species are known and permission is given, they appear **first or alongside** the common English name — not as a footnote
- Language group is always attributed: "Known as [name] in Woi-wurrung language" — not just "Aboriginal name: [name]"
- Never use past tense for Aboriginal knowledge. Use present tense: "Wurundjeri people know this tree as..." These are living cultures.

#### 5.5 Visual and Design Respect

- No use of Aboriginal art motifs, dot painting, or Indigenous visual iconography unless created by or commissioned from Aboriginal artists with permissions
- Colour palette draws from Country (bark, earth, leaf, ochre) without claiming to represent Aboriginal visual culture
- Photography of culturally significant sites checked for any restrictions on reproduction

### In Practice

- **Species pages with permission**: dedicated Aboriginal knowledge section with proper attribution
- **Species pages without permission**: section is omitted entirely. No "Aboriginal name: unknown." Silence is more respectful than a gap.
- **Home page**: positioning may reference deep time ("33 species that have shaped this Country for tens of thousands of years") if Vicky approves the framing
- **Authors page**: acknowledge Vicky's approach to Country was shaped by her collaboration with Bruce Pascoe on *Loving Country*

### Process Recommendation

Before the site goes live, seek review from:
- Wurundjeri Woi-wurrung Cultural Heritage Aboriginal Corporation
- Bunurong Land Council Aboriginal Corporation

Not legally required for a eucalypt field guide website, but consistent with Vicky's established practice and the values the site embodies.

---

## 6. Conversion Strategy

### Philosophy

**Give value first, then offer more.** Every species page teaches something real. The identification tips page is genuinely useful. The CTA is always: "This is one of 33 indigenous eucalypt species in Melbourne. The ACE Guide covers them all."

This is not altruism — it's the highest-converting approach for this audience. Environmentally aware, educated readers see through hard sells and respect generosity.

### CTA Placement Rules

**One primary CTA per page, positioned after value delivery:**
- Species pages: CTA after the full identification content
- ID tips page: CTA at the end, after the method is taught
- Home page: CTA in the hero (for decided buyers) AND after social proof (for those needing convincing)

**CTA design:**
- Button text is specific: "Get the Guide" or "Find the Book" — not "Buy Now" or "Shop"
- Terracotta/ochre from the signal palette
- No sticky headers, no floating buttons, no exit-intent pop-ups

**Soft CTAs throughout:**
- Bottom of each species page: "This is one of 33 indigenous eucalypt species in Melbourne. The ACE Guide covers them all."
- Photo captions where appropriate: "From the ACE Guide to Eucalypts Melbourne"
- Never interruptive. Always at natural pause points.

### Social Proof

- Short pull quotes (one sentence) on the home page — max 3
- Full quotes on About the Book page
- Always attributed with name and credential
- Bruce Pascoe endorsement carries significant weight with this audience

### Analytics & Measurement

- **Plausible** (plausible.io) — privacy-respecting, no cookies, ~1KB script
- Track: page views, referral sources, outbound buy-link clicks, visitor country
- Monitor which retailer gets most clicks (informs primary CTA placement)
- Monitor which pages drive most buy-link clicks (informs C expansion priority)

---

## 7. Feminist Quiet Design Principles

### What Feminist Design Means Here

Feminist design rejects the defaults of attention-economy web design — dark patterns, manufactured urgency, extraction of attention and data. It's design that respects the visitor's autonomy, time, and intelligence.

Vicky's art practice — work "deliberately designed to appear insubstantial," intimate observation, interrogating the true cost of materials — maps directly onto these principles.

### The Rules

#### 7.1 Respect Attention — Never Steal It

- No auto-playing video or audio
- No animations on page load
- No scroll-jacking or parallax that overrides the user's scroll speed
- No notification badges, no "X people are viewing this" counters
- No chat widgets, no pop-ups of any kind
- Subtle scroll-triggered fade-ins acceptable in "Dawn Walk" preset only (200ms+, opacity only)

#### 7.2 Respect Data — Never Extract It

- No tracking cookies. No Google Analytics. Privacy-respecting analytics only (Plausible, Fathom, or none).
- No email capture pop-ups. Newsletter (if it exists) is a single line in the footer with an inline form. Never gated.
- No third-party scripts beyond analytics. No social media embeds that phone home. Link to profiles instead.
- Site works fully with JavaScript disabled.

#### 7.3 Respect Intelligence — Never Condescend

- Don't explain what a button does. "Get the Guide" is sufficient.
- Don't dumb down the science. Use proper botanical terminology with natural, contextual explanation: "The bark is decorticating (peeling in ribbons to reveal smooth new bark beneath)."
- Don't over-explain the values. The Acknowledgment of Country, the Aboriginal knowledge sections, the environmental framing speak for themselves. No banner saying "We care about Country." Show, don't declare.

#### 7.4 Respect Access — Design for Everyone

- WCAG AA colour contrast on all text
- All images have meaningful alt text: "Close-up of Messmate Stringybark bark showing long fibrous strips" — not "eucalypt photo"
- Logical heading hierarchy for screen readers
- Touch targets minimum 44x44px on mobile
- No information conveyed by colour alone
- `prefers-reduced-motion` media query respected — disable all transitions
- Fast load times: target First Contentful Paint <2.5 seconds on 3G (critical path <150KB)

#### 7.5 Respect the Maker — Credit Is Structural

- Vicky's name appears as photographer/illustrator on every page that uses her images
- Rod's name appears as co-author consistently
- Aboriginal knowledge holders credited by name (with permission) on the relevant species page
- Dahl Fellowship / Eucalypt Australia funding acknowledged visibly

### Comparison Table

| Typical book site | This site |
|---|---|
| Hero with "BUY NOW" as primary action | Hero with the tree — CTA is secondary |
| Email pop-up within 5 seconds | No pop-ups ever |
| Google Analytics + Facebook Pixel | Plausible or nothing |
| Stock photos filling gaps | Only Vicky's photography or nothing |
| Endorsement carousel auto-rotating | Static quotes, visitor controls pace |
| "As seen in..." press logos | Simple text list if press exists |
| Hamburger menu hiding pages | All 6 nav links visible at all times |

---

## 8. Technical Stack & Implementation Spec

### Static Site Generator: Astro

**Why Astro:**
- Zero JavaScript by default — pages ship as pure HTML/CSS
- Built-in image optimisation (`<Image>` component: responsive `srcset`, WebP, lazy loading)
- Content Collections for species pages — define schema once, validate all pages against it. Makes C expansion trivial.
- Markdown + frontmatter for content — editable in a text editor
- Excellent static hosting on Netlify/Cloudflare Pages

### Project Structure

```
/
├── src/
│   ├── content/
│   │   ├── species/              # One markdown file per species, images co-located
│   │   │   ├── messmate-stringybark/
│   │   │   │   ├── index.md
│   │   │   │   └── images/       # Species photos live alongside their markdown
│   │   │   ├── manna-gum/
│   │   │   │   ├── index.md
│   │   │   │   └── images/
│   │   │   └── ...
│   │   └── endorsements/         # One markdown file per quote
│   ├── layouts/
│   │   ├── Base.astro            # HTML head, nav, footer, schema
│   │   ├── Species.astro         # Species page template
│   │   └── Page.astro            # Generic content page
│   ├── pages/
│   │   ├── index.astro           # Home
│   │   ├── about.astro           # About the Book
│   │   ├── authors.astro         # Authors
│   │   ├── identify.astro        # Identification Tips
│   │   ├── buy.astro             # Buy the Book
│   │   ├── 404.astro             # Branded 404 page
│   │   └── species/
│   │       ├── index.astro       # Species index / browse page
│   │       └── [...slug].astro   # Dynamic species routes
│   ├── components/
│   │   ├── Hero.astro
│   │   ├── SpeciesCard.astro
│   │   ├── BuyButton.astro
│   │   ├── Endorsement.astro
│   │   ├── PhotoGallery.astro
│   │   └── AcknowledgmentOfCountry.astro
│   └── styles/
│       ├── tokens.css            # Design tokens
│       ├── global.css            # Base styles, reset
│       └── presets/
│           ├── dawn-walk.css
│           ├── field-companion.css
│           └── the-guide.css
├── public/
│   ├── images/
│   │   ├── authors/              # Portraits
│   │   └── book/                 # Cover, spreads
│   │   # Note: species photos live in src/content/species/<name>/images/ for Astro image optimisation
│   ├── favicon.svg               # SVG favicon (modern browsers)
│   ├── apple-touch-icon.png      # 180x180 PNG (iOS home screen — users may save for bushwalks)
│   ├── site.webmanifest           # Web app manifest with icons
│   └── robots.txt
├── astro.config.mjs
└── package.json
```

### Species Content Schema

```yaml
---
common_name: "Messmate Stringybark"
scientific_name: "Eucalyptus obliqua"
group: "stringybark"              # For future C grouping/filtering
aboriginal_name: ""               # Only if permission granted
aboriginal_language: ""           # e.g., "Woi-wurrung"
aboriginal_attribution: ""        # Who gave permission
bark_type: "Stringybark — long fibrous strips, grey-brown"
leaf_description: "Discolorous, broad-lanceolate, 8-15cm"
height_range: "20-45m"
flowering_season: "January-April"
locations:
  - "Warrandyte State Park"
  - "Yarra Bend"
  - "Dandenong Ranges"
hero_image: "./images/messmate-hero.jpg"   # Relative to this markdown file (co-located in src/content/species/)
gallery:
  - src: "./images/messmate-bark.jpg"
    alt: "Thick fibrous stringybark peeling in long strips"
    caption: "Bark detail"
  - src: "./images/messmate-leaf.jpg"
    alt: "Broad lanceolate leaf, darker green above, paler below"
    caption: "Leaf — note the uneven base (obliqua means 'oblique')"
featured: true                    # Show on home page teaser strip
---

Messmate Stringybark is Melbourne's most widespread eucalypt...
```

### CSS Design Tokens

```css
:root {
  /* Earth layer */
  --color-bg:             #F5F0EB;
  --color-text:           #2C2C2A;
  --color-text-secondary: #6B6560;

  /* Canopy layer */
  --color-green:          #4D6A4F;  /* Large text / headings only against bg */
  --color-olive:          #7A6F3A;  /* Decorative use preferred */

  /* Signal layer */
  --color-cta:            #A8532E;  /* AA compliant against bg; use --color-bg for button text */
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
  --content-width:        45rem;
  --wide-width:           72rem;
}

@media (prefers-reduced-motion: reduce) {
  * { transition: none !important; animation: none !important; }
}
```

### Tone Preset Implementation

The base tokens in `tokens.css` represent the "Field Companion" (default) values. Other presets override specific tokens:

- **field-companion.css** (default — ships at launch): `--color-bg` warmer toward cream, `--line-height-body: 1.7`, gentle fade-in on scroll. This is the base state; this file contains minimal overrides.
- **dawn-walk.css** (Phase C): `--space-lg` and `--space-xl` +50%, transitions 400ms+, `--font-size-base: 1.25rem`
- **the-guide.css** (Phase C): `--space-lg: 3rem`, heading `font-weight: 600`, border-left accents on identification panels

Switching preset: single CSS import change in `Base.astro`.

### Schema Markup

JSON-LD `<script>` tags generated in `Base.astro`:
- `Book` on home + buy pages
- `WebPage` + `Article` on species pages with `author`, `datePublished`, `about`
- `Person` on authors page
- `HowTo` on identification tips page
- `BreadcrumbList` on all pages
- `ImageObject` for photography with attribution

### Hosting & Deployment

- **Netlify** or **Cloudflare Pages** — free tier sufficient
- Deploy from Git — push to main triggers rebuild
- Custom domain via DNS
- Automatic HTTPS via Let's Encrypt
- `_headers` file for cache control and security headers

### Analytics

- **Plausible** (plausible.io) — no cookies, ~1KB, GDPR compliant without consent banners
- Track: page views, referral sources, outbound buy-link clicks, visitor country
- Self-hosted option available if cost is a concern

### Performance Targets

| Metric | Target |
|---|---|
| Lighthouse Performance | 95+ |
| First Contentful Paint | <1.2s (broadband), <2.5s (3G) |
| Largest Contentful Paint | <2.0s (broadband), <4.0s (3G) |
| Critical path weight (HTML + CSS + above-fold) | <150KB |
| Total page weight (home) | <500KB |
| Total page weight (species) | <800KB (photography-heavy; images lazy-loaded below fold) |
| JavaScript shipped | 0KB (or <5KB for analytics) |
| Works without JavaScript | Yes, fully |

**Photo gallery interaction model:** The gallery is a static CSS grid of images — no lightbox, no JavaScript. Each image is large enough to examine detail at its displayed size. If a zoom/lightbox is added later, it must be progressive enhancement (gallery fully usable without JS).

---

## 9. Implementation Roadmap

### Phase 1: Content Gathering (Before Build)

**Must have:**

- [ ] Book cover image (high-res, 300dpi minimum)
- [ ] 5-8 species selected, with photography for each (hero + 3-5 gallery images)
- [ ] Species identification data (bark, leaf, height, flowering, locations)
- [ ] Author portraits (Vicky, Rod)
- [ ] Author bios (2-3 paragraphs each)
- [ ] Acknowledgment of Country text, written for this project
- [ ] Retailer URLs for buy page
- [ ] Positioning statement / tagline for the hero
- [ ] 2-3 endorsement quotes with attribution

**Should have:**

- [ ] Aboriginal names and knowledge for 2-3 species (with documented permission)
- [ ] Sample interior spread photograph
- [ ] Dahl Fellowship / Eucalypt Australia story (1-2 paragraphs)
- [ ] Domain name secured

**Nice to have:**

- [ ] Press coverage or reviews
- [ ] Short video/audio of Vicky discussing the book
- [ ] Review from Wurundjeri Woi-wurrung Cultural Heritage Aboriginal Corporation

### Phase 2: Build (Single Session)

1. Scaffold Astro project, install dependencies, configure
2. Implement design tokens and "Field Companion" preset in CSS (architecture supports future presets via custom properties)
3. Base layout: nav (7 links, no hamburger), footer, Acknowledgment of Country component, schema markup, favicon/web manifest, OG meta tags
4. 404 page
5. Home page: hero, positioning, teaser strip, endorsements, author cards, CTAs
6. Species template: build once from content schema, populate first species
7. Species index page: card grid linking to all published species
8. Remaining species: add content, verify each renders correctly
9. About the Book page
10. Authors page with Person schema
11. Identification Tips page with HowTo schema
12. Buy page with retailer links
13. Analytics: Plausible script, outbound link tracking
14. Performance pass: image optimisation, Lighthouse audit, 3G throttle test
15. Deploy to Netlify/Cloudflare, configure domain

### Phase 3: Post-Launch

- [ ] Submit sitemap to Google Search Console
- [ ] Test GEO: search target queries in ChatGPT, Perplexity, Gemini, Claude — document baseline
- [ ] Pursue inbound links (Eucalypt Australia, savethekoala.com, Nillumbio, local councils)
- [ ] Share species pages individually on social media
- [ ] Monitor analytics for 2-4 weeks

### Phase C: Growth Path

Open questions and expansion options for when the site grows beyond the initial build:

**Any time after launch:**
- Implement "Dawn Walk" and "The Guide" tone presets (CSS only — architecture supports this from day one)
- Add RSS feed for species pages (useful once species are being added regularly)

**At ~15 species:**
- Add species index page with filtering by bark group
- *Question: Does the palette need visual differentiation for species groups (stringybarks vs gums vs boxes)? Colour-coded borders, subtle background tints?*

**At 33 species (complete):**
- Add Pagefind static search (zero-dependency, client-side, <50KB)
- *Question: How does search fit the quiet design ethos? Probably a small, unobtrusive field in the nav that expands on click.*
- Consider interactive identification key (significant standalone project)
- *Question: Would this be a separate page or embedded in Identification Tips?*
- Consider species distribution map (Leaflet.js, static GeoJSON, zero API dependencies)
- *Question: Is a "Melbourne Eucalypt Map" showing species distribution worth building? Strong GEO magnet with no real competition online.*
- Consider headless CMS (Tina, Decap) for non-technical editing
- *Question: What's the trigger point for a CMS — when Vicky needs to edit without touching markdown?*
- "Recommended reading" on buy page (Brisbane ACE Guide, EucaFlip, Loving Country)
- *Question: Should species pages support user-submitted sighting locations?*

**Partnership:**
- *Question: At full scale, is there opportunity for formal partnership with Traditional Owner groups? Should they contribute content, or should the site link out to their resources rather than hosting that knowledge?*
