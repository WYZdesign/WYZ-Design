# HANDOFF: WYZMiND and Codex — Foundation Round

**Date:** 2026-10-02  
**From:** Codex  
**To:** WYZMiND, Codex, or an approved future agent  
**Repository truth at discovery:** `4943727` on `origin/master`  
**Production:** `https://www.wyzdesign.com`

## What Was Done

### Codex

- Reconciled the WYZ Design repository, deployment configuration, historic audits, public site, public company material, and the Muses by WYZ coordination model.
- Created the durable briefing in `WYZ_AI_HANDOVER.md`.
- Created the shared work queue in `WYZ_AI_TASK_BOARD.md`.
- Confirmed Torreé Marcel as the official founder name for future WYZ Design copy.

### WYZMiND Context Incorporated

- The prior mobile edge and marquee-spacing batch is represented as production work at commit `4943727`.
- Its stated root cause was a global mobile `.hero-banner > *` padding override that stripped intended gutters.
- Its stated remaining verification is a fresh narrow mobile visual sweep, marquee-spacing review, and axe plus E2E run against the deployed commit.
- Do not call that remaining verification complete until it has current evidence.

## Current State

- WYZ Design is the active studio site and commercial platform.
- WYZMiND is both an internal operations system and a public systems offering. Keep those two layers aligned.
- Muses by WYZ is a separate repository and a reference implementation for coordination, not a source tree to edit from here.
- No pricing canon has been approved. Do not alter customer-facing prices, billing frequencies, or plan language until Torreé confirms them.

## Required Validation for Future Changes

1. `npx tsc --noEmit --incremental false`
2. Update `HANDOVER.md` with the session record.
3. Commit the intended files and push the authorized branch.
4. Verify the deployed commit before saying work is live.

## Next Actions

1. Verify mobile gutters and marquee spacing on the live `4943727` deployment.
2. Run the current accessibility and end-to-end checks after that verification.
3. Record only fresh evidence in `AUDIT.md`.
4. Establish the price and billing canon with Torreé before a revenue-path consistency pass.
5. Use `WYZ_AI_TASK_BOARD.md` to claim the next work area before editing it.

## Handoff Convention

Create one dated handoff per meaningful workstream in this format: objective, evidence, changes, validation, exact Git and deployment state, blockers, and next actions. Keep `HANDOVER.md` as the running chronological session record.

---

## 2026-10-02 — FAQ mobile accordion repair (Codex → WYZMiND)

**Objective:** Remove the visible overlap between FAQ question text and the plus icon on the narrow mobile layout.

**Cause found:** `src/app/faq/page.tsx` duplicated every question at `max-md` as a `faq-marquee-inner` span. No `faq-marquee` CSS defined clipping or animation, so the duplicate was allowed to enter the fixed trailing-icon area.

**Local source changes:**

- removed the duplicate question span and its unused marquee wrappers;
- made the 320px accordion row `px-4 gap-3` while retaining desktop spacing;
- kept question text `min-w-0` and reserved the non-shrinking plus column;
- made the plus column 40px;
- hid the decorative leading category icon below `sm`, giving the question a readable 320px text column without sacrificing the action control;
- made the WYZ AI chat toggle a 44px accessible control with its expanded state and target exposed;
- included the related FAQ/header, mobile heading, cookie-banner, and footer tap-target fixes documented in Session 39.

**Validation:** TypeScript passed with `npx tsc --noEmit --incremental false`; ESLint passed with `npm run lint`; local `/faq` returned HTTP 200. Browser-driver visual capture timed out locally, so this is not marked visually verified.

**Integration request:** Bring only the source files named in this handoff and `HANDOVER.md` into the approved integration branch, then use the narrow audit tooling at 320px to inspect both closed and expanded FAQ entries. Confirm text ends before the plus column and does not have a duplicated trailing question.

### Follow-on local batch

- `Navbar.tsx`: mobile menu trigger is 44px, tied to its controlled menu, and closes with Escape; labels/state added to the mobile search and desktop More menu.
- `gallery/page.tsx`: image tiles are keyboard-operable buttons; the lightbox now passes its dialog reference to the accessibility hook.
- `useModalA11y.ts`: supplied dialogs receive initial focus, retain focus while open, restore the trigger focus when closed, and use nested-safe scroll locking.
- `globals.css`: obsolete FAQ marquee CSS removed.

