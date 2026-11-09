# Emon Arefin — Portfolio Design System

> **For AI assistants (Claude Code, etc.):** this file is the single source of truth for building the portfolio in Astro. Read it before writing any UI. Rules in **§0** are non‑negotiable. Values in tables are exact — do not round or "improve" them. If something isn't covered here, check the Figma file (§12) and ask before inventing.
> Companion file: **`BUILD_PROMPT.md`** (how we work, phases, behaviour walkthrough). The two files are kept in sync; if they ever disagree, stop and ask Emon.

---

## 0. Rules for whoever builds this

1. **Never hard‑code a colour or font size.** Always use the CSS custom properties in §2 and §3. If a value is missing, add a token here first.
2. **One font family: Inter.** Weights 400 (Regular) and 500 (Medium) only. No mono, no serif.
3. **Mobile‑first CSS.** Base styles = mobile (390 design). `min-width: 768px` = tablet tweaks (2‑column grids where they fit, still mobile type). `min-width: 1024px` = desktop (1440 design).
4. **Simplicity over decoration.** Generous white space; no drop shadows; imagery has square corners.
5. **Every animation must respect `prefers-reduced-motion: reduce`** (remove transitions/animations, show the end state instantly, stop gallery autoplay).
6. **Hover effects only on real pointers:** wrap them in `@media (hover: hover) and (pointer: fine)`, and give every hover state a matching `:focus-visible` state.
7. **Content comes from the CMS** (§10), never hard‑coded in components — except UI labels.
8. Semantic HTML, keyboard accessible, visible focus states, alt text on every image.
9. **Minimal JavaScript.** Plain CSS (no Tailwind), no React on public pages, no GSAP/jQuery. Only these get small vanilla `<script>`s: Showcase Gallery, Work filters, Project Modal, mobile menu, Cal.com embed loader. **The hero intro is pure CSS.**

