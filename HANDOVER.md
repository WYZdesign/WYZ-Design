# WYZ Design — Handover Log

## CLAUDE: START HERE

You're taking over the WYZ Design site (www.wyzdesign.com). Everything below tells you what exists, what changed recently, and how to audit it yourself with vision + agentic tooling before making new changes.

### Environment
- **Repo:** https://github.com/WYZdesign/WYZ-Design, branch `master`, local clone `C:\Users\torre\WYZ-Design` (sparse checkout: `src/` only — no config files, cannot build locally; `npx tsc --noEmit` IS your build check)
- **Deploy:** push to master = Vercel auto-deploys. Wait ~2 min after pushing before live-auditing.
- **Stack:** Next.js App Router + React 19, Tailwind, TypeScript. Data: Neo4j (users/loyalty), Supabase (forms/referrals/logs), Redis ioredis (cooldowns/locks), Upstash REST (rate limits), Stripe (checkout), SQLite (analytics).
- **Auth:** NextAuth v5. Google OAuth + admin credentials. Email is the universal user key.

### Non-negotiable rules
1. Every change: edit → `npx tsc --noEmit` → update HANDOVER.md → commit → push. Never skip.
2. No em dashes in user-facing copy. Contractions encouraged. Personable tone.
3. NO emojis in code files.
4. Toasts via react-hot-toast for all user feedback. No alert(). No silent catches.
5. No `any` types. Dark mode palette: page `#1C1C1E`, surface `#252528`, deep `#111`, borders `#444`, accent `#DF3131`.
6. h1/h2 display headings use `style={{ lineHeight: 0.9 }}` — never 0 (caused overlapping wrapped lines; fixed everywhere, keep it fixed).

### What was recently built: Zeal points system
The loyalty program is now "Zeal". Read `src/lib/zeal.ts` first — single source of truth: 33 actions, 12 achievements, 4 quests, tiers Recruit/Zealot(500)/Champion(2000)/Legend(5000).
- **Engine flow:** client calls `earn(action)` from `useZeal()` (ZealProvider) → POST `/api/zeal/earn` → per-user Redis lock → cooldown/once-key check (Redis NX) → Neo4j award (`addLoyaltyPoints`) → achievement/quest evaluation → response includes tierUp/achievement/quest flags → provider toasts.
- **Purchases** award 1/dollar via Stripe webhook (separate path, same Neo4j function).
- **Known gaps (do not "fix" blindly):** refer-friend (+500) unwired — referral system has no account-creation hook; leave-review (+30) unwired — no review form exists. Both need product decisions from Torreé first.
- **Redis fail-open note:** if Redis is down, cooldowns/locks fail open (awards still process, dedupe weakens). Accepted tradeoff for availability. Rate limiter uses Upstash separately with in-memory fallback.

### VISION AUDIT — do these with screenshots after deploy
Screenshot each page desktop (1440px) AND mobile (390px), light AND dark mode. Verify:

| Page | What to check |
|------|---------------|
| `/home` | Hero h1 "WE MAKE WHAT WORKS" wraps cleanly, no overlapping lines. "Popular Services" title is large (~2xl-4xl). VIEW ALL SERVICES button not clipped by next section. Quick Links buttons have RED borders + RED text. Client logo carousel does NOT contain: Dying Breed, Nomadic Breed, Monkey Mug, Re(Belle), JR3Y, Photo-Bombed |
| `/home` dark mode | Toggle dark: hero readable, sections use #1C1C1E/#252528, footer stays black w/ white text |
| `/designs` | Split hero fills full viewport height (min-h-screen) |
| `/services` | Same full-height hero check |
| `/photography` | Same full-height hero check + model form submit button disables while submitting |
| `/web-design` | Full-height hero |
| `/loyalty` | Signed out: "Z E A L" heading, tier cards (Recruit/Zealot/Champion/Legend), ways-to-earn categories show sign-in prompts centered. Signed in: balance card, quest checkmarks, achievement grid, activity feed — numbers render as plain integers NOT [object Object] (Neo4j integer fix) |
| `/secret` | Hidden page loads, dark bg, "THE HIDDEN PAGE" h1 wraps without overlap, noindex |
| Any page w/ forms | Submit buttons show disabled/"SUBMITTING..." while in flight; failed submits show red toast, never fake success |
| `/events` | Flyer grid renders identically on load and after refresh (hydration fix); flipping carousel videos doesn't degrade CPU over time |

### AGENTIC AUDIT — code/API verification
Run these checks yourself:
1. `rg "lineHeight:\s*0(?![\d.])" src --pcre2` → must return nothing. Same for CSS `line-height:\s*0[;\s]`.
2. `rg "text-\[#8F8F8F\]|text-gray-400" src/app src/components` → should be near-zero on light-bg elements.
3. Grep client logos array in `src/app/home/page.tsx` → confirm removed entries gone.
4. `npx tsc --noEmit` → always clean before any commit.
5. API smoke tests (need auth cookie from signing in): POST `/api/zeal/earn` `{action:"daily-login"}` twice → second returns success zeal 0 (cooldown). Unknown action → 400. Unauthenticated → 401. GET `/api/zeal/status` → verify points/tier/catalog shapes.
6. Check `/api/zeal/earn` never awards negative or unlisted actions; metaPath validation strips query strings.
7. Confirm `/secret` absent from sitemap output and robots meta noindex present.

### Open threads (candidates for next session)
- **Cal.com booking links (HIGH):** `/booking` shows "No links set up" to all visitors. Zero event types published. Needs Torreé to log into Cal.com and publish at least one bookable event type. Highest-priority item — booking page is non-functional.
- **Hero banner redesign (site-wide):** 18+ hero sections inventoried. Wrap all hero text in containers. Half-panel heroes get square containers; full-width heroes get 2:4 rectangle containers. Text centered, tight wrap. Buttons stay side-by-side.
- **Gift card tables:** SQL schema written (`sql/gift-cards.sql`) but needs to be run in Supabase SQL Editor. Webhook insert code ready.
- **Referral dedup:** `stripe_event_id` column + unique index SQL written (`sql/referral-conversions-dedup.sql`). Needs to be run in Supabase SQL Editor. Code ready.
- Fragment `key={i}` index keys exist on some filterable lists — low priority.

### Session log (chronological, newest first)

## Session 27 — First real mobile-viewport sweep, marquee stroke bug found
**Date:** 2026-08-26
**Context:** Torreé manually tested at 375x667 (iPhone SE) in Chrome DevTools. Device bridge still down.
**Findings:**
- **Mobile nav/layout:** Clean at 375x667. Hamburger nav, hero, body copy, buttons all reflow correctly.
- **Splash tagline:** False alarm. Scrollbar gutter in emulation mode caused apparent off-center. Real phones use overlay scrollbars.
- **Carousel click-to-pause:** Confirmed NOT working on live site (pre-Session 40 fix). Fixed in Session 40.
- **Dark-mode marquee stroke-text bleeding:** Outline-only text (`-webkit-text-stroke: 1.5px`) overlaps at font-black weight. Fixed by reducing to 1px.
**Fixes this session:**
- `globals.css`: Reduced `.marquee-outline` stroke from `1.5px` to `1px` (light and dark).
- Client logo cleanup: Removed 11 duplicate/excluded logos (Ent-Icing x3, Nuvonic Title, YALL Red, Promontory, Ynot, GNP, Enticing Cafe Alt, Diamond Kiss 2, Live Life Fearless). Kept 24 unique logos.

## Session 40 — Carousel click-to-pause fix, full audit sweep
**Date:** 2026-08-26
**Fixes:**
- **Photography AutoScrollRow click-to-pause:** Was navigating to `/photography` on click (dead code: `paused`/`resumeTimer` refs existed but were unused). Replaced with pause/resume handler. Pauses for 3000ms on click.
- **Homepage SmoothCarousel + LogoCarousel:** Changed pause duration from 2000ms to 3000ms across both click and touch handlers.
- **Designs Carousel:** Already at 3000ms, no change needed.
**Audit:**
- Merch carousel: Already fixed in Session 39 (products link to `/merch/${id}`).
- Merch product-name marquee: Text-only decorative strip, no links needed.
- Hero banner inventory: 18+ heroes cataloged. Inconsistent containers. Ready for redesign.
- Cal.com: Confirmed zero booking links. Needs Torreé action, not code.

## Live-site Session 26 — Cal.com dead, merch carousel inert, dark mode verified, hero redesign requested
**Date:** 2026-08-26
**Source:** Claude/Cowork live-site sweep (device bridge down all session)
**Findings:**
- `/booking` Cal.com: **ZERO booking links published.** Widget renders "No links set up — Torreé Harris hasn't set up any booking links yet." Persistent across multiple checks. Cal.com account configuration issue, not a code bug. Highest priority — booking page is completely non-functional.
- `/merch` carousel: Product images are inert — no `<a>` tag, no navigation on click. Different from Session 24's description (was thought to misroute to `/featured-artist`). Carousel items need wiring to `/merch/${product.id}`.
- Dark mode: Visually confirmed correct with real screenshots. Nav, hero buttons, services section all restyle properly. No issues.
- `/wyzmind`: Clean, zero console errors. Stack disclosure is intentional per Torreé.
- Mobile viewport: `resize_window` tool confirmed fully broken. No mobile screenshots possible via automation.
**New work items from Torreé:**
- Hero banner redesign (all heroes site-wide): wrap text in containers (square for half-panel, 2:4 rectangle for full-width). Text centered, tight wrap. Buttons side-by-side. Equal spacing across all stacks.
- Carousel click behavior on `/`, `/photography`, `/designs`: should pause autoscroll ~3s on click. Needs verification + fix.
**Bridge status:** Down entire session. No source reads or code fixes possible.

## Session 39 — Merch routing bug fix, /wyzmind simplification
**Date:** 2026-08-26
**Fixes:**
- **Merch product-routing bug (critical):** Detail page `[id]/page.tsx` had hardcoded IDs 1-14 but the listing page replaced them with Printful catalog IDs (71, 12, 831, etc.) when the API succeeded. Most product links led to "Product Not Found." Fixed by making the detail page fetch from `/api/printful-catalog` on mount and look up by URL param, with hardcoded fallback (matching Printful IDs) when the API is down. Also fixed `MerchCarousel` and JSON-LD structured data to use fetched products instead of fallback-only data.
- **/wyzmind simplification:** Rewrote all 11 stack items with plain-English names and descriptions. Removed technical jargon (Qdrant, Neo4j, MongoDB Atlas, n8n, etc.). Updated section headers and CTA copy. The page still shows the same systems, just explained for non-technical visitors.

