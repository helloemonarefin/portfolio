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
- 2026-11-09 — TEMPORARY: a full-width copy of the Work section (`id="work-full"`, `.container--full`) sits under the original in index.astro for Emon to compare. Remove whichever he doesn't keep.
- Still open: Lens photo count (Emon to decide); sticky nav (ask in Phase 6); `sharp` install (ask in Phase 4).

## Dev commands
- `npm run dev` → http://localhost:4321 (stop with Ctrl+C)
- `npm run build` → static site in `dist/`