### Tech stack (decided)
| Need | Use |
|---|---|
| Framework | Astro (current stable), TypeScript strict, static output; on-demand rendering only where Keystatic needs it |
| Styling | Plain CSS: global `tokens.css`, `typography.css`, `global.css` + scoped `<style>` in each component |
| Font | Inter 400/500, self-hosted (Fontsource or Astro's fonts API, per current docs) |
| CMS | Astro content collections + Keystatic (`/keystatic`); `@astrojs/react` + `@astrojs/markdoc` only for the Keystatic admin |
| Images | `astro:assets` (`<Image>` / `<Picture>`), files in `src/assets/…` |
| Carousel | Embla Carousel (`embla-carousel` + `embla-carousel-autoplay`) |
| Booking | Cal.com inline embed |
| Hosting | Netlify (default) or Vercel + its Astro adapter; `@astrojs/sitemap` |

---

## 1. Brand & principles

- **Who:** Emon Arefin — Product Designer & Photographer, Framer designer/developer, based in Bangladesh (GMT+6).
- **Feel:** apple.com's calm, spacious language + skale.solutions' tight, image‑led portfolio grid.
- **Principles:** simple · spacious · image‑first · quiet motion · one type family.

---

## 2. Colour tokens

**One mode only (Light).** There is no dark theme — the whole site, including the Project Modal, uses these tokens. Names map 1:1 to the Figma variable collection **"Portfolio / Color"**.

| Token | Value | Used for |
|---|---|---|
| `--text-primary` | `#162026` | Headings, body, icons |
| `--text-secondary` | `#6B767D` | Supporting text, nav links, tags |
| `--text-tertiary` | `#9AA0A5` | Meta, counts, placeholders |
| `--text-inverse` | `#FFFFFF` | Text on dark fills |
| `--bg-primary` | `#FFFFFF` | Page, cards on grey bands, modal |
| `--bg-secondary` | `#F5F5F7` | Grey bands, hero arc, work thumbnail tiles, chips, modal close button |
| `--bg-tertiary` | `#E8E8ED` | Placeholders, check-icon circles |
| `--border-primary` | `#E3E5E8` | Hairlines, footer top border, modal stats divider |
| `--border-secondary` | `#D5D9DD` | Timeline line, dividers, dashed embed |
| `--border-subtle` | `rgba(0,0,0,.12)` | Work-card tags, hover outline |
| `--button-primary-bg` | `#162026` | Primary button, Arrow Button hover fill |
| `--button-primary-text` | `#FFFFFF` | Primary button label & chevron |
| `--button-primary-chip` | `rgba(255,255,255,.16)` | Sweeping chip inside primary button |
| `--button-primary-bg-hover` | `#FF280F` | Primary **and** plain Secondary hover background (Figma 2026-11-09) |
| `--button-secondary-bg` | `#FFFFFF` | Secondary button |
| `--button-secondary-bg-hover` | `#F5F5F7` | Secondary hover |
| `--button-secondary-text` | `#162026` | Secondary label |
| `--button-secondary-border` | `#E3E5E8` | Secondary outline |
| `--surface-overlay` | `rgba(255,255,255,.90)` | Work-card hover overlay (+ 18px backdrop blur) |
| `--surface-scrim` | `rgba(8,13,15,.55)` | Behind the modal (+ 12px backdrop blur) |
| `--status-live` | `#34C759` | "Currently" pulsing dot |

```css
/* src/styles/tokens.css */
:root {
  --text-primary:#162026; --text-secondary:#6B767D; --text-tertiary:#9AA0A5; --text-inverse:#FFFFFF;
  --bg-primary:#FFFFFF; --bg-secondary:#F5F5F7; --bg-tertiary:#E8E8ED;
  --border-primary:#E3E5E8; --border-secondary:#D5D9DD; --border-subtle:rgba(0,0,0,.12);
  --button-primary-bg:#162026; --button-primary-text:#FFFFFF; --button-primary-chip:rgba(255,255,255,.16); --button-primary-bg-hover:#FF280F;
  --button-secondary-bg:#FFFFFF; --button-secondary-bg-hover:#F5F5F7; --button-secondary-text:#162026; --button-secondary-border:#E3E5E8;
  --surface-overlay:rgba(255,255,255,.90); --surface-scrim:rgba(8,13,15,.55);
  --status-live:#34C759;
}
```

---

## 3. Typography

**Family:** Inter, self-hosted, weights 400 & 500 only, `font-display: swap`; preload only these two weights.
**Minimum sizes:** desktop **14px**, mobile **12px**.
**Scaling:** every role has a desktop and a mobile size. Figma collection **"Portfolio / Type"** (modes Desktop / Mobile) holds the same values.

| Role (token) | Desktop size / line-height | Mobile size / line-height | Weight | Letter-spacing | Used for |
|---|---|---|---|---|---|
| `display` | 48 / 53 | 32 / 36 | 500 | −3% | Hero H1, section headings, prices |
| `h1` | 40 / 46 | 28 / 34 | 500 | −3% | "Product Designer at Rubik" statement |
| `h2` | 32 / 38 | 24 / 30 | 500 | −2% | Modal project title |
| `h3` | 28 / 32 | 22 / 28 | 500 | −3% | About facts (5+, 100+) |
| `h4` | 22 / 28 | 20 / 26 | 500 | −2% | Pricing plan name |
| `h5` | 20 / 26 | 18 / 24 | 500 | −2% | Logo wordmark, modal stat values, embed title |
| `body-lg` | 18 / 28 | 16 / 24 | 400 | −1% | Bio, modal summary, lead text |
| `body` | 16 / 24 | 15 / 22 | 400 / 500 | −1% | Default body, card titles, feature lists |
| `body-sm` | 15 / 22 | 14 / 20 | 400 | −1% | Booking meta, footer blurb |
| `label` | 14 / 20 | 14 / 20 | 400 / 500 | −1% | **Interactive text:** buttons, nav, chips, footer links (does not shrink) |
| `caption` | 14 / 20 | 12 / 16 | 400 | −1% | Tags, years, legal, "What's included" |

```css
/* src/styles/typography.css — mobile first */
:root {
  --font-sans: "Inter", system-ui, -apple-system, sans-serif;
  --font-size-display:32px; --line-height-display:36px;
  --font-size-h1:28px;      --line-height-h1:34px;
  --font-size-h2:24px;      --line-height-h2:30px;
  --font-size-h3:22px;      --line-height-h3:28px;
  --font-size-h4:20px;      --line-height-h4:26px;
  --font-size-h5:18px;      --line-height-h5:24px;
  --font-size-body-lg:16px; --line-height-body-lg:24px;
  --font-size-body:15px;    --line-height-body:22px;
  --font-size-body-sm:14px; --line-height-body-sm:20px;
  --font-size-label:14px;   --line-height-label:20px;
  --font-size-caption:12px; --line-height-caption:16px;
}
@media (min-width: 1024px) {
  :root {
    --font-size-display:48px; --line-height-display:53px;
    --font-size-h1:40px;      --line-height-h1:46px;
    --font-size-h2:32px;      --line-height-h2:38px;
    --font-size-h3:28px;      --line-height-h3:32px;
    --font-size-h4:22px;      --line-height-h4:28px;
    --font-size-h5:20px;      --line-height-h5:26px;
    --font-size-body-lg:18px; --line-height-body-lg:28px;
    --font-size-body:16px;    --line-height-body:24px;
    --font-size-body-sm:15px; --line-height-body-sm:22px;
    --font-size-caption:14px; --line-height-caption:20px;
  }
}
/* Utility classes: .t-display, .t-h1 … .t-caption set font-size, line-height, weight, letter-spacing from the table. */
```

---

## 4. Layout, spacing & radius

| | Desktop (≥1024) | Mobile (<768, designed at 390) |
|---|---|---|
| Design frame | 1440 | 390 |
| Side padding | 32 | 20 |
| Content width | 1376 (max) | 350 |
| Section padding (top/bottom) | 128 / 128 | 72 / 72 |
| Section header → content gap | 56 | 32 |
| Work grid | 2 columns, gap 24 (col) / 40 (row) | 1 column, gap 32 |
| Pricing plans | 2 columns, gap 16 | stacked, gap 16 |
| Showcase section padding (top/bottom) | 12 / 128 | 8 / 72 |

Tablet (768–1023): use mobile spacing with 2‑column grids where they fit; type stays on mobile scale. Above 1440 the content stays centred at max 1376 + 32px side padding.

**Anchors:** sections have ids `#work`, `#pricing`, `#book`; `scroll-behavior: smooth` (off under reduced motion) and `scroll-margin-top` = nav height.

**Hero arc on wide screens (2026-11-09):** the resting ellipse's horizontal radius is `max(1500px, 104.17vw)`, so above 1440 the curve keeps the Figma shape instead of dropping to the bottom.

**Section backgrounds** (updated 2026-11-08 to match Figma): Hero `--bg-primary` (grey arc) → Showcase `--bg-primary` (all sizes) → Work `--bg-primary` → Pricing `--bg-primary` with `--bg-secondary` plan cards → Book a Call `--bg-primary` → Footer `--bg-primary` with a 1px `--border-primary` top border.

**Spacing scale (px):** 4, 6, 8, 12, 14, 16, 20, 24, 32, 40, 48, 56, 64, 72, 96, 128.

**Radius:** buttons & chips **6** · chip inside primary button **3** · pills (eyebrow, badge, status, close) **999** · cards (pricing, Cal embed) **20** · modal **16** (mobile sheet: 20 top corners) · **imagery 0**.

**Effects:** no drop shadows. Backdrop blur only on the work-card overlay (18px) and the modal scrim (12px).

---

## 5. Components

Each maps to a Figma component of the same name (page "Portfolio Website", right-hand column).

### 5.1 Button (`ui/Button.astro`) — "Chip Sweep"
- **Props:** `variant` = `primary` | `secondary` | `secondary-chip`; `size` = `md` (40px) | `sm` (36px); `layout` = `hug` | `fill`; `label`; optional `count` (e.g. "08"); `href` (renders `<a>`, otherwise `<button>`); `external`.
- **Primary structure:** `<a class="btn btn--primary">` → `<span class="btn__chip" aria-hidden="true">` (chevron SVG) + `<span class="btn__label">`. Button: `position: relative; display: inline-flex; align-items: center`, radius 6, `--button-primary-bg`.
- **Chip:** `position: absolute; top: 4px; bottom: 4px; left: 4px; width: 32px` (28 at sm), radius 3, `--button-primary-chip`; flex with `justify-content: flex-end` and `padding-inline: 8px` (6 at sm), so at rest the 16px chevron sits centred in the square chip.
- **Rule:** in every state the chip keeps exactly **4px to each button edge it touches** — hovered, it is `inset: 4px` (4px top, right, bottom, left).
  - Padding: `hug` → left 44 (40 at sm), right **16 (14 at sm)**. On hover the label (and count) slide **24px left** while the chip sweeps right, so the chevron gets room (decided 2026-11-08). `fill` → `width:100%`, left & right 44, label centred, no slide.
  - Label `label` token, weight 500, `--button-primary-text`, sits above the chip (`position: relative; z-index: 1`).
- **Hover / focus-visible (primary) — UPDATED 2026-11-09 (Figma `Primary · Medium · Hover · Hug`):** background → `--button-primary-bg-hover`; the 32px (28 sm) square chip moves from the left edge to the right edge (4px inset); on hug buttons the label slides left to 12px from the edge (−32px md / −28px sm); fill buttons keep the label centred. Plain **Secondary** hover → same red background and border, white label, count at 72% white. *(Superseded text below kept for history.)*
- ~~Hover / focus-visible (primary):~~ the chip **sweeps** from 32px to `calc(100% - 8px)` wide (height unchanged), carrying the chevron to the right end; the label doesn't move. `transition: width 450ms cubic-bezier(.22,1,.36,1)`. (If it ever stutters, switch to `scaleX` on a pseudo-element plus a translated chevron.)
- **Secondary (plain):** `--button-secondary-bg`, 0.5px `--button-secondary-border`, radius 6, padding `0 14`, label `--button-secondary-text`; optional count in `--text-tertiary`, 6px after the label. Hover: background → `--button-secondary-bg-hover`, 200ms.
- **Secondary-chip:** identical geometry and motion to Primary (same 4px inset rule, hug/fill). Colours: background `--button-secondary-bg`, 1px `--button-secondary-border`, chip `--bg-secondary`, chevron `--text-primary`, label `--button-secondary-text`, count `--text-tertiary` after the label. Figma variant: `Style=Secondary Chip`.
- **Usage:** Nav "Hire Me" = primary sm hug · Hero "**See works** 08" = **secondary** (plain) md + count and "**Book a call**" = primary md hug (copy decided 2026-11-08) · Pricing "Book a call" = primary md **fill** · Modal "View live site" = primary md **fill** (desktop Split and mobile).

### 5.1b Arrow Button (`ArrowButton.astro`)
- 40×40 circle, 1px `--text-primary` border, `overflow: hidden`, two arrow-up-right icons (17px, stroke `--text-primary`) in the same spot. Rest: arrow A centred; arrow B parked at `translate(-18px, 18px)`.
- **Hover (of the button itself):** fill → `--button-primary-bg`; arrow A moves to `translate(18px, -18px)` (exits top-right) while arrow B moves to `translate(0,0)`, both in `--button-primary-text`. 350ms `cubic-bezier(.22,1,.36,1)`.

### 5.2 Nav
- Desktop (≥1024): height 85, padding `24 48`, transparent background, `position: absolute` over the hero, `z-index: 4`. Brand (logo mark 32 + "Emon Arefin" `h5`) · links: Home, Works <count>, About, Pricing, Contact (`label`, `--text-secondary`, hover `--text-primary` 150ms; the count in `--text-tertiary`) · Primary sm "Hire Me".
- Mobile: height 64, padding `14 20`. Brand + 36×36 menu button (radius 6, `--bg-secondary`, two-line icon).
- **Mobile menu (not designed in Figma — build, then confirm with Emon):** a white panel under the nav with the links stacked (`h4`, gap 20, padding 20) and a full-width primary "Hire Me" at the bottom; fades in and moves 8px down over 250ms; the icon morphs to ×. Closes on link tap, ×, or Esc; focus trapped and body scroll locked while open.
- **Sticky (decided 2026-11-08):** the nav stays pinned to the top while scrolling. At the very top of Home it is transparent over the hero; once the page scrolls it gets `--surface-overlay` + 12px backdrop blur (1px `--border-primary` bottom border throughout).
- On the About page the nav appears without the intro animation.

### 5.3 Hero
- Background `--bg-primary`; a huge ellipse "arc" (`--bg-secondary`) whose top edge sits directly under the portrait.
- Desktop: height 680, padding-top 164; portrait 168×168 inside a clipping box; 40px gap; content stack: name pill "I'm Emon Arefin" (white pill, radius 999) → H1 "Product Designer & Photographer" (`display`, centred, 2 lines) → subtitle "I design digital experiences that connect and solve problems." (`body-lg`, `--text-secondary`) → buttons (Secondary "View Projects 08" + Primary "Hire Me", gap 12).
- Mobile: height 548, padding-top 104; portrait 120×120; gap 28.
- **Layers, arc geometry and intro animation:** see §6.1.

### 5.4 Showcase Gallery (Apple-style, image only)
- Two rows of **pure imagery** (no captions or CTAs on the slides). Images = `thumbnail` of projects with `showcase = featured` (top row) and `showcase = more` (bottom row); `object-fit: cover; object-position: top`; square corners; decorative (`alt=""`).
- **Featured row:** slide 940×504 desktop / 330×212 mobile (keep the ratio), gap 14 / 8, centred with neighbours peeking both sides, infinite loop.
- **More row:** card 355×200 desktop / 220×140 mobile, gap 14 / 8, loop, starting offset so the first card is cut off at the left (desktop −160px, mobile −60px).
- Gaps: 14px between rows (8 mobile); pagination 18px below (16 mobile). Section padding in §4.
- **Autoplay:** both rows advance **together**, one item every **5s** (4s hold + ~1s slide), easing as close to `cubic-bezier(.645,.045,.355,1)` as Embla allows. Pause while hovered, while the tab is hidden and during drag; resume 5s after the last interaction.
- **Drag/swipe** either row; the rows stay **in sync** (moving one moves the other to the matching index). If a row has fewer than 5 items, duplicate them so the loop still looks full.
- **Arrows:** 40×40 (32×32 mobile) round buttons, `--surface-overlay` + `backdrop-filter: blur(12px)`, chevron 16px `--text-primary`, vertically centred on the featured row. Desktop: on the peeking slides at `left: calc(50% - 548px)` / `right: calc(50% - 548px)` (= x 172 and 1228 at 1440, 24px outside the featured slide's edges). Mobile: 8px from the screen edges. Previous/next move both rows one step. Hover: scale 1.05, 200ms. Labels "Previous" / "Next".
- **Pagination:** centred pill, height 32 (28 mobile), padding `0 16`, radius 999, `--bg-tertiary`; one 8px dot per featured slide, gap 10 (8 mobile). Active `--text-primary`; inactive `--text-tertiary` at 60%; 200ms colour transition. Click a dot to jump there; `aria-label="Go to slide n"`, `aria-current="true"` on the active one.
- Library: Embla Carousel + Autoplay plugin. Container: `aria-roledescription="carousel"`, `aria-label="Showcase"`.

### 5.5 Section Header
- Desktop: one row — heading (`display`, left) and optional right slot (filters, meta) aligned to the bottom, `justify-content: space-between`. **No subheadings.**
- Mobile: heading, then right-slot content underneath, left-aligned, gap 20.

### 5.6 Filter chips (Work)
- Labels: All, Agency, SaaS, Portfolio, Templates. Height 36, padding `0 16`, radius 6, `label`.
- Active: `--button-primary-bg` / `--button-primary-text`. Inactive: `--bg-secondary` / `--text-primary`.
- Desktop: right side of the section header row. Mobile: under the heading, **wrapping** onto new lines, left-aligned (no horizontal scroll).
- Behaviour: client-side filtering by `data-category`; hidden cards fade out (opacity, 200ms) and leave the layout, visible ones fade in; 200ms colour transition on chips; `aria-pressed` on chips; "All" active by default.

### 5.7 Work Card
- Thumbnail tile: `--bg-secondary`, aspect ratio **676:485**, **padding 32 (top/bottom) × 24 (left/right)** desktop, **16 × 12** mobile; image fills the inner area (`object-fit: cover; object-position: top`).
- Below (gap 16): **Title row** — title (`body`, 500, `--text-primary`) left; tags right, e.g. `Portfolio | AI | Framer` (`caption`, `--text-secondary`, separated by 1×14px `--border-secondary` dividers, gap 10). Mobile: tags go under the title, gap 8.
- **Hover (desktop pointer) and `:focus-visible`, all 350ms ease-out:**
  1. The image grows to fill the whole tile (inset 32/24 → 0) — the subtle zoom.
  2. A 1px inside outline `--border-subtle` appears on the tile.
  3. Overlay `--surface-overlay` + `backdrop-filter: blur(18px)` fades in (opacity 0 → 1).
  4. Centred row "View Project" (20px, 400, `--text-primary`) + Arrow Button (§5.1b), gap 16, **rises 16px** (translateY 16px → 0) while fading in.
  5. Hovering the Arrow Button itself plays its own animation.
- The whole card is one `<button>` (accessible name "View project: {title}") that opens the Project Modal (§5.10). On mobile there is no overlay; a tap opens the modal.

### 5.8 Pricing
- White band (`--bg-primary`). Heading "Simple pricing. No surprises." (left).
- Two plan cards on `--bg-secondary`; 2 columns (gap 16) desktop, stacked mobile; radius 20; padding 40 (24 mobile); internal gap 32 (28 mobile); equal heights on desktop.
  - **Full Website** — design + Framer development, one-time, "starting at".
  - **Monthly Subscription** — ongoing design & development, "/ month", badge "Pause or cancel anytime".
- Card order: badge pill (`--bg-secondary`, `caption`; right of the name on desktop, above it on mobile) · plan name `h4` · description `body` `--text-secondary` · price `display` + unit `body` `--text-secondary`, baseline-aligned · **full-width Primary "Book a call"** (`layout="fill"`, → `#book`) · 1px hairline · "What's included" (`caption`, `--text-secondary`) · features: 20px check icon (circle `--bg-tertiary` + check `--text-primary`) + `body`, gap 14.
- Footnote: "Need something different? **Let's talk about a custom quote →**" (links to `#book`).

### 5.9 Book a Call
- Header row: heading "Let's build something great." left; meta right (30 min · Google Meet / Based in Bangladesh · GMT+6 / Replies within 24 hours — 16px icons, `body-sm`, `--text-secondary`).
- Header meta sits right of the heading on desktop, under it on mobile.
- **Cal.com inline embed** (`calLink` from settings) in a container: full content width × 680 desktop (full width × 620 mobile), radius 20, `--bg-secondary`. Show a calm placeholder (calendar icon + "Loading calendar…") until it loads; **load the embed only when the section nears the viewport** (IntersectionObserver). Light theme, brand colour `#162026`.
- Below: "Prefer email? **{email}**" (`mailto:` link, underlined; hello@emonarefin.com is a placeholder).

### 5.10 Project Modal (light)
- Native **`<dialog>`** with `showModal()`; **one dialog per project**, rendered at build time, images `loading="lazy"`. `aria-labelledby` → the title.
- **Backdrop** (`::backdrop`): `--surface-scrim` + `backdrop-filter: blur(12px)`; clicking it closes.
- **Desktop ≥1024 — Split:** panel `--bg-primary`, radius 16, padding 24, `width: min(1120px, 100vw - 64px)`, `max-height: calc(100dvh - 64px)`, centred, two columns with gap 32 (~597 tall at 1440).
  - Left: main image 664×457 (keep ratio) → row of up to 5 thumbnails (84px tall, gap 8, `object-fit: cover`); the active one has a 1.5px `--text-primary` inside outline; clicking a thumbnail cross-fades the main image (200ms).
  - Right panel (full height; scrolls on its own if it overflows): top bar ("Case study · 01 / 08" `label` `--text-secondary` + 36px round close button, `--bg-secondary`, × icon `--text-primary`) → title `h2` → summary `body-lg` `--text-secondary` → stats as three label/value rows (Price range, Duration, Scope; label `caption` `--text-secondary` left, value `h5` right; gap 16; 1px `--border-primary` top border with 24px above) → flexible spacer → tags (dividers `--border-secondary`) → **full-width** Primary "View live site" (opens `liveUrl` in a new tab, `rel="noopener"`).
- **Mobile/tablet <1024 — bottom sheet:** full width, starts 48px from the top of the viewport, radius 20 on the top corners, `--bg-primary`, scrolls internally. Order: 36×4 grabber (`--border-secondary`) → top bar → main image → thumbnails (48px tall, gap 8) → title → summary → stats (2-column wrap; Scope full width) → tags.
- **Sticky action bar** (`Modal Action Bar` component) at the bottom of the sheet — `position: sticky; bottom: 0` inside the sheet's scroll container, always visible while scrolling:
  - a 32px **fade** (`--bg-primary` from 0% → 100% opacity, top → bottom) that hints content continues underneath;
  - a solid `--bg-primary` body, padding `4px 20px calc(24px + env(safe-area-inset-bottom)) 20px`, holding a **full-width** Primary "View live site".
  - Give the sheet content ~100px bottom padding so the last item can scroll clear of the bar.
- **Open / close:** desktop fades in 300ms with an 8px rise; mobile slides up from `translateY(100%)` to 0 over 300ms; both `cubic-bezier(.22,1,.36,1)`; closing reverses. None under reduced motion.
- **Behaviour:** closes on the close button, Esc or a backdrop click. Focus goes to the close button on open and back to the card that opened it on close. Lock body scroll while open. URL hash `#project-<slug>` on open; loading the page with that hash opens the modal; on close remove the hash with `history.replaceState`.
- Counter "Case study · 01 / 08" = the project's position in the sorted list / total.

### 5.11 Footer
- 1px top border `--border-primary`. Padding-top 96 (64 mobile).
- Left: brand (logo + name) → blurb "Framer designer and developer crafting fast, considered websites for startups, studios and creators." (`body-sm`, `--text-secondary`, max ~400px) → "Based in Bangladesh · GMT+6" (`caption`, `--text-tertiary`) → **"Get an AI summary of Emon"** (`caption`, 500 — as in Figma) → four icon-only 36×36 buttons (radius 6, `--bg-secondary`, hover `--bg-tertiary`) for **ChatGPT, Gemini, Claude, Perplexity**, official SVG logos at 18px. Each opens the assistant in a new tab with the pre-filled prompt "Summarise who Emon Arefin is and what he offers, based on https://emonarefin.com". **Verify each service's current pre-fill URL format** (e.g. a `?q=` parameter) before using it; if a service doesn't support pre-filling, link to its homepage and tell Emon.
- Right: link columns — **Navigate** (Home, Work, About, Pricing, Book a call), **Services** (Website design, Framer development, Monthly subscription, Framer templates), **Connect** (LinkedIn ↗, X / Twitter ↗, Dribbble ↗, Behance ↗, Resume ↗). Heading `caption` 500 (as in Figma); links `label` `--text-secondary`, hover `--text-primary`; Connect links are external (↗, new tab). Spacing: **column gap 112** (mobile: 2-column wrap, gap 40 × 40), **heading → links 20**, **link gap 16**.
- **Dotted logo band:** the full logo (mark + "Emon Arefin" wordmark) rendered as a halftone dot grid across the content width — 1376×272 on an 8px grid (desktop), 350×70 on a 5px grid (mobile), 96px / 56px below the link area. Each dot's radius = 0.46 × grid × √(logo coverage of that cell); cells under 6% coverage get no dot; dot colour `--border-secondary`. Generate it with `scripts/generate-dotted-logo.mjs` (Node + `sharp`: rasterise `logo-full.svg`, measure coverage per cell, write an SVG of circles into `src/assets/brand/`); run once, re-run only when the logo changes. Render with `aria-hidden="true"`.
- Bottom bar: "© 2026 Emon Arefin. All rights reserved." left; Privacy · Terms · Back to top ↑ right (`caption`, `--text-secondary`); padding `20 32 28` (mobile stacked, `20 20 28`).

### 5.12 About page parts
- **About Intro:** two columns desktop, stacked on mobile (photo below the text). Left: eyebrow pill "About me" (`--bg-secondary`) → H1 `display` "Hi, I'm Emon — a product designer and photographer from Bangladesh." → 2 bio paragraphs from settings (`body-lg`, `--text-secondary`) → facts row (5+ Years designing · 100+ Projects shipped · GMT+6 Bangladesh; value `h3`, label `caption`). Right: photo, 4:5 (560×700 desktop; full width mobile).
- **Now (experience):** grey band. Status pill: green Live Dot + "Currently" → statement `h1`: "Product Designer" (`--text-primary`) + " at Rubik" (`--text-tertiary`; on mobile break the line before "at Rubik") → one-line sub (`body-lg`). Timeline from `milestones`: horizontal on desktop (4 columns; hollow 9px dots with a 1.5px `--text-tertiary` ring joined by a 1px `--border-secondary` line), vertical on mobile (line down the left). The last item "Now · Product Designer, Rubik" uses a pulsing **dark** Live Dot. Dots and text start-align with the 32 / 20px page margin.
- **Through My Lens:** header (left) + photo grid: CSS grid, 4 columns, gap 16; `wide` photos span 2 columns, `square` span 1; `grid-auto-flow: dense` so there are no empty holes. Mobile: 2 columns, gap 8, wide = full width.

### 5.13 Live Dot
- 24×24; 10px core + halo that grows 10→24px and fades 45%→0 over 1.4s ease-out, looping. Green (`--status-live`) or dark (`--text-primary`).

---

## 6. Motion

### 6.1 Hero intro (based on the current live site + arc reveal)

**Layer order (bottom → top) — required for the parallax:**
1. Portrait (dark silhouette) — `z-index: 1`
2. Arc background (`--bg-secondary`) — `z-index: 2`
3. Hero content (name pill, H1, subtitle, buttons) — `z-index: 3`
4. Nav — `z-index: 4`

**Arc reveal:** the arc starts as a full-bleed panel covering the whole hero *including behind the nav* (`inset: 0`, no curvature) and animates to its resting state — a wide ellipse whose top edge sits just under the portrait (desktop: 3000×1544 at x −780, y 332; mobile: 1500×900 centred, top at y 224). Duration 1.2s, easing `cubic-bezier(.15,.32,.1,.93)`. Implement as an absolutely positioned element covering the whole hero with an animated `clip-path: ellipse()`:

| | Start (covers everything, looks flat) | End (resting arc) |
|---|---|---|
| Desktop | `ellipse(10000px 3000px at 50% 2980px)` | `ellipse(1500px 772px at 50% 1104px)` |
| Mobile | `ellipse(4000px 1500px at 50% 1480px)` | `ellipse(750px 450px at 50% 674px)` |

**Portrait:** rises +280px → 0 *behind* the arc at the same time, so it only becomes visible in the last ~25% of the motion — it appears to emerge from behind the background. The portrait sits in a clipping box whose bottom edge equals the arc's final top edge.

**Timeline (final — staggered text).** Text must never arrive as one block: it enters element by element, starting once the portrait has begun to emerge.

| Element | From | Delay | Duration | Easing |
|---|---|---|---|---|
| Arc (full-bleed → resting ellipse) | `inset:0`, no curve | 0s | 1.2s | `cubic-bezier(.15,.32,.1,.93)` |
| Nav (logo, links, button) | y −150px, opacity 0 | 0.1s | 1.0s | `cubic-bezier(0,.77,.56,1)` |
| Portrait (clipped, rises behind arc) | y +280px (mobile +200px) | 0.1s | 1.4s | `cubic-bezier(.15,.32,.1,.93)` |
| Name pill "I'm Emon Arefin" | y +20px, opacity 0 | 0.45s | 0.7s | `cubic-bezier(.22,1,.36,1)` |
| H1 | y +20px, opacity 0 | 0.52s | 0.7s | same |
| Subtitle | y +20px, opacity 0 | 0.59s | 0.7s | same |
| Button "View Projects" | y +20px, opacity 0 | 0.66s | 0.7s | same |
| Button "Hire Me" | y +20px, opacity 0 | 0.73s | 0.7s | same |

Stagger step = **70ms**. Whole intro finishes at ~1.5s. Implement with CSS `@keyframes` + `animation-delay` (or the Web Animations API); add `animation-fill-mode: both` so elements stay hidden until their delay. Pure CSS — it starts on first paint with no flash and needs no JS. It plays on the Home page only; under reduced motion everything shows in its end state.

**Figma:** the `Hero` component holds only `Start` / `End`. The prototype uses keyframe frames "Hero Intro · Desktop/Mobile · 0.0s … 1.5s" (one per 0.1s, every layer on its own curve) because Smart Animate can't delay individual layers. They are reference only — build from the table above.

### 6.2 Other motion

**Update 2026-11-08 (Emon):**
- **All timings & curves are editable** in Keystatic → Settings → **Motion** (Ease preset / custom Bézier, or Spring stiffness·damping·mass; Time; Delay). `src/lib/motion.ts` turns them into `--m-*` CSS variables; springs become a CSS `linear()` curve.
- **Nav intro (Home):** logo + name first, then each link +0.05s, then "Hire Me" +0.1s after the last link (each drops in from above).
- **Scroll reveal (whole site):** headings, chips, card thumbnail → title → tags, pricing parts, booking parts, About parts, footer items rise in once, staggered 0.05s by screen position (`[data-reveal]`, `src/scripts/reveal.ts`). Showcase rows reveal as a group.
- **Text-link roll:** nav links and every footer link text (incl. Services, Privacy, Terms): letters slide up while a copy rises from below, letter by letter (ref. jet.framer.website). `ui/RollText.astro`.
- **Filter chips:** inactive hover → `--bg-tertiary`.
- **Smooth scroll:** Lenis on every page (stops while the modal/menu is open; off under reduced motion).
- **Showcase featured row:** slide width fixed (940 / 330); height follows the thumbnail's own shape (no crop). Keep all thumbnails the same shape.
| Interaction | Spec |
|---|---|
| Gallery advance | every 5s (4s hold + ~1s slide), `cubic-bezier(.645,.045,.355,1)`; drag/swipe; pause on hover/hidden tab/drag, resume 5s after |
| Gallery arrow hover | scale 1.05, 200ms |
| Gallery dots | colour 200ms |
| Filter chips / cards | chip colour 200ms; cards fade 200ms |
| Work card hover | 350ms ease-out (image grow + outline + overlay fade + label rises 16px) |
| Primary / secondary-chip sweep | 450ms `cubic-bezier(.22,1,.36,1)` |
| Secondary (plain) hover | background 200ms |
| Nav link hover | colour 150ms |
| Arrow Button hover | 350ms `cubic-bezier(.22,1,.36,1)` (fill + arrows swap diagonally) |
| Mobile menu | fade + 8px down, 250ms |
| Modal open/close | desktop 300ms fade + 8px rise; mobile sheet slide-up 300ms; `cubic-bezier(.22,1,.36,1)` |
| Modal thumbnail | main image cross-fade 200ms |
| Live dot pulse | 1.4s ease-out, infinite |
| Reduced motion | disable all of the above; show final states |

---

## 7. Iconography
- Stroke icons, 16px (UI) / 20px (feature checks) / 32–40px (placeholders), 1.3–1.6 stroke, round caps. Lucide icon set matches (chevron-right, arrow-up-right, x, clock, map-pin, message-square, calendar, menu).
- Brand logos (AI assistants, socials) must be official SVGs — never redrawn.

---

## 8. Pages

**Home (`/`)** — Nav · Hero · Showcase Gallery · Work (header + filters + grid) · Pricing · Book a Call · Footer. Project Modal opens over Work.
**About (`/about`)** — Nav · About Intro · Now · Through My Lens · Footer.
Links: "Home" → `/` · "Works" → `/#work` · "Pricing" → `/#pricing` · "About" → `/about` · "Contact", every "Hire Me" and every "Book a call" → `/#book` · Hero "View Projects" → `#work`.

---

## 9. Accessibility checklist
- Colour contrast ≥ 4.5:1 for body text (secondary `#6B767D` on white passes; tertiary is for non-essential meta only).
- Focus ring: 2px `--text-primary` outline, 2px offset, on every interactive element.
- Gallery: `aria-roledescription="carousel"`, autoplay pausable, not keyboard-trapping; images decorative (`alt=""`) unless they convey content.
- Modal: native `<dialog>` via `showModal()`, labelled by the project title, `Esc` closes, focus returns to the opening card.
- Landmarks (`header`, `nav`, `main`, `footer`), one `h1` per page, keyboard-operable gallery, filters, modal and menu.
- Hit areas ≥ 36×36 (mobile ≥ 40 where possible).

### Performance & SEO
- Every image through `astro:assets` with explicit `widths`/`sizes`; the portrait and first showcase slide `loading="eager"` + `fetchpriority="high"`, everything else lazy; reserve space with aspect ratios.
- Targets: Lighthouse Performance ≥ 95, Accessibility 100, CLS < 0.05.
- Per-page `<title>` + description (from settings), Open Graph/Twitter tags with a 1200×630 image, canonical `https://emonarefin.com`, `@astrojs/sitemap`, `robots.txt`, favicon from the logo mark.

---

## 10. Content model (CMS)

Managed with **Astro content collections** + **Keystatic** (visual admin at `/keystatic`, local storage while developing, GitHub storage once deployed). `keystatic.config.ts` and `src/content.config.ts` must stay **exactly in sync**. Image fields save into `src/assets/…` so the schema can use `image()` and Astro optimises them.

### `projects` (collection) — powers Work grid, Showcase, and the modal
| Field | Keystatic field | Notes |
|---|---|---|
| `title` | slug field (title + auto slug) | "Portfolio for American Banker"; slug used in `#project-<slug>` |
| `category` | select: Agency · SaaS · Portfolio · Templates | drives filters |
| `tags` | array of text (max 3) | e.g. Portfolio, AI, Framer |
| `summary` | multiline text | 2–3 sentences, modal body |
| `thumbnail` | **media**: Image or Video switch (see below) | Work card + Showcase (≈ 4:3, ≥1400px wide, cropped from the top) |
| `gallery` | array of **media** (1–5) | modal main media + thumbnails; first shown first |
| `liveUrl` | url | "View live site", new tab |
| `priceRange` | text | "$600 – $800" |
| `duration` | text | "7 – 10 days" |
| `scope` | text | "Design + Framer build" |
| `year` | integer | |
| `showcase` | select: none · featured · more | which Showcase row |
| `order` | integer | manual sort, lowest first |
| `draft` | checkbox | hidden everywhere when ticked |

### `photos` (collection) — Through My Lens
`image` (**media**: Image or Video), `alt` (required), `size` (wide · square), `order`.

**Media fields** (decided 2026-11-08): every project/photo media slot is an Image / Video switch. Images (PNG, JPG, WebP, AVIF) save to `src/assets/<projects|photos>/<slug>/` and are optimised by Astro. Videos (MP4/WebM recommended; MOV plays in Safari only) save to `public/media/<projects|photos>/<slug>/` and play muted, looped and inline (no autoplay under reduced motion), with an optional poster image.

### `settings` (singleton)
`email`, `calLink` (Cal.com `username/event`), `socials` (linkedin, x, dribbble, behance, resumeUrl), `stats` (years, projects), `currentRole` (title "Product Designer", company "Rubik", summary — the one-line sub under the About "Now" statement), `milestones[]` (`year`, `title`), `aboutBio` (2 paragraphs), `siteDescription` (SEO).

### `pricing` (singleton)
`plans[]` (exactly 2): `name`, `description`, `price`, `unit`, `badge?`, `features[]`, `ctaLabel`. Seed with the Figma copy.

### Derived values & seeding
- **Works count** (nav "Works 08", hero "View Projects 08") = number of non-draft projects, zero-padded to 2 digits.
- **Modal counter** = position in the sorted list / total.
- Seed **3 sample projects** with the Figma placeholder copy so every section renders before real content exists. Until real assets arrive, use labelled `--bg-tertiary` placeholders at the right aspect ratio (never stock images).

---

## 11. Project structure (Astro)
```
src/
  assets/
    brand/        logo-mark.svg, logo-full.svg, portrait.png, about-photo.jpg, AI icons, dotted logo SVGs
    projects/     <slug>/thumbnail.jpg, <slug>/gallery-1.jpg …   (Keystatic)
    photos/       Through My Lens images                       (Keystatic)
  components/
    ui/           Button.astro, ArrowButton.astro, LiveDot.astro, Icon.astro, SectionHeader.astro
    layout/       Nav.astro, MobileMenu.astro, Footer.astro, DottedLogo.astro
    home/         Hero.astro, ShowcaseGallery.astro, WorkSection.astro, WorkCard.astro,
                  ProjectModal.astro, Pricing.astro, BookCall.astro
    about/        AboutIntro.astro, NowTimeline.astro, PhotoGrid.astro
  content/        projects/, photos/, settings, pricing   (written by Keystatic)
  content.config.ts   (must match keystatic.config.ts)
  layouts/Base.astro
  pages/index.astro, pages/about.astro
  styles/tokens.css, typography.css, global.css
scripts/generate-dotted-logo.mjs
keystatic.config.ts
CLAUDE.md, DESIGN_SYSTEM.md (this file), BUILD_PROMPT.md
```

---

## 12. Figma reference
- File: **My Portfolio** — https://www.figma.com/design/FFs05OacP9URxrCuYpT1fT/My-Portfolio?node-id=168-139 (node 168-139 = **Home · Desktop 1440**) — page **"Portfolio Website"**. Read it through the Figma MCP server (`https://mcp.figma.com/mcp`).
- Frames: `Home · Desktop 1440`, `Home · Mobile 390`, `About · Desktop 1440`, `About · Mobile 390`, `Home · … — Project Modal` (both sizes), and the prototype-only keyframes `Hero Intro · Desktop/Mobile · 0.0s … 1.5s`. Prototype flows: "Desktop — Play from intro", "Mobile — Play from intro", "About — Desktop", "About — Mobile".
- Components (right column): Nav, Hero (Start/End), Work Card, Footer, Showcase Gallery (Step 1–6), Live Dot, Button (Primary · Secondary · Secondary Chip, Hug/Fill), Arrow Button, Project Modal (Desktop = Split, Mobile), Modal Action Bar.
- Variables: **Portfolio / Color** (Light only) and **Portfolio / Type** (Desktop, Mobile). Each variable has its CSS name set as code syntax.
- Ignore "Emon Arefin — Portfolio · Desktop 1449" (previous design) and the "Hero Intro · … · 0.0s–1.5s" keyframe frames (prototype only; build from §6.1).

---

## 13. Open decisions / placeholders
- [x] Pricing CTA style — decided: Option A (Chip Sweep) as the site-wide Primary button.
- [ ] Real prices.
- [x] Hero intro: Version A (arc shrinks from full-bleed) with staggered text.
- [x] Modal desktop layout: Split.
- [x] Footer band: dotted logo.
- [x] Hero "View Projects" button — decided: plain Secondary with a 0.5px border (as in Figma).
- [ ] Real project names, summaries, tags, stats, live URLs.
- [ ] Contact email (hello@emonarefin.com is a placeholder).
- [ ] Bio copy, portrait photo, milestone years.
- [ ] Official SVGs for ChatGPT, Gemini, Claude, Perplexity, and social icons; logo SVG for the dotted band.
- [x] Through My Lens empty grid cell — solved with `grid-auto-flow: dense`.
- [ ] Mobile menu open state (not in Figma — build per §5.2, then confirm).
- [x] Sticky nav — decided: yes, always sticky with a frosted background once scrolled.
- [x] Cal.com event link — `helloemonarefin/30min`.

---

## 14. Build plan

Follow the phases in **`BUILD_PROMPT.md` §12**, stopping for Emon's OK after each and committing to Git:

0. Kick-off (read both files, check the Figma MCP, list questions)
1. Scaffold (Astro, TS strict, Git)
2. Foundations (tokens, typography, Inter, Base layout, `/styleguide` page with all buttons and their hovers)
3. CMS (Keystatic + content collections, seeds)
4. Home, static
5. About, static
6. Interactivity (filters, gallery, modal, mobile menu, Cal.com)
7. Motion (hero timeline, hovers, transitions, reduced motion)
8. QA (390 / 768 / 1024 / 1440 vs Figma, keyboard, Lighthouse)
9. Deploy (GitHub → Netlify/Vercel + adapter → Keystatic GitHub storage → emonarefin.com)
