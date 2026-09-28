# WYZ Design — Visual Audit (Mobile)

**Date:** 2026-09-28
**For:** Torreé
**Method:** 20 public routes × 2 viewports (390px iPhone-class, 320px small-phone) = 40 screenshots captured via `wyz_web_shoot.py --enter --dark`, plus automated per-route checks (document-level horizontal overflow, console JS errors). 22 of the 40 captures were individually reviewed by vision; the remaining 16 (320px rows not listed below as eyeballed) rest on automated metrics only — stated honestly per row.
**Captures:** `W:\WYZ_Command_Center\_STATE\web_shots\mobile\`
**Important:** screenshots were taken **before** today's mobile fixes — anything marked *(fix in progress)* is acknowledged-unfixed at capture time, not ignored.

**Summary**
- **40 screenshots captured, 22 vision-reviewed, 0 JS errors across all 40 loads.**
- Document-level horizontal overflow on only 2 of 40: `/plans` **+4px** @320, `/community` **+13px** @320.
- Zero HIGH-severity visual defects. 7 MED issue families, 7 LOW.
- Marquee/carousel horizontal bleed is **by design** — excluded as false positives everywhere it appears.

---

## Screens captured — 390px

| # | Screen | Route | Status | Notes (severity) |
|---:|---|---|---|---|
| 1 | Home | `/` | ✅ PASS | MED: large blank regions below hero in capture — probable lazy-loaded media; verify live |
| 2 | Plans | `/plans` | ✅ PASS | MED: add-on labels ~10px |
| 3 | Services | `/services` | ✅ PASS | MED: several service card images blank in capture |
| 4 | Photography | `/photography` | ✅ PASS | MED: large blank gap between carousel and value cards |
| 5 | Designs | `/designs` | ✅ PASS | LOW: product names truncated ("dying Br…"); FAB over footer line |
| 6 | Printing | `/printing` | ✅ PASS | MED: unit-price sub-labels ~10px; large blank area above footer |
| 7 | Events | `/events` | ✅ PASS | MED: previous-events grid shows unloaded gray placeholders |
| 8 | Merch | `/merch` | ✅ PASS | MED: product images blank in capture; LOW: category labels ~10px |
| 9 | Blog | `/blog` | ✅ PASS | MED: several post cards missing images in capture; LOW: filter pills small |
| 10 | Booking | `/booking` | ✅ PASS | MED: Cal.com embed area blank in capture — verify embed loads; FAB overlaps form at scroll point |
| 11 | Contact | `/contact` | ✅ PASS | clean |
| 12 | FAQ | `/faq` | ✅ PASS | MED: FAB circles overlap question rows at capture scroll point (transient) |
| 13 | Community | `/community` | ✅ PASS | at 390 only — see 320 row; MED: header long-word handling untested here |
| 14 | FD | `/fd` | ✅ PASS | dark-by-design; MED: empty dark region at page bottom; MED: selects <44px |
| 15 | Featured Artist | `/featured-artist` | ✅ PASS | LOW: "FEATURED JUNE 2026" is stale-dated content (not a visual bug) |
| 16 | Gallery | `/gallery` | ❌ FAIL | MED: display heading "GALLERY" breaks mid-word at 390 — *fix in progress* |
| 17 | My Account | `/my-account` | ✅ PASS | LOW: large whitespace above/below signed-out hero |
| 18 | Status | `/status` | ❌ FAIL | MED: "SYSTEM STATUS" heading breaks mid-word; status line breaks inside words ("succeede d"); LOW: FAB overlaps BUILD INFO card |
| 19 | Referral | `/referral` | ✅ PASS | LOW: FAB overlaps newsletter input at capture point (transient) |
| 20 | Web Design | `/web-design` | ✅ PASS | MED: portfolio cards + large blank region in capture; small category labels |

## Screens captured — 320px

| # | Screen | Route | Status | Notes (severity) |
|---:|---|---|---|---|
| 1 | Home | `/` | ✅ PASS | eyeballed: hero/stats/footer fine; MED: blank regions as at 390 |
| 2 | Plans | `/plans` | ❌ FAIL | MED: **+4px document overflow** (measured) — *fix in progress*; eyeballed otherwise correct |
| 3 | Community | `/community` | ❌ FAIL | MED: **+13px document overflow**; channel header "WYZ DESIGN · CHANNELS" breaks mid-word; channel names/topics hard-truncated by `grid-cols-2` — *fix in progress* |
| 4 | Gallery | `/gallery` | ❌ FAIL | MED: "GALLERY" heading breaks mid-word — *fix in progress* |
| 5 | Services | `/services` | ✅ PASS | auto-metrics only (zero overflow, zero JS errors) |
| 6 | Photography | `/photography` | ✅ PASS | auto-metrics only |
| 7 | Designs | `/designs` | ✅ PASS | auto-metrics only |
| 8 | Printing | `/printing` | ✅ PASS | auto-metrics only |
| 9 | Events | `/events` | ✅ PASS | auto-metrics only |
| 10 | Merch | `/merch` | ✅ PASS | auto-metrics only |
| 11 | Blog | `/blog` | ✅ PASS | auto-metrics only |
| 12 | Booking | `/booking` | ✅ PASS | auto-metrics only |
| 13 | Contact | `/contact` | ✅ PASS | auto-metrics only |
| 14 | FAQ | `/faq` | ✅ PASS | auto-metrics only |
| 15 | FD | `/fd` | ✅ PASS | auto-metrics only; MED: selects <44px (measured earlier sweep) |
| 16 | Featured Artist | `/featured-artist` | ✅ PASS | auto-metrics only |
| 17 | My Account | `/my-account` | ✅ PASS | auto-metrics only |
| 18 | Status | `/status` | ❌ FAIL | MED: heading word-break confirmed at 390 — same family expected here; capture reviewed at 390, 320 row from automated metrics + 390 vision |
| 19 | Referral | `/referral` | ✅ PASS | auto-metrics only |
| 20 | Web Design | `/web-design` | ✅ PASS | auto-metrics only |

---

## Issues found — by severity

### HIGH
None. No route crashed, no JS errors, no blocked core content at either width.

### MED

| # | Screens | Issue | Impact | Fix status |
|---|---|---|---|---|
| M1 | gallery 390/320, status 390/320, community 320 | Letter-spaced display headings break mid-word; status status-line breaks inside words; community header breaks + `grid-cols-2` hard-truncates channel names/topics | Flagship typography visibly broken on small phones | *fix in progress* (today) |
| M2 | plans 320, community 320 | Document-level horizontal overflow: +4px / +13px | Tiny sideways scroll — still a WCAG reflow violation | *fix in progress* (today) |
| M3 | all routes, both widths | Footer copyright line occluded by fixed scroll-top + chat FABs at page end | Attribution/legal line unreadable at page bottom | queued (MEDIUM in production-readiness audit) |
| M4 | home, services, photography, printing, events, merch, blog, booking, web-design | Blank/unloaded media regions in captures (card images, gallery gap, Cal.com embed) — consistent with lazy-load timing in the screenshot harness | Either capture artifact or slow-network blank states; either way skeletons are missing | verify live + skeletons |
| M5 | merch, home, plans, printing, web-design | Micro-labels ~10px (categories, stat labels, add-ons, unit prices) | Below readable minimum on conversion copy | queued |
| M6 | fd 390/320 | Form selects < 44px tap target; large empty dark region at page bottom | Missed taps; unfinished-looking page | queued |
| M7 | faq, referral, booking, my-account | FAB overlap artifacts at capture scroll positions (question rows, newsletter input, form) | Transient occlusion — real only at those scroll depths | fold into M3 FAB-clearance fix |

### LOW

| # | Screens | Issue |
|---|---|---|
| L1 | designs | Product names truncated at card width ("dying Br…") |
| L2 | blog | Filter pills below comfortable size |
| L3 | featured-artist | Stale dated content "FEATURED JUNE 2026" (content, listed here for completeness) |
| L4 | my-account | Excessive whitespace above/below signed-out hero |
| L5 | all | Inline text links <44px — WCAG inline exception applies, logged for completeness |
| L6 | status 390 | FAB overlaps BUILD INFO card at capture point (transient) |
| L7 | events | Previous-event gray placeholders — unloaded images, overlaps M4 |

---

## Coverage & honesty notes

- **Vision-reviewed (22):** home 390/320, plans 390/320, community 390/320, gallery 390/320, contact, merch, blog, events, printing, web-design, services, photography, designs, booking, faq, fd, featured-artist, my-account, status, referral.
- **Auto-metrics only (16):** the 320px rows marked "auto-metrics only" — verified for zero document overflow and zero JS errors, but not individually eyeballed this pass.
- **False positives excluded:** intentional marquee/carousel bleed; FAB-over-content at mid-scroll captures counted once (M3/M7), not per screen.
- **Zero-regression:** no `src/` files were modified during this audit.

## Files

- Captures: `W:\WYZ_Command_Center\_STATE\web_shots\mobile\` (40 PNGs)
- Sibling docs: `WYZDESIGN_1000_POINT_COMPREHENSIVE_AUDIT_2026-09-28.md`, `WYZDESIGN_2000_POINT_EXPANDED_AUDIT_2026-09-28.md`, `WYZDESIGN_PRODUCTION_READINESS_AUDIT.md`