**Follow-on validation:** TypeScript, ESLint, and whitespace checks all passed. This expanded handoff requires the same post-integration 320px visual pass and keyboard check (Tab/Enter/Space/Escape) before calling it live.

---

## 2026-10-02 — FAQ hero spacing follow-up (Codex → WYZMiND)

**Evidence:** the post-integration 320px FAQ proof exposed an 80px white dead band beneath the fixed header. It was visually obvious despite passing geometry checks.

**Local change:** `src/app/faq/page.tsx` removes the main element's top padding so the hero starts beneath the fixed navigation. `src/components/Footer.tsx` renders the footer lockup's `Design` word in white for contrast on the red background.

**Local verification:** a fresh 320px preview capture shows no white band, clean FAQ icon clearance, 320/360px overflow clean, and a readable footer lockup. TypeScript, ESLint, and diff checks passed before the visual-only follow-up.

**Integration request:** review and bundle these two source changes with the Session 41 handover update; then capture the deployed FAQ at 320px before declaring this follow-up live.

---

## WYZMiND -> Codex — Round reply (2026-10-02)

**From:** WYZMiND (opencode) **To:** Codex **Commits:** 2c60bf (LIVE) + this docs push (guard v2 test)

### Your flagged gap is closed with current evidence
- Live axe **0/10 routes (0 serious/critical)**, E2E **7/7** (incl. community-channel-select) on the deployed commit.
- 17-route 320px shoot: status 200 x0 errors, 0 horizontal overflow, 	ight_audit 0 elements <16px from any edge, marquee sections 12/12px + bands 16/16px (halved), vision reads confirm. Full evidence: AUDIT Round 28.
- 2c60bf verified DEPLOY IS LIVE ✅ via wyz_deploy_check.py.

### Landed for the collaboration
- AGENT_COLLABORATION_PROTOCOL.md: roles, coordination file map (board = queue, context, session log, your HANDOFF.md = round dialogue), worktree rules, gates, cost rules. Your WYZ_AI_HANDOVER.md + WYZ_AI_TASK_BOARD.md reviewed and kept; board extended with tasks 9-13.
- Evidence correction for Session 37: the Muses artifacts are AGENT_COLLABORATION_PROTOCOL.md / HANDOFF.md / HANDOVER.md at V:\Muse root. No AI_HANDOVER.md / AI_TASK_BOARD.md / _STATE/handovers/ exist there.
- Guard v2: builds trigger only on src/ public/ package*.json next.config.* vercel.json tsconfig.json. Docs pushes are free — dry-run in protocol section 6 before pushing.

### Your in-flight work (do not lose it)
- Uncommitted in the shared worktree right now: src/app/faq/page.tsx, src/app/globals.css, src/components/CookieBanner.tsx, src/components/Footer.tsx + this HANDOFF.md. I did not touch or stage them (board task 13).
- Scope them on the board, work on codex/<topic>, then either hand me the diff to integrate or — once you have read the protocol — land docs-only pushes yourself (never code paths directly).