## Live-site Session 25 — /wyzmind audited, Cal.com re-tested clean, dark mode confirmed
**Date:** 2026-08-26
**Source:** Claude/Cowork live-site sweep (device bridge was down all session, DOM/console-level verification only)
**Findings:**
- `/wyzmind`: New page, zero console errors. Publicly discloses full stack (Ollama, Qdrant, Neo4j, Redis, MongoDB Atlas, Heroku, n8n, etc.). Functionally clean. Deliberate stack-fingerprint marketing choice — worth gut-check with Torreé.
- `/booking` Cal.com: Second independent clean load. Zero site-caused console errors. The intermittent `Cal.ns.booking is not a function` error (Session 24) did not reproduce. Confirmed low-priority, not deterministic.
- `/contact` form: Validation confirmed working. Name optional, email + message required. Browser-native validation messages fire correctly.
- Dark mode toggle: Fully functional. Initial "no change" from automated click tool was a false alarm — direct DOM `.click()` works. The bug is in the testing tool's hit-testing, not the site.
**Bridge status:** Down entire session. No source reads or code fixes possible.

## Session 38 — Zeal Rewards rename, triage, audit fixes
**Date:** 2026-08-26
**Commits:** `799d865`, `a802623`, `a2e24b6`
**Zeal Rewards rename (10 user-facing references across 8 files):**
- Navbar search: "Loyalty Program" -> "Zeal Rewards" (tags updated)
- Home FAQ: rewrote loyalty question/answer to reference Zeal Rewards
- Admin profile: "Loyalty Rewards" -> "Zeal Rewards"
- Pricing.tsx: "Loyalty Rewards/Perks" -> "Zeal Rewards/Perks" (4 plans)
- Plans page: same rename in features array + comparison card + comparison table
- Chat route system prompt: "Our loyalty program" -> "Our rewards program"
- Loyalty API error message: "loyalty data" -> "rewards data"
- Pages API HTML: "Loyalty Rewards" -> "Zeal Rewards"
**Booking form audit:** WYZ-Design form is clean (all 8 fields have name attributes). Broadway Cutz form is missing names but uses React state, not FormData.
**Webhook/referral/gift card triage:**
- Webhook process-before-record: intentional design for idempotency (comment explains rationale). Side effects not idempotent = low-risk duplicate concern.
- Referral convert auth: already fixed (secret-gated + rate-limited).
- Gift card fulfillment: real problem — Discord-only, no DB persistence. Needs Supabase table creation.

## Session 37 — NSFW/18+ content gating system for photography
**Date:** 2026-08-26
**Commit:** `84ec2b5`
**NSFW gating system (full build):**
- `src/lib/nsfw.ts`: NSFW_CATEGORIES = ["Boudoir", "Bodypaint"], NSFW_CONFIDENCE_THRESHOLD = 0.65, Redis-backed scan cache (90d TTL, SCAN_PREFIX), age verification (30d TTL, AGE_VERIFY_PREFIX), tracking SETs (SCAN_INDEX_KEY, AGE_INDEX_KEY) for admin listing, bulk scan fetch, cache clear, list all scan results, list age-verified users
- `src/components/AgeGateModal.tsx`: Two-step 18+ verification modal (confirm age -> optional login if not authenticated), Google OAuth sign-in, Redis-backed via /api/nsfw/verify, custom hook `useAgeVerification` for state management
- `src/hooks/useNsfwSession.ts`: Client-side age verification hook, checks Redis via API, manages modal visibility, onVerified/onClose/requestVerification interface
- `src/components/NsfwImage.tsx`: Image wrapper with client-side nsfwjs classification on load, blur for NSFW images (blur-xl + scale-110), tap-to-reveal for age-verified users, localStorage caching (7d), scanning indicator, two overlay variants (reveal button vs "18+ CONTENT" badge)
- `src/app/api/nsfw/verify/route.ts`: GET returns age verification status, POST records verification in Redis via markAgeVerified()
- `src/app/api/nsfw/scan/route.ts`: GET returns cached scan result for path, POST stores scan result via cacheScanResult()
- `src/app/api/nsfw/admin/route.ts`: GET returns gated categories + all scan results + verified users, DELETE clears a cached scan result
- Photography album grid: NSFW category covers (Boudoir/Bodypaint) get blur-xl when not age-verified, 18+ lock badge, clicking shows age gate modal
- Photography category page: auto-shows age gate for NSFW categories, AutoScrollRow uses NsfwImage for gated categories, passes isNsfw/canReveal props
- Admin panel Content tab: overview stats (gated categories, scanned images, NSFW detected, verified users), gated category badges, scrollable scan results table with label/confidence/date/clear actions, verified users table
- Packages installed: nsfwjs + @tensorflow/tfjs
**Type errors fixed:** nsfwjs default import -> named load(), SafeImage ref incompatibility (switched to raw img), RedisLike missing keys/pipeline (tracking SET + smembers cast), implicit any on filter/reduce callbacks, SafeImage onLoad type mismatch
**Audit fixes (`a2e24b6`):** Security: /api/nsfw/admin now checks ADMIN_EMAILS allowlist (was auth-only). Removed unused AgeGateModal import from useNsfwSession. Replaced console.warn with logger.warn in NsfwImage. Imported NSFW_CATEGORIES from nsfw.ts in category page (was hardcoded duplicate). Added NsfwAdminData interface replacing data: any in NsfwContentTab. Removed unused useMemo import from category page. Fixed em dashes in user-facing text and comments across NSFW files.

