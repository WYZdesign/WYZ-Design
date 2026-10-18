# Re-audit + regression fix, 2026-10-18 (Claude)

Torree asked for a full re-audit of WYZMiND's recent updates, fixes/testing/troubleshooting
across the board, a real visual audit, and a check on whatever Codex still had open. Summary
below, most important item first since it needs WYZMiND's attention before anything ships.

## 1. I introduced a regression on `src/app/photography/page.tsx` and fixed it in this pass

While removing the dead `/api/gdrive-photos` fetch (item 2 below) in the previous session, I
edited from a stale local snapshot of the file that predated several since-landed commits
(`0b51607` carousel +15%/flip-card tap-race guard, the `WebkitBackfaceVisibility` prefix,
`c73745d`'s model-archive work, the `HeroDots` import, etc). Writing that edit back to the
device silently reverted all of that intervening work on this one file.

**Caught and fixed this pass**, before anything was committed anywhere: rebuilt the file from
the current `HEAD` blob (`git show HEAD:src/app/photography/page.tsx`), reapplied only the
intended dead-fetch removal on top, and confirmed the resulting diff against `HEAD` is exactly
the ~41/47-line change described in item 2 (verified with `git diff --ignore-all-space`, which
collapses an unrelated legacy line-ending quirk already present in `HEAD` -- see the note at the
bottom). `npx tsc --noEmit` clean on the full tree afterward. I'm flagging this prominently
because it's exactly the kind of silent clobber this engagement has had to clean up before, and
I'd rather over-report it than have it slip through.

**No other files were affected** -- this was isolated to `photography/page.tsx`; nothing else in
the working tree needed correction.

## 2. Real bug fixed: dead, always-403 fetch on `/photography`

`src/app/photography/page.tsx` fired 6 fetches to `/api/gdrive-photos?category=...` on every
page load (12 counting StrictMode's double-invoke), to refresh album covers and two carousels.
`src/app/api/gdrive-photos/route.ts` starts with `requireAdmin()` and returns 403 for anyone
without an admin session -- so for every real, anonymous visitor this call was always going to
fail. Confirmed live via browser network inspection on `/photography/Conceptual`: 12 x 403.
The `.catch()` fallback meant production always rendered the static `ALBUM_COVERS_STATIC` values
anyway (confirmed visually), so the fetch never did anything except cost 6 doomed round-trips per
load. Removed the fetch and the `useEffect` that drove it; `albumCovers`/`carousel1`/`carousel2`
are now the static values directly, with a comment explaining why.

## 3. Stale copy fixed: "78+ models" on `/photography`

The Model Archive section said "Our model archive has 78+ models and client albums to browse."
`c73745d` (model-archive additions) brought the real roster to 91 entries (confirmed: 94
`name:` occurrences in `src/app/model-archive/page.tsx`'s `MODELS` array, minus a couple of
unrelated `name:` props elsewhere in the file). Changed the copy to "90+ models" to match the
site's existing rounding convention (home/about's "60+ events", "30+ clients" are also rounded
down, not exact).

## 4. `next.config.ts` CSP narrowing -- verified correct, left as-is (uncommitted, in-flight)

Found `next.config.ts` with an uncommitted edit narrowing `img-src` from the wildcard
`https://*.supabase.co` to the exact portfolio bucket host
`https://ccznkpcmpadgftqhwvdx.supabase.co` (both header blocks), plus adding the matching
`remotePatterns` entry. This pairs with an uncommitted `describe("photography delivery", ...)`
block already sitting in `src/app/a11y-mobile-gate.test.tsx` that asserts exactly this (exact
host present, wildcard absent, in both policies). I verified the implementation already satisfies
that test's assertions by hand. This reads as Codex's own in-flight work (narrowing the wildcard
`c5c5bb6` had originally added, now that the exact Supabase project host is known) -- it's
correct and complete, just not yet committed. Left it untouched rather than "finishing" something
that isn't actually unfinished.

## 5. Codex status check

Re-read `_HANDOVER_CODEX.md` (oversized-file split: community/events/photography/
photography[category]) -- self-reported complete 2026-10-12, matches the task board (every row
`done`, verified by WYZMiND 2026-10-15) and git log (`39b5816`, `b1db895`, `b8e0ad3`, `a00b72b`).
Scanned `WYZ_AI_TASK_BOARD.md` for every row naming Codex: everything is `done`. The only
Codex-shaped loose end is item 4 above (CSP narrowing + test), which is complete, just
uncommitted. I don't see anything else open under Codex's name.

## 6. Reviewed (not touched) -- confirmed sound

- **`72ea30d`** (mobile splash: continuous autonomous drift, tilt overrides when available,
  removed the blocking tap-to-enable-tilt gate, deduped the iOS motion-permission race). This is
  a good, correct answer to exactly the mobile tilt problem Torree raised two sessions ago: it
  keeps my beta-centering fix intact, adds a slow autonomous orbit so the splash always animates
  on mobile even if tilt permission is never granted, and fixes a real race (concurrent
  `requestPermission()` calls from multiple live hook instances) by sharing one promise across
  callers. No regression found.
- **`0b51607`** (carousels +15%, flip-card consistency, tap-race guard, overflow guards) -- spot
  diffed against `photography/page.tsx`: `justFocusedRef` guard and `WebkitBackfaceVisibility`
  prefix both present and correct in the now-restored file.

## Verification this pass

- `npx tsc --noEmit`: clean, full tree, after the restore + both fixes.
- `npx eslint src/app/photography/page.tsx`: 0 errors, 0 warnings (the one warning I'd flagged as
  unresolved in the prior handover turned out to be an artifact of the stale-snapshot regression
  itself -- the corrupted version was missing `featuredModels.length` from one effect's deps; the
  real `HEAD` version already has it correctly, so there was never a real warning here).
- Live browser audit continued from the prior pass (`/`, `/photography`, `/photography/Conceptual`
  already covered): network tab confirmed no more `/api/gdrive-photos` calls needed fixing beyond
  what's described above.

## Note on `src/app/photography/page.tsx`'s line endings

`HEAD`'s own copy of this file already has pre-existing, inconsistent line endings in one block
(the model-archive "Navigation Dots" section carries literal `\r\r\r\n` sequences, predating this
session). My rebuild-from-`HEAD` process normalizes the whole file to plain `\n`, which
incidentally cleans that up too. This has no effect on rendered output (it's whitespace between
JSX elements, which JSX strips) and isn't something I went looking to fix, just flagging so the
diff WYZMiND reviews doesn't look bigger than the real change if diffed without
`--ignore-all-space` -- use `git diff --ignore-all-space -- src/app/photography/page.tsx` to see
the real ~41/47-line change cleanly.

## git state note (carried over from the prior session, resolved)

Earlier in this engagement I ran `git stash` from this bridge to compare before/after lint output,
which failed (`.git/index.lock` couldn't be removed -- this environment's connected-folder bridge
can't delete files by default) and left stale lock/tmp-object files. **No actual stash was ever
created** (`git stash list` confirmed empty), so no working-tree changes were lost by that
specific failure -- the real problem was the separate stale-snapshot issue in item 1 above, not
this. Recovered by renaming (not deleting) the stale files per the bridge tool's own guidance:
`.git/stale-index-lock-claude`, `.git/stale-tmp-obj-claude`. `git status` runs cleanly now. I'm
avoiding any further mutating git commands from this session (stash/add/commit/checkout/reset) --
read-only commands only (status/log/diff/show).

## Not committed to git

Per standing instruction: written directly to the device, not through git. WYZMiND should review
`src/app/photography/page.tsx` (the restore + both fixes), confirm `next.config.ts` +
`a11y-mobile-gate.test.tsx` + the new `src/lib/data/photography-category.test.ts` are ready to
land as Codex's CSP-narrowing batch, run the real build/lint/test gate, and commit/push/deploy.
Nothing else in the working tree was touched this pass.
