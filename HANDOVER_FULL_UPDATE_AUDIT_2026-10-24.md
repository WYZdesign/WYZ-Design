# Full update + responsive audit, 2026-10-24 (Claude)

Torree asked for a check of everything added since the last audit, fixes where
needed, and a full visual/structural audit across narrow mobile, regular
mobile, large mobile, and desktop. No commit made (standing protocol) — this
round found nothing left to fix on disk; everything it flagged was already
either fine or already fixed independently.

## 1. What's new since the last audit (0920519..HEAD)

Reviewed the full diff: the adaptive multi-step `DynamicForm`/`ServiceForm`
booking forms now live on `/services`, `/printing`, `/photography`,
`/web-design` and `/events`; a private intake file-upload bucket backing
those forms' file field; a merch "Complete the fit" bundle section with a
server-validated 10% multi-item discount (`src/lib/bundles.ts`,
`src/lib/stripe.ts`); a merch size-guide modal; a full-bleed swipeable
lookbook strip on `/merch`; a brand-founding-date correction (all three
brands — WYZ Design, Nomadic Breed, Dying Breed Crew — now consistently
"founded January 2022") touching `about`, `nomadic-breed`,
`dying-breed-crew`, `brands.ts`; and the removal of the dead `/gallery`
route from the previous round.

Confirmed `/web-design`, `/nomadic-breed`, and `/dying-breed-crew` are not
dead code despite each permanently redirecting elsewhere (to `/services` and
`/about` respectively) — their `page.tsx` components are imported directly
into `/services/page.tsx` and `/about/page.tsx` and rendered as that page's
brand/service tab content. Intentional, not a bug.

## 2. Bug found, and its status

**Duplicate checkbox label in `DynamicForm.tsx`.** Every form field renders a
bold uppercase heading-style label above it; correct for text/select/date
fields, but checkbox fields also render their own proper inline label right
next to the box, so the "Keep me updated on new services and promotions"
opt-in was rendering twice — once as a 3-line heading, once as the normal
checkbox label — on the new `/services` booking form. The heading-style
label's `htmlFor` also pointed at an id the checkbox never had, breaking the
accessibility association on top of the visual duplication.

I found and fixed this independently (skip the heading label for
`field.type === "checkbox"`), but by the time I verified it against the
live device, WYZMiND had already shipped the identical fix in commit
`7dde9d5` ("fix duplicated checkbox label"). `git status` is clean — my
local edit matched HEAD exactly, nothing to reconcile. Spot-checked every
form on `/printing`, `/photography`, `/services` for any remaining duplicate
labels (programmatic check, not just visual) — none found; the fix covers
all of them since they share the one component.

## 3. Full responsive audit — 320 / 390 / 430 / 1440

Ran a structural overflow check (any element whose right edge exceeds the
viewport and isn't safely contained by a scrollable ancestor) across
`/services`, `/merch`, `/about`, `/brands`, `/events`, `/printing`,
`/photography`, `/web-design`, `/dying-breed-crew`, `/nomadic-breed`,
`/community`, `/model-archive`, `/status` at all four widths (320, 390, 430,
1440). **Zero overflow found anywhere at any width.**

Also specifically re-verified, live, that every fix from the last two audit
rounds is still correctly in place and rendering: the four flip-card
`overflow-y-auto` back faces (still present, 6 instances sitewide), the
`/plans` SUBSCRIBE button padding, and the `/model-archive` + `/status` page
titles (both now measured well within their viewport at 320px — "M O D E L .
A R C H I V E" right edge at 243px of 320, "S Y S T E M . S T A T U S" right
edge at 266px of 320).

Manually walked the `/merch` page's three new surfaces:
- **Size guide modal**: opens correctly, fits fully within a 320px viewport
  with proper margins, its size table has its own `overflow-x:auto` safety
  net even though the table itself (240px) comfortably fits its 288px
  wrapper. Escape-to-close and the × button both work.
- **"Top + Cap" bundle card**: price math is correct — $52.01 is exactly
  $29.16 (hoodie) + $22.85 (cap), matching the card's own disclosure that
  the sum shown is pre-discount and the 10% comes off at checkout.
- **Lookbook strip**: swipeable, full-bleed, no awkward image cropping,
  progress indicator present.

Walked the new `DynamicForm` multi-step booking flow on `/services`
end-to-end (Full Name/Email/Phone/Social → service checkboxes → Plan
Type/Start Date/Additional Info → the now-fixed opt-in checkbox) at 320px —
every step's fields, labels, and Back/Next buttons render cleanly with no
clipping.

## 4. Standing architectural flag (carried over, not fixed)

Still unresolved from last round, still confirmed present: `globals.css` has
a large hand-written `@media (max-width: 767px) { ... }` block of plain
(non-`@layer`) CSS that, under Tailwind v4's cascade-layers architecture,
silently wins over *any* Tailwind utility class at narrow widths regardless
of that utility's specificity — because un-layered rules always beat
layered rules by spec, full stop. This is why `/community`'s "PROGRAMS"
stat label computes at 15px instead of its intended `text-[9px]`/9px (traced
and confirmed via the CSS Layer mechanics this round — raw stylesheet text
does contain the `.text-\[9px\]` rule, it's just permanently outranked).
It's cosmetically tight in that one spot but **not actually clipping or
overflowing** anything I could find — I'm not flagging new instances this
round, just reiterating that this is the root cause behind why isolated,
one-off `!important` patches keep being necessary, and it would be worth a
dedicated pass (wrapping that whole mobile block in its own high-priority
`@layer`, then a full visual re-pass) rather than chasing it page by page.
Did not touch it — too large a blast radius to risk without a live preview
environment.

## 5. Tooling note

The Browser pane's screenshot capability was unavailable for most of this
session ("pane is displayed but its window is covered or not painting") —
likely the desktop app was minimized on your end. I fell back to
JavaScript-based DOM/CSSOM inspection (bounding-rect overflow checks,
computed-style measurements, live price-math verification) for everything
in section 3, which is more exact than eyeballing a screenshot for overflow
specifically, but doesn't catch purely visual issues (color contrast,
subtle misalignment, broken images) the way a screenshot would. Worth a
quick visual pass next time the pane is actually visible, though nothing in
this round's structural audit suggests there's anything to find.

## 6. Bottom line

Nothing new needed fixing on disk this round. The one real bug found
(duplicate checkbox label) is already shipped. Every previous round's fix
is confirmed live and correct. The site is clean across 320/390/430/1440 on
every page checked.
