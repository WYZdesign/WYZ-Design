# WYZ Design: Open Task Ledger and Ownership Divvy

Date: 2026-10-10
Author: WYZMiND
Purpose: single source of truth for every open task, who owns it, and what is blocked.
Companion files: `WYZ_AI_TASK_BOARD.md` (queue, owned by Codex), `VISUAL_AUDIT_2026-10-10.md` (Claude audit),
`LEGAL_HANDOFF.md` (attorney package).

Agents: **WYZMiND** (me, this session), **Codex**, **Claude**.
Rule: one owner per file at a time. Do not edit a file another agent has uncommitted work in (see Blockers).

---

## 1. Already shipped (do not redo)

| Work | Commit |
|---|---|
| Legal suite rewritten (terms, privacy, refund, shipping, copyright) | ea163a4, 1bc8548 |
| Cookie banner actually mounted; footer Cookie Preferences control; same-tab consent propagation | 0746569, 28499e3 |
| Internal links repointed to merged targets; gift-card Stripe success URL fixed | abce8e9 |
| Hover-lift defined; global anchor scroll-margin | 887c375 |
| Nav: Home link added; duplicate Services entry removed; mega-menu groups balanced 3/3/4 | e5602c6 |
| Carousels no-crop (home, designs, events, photography); merge folds; cursor; splash tap fix | earlier |

Open legal items are attorney/owner only, tracked in `LEGAL_HANDOFF.md` (DMCA agent registration, dispute clause
choice, DPAs, release templates, trademark filing, affiliate terms, loyalty terms). Not an agent task.

---

## 2. Blockers and hazards (resolve before assigning)

- **B1. Claude working tree is dirty and overlaps target files.** Uncommitted: `src/app/home/page.tsx`,
  `src/app/printing/page.tsx`, `src/app/services/page.tsx`, `src/components/PricingCalculator.tsx`,
  `src/app/community/page.tsx`, plus `HANDOFF.md`, `HANDOVER.md`, `WYZ_AI_TASK_BOARD.md`, and untracked
  `VISUAL_AUDIT_2026-10-10.md`, `tsconfig.audit.json`. Claude must commit these before any other agent edits
  those files. The flip-card tap fix for home and services is already in that WIP.
- **B2. Claude's services change deletes the `#plans` and `#web-design` anchors** (`plans/page.tsx:241`,
  `web-design/page.tsx:185`) by removing the Plans and Web Design renders. That breaks the repointed
  `/services#plans` and `/services#web-design` links and the "services plans wins" pricing canon.
  Needs owner decision, then a small integration (wrap the remaining pricing block with `id="plans"`).
- **B3. Corrupt generated `.next/dev/types/validator.ts`** from concurrent dev servers breaks `tsc`/`next build`
  because tsconfig includes `**/*.ts`. Workaround used: move the file aside or use `tsconfig.audit.json`.
  Codex should make this durable (exclude `.next/dev` in the build type-check path, or ensure only one dev server).
- **B4. Tracker env IDs are not set in production** (`NEXT_PUBLIC_GTM_ID`, `NEXT_PUBLIC_CLARITY_ID`,
  `NEXT_PUBLIC_META_PIXEL_ID`, `NEXT_PUBLIC_TIKTOK_PIXEL_ID`), so consent-gated analytics never fire even after
  Accept All. Owner action: set the IDs in Vercel, or drop the vendors from the privacy policy.
- **B5. Orphaned components**: `ChatWidget`, `NoiseOverlay`, `A11yAudit` live in `ClientComponents.tsx` which is
  imported but never rendered. Decide: enable, delete, or leave.
- **B6. Only one `next dev` at a time.** Parallel dev servers corrupt `.next`.

---

## 3. Open tasks by owner

### WYZMiND (me)

Global/infra, layout, delivery, verification, cross-cutting CSS, and the pieces I already have context on.

