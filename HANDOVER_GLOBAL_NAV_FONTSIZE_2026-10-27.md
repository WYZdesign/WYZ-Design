# Global nav font-size cascade fix + full-site audit, 2026-10-27 (Claude)

Followed up on "do whatever else is left": reviewed every handover doc in the
repo against the actual commit history and live site (all accounted for,
details below), then ran a fresh combined overflow/clipping/type-mismatch
sweep across ~20 representative live pages at 390px to look for anything
still missed.

## Handover review

All 13 `HANDOVER_*.md` files in the repo root were checked against
`HANDOVER_TASK_DIVVY_2026-10-10.md`'s progress log and, where needed,
directly against the current code:

- 11 of 13 are explicitly cross-referenced by filename in the task log with
  a commit SHA and a "DEPLOY IS LIVE" confirmation.
- The 2 that weren't named in the log (`HANDOVER_AUDIT_2026-10-18` and
  `HANDOVER_PHOTOGRAPHY_PORTFOLIO_2026-10-18`) were verified directly: the
  "90+ models" copy and the dead `gdrive-photos` fetch removal are both in
  commit `226de1f`, and the narrowed CSP host is live in `next.config.ts`
  right now. Fully resolved, just not name-checked in the log.
- One previously-open item (`HANDOVER_GALLERY_DEPTH_AUDIT_2026-10-19`: model
  galleries were "a flat 6 each, target 25-30/album") is now also resolved —
  checked `model-galleries.json` directly: 91 models, averaging 26.6 images
  each, min 8, max 28.

Nothing stale or contradicted found. (I also reported this same review back
to Torree in chat already — this section is just the written record.)

## New bug found and fixed: a global, non-mobile-scoped version of the same cascade bug

While sweeping the live site, found that every nav link and button site-wide
was rendering 1-3px larger than its own Tailwind class says, on every
viewport (not just mobile):

- `Navbar.tsx`'s primary nav links are styled `text-[14px]` but compute
  `15px`.
- The blog's "Prev"/"Next" pagination buttons are styled `text-[12px]` but
  compute `15px`.

Root cause: `src/app/globals.css` had one more instance of the exact bug
this whole engagement has been chasing — `nav a, nav button { letter-spacing:
0.18em; font-size: 15px; }`, sitting at the top of the file with **no media
query**, bare and non-`!important`. The last several passes fixed every
un-layered rule *inside* the mobile `@media (max-width: 767px)` blocks, but
this one applies at every screen size and isn't inside any of those blocks,
so it was missed by greps that specifically targeted the mobile sections.
Being un-layered, it out-ranks every component's own `text-[Npx]` class on
any `<a>`/`<button>` inside a `<nav>`, at any width, same mechanism as
before.

**Fix:** wrapped it in `@layer base`, same proven technique used four times
already in this file. `letter-spacing` stays as a shared default either way
(nobody's complained about that); only `font-size` needed to stop
overriding component classes.

## Full-site sweep: ~20 pages at 390px, nothing else found

Ran the combined overflow + internal-clip + `text-[Npx]`-vs-computed-size
check across: `/`, `/3pointprogram`, `/blog`, `/about` (also reached via the
now-permanent `/brands`, `/nomadic-breed`, `/dying-breed-crew`, `/fd`
redirects — confirmed these are intentional 308s to `/about` in
`next.config.ts`, not stale pages), `/designs/artfinix`, `/legal/privacy`,
`/loyalty`, `/contact` (also reached via `/partnerships`), `/status`,
`/featured-artist`, `/loyalty` (also reached via `/gift-card`), `/community`,
`/wyzmind`, `/merch`, `/services` (also reached via `/plans`), `/printing`,
`/faq`, `/photography`, `/booking`, `/designs/gallery`,
`/model-archive/gallery`, `/events`.

Only the nav bug above turned up. One false-positive worth noting for next
time: `/services`' service-card `h3` flagged as "26px intended, 28px
actual" — that's not a bug, it's `text-[1.75rem] sm:text-[26px]
md:text-[45px]`, and 390px is below Tailwind's `sm:` (640px) breakpoint, so
the base `1.75rem` (28px) is correctly what's active. Tightened the audit
script's regex afterward to stop matching `sm:`/`md:` variant class names as
if they were the base class.

## Verification

- `postcss.parse()` on the full `globals.css` (with it currently stands,
  including the unrelated in-progress design-tokens work already sitting in
  the file) — valid, no errors.
- `git diff --ignore-all-space -- src/app/globals.css` — clean, isolated,
  additive change; confirmed it doesn't touch or conflict with whatever
  design-tokens/CSS-variables refactor is currently uncommitted in this same
  file (that's not mine, left untouched, syntax still validates fine on top
  of it).
- Same disclosed limitation as every prior CSS-layers fix this engagement:
  this bridged environment can't run a real `next build`/lightningcss
  compile, so this is syntax-validity + manual cascade reasoning + the
  now five-times-proven precedent of this exact technique in this exact
  file — not an actual rendered build. Worth a quick visual check once
  deployed: any page's primary nav link should measure 14px, not 15px.

## Bottom line

This closes out the architectural cascade-layers issue completely — every
un-layered, non-`!important`, tag-selector rule in `globals.css` that was
silently overriding component-level Tailwind sizing has now been found and
wrapped (five total, across five separate passes). The broad 390px sweep
otherwise came back clean across every representative page checked.
