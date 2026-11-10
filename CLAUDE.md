# CLAUDE.md

**Read `DESIGN_SYSTEM.md` and `BUILD_PROMPT.md` in full before doing anything.**
`DESIGN_SYSTEM.md` = exact tokens and specs. `BUILD_PROMPT.md` = behaviour, working style, phases.
If they disagree or something isn't covered: check Figma, then ask Emon. Never invent.

## Working with Emon
- Beginner at hand-coding. Explain each command in 1–2 plain sentences before running it.
- One phase at a time; stop and wait for OK after each.
- After every phase: commit to Git and show the full phase checklist with the finished phase ticked.
- No new libraries beyond BUILD_PROMPT §2 without asking.
- No push / deploy before Phase 9 and an explicit go-ahead.

## Figma
- File key `FFs05OacP9URxrCuYpT1fT`, page **Portfolio Website** = node `166:331`.
- Home · Desktop 1440 = node `168:139`. Connected via the Figma plugin MCP.

## Status
- Stack: Astro 7.4.7, TypeScript strict, Node 26, plain CSS.
- Current phase: **7 — Motion + Emon's motion feedback (done, awaiting OK)**. Next: Phase 8 — QA.
- Temporary `/styleguide` page exists (noindex) — remove or hide in Phase 8.

## Decisions log
- 2026-11-08 — DESIGN_SYSTEM.md and BUILD_PROMPT.md reconciled by Emon; no open conflicts.
- 2026-11-08 — Git author: name `emonarefin`, email `helloemonarefin@gmail.com`.
- 2026-11-08 — Inter self-hosted via Astro's built-in fonts API (`fonts` in astro.config.mjs, Fontsource provider), CSS var `--font-inter`.
- 2026-11-08 — Icons: Lucide paths copied exactly from Figma assets into `ui/Icon.astro`, drawn in `currentColor`.
- 2026-11-08 — Hero "View Projects" = plain `secondary` (Emon changed from secondary-chip). Plain Secondary border = 0.5px, matching Figma. Secondary-chip keeps 1px.
- 2026-11-08 — Keystatic: entries are `src/content/<collection>/<slug>/index.yaml`; singletons `src/content/settings/settings.yaml`, `src/content/pricing/pricing.yaml`. Images in `src/assets/projects|photos/<slug>/`, stored as relative paths (`../../../assets/...`) so Astro's `image()` optimises them. Category values are lowercase (`agency|saas|portfolio|templates`); labels in `src/lib/content.ts`.
- 2026-11-08 — Keystatic integration loads only in `npm run dev` (needs a server adapter, added in Phase 9). `npm run build` stays fully static.
- 2026-11-08 — Added `settings.currentRole.summary` (About "Now" one-liner from Figma) so that copy comes from the CMS. Both spec files updated.
- 2026-11-08 — Seed: 3 projects (Figma placeholder copy), 8 Lens photos (6 wide + 2 square, as in Figma), placeholder images are labelled grey PNGs.
- 2026-11-08 — Brand assets from Figma: `src/assets/brand/logo-mark.svg`, `portrait.png`. Dotted logo SVGs taken from Figma's Footer component (converted path→circle, identical render, ~5× smaller) instead of generating with sharp.
- 2026-11-08 — Emon: Pricing = white band + grey cards (as Figma). Showcase desktop = white, padding 12/128 (Figma update). Footer Services/Privacy/Terms links and AI-button URLs left as-is for now.
- 2026-11-08 — Nav has a 1px --border-primary bottom border (from Figma; not in the spec text).
- 2026-11-08 — Footer headings + "Get an AI summary" use `caption` 500 (Figma) instead of `label`; DESIGN_SYSTEM updated.
- 2026-11-08 — About photo is a labelled placeholder until `src/assets/brand/about-photo.jpg` exists. Live Dot halo animation deferred to Phase 7.
- 2026-11-08 — Showcase white at all sizes; mobile padding 8/72. Nav is sticky (Emon, 2026-11-08): frosted --surface-overlay + 12px blur once scrolled.
- 2026-11-08 — Media fields (project thumbnail, gallery items, Lens photos) = Image/Video switch (`media()` in keystatic.config.ts ↔ content.config.ts; rendered by `ui/Media.astro`). Videos live in `public/media/…`.
- 2026-11-08 — Cal.com: `helloemonarefin/30min`, inline month view, light theme, brand #162026, lazy-loaded via IntersectionObserver (BookCall.astro).
- 2026-11-08 — Embla 8.6.0 (+ Autoplay) for the Showcase. Embla can't take a custom easing curve; `duration: 38` approximates the 1s slide.
- 2026-11-08 — `npm audit`: 2 moderate (minimatch, via CMS tooling; not shipped to browsers). Not force-fixed.
- 2026-11-08 — Motion: hero intro is pure CSS keyframes (Hero.astro + `.nav--overlay` nav-in); card hover overlay only on hover-capable pointers + :focus-visible; modal close is animated (`closeAnimated`, Esc via `cancel`); Live Dot halo pulses. Reduced motion → global rule shows end states.
- 2026-11-08 — Emon's motion feedback round: Lenis smooth scroll (approved), Keystatic "Motion" singleton (src/content/motion/motion.yaml ↔ content.config.ts ↔ src/lib/motion.ts → --m-* vars injected in Base.astro), site-wide scroll reveal, nav intro sequence, text-link roll, button label slide, chip hover, Showcase featured height = image height, hero copy "See works" / "Book a call".
- Note: after adding a NEW content collection, restart the dev server (`npx astro dev stop` then `npm run dev`).
- 2026-11-09 — Footer: credit row now 64px (40 mobile) below the dotted logo, 1px --border-primary hairline on top (inside side padding), 24px padding-top.
- 2026-11-09 — Button hover per Figma "Primary · Medium · Hover · Hug": token --button-primary-bg-hover #FF280F; chip moves left→right edge, hug label slides left (−32 md / −28 sm); fill keeps label centred; plain Secondary hover = same red + white text. Secondary-chip keeps the old sweep (unused).
- 2026-11-09 — Hero arc: horizontal radius max(1500px, 104.17vw) so wide screens keep the Figma curve.
- 2026-11-09 — Arc radius softened to max(1500px, calc(750px + 52.08vw)) (midway). Text roll: incoming copy uses --text-accent (#FF280F). #work-3col: 1 col <810, 2 cols 810–1600, 3 cols >1600. Radius 0 on pricing cards, Cal.com container, AI-summary buttons (only buttons rounded).
- 2026-11-09 — Emon chose the Work layout: ONE section (#work), full width (`.container--full`, side padding 20/48 = nav), 1 / 2 / 3 columns at <810 / 810–1600 / >1600. Comparison copies removed.
- 2026-11-09 — CMS round: Design pages (Colours / Borders / Hero layout → src/lib/design.ts, `:root:root` overrides; all 1px borders now `var(--border-width)`, secondary 0.5 → `--border-width-thin`; hero spacing driven by --hero-* vars, arc follows portrait). Motion split into one singleton per component (src/content/motion/*.yaml, merged in motion.ts). New `showcase` collection (top/bottom rows) replaces projects.showcase. GIF images served unoptimised so they animate.
- 2026-11-09 — Hero portrait = Emon's photo `src/assets/brand/portrait.jpg` (900×900, background #FDFDFD). `brightness(1.012)` on the img + `mix-blend-mode: multiply` on the clip box make the background take the hero's colour (works with any Design → Background primary). Old Figma portrait.png removed.
- 2026-11-10 — Arrow Button: hover fill/border = brand (--button-primary-bg-hover); plays when any `.arrow-trigger` parent is hovered/focused (Work card). Hero arc/portrait overlap report from Emon: not reproducible in Chrome (arc top = portrait bottom at any size) — waiting for browser + screenshot.
- 2026-11-10 — Hero scroll parallax copied from the live Framer site (measured): sticky hero, arc+content up 10.85% & +1.6%/1000px scale, portrait down 1.6% & −3.2%/1000px. Keystatic → Motion → Hero parallax (src/content/motion/parallax.yaml). `.hero ~ * { position: relative; z-index: 1 }` in global.css.
- 2026-11-10 — Dev-only Vite plugin `cleanStaleContentAssets` in astro.config.mjs: works around an Astro bug where `.astro/content-assets.mjs` keeps imports of images that Keystatic deleted (switching Image → Video caused ImageNotFound until restart). On unlink in src/assets/ it removes imports whose file is gone and full-reloads.
- 2026-11-10 — Showcase: autoplay pauses only during drag (native pointer events) + hidden tab; no hover pause. Grab/grabbing cursor. Bottom row cards hug their media height (no fixed 200/140, no crop).
- 2026-11-10 — Showcase bottom row: own Embla + Autoplay (same as top), loop, cards = half a top slide wide, align fn puts two cards under the centred top slide; fill to ≥12 items (Embla silently disables loop when content < viewport). Old row-sync removed.
- 2026-11-10 — Project Modal per updated Figma: radius 0, tag chips under the summary, tighter stats. Desktop width 80vw (min 900, max 1600). Gallery = thumbnail + CMS gallery (≤9, 10 total), 3s endless slideshow, draggable Embla thumb strip (5 visible) with prev/next arrows. `liveUrl` → `liveSite {show, label, url}`.
- 2026-11-10 — Modal gallery: thumbnails use the main image's ratio (664/457); strip loops and the selected thumbnail always sits at the left end.
- 2026-11-10 — `liveSite.newTab` checkbox (default on): live-site button opens in a new tab or the same tab. Missing value = new tab (dev keeps stale cached entries after a schema change).
- 2026-11-10 — Mobile menu: links 18px (h5), "Book a call" (same as desktop nav) right under the links, social links row at the bottom.
- Still open: pricing badge pill radius (asked); Lens photo count (Emon to decide); sticky nav (ask in Phase 6); `sharp` install (ask in Phase 4).

## Dev commands
- `npm run dev` → http://localhost:4321 (stop with Ctrl+C)
- `npm run build` → static site in `dist/`