| # | Task | Files |
|---|---|---|
| W1 | Mobile: tapping Enter Site lands on the home page | `src/app/page.tsx`, `SplashVariants.tsx` |
| W2 | Every page loads at very top; hero flush to nav, no gap above/between | `src/app/layout.tsx`, per-page hero |
| W3 | Remove side/top gaps and borders on all pages (borderless) | `layout.tsx`, `globals.css`, page shells |
| W4 | All filter/sort/tab selectors become horizontal-scroll strips on mobile | shared component + all listing pages |
| W5 | Newsletter banner: social buttons cropped at bottom | `Footer.tsx` / newsletter block |
| W6 | About: FAOTM widget shows Danny Davis image (`danny-davis.png` exists) | `about/page.tsx` |
| W7 | About: scroll stops halfway and reverses; fix and prove no other page has it | `SmoothScrollProvider` / Lenis config |
| W8 | Contact: build a real, generated brand audit guide and wire delivery | new `_ENGINE`-side or `src/app/api` route + email |
| W9 | Shared interaction/animation primitives (buttons, hover, tap, transition, scroll) as one stylesheet the pages reuse | `globals.css` + new components |
| W10 | Build, test, commit, push, deploy, verify every batch (owns the pipeline) | repo |

### Codex

Structured/audit/docs/tests work.

| # | Task | Files |
|---|---|---|
| C1 | Mobile pagination for long pages (reusable tabbed/paginated section component) | new component + long pages |
| C2 | Fix B3 durably (type-check excludes `.next/dev`; enforce single dev server) | `tsconfig*`, docs |
| C3 | Board #21: propose a rate-limited QA allow-list / preview policy | `WYZ_AI_TASK_BOARD.md` |
| C4 | Own the task board: keep `WYZ_AI_TASK_BOARD.md` current with this divvy; log handovers | board, docs |
| C5 | Extend verification: add vitest + route checks for the new interactive components | `**/*.test.ts(x)` |
| C6 | Consolidate the three handoff docs (`HANDOFF.md`, `HANDOVER.md`) into one convention | repo root |

### Claude

Per-page visual + interaction polish (continuing its in-flight audit; it already holds home/printing/services WIP).

