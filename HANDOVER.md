# WYZ Design — Current State (Session 40)

---

## Session 42 (2026-10-02) — Outstanding-work triage (Codex)

- Reclassified board task 5a as complete because later live evidence in tasks 9 and 10 already verifies its intended gutter and marquee scope.
- Assigned WYZMiND release verification for the FAQ mobile-hero fix in `56b5498`; the fix is pushed but must not be described as live until its deployment SHA and release gates are recorded.
- Added bounded WYZMiND work for the global mobile section-padding override, the explicit-`any` Cal.com bridge, deterministic narrow visual captures, safe production audit access, and the delivery-to-repeat-work automation specification.
- Read-only live-path review: `/booking`, `/plans`, and `/merch` load with their primary accessible controls visible. No forms were submitted and no checkout was initiated. Found an owner decision point: `/plans` says both “all plans auto-renew monthly” and “monthly or quarterly,” so task 23 records the needed billing-term decision before any customer-facing money copy changes.
- Deployment check after this review: `56b5498bfca034a4a30b2fbd7d1c4df3d7717e0e` is `READY` and live at the WYZ Design Vercel deployment. The broader release-gate evidence remains assigned to WYZMiND in board task 17.
- Continued revenue-path evidence: contact and gift-card pages load with labeled primary fields and actions; checkout/forms routes enforce CSRF and rate limits, and service checkout validates server-side prices. Gift cards are created after Stripe webhook confirmation, but no customer-facing redemption flow exists even though the live page promises redemption for services or merch. Board task 24 now scopes the secure design work before implementation.
- Loading/error-state audit: the app has global loading, error, and not-found screens, and merch has catalog loading/error/empty handling. The global error boundary lacks the required document wrapper, while booking, contact, plans, and gift cards have no route-specific loading boundary. Board tasks 26 and 27 define the appropriate repair and scoped state coverage.
- Fresh 320px local gutter audit across 17 public routes: no true edge-spacing failures. The only reported elements are the previously documented symmetric centered hero text on Home (19px), Events (17px), and FD (16px); task 16 remains optional rather than a defect fix.
- Merch interaction check: the catalog reveal, quick view, and Escape-close/focus restoration work. However, the product-page “Add to Cart” state is cosmetic and the quick-view CTA links to Featured Artist rather than a purchase path. No merchandise checkout route was found. Board task 28 is urgent: build an approved payment/fulfilment path or stop presenting this as a purchasable store.
- No production source files changed in this session entry.

---

## Session 41 (2026-10-02) — FAQ hero visual follow-up (Codex, local pending integration)

- **Visual defect found in the post-integration 320px proof:** an 80px white dead band appeared between the fixed red navigation and the FAQ hero. It came from the FAQ main container's mobile top padding, not from the hero itself.
- **Fixed locally:** removed the FAQ main top padding. The hero now begins behind the fixed navigation, while its centered content remains safely below the header.
- **Verified locally at 320px:** hero is flush beneath the navigation; the repaired FAQ maintains no horizontal overflow at 360px; question text remains clear of the plus control; the footer WYZ Design lockup remains legible.
- **Related contrast repair retained:** Footer's `Design` word now uses white rather than red-on-red.
- **Required integration:** WYZMiND should review this two-source-file follow-up, run the standard type/lint gates, push the code bundle, and take one deployed 320px FAQ screenshot before marking it live.

---

## Session 40 (2026-10-02) — Codex batch integration + guard range fix (WYZMiND)

