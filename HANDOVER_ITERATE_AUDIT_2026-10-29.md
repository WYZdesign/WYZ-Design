# Iterate pass: lint cleanup, site-wide sweep, dead-route finding — 2026-10-29

Follow-up to the handover-review pass earlier today: ran a full-tree lint check, swept every remaining untested live route for console errors and broken assets, and re-checked the items flagged-but-not-fixed in older handovers. One real cleanup done, one notable discovery (a feature got quietly retired and nobody updated the board for it), the rest confirmed either already resolved or still genuinely waiting on an editorial decision.

## 1. Fixed: 28 unused-import lint warnings, all from this session's own file-split work

`npx eslint src/` was coming back with 0 errors but 28 warnings, all `@typescript-eslint/no-unused-vars`, all traceable to the oversized-file splits from earlier today and the dark-mode/admin pass: when a component or hook got lifted out of a page into its own file, the original page kept importing it even though nothing in the page uses it anymore (the new file has its own copy of the import). Removed each dead import:

- `events/page.tsx`: `useCallback`, `createContext`, `useContext`, `FiChevronLeft`, `FiChevronRight`, `FiPlay`, `FiX`, `useModalA11y`, `useZeal` (all now only needed in `EventsVideo.tsx`)
- `home/page.tsx`: `useCallback` (now only needed in `HomeCarousels.tsx`)
- `photography/page.tsx`: `useCallback`, `FiCamera`, `FiX`, `useSwipe`, `useModalA11y`, and the `Lightbox` import from `PhotographyModals` (page still uses `AlbumModal`/`AutoScrollRow` from there, just not `Lightbox` directly)
- `merch/page.tsx`: `TypewriterText` import from `MerchSections` (page doesn't call it directly; it's still exported and used inside `MerchSections.tsx` itself)
- `SplashVariants.tsx`: `useRef`, and the now-fully-unused `usePointerField`/`useStage`/`fit` import, plus `G`/`CrownLogo`/`Wordmark`/`center`/`fullCanvas` from the `SplashBrand` import (all now only needed in `SplashVariantComponents.tsx`)
- `SplashVariantComponents.tsx`: `CSS` from its own `SplashBrand` import
- `faq/page.tsx`: `AnimatedCounter` — this one's unrelated to the split, just a pre-existing dead import nobody had cleaned up

`npx tsc --noEmit` and `npx eslint src/` are both now **0 errors, 0 warnings**, full tree — first time this session the whole repo has come back completely clean rather than just "the files I touched."

## 2. Site-wide sweep: every other live route, checked for console errors and broken images

Covered everything not already checked in today's earlier passes: `/services`, `/printing`, `/merch`, `/blog`, `/community`, `/booking`, `/contact`, `/model-archive`, `/wyzmind`, `/loyalty`, plus re-confirming the known `/plans` and `/web-design` redirects. All clean — no broken images (checked every `<img>` on each page via `naturalWidth`), no console errors beyond the two already-documented non-issues from earlier handovers (the report-only CSP's `upgrade-insecure-requests` notice, and an occasional `ERR_CACHE_OPERATION_NOT_SUPPORTED` on a duplicated background-video range request — a browser cache quirk on the auto-playing hero videos, not something the page code controls, and the video still plays fine from the request that does succeed).

One thing worth closing out rather than re-flagging: the merch catalog that an earlier WYZMiND handover listed as "empty — no products in CMS" now has 46 images and a real product grid. Already resolved, no longer an open item.

## 3. Found: `/fd` quietly got redirected away, but the board still treats it as a live feature

`next.config.ts`'s redirect list (added in commit `6f0ed8b`, "fold... Breed pages into About") includes `{ source: "/fd", destination: "/about", permanent: true }` right alongside the `/nomadic-breed` and `/dying-breed-crew` consolidations. Nothing links to `/fd` anywhere in the codebase anymore (grepped for it), so this looks like a deliberate, already-cleaned-up retirement of the FD Oracle feature — not an accident.

The problem: nobody updated the two things that still treat `fd/page.tsx` as active:

- The oversized-file-split board (and my own assessment of it two days ago) still lists `fd/page.tsx` (435 lines) as a file that needs a deliberate component-boundary refactor someday. That's now moot — there's no reason to spend effort splitting a page a 301 redirect sends nobody to.
- `fd/page.tsx` itself is still sitting in the repo as dead weight (435 lines, unreachable).

Not touching the page file or the redirect myself — whether to delete the dead route entirely (and its data/API dependencies, if any) or keep it around in case the feature comes back is a product call, not a cleanup I should make unilaterally. Flagging so the board gets corrected and nobody schedules work against a page nobody can reach.

Checked the obvious mix-up risk: `community/page.tsx` (967 lines, the other oversized file still on the board) is NOT redirected — confirmed it loads normally — so that one's split assessment from two days ago still stands as written.

## 4. Re-checked, still genuinely unresolved (no action taken — these need a decision, not a mechanical fix)

- **`designs/page.tsx`'s `.hover-lft` typo** (missing the "i" in "lift"): still completely unreferenced by any `className` in the file, confirmed again. Fixing the spelling alone does nothing without deciding which element should actually carry it — that's a design call, not a bug fix, so still just flagged.
- **`design-tokens.ts` / `contrast.ts`**: still not imported by anything. Same open question as before — wire them up or remove them.
- **Analytics tracker IDs** (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`, `NEXT_PUBLIC_CLARITY_ID`): still blank in `.env.example`. Needs real account IDs from whoever owns those accounts, not something I can fill in.

## Files touched

`src/app/events/page.tsx`, `src/app/home/page.tsx`, `src/app/photography/page.tsx`, `src/app/merch/page.tsx`, `src/app/faq/page.tsx`, `src/components/SplashVariants.tsx`, `src/components/splash/SplashVariantComponents.tsx` — all import-only cleanup, zero behavior change.

## Verification

- `npx tsc --noEmit` — clean, full tree.
- `npx eslint src/` — **0 problems** (0 errors, 0 warnings), full tree.
- Live console + broken-image check across every route not covered by an earlier pass today — all clean.
- No `git` actions taken, same standing instruction as every round.
