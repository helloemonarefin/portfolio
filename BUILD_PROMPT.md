# Build brief — Emon Arefin portfolio (Astro)

> Read this whole file **and** `DESIGN_SYSTEM.md` before doing anything.
> `DESIGN_SYSTEM.md` holds the exact tokens and measurements. This file explains **how everything should behave and how we'll work**.
> If the two ever disagree, or something isn't covered by either, **stop and ask me** rather than guessing.

---

## 0. Who I am and how to work with me

- I'm Emon, a product designer and Framer developer. I'm a **beginner at hand-coding**: I learned some HTML/CSS/JS/React in 2023 and have forgotten most of it. I'm on a **MacBook**. Node.js, npm and Git are installed. I use VS Code with the Claude Code extension.
- **Explain before you act.** Before each command or install, tell me in one or two plain sentences what it does and why. No jargon without a short explanation.
- **Work in phases (§12).** Finish one phase, run the site, tell me exactly what to look at in the browser, and **wait for my OK** before starting the next phase.
- **Ask, don't invent.** If a design detail is unclear, read it from Figma (§1) or ask me. Never make up colours, sizes, copy or behaviours.
- **Don't add libraries** beyond the ones listed in §2 without asking me first.
- **Commit to Git after each phase** with a clear message, so we can always roll back. Tell me when you do.
- Create and keep a short `CLAUDE.md` in the project root that says: read `DESIGN_SYSTEM.md` and `BUILD_PROMPT.md` first, the phase we're on, and any decisions we make along the way.
- Your knowledge of library APIs may be out of date. **Check the official docs** (docs.astro.build, keystatic.com/docs, embla-carousel.com, cal.com docs) before writing setup or config code.

---

## 1. Sources of truth

1. **`DESIGN_SYSTEM.md`** (project root): colour tokens, type scale, spacing, radius, component specs, motion timings, content model. All numbers in it are exact.
2. **Figma file "My Portfolio"**, page **"Portfolio Website"**:
   `https://www.figma.com/design/FFs05OacP9URxrCuYpT1fT/My-Portfolio?node-id=168-139`
   (node 168-139 is the **Home · Desktop 1440** frame).
   Other frames on the same page, by name: `Home · Mobile 390`, `About · Desktop 1440`, `About · Mobile 390`, `Home · Desktop 1440 — Project Modal`, `Home · Mobile 390 — Project Modal`, and the component sets in the right-hand column (`Nav`, `Hero`, `Button`, `Arrow Button`, `Work Card`, `Showcase Gallery`, `Project Modal`, `Modal Action Bar`, `Footer`, `Live Dot`). Ignore the frames named `Emon Arefin — Portfolio · Desktop 1449` (old design) and `Hero Intro · … · 0.0s–1.5s` (prototype keyframes only; the real timeline is in §6 below).
   - Figma variables: **Portfolio / Color** (one Light mode) and **Portfolio / Type** (Desktop and Mobile modes). Each variable's code syntax is its CSS variable name, e.g. `var(--text-primary)`.
3. **Figma MCP:** check whether a Figma MCP server is connected (`/mcp`). If it isn't, walk me through adding it: in the Claude panel type `/mcp` → add an HTTP server with the URL `https://mcp.figma.com/mcp` → authenticate in the browser. If you need a specific frame's link, ask me and I'll copy it from Figma (right-click → Copy link to selection).

---

## 2. Tech stack (decided)