- **Integrated Codex board #13 (11 files, `8528ab6`):** diff-reviewed every hunk (no blockers), gates green (build 0 / lint 0-92 / vitest 12/12), pushed with attribution.
- **Guard v2 flaw found + fixed:** docs-head multi-commit push (`2fe69e1`) CANCELED the build carrying `8528ab6` (head-only diff). Rewrote `ignoreCommand` to diff `VERCEL_GIT_PREVIOUS_COMMIT..HEAD`; Vercel schema max is 256 chars - first attempt failed (`d2aa503` ERROR), compressed to 252 (`8d0df90` READY). Verification matrix: mixed=build, docs-only=skip, prev==HEAD=skip, bad-rev=fail-open-build.
- **Codex acceptance verified LIVE @320:** FAQ closed gap=12 x5 / expanded gap=4, zero dup-question remnants, no overflow; nav Escape-close PASS; gallery keyboard PASS (Enter opens, focus lands on Close inside dialog, Escape closes, focus restored to tile). Screenshots + `faq_kb_report.json` in `_STATE/web_shots/narrow/`.
- **Gutter #10 final close (`a77bca1`):** CookieBanner `p-5->p-6` - audit 74->10 items (cookie 48->0); residual 10 all symmetric centered-typography (accepted; optional board #16).
- **Harness fixes:** `wyz_axe_e2e.py` gallery flow follows Codex's button tiles (legacy div kept as fallback) + one-time cookie-consent dismissal (fixed-modal click interception flake).
- **Final state:** axe 0/10, E2E 7/7, `DEPLOY IS LIVE` on `a77bca1`. `_agent/narrow_vision.py` left unstaged (Codex local BASE=localhost:3101 - restore before live audits).

## Session 39 (2026-10-02) — FAQ mobile accordion collision repair (Codex)

- **Root cause:** each mobile FAQ row rendered a second copy of its question as a supposed marquee, but the `faq-marquee` classes had no accompanying clipping or animation rules. The duplicate could flow underneath the fixed plus icon.
- **Fixed locally:** removed the duplicate mobile question node; tightened the mobile row gutter and gap; hid the decorative leading category icon below `sm` so a 320px question keeps a useful text column; kept the text area `min-w-0`; reserved a 40px non-shrinking icon column; increased the plus control to 40px. Questions now use ordinary, readable wrapping rather than an unimplemented marquee.
- **Interaction repair:** the WYZ AI chat toggle now meets a 44px touch target and exposes its expanded state, control relationship, and descriptive label to assistive technology.
- **FAQ semantics:** search and chat inputs now carry programmatic labels; category filters expose their pressed state; obsolete mobile FAQ marquee CSS was removed with the broken marquee markup.
- **Navigation repair:** the mobile menu trigger is now a 44px control with `aria-expanded` and `aria-controls`; the menu closes with Escape; mobile search has a programmatic label; the desktop More menu exposes its state and controlled region; the crown image uses a descriptive logo alt.
- **Gallery interaction repair:** portfolio tiles are native buttons with descriptive labels, so opening the lightbox works through normal keyboard activation as well as touch or mouse.
- **Modal repair:** `useModalA11y` now moves focus into a supplied dialog when it opens and cancels that scheduled move during cleanup. Gallery passes its dialog ref and uses the hook's nested-safe scroll lock, yielding Escape close, focus trap, focus restoration, and scroll restoration as one path.
- **Gift-card checkout resilience:** checkout now requires a successful response and valid redirect URL before navigating; non-JSON and server failures preserve the server message when supplied and otherwise show the existing human error toast.
- **Checkout route hygiene:** replaced the untyped error path in `/api/checkout` with `unknown` narrowing before logging or testing the message. Existing CSRF, rate limiting, server-derived identity, and server-side service-price validation were confirmed in source and left intact.
- **3-Point program tabs:** completed tab semantics with connected tab/panel IDs, roving tab stop, and Arrow, Home, and End keyboard navigation.
- **Audit evidence boundary:** the archived valid 320px FAQ capture shows the original duplicate-question text running beneath the trailing plus control; the local FAQ repair directly addresses that defect. A fresh 17-route production visual runner was attempted, but the host throttled it: most archived full-page captures and metrics are HTTP 429 error documents, not usable visual evidence. Do not label those routes visually passed until the production rate limit permits a paced re-run.
- **Related mobile repairs retained locally:** prevented global heading rules from splitting individual words; gave the FAQ content clearance below the fixed navigation; stopped Cookie Preferences from breaking mid-word; made footer social controls 44px on phones with wrapping rather than overlap.
- **Verification:** `npx tsc --noEmit --incremental false` passed and `npm run lint` passed. Local `/faq` returned HTTP 200. Vitest starts when its normal helper processes are permitted but produced no project test-result report, so it is not accepted as coverage. The in-app browser driver timed out before it could produce a local visual capture, so a 320px screenshot recheck remains required after WYZMiND integrates and deploys this code.
- **Integration note:** these source changes are intentionally unstaged. Codex cannot create the required Git lock in this workspace; WYZMiND remains the master-branch integrator under `AGENT_COLLABORATION_PROTOCOL.md`.