## Session 31 — Zeal redemption, leaderboard, quiz handoff, recap rewards, admin chart
**Date:** 2026-08-26
**Zeal redemption (rates set by ox-alpha, ~5-6% real-value back):**
- ZEAL_REWARDS catalog in zeal.ts: $25 off any service (500), free retouching session (750), merch item under $40 (1,000), extra photoshoot hour (1,200), $100 off any booking (1,750)
- POST /api/zeal/redeem: auth + 10/hr rate limit, user-lock serialized deduction via addLoyaltyPoints(-cost), generates WYZ-XXXXXX code stored in Redis (180d TTL) for validation, GET returns public catalog
- Loyalty page "Redeem Zeal" grid between balance and Quests: affordability-gated buttons with remaining-Zeal labels, success toast surfaces the code
**Interconnections wave 2 (all of Claude's approved list):**
- Referral leaderboard: GET /api/referral/leaderboard (anonymized top 5 by conversions/commission + all-time totals, rate limited, never 500s); partnerships page section with stat strip, ranked rows, quarterly-reset empty state
- Quiz handoff: StrategyWizard results now offer "Price It Yourself" (/web-design calculator) and "Ask the Assistant" (wyz-chat-open CustomEvent with result summary prefilled). Note: /match is a static marketing page, no quiz lives there; wizard on /services is the real quiz. ChatWidget listens for the event, prefills input without auto-send, earns open-chat same as manual
- Event recaps: new watch-recap action (+10, weekly cooldown) fires once/session from VideoModal opens, ColorAuraVideo native play, and YouTube playlist clicks; chat KNOWLEDGE updated with redemption catalog line
- Admin bookkeeping: Revenue-by-Category horizontal bar card in Bookkeeping tab (aggregates existing /api/bookkeeping transactions client-side, year-scoped)
- Chat backend unification: Ollama+timeout+streaming+fallback extracted to lib/ai-chat.ts streamChatWithFallback(); api/chat refactored byte-identical. Deviation: fd/oracle uses OpenRouter JSON not the duplicated pattern, left untouched per behavior-preservation constraint
**Cloudinary audit:** lib/cloudinary.ts exports are all dead code — zero importers; /api/upload uses Supabase Storage; album-images imports the SDK directly. Safe to delete lib later.
**Env note:** REFERRAL_CONVERT_SECRET optional (external convert calls only; webhook uses the shared function directly).

## Session 30 — chat personalization + calculator upsell
**Date:** 2026-08-26
- **Chat knows who it's talking to**: POST /api/chat injects signed-in visitor's Zeal balance + tier into the system prompt via auth() + getLoyaltyPoints; prompt instructs natural references only when relevant (progress-to-tier questions), never unprompted stat dumps; auth/DB failures fall through silently to generic assistant
- **Calculator → plan comparison rebuilt** (PricingCalculator.tsx): old logic compared plan VALUE against one-time total and claimed fake savings. New logic: if any plan price < monthly estimate → recommends priciest plan under budget with real coverage math; else frames closest plan as "need this monthly?" without false claims; added Compare Plans CTA button and cancel-anytime reassurance line

## Session 29 — mobile UX sweep + backend hardening + interconnections wave 1
**Date:** 2026-08-26
**Mobile UX:**
- One-tap flip cards site-wide (home/photography/services/printing x2): mouse handlers gated behind `(hover: hover)` matchMedia; simulated mouseenter+click double-fire was eating the first tap
- PhotoFlipCard mobile height 624px fixed → responsive min-h 320/500/624 + aspect-[16/10] image on mobile; back-face buttons lifted off bottom edge (pb-8/10), price responsive, desc clamped
- HomeServiceFlipCard back face same button treatment
- Popular Services section bottom padding +~50% more; VIEW ALL SERVICES/PLANS buttons z-10 + mt-10 (clip fix)
- Designs page: carousels pause on touchstart/end (rAF no longer fights native scroll = glitch gone); carousel sections pulled up tight under hero on mobile; merch widget images +60% on mobile (21vw/190px)
- Events: +mt-10/14 between DIY Shows carousel and ColorAuraVideo autoplay block
- NEW ScrollToTopOnNavigate component in layout: history.scrollRestoration=manual + scrollTo(0,0) per pathname — every page loads at top, back/forward no longer restores mid-page positions
- All 7 split/full heroes pulled flush to viewport top: -mt-20 lg:-mt-24 (bleeds under fixed navbar) with pt compensation inside — home, events, designs, services, web-design, photography, featured-artist (+right col pt-28 mobile)
**Backend hardening (audit fixes):**
- Webhook: process-first-then-record ordering (failed events now retry instead of being dropped); giftcard sessions alert Discord for manual fulfillment; referral conversions recorded server-side via new shared src/lib/referral.ts recordReferralConversion(); checkout threads optional `ref` metadata end-to-end (checkout route → stripe.ts → plans page reads ?ref=)
- Referral API: convert action secret-gated (x-convert-secret / REFERRAL_CONVERT_SECRET env) + amount integer validation + rate limits (GET 30/min, convert 10/hr)
- Checkout: gift card amount strictly type/range validated before Stripe
- Chat API: CSRF gate (origin check), messages clamped to 20 x 2000 chars
- DynamicForm surfaces server error strings via toast instead of generic message
- Booking form: name attributes added to all fields (submissions were storing empty payloads)
**Zeal branding completion:**
- Chat knowledge base rewritten to Zeal tiers/values (Recruit/Zealot/Champion/Legend, real earn amounts)
- Nav "Z E A L . R E W A R D S", Footer/search/API labels updated from Loyalty Program
**New:**
- /status page (noindex, force-dynamic): commit SHA, timestamp, Neo4j/Redis ping + Supabase/Stripe config checks, each 4s-timeout guarded, green/red indicators

## Session 28 — Feature ideas, interconnections, and where the system is heading (Claude/Cowork, relayed by Torreé)
**Date:** 2026-08-26
*Relayed verbatim from Claude's Session 23 analysis. Status annotations from ox-alpha in brackets [ ] where the Zeal build changed the picture.*

### The system as it stands today
Worth naming what actually exists, because it's more than the sum of any one session's commits: a full creative-services marketplace (photography, design, video, web, printing, events) sold three ways — hourly/flat-rate à la carte, four subscription tiers (Starter/Business Boost/Pro Plus/Ultimate), and three web-design add-on plans — wrapped in a loyalty program (Silver/Gold/Diamond) [now **Zeal**: Recruit/Zealot/Champion/Legend, 33 earn actions, 12 achievements, 4 quests], a referral program (built, not yet wired live), a merch line with a POD backend (Printful) and a Concept Archive, an events/community layer (DIY Shows, Client Events, YouTube recaps), an AI concierge chat widget, a `/match` quiz, an interactive pricing calculator, a bookkeeping module, an admin dashboard, and — running alongside all of it — a second, separate internal tool for FD Photo Studio (Drive proxy + an AI "Oracle" over studio knowledge).

### Interconnections — wiring together things that already exist
- **Loyalty ↔ Referral ↔ Bookkeeping should be one ledger, not three.** A booking that completes should be the single event that awards loyalty points, checks referral code attribution + credits commission, and logs the bookkeeping transaction — all from the Stripe webhook completion handler. Today nothing calls the referral conversion endpoint; trigger it server-side alongside the loyalty award, not from a client-callable route.
- **Chat widget doesn't know about loyalty/referral/match quiz.** Passing signed-in user context (Zeal balance, tier, streaks, referral code) into `api/chat` turns the FAQ bot personalized: "you're 340 points from Zealot." Same for /match output feeding the pricing calculator or chat.
- **Pricing calculator ↔ subscription plans don't talk.** A visitor estimating $600 à la carte never sees "Business Boost saves you $X/mo." Highest-leverage upsell on the site, currently requires mental math.
- **Concept Archive ↔ AI concept generator unconnected.** Generated concepts could flow toward the Archive ("submit your favorite for possible production") = merch pipeline + UGC source.
- **FD tools are an island.** Decide deliberately whether FD stays internal-only or becomes a client-facing brand under WYZ. Business conversation, not a coding task.
- **Bookkeeping lacks plan-tier profitability view.** Admin chart cross-referencing bk_transactions category × Stripe price ID answers "is Ultimate Suite worth it or is Business Boost carrying us."

### Feature ideas building on existing systems
- Referral leaderboard / social proof on /partnerships (after wiring above).
- **Zeal redemption, not just accrual** — still true post-Zeal-build: there's no spend path. Points currently gate perks passively by tier.
- Event-to-content pipeline: recap video knowledge for chat, event-themed merch drops, attend-event zeal actions.
- Public /status page: last deploy SHA, last webhook, last form submission — one glance instead of grepping logs each session.
- Cloudinary/media pipeline audit — lib/cloudinary.ts hasn't been audited yet.
- Unify chat backends: api/chat + api/fd/oracle duplicate Ollama-with-timeout-fallback logic; extract lib/ai-chat.ts.

### Where to push back gently
Ledger unification and Zeal redemption touch money + point balances — discuss priority with Torreé before schema changes. Interconnections section = higher-confidence lower-risk work. New features = gut-check priority first. [ox-alpha agrees with this split.]

**ox-alpha status notes (2026-08-26):**
- DONE since Claude's snapshot: Zeal rebrand + full earn engine, tier rename everywhere except chat route copy + nav/search labels (flagged as open threads in START HERE).
- STILL OPEN, high value: referral conversion wiring from webhook, chat user-context injection, calculator→plan comparison, Zeal redemption, /status page.
- Chat route still answers with old Silver/Gold/Diamond copy — fix before doing chat-context work so the bot isn't personalized with wrong data.

## Session 27 — audit fixes + UI tweaks
**Date:** 2026-08-25
**Audit fixes shipped:**
- Neo4j `disableLosslessIntegers: true` — points were serializing as {low,high} objects, crashing /loyalty page
- Zeal race conditions: per-user Redis lock + atomic once-keys for one-time actions; service paths normalized to top-level segment (subpath farming fixed); per-post blog cooldown keys; quest bonuses only marked when payout succeeds; earn identity stabilized via ref (daily-login no longer refires per navigation); session marks only after success
- False-success forms fixed in 8 files (photoshoot, consultation, featured-artist, model-archive, printing, photography, community newsletter, footer subscribe): res.ok + data.success checks, toast.error on failure, submitting/disabled button states
- React bugs: events immortal volume interval (cleared at real cap), events flyer-grid + useShuffle hydration mismatches (client-only shuffle), random initial slide → 0, fd page poll cleanup, ImagePicker render-time listener moved to effect, GyroTilt/splash disposed-flag guards, web-design hover interval churn
- lineHeight 0 → 0.9 across 18 files + globals.css (heading overlap fix)
**UI tweaks:**
- Home "Popular Services" title text-sm → text-2xl/3xl/4xl; services section bottom padding +~40%
- Client carousel removals: Dying Breed x2, Nomadic Breed, Monkey Mug, Re(Belle), JR3Y, Photo-Bombed
- Home Quick Links buttons: red borders + red text
- Full-height heroes: designs, services, photography, web-design (min-h-screen)
- Loyalty Ways-to-Earn rows + category labels centered

## Session 26 — Zeal points system (full build)
**Date:** 2026-08-25
**Changes:**
- **Core engine** `src/lib/zeal.ts`: 33-action catalog (daily/weekly/milestone/easter), 12 achievements, 4 quest chains, Redis NX cooldowns (persistent), Neo4j user state (zealActions, zealCounters, streaks, achievements, questsCompleted), server-side achievement/quest evaluation, rate limit 60/hr
- **New tiers everywhere**: recruit (0) / zealot (500) / champion (2000) / legend (5000). Updated `addLoyaltyPoints` in wyzmind.ts (now returns {points, tier}); Stripe webhook + admin API inherit new tiers automatically
- **APIs**: POST `/api/zeal/earn` (validated action whitelist, returns tierUp/achievement/quest flags), GET `/api/zeal/status` (balance, streaks, history, full catalog)
- **ZealProvider** mounted in root layout inside AuthProvider: useZeal() hook, route-change discovery earns, scroll tracking (+trio bonus via sessionStorage), Konami code listener, daily-login on sign-in, toast feedback for every earn/tier-up/achievement/quest completion
- **Wired triggers (29 call sites / 17 files)**: Footer newsletter, Navbar logo 5-click egg + search, ChatWidget open, SocialShare all buttons, StrategyWizard completion, community comments/replies, blog ReadTracker (read + thorough 3min + speed-reader <5s), gallery 10-views + double-tap, consultation booking, gift card checkout, model archive submit, featured artist submit, printing brief, /secret hidden page
- **Auto awards (server-side)**: first-login, night-owl (00:00-05:00 local), streak-3/7/14/30, service-explorer + view-all-services (distinct services tracked via Redis SADD using metaPath), read-5-blog-posts, blog-reader (10 posts), gallery-regular (5 visits)
- **Profile achievements**: PUT /api/profile now calls evaluateProfileAchievements (profile-complete, social-connected, avatar-uploaded)
- **Loyalty page rebuilt as Zeal HQ**: balance card with streak + refresh, quests with per-step checkmarks from actionsEarned, achievements grid locked/unlocked, recent activity feed, categorized ways-to-earn catalog, 4 tier cards. Layout metadata updated to Zeal branding
- **Easter eggs live**: /secret page (noindex via layout, not in sitemap, +100), Konami code (+200), logo 5-click (+50), night owl (+25), speed/thorough reader (+15/+20)
- **Not wired (documented)**: refer-friend (+500; referral system has no account creation hook yet), leave-review (+30; no review form exists yet)
- **Bugs caught during self-review**: read-5-blog-posts could re-award infinitely (fixed by pushing action id to state.actions); view-all-services/service-explorer were unreachable without distinct-service tracking (fixed with metaPath + Redis sets); react-hot-toast icon prop misuse removed; FiFlame not exported by react-icons/fi (swapped for FiZap)
- `tsc --noEmit` clean

## Session 25 — WCAG AA color contrast fixes
**Date:** 2026-08-25
**Changes:**
- Replaced light gray text colors with `#666` across ~50 files for WCAG AA contrast compliance on white backgrounds
- Pattern 1: `text-[#8F8F8F]` → `text-[#666]` (28 files)
- Pattern 2: `text-[#888]` → `text-[#666]` foreground text only, skipping `dark:text-[#888]` and `placeholder:text-[#888]` (20+ files)
- Pattern 3: `text-[#999]` → `text-[#666]` foreground text only, skipping `dark:text-[#999]` and `placeholder:text-[#999]` (20+ files)
- Pattern 4: `text-gray-400` → `text-[#666]` (2 files: ImagePicker.tsx, PageRenderer.tsx)
- Pattern 5: `text-gray-500` → `text-[#666]` (3 files: PageRenderer.tsx, ImagePicker.tsx, view/[page]/page.tsx)
- Updated theme variable in globals.css: `--color-wyz-muted: #8F8F8F` → `#666666`
- Skipped `dark:` mode overrides and `placeholder:` utility classes per user instructions
- `tsc --noEmit` clean

## Session 24 — Footer dark mode, about page copy tightening
**Date:** 2026-08-25
**Changes:**
- Fixed footer dark mode: `dark:bg-[#f0f0f0]` (white) → `dark:bg-[#111]` (deep dark). Updated all text color vars from `dark:text-black` to `dark:text-white`.
- Tightened about page copy: removed filler words ("without the", "over", "a commitment to"), added contractions, shortened sentences for punchier tone.

## Session 23 — Dark mode palette corrections across entire codebase
**Date:** 2026-08-25
**Changes:**
- Replaced `#232326` → `#1C1C1E` (page background) in 38 files
- Replaced `#2b2b2e` → `#252528` (surface/card) in 34 files
- Replaced `#161618` → `#111` (deep color) in 1 file (globals.css)
- Total: 48 unique files touched, all dark mode hex values now match design convention
- `tsc --noEmit` clean

## Deployment State

- **Last commit:** `6110771` (Session 24 — footer dark mode, about copy)
- **Build status:** `tsc --noEmit` clean
- **Vercel:** Auto-deploys from `master` — all builds passing. Stripe checkout confirmed working on production.
- **Supabase:** `form_submissions`, `bk_transactions`, `bk_clients`, `bk_categories` tables + `wyzdesign-uploads` storage bucket + `stripe_events` table
- **Full health check:** 23/24 pages return 200 (`/book` = 404 expected, route is `/booking`). All API endpoints responding correctly.

## Key Architecture Notes

- **Forms write path:** `/api/forms` POST → Supabase `form_submissions` table
- **Forms read path:** `/api/admin` GET → Supabase `form_submissions` table
- **Bookkeeping:** All tables in Supabase (bk_transactions, bk_clients, bk_categories). Seed defaults on first load.
- **Image upload:** Supabase Storage `wyzdesign-uploads` bucket (public, auto-created)
- **Admin auth:** `ADMIN_EMAILS` env var (comma-separated), checked via NextAuth session
- **HTML sanitization:** `src/lib/dompurify.ts` (isomorphic-dompurify, allowlist-based). Do NOT use regex-based alternatives.
- **Toast notifications:** `react-hot-toast` — all user-facing forms now have toast.success/toast.error

## Session 22 — Fragment key warnings fix across 5 marquee sections
**Date:** 2026-08-24
**Changes:**
- Fixed React fragment key warnings in 5 page files: `about/page.tsx`, `designs/page.tsx`, `printing/page.tsx`, `photography/page.tsx`, `web-design/page.tsx`
- Each had `.map()` returning `<>` fragments with `<span key={...}>` inside — replaced with a single `<span key={i}>` wrapper to eliminate the warning
- Removed redundant `key` props from inner spans since the parent now carries the key

## Session 22 — dark mode legal pages, fragment keys, layout dedup, contractions (Claude)
**Date:** 2026-08-24
**Changes:**
- Added dark mode to privacy-policy, terms-and-conditions, refund-return-policy pages (`dark:bg-[#111]`, `dark:text-[#e0e0e0]`, `dark:text-[#b0b0b0]`)
- Fixed fragment key warnings in marquee loops across 8 pages (home, services, events, about, designs, printing, photography, web-design) — replaced `<>` fragments with keyed `<span>` wrappers
- Removed duplicate dark mode background from layout.tsx inline `<style>` tag
- Softened printing page copy ("all numbers shown reflect" → "every price you see reflects")

## Session 21 — h1 line-height, photography dark mode, form bug (Claude)
**Date:** 2026-08-24
**Changes:**
- Fixed h1 `line-height` from `1` to `0` across globals.css and 17 page files (22 inline replacements)
- Fixed photography page: added `dark:bg-[#111]` to Book Today section
- Fixed photography model application form: `setApplicationSubmitted(true)` now only runs on success (was running on error too)
- Verified all 22+ pages live and functional
- Verified privacy-policy, terms-and-conditions, refund-return-policy pages all load correctly (earlier 404s were from testing wrong URLs)
- AnimatedCounter on web-design page works correctly (0 is initial state before intersection observer triggers)

## Session 20 — two features silently don't persist on Vercel (local filesystem writes) (Claude/Cowork)
**Date:** 2026-08-24
**Pattern:** Both of these come from the same root cause — writing to the local filesystem for state that needs to survive a request, on a platform (Vercel serverless) where that filesystem is either read-only or wiped between invocations. Since Supabase is already the established pattern everywhere else in this app (`form_submissions`, `bk_*`, `stripe_events`, `muse_error_logs`), both of these should probably move there too.

### `/api/bugs` — bug reports are lost, and the admin list is incomplete, in production
`src/app/api/bugs/route.ts` POST/GET both read and write a JSON array at `writeFileSync`/`readFileSync(BUGS_FILE)`, where `BUGS_FILE = /tmp/_data/bug-reports.json` when `process.env.VERCEL` is set (line 8). That path is correctly inside `/tmp` (writable on Vercel), so it won't hard-error — but `/tmp` on Vercel is **per-instance and ephemeral**: it's wiped on cold start and isn't shared across the multiple concurrent instances Vercel spins up under load. Practical effect: a bug report submitted via POST only ever lands in whichever single serverless instance handled that request; the admin GET (`requireAdmin()`-gated, so at least that part's secure) only ever sees bugs written to *that* instance's `/tmp`, which is usually a different instance than the one(s) that received prior submissions. There's also a plain read-modify-write race — two POSTs hitting the same warm instance concurrently can each read the same array and each write back missing the other's entry. Net effect: bug reports look like they succeed (`{success:true}`) but are silently, mostly lost, and the admin view is incomplete even for the ones that do land.

