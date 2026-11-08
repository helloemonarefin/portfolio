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
- Current phase: **4 — Home, static (done, awaiting OK)**. Next: Phase 5 — About, static.
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
- 2026-11-08 — Pricing built per DESIGN_SYSTEM (grey band, white cards); Figma shows the reverse — awaiting Emon's confirmation.
- 2026-11-08 — Nav has a 1px --border-primary bottom border (from Figma; not in the spec text).
- Still open: sticky nav (ask in Phase 6); `sharp` install (ask in Phase 4).

## Dev commands
- `npm run dev` → http://localhost:4321 (stop with Ctrl+C)
- `npm run build` → static site in `dist/`
