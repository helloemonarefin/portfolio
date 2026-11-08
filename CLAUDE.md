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
- Current phase: **2 — Foundations (done, awaiting OK)**. Next: Phase 3 — CMS.
- Temporary `/styleguide` page exists (noindex) — remove or hide in Phase 8.

## Decisions log
- 2026-11-08 — DESIGN_SYSTEM.md and BUILD_PROMPT.md reconciled by Emon; no open conflicts.
- 2026-11-08 — Git author: name `emonarefin`, email `helloemonarefin@gmail.com`.
- 2026-11-08 — Inter self-hosted via Astro's built-in fonts API (`fonts` in astro.config.mjs, Fontsource provider), CSS var `--font-inter`.
- 2026-11-08 — Icons: Lucide paths copied exactly from Figma assets into `ui/Icon.astro`, drawn in `currentColor`.
- 2026-11-08 — Hero "View Projects" = plain `secondary` (Emon changed from secondary-chip). Plain Secondary border = 0.5px, matching Figma. Secondary-chip keeps 1px.
- Still open: sticky nav (ask in Phase 6); `sharp` install (ask in Phase 4).

## Dev commands
- `npm run dev` → http://localhost:4321 (stop with Ctrl+C)
- `npm run build` → static site in `dist/`