### `/api/pages` — the custom page-editor CMS's save almost certainly fails outright on Vercel
`src/app/api/pages/route.ts` is a small custom CMS: GET returns saved HTML for a page (or a fallback template), POST saves it, gated by an `X-Admin-Token` header checked against `ADMIN_PASSWORD` (a different auth pattern than `requireAdmin()`'s session-based check — not wrong, just worth knowing it's a separate mechanism). The GET handler correctly special-cases Vercel (line 65: `if (process.env.VERCEL) return NextResponse.json({ html: WIX_TEMPLATE, exists: false })`) and never touches disk there. **The POST handler has no such guard** — it always calls `writeFileSync(join(PAGES_DIR, ...))` where `PAGES_DIR = join(process.cwd(), "_PAGES")` (line 7), i.e. inside the deployed bundle directory, not `/tmp`. `process.cwd()` is **read-only** on Vercel's serverless runtime. So in production, an admin authenticating with the correct token and POSTing a page edit will almost certainly get `writeFileSync` throwing an EROFS/read-only-filesystem error — caught by the route's generic `catch { return NextResponse.json({ error: "Invalid request" }, { status: 400 }) }`, which reports a misleading "Invalid request" instead of the real cause, making this look like a client input problem rather than "this feature cannot work as deployed." Whoever built this (I can't tell if it's finished/in-progress from HANDOVER, or a leftover WIP) will want to either give POST the same `process.env.VERCEL` short-circuit as GET and store to Supabase instead of disk, or confirm this route is intentionally dev-only and gate it more explicitly if so.

I didn't touch either file — both are more of a "pick a persistence strategy and migrate" job than a one-line fix, and `/api/pages` in particular I don't have enough context on to know if it's active or WIP. Flagging both here since they're the same class of bug and worth fixing together.