| Need | Use |
|---|---|
| Framework | **Astro**, current stable version, TypeScript **strict**. Static output; on-demand rendering only where Keystatic needs it. |
| Styling | **Plain CSS**, no Tailwind. Global `tokens.css` + `typography.css` + `global.css`; component styles in each `.astro` file's `<style>` block. |
| Font | **Inter**, weights 400 and 500 only, self-hosted (Fontsource package or Astro's built-in fonts API, whichever the current docs recommend). |
| CMS | **Astro content collections** + **Keystatic** (admin UI at `/keystatic`). Local storage while developing; GitHub storage once deployed. Keystatic needs `@astrojs/react` and `@astrojs/markdoc` (React is **only** for the Keystatic admin; no React on the public site). |
| Images | Astro's `<Image>` / `<Picture>` from `astro:assets`; images live in `src/assets/…` so Astro optimises them (AVIF/WebP, responsive `srcset`). |
| Carousel | **Embla Carousel** (vanilla, `embla-carousel` + `embla-carousel-autoplay`). |
| Booking | **Cal.com inline embed** (official embed snippet). |
| Hosting (Phase 9) | **Netlify** (default) or Vercel, plus its Astro adapter. |
| Extras | `@astrojs/sitemap`. Nothing else without asking. |

**JavaScript budget:** the public pages should ship almost no JS. Only these need client scripts: Showcase Gallery, Work filters, Project Modal, mobile menu, Cal.com embed loader. **The hero intro is pure CSS.** Use small vanilla `<script>` tags in components, not a framework.

---

## 3. Project structure

```
src/
  assets/
    brand/        logo-mark.svg, logo-full.svg, portrait.png, about-photo.jpg, ai icons
    projects/     <slug>/thumbnail.jpg, <slug>/gallery-1.jpg … (managed by Keystatic)
    photos/       Through My Lens images (managed by Keystatic)
  components/
    ui/           Button.astro, ArrowButton.astro, LiveDot.astro, Icon.astro, SectionHeader.astro
    layout/       Nav.astro, MobileMenu.astro, Footer.astro, DottedLogo.astro
    home/         Hero.astro, ShowcaseGallery.astro, WorkSection.astro, WorkCard.astro,
                  ProjectModal.astro, Pricing.astro, BookCall.astro
    about/        AboutIntro.astro, NowTimeline.astro, PhotoGrid.astro
  content/        projects/, photos/, settings, pricing (written by Keystatic)
  content.config.ts
  layouts/Base.astro
  pages/index.astro, pages/about.astro
  styles/tokens.css, typography.css, global.css
scripts/generate-dotted-logo.mjs
keystatic.config.ts
CLAUDE.md, DESIGN_SYSTEM.md, BUILD_PROMPT.md
```

Until I supply real assets (§13), use clearly labelled grey placeholders (`--bg-tertiary`) at the correct aspect ratio, never random stock images.

---

## 4. CMS (Keystatic + content collections)

The goal is a **Framer-CMS-like experience**: I open `/keystatic`, fill in a form, upload images, save, and the site updates. Keep `keystatic.config.ts` and `src/content.config.ts` **exactly in sync** (same fields, same names). If you change one, change the other in the same step and tell me.

### 4.1 `projects` collection (Work grid, Showcase Gallery, Project Modal)

| Field | Keystatic field | Notes |
|---|---|---|
| `title` | slug field (title + auto slug) | e.g. "Portfolio for American Banker"; the slug is used in the URL hash `#project-<slug>` |
| `category` | select: Agency, SaaS, Portfolio, Templates | drives the filter chips |
| `tags` | array of text (max 3) | shown as `Portfolio \| AI \| Framer` |
| `summary` | multiline text | 2–3 sentences, shown in the modal |
| `thumbnail` | media (Image or Video) | Work card image; ~4:3, at least 1400px wide; cropped from the **top** |
| `gallery` | array of media (0–9) | modal gallery after the thumbnail (thumbnail is always first; max 10 total) |
| `liveSite` | object: `show` (checkbox, default on) · `label` (default "View live site") · `url` | modal live-site button; new tab |
| `priceRange` | text | e.g. "$600 – $800" |
| `duration` | text | e.g. "7 – 10 days" |
| `scope` | text | e.g. "Design + Framer build" |
| `year` | integer | |
| `showcase` | select: none, featured, more | which Showcase row the thumbnail appears in |
| `order` | integer | manual sort, lowest first |
| `draft` | checkbox | hidden everywhere when ticked |

Image fields must save into `src/assets/projects/<slug>/` so the Astro schema can use `image()` and get optimised images.

### 4.2 `photos` collection (About → Through My Lens)
`image`, `alt` (required), `size` (select: wide | square), `order`.

### 4.3 `settings` singleton
`email`, `calLink` (Cal.com `username/event`), `socials` (linkedin, x, dribbble, behance, resumeUrl), `stats` (years, projects), `currentRole` (title "Product Designer", company "Rubik", summary — the one-line sub under the About "Now" statement), `milestones[]` (year, title), `aboutBio` (2 paragraphs), `siteDescription` (for SEO).

### 4.4 `pricing` singleton
`plans[]` (exactly 2): `name`, `description`, `price`, `unit`, `badge` (optional), `features[]`, `ctaLabel`. Seed it with the copy from the Figma Pricing section.

### 4.5 Derived values
- **Works count** in the nav ("Works 08") and the hero button ("View Projects 08") = number of non-draft projects, zero-padded to 2 digits.
- **Modal counter** "Case study · 01 / 08" = the project's position in the sorted list / total.
- Seed **3 sample projects** using the placeholder copy from Figma so every section renders before I add real content.

---

## 5. Global rules (every component)

- **Never hard-code a colour or font size.** Use the CSS variables from `DESIGN_SYSTEM.md` §2–3. Typography uses the role tokens (`--font-size-display` etc.), which change at 1024px.
- **Breakpoints:** mobile-first. Base = mobile (designed at 390). `min-width: 768px` = tablet tweaks (2-column grids where they fit, still mobile type). `min-width: 1024px` = desktop (designed at 1440). Content max width 1376 + 32px side padding; on screens wider than 1440 the content stays centred.
- **Hover effects only on real pointers:** wrap hover styles in `@media (hover: hover) and (pointer: fine)`. Give every hover state a matching `:focus-visible` state.
- **Reduced motion:** under `@media (prefers-reduced-motion: reduce)`, remove every transition and animation and show final states instantly (including the hero intro and gallery autoplay).
- **Focus ring:** 2px solid `--text-primary`, 2px offset, on every interactive element.
- **Section anchors:** `#work`, `#pricing`, `#book`. Nav "Works" → `/#work`, "Pricing" → `/#pricing`, "Contact" and every "Hire Me" / "Book a call" → `/#book`, "About" → `/about`, "Home" → `/`. Use `scroll-behavior: smooth` (disabled under reduced motion) with `scroll-margin-top` equal to the nav height.
- **Section backgrounds** (DESIGN_SYSTEM.md §4, updated 2026-11-08): Hero white (grey arc) → Showcase white → Work white → Pricing white with grey cards → Book white → Footer white with a top border.
- **Section header:** desktop = one row with the heading (`display`) on the left and an optional right slot (filters or meta) aligned to the bottom. Mobile = heading, then the right-slot content underneath, left-aligned, gap 20. **There are no subheadings.**

---

## 6. Component behaviour — in detail

### 6.1 Button (`ui/Button.astro`) — "Chip Sweep"

Props: `variant` (`primary` | `secondary` | `secondary-chip`), `size` (`md` 40px | `sm` 36px), `layout` (`hug` | `fill`), `label`, `count?` (e.g. "08"), `href?` (renders `<a>`, otherwise `<button>`), `external?`.

**Primary structure:**
```html
<a class="btn btn--primary btn--md btn--hug" href="#book">
  <span class="btn__chip" aria-hidden="true"><svg><!-- chevron-right 16 --></svg></span>
  <span class="btn__label">Hire Me</span>
</a>
```
- Button: `position: relative; display: inline-flex; align-items: center; height: 40px` (36 for sm); radius 6; background `--button-primary-bg`; label `label` token, weight 500, colour `--button-primary-text`, `position: relative; z-index: 1`.
- **Chip:** `position: absolute; top: 4px; bottom: 4px; left: 4px; width: 32px` (28 for sm); radius 3; background `--button-primary-chip`; flex, `justify-content: flex-end`, chevron centred vertically with `padding-inline: 8px` (6 for sm), so at rest the chevron sits in the middle of the square chip.
- **Uniform 4px rule:** the chip always keeps exactly 4px to every edge it touches, at rest and on hover.
- Padding: `hug` → left 44 (40 sm), right 32 (30 sm), so the swept chevron never overlaps the label. `fill` → `width: 100%`, left and right 44, label centred.
- **Hover/focus:** chip `width: calc(100% - 8px)`; the chevron rides to the right end. Label doesn't move. `transition: width 450ms cubic-bezier(.22,1,.36,1)`. (Animating `width` on this one small element is fine. If it ever stutters, switch to `transform: scaleX` on a pseudo-element plus a translated chevron.)
- **Secondary (plain):** background `--button-secondary-bg`, 0.5px `--button-secondary-border`, padding `0 14`, label `--button-secondary-text`, optional count in `--text-tertiary` with 6px gap. Hover: background `--button-secondary-bg-hover`, 200ms.
- **Secondary-chip:** identical geometry and motion to Primary; colours: background `--button-secondary-bg`, 1px `--button-secondary-border`, chip `--bg-secondary`, chevron `--text-primary`, label `--button-secondary-text`, count `--text-tertiary` after the label.
- **Decided (2026-11-08):** the hero "View Projects 08" button uses plain Secondary. Its border is 0.5px (as in Figma).
- Usage: Nav "Hire Me" = primary sm hug. Hero = secondary md "View Projects" + count, primary md "Hire Me". Pricing CTAs = primary md **fill** "Book a call". Modal = primary md "View live site" (fill on desktop Split and mobile).

### 6.2 Arrow Button (`ui/ArrowButton.astro`)
- 40×40 circle, 1px `--text-primary` border, `overflow: hidden`, two arrow-up-right icons (17px) stacked in the same spot.
- Rest: arrow A centred; arrow B parked at `translate(-18px, 18px)` (bottom-left, hidden).
- Hover (of the button itself): background → `--button-primary-bg`; arrow A moves to `translate(18px, -18px)` (exits top-right); arrow B moves to `translate(0,0)`; both strokes → `--button-primary-text`. 350ms `cubic-bezier(.22,1,.36,1)`.

### 6.3 Nav (`layout/Nav.astro`)
- Desktop (≥1024): height 85, padding `24 48`, transparent background, `position: absolute` over the hero, `z-index: 4`. Left: brand (logo mark 32 + "Emon Arefin" in `h5`). Centre: links (`label`, `--text-secondary`; hover `--text-primary` 150ms), "Works" followed by the count in `--text-tertiary`. Right: primary sm "Hire Me".
- Mobile: height 64, padding `14 20`; brand + 36×36 menu button (radius 6, `--bg-secondary`, two-line icon).
- **Mobile menu (not designed in Figma; build this and show me):** tapping the menu button opens a white panel under the nav with the links stacked (`h4`, gap 20, padding 20) and a full-width primary "Hire Me" at the bottom. It fades in and moves 8px down over 250ms; the icon morphs to an ×. It closes on link tap, ×, or Esc; focus is trapped while open and body scroll is locked.
- **Sticky (decided 2026-11-08):** pinned to the top while scrolling; `--surface-overlay` + 12px backdrop blur once the page has scrolled.

### 6.4 Hero (`home/Hero.astro`) — layers and intro animation

**Layout:** desktop height 680, padding-top 164, gap 40 between the portrait box and the content; mobile height 548, padding-top 104, gap 28. Copy: pill "I'm Emon Arefin" (white pill, radius 999), H1 "Product Designer & Photographer" (`display`, centred, 2 lines), subtitle "I design digital experiences that connect and solve problems." (`body-lg`, `--text-secondary`), then the two buttons, gap 12.

**Layer order — this is essential for the effect (bottom → top):**
1. **Portrait** (dark silhouette PNG), `z-index: 1`, inside a **clipping box** (`overflow: hidden`) of 168×168 (120×120 mobile). The box's bottom edge sits exactly on the arc's final top edge (desktop y = 332, mobile y = 224).
2. **Arc** (`--bg-secondary`), `z-index: 2`, absolutely positioned.
3. **Hero content** (pill, H1, subtitle, buttons), `z-index: 3`.
4. **Nav**, `z-index: 4`.

**Arc geometry.** Implement as an absolutely positioned full-hero element with an animated `clip-path: ellipse()`:
| | Start (covers everything, looks flat) | End (resting arc) |
|---|---|---|
| Desktop | `ellipse(10000px 3000px at 50% 2980px)` | `ellipse(1500px 772px at 50% 1104px)` |
| Mobile | `ellipse(4000px 1500px at 50% 1480px)` | `ellipse(750px 450px at 50% 674px)` |

(End desktop = a 3000×1544 ellipse whose top touches y = 332; end mobile = 1500×900 with its top at y = 224. The arc element must cover the whole hero **including behind the nav**.)

**Intro timeline — pure CSS `@keyframes` with `animation-delay` and `animation-fill-mode: both`:**

| Element | From | Delay | Duration | Easing |
|---|---|---|---|---|
| Arc (clip-path start → end) | full-bleed | 0s | 1.2s | `cubic-bezier(.15,.32,.1,.93)` |
| Nav (whole bar) | `translateY(-150px)`, opacity 0 | 0.1s | 1.0s | `cubic-bezier(0,.77,.56,1)` |
| Portrait (inside clip box) | `translateY(280px)` (mobile 200px) | 0.1s | 1.4s | `cubic-bezier(.15,.32,.1,.93)` |
| Name pill | `translateY(20px)`, opacity 0 | 0.45s | 0.7s | `cubic-bezier(.22,1,.36,1)` |
| H1 | `translateY(20px)`, opacity 0 | 0.52s | 0.7s | same |
| Subtitle | `translateY(20px)`, opacity 0 | 0.59s | 0.7s | same |
| "View Projects" button | `translateY(20px)`, opacity 0 | 0.66s | 0.7s | same |
| "Hire Me" button | `translateY(20px)`, opacity 0 | 0.73s | 0.7s | same |

- The portrait rises **behind** the arc, so it only appears in the last part of its motion: it seems to emerge from behind the background.
- Text must **never** arrive as one block; the 70ms stagger is the point. Everything finishes at ~1.5s.
- Because it is CSS-only it starts on first paint with no flash. Reduced motion: show end states immediately.
- The intro plays only on the Home page. It doesn't replay on About; nav on About appears without animation.

### 6.5 Showcase Gallery (`home/ShowcaseGallery.astro`)
- Two rows of **pure imagery**: no captions or buttons on the slides. Images come from projects with `showcase = featured` (top row) and `showcase = more` (bottom row), using `thumbnail`, `object-fit: cover; object-position: top`, square corners.
- **Featured row:** slide 940×504 desktop / 330×212 mobile (keep the ratio between sizes), gap 14 / 8, centred, with neighbours peeking on both sides, infinite loop.
- **More row:** card 355×200 / 220×140, gap 14 / 8, loop, starting offset so the first card is partly cut off at the left (desktop −160px, mobile −60px).
- Spacing: section padding 12 top / 128 bottom (mobile 8 / 72); 14px between rows (8 mobile); pagination 18px below (16 mobile).
- **Autoplay:** both rows advance **together**, one item every **5s** (4s hold + ~1s slide), easing as close as Embla allows to `cubic-bezier(.645,.045,.355,1)`. Pause while hovered, while the tab is hidden, and while the user drags; resume 5s after the last interaction.
- **Drag/swipe** either row left or right; keep the two rows in sync (moving one moves the other to the matching index). If a row has fewer than 5 items, duplicate them so the loop still looks full.
- **Arrows:** round buttons 40×40 (32×32 mobile), `--surface-overlay` + `backdrop-filter: blur(12px)`, chevron 16px `--text-primary`, vertically centred on the featured row. Desktop: sitting on the peeking slides, `left: calc(50% - 548px)` and `right: calc(50% - 548px)` (24px outside the featured slide's edges). Mobile: 8px from the screen edges. Previous/next move both rows by one. Hover: scale 1.05, 200ms.
- **Pagination:** centred pill, height 32 (28 mobile), padding `0 16`, radius 999, `--bg-tertiary`; one 8px dot per featured slide, gap 10 (8 mobile). Active dot `--text-primary`, inactive `--text-tertiary` at 60%, colour transition 200ms. Click a dot to jump there.
- A11y: `aria-roledescription="carousel"`, `aria-label="Showcase"`, arrows labelled "Previous" / "Next", dots `aria-label="Go to slide n"` with `aria-current="true"` on the active one, slides with empty `alt` (decorative).

### 6.6 Work section (`home/WorkSection.astro`, `home/WorkCard.astro`)
- Header row: "Real work. Real impact." left; filter chips right (desktop). Mobile: chips under the heading, **wrapping** onto new lines, left-aligned.
- **Filter chips:** All, Agency, SaaS, Portfolio, Templates; height 36, padding `0 16`, radius 6, `label`. Active = `--button-primary-bg` / `--button-primary-text`; inactive = `--bg-secondary` / `--text-primary`; 200ms colour transition. Clicking filters the grid client-side by `data-category`. Hidden cards fade out (opacity, 200ms) and are removed from the layout; visible ones fade in. Use `aria-pressed` on the chips. "All" is active by default.
- **Grid:** 2 columns desktop, gap 24 (column) × 40 (row); 1 column mobile, gap 32.
- **Card anatomy:**
  - Tile: `--bg-secondary`, padding **32 (top/bottom) × 24 (left/right)** desktop, **16 × 12** mobile, aspect ratio 676:485; the image fills the inner area (`object-fit: cover; object-position: top`).
  - Title row, 16px below the tile: title (`body`, 500, `--text-primary`) left; tags right (`caption`, `--text-secondary`, separated by 1px × 14px `--border-secondary` dividers, gap 10). Mobile: tags go under the title, gap 8.
- **Hover (desktop pointer, also on `:focus-visible`), all 350ms ease-out:**
  1. The image grows to fill the whole tile (inset animates 32/24 → 0); this is the subtle zoom.
  2. A 1px inside outline `--border-subtle` appears on the tile.
  3. Overlay over the tile: `--surface-overlay` + `backdrop-filter: blur(18px)`, opacity 0 → 1.
  4. Centred row "View Project" (20px, weight 400, `--text-primary`) + Arrow Button, gap 16. It **rises 16px** (translateY 16px → 0) while fading in.
  5. Hovering the Arrow Button itself plays its own animation (§6.2).
- The whole card is one `<button>` (accessible name "View project: {title}") that opens the Project Modal. On mobile there is no overlay; a tap opens the modal.

### 6.7 Project Modal (`home/ProjectModal.astro`)
- Use the native **`<dialog>`** element with `showModal()`: it gives Esc-to-close and makes the page behind inert. Render **one dialog per project** at build time, with images `loading="lazy"`.
- **Backdrop** (`::backdrop`): `--surface-scrim` + `backdrop-filter: blur(12px)`. Clicking it closes the modal.
- **Desktop ≥1024 — Split** (Figma updated 2026-11-10): panel `--bg-primary`, **radius 0**, padding 24, `width: min(max(900px, 80vw), 1600px, 100vw - 64px)`, `max-height: calc(100dvh - 64px)`, centred; columns `minmax(0,1fr) clamp(376px, 30%, 460px)`, gap 32.
  - Gallery = the project **thumbnail first**, then the CMS `gallery` items (max 10 in total). The main image cross-fades (300ms) to the next item **every 3s in an endless loop** (stops under reduced motion / when closed; restarts its 3s wait after any click). Thumbnail strip shows 5 at a time; **thumbnails have the same aspect ratio as the main image** (664/457, `--gallery-ratio`), gap 8, `object-fit: cover`, active = 1.5px `--text-primary` inside outline. With more than 5 the strip is **draggable** (Embla, endless loop) and the **selected thumbnail always moves to the left end** of the strip; desktop gallery width is capped so main image + strip always fit the screen height; round prev/next **arrows** (32/36px, `--surface-overlay` + 12px blur) sit over the strip ends and step the main image. Clicking a thumbnail shows it.
  - Right panel (scrolls on its own if it overflows): top bar ("Case study · 01 / 08" `caption` `--text-secondary` + 36px round close button) → body, gap 20: title (`h2` style, desktop 28/38) → summary `body-lg` `--text-secondary` → **tag chips** (`caption` `--text-secondary` on `--bg-secondary`, padding 4/8, gap 10, square) → stats (1px `--border-primary` top border, 20px above; rows gap 12; label `caption` left, value 14px medium, line-height 26, right) → flexible spacer → **full-width** Primary live-site button (`liveSite`: show / label / url from Keystatic; hidden if off or no link; new tab).
- **Mobile/tablet <1024 — bottom sheet:** full width, starts 48px from the top, **radius 0** (Figma), `--bg-primary`, scrolls internally. Order: grabber → top bar → main image → thumbnail strip → title → summary → tag chips → stats (2-column wrap, values 14/20 medium; Scope full width).
  - **Sticky action bar** at the bottom of the sheet (`position: sticky; bottom: 0`), always visible while scrolling:
    - a 32px **fade** (`--bg-primary` from 0% to 100% opacity, top → bottom), which hints that content continues underneath;
    - a solid `--bg-primary` body with padding `4px 20px calc(24px + env(safe-area-inset-bottom)) 20px` holding the **full-width** primary live-site button.
    - Give the sheet content enough bottom padding (~100px) that the last item can scroll clear of the bar.
- **Open/close animation:** desktop fades in 300ms with an 8px rise (`cubic-bezier(.22,1,.36,1)`); mobile slides up from `translateY(100%)` to 0 over 300ms with the same easing; closing reverses. Reduced motion: no animation.
- **Behaviour:**
  - Closes on the close button, Esc, or a backdrop click.
  - Focus moves to the close button on open and returns to the card that opened it on close.
  - Lock body scroll while open.
  - Set the URL hash to `#project-<slug>` on open; opening the page with that hash opens the modal; on close, remove the hash with `history.replaceState`.
  - `aria-labelledby` points to the title.

### 6.8 Pricing (`home/Pricing.astro`)
- White band. Header "Simple pricing. No surprises." (left). Two plan cards on `--bg-secondary`, 2 columns desktop with gap 16, stacked on mobile; radius 20; padding 40 (24 mobile); internal gap 32 (28 mobile). Both cards are the same height on desktop.
- Card order:
  1. Optional badge pill above the name on mobile, right of the name on desktop ("Pause or cancel anytime", `--bg-secondary`, `caption`).
  2. Plan name `h4`.
  3. Description `body` `--text-secondary`.
  4. Price `display` + unit `body` `--text-secondary`, baseline-aligned.
  5. **Full-width primary "Book a call"** → `#book`.
  6. 1px hairline.
  7. "What's included" (`caption`, `--text-secondary`).
  8. Features: 20px check icon (circle `--bg-tertiary` + check `--text-primary`) + `body`, gap 14.
- Footnote below the cards: "Need something different? **Let's talk about a custom quote →**" (links to `#book`).

### 6.9 Book a Call (`home/BookCall.astro`)
- Header row: "Let's build something great." left; meta right (desktop) / under (mobile), each item with a 16px icon: "30 min · Google Meet", "Based in Bangladesh · GMT+6", "Replies within 24 hours" (`body-sm`, `--text-secondary`).
- Cal.com **inline embed** using `calLink` from settings, inside a container: full content width × 680px desktop (full width × 620 mobile), radius 20, `--bg-secondary`. Show a calm placeholder (calendar icon + "Loading calendar…") until it loads. **Load the embed only when the section comes near the viewport** (IntersectionObserver) to keep the page fast. Light theme, brand colour `#162026`.
- Below: "Prefer email? **{email}**" (`mailto:` link, underlined).

### 6.10 Footer (`layout/Footer.astro`)
- 1px `--border-primary` top border; padding-top 96 (64 mobile).
- Left column: brand (logo + name) → blurb "Framer designer and developer crafting fast, considered websites for startups, studios and creators." (`body-sm`, `--text-secondary`, max ~400px) → "Based in Bangladesh · GMT+6" (`caption`, `--text-tertiary`) → **"Get an AI summary of Emon"** (`label`, 500) → four icon-only 36×36 buttons (radius 6, `--bg-secondary`; hover `--bg-tertiary`) for **ChatGPT, Gemini, Claude, Perplexity**, using official SVG logos at 18px. Each opens the assistant in a new tab with a pre-filled prompt: "Summarise who Emon Arefin is and what he offers, based on https://emonarefin.com". **Verify each service's current pre-fill URL format** (e.g. a `?q=` parameter) before using it; if a service doesn't support pre-filling, link to its homepage and tell me.
- Right: three link columns. Spacing: column gap 112 (mobile: 2-column wrap, 40 × 40); heading → links 20; link gap 16. Headings `label` 500; links `label` `--text-secondary`, hover `--text-primary`.
  - **Navigate:** Home, Work, About, Pricing, Book a call.
  - **Services:** Website design, Framer development, Monthly subscription, Framer templates.
  - **Connect** (external, with ↗): LinkedIn, X / Twitter, Dribbble, Behance, Resume.
- **Dotted logo band:** below the links (96px gap desktop, 56 mobile), the full logo (mark + "Emon Arefin") as a halftone dot grid spanning the content width.
  - Write `scripts/generate-dotted-logo.mjs` (Node + `sharp`; ask before installing it). It rasterises `logo-full.svg`, measures how much of each grid cell the logo covers, and writes an SVG of circles.
  - Desktop: 8px grid, 1376 wide. Mobile: 5px grid, 350 wide.
  - Dot radius = 0.46 × grid × √coverage; skip cells under 6% coverage; dot colour `--border-secondary`.
  - Output to `src/assets/brand/`; render with `aria-hidden="true"`. Run the script once, and re-run it only when the logo changes.
- Bottom bar: "© 2026 Emon Arefin. All rights reserved." left; Privacy · Terms · Back to top ↑ right (`caption`, `--text-secondary`); padding `20 32 28` (mobile stacked, `20 20 28`).

### 6.11 About page (`pages/about.astro`)
- **Nav** (no intro animation).
- **About Intro:** two columns (desktop; stacked on mobile, photo below the text).
  - Left: eyebrow pill "About me" (`--bg-secondary`) → H1 `display` "Hi, I'm Emon — a product designer and photographer from Bangladesh." → two bio paragraphs from settings (`body-lg`, `--text-secondary`) → facts row: value `h3`, label `caption` ("5+ Years designing", "100+ Projects shipped", "GMT+6 Bangladesh").
  - Right: portrait photo, 4:5 ratio (560×700 desktop; full width on mobile).
- **Now (experience):** grey band.
  - Status pill: Live Dot (green) + "Currently".
  - Statement `h1`: "Product Designer" in `--text-primary` + " at Rubik" in `--text-tertiary` (on mobile, break the line before "at Rubik").
  - One-line sub (`body-lg`).
  - Timeline from `milestones`: horizontal on desktop (4 columns, hollow 9px dots with a 1.5px `--text-tertiary` ring, joined by a 1px `--border-secondary` line); vertical on mobile (the line runs down the left). The last item, "Now · Product Designer, Rubik", uses a pulsing **dark** Live Dot. Dots and text start-align with the 32px / 20px page margin.
- **Through My Lens:** header (left) + photo grid: CSS grid, 4 columns, gap 16; `wide` photos span 2 columns, `square` photos span 1. Mobile: 2 columns, gap 8, wide = full width. No empty holes: let the grid flow (`grid-auto-flow: dense`).
- **Footer.**

### 6.12 Live Dot (`ui/LiveDot.astro`)
24×24 box; a 10px core + a halo that grows from 10 to 24px while fading from 45% to 0 over 1.4s ease-out, looping. Colour: `--status-live` (green) or `--text-primary` (dark). Static under reduced motion.

---

## 7. Images and performance
- Every image goes through `astro:assets` with explicit `widths`/`sizes`. The above-the-fold portrait and first showcase slide get `loading="eager"` and `fetchpriority="high"`; everything else is lazy.
- Targets: Lighthouse Performance ≥ 95, Accessibility 100, CLS < 0.05 (always reserve image space with aspect ratios).
- Preload only the Inter weights in use.

## 8. SEO
Per-page `<title>` and meta description (from settings), Open Graph and Twitter tags with a 1200×630 OG image (placeholder until I supply one), canonical URL `https://emonarefin.com`, `@astrojs/sitemap`, `robots.txt`, favicon from the logo mark.

## 9. Accessibility checklist
Semantic landmarks (`header`, `main`, `footer`, `nav`), one `h1` per page, visible focus everywhere, keyboard-operable gallery, filters, modal and menu, `alt` text from the CMS, contrast ≥ 4.5:1 for body text (`--text-tertiary` is only for non-essential meta), hit targets ≥ 36px (40 on mobile where possible).

## 10. Don'ts
- Don't use Tailwind, React components on public pages, jQuery, or heavy animation libraries (no GSAP); CSS plus a little vanilla JS is enough.
- Don't hard-code colours, font sizes or copy that belongs in the CMS.
- Don't use drop shadows or rounded image corners.
- Don't add sections, links or features that aren't in the design without asking.
- Don't push to GitHub or deploy until Phase 9 and my go-ahead.

## 11. What "done" looks like for each section
It matches the Figma frame at **390** and **1440** within a couple of pixels, looks sensible at 768 and 1024, every interaction in §6 works with mouse, keyboard and touch, reduced motion is respected, and no colour or size is hard-coded.

---

## 12. Phases (stop and wait for my OK after each)

0. **Kick-off.** Confirm you've read both files. List anything unclear. Check the Figma MCP connection (help me set it up if needed). Explain the plan in plain words.
1. **Scaffold.** Create the Astro project in this folder (keep my two .md files), TypeScript strict, Git init with a sensible `.gitignore`, first commit. Show me how to run it (`npm run dev` → http://localhost:4321) and how to stop it (Ctrl+C).
2. **Foundations.** `tokens.css`, `typography.css`, `global.css`, Inter, `Base.astro`, focus and reduced-motion rules. Add a temporary `/styleguide` page showing every colour token, every type role and all Button variants **with their hover animations**, so I can check them.
3. **CMS.** Keystatic + content collections (§4), 3 seeded sample projects, the settings and pricing singletons, sample photos. Show me how to open `/keystatic` and add a project myself.
4. **Home, static.** Nav, Hero (end state, no animation yet), Showcase (static), Work grid + cards (no hover yet), Pricing, Book a Call (placeholder box), Footer with dotted logo. Mobile and desktop.
5. **About page,** static.
6. **Interactivity.** Filters, gallery (autoplay, drag, arrows, dots, sync), modal (desktop Split + mobile sheet with sticky bar, hash, focus handling), mobile menu, Cal.com embed.
7. **Motion.** Hero intro timeline (§6.4), card hovers, button sweeps, Arrow Button, Live Dot, modal transitions; reduced-motion check.
8. **QA.** Compare against Figma at 390 / 768 / 1024 / 1440, keyboard walkthrough, Lighthouse, fix issues. Remove `/styleguide` (or keep it hidden, ask me).
9. **Deploy.** Walk me through creating a GitHub repo and pushing, connecting Netlify (or Vercel), adding the adapter, switching Keystatic to GitHub storage, and pointing emonarefin.com (bought on Namecheap) at the site.

---

## 13. Assets I will provide (use placeholders until then)
In `src/assets/brand/`: `logo-mark.svg`, `logo-full.svg` (mark + "Emon Arefin"), `portrait.png` (dark silhouette, transparent background), `about-photo.jpg`, official SVGs for ChatGPT, Gemini, Claude and Perplexity, an OG image. Project images and Lens photos I'll add through Keystatic. Content I'll fill in later: real project details, prices, email, Cal.com link, social URLs, bio, milestone years.
