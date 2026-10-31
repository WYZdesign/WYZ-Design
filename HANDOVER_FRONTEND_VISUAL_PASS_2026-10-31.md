# Frontend visual/creative pass — 2026-10-31

Torreé gave full creative latitude on this one: audit the public site's visuals, build on top of it, make it more dynamic/immersive, "get creative," stay professional, nothing structural without asking first. Here's what I actually found, what I built, and what I'm flagging instead of just doing.

## The honest headline: this site is already in good shape

Before listing changes, worth saying plainly — I went through the homepage's full source (`src/app/home/page.tsx`) and the shared component library expecting to find a lot of "needs more life" gaps, and mostly didn't. It's already running a real toolkit of custom motion components: `GyroTilt` (device-tilt parallax on the hero), `MagneticElement` (buttons that pull toward the cursor), `TextMaskReveal`/`TextSplit` (staggered text-in animations), `ScrollReveal` (section fade/slide-ins), `EnhancedMarquee`, and touch-friendly auto-scrolling image/logo carousels with proper pause-on-hover and pause-on-interact behavior. The testimonials section already auto-rotates through 5 real Google reviews with manual prev/next and a resume timer. The FAQ has live search. `prefers-reduced-motion` is respected sitewide (checked `globals.css` — it's handled in at least 7 separate places, not bolted on once and forgotten), and there's a working skip-to-content link. That's a genuinely above-average amount of polish for a site this size, and I didn't want to bury that under a long list of nitpicks that would imply otherwise.

So instead of inventing busywork, I looked for real, missing-piece gaps and built two:

## 1. Added: animated count-up on the homepage stat numbers

The "90+ Events Produced / 45+ Clients Served / 10,000+ Photos Delivered / 13+ Years Running" strip right under the hero was static text — just sitting there. Everything else on the page animates into existence; these four numbers were the one spot that didn't. Stat counters are a very standard, well-liked pattern for exactly this kind of trust-signal strip, and it was a genuine gap, not a redundant add.

Built a small new component, `CountUp`, from scratch (no new dependency): it watches for the number scrolling into view, then counts up from 0 to the real value with an eased finish (fast start, settles in — not a robotic linear tick), parses out "+" and comma-formatting automatically so "10,000+" counts up as 0 → 10,000 and lands back on the exact original string, and is a complete no-op (renders the final number immediately, no animation) for anyone with `prefers-reduced-motion` on, matching how the rest of the site already handles that.

**Files:** `src/components/CountUp.tsx` (new), `src/app/home/page.tsx` (wired into the stats strip)

## 2. Added: grayscale-to-color hover on the client logo strip

The scrolling client-logo carousel (Badcubrau, KTM, etc.) already had a nice opacity/scale hover effect, but the logos sit there in full color at rest, which reads a little busy/flat next to everything else that's more intentionally composed. Added the classic agency-site treatment: logos sit in grayscale by default and snap to full color on hover. It's subtle, it's a filter/opacity tween (not movement, so it doesn't fight the reduced-motion crowd), and it's one line of CSS classes — low risk, real payoff.

**File:** `src/components/home/HomeCarousels.tsx` (`LogoCarousel`)

## What I looked at and deliberately left alone

- **Merch product cards** — a couple of long product names (e.g. "Vintage Corduroy Dad Cap") render tight against a 2-line clamp on the grid. I looked at the markup and it's already using `line-clamp-2` correctly; what I saw in a screenshot may just have been the screenshot's own downscaling making two tight lines look like one truncated line. I didn't want to "fix" something that's probably not actually broken, so I'm flagging it rather than touching it — worth you eyeballing the live `/merch` grid yourself at normal zoom, and telling me if a couple of the longer product names really do look cut off.
- **Testimonials, FAQ, carousels** — already well-built, intentionally untouched.

## Ideas I'm asking about instead of just building

Per your "ask first on anything too crazy/critical/different" — these are all real, feasible ideas and none of them touch infrastructure, but they're bigger than a one-file tweak, so I'd rather hear which (if any) you want before spending a round building them:

1. **A genuinely "eccentric" signature touch** — something unexpected and a little playful that still reads professional: a subtle custom cursor on desktop (a small crown glyph that follows the pointer, in place of the default arrow, themed off your logo), or a one-time "confetti"/particle burst the first time someone completes the booking form. Tasteful version of either is very doable; I didn't want to just drop one in without knowing if that's the kind of "unique" you meant or if it'd feel like clutter to you.
2. **Dark/light mode consistency pass** — you've got a working theme toggle (saw it top-right); I didn't audit every page in light mode this round. If you want, next pass I can specifically hunt for light-mode contrast/legibility issues site-wide, which is a different kind of audit than what I did here.
3. **A "recently viewed" or "you might also like" strip on `/merch` product pages** — real e-commerce-feel upgrade, pulls from product data you already have, no new integration needed.

None of these are started. Say the word on any of them (or none) and I'll scope and build just that.

## Verification

- `npx tsc --noEmit` — clean across the whole tree.
- `npx eslint` — clean, run individually on `CountUp.tsx`, `src/app/home/page.tsx`, and `HomeCarousels.tsx` (full-tree and multi-file eslint runs kept timing out at 120s on this box this session; single-file runs are reliable and now the default here).
- Both changes are client-rendered, visual-only additions with no data/API dependency, so there's low risk from the deploy itself — but like the admin-panel layout fix from the last round, I can't see the count-up animation or the hover effect actually fire live until this ships; the site's still on the pre-this-round build as of writing.

## Not done, by design

No git actions (add/commit/push), no infrastructure or dependency changes, nothing removed. Everything above is additive.