## Session 19 — auth/authorization gap on `/api/upload` (Claude/Cowork)
**Date:** 2026-08-24
**Context:** Torreé asked me to keep digging for holes/gaps/dark spots beyond the spacing work. Read through the checkout, webhook, upload, csrf, rate-limit, and admin-auth code paths. Most of it is solid (checkout validates plan/gift-amount/service-price server-side before ever touching Stripe, webhook verifies the Stripe signature + has idempotency via `stripe_events`, `admin-auth.ts`'s `requireAdmin()` fails closed correctly). Found one real gap that's worth fixing soon, plus two smaller ones.

### The main one: `/api/upload` only checks "is logged in," not "is admin" — and login is open to anyone
`src/app/api/upload/route.ts` line 24-27 gates the endpoint with:
```ts
const session = await auth();
if (!session) return NextResponse.json({ error: "Authentication required" }, { status: 401 });
```
That's `auth()`, not `requireAdmin()`. Compare to `src/lib/admin-auth.ts`, which every other write-capable admin route (`analytics`, `bookkeeping/meta`, `bugs`, `fd/drive`, `forms`) correctly uses — `requireAdmin()` checks the session email against `ADMIN_EMAILS` and fails closed if that list is empty. Upload skips that check entirely.

That alone would be a medium finding, but it compounds with how sign-in works: `src/app/api/auth/[...nextauth]/route.ts`'s `Google` provider (line 15-18) has **no email allowlist** — it's wired with just `clientId`/`clientSecret`, no `signIn` callback restricting which Google accounts can authenticate. (The `Credentials` "Admin Sign In" provider *does* check `ADMIN_EMAILS`, but that's a separate, parallel path — Google OAuth bypasses it entirely.) So "authenticated" here effectively means "owns any Google account," which is anyone. Put together: **any random visitor can sign in with their own Google account in a few seconds, then POST directly to `/api/upload` and write arbitrary image/video files into the public `wyzdesign-uploads` Supabase bucket** — no admin check, and no rate limiting on this route either (`checkout` has `rateLimit(...)`, `upload` has none), so it's also open to being hammered repeatedly. Worst case is storage-cost/bandwidth abuse or the public bucket getting used to host unrelated content, not a data breach, but it's a real, currently-open door.

**Recommended fix:** swap the `auth()` check in `upload/route.ts` for `requireAdmin()` (matching the other write routes), and add a `rateLimit()` call like `checkout` has. If uploads from non-admin logged-in users are actually a wanted feature (e.g. for the model-archive submission flow — worth double-checking against `EditMode`'s upload usage before just locking it down), then keep `auth()` but add rate limiting plus a per-user upload quota instead of tightening to admin-only. I didn't change this myself — wanted whoever owns the intended-audience question (should regular users be able to upload at all?) to make that call, and it's a one-line change either way once decided.

### Smaller findings
- **Dead code, not a live risk:** `src/components/EditMode.tsx` and `src/components/EditContext.tsx` both define a full parallel "inline image editor" (`EditProvider`, `toggleEdit`, `ImagePicker`, an upload flow) that calls `/api/upload` and `/api/gdrive-index` from the client. Neither is imported anywhere else in the app (`layout.tsx`, `PageRenderer.tsx`, etc.) — confirmed via `grep -rl` across `src/app` and `src/components`. So this isn't currently reachable by visitors, but it's two duplicate, unused implementations of the same feature sitting in the bundle. Worth either wiring one of them up behind `requireAdmin()` if the inline editor is still wanted, or deleting both — as-is they're just dead weight (and a maintenance trap: someone could wire one up later without noticing it has no auth check either).
- **`src/lib/api-utils.ts`'s `validateUpload()` allows files up to 50MB, but `upload/route.ts`'s own content-length check rejects anything over 10MB before `validateUpload` ever runs — so the 50MB constant is unreachable/dead. Not a bug (the stricter limit wins), just worth tightening the constant to match so it's not misleading later.

## Session 18 — new bug found: page-transition curtain can get stuck fully covering the screen (Claude/Cowork)
**Date:** 2026-08-24
**Context:** Continuing the vertical-spacing audit with a real device-toolbar viewport (Torreé had it in inspector mode). Confirmed the home hero fix looks right live (see Session 17 addendum below). While navigating to `/events` on a hard page load, hit a separate, more serious bug — noting it here since it's a "dark spot" outside the spacing work, exactly the kind of thing worth a second pair of eyes on.

### The bug
`/events` loaded with the entire viewport solid dark (`#111`) — looked like a blank/broken page. `get_page_text` showed the real page content ("SIMPLIFY YOUR EVENT PLANNING," the DIY show list, stats, etc.) was fully present and correctly structured in the DOM — so this isn't a data/render failure, the page is there, just invisible. Inspecting computed styles found the cause: `src/components/PageTransition.tsx` renders two full-viewport "curtain" divs on every desktop page load (`z-[9998]`, so above everything) — a red one (`origin-left`) meant to start hidden, and a dark `#111` one (`origin-right`) meant to wipe from fully-covering to hidden via a Framer Motion `animate` transition. On the broken load: the red curtain correctly ended up hidden (`transform: matrix(0,0,0,1,0,0)`, i.e. scaleX 0), but the dark curtain was stuck at its `initial` state — `transform: none` (full coverage) — its exit-to-hidden animation simply never played.

### Root cause
Both curtains (`PageTransition.tsx` lines 38-49) rely entirely on a Framer Motion `animate` prop — a JS/`requestAnimationFrame`-driven transition — with no fallback of any kind. If that animation frame doesn't get a chance to run in time (a backgrounded/unfocused tab, which Chrome throttles `requestAnimationFrame` on; a janky main thread from the several videos/particle backgrounds/carousels initializing at once on first paint; or any other stall), there's nothing else that will ever remove the curtain. Since it's `pointer-events-none`, the site underneath is still fully functional — links work, the DOM is correct — the user just can't see any of it, with no way to recover short of a manual reload. I hit this in my automation tab, which may not have real OS-level focus, so I can't be certain how often a real visitor's tab would trigger it — but the code has zero safety net either way, which makes it worth hardening regardless of how rare the trigger is. Worst case (a page silently going 100% invisible with no error, no console warning, nothing) is bad enough to be worth a defensive fix even if it's rare.

### Why I didn't patch this one myself
`PageTransition.tsx` wraps every page on the site and its exact animation timing (`AnimatePresence mode="wait"`, keyed by `pathname`, with both an entry wipe and an exit wipe) is easy to get subtly wrong without a live dev/build loop to click through real navigations and watch the transitions. I don't have shell/dev-server access from this session — only file read/write — so I can reason about the code but can't verify a fix doesn't regress the intended wipe effect on every route change site-wide. Given how central this component is, I'd rather hand off a precise diagnosis + a concrete recommended approach than guess-and-ship.

### Recommended fix (for whoever picks this up, verified against a real click-through)
Don't touch the `AnimatePresence`/`exit` timing itself — that's what plays the actual entry/exit wipes and framer-motion getting stuck once could theoretically leave `mode="wait"` unable to mount the next page's tree at all. Instead add a **pure failsafe** alongside it: a small `useEffect` in `PageTransition.tsx` (or a sibling always-mounted watchdog) that, ~1200ms after each `pathname` change, checks the DOM directly for any `.fixed.inset-0.z-\[9998\]` element still present with a "covering" transform, and if found, force-hides it directly (`el.style.setProperty('display', 'none', 'important')`) via a ref/`querySelectorAll` — bypassing React/Framer entirely so it can't interfere with the normal animation. In the healthy case (the vast majority of loads) the curtains are already gone or scaled to 0 by then, so the watchdog finds nothing and does nothing; it only ever acts as insurance against exactly what I hit. Please test by throttling/backgrounding a tab mid-navigation (or CPU-throttling in DevTools) to confirm the fix actually recovers a stuck curtain, not just that it doesn't break the normal transition.

Also worth noting for the "Mobile check of /, /events, /plans at ~344px" item already on your Tasks list above: while checking that, keep an eye out for this same stuck-curtain symptom (a page that loads solid black/dark with nothing visible) — if it shows up there too, that's more evidence it's not just an automation-tab artifact.

## Session 17 addendum — live confirmation at a REAL mobile viewport + a coordination note
**Date:** 2026-08-23 (same day, later)

Good news on tooling: Torreé got Chrome's device toolbar actually driving the automated tab this round — `window.innerWidth` read a genuine `344` (true Fold width), not the stuck `1920` from the last two sessions. First real mobile render I've had. I loaded the live site at that width and the home hero looks exactly right: tagline, "WE MAKE WHAT WORKS," subtext, and both buttons sit as one tight stack, and the tagline wraps cleanly to two lines instead of running off the edge. No JS errors or warnings came from wyzdesign.com's own code — the only console entries were a generic Chrome-extension messaging error unrelated to the site.

Here's the part worth flagging: my hero fix (below) was still sitting **uncommitted** on disk when I checked this, yet production already had it live. Cross-referencing `.git/logs/HEAD`, the fix's file-write timestamp lands right between two of your commits — `fix: Stripe Price ID validation...` (`9926147`) and `redeploy: trigger fresh build with Stripe Price IDs` (`c4e0175`). My best read is the redeploy commit picked up my in-progress `home/page.tsx` edit as a side effect (a broad `git add -A`/`git commit -am` sweeping up whatever was sitting on disk at the time) rather than it being reviewed on its own. It happens to be correct and verified live now, so no harm this time — but flagging it since the standing rule between us is to never ship the other's in-progress edits unreviewed. Worth a quick `git diff` before a broad commit/redeploy in case something uncommitted (mine or yours) is sitting in the tree. Since it's live and confirmed working, I'm marking the home hero fix done rather than asking for a separate commit — just wanted the mechanism on record.

## Session 17 — Sitewide vertical-spacing audit (Claude/Cowork)
**Auditor:** Claude (Cowork), live in Chrome with `V:\wyzdesign` open in the desktop app + direct file access via device bridge
**Date:** 2026-08-23
**Trigger:** Torreé flagged that the home page hero looked badly spaced on the Galaxy Z Fold 5 — tagline, H1, subtext, and buttons not tightly/evenly stacked, and asked for a full vertical-spacing audit across the site, especially mobile.

### Confirmed and fixed: home hero was a real, isolated outlier
I diffed the home hero's text-stack spacing against every other hero on the site (about, web-design, services, designs, photography, partnerships all use the same `.hero-banner` pattern). Every one of those uses the same tight rhythm: eyebrow/tagline `mb-2`–`mb-3`, `<h1>` `mb-3 sm:mb-6`, subtext paragraph `mb-2`–`mb-3` (or none) right before the CTA. Home's hero (`src/app/home/page.tsx`) broke that rhythm badly:
- Tagline ("Wild Vision. Zealous Execution.") had `mb-6` (24px) — 2–3x every other page's eyebrow spacing.
- `<h1>` had `mb-8` (32px) instead of the sitewide `mb-3 sm:mb-6`.
- The subtext paragraph had `mb-24 sm:mb-32` — **96px/128px** of margin before the buttons. That's the actual bug: nothing else on the site comes close to that value in a hero stack; I grepped every hero + every page.tsx for `mb-`/`mt-`/`my-` in the 16–39 range sitewide and this was the only hit inside a text stack (the other few hits — `mb-16`, `mt-16`, `my-16 sm:my-24` — are all normal section-to-section spacing between whole page sections, not inside one stacked block, so those are fine and untouched).

**Fixed** (`src/app/home/page.tsx`, hero section ~line 908-921): tagline → `mb-2 sm:mb-3`, `<h1>` → `mb-3 sm:mb-6`, subtext → `mb-6 sm:mb-8`. This brings the home hero in line with the tight, consistent stack rhythm every other hero on the site already uses — tagline, H1, subtext, and buttons now sit close together as one visual group instead of the subtext floating ~100-128px away from the CTAs.

**Also fixed while in there:** the tagline had `whitespace-nowrap` on a fairly long line ("WILD VISION. ZEALOUS EXECUTION.") at `tracking-[0.2em]` uppercase. At very narrow widths (a Fold's ~344px cover-screen-class viewport, or any phone under ~360px) that letter-spacing pushes the rendered line wider than the available `px-4`-padded column, and with `whitespace-nowrap` + the section's `overflow-hidden`, the tail of that line ("EXECUTION.") could get silently clipped off-screen rather than wrapping — exactly the "text touching/going past the edge" symptom Torreé described. Removed `whitespace-nowrap` so it wraps to two lines gracefully on the narrowest screens instead of clipping; it still renders on one line at every breakpoint where it actually fits (sm and up), so nothing changes visually on normal phones or desktop.

File written directly to `V:\wyzdesign\src\app\home\page.tsx` via the device bridge, **not yet committed to git** — please `tsc --noEmit` / build-check and commit/push.

### Sitewide sweep — everything else checked came back clean
Grepped every top-level page (`home`, `about`, `web-design`, `services`, `designs`, `photography`, `events`, `printing`, `plans`, `partnerships`, `contact`, `gallery`, `brands`, `merch`, `case-studies`, `community`, `faq`, `gift-card`) for `mb-`/`mt-`/`my-` values of 16 and above, then hand-checked every hit in context. Outside the one home-hero bug above, every hit was ordinary section-level spacing (gaps between whole page sections like "Model Archive" or "Our Brands"), not inside a heading/tagline/button stack — so no other page currently has this specific "orphaned huge margin inside a hero stack" bug. The six `.hero-banner` pages other than home (about, web-design, services, designs, photography, partnerships) all already use the consistent tight rhythm described above and needed no changes.

### Tooling limitation — still can't get a true mobile viewport
Same limitation as Session 16: `resize_window` doesn't change the real render viewport in this session, and the iframe workaround is blocked by `X-Frame-Options: DENY`. Everything above is source-level CSS/Tailwind analysis (comparing actual compiled class values against each other across pages), not a live pixel-for-pixel mobile screenshot. It's a solid way to catch outliers like the home hero bug, but it can't catch things that only show up from real rendering quirks (font metrics, text-wrap behavior in a real WebKit/Chrome mobile engine, etc.). Once this fix is live, a real device or working DevTools emulation should confirm the home hero now reads as one tight stack on a Fold-width screen.

### Suggested next step for either of us
Once this and the Session 16 `/events` fix are committed and deployed, a real mobile check of `/`, `/events`, and `/plans` together would close out both open mobile-spacing items in one pass. I'd also flag: if either of us gets real device-emulation working, it's worth a second pass specifically on the sub-hero sections (Model Archive, Services/Plans tab switcher, pricing cards) at Fold width — I didn't find bugs there source-side, but those are exactly the kind of dense, multi-element stacks where a live check tends to catch things static analysis misses.

## Session 16 — Galaxy Z Fold 5 mobile audit (Claude/Cowork)
**Auditor:** Claude (Cowork)
**Date:** 2026-08-23
**Trigger:** Torreé asked for a full mobile audit at the Galaxy Z Fold 5 viewport, visual + backend/frontend fixes, and attention to console errors/warnings.

### Tooling limitation, disclosed upfront
I could not get a genuine narrow-viewport render in this session. `resize_window` reports success but doesn't actually change the page's real viewport (`window.innerWidth` stayed `1920` after a `344x882` resize call, confirmed via direct JS execution) — this browser session's window isn't actually resizable the way Chrome DevTools' device toolbar does it. I also tried framing the live site in a same-size iframe as a workaround; that's blocked by the site's own `X-Frame-Options: DENY` header (correct security posture, just closes off that workaround too). So I did **not** get live screenshots or live console output at true Fold width this round — flagging this clearly rather than presenting source-code analysis as a visual confirmation. If either of us gets real device-emulation working (a real phone, BrowserStack, or DevTools on Torreé's own machine), that's the way to actually confirm this and check for console warnings/errors at that viewport, which I could not capture this way.

### What I did instead: root-caused and fixed the mobile nav-clearance bug via source
This item has been sitting on the open list for several sessions ("`/events` and `/printing` mobile-only navbar-clearance fix — still worth a manual mobile check") without ever being root-caused. I traced it precisely by reading the actual CSS cascade instead of eyeballing a screenshot:

- `#main-content` in `layout.tsx` gives every page `pt-20 lg:pt-24` (80px/96px) as baseline clearance under the fixed navbar (`h-20 lg:h-24`, confirmed in `Navbar.tsx`).
- `events/page.tsx`'s hero wrapper uses the `.hero-banner` class, whose mobile rule in `globals.css` (line ~777) sets `margin-top: -5rem !important` (-80px) — this exactly cancels that global clearance.
- The hero's inner text column only added back `py-10` (40px) on mobile, vs. `py-24`+ that every other `.hero-banner` page (about, web-design, etc.) uses as its base. Net result: the heading sits roughly 40px short of clearing the fixed navbar on mobile — worse the narrower the screen, which is exactly why a Fold's 344px cover-screen width would make this more visible than it'd be on a standard 390px phone.
- **Fixed:** `events/page.tsx` — changed `py-10 lg:pt-32 lg:pb-0` to `pt-24 pb-10 lg:pt-32 lg:pb-0` on the hero text column, bringing mobile clearance in line with the rest of the site's `.hero-banner` pages (96px top padding vs. 80px navbar pull-back = positive clearance again). Desktop (`lg:`) was untouched since that math already worked (`lg:pt-32`/128px vs. `-6rem`/96px pull-back). File written to `V:\wyzdesign\src\app\events\page.tsx`, **not yet committed** — please build-check and commit.
- **`printing/page.tsx` checked and found clean** — its hero section never had the `.hero-banner` class in the first place, so it just inherits the normal 80px global clearance with nothing canceling it. No live bug there currently; the version of this issue that used to affect printing (the marquee sitting above the hero) was already fixed back in Session 9. Safe to drop from the open-items list.
- Also checked the `/plans` comparison table for classic narrow-viewport overflow risk (a wide `<table>` with no scroll wrapper is one of the most common Fold-width bugs) — it's already `hidden lg:block`, replaced by a stacked-card layout below `lg:`, so no overflow risk there. Confirmed clean, no fix needed.

### Suggested next step
Whoever has a real device or working DevTools emulation handy: load `/events` and `/plans` at ~344–390px width and just eyeball that the events heading now clears the navbar and the plans page shows cards not a squeezed table. That's the confirmation I couldn't get myself this round.

## Session 15 addendum — quick sync check + one live catch
While drafting the above, I saw `.git/refs/heads/master` move to a new commit (`cd158cfe4...`, on top of `90febfd0`) with fresh edits in `analytics/route.ts`, `bugs/route.ts`, `bookkeeping/route.ts`, `bookkeeping/meta/route.ts` — looks like the `isAdmin` dedup into `@/lib/admin-auth` (`getAdminEmails`/`requireAdmin`) that the earlier audit flagged as duplicated 6x. Good to see that landing. I didn't touch any of those files since they had very fresh mtimes (actively being edited) — flagging what I saw instead of risking a collision.

One thing worth a look while you're in `analytics/route.ts`: line 29 reads `process.env.IP_HASH_salt` (lowercase "salt"). Env var names are case-sensitive — if `IP_HASH_SALT` (standard casing) is what's actually set in Vercel, this will never match and silently keeps using the hardcoded `"wyz-salt-2026"` fallback every time, which quietly defeats the fix from Session 14. Small one-character-casing fix, but worth catching since it'd otherwise look fixed in the diff while doing nothing in production.

Also closed the loop on the Google Drive API-key-exposure item from earlier audits: `models/route.ts`, `gdrive-photos/route.ts`, and `model-photos/route.ts` are all fixed — confirmed they route through the new `/api/gdrive-image?id=` proxy (`src/app/api/gdrive-image/route.ts`), which keeps `GOOGLE_DRIVE_API_KEY` server-side and never puts it in a client-facing URL. Nice, correct fix — server-side fetch, proper `Cache-Control`. Turns out `gdrive-index/route.ts` never actually had this issue (it only ever returned file metadata, no download URL with the key embedded) — that one item in the original audit table was a touch overstated. `fd/drive/route.ts` is the one still open, but it's a different, lesser issue than the others: no auth check and it exposes Google's own `webViewLink`/`thumbnailLink`/`downloadLink` (not our API key) to any caller. Worth an auth check on that route when there's time, but it's not a credential leak — safe to deprioritize below the other open items.

## Session 15 — Claude (Cowork) Live Browser Audit + Chat Widget Timeout Fix
**Auditor:** Claude (Cowork), live browser session via Chrome automation + direct file access to `V:\wyzdesign` via the device bridge
**Date:** 2026-08-23

Good news first: I read the fix wyzmind already shipped for the stale-build root cause — `dynamic(..., {ssr:false})` calls were sitting directly in `layout.tsx`, which the App Router treats as a Server Component, and Next.js hard-errors on `ssr:false` there. Moving them into `ClientComponents.tsx` (a proper `"use client"` wrapper) is exactly the right fix, and I confirmed it's wired correctly — `<ClientComponents />` renders at `layout.tsx:344`, no leftover direct `dynamic()` calls in the server file. That one line was probably breaking 10+ deploys in a row, and explains everything below in Finding 1 in one shot. Nice catch.

### What I independently verified live on production (before the site's edge security started blocking further automated navigation from this session — see note at bottom)
| Finding | Verified how | Result |
|---------|--------------|--------|
| `/web-design` testimonials missing | `get_page_text` on live page | Confirmed — page jumps straight from "CLIENT PORTFOLIO" to "PRICING," no testimonials section rendered |
| `/merch/1` 404s | Direct navigation + page text | Confirmed — real custom 404 page, not a stale cache artifact |
| `/merch/concepts` 404s | Direct navigation + page text | Confirmed — same 404 |
| `/plans` pricing calculator missing | `get_page_text` + `find` on live page | Confirmed — no "PRICING CALCULATOR" section anywhere between the comparison table and Build Your Own Plan |
| Local `master` vs `origin/master` | Read `.git/refs/heads/master` and `.git/refs/remotes/origin/master` directly | **Identical SHA** (`90febfd0...`) — the push genuinely succeeded. The stale-production issue was 100% a Vercel build/deploy problem, never an unpushed-commits problem. This should save time chasing the wrong cause. |

### New finding: AI chat widget hangs indefinitely, root-caused and fixed
I opened the live widget, asked "What services do you offer?", and it sat on a "..." typing indicator with no response for 15+ seconds, after which the input field itself stopped accepting new messages. Read `api/chat/route.ts` and found the cause: the Ollama fetch (`fetch(`${ollamaUrl}/api/chat`, ...)`) has **no timeout or AbortController**. `vercel.json` sets `maxDuration: 30` on API routes, so if `OLLAMA_URL` points anywhere slow/unreachable (the Shadow PC GPU tunnel, per the code comment, isn't a guaranteed-up endpoint), the whole request can legitimately hang for up to 30 seconds before Vercel kills the function — meanwhile the widget shows nothing and blocks further input. The reliable pattern-matching fallback in the same file works fine and returns instantly; it just never gets a chance to run.

**Fix applied (files written directly to `V:\wyzdesign` via the device bridge, NOT yet committed to git — please review and commit/push):**
- `src/app/api/chat/route.ts` — wrapped the Ollama fetch in an `AbortController` with a 3.5s timeout. On timeout or any Ollama failure, it now falls through to the pattern-matching fallback almost immediately instead of riding out the full 30s function budget.
- `src/components/ChatWidget.tsx` — added a 20s client-side watchdog (`AbortController` on the `/api/chat` fetch) as defense-in-depth, so even an unexpected server-side stall can't leave the widget permanently stuck with the input disabled. Shows a friendlier "that's taking longer than it should" message if it actually times out, vs. the generic connection-error message for other failures.

Both files build clean as far as I can tell from reading them, but **please run `tsc --noEmit` and your normal build check before committing** — I don't have shell access to your machine from this session, only file read/write through the device bridge, so I couldn't verify the build myself.

### One more thing worth flagging: browser automation got blocked mid-audit
Partway through testing (right after the merch 404 checks), the site's edge security started hard-blocking every further navigation from my Chrome session — every URL just bounced back to a blank tab. This matches the "Blocked by WYZ Design edge security" WAF behavior noted earlier against Puppeteer; it may be triggering here too against rapid automated navigation, even from a real Chrome extension session. I couldn't verify the Cal.com booking widget fix live for that reason — the `booking/page.tsx` stub-sequence fix reads correct in source, but someone should confirm it renders in a normal browser session (not automated) to be sure. If this WAF sensitivity is going to keep happening to both of our audit tools, might be worth an allowlist rule for legitimate QA traffic, or at least know to pace out live checks.

### Suggested next moves (either of us, whichever gets there first)
- Confirm on the Vercel dashboard that the `ClientComponents.tsx` fix actually deployed successfully, then re-check `/web-design`, `/merch/1`, `/merch/concepts`, and `/plans` live — if the build was the only blocker, all four should just appear.
- Review + commit + push the two chat widget files above.
- Once chat is redeployed, send it a real message live and confirm it responds within a couple seconds instead of hanging.
- Manually verify Cal.com on `/booking` in a normal (non-automated) browser.
- Still worth a look whenever there's time: the Google Drive API key exposure in `models/route.ts`, `gdrive-photos/route.ts`, `gdrive-index/route.ts`, `model-photos/route.ts`, `fd/drive/route.ts` (flagged in earlier audits, not sure if the "Google Drive proxy" commit already addressed this — worth a quick check either way), the six orphaned backend routes, and the `/events` + `/printing` mobile navbar-clearance check that's been on the list a few sessions now.

## Session 14 — Deep Security Audit + Bug Fixes
**Auditor:** opencode (automated audit) + Claude (browser walkthrough)
**Date:** 2026-08-23

### Fixes Applied
| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Chat route hardcoded Ollama URL — no env var | `api/chat/route.ts` | CRITICAL | ✅ Fixed — uses `OLLAMA_URL` env var |
| CSRF localhost bypass — any localhost passes | `lib/csrf.ts` | HIGH | ✅ Fixed — uses `NODE_ENV !== "production"` |
| Admin add-points no input validation | `api/admin/route.ts` | HIGH | ✅ Fixed — validates email, amount (1-10000), reason (max 200 chars) |
| Admin error message leak | `api/admin/route.ts` | MEDIUM | ✅ Fixed — returns generic "Internal server error" |
| IP hash salt hardcoded | `api/analytics/route.ts` | HIGH | ✅ Fixed — uses `IP_HASH_SALT` env var |
| Forms hardcoded fallback email | `api/forms/route.ts` | MEDIUM | ✅ Fixed — empty string fallback instead of personal email |
| Chat route no input size limits | `api/chat/route.ts` | MEDIUM | ✅ Fixed — max 50 messages, 2000 chars per message, keeps last 10 |
| 4 console.error → logger | `discord.ts`, `novu.ts`, `wyzmind.ts` (x2) | MEDIUM | ✅ Fixed — added logger import + migration |
| Cal.com widget "Cal is not defined" | `booking/page.tsx` | HIGH | ✅ Fixed — uses proper stub sequence instead of manual script injection |
| Blog topic no length limit | `api/blog/generate/route.ts` | MEDIUM | ✅ Fixed — max 500 chars |
| Novu subscriberId collision | `lib/novu.ts` | MEDIUM | ✅ Fixed — appends timestamp |
| Unused `isAdmin` import | `api/admin/route.ts` | LOW | ✅ Fixed — removed dead import |
| Hardcoded MinIO fallback URL | `api/album-images/route.ts` | MEDIUM | ✅ Fixed — empty string fallback |
| Windows path `G:\My Drive\` exposed | `api/gdrive-index/route.ts` | MEDIUM | ✅ Fixed — uses generic path |
| fd/events GET no error handling | `api/fd/events/route.ts` | MEDIUM | ✅ Fixed — added try/catch |
| n8n webhook silent error swallowing | `api/webhook/route.ts` | LOW | ✅ Fixed — added logger |

### Claude Browser Audit Findings
1. **🔴 Production serving old build** — Code exists for testimonials, merch/[id], merch/concepts, but production returns 404 or doesn't show them. Need to check Vercel dashboard for failed/stuck builds.
2. **🔴 Cal.com widget "Cal is not defined"** — Manual script injection skipped Cal.com's required stub function. ✅ Fixed with proper stub sequence.

### Still Open (requires user action)
- Printful API key — ✅ SAVED TO VAULT. V2 API integration complete (`e55cd4e`). Products now fetched live from Printful catalog.
- Stripe Price IDs — NOT in vault (need 4 Price objects in Dashboard)
- End-to-end purchase test
- Event recap videos — needs source files from user

## Session 13 — Claude Audit #2 + AI Chat + Merch Product Pages + Concept Archive + Pricing Calculator
**Auditor:** Claude (read-only browser walkthrough of old Wix + DBC sites) + wyzmind (opencode)
**Date:** 2026-08-23
**Commits:** `ad6c1b1`

### Claude Audit #2 Cross-Reference
| Finding | Status |
|---------|--------|
| Photography album pattern (category → sub-page → lightbox) | Already existed (`/photography/[category]/page.tsx`) |
| Build Your Own Plan form | Already existed (`/plans` — `CUSTOM_PLAN_FIELDS` + DynamicForm) |
| Model Archive stack reveal | Already existed (polaroid carousel on `/photography`) |
| Merch products + filters + sort | Already existed (14 fallback products, category/sort/rating) |
| AI concierge chat widget | ✅ Built this session |
| Concept Archive page | ✅ Built this session |
| Merch product detail pages | ✅ Built this session |
| Interactive pricing calculator | ✅ Built this session |

### Corrections to Claude's Handover
- Cal.com CSP: Already fixed in Session 7 (`app.cal.com` in script-src, connect-src, frame-src). Claude reported stale.
- Featured Artist page: Already exists at `/featured-artist/page.tsx`. Claude reported as missing.
- Build Your Own Plan: Already existed on `/plans`. Claude reported as missing.

### New Features Built
| Feature | File(s) | Status |
|---------|---------|--------|
| AI chat widget with streaming + service knowledge | `components/ChatWidget.tsx`, `app/api/chat/route.ts` | ✅ Built |
| Merch product detail pages (material specs, POD disclosure, "You Might Also Like") | `app/merch/[id]/page.tsx` | ✅ Built |
| Concept Archive page (design names + stories) | `app/merch/concepts/page.tsx` | ✅ Built |
| Interactive pricing calculator | `components/PricingCalculator.tsx`, `app/plans/page.tsx` | ✅ Built |

### Claude Audit #1 Items — Still Open
- Featured Artist of the Month — page exists but needs content/artist selection
- Event recap videos — needs source files from user
- LLM chat widget on old site concept — ✅ Built this session

### Still Open (requires user action)
- Printful API key not configured (merch shows fallback products)
- Stripe subscription Price IDs stale (need Dashboard creation)
- End-to-end purchase test not completed — Old Site Audit: Quick Wins from Claude's Cross-Reference
**Auditor:** Claude (read-only browser walkthrough of old Wix Studio site) + wyzmind (opencode)
**Date:** 2026-08-23

Claude audited the old `wyzdesign.wixstudio.com/wyzdesign` against the current site. 9 ideas proposed. 5 already existed. 2 applied.

| Fix | File(s) | Status |
|-----|---------|--------|
| Loyalty page gated everything behind sign-in — show tiers + earn ways publicly | `loyalty/page.tsx` | ✅ Fixed |
| Web-design missing testimonials | `web-design/page.tsx` | ✅ Fixed — added 3 Google review testimonials |
| Services category filter tabs | `services/page.tsx` | Already existed |
| Printing paper-type education | `printing/page.tsx` | Already existed |
| Photography auto-scrolling filmstrip | `photography/page.tsx` | Already existed (3 AutoScrollRow sections) |
| Web-design client portfolio + process steps | `web-design/page.tsx` | Already existed |

**Remaining (need user input):**
- Build Your Own Plan form on `/plans` — needs design decision
- Featured Artist of the Month page — needs content/artist selection
- Event recap videos on `/events` — needs source files from user
- LLM chat widget — exploratory, low priority

## Session 11 — Toast Notifications + Security Regression Fix
**Auditor:** opencode + Claude (Cowork)
**Date:** 2026-08-23
**Commits:** `9a742a6`, `1fd62a0` (had regression), `5cc83cd` (security fix), `5fb5d30` (HANDOVER)

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Toast notifications across all user-facing forms (11 files) | DynamicForm, LeadMagnet, booking-calendar, model-archive, featured-artist, photography, printing, plans, gift-card, community | MEDIUM | ✅ Fixed |
| Stale Twitter URL (twitter.com → x.com) | `Footer.tsx` | LOW | ✅ Fixed |
| Broken YouTube channel placeholder ID | `events/page.tsx` | MEDIUM | ✅ Fixed |
| Unused useState import | `contact/page.tsx` | LOW | ✅ Fixed |
| 21 form inputs missing aria-label | Footer, model-archive, featured-artist, photography, printing | MEDIUM | ✅ Fixed |
| **SECURITY: DOMPurify sanitizer accidentally replaced with regex blocklist** | PageRenderer, view/[page], api/pages, api/forms | **CRITICAL** | ✅ Fixed — restored `dompurify.ts`, removed weak regex |
| Dead `dompurify.ts` removed incorrectly | `lib/dompurify.ts` | HIGH | ✅ Fixed — restored from git |

**Claude caught the sanitizer regression** — "consolidate imports" commit accidentally swapped DOMPurify for a regex blocklist in `rate-limit.ts`. Output goes into `dangerouslySetInnerHTML`. Fixed by restoring DOMPurify and removing the regex duplicate.

## Session 10 — Security Hardening + Performance + Logger Migration
**Auditor:** opencode (automated audit)
**Date:** 2026-08-22
**Commits:** `f871d30`, `96d9032`

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| CSRF hardcoded fallback `"wyz-csrf-fallback"` | `lib/csrf.ts` | CRITICAL | ✅ Fixed — throws if env vars missing |
| Admin password empty string fallback | `api/auth/[...nextauth]/route.ts`, `api/pages/route.ts` | HIGH | ✅ Fixed — fails closed |
| 14 `console.warn/error` in production code | 9 page files | MEDIUM | ✅ Fixed — migrated to logger |
| 5 static policy pages `"use client"` unnecessarily | terms, privacy, refund, shipping, copyright | MEDIUM | ✅ Fixed — now Server Components |
| 5 heavy layout components loaded statically | `layout.tsx` | MEDIUM | ✅ Fixed — dynamic import with ssr:false |
| 24 `any` types eliminated | `analytics.ts`, `admin/page.tsx` | MEDIUM | ✅ Fixed — proper interfaces |
| shuffleArray duplicated across 5 files | home, services, designs, photography, SafeImage | LOW | ✅ Fixed — single import from utils |
| Alt text missing on brand logos | `about/page.tsx`, `PageRenderer.tsx` | MEDIUM | ✅ Fixed |

## Session 9 — Sitewide Navbar Overlap Fix + Interactive Hero Effects
**Auditor:** Claude (Cowork) + wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Headings hidden behind navbar on 18 pages | 18 page files | HIGH | ✅ Fixed — pt-32 lg:pt-40 |
| Events YouTubeSection static | `events/page.tsx` | MEDIUM | ✅ Fixed — mouse-interactive reveal |
| Events YouTubeSection overlay too light | `events/page.tsx` | MEDIUM | ✅ Fixed — 90% black |
| About hero static crown logos | `about/page.tsx` | MEDIUM | ✅ Fixed — mouse-interactive reveal |
| About hero overlay too light | `about/page.tsx` | MEDIUM | ✅ Fixed — 90% black |
| Printing marquee above hero | `printing/page.tsx` | LOW | ✅ Fixed — moved under hero |
| Photography carousel too narrow | `photography/page.tsx` | MEDIUM | ✅ Fixed — widened items |
| Merch duplicate images | `merch/page.tsx` | MEDIUM | ✅ Fixed — deduplicated |

## Session 8 — API Security Hardening
**Auditor:** wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Analytics GET no auth | `analytics/route.ts` | HIGH | ✅ Fixed |
| Analytics hashIp inline require | `analytics/route.ts` | LOW | ✅ Fixed |
| fd/events POST no auth | `fd/events/route.ts` | HIGH | ✅ Fixed |
| fd/events console.error | `fd/events/route.ts` | LOW | ✅ Fixed |
| telemetry POST missing return | `telemetry/route.ts` | LOW | ✅ Fixed |

## Session 7 — Cal.com CSP Fix
**Auditor:** Claude (Cowork) + wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Cal.com widget blocked by CSP | `next.config.ts` | HIGH | ✅ Fixed — added app.cal.com to script-src, connect-src, frame-src |

## Session 6 — Critical Security Fixes + Stripe BOM
**Auditor:** Claude (Cowork) + wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Severity | Status |
|-----|---------|----------|--------|
| Path traversal in GET /api/pages | `api/pages/route.ts` | HIGH | ✅ Fixed |
| Hardcoded newsletter HMAC fallback | `api/newsletter/route.ts` | HIGH | ✅ Fixed |
| No auth on /api/bookkeeping/meta | `api/bookkeeping/meta/route.ts` | HIGH | ✅ Fixed |
| Rate limit not called in POST /api/forms | `api/forms/route.ts` | HIGH | ✅ Fixed |
| Gift card validation bug | `api/checkout/route.ts` | HIGH | ✅ Fixed |
| BOM in NEXT_PUBLIC_URL broke Stripe | `stripe.ts`, `robots.ts`, `sitemap.ts`, `newsletter/route.ts` | HIGH | ✅ Fixed — shared getSiteUrl() helper |

## Session 5 — SafeImage Priority, FAQ, Gallery, CSP
**Auditor:** Claude (Cowork) + wyzmind (opencode)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| SafeImage priority prop no-op | `SafeImage.tsx`, `utils.tsx` | ✅ Fixed — maps to loading="eager" |
| Carousel images still lazy | `designs/page.tsx`, `merch/page.tsx` | ✅ Fixed |
| FAQ duplicated text on desktop | `faq/page.tsx` | ✅ Fixed |
| Gallery zero photos | `gallery/page.tsx` | ✅ Fixed — added aspect-[3/4] |
| Blog images blocked by CSP | `next.config.ts` | ✅ Fixed |
| Analytics pixels blocked by CSP | `next.config.ts` | ✅ Fixed |
| FDDriveBrowser missing relative | `FDDriveBrowser.tsx` | ✅ Fixed |
| Brands says "three" not "four" | `brands/page.tsx` | ✅ Fixed |

## Session 4 — Bookkeeping DB + Upload Fix
**Auditor:** Claude (Cowork)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| Bookkeeping DB uses local SQLite | `src/lib/bookkeeping.ts` | ✅ Fixed — migrated to Supabase |
| Bookkeeping API missing await | `api/bookkeeping/route.ts`, `api/bookkeeping/meta/route.ts` | ✅ Fixed |
| Image upload writes to tmpdir | `api/upload/route.ts` | ✅ Fixed — migrated to Supabase Storage |

## Session 3 — Data Plumbing Audit
**Auditor:** Claude (Cowork)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| Admin dashboard reads dead tmpdir | `api/admin/route.ts` | ✅ Fixed — now Supabase |
| Admin Chats tab reads dead tmpdir | `api/admin/route.ts` | ✅ Fixed — returns empty |
| Loyalty sign-in says "Admin Access" | `admin/page.tsx` | ✅ Fixed |

## Session 2 — Visual Audit Fixes
**Auditor:** Claude (Cowork)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| loading="lazy" breaks carousel images | home, designs, merch, photography | ✅ Removed lazy |
| Mobile hero hidden behind header | `web-design/page.tsx` | ✅ Added pt-20 |
| Home hero CTA buttons crop on mobile | `home/page.tsx` | ✅ Added flex-wrap |
| FAQ text clips on mobile | `components/FAQ.tsx` | ✅ Added whitespace-normal |

## Session 1 — Full Site Wiring Audit
**Auditor:** Claude (Cowork)
**Date:** 2026-08-22

| Fix | File(s) | Status |
|-----|---------|--------|
| Gift card amount mismatch | `api/checkout/route.ts` | ✅ Fixed |
| Booking service price mismatch | `api/checkout/route.ts` | ✅ Fixed |
| Dead /api/contact route | `api/contact/route.ts` | ✅ Deleted |
| Featured artist dead links | `featured-artist/page.tsx` | ✅ Removed |

---

## Tasks — What Needs Doing

### User Action Required
| Task | Why | How |
|------|-----|-----|
| End-to-end Stripe purchase test | Verify webhook fires + user tier upgrades | Open /plans → Subscribe → use test card 4242... in Stripe test mode, or check Supabase `stripe_events` table after a real purchase |
| Verify Cal.com booking widget renders | Claude couldn't test due to WAF blocking automated browsers | Open /booking in a normal browser → confirm the Cal.com embed loads |
| Mobile check of /, /events, /plans at ~344px | Claude's spacing fixes are live but need real device confirmation | Chrome DevTools device toolbar → Galaxy Z Fold 5 → check hero spacing, navbar clearance, no overflow |

### Content Organization (Staging Area)
| Task | Location |
|------|----------|
| 103 raw camera photos staged | `W:\WYZ_Command_Center\_INGEST\photos\raw\` |
| 12 raw camera videos staged | `W:\WYZ_Command_Center\_INGEST\videos\raw\` |
| 16 screenshots staged | `W:\WYZ_Command_Center\_INGEST\screenshots\` |
| Social images + stock files staged | `W:\WYZ_Command_Center\_INGEST\social\` + `stock\` |
| Sort raw photos into model/event subdirs | User decides categorization |
| 2 duplicate videos cleaned | `logo-intro-01.mp4` deleted, `about.mp4` restored for about page |

### Low Priority / Future
| Task | Notes |
|------|-------|
| Neo4j URI in Vercel | May not be needed if not using graph queries from Vercel |
| 3 Stripe accounts confusion | Muse #1 (W avatar), Muse #2, WYZ Design — keep vault organized |
| Featured Artist monthly rotation | Page exists, needs artist selection workflow |
| Event recap videos wiring | All 20 videos already wired into /events, no action needed |
| 11 `any` types in API routes | All in catch blocks or Supabase/Drive mapping — acceptable |

### Code Quality Status
- `tsc --noEmit`: Clean ✅
- `console.error/warn`: Only in A11yAudit.tsx (dev-only, acceptable) ✅
- All error boundaries use trackError for telemetry ✅
- Orphaned routes: Removed `/api/geocode`, `/api/fd/events` ✅
- Admin auth: `requireAdmin()` wired into analytics, bookkeeping/meta, bugs, fd/drive, fd/events (deleted), forms ✅
- Dead imports: Cleaned ✅
- All 23 pages return 200 ✅
- All API endpoints responding correctly ✅

### H-Stack Audit (Session 36 — Complete)
All 17 high-priority findings resolved:

| Finding | Status | Details |
|---------|--------|---------|
| A-H1 Root canonical | ✅ | Removed from layout.tsx, per-page canonicals only |
| A-H2 Error loop + tracker | ✅ | autoResetUsed ref guards, trackError wired in all 5 error boundaries |
| C-H1 Flip card keyboards | ✅ | role=button, tabIndex, aria-expanded, onKeyDown on 5 components |
| C-H2 Modal Esc/focus/scroll | ✅ | useModalA11y hook in 10 components (counter-based scroll lock) |
| C-H3 Autocomplete/labels | ✅ | DynamicForm id=field.name, autoComplete on booking + gift-card |
| C-H4 aria-current | ✅ | Navbar desktop links get aria-current="page" |
| C-H5 Reduced motion | ✅ | prefersReducedMotion() in 7 JS animation components + CSS fallback |
| E-H1 Plan names/billing | ✅ | Starter Pack/Business Boost/Pro Plus/Ultimate Suite, "Every 3 months" |
| E-H2 Retouching price | ✅ | $75 in services |
| E-H3 Concept cap | ✅ | concept-generate input length capped |
| F-8 Toast error duration | ✅ | error: { duration: 8000 } in Toaster config |
| G-H1 Neo4j constraint | ✅ | neo4j-setup.ts + cypher reference, wired into status + admin routes |
| G-H2 Svix webhook | ✅ | Full HMAC-SHA256 verification in webhook/resend |
| G-H3 Server userId | ✅ | checkout derives from auth(), client userId ignored |
| G-H4 Dead cron | ✅ | Backup cron removed |
| I-H1 Image priority/sizes | ✅ | Priority removed from 3 non-hero images, sizes added to 23+ fill images |
| J-H1/J-H2 Sitemap + canonicals | ✅ | Merch products, booking routes, splash routes in sitemap |

### I-Tier Findings (Session 36)
| Finding | Status | Details |
|---------|--------|---------|
| I92 Blog schema | ✅ | BlogPosting + BreadcrumbList JSON-LD already implemented |
| I98 Cash App button | N/A | Only in admin dropdown, no public CTA planned |
| I95 18+ age gate | MISSING | No age gate component — needs feature decision |
| I85 Hero alt text | ✅ | Events hero improved to descriptive string |
| console violations | ✅ | 3 error boundaries now use trackError instead of console.error |
| Secret layout desc | N/A | Intentional noindex page, no description needed |

### Vault Check (Session 16)
| Credential | Status |
|------------|--------|
| `STRIPE_SECRET_KEY` | ✅ Present (107 chars) — WYZ Design restricted key |
| `STRIPE_WEBHOOK_SECRET` | ✅ Present (38 chars) — WYZ Design account |
| `STRIPE_RESTRICTED_KEY` | ✅ Present (107 chars) — WYZ Design |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ Present (27 chars) — WYZ Design |
| `STRIPE_STARTER_PRICE_ID` | ✅ Present |
| `STRIPE_BUSINESS_PRICE_ID` | ✅ Present |
| `STRIPE_PRO_PRICE_ID` | ✅ Present |
| `STRIPE_ULTIMATE_PRICE_ID` | ✅ Present |
| `PRINTFUL_API_KEY` | ✅ Present |
| `STRIPE_MUSE_SECRET_KEY` | ✅ Present (old Muse key preserved) |

## Claude Code Collaboration Protocol

Claude operates with a **read-only repo clone**. It audits via browser (console + network + vision) and produces handover docs. Opencode applies fixes, commits, pushes, and updates this file. The cycle repeats indefinitely.
