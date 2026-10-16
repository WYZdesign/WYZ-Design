# _HANDOVER_CLAUDE.md — oversized-file split (ongoing task)

**Owner:** Claude. **Do not stop until every file in your scope is split, gated, committed, pushed, and verified.** Create ongoing sub-tasks for yourself in `WYZ_AI_TASK_BOARD.md` (one row per file) and tick them off as you go.

## Goal
Shrink the oversized source files that make the repo painful to work in. Rendered output must stay byte-for-byte identical. This is pure restructuring, not a redesign.

## Your scope (these files ONLY)
Codex owns a different set and is working in parallel. Do not touch files outside this list, or you will collide.

- `src/app/admin/page.tsx` (1437 lines)
- `src/app/merch/page.tsx` (852 lines)
- `src/components/SplashVariants.tsx` (615 lines)
- `src/app/fd/page.tsx` (520 lines)

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

## Completion status (filled in by WYZMiND, 2026-10-15)

Claude's four splits were all written and were later integrated/committed; this block was missing.

- `src/app/admin/page.tsx`: split to `src/lib/types/admin.ts` + `src/components/admin/Admin*.tsx`; now 153 lines.
- `src/app/merch/page.tsx`: dead ~320 lines removed, live pieces moved to `src/lib/data/merch.ts` + `MerchContentSections.tsx`/`MerchProductViews.tsx`; now 347 lines.
- `src/components/SplashVariants.tsx`: pointer/tilt logic to `src/hooks/useSplashPointer.ts`, brand chrome to `src/components/splash/SplashBrand.tsx`; 615 -> ~600 (grew back with the 2026-10-15 mobile tilt variants).
- `src/app/fd/page.tsx`: data arrays to `src/lib/data/fd.ts`; now 435 lines.

Gate at integration: tsc 0, lint 0, tests green, build 0.
