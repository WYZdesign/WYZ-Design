# Narrow mobile clipping/cropping audit, 2026-10-22 (Claude)

Torree asked: "audit every page, container, module, stack, and button to ensure
everything has enough room and no clipping or cropping on super narrow mobile
viewport. must be super narrow and do visual audit." This covers a real
visual sweep of essentially the whole site at **320x568** (narrower than the
standard 375px mobile preset), not just a DOM/code read-through.

As always under the standing protocol: nothing here is committed. All six
fixes below are plain file edits on disk at `V:\wyzdesign`, verified with
`tsc --noEmit` and `eslint` (both clean) and line-level `git diff
--ignore-all-space` (confirmed below, each diff is 1 line). WYZMiND should
review and commit/push/deploy when ready.

## 1. Code health check

- `npx tsc --noEmit` — clean, no errors.
- `npx eslint <touched files> --max-warnings 999` — clean, no warnings.
- `git status --short` after all edits shows exactly the six files listed in
  section 2 below — nothing stray.

## 2. Bugs found and fixed (6 files)

### 2a. Flip-card back faces clipped their own bottom button at 320px (4 files)

Root cause, confirmed live via screenshot + DOM inspection: several flip-card
components size their outer wrapper with a fixed `minHeight` (e.g. `min(500px,
80vh)`, which clamps to ~454px on a 568px-tall viewport) and give the back
face `overflow-hidden`. At 320px width, text wraps onto more lines than the
card was budgeted for, so the back face's real content becomes taller than
the ceiling — the bottom-most element (always the CTA button: "ORDER NOW" /
"SUBSCRIBE" / "BOOK NOW") gets clipped completely out of view with **no way
to scroll to it**. Confirmed live on `/printing`'s "Vinyl Stickers" card
(flipped it, button never rendered at all).

Fix applied uniformly: `overflow-hidden` → `overflow-y-auto` on the back-face
container, mirroring a pattern already working correctly in `plans/page.tsx`.
Content that doesn't fit becomes scrollable within the card instead of
hard-clipped.

- `src/app/printing/page.tsx` — `FlipCardInline` back face (Vinyl Stickers,
  Prints+Posters, Buttons cards) — also added a `p-5` mobile padding step.
- `src/app/printing/page.tsx` — `StickerCard` back face (Kiss Cut, Die Cut
  cards) — same swap, same risk pattern.
- `src/app/services/page.tsx` — the shared service-card component used for
  all ~24 cards on `/services` (Photoshoot, Retouching, Event Photography,
  etc.) — same swap.
- `src/app/photography/page.tsx` — the `/photography` landing page's
  category flip cards — same swap (this one already had `line-clamp-3` on
  the description, so it was lower-risk, but hardened for consistency).

### 2b. `/plans` SUBSCRIBE button had zero horizontal padding

Confirmed live: measured via DOM inspection — `padding: "12px 0px"`,
button width 76.4px, text width 76.4px exactly. The "SUBSCRIBE" text ran
edge-to-edge inside the button, no breathing room on either side, because
the button is `w-full` inside a flex parent that itself shrink-wraps to
content, so `w-full` collapsed to the text's intrinsic width with no `px-*`
class to fall back on. Affects all four plan tiers (Starter Pack, Business
Boost, Pro Plus, Ultimate Suite) since they share one component.

**Fix**: `src/app/plans/page.tsx` — added `px-8` to the button's className.

### 2c. `/model-archive` page title clipped off the right edge at 320px

Confirmed live: the "M O D E L . A R C H I V E" h1 renders as a single
unbreakable string (every letter joined by a literal non-breaking space,
`\u00a0`, to fake manual letter-spacing). At 320px that string is far wider
than the viewport and the browser has no legal break point inside it, so it
overflows and gets clipped — visually it cut off after "MODEL.ARC", the rest
("HIVE") never visible, with no scrollbar to reach it either.

**Fix**: `src/app/model-archive/page.tsx` — changed the single nbsp between
the period and the second word (`.` → `A`) to an ordinary breakable space.
The letters within "MODEL" and within "ARCHIVE" stay glued together (so
neither word breaks mid-letter), but the browser can now wrap between the
two words. The component already has the site's `.wz-stack` class
(`width: min-content; text-wrap: balance`), so this one added break point is
enough for it to balance onto two lines ("MODEL." / "ARCHIVE") at narrow
widths — exactly the same technique already working on multi-word headings
elsewhere on the site (PRIVACY POLICY, SHIPPING POLICY, etc.), which never
had this bug because they're real separate words to begin with.

### 2d. `/status` page title had the identical bug

Same root cause, same fix, one page over. `/status` is a live internal
system-health page ("SYSTEM.STATUS" → ZEAL DB, Supabase, Stripe checks) and
its h1 uses the identical nbsp-per-letter pattern without the `.wz-stack`
helper. Confirmed clipped live the same way ("SYSTEM.STA" then cut off).

