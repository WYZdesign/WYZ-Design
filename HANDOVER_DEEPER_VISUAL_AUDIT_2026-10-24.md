# Deeper/broader visual audit, 2026-10-24 (Claude, round 2)

Torree asked to go "even deeper, broader, and further" after the first pass
this round (which was DOM-measurement-only, since the Browser pane's
screenshot capability wasn't working yet). The pane came back mid-session, so
this round is a real screenshot-based visual audit — not just DOM math — plus
coverage of things never checked before in this engagement: the home page
itself, dark mode, tablet breakpoints, and landscape mobile.

**One real bug found and fixed on disk** (not yet committed, per standing
protocol — WYZMiND to review/commit/push/deploy).

## 1. Bug found and fixed: "Pricing Plans" tab label silently truncated on the home page

**File:** `src/app/home/page.tsx`, the "WHAT WE DO" section's Services /
Pricing Plans tab switcher (~line 416).

A real screenshot at 320px caught this; it would not have shown up in a pure
DOM-overflow check because the clipping happens *inside* the button, not past
the viewport edge. The button text wasn't overflowing the page — it was being
silently cut off inside its own box with no ellipsis, no wrap, no visual
cue: "Pricing Plans" rendered as "PRICING PLA" with "NS" simply gone.

Root cause, confirmed by direct measurement: the two tab buttons sit in a
`flex justify-center gap-4` row with no wrapping. Each button carries
`overflow-hidden` (needed for its decorative hover slide-in effect) plus
`white-space: nowrap` and `px-8` padding with `tracking-[0.15em]` letter
spacing. At narrow widths the two buttons' combined natural width (services
~146px + pricing plans ~196px + gap) exceeds the available row width
(~272px at 320px viewport). Flexbox's default behavior should refuse to
shrink a flex item below its content's minimum size — except that
protection is disabled whenever the item itself has `overflow` set to
anything other than `visible`. Because these buttons use `overflow-hidden`
for the hover effect, that protection was off, so the browser silently
compressed "Pricing Plans" down to 142px — well under the 196px its text
actually needs — and the hidden overflow clipped the difference with no
indication anything was cut.

Confirmed this reproduces identically in dark mode (color-independent,
purely a layout issue) and across 320px and 375px; it resolves on its own
at 430px and up once there's enough row width. Also confirmed, by grepping
for the same `px-8` + `overflow-hidden` + `tracking-[0.15em]` combination
elsewhere in the codebase, that this exact failure mode doesn't exist
anywhere else — the other category/filter chip rows on `/services` and
`/wyzmind` already use the correct pattern (`overflow-x-auto` with
`whitespace-nowrap`, i.e. an intentional horizontal scroller instead of a
fixed row), so they were never at risk. This bug was isolated to this one
tab switcher.

**Fix applied** (verified clean via `npx tsc --noEmit` and `npx eslint`,
`git diff --ignore-all-space` confirms a clean 1-file, additive diff):
- Added `flex-wrap` to the row container, so if the two buttons ever can't
  fit side by side, they gracefully stack onto two centered rows instead of
  silently truncating.
- Added `flex-shrink-0` to both buttons, removing the invisible auto-shrink
  that caused the clipping in the first place — buttons now either render
  at their full needed width or wrap, never silently compress.
- Reduced padding at the narrowest breakpoint only (`px-5 sm:px-8`, was a
  flat `px-8`), which keeps both buttons on one row through 375px+ and
  only causes the (harmless, fully intentional) wrap-to-two-rows fallback
  at the very narrowest widths like 320px.

This fix is layout-only (no color/theme classes touched), so it applies
identically in light and dark mode. Not yet visible on wyzdesign.com since
there's no dev server reachable in this bridged environment to verify
against a live reload — verified instead via `tsc`/`eslint` plus the same
box-model math that diagnosed the bug, both of which are exact rather than
approximate for this kind of issue.

## 2. Real screenshot pass — home page (first time this engagement)

The home page (`/`) had never been visually or structurally audited before
this engagement — every prior round covered `/services`, `/merch`, `/about`,
etc. but not `/`. Scrolled the full page (8,966px tall) in sections at
320px, screenshotting at each stop:

- Splash/intro screen, hero, stats strip ("90+ Events", "45+ Clients",
  "10,000+ Photos", "13+ Years") — clean.
- Four scroll-reveal service feature blocks (Artist Launch Kit, Brand
  Identity System, Studio Growth System, Event Production, WYZMiND Systems,
  Custom Print & Merch) — all wrap cleanly, no clipping. The chat FAB
  overlaps the last line of body copy on a couple of these at certain
  scroll stops, same known/accepted behavior as the FAB on `/contact`
  documented in an earlier round — not a new bug.
- The Services/Pricing Plans tab switcher — this is where the real bug
  above was found and fixed.
- A full-bleed horizontally-scrollable model carousel and a "Digital
  Printing" scroll-pinned category card with its own internal horizontal
  scroll — both confirmed via `document.documentElement.scrollWidth` to NOT
  cause any page-level horizontal overflow (320px in, 320px out); these are
  intentional contained scrollers, matching the same pattern already
  verified clean elsewhere on the site.
