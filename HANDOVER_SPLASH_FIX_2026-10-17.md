# Splash tilt + variant-rotation fixes, 2026-10-17 (Claude)

Torree flagged two concrete problems with the splash (`/`, `/splash`): mobile tilt
"doesn't feel right," and on desktop only a handful of the 18 variants ever seem to
show, including some that look like they do nothing. All three root causes were
real bugs, not perception -- found by reading source, not guessing.

## 1. Mobile tilt: `beta` axis was centered on the wrong angle (real bug, fixed)

`src/hooks/useSplashPointer.ts`, `usePointerField`'s `deviceorientation` handler
mapped `beta` (front-to-back tilt) as `(beta + 45) / 90`, centering the usable
range on `beta = 0`, which is a phone lying flat on a table. A phone actually held
up to look at it sits near `beta = 90`. In that normal handheld posture the old
formula clamps to `1` almost immediately, so the vertical axis is pinned at one
extreme for the whole interaction and only left-right tilt (`gamma`, correctly
centered on 0) ever visibly moves. Changed the mapping to `(beta - 45) / 90`,
centering on 90. This is the fix for "tilt doesn't feel right" -- it was a one-axis
dead zone, not a tuning/sensitivity issue.

Caveat I can't verify from here: this assumes portrait holding. If someone rotates
the phone to landscape the raw `beta`/`gamma` roles swap at the OS level; nobody
has fixed that edge case, same as before. Worth a real-device check, same owner-only
item already on the board for the tilt experience generally.

## 2. Spotlight + Duotone: glow silently drifts off-screen before first mouse move (real bug, fixed)

Both variants ease their glow position toward the live pointer every animation
frame, unconditionally. The pointer field starts at `(-999, -999)` (its sentinel
"no mouse yet" value) until the first real `mousemove` fires. Every other
cursor-driven variant (Magnetic, TiltGlass, GrainReveal, CursorRibbon, LiquidChrome)
guards its easing with `if (pointer.on)`; these two didn't, so on load -- before
you've nudged the mouse even once -- the glow visibly eases toward off-screen
top-left and parks there, which reads as "does nothing." Added the same `m.on`
guard both places, and bumped both effects' radius/opacity (Spotlight 360px/.2 ->
420px/.3, Duotone 300px/.22 -> 360px/.32) since even once fixed they're genuinely
subtle against a dark background.

## 3. "I only see a few" was mostly a sampling problem, now fixed structurally

`RandomSplash` picked a variant with `Math.random()` each session, only avoiding
an immediate repeat of the literal last pick. With 18 variants and the splash
gating to once per browser tab (`sessionStorage` `wyz-splash-seen`), a real visitor
or a tester hitting refresh in the same tab essentially gets one lottery ticket per
new tab/incognito window -- bad luck can legitimately make it feel like "it's
always the same 3 or 4" for a long stretch, with nothing actually broken.

Replaced the picker with a shuffled "bag": every eligible variant goes into a
bag once, in random order (Fisher-Yates), and each call pops one off; the bag
reshuffles once it's empty. This guarantees every variant is seen exactly once
before any repeat. The bag is stored in `localStorage` (not `sessionStorage`), so
it persists across tabs and visits on the same browser, not just within one tab --
that's the part that actually fixes "show every single one," since the old
sessionStorage key only ever covered one tab's lifetime. Desktop and mobile track
separate bag keys (`wyz-splash-bag-all` / `wyz-splash-bag-mobile`) since they draw
from different pools (mobile is tilt-native only, see the 2026-10-15 entry above).

## There's already a built-in way to preview every variant on demand

`/splash-gallery` renders `SplashGallery` (the default export of
`SplashVariants.tsx`): a grid of all 18 variants, click any tile to preview it
live, "Surprise me" to pull one via the same picker. It exists and works, it's
just not linked from anywhere in the site nav, so nobody would stumble onto it.
Fixed its stale metadata description (hardcoded "16", now `VARIANT_COUNT` so it
can't drift again as variants are added/removed). Did not wire a nav link in --
that's a product decision (is this meant to be public, internal-only, password
gated?) rather than a bug fix, flagging it rather than guessing.

## Files touched

- `src/hooks/useSplashPointer.ts` -- beta-centering fix (1 line + comment).
- `src/components/SplashVariants.tsx` -- Spotlight/Duotone `m.on` guard + intensity
  bump, shuffled-bag picker replacing the old sessionStorage last-pick dedupe,
  exported `VARIANT_COUNT`/`MOBILE_VARIANT_COUNT`. Net diff is small (~52 lines);
  an earlier write round-tripped this file's line endings from LF to CRLF --
  caught and corrected back to LF (matching the rest of the repo and this file's
  own git history) before leaving it, so the diff WYZMiND will see is just the
  real content change, not a whole-file rewrite.
- `src/app/splash-gallery/page.tsx` -- dynamic variant count in metadata (2 lines).

## Verification

- `npx tsc --noEmit` on the live working tree: 0 errors, after the fix (ran it
  both before touching anything and after, to make sure I wasn't the one who broke
  something).
- `npm run lint` / `npm run test:run` could not be run from this session --
  this sandbox's own `node_modules` (not the real dev environment) hit a native
  `rolldown` binding error unrelated to this change. Did not touch `node_modules`
  to "fix" it. WYZMiND/Codex should run the real gate before this is committed.
- Checked the existing `a11y-mobile-gate.test.tsx` "splash mobile policy" assertions
  by hand against the new source: all still hold (mobile flags unchanged,
  `pickVariant(isTouchPrimary())` call site unchanged, `gyroNeedsGesture()` call
  site unchanged).
- Could not test the actual tilt feel on a physical phone from this cloud session --
  that's the one piece Torree or WYZMiND needs to confirm by hand on a real device.
  The fix is a straightforward angle-reference correction, not a guess, but "does
  it feel right" is inherently a hands-on call.

## Not committed to git

Per standing instruction, written straight to the device via the file-write tool,
not through git. WYZMiND needs to run the real build/lint/test gate and
commit/push. No other in-flight work was touched (left `WYZ_AI_TASK_BOARD.md`,
`WYZ_OPERATIONS_MAP.md`, and the uncommitted Codex reconciliation files exactly as
found, to avoid colliding with that in-progress batch).