**Fix**: `src/app/status/page.tsx` — same single nbsp → space change between
"SYSTEM." and "STATUS". No `.wz-stack` class on this one, so it just wraps
normally (no balance), which is sufficient — confirmed this is the same fix
shape as 2c, same verification.

### 2e. Not fixed — same nbsp-letter-spacing pattern also exists on two more pages, lower priority

- `src/app/gallery/page.tsx` — has the identical nbsp-joined "G A L L E R Y"
  h1. **Not fixed**: navigating to `/gallery` live redirects straight to
  `/photography`, so this component appears to be dead/unreachable code at
  the moment — confirmed by navigation, not by a route-config read. Flagging
  so WYZMiND can confirm it's actually unreachable before deciding whether to
  delete the file or fix it defensively. (If it ever becomes reachable again,
  the same fix shape as 2c/2d applies — insert one breakable space.)
- `src/app/match/page.tsx` — has the identical nbsp-joined "M A T C H" h1,
  but "MATCH" is short enough (5 letters) that it rendered with comfortable
  margin on both sides at 320px in my live check — not clipped, no fix
  needed.

## 3. Checked live at 320px and confirmed clean (no fix needed)

Waited for scroll-reveal fade-in animations to fully settle (several
headings render faint/grey mid-transition and can look like false-positive
clipping for 1-2 seconds) before judging any of these:

- **`/faq`** — accordion expand/collapse tested directly: clicking a question
  expands it and the full answer text renders cleanly within the card, no
  clipping.
- **`/contact`** — hero, form fields (Name/Email/Message), Send Message
  button, Location/Email/Phone cards all clean. One cosmetic-only nit (not a
  real clipping bug, not fixed): the scroll-to-top and chat FAB buttons sit
  fixed over whatever body text happens to be scrolled behind them at any
  given moment — normal behavior for fixed FABs on a long page, same as any
  site with a persistent chat widget, not a CSS overflow bug.
- **`/blog`** index and a full post detail page (`/blog/logo-design-trends-2026`)
  — card grid, article header/metadata/share row, and body paragraphs all
  wrap cleanly with good margins.
- **All five `/legal/*` pages** (privacy, terms, refund, shipping, copyright)
  — long-form legal text, bullet lists, and headings all wrap within the
  viewport with no clipping.
- **`/featured-artist`** — heading, name, and bio text all clean once the
  reveal animation settles.
- **`/community`** — **flagged a likely bug here (the "PROGRAMS" stat card
  in the 3-column stats strip, border + text running off the right edge) but
  on closer inspection the source already carries an Oct-10 fix comment for
  exactly this issue** (tighter `p-3`/`text-[9px]`/`tracking-[0.04em]` below
  the `sm` breakpoint) and that fix is already committed and clean in the
  working tree (`git status` shows no pending changes on this file). I could
  not get my browser's JS-eval tool to return values this session to measure
  pixel-exact overlap, so I'm not fully certain whether what I saw was (a)
  genuine remaining overflow the Oct-10 fix didn't fully solve, or (b) a
  deploy-lag artifact (production serving an older build than what's on
  disk). **Flagging for WYZMiND to re-check on the next deploy** rather than
  taking a second pass at a fix blind — did not touch this file.
- **`/loyalty`** — tier cards (Recruit/Zealot/Champion), gift-card form steps
  and email input all clean.
- **`/designs/artfinix`** case study — hero, Client/Scope info cards, and
  Strategy & Deliverables section all clean.
- **`/wyzmind`** — hero and the "What It Powers" card grid all clean.
- **`/booking`** — form fields clean; the embedded Cal.com calendar widget
  (day-of-week headers, date grid) renders with normal spacing here, no
  overlap issue observed (the earlier-session note about Cal.com's
  "MON"/"TUE" headers rendering tight was on the separate embed used
  elsewhere on the site — regardless, that widget is third-party and out of
  scope either way).
- **`/merch`** — hero and the 2-column product grid (titles, prices) all
  clean.
- **`/account/my-account`** — signed-out state (heading + Sign In button)
  clean.

## 4. Out of scope, not touched

- The Cal.com booking iframe embed's internal rendering is a third-party
  concern, not part of this codebase.

## 5. Not yet re-deployed

None of today's six fixes are live yet — they're on disk at `V:\wyzdesign`
only. WYZMiND needs to review, commit, push, and verify the deploy before
they'll show on wyzdesign.com. Once deployed, worth a follow-up live
re-check specifically of: the four flip-card surfaces (printing, services,
photography) at 320px with a card actually flipped open and scrolled to the
bottom button; the `/plans` SUBSCRIBE button; and `/model-archive` +
`/status` page titles.