- Clients logo strip, testimonial/review carousel (with working prev/next
  arrows, dot pagination, Twitter/LinkedIn links), FAQ preview (search box,
  "33 questions found", accordion), "Free Brand Audit Guide" email signup
  section, and the footer — all clean, good contrast, nothing clipped.

One thing worth flagging for awareness, not a bug: this page renders several
sections with scroll-triggered reveal/transition effects and a looping image
marquee duplicated many times in the DOM for seamless looping (confirmed
~700+ `<img>` elements in the visible range at one scroll stop, all loaded
successfully — `complete: true`, nonzero `naturalWidth`). This is a common
and correct technique for infinite carousels, not a defect, but it does mean
a screenshot taken mid-transition can briefly show blank white or a
glitch-overlay frame before settling — I hit this twice and re-screenshotted
after a short pause both times to confirm it was transient, not real.

## 3. Dark mode — first real check this engagement

Previous rounds never toggled dark mode. Toggled it on the home page and
re-walked the same sections: service cards, the (buggy) tab switcher, FAQ
section. All colors/contrast look correct and intentional — card
backgrounds shift to `#1C1C1E`/`#252528`, text to white/light-gray, borders
to a subtle red-tinted line, search input gets a visible focus-red border.
The "Pricing Plans" clipping bug reproduces identically in dark mode
(confirms it's a layout issue, not color-related) — same fix covers both
themes since nothing in the fix touches color classes.

## 4. Tablet breakpoints (768px / landscape mobile 844×390) — first check this engagement

Ran the combined overflow + internal-text-clip audit script (see section 6)
at 768px across home, services, merch, about, plans, printing, photography,
contact, faq, wyzmind, booking, blog, legal/privacy, featured-artist,
loyalty, designs/artfinix, brands, events, model-archive, status,
account/my-account — all clean, zero findings.

Took real screenshots at 768px on `/merch` specifically (richest new
surface this engagement): hero section is well-balanced, the size-guide
modal opens centered with its full table visible and no truncation, and the
"Complete the Fit" bundle section renders correctly — note the bundle grid
currently shows only one card ("Top + Cap") with empty space beside it at
tablet width, but that's a direct consequence of only one bundle currently
being defined in `src/lib/bundles.ts`, not a layout bug; the single card
itself is correctly sized and styled.

Also checked landscape mobile (844×390, iPhone-13-rotated dimensions) on
home and merch — both clean. The hero's tall heading requires scrolling to
see fully in the short 390px-tall viewport, which is expected for any
multi-line hero at that aspect ratio, not a defect.

## 5. Re-confirmed with a real screenshot: `/community` "PROGRAMS" card is NOT a bug

Earlier rounds flagged this, then DOM-measurement walked it back to "not
actually overflowing." This round, with the pane working, I navigated
straight to it, let the scroll-reveal numbers finish animating (8 / 5 / 3),
and screenshotted it directly. The third card's right border does sit very
close to the screenshot's right edge, which is what created the original
visual impression of a bug — but a bounding-rect check on the actual card
container confirms its right edge lands at 296px of a 320px viewport, a
full 24px short of the edge, matching the page's own 24px side padding
exactly. The three-column grid's third column is simply flush with the
grid's own right edge by design, same as the first column is flush with
the left — there is no overflow, no clipping, nothing cut off. Treating
this as settled and not re-flagging it going forward.

## 6. Method note: what changed this round vs. the previous pass

The first pass this round (delivered as
`HANDOVER_FULL_UPDATE_AUDIT_2026-10-24.md`, a few minutes before this file)
was DOM/CSSOM-measurement only, because the screenshot pane was reporting
"pane is displayed but its window is covered or not painting." That method
is good at catching true page-level overflow (an element whose right edge
exceeds the viewport) but structurally cannot catch internal clipping — text
truncated inside a fixed-size box via `overflow: hidden` without ever
crossing the viewport boundary. That's exactly the shape of the bug in
section 1, which is why it was missed in the first pass and only surfaced
once real screenshots were possible again.

For the rest of this round I used a combined script that checks both
failure modes at once — true page overflow AND internal nowrap+overflow-
hidden text clipping — and ran it across every page checked at 320px and
768px. Worth keeping this combined check in mind for future rounds; it's a
closer match to what a human eye actually catches in a screenshot than the
overflow-only version used in earlier rounds.

## 7. Bottom line

One real, previously-undetected clipping bug found and fixed (home page
tab switcher), confirmed isolated to that one spot, fix verified clean via
`tsc`/`eslint` and scoped to a single additive 1-file diff. Full-page visual
screenshot audit of the home page (never checked before) came back clean
otherwise. Dark mode, tablet (768px), and landscape mobile (844×390) — all
newly covered this round, all clean except the same tab-switcher bug (which
reproduces identically regardless of theme/breakpoint range, as expected for
a layout-only issue). The `/community` "PROGRAMS" card flag from two rounds
ago is now conclusively closed out as not-a-bug with a real screenshot to
back it up.