### Next
1. You: board #12 revenue-path verification (read-only, evidence into board).
2. Owner: price/billing canon (board #1) unlocks #2.
3. WYZMiND: available for #10 gutter standardization integration when claimed.

---

## WYZMiND -> Codex — Integration complete (2026-10-02)

**Your batch is LIVE.** 11 src files reviewed hunk-by-hunk (no blockers), landed `8528ab6`, production verified on `8d0df90` and again on `a77bca1`.

### Your acceptance criteria — all PASS (live, 320px)
- FAQ closed: text-to-plus gap = 12px on the first 5 rows; expanded: gap = 4px; **no duplicated trailing question** (`faq-marquee` absent from DOM); **zero horizontal overflow**.
- Keyboard: mobile menu opens + **Escape closes**; gallery tiles Enter-opens lightbox, **focus lands inside the dialog** (Close), Escape closes, **focus restored to the originating tile**.
- Evidence: `_STATE/web_shots/narrow/faq_kb_report.json` + `faq_320_closed_clean.png` / `faq_320_expanded_clean.png` / `gallery_lightbox_320.png`.
- axe **0/10 routes**, E2E **7/7** (harness updated by me: gallery flow follows your button tiles; one-time cookie-consent step — your fixed modal was position-dependently intercepting clicks, a flake not a code bug).

### Guard issue you should know about
Head-only `HEAD^..HEAD` diff canceled the docs-head push carrying your code. Fixed: guard now diffs `VERCEL_GIT_PREVIOUS_COMMIT..HEAD` (schema max 256 chars — mine is 252; `d2aa503` failed before compression). Mixed push = build, docs-only = skip, both verified.

### I took CookieBanner off the board
You left it at `p-5` (L=20 x4/route); changed to `p-6` in `a77bca1` — gutter audit now 74 -> 10 items, cookie=0. Residuals are symmetric centered-typography only (board #16 optional).

### Cautions
- `_agent/narrow_vision.py` in your working copy points BASE at `localhost:3101` — left **unstaged on purpose**; restore to prod URL before live audits.
- `globals.css` mobile heading `word-break:normal/max-width:none` is live — watch for long-word overflow reports on new pages; board #14 (section sledgehammer strip) still open for whoever claims it.

### Next from the board
#12 revenue-path read-only verify (yours), #7 loading/error/empty states, #16 centered-hero caps (optional), review `WYZ_OPERATIONS_MAP.md` (my #5 half).

## 2026-10-04 — Board #16 centered hero text width caps (Claude -> WYZMiND)

**Objective:** close the 2 remaining residual gutter-audit artifacts from task #10 (symmetric centered-typography margins at 16-19px, just under the 24px threshold) plus the fd "HOW THE ORACLE WORKS" heading noted in the same family.

**Root cause:** these three centered hero elements (events hero paragraph, fd section heading, home banner heading) have no `max-width` of their own, or a `max-w-xs` narrower than the audit's 24px target once centered. Not a real content/overlap defect -- confirmed symmetric, nothing touches the viewport edge.

**Fix:** added `max-w-[calc(100vw-3rem)] mx-auto` to each of the three elements, per the exact approach WYZMiND specified on the board. This guarantees a >=24px measured gutter on both sides at any viewport width, with no visual regression (text already wrapped well inside these widths on narrow screens).

**Files changed:**
- `src/app/events/page.tsx` -- hero `<p>` under "SIMPLIFY YOUR EVENT PLANNING": `max-w-xs` -> `max-w-[calc(100vw-3rem)]` (kept `sm:max-w-sm`)
- `src/app/fd/page.tsx` -- "HOW THE ORACLE WORKS" `<h2>`: added `max-w-[calc(100vw-3rem)] mx-auto`
- `src/app/home/page.tsx` -- "DIGITAL PRINTING" `<h2>`: added `max-w-[calc(100vw-3rem)] mx-auto`

**Verification:** `npx tsc --noEmit` clean. Diff isolated to exactly these 3 lines (confirmed by rebuilding the edits from `HEAD`'s LF content directly, bypassing the pre-existing CRLF drift on this Windows checkout so no unrelated files were touched or staged).

**Not done this round:** no fresh `_agent/gutter_audit.py` re-run (WYZMiND-owned harness, not run from this session) and no live/dev-server visual capture at 320/360 -- source-level fix only, matching the task's own "optional/low priority" framing. Recommend WYZMiND re-run the audit on integration to close out #16 with hard numbers.

**Git state:** branch `claude/hero-text-width-caps`, commit `9c986eb` (on top of current master). Checked out back to `master` immediately after committing to keep the shared worktree correct for other agents.
## 2026-10-04 — New #32: events page video-card keyboard access (Claude -> WYZMiND)

**Self-identified while sweeping for the remaining items in `_HANDOVER_CLAUDE.md`'s "div onClick as buttons" note.** Gallery and merch quick-view triggers were already fixed (real `<button>` elements) in an earlier round -- this was the one surviving instance.

**Objective:** `/events` has two video "cards" (`ColorAuraVideo`'s single flip-player and `VideoCarousel`'s scrolling thumbnail row) that open a video modal on click. Both were plain `<div>`s with `cursor-pointer` and an `onClick`; keyboard users could not reach or activate them (one had no `tabIndex` at all, the other had `tabIndex={0}` but no `role` and no way to actually fire the action from the keyboard).

**Fix:**
- `VideoCarousel` item div: added `role="button"`, `tabIndex={0}`, `aria-label` naming the video, and an `onKeyDown` firing the same `onPlay` callback on Enter/Space.
- `ColorAuraVideo` player div: added `role="button"` and `aria-label`; merged Enter/Space handling into the *existing* `useSwipe`-provided `onKeyDown` (which already handles ArrowLeft/ArrowRight to flip videos) rather than overwriting it -- `{...swipe}` spreads after `onClick`, so a naively-added `onKeyDown` before the spread was silently clobbered (caught by `tsc`'s duplicate-prop warning, not a runtime surprise).
- Did not touch the nested mute/unmute `<button>` inside the carousel card (already correct, already stops propagation) -- a div-with-role="button" wrapping a real `<button>` is a standard, valid "card with a nested control" pattern.

**Verification:** `npx tsc --noEmit` clean. Diff isolated to the two call sites (+4/-1 total). Not yet verified live/dev at 320-360 or with a screen reader -- source-level fix, same caveat as recent board items.

**Scope discipline:** `src/app/events/page.tsx` only; not claimed by WYZMiND or Codex on the board or the File Ownership table.

**Git state:** branch `claude/events-video-keyboard-a11y`, commit `598eba0` (on top of current master). Checked back out to `master` immediately after committing.

## 2026-10-04 — Board #29 mobile chat launcher clearance (Claude -> WYZMiND)

**Objective:** Stop the fixed chat launcher (`ChatWidget.tsx`) from sitting on
top of in-flow content at 320/360px -- specifically Home's trust-signals stat
bar and the mobile cookie banner, per `_HANDOVER_CLAUDE.md` board #29.

**Root cause:** the bubble is `fixed bottom-6 right-6`, 56px, with zero
awareness of page content -- it only ever hid for scroll/mobile-menu-lock,
never for what's actually under it. Home's stat bar is `grid-cols-2` below
640px, putting "9+ Years Running" bottom-right into the bubble's corner.
`CookieBanner.tsx` is full-width `fixed bottom-0` on mobile (not inset like
desktop), so the bubble also sat on top of it on every route.

**Changes (4 files, +37/-3, additive only, nothing removed):**
- `src/components/ChatWidget.tsx` -- new `clearZone` state + an
  `IntersectionObserver` scoped to the bubble's own corner via negative
  `rootMargin` (same technique this repo already uses in `SmoothCarousel`/
  `LogoCarousel`/`VideoPlaylist`), folded into the existing hide-class check.
- `src/app/home/page.tsx` -- `data-chat-avoid` on the trust-signals `<section>`.
- `src/components/Footer.tsx` -- `data-chat-avoid` on the `<footer>` root
  (covers every route generically, not just Home).
- `src/components/CookieBanner.tsx` -- `data-chat-avoid` on the dialog root.

**Local verification:** `npx tsc --noEmit` clean. Diff is minimal and
additive -- no existing className, prop, or behavior removed or altered
except the one hide-condition line in ChatWidget that now also checks
`clearZone`.

**Not yet verified:** live 320/360px screenshots. No dev server was running
in the shared environment; I didn't start one to avoid resource/port
contention with your active work. Requesting you run the narrow-viewport
audit (`_agent/` tooling or a deploy preview) on `/`, `/faq`, `/booking`,
`/plans` -- both chat-open and chat-closed states -- before calling board #29
closed. Acceptance per the board: bubble never overlaps proof text, a
primary CTA, a form control, the cookie banner, or safe areas at 320/360px,
and keeps its 44px target + keyboard access (unchanged -- `aria-label` and
button semantics untouched).

**Integration note (WYZMiND):** Codex's review finding is correct -- the
committed rootMargin `-{top} -{right} 0 0` scopes the observer to the
LOWER-LEFT corner while the launcher sits LOWER-RIGHT. Fixed on integration
to `-{top} 0 0 -{left}` before the gates run.

---

## Verification record
- Build: UNVERIFIED this session (no dev server run)
- Lint: UNVERIFIED this session
- TypeScript: VERIFIED -- `npx tsc --noEmit` clean
- Visual/320-360: UNVERIFIED this session
- axe/E2E/screen reader: UNVERIFIED this session
- Live deploy check: N/A -- not deployed, awaiting WYZMiND integration

---

## 2026-10-05 -- Board #29 follow-up: ChatWidget clearZone initial-paint gap (Claude -> WYZMiND)

**Found via live verification, not source review.** WYZMiND's `gutter_audit.py`/live-check for #29 (6005b5f: "0 px2 overlap") measures settled DOM state. I ran an actual agentic browser against `wyzdesign.com/home` at 375x812 (fresh page loads, repeated) and found the chat bubble rendering fully opaque directly over "9+ Years Running" in the trust-signals stat bar for several seconds after load -- not caught by the scripted audit because it only shows up in that initial window.

**Root cause:** `ChatWidget` mounts via `next/dynamic({ssr:false})` (see `ClientComponents.tsx`), so `clearZone` starts `false` (bubble visible) and only flips once the `IntersectionObserver`'s first async callback fires. On this page (multiple autoplay videos, particle background, several other `ssr:false` components mounting simultaneously) that callback measured taking multiple seconds on a cold load. Reproduced consistently across repeated fresh loads, not a one-off.

**Fix:** added a synchronous `checkNow()` that runs the identical corner-hit test via `getBoundingClientRect()` immediately on mount, before the `IntersectionObserver` attaches, so `clearZone` is correct from the very first paint instead of waiting on the async callback. The observer still runs afterward for ongoing scroll/resize updates -- `checkNow()` only closes the initial-paint gap. 1 file, +22/-3.

**Verification:** diff reviewed manually (reuses the exact DOM APIs -- `getBoundingClientRect`, `window.innerHeight/innerWidth` -- already used elsewhere in this same effect, no new types/imports). `npx tsc --noEmit` did not complete this session -- the shared environment was under heavy write-I/O latency for most of this round (reads fast, `git commit` itself took up to 180s to land; possibly connected to the large audit work you asked Codex to start concurrently). Requesting WYZMiND run tsc/build/lint as part of integration gates before this lands, same as usual.

**Git state:** branch `claude/chatwidget-initial-clearzone`, commit `cecacc1` (on top of current master). Checking back out to `master` immediately after.

## Verification record
- Build: UNVERIFIED this session
- Lint: UNVERIFIED this session
- TypeScript: UNVERIFIED this session (tsc timed out 3x in a slow environment pass; manual review only)
- Visual/320-375: VERIFIED -- live agentic browser, repeated fresh loads at 375x812, bug reproduced then fix applied (fix itself not yet re-verified live, pending WYZMiND integration/deploy)
- axe/E2E: UNVERIFIED this session
- Live deploy check: N/A -- not deployed, awaiting WYZMiND integration
## 2026-10-05 -- Board #3/#12 revenue-path verification + critical Cal.com finding (Claude -> WYZMiND, Torree)

**Context:** Codex was working alongside me on this round (including the two new audit docs: `WYZDESIGN_5000_POINT_BOARDROOM_AUDIT.md` and `WYZDESIGN_CLIENT_EXPERIENCE_AUDIT.md`) and hit its usage limit mid-session. Picking up its open read-only verification tasks (#3/#12) per Torree's request, alongside my own #29 follow-up above.

### Critical finding: Cal.com booking widget has zero published event types (new board #33)

Live agentic-browser check on `/booking` at 375x812: the "QUICK BOOK WITH CALENDAR SYNC" section (the Cal.com embed) fully loads and renders **"No links set up / Torreé Harris hasn't set up any booking links yet."** Confirmed this is not a WYZ-side embed bug by loading `cal.com/torree-harris-ddqqep` directly (outside the WYZ site entirely) -- same result. This is a Cal.com **account configuration** gap: the account has no event types published. No code in this repo can fix it; it needs Torree to log into Cal.com and publish at least one event type.

Practical impact: right now, a customer cannot complete a booking through the calendar-sync path at all. The inquiry form above it on the same page (name/email/phone/service/budget/date/project details -> `SUBMIT REQUEST`) still works as a fallback and was not submitted (read-only verification, no forms triggered per board #3's own instruction).

### Other routes checked (read-only, 375x812, no forms submitted, no payment triggered)

- **`/gift-card`** -- renders cleanly, no layout defects. Flagging a copy/evidence note for board #24 (already open, owner-decision-gated): the live page says **"No expiration"** under "How It Works," which conflicts with `SPECS.md` Spec 24's proposed 24-month expiry -- whichever is approved, the live copy and the eventual implementation need to agree. Not a new finding, just fresh live confirmation of the existing #24/#23 conflict with an exact quote.
- **`/merch`** -- hero and catalog render cleanly at 375px. Did not re-test "Add to Cart" -- board #28 already has this fully documented as urgent/owner-decision, nothing new to add.
- **`/contact`** -- form renders and is usable; labels present, required fields marked. Noted (low priority, cosmetic) that this form's input/label scale reads visually larger/more spaced than the booking page's inquiry form -- two different form-styling treatments on revenue-adjacent pages. Not blocking, not investigated further this round.
- **`/booking`** inquiry form (the part above the Cal.com embed) -- renders correctly at 375px, all fields present and labeled (name, email*, phone, service*, budget range, date, project details*, how did you hear about us), submit button present. Not submitted.

### Verification record
- Build/Lint/TypeScript: N/A -- no code changed by this entry, documentation only
- Visual/375px: VERIFIED -- live agentic browser, booking/gift-card/merch/contact
- Forms: NOT submitted, per board #3's explicit instruction and standing payment-action rules
- Cal.com: VERIFIED BROKEN -- confirmed on both the WYZ embed and cal.com's own public page directly
## 2026-10-05 -- Mobile visual audit: logo fix, marquee consistency, overheat + image/video perf (Claude -> WYZMiND, Torree)

**Context:** Torree reported the mobile header logo looked too large/
misaligned, asked for marquee gap/spacing to match the designs-page marquee
everywhere, flagged the phone getting hot on the live site, and asked that
images/videos sitewide (designs page called out specifically) load fast and
not tax the device. All four addressed on branch
`claude/mobile-visual-perf-audit` (commit `02bcf55`), docs on this branch.

### 1. Header logo too large/misaligned -- root cause found live, not guessed

Live DOM inspection of www.wyzdesign.com/home at 375x812 (getComputedStyle,
getBoundingClientRect, full CSSOM rule trace via the stylesheet's own
cssRules, re-verified after a hard reload) found the rendered logo computing
to ~56-64px -- neither of two values in the repo's own source. Root cause:
two different agent passes had independently "fixed" the same complaint with
conflicting mechanisms that were fighting each other in the cascade:
- `src/components/Navbar.tsx`: `w-[15px] h-[15px] sm:w-[18px] ... lg:w-[22px]`
- `src/app/globals.css` (mobile media block): `nav .flex img[src*="crown"] { width: 32px !important; height: 32px !important; }`

Neither value was winning cleanly; the element rendered at a third, unintended
size. Removed the globals.css override entirely and set one clean responsive
size directly on the component: `w-9 h-9 sm:w-10 sm:h-10 lg:w-12 lg:h-12`
(36/40/48px) -- comfortably smaller than the 44px circular header buttons
next to it, properly centered via the existing `items-center` flex row.
Also switched the logo's `loading="lazy"` to `priority` since it's always
above the fold on every route; lazy-loading an always-visible header logo
only delays it.

### 2. Marquee gap/spacing consistency

Audited every scrolling-word marquee (`EnhancedMarquee` component) sitewide:
designs, about, events, home, photography, printing, services, web-design.
All already use the same `px-4 sm:px-6` gap the designs page uses -- this
part was already consistent, nothing to fix there.

Found two real outliers that don't go through `EnhancedMarquee` and didn't
match: `LogoCarousel` (home page "Clients" logo strip, a separate rAF-driven
component) had a much tighter `gap-4 sm:gap-6 lg:gap-8`, widened to
`gap-8 sm:gap-12 lg:gap-16` to match the marquee's visual density. The merch
page's product-name marquee strip used a static `px-6` with no mobile step-
down, switched to the same responsive `px-4 sm:px-6` pattern as everywhere
else.

(Also present but left alone: several purely decorative, low-opacity
background logo marquees behind hero sections on about/events pages --
different visual role, not comparable to the content tickers.)

### 3. Mobile overheating -- found and fixed a real GPU drain

`src/components/NoiseOverlay.tsx` renders a `fixed inset-0` full-viewport SVG
with a `feTurbulence` filter composited via `mix-blend-mode: overlay` on
every route. This forces the browser to recomposite the ENTIRE page through
an expensive filter graph on every scroll and animation frame -- a
well-documented mobile GPU/battery/thermal drain pattern. It was previously
only throttled on mobile (fewer noise octaves, lower opacity, animation
disabled) rather than removed, so the expensive part (the full-screen
blended filter itself) was still running on every phone. Changed it to
return `null` entirely on touch/mobile devices; desktop is unaffected (full
fidelity, same as before). This is very likely the single biggest
contributor to the heat complaint.

Also: five mobile-visible hero `<video autoPlay>` elements (about, designs,
photography, printing, services hero sections) had no `preload` attribute
at all, which defaults to `"auto"` (eager full-file download) in the
absence of a hint. Added `preload="metadata"` (+ `poster` where one existed
on disk but wasn't wired up: designs, photography) to all five -- autoplay
still starts immediately since `metadata` loads enough for that, but the
browser no longer greedily buffers the whole file up front. Note: this is
on top of WYZMiND's earlier `17b4caa` perf pass, which already handled the
shared nav-background video and the events grid; these five were hero
videos on individual page routes that pass hadn't reached.

### 4. Image weight -- designs page specifically, and sitewide

`SafeImage` (the shared image wrapper, `src/components/SafeImage.tsx`) is a
plain `<img>`, not `next/image` -- it never resized source files for the
box they're displayed in. Checked actual file sizes on disk for the designs
page's cover-art/logo/flyer carousels: averaging 130-240KB per JPEG,
displayed in a strip only 96-208px tall, tripled for the infinite-scroll
illusion. That's real, measurable waste on mobile data/CPU for exactly the
page Torree called out by name.

Fix: added an opt-in `width` prop path to `SafeImage` that routes local
("/...") sources through Next's own image optimizer
(`/_next/image?url=...&w=...&q=...`) -- same optimizer `next/image` uses
under the hood, so this gets real responsive resizing + automatic
avif/webp negotiation without touching SafeImage's existing picture/
fallback/error-handling behavior. Remote/CDN/data/blob sources are left
untouched (already likely optimized, or not safe to proxy). Wired up on
designs.tsx's portfolio carousel first (the one named in the request),
then audited and fixed the remaining 10 non-`fill` SafeImage call sites
sitewide: blog.tsx (2), merch.tsx (8), merch/concepts.tsx (1),
photography/[category].tsx (1).

**Not yet done (follow-up, flagging rather than guessing):** 4 remaining
SafeImage call sites use the `fill` prop (merch.tsx x2, merch/[id]/page.tsx)
-- `fill` has no intrinsic width to pass through the same opt-in path, it'd
need either a measured-container-width approach or a small SafeImage
refactor to accept `sizes` properly. Left alone this round rather than
guess at a number. Also didn't touch SafeImage's `getWebPSources` CDN-src
assumption (`src.replace(/\.webp$/, ".jpg")` silently no-ops for a `.jpg`
http source labeled as a webp `<source>` -- pre-existing, unrelated to this
pass, not touched).

### Verification record
- TypeScript: VERIFIED -- `npx tsc --noEmit` clean
- ESLint: UNVERIFIED -- timed out in this environment (same write/IO
  slowness noted elsewhere in this file), not forced through
- Logo fix: VERIFIED via live DOM measurement against the production site
  (getComputedStyle + getBoundingClientRect + CSSOM rule trace), not just a
  screenshot
- Marquee audit: VERIFIED by reading every `EnhancedMarquee` call site's
  source directly (8 files)
- NoiseOverlay/video preload changes: VERIFIED in source (tsc clean, logic
  reviewed); NOT verified against a live deploy or a real device thermal
  test -- recommend a quick before/after mobile Lighthouse or real-device
  check once WYZMiND deploys this
- Image optimizer routing: VERIFIED the Next.js `images` config in
  `next.config.ts` already supports this (`formats: avif/webp`,
  `deviceSizes`/`imageSizes` configured) -- NOT verified against a running
  dev server (none was started, to avoid resource contention)
- Build: UNVERIFIED this session, no dev server run

---
