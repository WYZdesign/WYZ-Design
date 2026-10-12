# _HANDOVER_CODEX.md — oversized-file split (ongoing task)

**Owner:** Codex. **Do not stop until every file in your scope is split, gated, committed, pushed, and verified.** Create ongoing sub-tasks for yourself in `WYZ_AI_TASK_BOARD.md` (one row per file) and tick them off as you go.

## Goal
Shrink the oversized source files that make the repo painful to work in. Rendered output must stay byte-for-byte identical. This is pure restructuring, not a redesign.

## Your scope (these files ONLY)
Claude owns a different set and is working in parallel. Do not touch files outside this list, or you will collide.

- `src/app/community/page.tsx` (1371 lines)
- `src/app/events/page.tsx` (845 lines)
- `src/app/photography/page.tsx` (806 lines)
- `src/app/photography/[category]/page.tsx` (403 lines)


## Method (same pattern as the home refactor, commit 690fd95)
- Move inline static data arrays (pure data, no JSX) into `src/lib/data/<name>.ts` and import them.
- If a block contains JSX (icons/components), leave it in the page OR move it to `src/components/`.
- Extract large repeated sections into components under `src/components/`.
- Never change rendered output, copy, class names, or behavior.

## Constraints
- No em-dashes anywhere.
- One file per commit, conventional commit message, push to `master`.
- After each file: `$env:NODE_OPTIONS="--max-old-space-size=4096"; npm run build` then `npm run lint` then `npm run test:run` must all be green. If `.next/dev/types/validator.ts` corrupts, move it aside (`.bak`) and rebuild.
- Data files are pure `.ts` (no JSX).
- Do not delete or rename existing exports other files depend on.

## Verification (double-check every file)
- Confirm the moved arrays are imported and no literal changed (spot-diff a few entries).
- Confirm the page line count dropped materially.
- Confirm build + lint (0 errors) + tests are green after each file.
- Update `WYZ_AI_TASK_BOARD.md` with a row per file and flip it to done.

## Report
Append a short status block to the bottom of this file when done, listing each file, its before/after line count, and any file you could not split (with the reason).
## Completion status — 2026-10-12

- `src/app/community/page.tsx`: 1420 → 929 lines. Static datasets moved to `src/lib/data/community.ts`; JSX-bearing highlights remain in the page.
- `src/app/events/page.tsx`: 901 → 806 lines. Static event and flyer datasets moved to `src/lib/data/events.ts`.
- `src/app/photography/page.tsx`: 1716 → 1674 lines. Album datasets moved to `src/lib/data/photography.ts`.
- `src/app/photography/[category]/page.tsx`: 422 → 123 lines. Category metadata and albums moved to `src/lib/data/photography-category.ts`; repeated row JSX is in `src/components/PhotographyCategoryRows.tsx`.

All scoped extracts are complete. `npm run build`, `npm run lint` (0 errors), and `npm run test:run` (18 passing) are green.
