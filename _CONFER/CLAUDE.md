# _CONFER brief: Claude

Lane: visual, layout, kinetic, device. You are the sole owner of how it looks and feels.

## Do
- One spacing scale and one section rhythm across all pages.
- One card pattern and one hero pattern.
- Cut density: Home 30 blocks to 8 to 12; Events 40 to about 12; web-design 27 to about 12. Same on mobile.
- Regroup `/services` (56 loose items) into 5 to 6 H2 groups.
- Build the `/work` Design and Photography split gateway + cross-switch (see audit).
- Render the condensed copy cleanly (shorter text changes card heights and line lengths).
- Keep axe 0 and gutters 34/34. Screenshots at desktop plus 320/360, light and dark.

## Verdict (2026-10-07, Claude)
- Keep: both portfolios full and separate (`/designs`, `/photography`), the "Merch" name, and the locked copy rules. Ran my own independent route/line-count/copy sweep before reading the others' drafts and landed on the same core problems (same 4 orphaned pages, same em-dash violations), which is a good sign the diagnosis is solid across two methods.
- Change: shipped the `/work` duality gateway this round (see below). Still open on my lane, not done this round: the one-spacing-scale/one-hero/one-card unification, and the Home/Events/web-design density cuts. Flagging honestly rather than claiming more than I did.
- Disagree: on decision #2 (photography filters), the proposed "keep 6" list (Portraits, Events, Editorial, Commercial, Studio, Products) doesn't line up with the 8 categories actually live in `src/app/photography/page.tsx` (Events, Outdoors, Studio, Boudoir, Bodypaint, Urbex, Products, Conceptual). Cutting to about 6 is fine for density, but the exact 6 needs the owner's call, not a renaming guess, since Boudoir/Bodypaint are real differentiators for this studio and "Portraits"/"Commercial" aren't current category names at all.
- Vote (see `_CONFER/README.md` matrix): A on duality entry, agree on service family / legal nesting / lab-page hiding / combine list, needs-owner-input on photography filters (see Disagree).

### Shipped this round
`/work` (new route): split-screen gateway, Design left half / Photography right half, each half expands on hover (reused the `ParallaxHero` flex-[1] hover:flex-[1.6] pattern from `merch/page.tsx`), center seam reads "Two sides. One studio.", each half links straight into the real portfolio. Added a persistent `WorkCrossSwitch` component on both `/designs` and `/photography` (a quiet bar: "See the photography work" / "See the design work" plus "Or see both side by side" to `/work`). Both portfolios untouched and still full. New files: `src/app/work/page.tsx`, `src/app/work/layout.tsx`, `src/components/WorkCrossSwitch.tsx`; edited `src/app/designs/page.tsx` and `src/app/photography/page.tsx` to mount the cross-switch (2 lines each, import + render, no existing content removed).

Verification this round: syntax-checked all 5 touched/new files with TypeScript's parser (0 diagnostics) since the full project `tsc --noEmit` and `eslint` both timed out repeatedly in this environment (170s+, no output) -- a recurring environment limit this session, not a result. Flagging as UNVERIFIED for full type-check/lint/build/live-screenshot until someone can run it where `tsc`/`npm run build` complete, or WYZMiND integrates and the live preview can be screenshotted.
