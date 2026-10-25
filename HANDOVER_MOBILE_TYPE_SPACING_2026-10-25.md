# Mobile type-scale + spacing pass, 2026-10-25 (Claude)

Torree's feedback: content/design are loved, but on narrow phones (iPhone 13,
390px) everything feels too cramped, titles and body text feel mismatched in
size, and paragraph width/padding feels off. Asked me to "redo everything
from scratch" on this specifically. This round is the first concrete fix
toward that, built from a real root-cause finding rather than guesswork.

## The actual mechanism behind the complaint

While investigating, I found `globals.css` has **two separate layers of
forced mobile typography**, stacked on top of each other, both using
`!important`:

1. A big "MOBILE (< 768px) — iPhone 13 optimized" block (~line 150) that
   forces every `h1`/`h2`/`h3`/`h4` to specific sizes, meant to protect
   page-hero titles from overflowing at narrow widths.
2. A second, later "MOBILE UNIFORM TYPE STACK" block (~line 1185) that
   *also* forces every `h1`–`h6` (and every `<p>`) to its own sizes and
   margins, on top of the first block.

Because `!important` always wins over a normal (non-`!important`) rule
regardless of layer or specificity, neither block could ever be overridden
by a component's own intentional sizing — e.g. `/web-design`'s capability
cards ("Fully Responsive", "SEO Optimized", "Lightning Fast") deliberately
size their `h3` at 15px and `p` at 13px for a compact card look, but on
mobile those got silently forced up to ~20.7px and ~15px instead — a card
heading nearly as large as a page subheading, sitting right on top of body
copy barely smaller than itself. That's exactly "titles vs. body text feel
mismatched." The same two blocks also force `margin-bottom: 0.5rem` (8px)
on every heading regardless of what a component asked for (e.g. `mb-3` =
12px), which is part of what reads as "too cramped."

I confirmed this by live-measuring the rendered card at 390px width,
enumerating every CSS rule that matches that `h3` for `font-size`, and
tracing the winning one back to its exact line in `globals.css` — the
clamp() value it produced (20.74px) matched the live computed size exactly.

## What changed

**`src/app/globals.css`** — two things, both metadata-only (no new
selectors, no new values removed, just where `!important` sits):

1. The first "safety-net" block: removed `!important` from `h3`/`h4`
   `font-size` only. Kept `h1`/`h2` font-size forced (that's the part
   actually needed to keep long page-hero titles from overflowing — proven
   necessary earlier in this engagement) and kept every other property on
   `h3`/`h4` forced too (`max-width`, `overflow-wrap`, `word-break` — those
   are overflow-safety, not a sizing choice).
2. The second "uniform type stack" block: removed `!important` from all of
   `h1`–`h6` `font-size`, the shared `margin-top`/`margin-bottom` pair, and
   `p { font-size }`. Left `line-height`/`text-align` and the paragraph's
   `max-width`/`margin-left`/`margin-right` forced (centering/measure, not
   something anyone's complained about).

Net effect: both blocks still provide sensible default sizes/spacing for
any heading or paragraph that doesn't set its own Tailwind size/margin
class — nothing double-styled suddenly goes unstyled. But any component
that *does* set its own `text-[Npx]` or `mb-N`, like the web-design cards,
now actually gets it, because normal cascade-layer rules (`utilities` beats
`base`) finally apply instead of being steamrolled by a blanket
`!important`.

**`src/app/web-design/page.tsx`** — the CAPABILITIES card component itself
(the concrete example used to diagnose the above):
- `p-10` (flat 40px on every side, every viewport) → `p-6 sm:p-8 lg:p-10`,
  so the card's inner padding scales down at narrow widths instead of
  eating a disproportionate share of a 342px-wide card.
- Title's `mb-3` → `mb-2.5` (very slightly tighter title-to-body gap, now
  that the title itself will render at its intended 15px instead of ~21px,
  so the gap no longer needs to visually fight an oversized heading).
- Added `max-w-[22rem] mx-auto` to the paragraph so its measure stays
  proportionate to the card rather than always stretching to the card's
  full inner width.

**`src/app/home/page.tsx`** — found the identical pattern on the home
page's "WHAT WE DO" services grid (same card shape: `text-[15px]` h3,
`text-[13px]` p, flat non-responsive padding) while sweeping for more
instances of the same bug:
- `p-8` (flat 32px on every side) → `p-6 sm:p-7 lg:p-8`.
- Added `max-w-[22rem] mx-auto` to the paragraph, same reasoning as above.
- Left the title's `mb-4` alone here — that one was already generous
  enough once the heading stops being inflated by the cascade fix.

## Why this is the right first move, not the whole job

This fix removes the thing that was *fighting* every component's own
sizing choices. It doesn't change any component's chosen sizes — those
were already designed deliberately (hence "I love all content and
design"). Once this is live, the real per-page sizing/spacing choices that
are already in the codebase should finally render as intended on mobile
instead of being overridden. That should visibly help the "titles vs. body
mismatched" and "too cramped" complaints broadly, not just on this one
card — but it's worth a real visual pass once deployed to see what (if
anything) still needs adjusting now that components are getting their own
numbers back. "Redo everything from scratch" is a big, open-ended ask; this
round fixes the systemic cause first since guessing at dozens of individual
spacing tweaks on top of a cascade bug that was overriding them anyway
would have been wasted effort.

## Verification

- `postcss.parse()` on the full `globals.css` — valid, no errors.
- `npx tsc --noEmit` — clean.
- `npx eslint src/app/web-design/page.tsx --max-warnings 999` — clean.
- `git diff --stat` — exactly the three files above touched, nothing else.
- Same disclosed limitation as prior rounds: this bridged environment can't
  run a real `next build`/Tailwind compile (native `lightningcss`/SWC
  binaries are Windows-only in this `node_modules`), so this is verified by
  syntax validity + manual cascade reasoning + the proven precedent of the
  one block in this file that already used this exact technique
  successfully — not by an actual rendered build. Worth a real screenshot
  check on `/web-design` once deployed, specifically the three capability
  cards at narrow width, to confirm the h3/p now render at their intended
  15px/13px and the card paddings look right.

## Next steps toward "redo everything from scratch"

This was step one (the systemic unblock). Still to do, once this is live
and can be visually confirmed: sweep other pages' card/section components
for the same two symptoms — (a) a heading or paragraph whose rendered size
doesn't match its Tailwind class at mobile widths (now should be mostly
fixed, worth spot-checking a few more pages to be sure), and (b) flat,
non-responsive padding utilities (`p-10`, `p-12`, etc.) on narrow-screen
cards that could use the same `p-6 sm:p-8 lg:p-10`-style scale-down treatment
applied here.