| # | Task | Files |
|---|---|---|
| K1 | Hero banners: paragraph box width = header title width (currently too wide) | all hero banners |
| K2 | Hero titles: stacked typography via `width: min-content` (big first word, smaller sub-text wrapped under) | shared hero + all pages |
| K3 | Per-page unique hero motion: vary shapes/motion/style per page; more red dots plus an equal count of gray/white dots on every page | per-page hero components |
| K4 | Site-wide interaction layer applied per page (with W9 primitives): buttons, hovers, taps, transitions, scrolls, widgets, mobile + desktop | all pages/components |
| K5 | Flip cards: front text bleeding through on mobile, site-wide (finish the services/home fix) | `printing`, `services`, `home`, others |
| K6 | Home services: add the 7th service so the All tab shows 6 | `home/page.tsx` |
| K7 | Services: add one service each to Videography, Consultation, Web Design so all categories are even | `services/page.tsx` |
| K8 | Photography: 6 categories as an even grid on mobile and desktop | `photography/page.tsx` |
| K9 | Designs carousels: match home/photography fit (no oversize, no crop) | `designs/page.tsx` |
| K10 | Events: blank gaps in the client events carousel | `events/page.tsx` |
| K11 | Events/YouTube: dark overlay always on; spotlight only on hover | `events/page.tsx` (or the YouTube section component) |
| K12 | About: crown-logo hero background rows marquee in opposite directions | `about/page.tsx` |
| K13 | Move the "Ready to build" section to the bottom of the sections | `home/page.tsx` (confirm target page) |
| K14 | Blog: category labels in the top-right corner, not centered/spread | `blog` listing |
| K15 | Contact: place the "free brand audit guide" block at the bottom of all sections (renders W8's output) | `contact/page.tsx` |
| K16 | Board #31: correct WYZMiND page capability/privacy claims (after owner approves positioning) | `wyzmind/page.tsx` |

---

## 4. Decisions needed from Torreé

1. **Services anchors/pricing (B2):** confirm keeping a pricing block with `id="plans"` on Services, and whether
   Web Design content stays on Services (it powers `/services#web-design`).
2. **Trackers (B4):** set the four public IDs in Vercel, or remove those vendors from the privacy policy.
3. **Orphaned components (B5):** enable ChatWidget / NoiseOverlay / A11yAudit, or delete them.
4. **Brand audit guide (W8/K15):** confirm format (PDF vs web page), what it audits, and where it is emailed.
5. **Per-page hero theming (K3):** approve the direction (each page gets its own animated identity).
6. **Mobile pagination (C1):** approve tabs vs scroll-sections as the pattern.
7. **Web Design content + FAOTM images:** confirm current offer details and supply `faotm_4.jpg`.

---

## 5. Suggested execution order

1. Clear B1 (Claude commits WIP incl. the flip fix), decide B2.
2. WYZMiND batch: W2, W3, W5, W6, W7 (layout + quick visual) and ship.
3. Claude batch: K1, K2 (hero system) then K6-K14 (per-page), shipping per page group.
4. Codex batch: C1, C2, C4, C5.
5. WYZMiND: W9 primitives, then Claude applies (K4); W1, W4, W8.
6. K3 (per-page unique heroes) last, as its own multi-PR effort.

---

## 6. Progress update (2026-10-10, evening, WYZMiND)

Shipped since the ledger was written:

- Nav: Home link, duplicate Services removed, mega-menu balanced (e5602c6).
- All Codex work landed and verified: PaginatedSection + tests, tsconfig hardening, QA policy, handover (1c4bda4).
- All Claude work landed and verified, reconciled so Services keeps Web Design content and the #plans/#web-design anchors (1c4bda4).
- ChatWidget, NoiseOverlay, A11yAudit enabled via a single ClientComponents mount; verified live chat button (b444a9a).
- Designs FAOTM strip slot #4 now uses danny-davis.png instead of duplicating #1 (b444a9a).
- Splash: tap anywhere (mobile-safe) enters home and scrolls to top (b7c0da1).
- Footer socials row given z-20 + extra bottom padding so the circles are not clipped (b7c0da1).
- Real 5-page Brand Audit Guide PDF authored, served at /downloads/wyz-brand-audit-guide.pdf (200, application/pdf), and linked from the newsletter confirm and welcome emails (b7c0da1).

Still open and owned:

- WYZMiND: W2/W3 (page top and side gaps, hero flush on all pages), W4 (horizontal-scroll filter/sort/tab strips on mobile), W7 (about scroll reverses halfway), W9 (interaction primitives), wire C1 PaginatedSection into long pages as tabs.
- Claude: K3 (per-page unique hero motion + balanced red/grey dots), confirm K9/K10/K11 (designs carousels, events carousel blanks, YouTube overlay always-on), K12 (about crown marquee opposite directions), K13 ("Ready to build" to bottom), K14 (blog labels top-right), K1/K2 if not already in the audit pass.
- Owner: the four tracker IDs (NEXT_PUBLIC_GTM_ID, NEXT_PUBLIC_CLARITY_ID, NEXT_PUBLIC_META_PIXEL_ID, NEXT_PUBLIC_TIKTOK_PIXEL_ID) so analytics can be enabled, and faotm_4.jpg if a distinct fourth FAOTM image is wanted (Danny is used meanwhile).

Note: NoiseOverlay class was not detectable by class-name probe on the live page; confirm it is rendering as intended.

## 7. Progress update 2 (2026-10-10, late, WYZMiND)

- FIXED the site-wide "cannot scroll to the bottom" bug. Root cause: `section { content-visibility: auto; contain-intrinsic-size: 0 500px }` understated page height, so scroll stalled and snapped backward on long pages. Now `content-visibility: visible`. Verified live: /about reaches scrollY 8901 of 8901 and /merch 3661 of 3661, footer fully in view (609cf97).
- Palette folded to red/gold/white/gray/black across 19 files: removed Discord blue #5865F2, all tailwind blue-* utilities, platform blues (twitter/facebook/linkedin), and the cyan/purple/green chart strays. Verified zero blue utilities remain.
- Gold updated to the logo tone: --color-wyz-gold #C9A227, light #E7C873, deep #8C6A1D; added .wz-gold/.wz-gold-line/.wz-gold-text/.wz-gold-glow utilities, gold scrollbar hover, gold footer precision line.

Still open (WYZMiND): W2/W3 top+side gaps (thin light strip under the nav and at the page edges; hero should sit flush), W4 horizontal-scroll filter/sort/tab strips on mobile, W9 interaction primitives, wire PaginatedSection as tabs.
Still open (Claude): K1/K2 hero paragraph width + stacked (min-content) typography, K3 per-page hero motion + balanced gold/red dots, K12 about crown marquee opposite directions, K13 Ready-to-build to bottom, K14 blog labels top-right, verify K9-K11.
Owner: four tracker IDs; faotm_4.jpg optional.

## 8. Progress update 3 (2026-10-10, late, WYZMiND)

- Top gap fixed: layout content spacer now pt-16 lg:pt-20 (exact nav height); hero sits flush under the nav (verified live on /about: navBottom 80, heroTop -16). Hero lede capped at 46ch (K1).
- Mobile filter strips: .wz-hscroll utility added and applied to blog categories, merchandise categories, photography filters (services already scrolled).
- Interaction primitives: global tap/hover transitions, active scale, .wz-lift, .wz-underline, reduced-motion guard.
- Confirmed already done in the Claude pass: K11 (YouTube overlay always on, spotlight hover-only), K12 (about marquee alternates direction per row), K13 (Ready to build moved to the end), K14 (blog labels top-right), K9 designs carousel uses object-contain.
- Confirmed: home SERVICE_LIST already has 6 items (K6 satisfied); the side "gap" measured is the browser scrollbar gutter (content 0-948 in a 958 window), not a page gap.

Still open: K2 (stacked min-content typography on every hero title, per-page restructure) and K3 (unique animated hero per page with more red dots plus equal gray/white dots). Both are per-page design passes, not global tweaks. Owner: four tracker IDs; optional faotm_4.jpg.

## 9. Progress update 4 (2026-10-10, late, WYZMiND) - K2 + K3

- K2 DONE: added `.wz-stack` (width:min-content) and applied to the hero h1 on 16 marketing pages (home, services, photography, designs, events, printing, about, merch, community, loyalty, gallery, model-archive, featured-artist, wyzmind, 3pointprogram, contact). Multi-word hero titles now stack to the primary word width. Verified live on /services ("CREATIVE" / "SERVICES" stacked, centered).
- K3 DONE on the hero-banner pages: new HeroDots component (equal red + gray/white dots, 5 motion variants) injected into services(1), designs(2), events(3), printing(4), photography(5), home(2), featured-artist(1), wyzmind(4). Reduced-motion safe, decorative, deterministic (no hydration mismatch).
- Pages with no hero banner of their own (merch uses ParallaxHero; community/loyalty/gallery/model-archive/contact/3pointprogram have inline hero or none) were left alone rather than force a dots layer onto non-hero layouts. If dots are wanted on any of those, name them.
- Note: the about hero tag is multi-line, so its dots were not injected; add HeroDots inside its ScrollReveal section if wanted.

Everything pushed and deployed: f0b462a (K2 + K3 first 5), f4cc545 (home/featured-artist/wyzmind dots). Both READY.

## 10. Progress update 5 (2026-10-10, late, WYZMiND) - "do all else"

- Blog now paginates 9 articles per page with branded Prev/Next and a page indicator; resets to page 1 on category or search change. Verified live: 2 pages, 9 cards page 1, Prev disabled at start (cd34b41).
- 3pointprogram pillar tablist switched to .wz-hscroll (scrolls instead of wrapping on mobile).
- W4 filter strips now covered: blog categories, merchandise categories, photography filters, 3pointprogram tabs (services already scrolled). No wrapping filter/tab rows remain by scan.

Remaining, and why they are not done:
- Pagination on gallery / model-archive / community / designs: each is a different list shape (masonry gallery, model grid, community feed). Blog was the clear text-heavy one; the others can adopt the same Prev/Next pattern on request, page by page.
- Trackers (NEXT_PUBLIC_GTM_ID / CLARITY_ID / META_PIXEL_ID / TIKTOK_PIXEL_ID): need the four IDs from the owner; code is ready and consent-gated.
- Board #31 (wyzmind page capability/privacy claims): needs the owner to approve the corrected positioning before copy changes.
- Legal attorney items and FAOTM images: owner/attorney.

K3 dots: owner said skip, so no further dots work.

## 11. Progress update 6 (2026-10-10, late, WYZMiND)

- Board #31 APPROVED and fixed: wyzmind page claims corrected (removed the false "No data is sent to third parties"; now discloses the hosted third-party AI provider and that we do not sell data; softened absolute uptime claims). Live 13ba94a.
- Pagination scoped to where it makes sense: blog only (long text list). Not added to gallery/model-archive/community/designs (left as-is per "only where it makes sense").
- Vault checked for analytics IDs: NONE present (no GTM/CLARITY/META_PIXEL/TIKTOK keys). The vault does hold wyzdesign business facts usable for the legal package: WYZDESIGN_EIN, WYZDESIGN_ENTITY, WYZDESIGN_LEGAL_NAME, WYZDESIGN_BUSINESS_ADDRESS, WYZDESIGN_FOUNDER_PUBLIC_NAME, WYZDESIGN_INSTAGRAM. Still need the four tracker IDs to enable analytics.

## 12. Progress update 7 (2026-10-11, WYZMiND) - owner approved the outstanding decisions

Owner approved: pricing canon, QA policy, delivery automation, gift-card redemption, and metrics ("correct, but I have way more stuff"). Shipped a99cf14 (LIVE):

- **#1 Pricing canon APPROVED.** `PRICING_CANON_DECISION.md` approval record filled from the live values (monthly plans Starter $250 / Business $500 / Pro $750 / Ultimate $1,000; 50% deposit; gift cards 24mo; merch live). Reconciled the two flagged contradictions: photo retouching now "from $15/photo" (chat + booking), event photography "$200 up to 4 hrs" everywhere.
- **#24 Gift-card redemption: CONFIRMED COMPLETE.** It was already built (atomic reserve at checkout for services + merch, commit on webhook, release on expiry + cleanup cron, admin void/refill, cart field). Verified in code; marked done.
- **#22 Delivery automation: Phase 1 shipped.** `supabase/migrations/0002_client_comms_and_delivery.sql` (client_comm_preferences, delivery_events), `src/lib/delivery.ts` (4 stage drafts + per-stage flags, all OFF, hard-blocked while PHASE < 3), `/api/cron/delivery-outreach` dry-run runner that logs would-be sends and never sends. Phase 3 needs Torreé's per-stage copy sign-off.
- **#21 QA policy: DONE** (`QA_RATE_LIMIT_POLICY.md`, preview-first + paced production smoke rules).
- **#30 Metrics: reconciled.** `PORTFOLIO_METRICS_RECONCILIATION.md` backs all four public metrics with counted artifacts. On-site inventory: 1,860 images, 48 videos, 712 design pieces, 359 model photos, 243 photography, 68 event flyers, 43 client logos, 24 referenced. Events 90+ / clients 45+ / photos 1,500+ / years 9+ all hold. To raise any number, need the owner's lifetime counts from channels the repo cannot see (Instagram, Model Mayhem, client records).

### FAOTM finding (owner said "all 4 faotm images are named faotm with a number")

Only **three** exist: `public/images/faotm_1.jpg`, `faotm_2.jpg`, `faotm_3.jpg`. There is no `faotm_4` anywhere on V:/W:. The designs FAOTM strip's 4th slot uses `danny-davis.png` (owner approved). Action: supply `faotm_4.jpg` (or confirm 3 is right) and the strip can show 4 real pieces.

### Still owner-only (no agent work left)
- Tracker IDs (GTM/Clarity/Meta/TikTok) - analytics stays dark without them.
- Spec 22 Phase 3 per-stage copy sign-off (before any delivery email sends).
- Raise-metrics counts from external channels, and optional faotm_4.jpg.
- Lawyer items on the owner's own time (no reminders, per owner).

## 13. Progress update 8 (2026-10-11, WYZMiND) - Spec 22 live-ready + lifetime metrics

- **Spec 22 approved + live-ready.** Migration `0002` APPLIED to prod Supabase (verified: `client_comm_preferences` + `delivery_events` exist). Copy approved by Torreé; `OUTREACH_PHASE=3`. A stage still only sends when `WYZ_OUTREACH_ENABLED=1` AND that stage's flag are set in Vercel AND a `delivery_events` source exists; until then the cron only logs would-be sends.
- **Lifetime metrics updated** after a full media sweep of every source (G: Drive, iCloud, V:, site, IG export):
  - Photos Delivered: 1,500+ -> **10,000+**
  - Years Running: 9+ -> **13+**
  - Events 90+ / Clients 45+ unchanged (site-backed).
  - Evidence: G: Drive ~1.0 TB media (Pictures 171,677 / Videos 16,553 / Archive 1,977 / Graphics 2,045), iCloud Photos 53,714, Lightroom 6,604 + Luminar 6,603, site 1,860 images + 48 videos, IG export 2,683 media + 3,362 posts. Full write-up: `MEDIA_INVENTORY.md` + `PORTFOLIO_METRICS_RECONCILIATION.md`.
- FAOTM confirmed: 3 `faotm_N.jpg` + the Danny Davis slot (labeled F. A. O. T. M. #4 on the designs strip). Nothing to change.

## Progress 9 - Spec 22 Phase 3 (2026-10-14, WYZMiND)

Phase 3 (live per-stage outreach) shipped and verified end to end.

- **`src/lib/email.ts`:** exported the generic `sendEmail` (was private) so delivery reuses the same Resend path; documented it returns false instead of throwing.
- **`src/lib/delivery.ts`:** added `stageSent()`, `lastMarketingSentMs()`, `cadenceBlocked()` (1 marketing msg / 14d across stages 2-4, transactional exempt), `consentAllows()` (any opt-out wins), `bodyToHtml()` (escaped plain-text to branded HTML), and `recordDelivery()` (the emitter, idempotent on email + delivered_at).
- **`src/app/api/cron/delivery-outreach/route.ts`:** real send path. Order: consent -> cadence -> allowlist (`WYZ_OUTREACH_ENABLED` + stage flag) -> dry-run override -> send -> stamp `<stage>_sent_at`. One batch consent query instead of per row. Failures are not stamped, so they retry next run. Summary JSON: sent / previewed / optedOut / cadenceSkipped / failed.
- **`src/app/api/admin/delivery-events/route.ts` (new):** admin-gated emitter (GET list, POST record) since there is no delivery flow in the app yet (orders table has 0 rows).
- **`vercel.json`:** cron `/api/cron/delivery-outreach` daily `0 15 * * *`.
- **Vercel env set:** `WYZ_OUTREACH_ENABLED=1`, `WYZ_OUTREACH_STAGE1=1` (production/preview/development). Stages 2-4 deliberately still off, per "flip one at a time, starting with stage 1".
- **Tests:** 52 -> 69 (consent, cadence, stage stamps, HTML escaping, emitter idempotency). tsc 0, lint 0, build 0.
- **Verified live:** cron answered 401 without the secret, 401 gate = CRON_SECRET active; emitter answered 403 without an admin session. Real E2E: recorded one delivery to the owner's own inbox -> cron returned `sent: 1`, `stage1_sent_at` stamped, test row deleted (delivery_events back to 0).
- **Commit `6dbf69f` - DEPLOY IS LIVE.**

Note: nothing will send until deliveries exist. Record one with `POST /api/admin/delivery-events {email, clientName, serviceName}` or wire a fulfillment hook later.

## Progress 10 - Codex UI interactions batch landed (2026-10-14, WYZMiND)

Codex finished the UI-interactions pass and handed it over in `HANDOVER_UI_INTERACTIONS_2026-10-13.md`, with WYZMiND assigned the visual pass plus the commit. Done.

- **Verified visually** at 1440x900 and 390x844 with headless Playwright: home hero (no dots, by design), designs hero dots on the copy side plus the Danny Davis feature, services centered controls and content-height plan cards, events hero plus the video row and YouTube spotlight, desktop More menu (centered, SHOP contains Services and Printing), mobile nav entering from the right, and the mobile footer. Shots in `W:\WYZ_Command_Center\_STATE\web_shots\qa_*.png`.
- **Gate re-run on the working tree:** tsc 0, lint 0, tests 69, build 0.
- **Commit `1579bd1` - DEPLOY IS LIVE** (16 files: the 15 modified + the handover doc).
- One check remains for the owner: iPhone motion-permission prompt, then tilt-test the splash variants. iOS withholds `DeviceOrientationEvent` until a user gesture, so that cannot be verified headlessly. The splash stays ambient until permission is granted, which is the intended fallback.

## Progress 11 - Board rows #52 / #57 / #58 / #59 verified (2026-10-14, WYZMiND)

Those four rows were stuck on "needs verification" (Claude's audit work). Read-only source verification ran first, then everything found was fixed, gated, shipped, and the rows were moved to done.

- **One real bug found and fixed (#52).** `ScrollToTop`'s cookie-dialog clear-zone ran once on mount, saw zero `[data-chat-avoid]` targets (CookieBanner only mounts after consent resolves from localStorage) and returned early, so it never watched the dialog. That left the button at 99999 z-index sitting on top of the dialog, which is exactly the failure the row claimed was fixed. Rewritten to rebuild the observer on a `MutationObserver` whenever the target set changes. Verified on the production build: dialog open + scrolled = ScrollToTop opacity 0, console clean apart from the known CSP report-only warning.
- **Cart stacking re-measured (#52).** 1-item cart at 390x844: CartButton `bottom-24` at y=775, ScrollToTop `bottom-96` at y=704, overlap 0px2. Correct.
- **#52 watermark item is moot.** There is no footer crown watermark element anywhere in `src`, so the "16px -> 32px" claim has no matching code. Noted in the row rather than left pending.
- **#57.** The `:not(.flex-none)` frozen-word scoping is live. The marquee loop-seam class it added (`.animate-marquee-left-x3` + keyframes) had 0 usages because the three tripled merch marquees were removed in the 908 -> 317 dead-code sweep, so the orphaned CSS was deleted.
- **#58.** `justFocusedRef` present on printing and services (the only two pages with `onFocus` + `setFlipped`); community stats strip fix live and fitting at 390px; flip-on-tap retested (`matrix3d(-1,...)` on tap 1, reverts on tap 2).
- **#59.** `preserve-3d`, the events `buildRow()` gap fix, the YouTube `isHovering` spotlight gate, and the home 6th service are all in source. The `-webkit-backface-visibility` prefix existed only on home, so it was added to photography, plans and web-design; all three tap-flip-tested after the edit.
- **Gate:** tsc 0, lint 0, tests **69/69**, build 0.
- **Commit `ce30e0d` - DEPLOY IS LIVE** (sha `ce30e0da656f8903db7db19ff377f5d065045934`), 5 files: `ScrollToTop.tsx`, `globals.css`, `photography`, `plans`, `web-design`.
- Evidence shots: `v52_A_dialog_open.png`, `v52_B_cart_stacked.png`, `v52_community_stats.png`, `v58_printing_flip.png`, `v58_flip_before/after.png`, `flip_photography.png`, `flip_plans.png`, `flip_web_design.png`.

Note for whoever runs QA next: port 3100 is `next start` serving the production build, not a dev server. A stale `next start` will keep answering after a rebuild and serve the old manifests (symptom: JS/CSS rejected with MIME `text/plain` and hydration never runs, so cookie dialog and client effects look "broken"). Kill every listener on 3100 before rebuilding, then start a fresh one. Something in this environment also respawns a `next start` on 3100 on its own, so verify on a private port (e.g. `next start -p 3210`) if you need a guaranteed-fresh server.

## Progress 12 - Board row #7, loading/error/empty states (2026-10-15, WYZMiND)

Audited the five revenue-critical routes (booking, services, merch, contact, plans) for loading, error and empty states, then fixed what was missing.

- **All five already ship route-level `loading.tsx` + `error.tsx`** built on the shared `RouteLoading` / `RouteErrorState` components, so loading and error coverage was already complete and uniform.
- **One real bug fixed (merch empty catalog).** The catalog fetch returned early when `data.products` was empty, so `catalogStatus` never left `"loading"` and the grid skeleton pulsed forever. Now an empty-but-successful catalog sets a real empty state. The message is context-aware: "New pieces are coming soon" for All, "No pieces in this category yet" for a filtered category.
- **Live context:** `/api/printful-catalog` currently returns `{"products":[],"total":0}`, so production `/merch` was sitting on a stuck skeleton. It now shows the empty state. With a non-empty catalog (verified by mocking the route) the grid renders tiles, the quick view opens, and the `/merch/[id]` add-to-cart CTA is present, so the earlier "no Add to Cart" observation was an empty-catalog symptom, not a page defect.
- **services:** added an empty guard for a category filter that yields no services.
- **booking:** submission and checkout already surface failures with try/catch plus an `aria-live` region, no change needed. **contact / plans:** static content, empty state not applicable.
- **Gate:** tsc 0, lint 0, tests **69/69**, build 0. **Commit `7349f28` - DEPLOY IS LIVE** (`7349f285bd44e5a73adeb8878c5a4c11a94f922a`), 2 files (`merch/page.tsx`, `services/page.tsx`).
- Shots: `v7_merch_empty.png`. Verification scripts asserted the empty state, the no-skeleton condition, and the mocked non-empty happy path.

Still owner-gated: #23 (subscription-term wording needs the real billing cadence), #24 (gift-card implementation awaits policy approval), #6 (regression gate, Codex-owned), and the analytics IDs (not in the vault).

## Progress 13 - Board row #6, accessibility + mobile regression gate (2026-10-15, WYZMiND)

Built the gate as an in-repo test so it runs on every `npm run test:run` (and via the new `npm run test:a11y`), rather than a separate harness.

- **New file `src/app/a11y-mobile-gate.test.tsx`**, 19 checks, four groups:
  1. **Route contract:** booking, services, merch, contact and plans each keep `page.tsx` + `loading.tsx` + `error.tsx`, their error files are client boundaries that accept `reset` and render `RouteErrorState`, and the app-level `error.tsx`, `global-error.tsx`, `not-found.tsx` still exist.
  2. **Shared-state a11y:** `RouteLoading` is a polite live region (`aria-live="polite"`, `role="status"`) with an accessible loading message; `RouteErrorState` is `role="alert"` with a labelled Retry button, a Go Home link and an `h1`.
  3. **axe-core** on the rendered shared states: zero serious/critical violations (color-contrast rule disabled, jsdom has no layout to evaluate it).
  4. **Mobile regression locks (source-level):** ScrollToTop cart stacking (`useCart`, `bottom-24`) plus the cookie `MutationObserver`, CookieBanner `data-chat-avoid`, the `-webkit-` backface prefix on all six flip pages, and the merch empty-catalog empty state.
- Uses only existing dev dependencies (vitest, jsdom, testing-library, axe-core), so no dependency changes.
- **Suite 69 -> 88.** Gate: tsc 0, lint 0, tests **88/88**, build 0. **Commit `e5bd9cb` - DEPLOY IS LIVE** (`e5bd9cb5ea04b1a8e9fe9d105138694dd0e1d5e1`).

This clears the last non-owner-gated ready row. What remains is owner-gated (#1/#2 pricing canon, #4 analytics access, #21 audit policy, #23 cadence, #24 gift-card policy, #31 capability claims) or Codex-owned page splits (S2/S4/S5/S8).

## Progress 14 - Owner decisions actioned + mobile splash (2026-10-15, WYZMiND)

Ran the owner's answers on the open decisions and shipped the one real feature request.

- **Mobile splash is now strictly tilt-native.** The registry gained a `mobile` flag; the four cursor-oriented variants are marked `mobile: false` (CursorRibbon, Spotlight's torch, GrainReveal's cursor window, Duotone's cursor light) because they have no meaning without a pointer. `RandomSplash` now calls `pickVariant(isTouchPrimary())`, so a phone only ever draws from the tilt set. Two new tilt-first variants were added so the phone set is built around the gesture rather than a mouse effect standing in: **TiltLevel** (a horizon levels against gravity and a bead slides to the tilt position) and **TiltSheen** (a raking light sweeps the mark as the phone turns). Verified on a 390x844 touch context over 14 reloads: every pick landed in the tilt set, zero cursor variants.
- **Root cause of "tilt only worked on maybe one" found and fixed.** `useGyroPermission` skips its auto-request when `DeviceOrientationEvent.requestPermission` exists, and nothing ever called `requestPermission()` on a gesture, so on iOS 13+ the orientation listener never attached (Android was fine, iPhone never worked). The hook now binds the first pointerdown/touchstart/click as the permission gesture. The splash also shows a one-tap "Tap to enable tilt" gate on those devices, so the tap that grants motion does not also enter the site (previously the first tap both requested permission and navigated away).
- **Plans:** removed the non-canon trio (Startup $500 / Artist $250 / Enterprise $750 per month) plus the Web Design add-on section and the now-unused `Link` import. `/plans` matches the approved catalog only.
- **Merch / Printful:** the empty catalog was diagnosed as **local only**; `wyzdesign.com/api/printful-catalog` returns real products (the Vercel key is valid). The local `.env.local` key is stale (Printful: HTTP 401 "access token provided is invalid"). Hardened regardless: the client no longer swallows upstream errors, and the route returns 503 "temporarily unavailable" instead of a misleading empty collection when Printful fails. Note for local dev: refresh `PRINTFUL_API_KEY` in `.env.local` to see the store locally.
- **Analytics:** checked every Vercel env var for the project (33 total). None of the four tracker IDs exist, so per the owner's "wire only what is present" there is nothing to wire; the consent-gated provider stays dark and correctly no-ops.
- **Audit policy (#21):** automation never audits production; audits are local or owner-run.
- **Board:** closed #1 (canon already approved 2026-10-11), #21 (policy set), #23 (no quarterly claim remains), #24 (Spec 24 COMPLETE, redemption live), #31 (privacy wording discloses third-party processing; merch checkout live), and unblocked #2 for Codex.
- **Gate:** tsc 0, lint 0, tests **92/92** (added 4 splash-policy checks), build 0. **Commit `36bd345` - DEPLOY IS LIVE** (`36bd345bd9b593a91e79abc59176ff060acd389b`), 6 files.