### Next Action

1. WYZMiND: inspect the FAQ accordion at 320px after integration; verify question text never enters the plus-control column, in both closed and open states.

## Session 38 (2026-10-02) — Edge gutters, marquee spacing, collaboration layer (WYZMiND)

- **Root-caused edge-touching:** unlayered `!important` CSS in `globals.css` — `@media (max-width:768px) .hero-banner > * { padding:0 !important }` stripped horizontal padding from every hero text container (same bug class as Round 24's `a{text-decoration:none}`). Rule removed (section-level full-bleed rules kept).
- **Shipped `4943727` (live):** hero text `px-4`→`px-6` (home/events), about/events h1 `text-[2rem]`→`text-[1.75rem]` (fits 320), brand marquee `py-6`→`py-3 sm:py-6` on 8 pages, merch marquee bands halved on mobile (4 bands), DBC heading `px-6`.
- **Verified live:** 17-route 320px shoot (all 200, 0 errors, 0 horizontal overflow), `tight_audit` 0 elements <16px from any edge, `mq_summary` marquees now 12/12px sections + 16/16px bands (was 24/24 + 40-48), vision reads confirm balanced spacing; `/designs minR=-31` = intentional carousel/marquee track bleed.
- **Collaboration layer landed:** `AGENT_COLLABORATION_PROTOCOL.md` (process contract: roles, worktree rules, gates, cost rules, handoff footer), `WYZ_AI_HANDOVER.md` + `WYZ_AI_TASK_BOARD.md` (Codex Session 37, reviewed by WYZMiND), `_agent/` (narrow_vision/edge_audit/tight_audit), task board rows 9-12.
- **Build-cost guard v2:** `vercel.json` `ignoreCommand` now builds only on `src/ public/ package*.json next.config.* vercel.json tsconfig.json` — docs, handoffs, and `_agent/` scripts auto-CANCEL (dry-run verified: docs commit exit=0, code commit exit=1).
- **Vaulted:** `WYZDESIGN_FOUNDER_PUBLIC_NAME` = "Torreé Marcel" (owner decision, 2026-10-02).

### Next Actions

1. Codex: task board #12 — read-only live revenue-path verification (evidence into board).
2. Owner: price/billing canon decision (board task 1) unlocks pricing inventory (#2).
3. WYZMiND: AUDIT Round 28 push (guard v2 free-cancel proof) then task #10 gutter standardization when claimed.

## Session 37 (2026-10-02) — Shared AI Operating Foundation

- Completed a read-only discovery pass across the WYZ Design repository, public site, public founder and company context, historic audits, and the actual Muses by WYZ coordination model.
- Established Torreé Marcel as the official founder name for future WYZ Design work.
- Added `WYZ_AI_HANDOVER.md`: durable business, technical, evidence, and coordination context for Codex, WYZMiND, and approved future agents.
- Added `WYZ_AI_TASK_BOARD.md`: explicit owners, task states, decision dependencies, and file-claim protocol.
- Confirmed WYZ Design's local `master` matched `origin/master` at discovery commit `4943727`.
- Made no site, database, provider, billing, or production configuration changes.

### Next Actions

1. Torreé confirms the price and billing canon before customer-facing price changes.
2. Codex performs a read-only live revenue-path verification and records evidence.
3. Codex turns the verified routes into an accessibility and mobile regression gate.

## All Sessions Summary (30-36)

### Session 30-31 (Prior)
- Splash scroll lock, hero H1 formatting, button positioning
- Photography & services hero formatting
- Magnetic → glow hover transitions

### Session 32
- Carousel speeds +10% (0.55/0.88/0.33-0.66)
- Blog badge moved inside card image
- Sticker cards 25% shorter (67vh)
- FAOTM H1 fit one line + H2 tracking narrowed
- Services page: 15→27 services across 6 categories
- All hero banners full viewport height
- Photography marquee moved under hero
- Events dark overlay + red-white hover spotlight
- Popular services expanded to 6 cards

### Session 33
- About values: "Show Up and Do the Work" → "We Do The Work Ourselves"
- Merch text rewrite (less AI tone)
- Star rating → lightning icon
- Sort label "Top Rated" → "Highest Rated"
- Admin unicode icons + label fixes ("Zeal Rewards" → "Rewards")
- Rewards page: "ZEAL" H1 title
- Gift cards: "How It Works" moved above amount cards
- FAQ hero stats 50% larger + "Ask WYZ AI" removed
- Community real member/online numbers
- Flip card price centering across ALL pages
- Admin overview bar charts (forms by type, income/expense)
- Admin engagement metrics + recent submissions table
- Plans flip card layout fixed
- Comparison table grid lines + text-center alignment
- Photography carousel consistent heights
- Services page hero restored + marquee positioned
- Dark mode marquee stroke: transparent → #111
- About page: 75% overlay + "BUILT DIFFERENT" + social links
- NSFW constants extraction (nsfw-constants.ts)
- NEXTAUTH_SECRET placeholder for local build
- TypeScript clean, build passes

### Session 34
- Lenis smooth scroll: wheelMultiplier 1.0→1.3
- Merch store expand/collapse animation (portal effect)
- Merch auto-scroll gallery with black-to-red gradient
- Pricing calculator FAQ/chatbot widget (6 FAQ items)
- Home hero buttons: same size px-8 py-4, white button glows white on hover
- Splash proper scroll lock

### Session 35
- Community page: unified dynamic filter bar (sort + category in 2 compact dropdowns)
- Community page: collapsible composer with Framer Motion animation
- Full SEO metadata for ALL 40 pages with metadata.ts files
- Pages with metadata: home, about, services, photography, events, blog, designs, gallery, case-studies (4), web-design, printing, plans, merch (2), featured-artist, model-archive, community, loyalty, FAQ, gift-card, contact, brands, booking, 3-pointprogram, partnerships, referral, match, wyzmind, FD, search, secret, splash (2), clear-cache, admin, offline, policy pages
- Dynamic routes: photography/[category], merch/[id], view/[page] (blog/[slug] uses generateMetadata)

### Session 36 (Hero Video Posters + Marketing Enhancements)

#### Performance Optimizations
- **Hero video posters**: Created 7 optimized JPEG posters (1280px wide)
  - `hero-about.jpg`, `hero-designs.jpg`, `hero-photography.jpg`, `hero-printing.jpg`, `hero-web-design.jpg`
  - `hero-diy-shows.jpg`, `hero-diy-shows-2.jpg` (for random events hero)
- **ParallaxVideo.tsx**: Added `poster` prop, removed broken IntersectionObserver that paused autoplay
- **SafeImage.tsx**: Complete rewrite with WebP/AVIF fallback, blur placeholder support, priority/sizes props
- **TextSplit.tsx**: Added `will-change: "transform, opacity"` for animation perf

#### Events Page Fixes
- Fixed hero centering (removed `pt-24 lg:pt-32` padding pushing content up)
- Video now randomizes from 12 healthy DIY recap videos on each refresh
- Removed broken C.O. Reloaded Vol. 1 from rotation

#### Marketing Enhancements
- **Loyalty page**: Replaced cryptic "Couldn't load your Zeal" with friendly "Sign in to see your Zeal" CTA
- **LeadMagnet component**: Added to **about**, **plans**, **contact** pages (was home only)
  - Free Brand Audit Guide (7 questions + action items)
- **Newsletter**: Double opt-in via `/api/newsletter`, Resend integration, welcome email

#### Video Fixes by Page
- `/about` - poster added, preload="metadata" confirmed
- `/photography` - swapped layout: text-left/video-right desktop, mobile overlay
- `/events` - centering fixed, random video from 12 healthy recaps
- `/web-design` - poster on both desktop/mobile variants
- `/printing` - poster added to both ParallaxVideo and direct video
- `/services` - photography.mp4 uses hero-photography.jpg
- `/designs` - uses hero-designs.jpg
- `/events` - uses hero-diy-shows.jpg (works for all 12 videos)

#### Footer Video
- `/videos/wyz-nav-bg-new.mp4` still missing poster - needs frame extracted

## Current State

**Latest commit**: `HEAD = 4626b7e`  
**Total commits**: 20+ (sessions 30-36)  
**Build**: ✅ 112/112 pages passing  
**Preflight**: ✅ 29 PASS / 0 FAIL / 2 WARN  

### File Changes Summary
**Modified (performance/SEO):**
- `src/app/events/page.tsx` - centering, video randomization, broken video removed
- `src/app/photography/page.tsx` - layout swapped (text-left/video-right)
- `src/app/about/page.tsx` - poster added
- `src/app/web-design/page.tsx` - posters on desktop/mobile
- `src/app/printing/page.tsx` - poster added
- `src/app/loyalty/page.tsx` - friendly sign-in message
- `src/layout.tsx` - preload hints for hero images
- `src/components/ParallaxVideo.tsx` - autoplay fix, poster prop
- `src/components/SafeImage.tsx` - WebP/AVIF, blur placeholder
- `src/components/TextSplit.tsx` - will-change optimization
- `src/components/LeadMagnet.tsx` - lead magnet component
- `src/app/about/page.tsx`, `src/app/plans/page.tsx`, `src/app/contact/page.tsx` - LeadMagnet added
- `public/images/hero-*.jpg` - 7 new poster images (created via ffmpeg)

## Systems Status

| System | Status | Notes |
|--------|--------|-------|
| Newsletter | ✅ Active | Double opt-in, Resend welcome email |
| Referral | ✅ Active | `/referral` + leaderboard, 10% commissions |
| Loyalty/Zeal | ✅ Active | 4 tiers, quests, achievements |
| Forms | ✅ Active | Contact, booking, consultation, custom plan |
| Community | ✅ Active | Forum + Discord integration |
| Gift Cards | ✅ Active | 5 tiers via Stripe |
| SEO | ✅ Complete | 40 pages with metadata, sitemap, robots.txt |
| Social Proof | ✅ Active | Testimonials, case studies, reviews |

## Remaining Tasks (Optional)

1. **Video Posters** - Extract frames for `/videos/wyz-nav-bg-new.mp4` and footer video
2. **Social Sharing** - Add share buttons to case studies and testimonials
3. **Analytics Review** - Verify newsletter signup tracking in GA
4. **Mobile Verification** - Visual confirmation of hero changes
5. **Google Business Profile** - Update address from Chicago to Los Angeles

## Key URLs to Verify
- https://wyzdesign.com/photography (text-left/video-right layout)
- https://wyzdesign.com/events (centering + random video)
- https://wyzdesign.com/loyalty (friendly sign-in message)
- https://wyzdesign.com/ (LeadMagnet appears)

## API Endpoints
- `POST /api/newsletter` - Subscribe (double opt-in)
- `GET/POST /api/referral` - Referral code management
- `GET/POST /api/referral/leaderboard` - Public leaderboard
- `GET/POST/GET /api/zeal/*` - Loyalty points system
- `POST /api/forms` - Contact/booking forms
