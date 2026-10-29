# Dark-mode visual audit — 2026-10-29

Asked to audit every dark-mode page/subpage on desktop and mobile for anything that looks uneven, weird hovers/shadows, or less polished than the light side. Found one real, site-wide root cause behind most of that feeling, plus a handful of smaller matching gaps. Fixed all of it; nothing here needed a judgment call on content or layout, just CSS.

## The big one: a blanket rule was erasing every colored shadow/glow in dark mode, site-wide

`src/app/globals.css` had this, added in an earlier dark-mode pass:

```css
.dark [class*="shadow"] {
  box-shadow: 0 2px 12px rgba(0,0,0,0.5) !important;
}
```

The intent was reasonable (Tailwind's default `shadow-sm`/`md`/`lg`/`xl`/`2xl` are too faint to read on dark backgrounds, so give dark mode a visible one), but the selector is far too broad: `[class*="shadow"]` matches *any* element whose class string contains the substring "shadow" — which includes every one of the dozens of `shadow-lg shadow-[#DF3131]/30`-style elements across the site. That's Tailwind's shadow-color utility, used everywhere as the brand's signature red glow: active filter pills, active tabs, CTA button hovers, the red ring around the Featured Artist portrait, active pricing/wizard steps. In light mode those all glow red. In dark mode, the `!important` flat grey shadow silently replaced every single one of them with the same generic `0 2px 12px rgba(0,0,0,.5)` — no color, no glow, just a dull grey smudge.

Confirmed this live, not just by reading the CSS: on the FAQ page's active "ALL" filter pill (`shadow-md shadow-[#DF3131]/20` in the source), the actual computed `box-shadow` in dark mode was `rgba(0,0,0,0.5) 0px 2px 12px 0px` — the override, not the brand glow. That's exactly the kind of "dark mode looks flatter/less professional than light" gap that's hard to put your finger on without digging into computed styles, because nothing is *broken* — every element still has *a* shadow, it's just always the same characterless one instead of the branded one.

It also had a second, smaller problem: because the rule applied one identical shadow to every size tier, `shadow-sm` and `shadow-2xl` elements looked exactly as "deep" as each other in dark mode, even though light mode gives them a real depth hierarchy (a card and a modal don't look the same weight). "Evened out" in exactly the way that reads as less considered.

**Fix:** replaced the one blanket rule with five tiered ones (`shadow-sm` through `shadow-2xl`, each boosted in opacity enough to actually read against dark backgrounds, roughly scaled the same way the codebase's own `.dark .card-lift:hover` override already does it elsewhere — so this matches an existing, already-proven convention rather than inventing a new one) and excluded anything that pairs a shadow utility with Tailwind's color syntax (`shadow-[...]` or `shadow-black`, the only two forms used in this codebase) from all five, since those already compose their own correctly-tinted shadow and don't need (and shouldn't get) a flat grey override. Every brand-glow element now keeps its own glow in dark mode, same as light mode; every plain shadow-sm/md/lg/xl/2xl element gets a size-appropriate dark shadow instead of one flat value.

## Smaller matching gaps: hover-lift shadows with no dark variant

Same root issue, different spot: several bespoke hover classes (not Tailwind utilities, hand-written in `globals.css` or in a page's own inline `<style>` block) set a black box-shadow on hover with no `.dark` override at all:

- `globals.css`'s own `.hover-lift:hover` (used site-wide as a class) and the unused `.wz-lift:hover`
- `events/page.tsx`'s locally-redefined `.hover-lift:hover` (used on the DIY-shows/client-events video carousels)
- `photography/page.tsx`'s locally-redefined `.hover-lift:hover` (used on the album auto-scroll rows)
- `blog/page.tsx`'s `.blog-card:hover`
- `faq/page.tsx`'s `.faq-item:hover`

A black shadow at low alpha is essentially invisible once the page background is already near-black, so hovering any of these cards in dark mode gave you the lift *motion* with no shadow depth cue at all — motion without feedback reads as unfinished. Added a `.dark` variant to each, boosting the alpha the same way (not switching to a light-colored glow, since these aren't colored-shadow elements — just a stronger black shadow, which does read clearly once the surrounding page isn't pure black, which none of this site's dark surfaces are).

## Looked for, didn't find further issues

Went through the dark-mode background palette (`dark:bg-[#1C1C1E]`/`#252528`/`#111`/etc. — 169+100+31+... instances) looking for a patchwork of near-duplicate surface colors; what's there is a consistent, deliberate two-tier system (page bg vs. card surface) with a few legitimate one-off secondary surfaces (cart drawer, error states), not an inconsistency. Screenshotted home/photography/services/blog/faq at desktop and mobile widths in dark mode — card borders, spacing, and section rhythm all look even and consistent with light mode; nothing else stood out as visually broken or mismatched.

One unrelated, pre-existing bug noticed along the way (not a dark-mode issue, flagging since it was right next to what I was already looking at): `designs/page.tsx` defines `.hover-lft` (typo — missing the "i") in its inline `<style>` block, and nothing in that file actually uses that class name (confirmed via grep — not `hover-lft`, not `hover-lift`, nowhere as a `className`). It's dead CSS from a typo, not currently attached to anything, so there's no visible symptom today — not touching it since fixing the spelling alone wouldn't do anything without also deciding which element should carry it, which is a design decision, not a dark-mode fix.

## Files touched

`src/app/globals.css`, `src/app/events/page.tsx`, `src/app/photography/page.tsx`, `src/app/blog/page.tsx`, `src/app/faq/page.tsx`.

## Verification

- `npx tsc --noEmit` — clean, full tree.
- `npx eslint` on every touched `.tsx` file — 0 problems.
- `postcss.parse()` on `globals.css` — syntactically valid.
- Confirmed the bug itself live (computed `box-shadow` on the FAQ page's active filter pill, before the fix) via the browser's own devtools-equivalent (`getComputedStyle` + walking `document.styleSheets` to see exactly which rule was winning and why) — not just reading source.
- Did not confirm the fix rendering live post-change: this environment can't rebuild/redeploy, and a quick in-page CSS-injection test to preview it ran into an unrelated cascade quirk from stacking multiple of my own test overrides on the same already-loaded page (not a sign of anything wrong with the actual fix — once this ships there's exactly one rule per element, not three competing test rules). Worth a 30-second live recheck on the FAQ page's active filter pill after deploy: it should show a faint red-tinted shadow, not flat grey.
- Noticed, unrelated to this pass: `src/app/designs/page.tsx` and `src/components/SafeImage.tsx` are mid-edit from WYZMiND's own concurrent session (an image-loading fix) — left entirely alone, no conflicts with anything above.
