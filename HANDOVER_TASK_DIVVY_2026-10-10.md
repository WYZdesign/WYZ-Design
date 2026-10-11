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
