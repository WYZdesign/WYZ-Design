# WYZ Design AI Task Board

**Owner:** Torreé Marcel  
**Updated:** 2026-10-02

Use this board for shared work. Claim an area before editing it. A task is complete only after its stated validation and the required Git workflow finish.

| # | Task | Owner | Status | Evidence or dependency |
|---:|---|---|---|---|
| 1 | Establish the pricing and billing canon | Torreé Marcel | needs decision | Use `PRICING_CANON_DECISION.md`; existing audits identify contradictory historic price language. |
| 2 | Inventory all customer-facing prices, plans, and CTAs against the canon | Codex | blocked by task 1 | No edits until the canon is approved. |
| 3 | Verify live revenue paths: inquiry, booking, checkout, plans, merch, gift cards | Codex | partially verified | Contact, booking, plans, gift-card, and merch catalog controls load. Do not submit forms or trigger payment without owner approval. Merch purchase is blocked by task 28; pricing/billing copy is blocked by tasks 1 and 23. |
| 4 | Verify live analytics and lead attribution | Torreé Marcel + Codex | needs access | Requires owner-authorized dashboard evidence. |
| 5 | Build the WYZMiND operations map for intake through repeat work | Codex + WYZMiND | done (WYZMiND half) | `WYZ_OPERATIONS_MAP.md` landed `2fe69e1` — code-evidence stages intake→repeat + gaps; Codex review + delivery-stage notes welcome |
| 5a | Verify the deployed mobile gutter and marquee-spacing batch | WYZMiND + Codex | done | Superseded by the verified 17-route live audit in task 9 and the final 24px-gutter close in task 10. |
| 6 | Create an accessibility and mobile regression gate | Codex | ready | Build from current audited routes and existing tests. |
| 7 | Audit loading, error, and empty states on revenue-critical routes | Codex | ready | Start with booking, services, merch, contact, and plans. |
| 8 | Normalize public founder, location, and social copy | WYZMiND + Codex | done | Normalized to owner-confirmed **Torreé Marcel** across all 8 scoped files (about layout/page, brands, home story copy, layout JSON-LD `name`, seo description+keywords, blog attribution, chat answers). Identifiers kept (LinkedIn URL, Cal.com slug `torree-harris-ddqqep`, image paths). JSON-LD `alternateName` + keyword aliases removed (no Torreé approval on record for retained search names — flag if wanted back). Zero `Marcel Harris` left in src. Location/social link verification still separate (owner). |

## File Ownership

| Area | Claimed by | Since |
|---|---|---|
| `WYZ_AI_HANDOVER.md` and `WYZ_AI_TASK_BOARD.md` | Codex | 2026-10-02 |
| Pricing source and customer-facing pricing copy | Unclaimed | - |
| WYZMiND page and integrations | Unclaimed | - |

## Handoff Index

- 2026-10-02: Codex completed initial business, repository, live-site, and Muses-workflow context discovery. See `HANDOVER.md` for the current session record.

### WYZMiND additions (2026-10-02)

**Evidence correction (Session 37):** the Muses coordination artifacts are
`AGENT_COLLABORATION_PROTOCOL.md`, `HANDOFF.md`, `HANDOVER.md`,
`WYZMIND_GO_PROTOCOL.md`, and dated `CHATGPT_*` / `OPENCODE_*` / `CLAUDE_*`
handoff files at the root of `V:\Muse`. No `AI_HANDOVER.md`,
`AI_TASK_BOARD.md`, or `_STATE/handovers/` exist there — do not chase those
names. WYZ Design mirrors the REAL pattern: this board (queue) +
`WYZ_AI_HANDOVER.md` (context) + `HANDOVER.md` (session log) + `AUDIT.md`
(findings) + `AGENT_COLLABORATION_PROTOCOL.md` (process).

| # | Task | Owner | Status | Evidence or dependency |
|---:|---|---|---|---|
| 9 | Verify marquee-gap + edge-gutter fixes on live `4943727` | WYZMiND | done | 17-route 320px shoot (status 200 ×0 errors), `tight_audit` 0 elements <16px, `mq_summary` sections 12/12px + bands 16/16px, vision reads, axe 0/10 + E2E 7/7 on live — AUDIT Round 28 |
| 10 | Standardize residual 16px gutters to 24px (home/merch px-4 elements) | WYZMiND | done | `ae7b86c` LIVE: 6 files px-4→px-6 + merch `px-6!`; live re-audit 17 routes = 2 centered-typography artifacts left (documented); axe 0/10 + E2E 7/7 — see status update below |
| 11 | Land coordination layer batch (protocol, `_agent/`, guard v2, handoffs) | WYZMiND | done | `a2c60bf` DEPLOY IS LIVE ✅; AUDIT Round 28 docs push = guard v2 live test |
| 12 | Read-only live revenue-path verification (tasks 3 evidence) | Codex | ready | board task 3; no edits |
| 13 | Repair narrow FAQ, navigation, gallery, and modal interaction defects | Codex | done (integrated by WYZMiND) | Batch landed `8528ab6` → live `8d0df90`/`a77bca1`: FAQ closed gap=12 ×5 / expanded gap=4 @320, no dup question, no overflow, nav Escape-close, gallery keyboard open/focus-in/Escape/focus-restore all PASS (`_STATE/web_shots/narrow/faq_kb_report.json`), axe 0/10, E2E 7/7 (harness updated: tile selector + cookie-consent step) |
| 15 | Claim in-flight src edits (faq, globals, CookieBanner, Footer) | Codex | superseded by #13 | Codex scoped and documented the full batch under #13 (Session 39 / HANDOFF follow-on); integration running now |
| 16 | Cap centered hero text widths (events/fd/home, L=R 16-19) to 24px | Claude | done | Merged `9c986eb` via `46394a6` — `max-w-[calc(100vw-3rem)] mx-auto` on events hero p, fd oracle h2, home DIGITAL PRINTING h2. Final live re-audit **34/34 PASS** at `6005b5f`; targeted rects all L24/R24/w272 (home DIGITAL PRINTING, events h1, fd h2, fd p, events p). See HANDOFF.md 2026-10-04 entry. |
| 17 | Complete release gates for `56b5498` | WYZMiND | done | `56b5498` READY = `DEPLOY IS LIVE ✅`; build 0 / lint 0-92 / vitest 12/12 on matching tree (clean worktree); axe 0/10 + E2E 7/7 live; 320px visual `faq_320_top_deadband.png` — dead band gone, hero flush under nav, scrollW=320 (right sliver = 10px scrollbar gutter, div 310 = clientWidth); FAQ gap metrics unchanged (12/4px) |
| 18 | Remove the mobile/tablet global section-padding override | WYZMiND | done | Forced `padding-left/right` on `section, .section` removed from mobile block (vertical `margin-bottom: 3rem` preserved) and tablet block (rule deleted). Component-owned px-* gutters now authoritative. Final live audit at `6005b5f`: **34/34 PASS** (17 routes x 320+360, zero <24px, zero errors). Root causes fixed: body `scrollbarGutter:stable` 10px sliver (layout.tsx), globals `p{max-width:36rem!important}` + `h1/h2/h3/h4{max-width:none!important}` trampling utility caps (now `min(100%, calc(100vw-3rem))` + `min(36rem,...)`), mobile h1 clamp floor overflowed min-content at 320 (<=380px step-down clamp). |
| 19 | Type the Cal.com embed bridge without explicit `any` | WYZMiND | done | `CalStub`/`CalNamespaceStub`/`CalWindow` interfaces replace `Record<string, any>` + 2 `as any`; sync namespace init behavior preserved byte-for-byte. build 0 / lint 0-92 / tsc clean / 15-15 tests. |
| 20 | Make narrow visual captures deterministic | WYZMiND | done | `settle_reveals()` (waits for computed opacity=1 on all inline-styled wrappers) added to `gutter_audit.py` + `narrow_vision.py`; both now record viewport/route/captured_at per entry; gutter audit also runs 320+360 via WIDTHS loop and accepts a BASE arg (local or live). py_compile 0. |
| 21 | Define a safe production visual-audit policy | WYZMiND + Torreé Marcel | needs decision | Production rate limiting can return 429 pages during broad route sweeps. Propose a trusted, rate-limited QA path or staged preview policy without weakening public protections. |
| 22 | Turn delivery into proof, referral, and repeat-work automation | WYZMiND | ready to spec -> spec done | **Speced in `SPECS.md` (Spec 22):** 4 stages (delivery confirmation / testimonial +7d / referral +21d / win-back 90d), consent table, draft-then-approve flow, per-stage allowlist flags default OFF, cadence cap 1/14d, phases 1-3, success measures. Awaiting Torreé approval before any build/send. |
| 23 | Resolve visible subscription-term contradiction | Torreé Marcel | needs decision | Live `/plans` says both “all plans auto-renew monthly” and “monthly or quarterly.” Confirm the actual billing cadence and cancellation policy before Codex inventories and reconciles all price language under task 2. |
| 24 | Close the gift-card redemption promise gap | WYZMiND + Torreé Marcel | ready to spec -> spec done | **Speced in `SPECS.md` (Spec 24):** webhook-only code issuance, SHA-256 hashing, append-only balance ledger, atomic checkout redemption, partial balance, 24mo expiry, admin support fallback, migration dry-run, 3 phases, grep gate for codes-in-logs. Awaiting Torreé policy approval before implementation. |
| 25 | Inventory remaining explicit-`any` type debt | WYZMiND | done | `TYPE_DEBT.md`: 38 real type-position hits across 18 files (raw 85 de-noised), tiered T1 data layer / T2 platform hacks / T3 lib wrappers with concrete replacement steps + batching plan. Booking bridge excluded (done in #19). |
| 26 | Repair and exercise the global failure boundary | WYZMiND | done | `global-error.tsx` now renders `<html lang="en"><body>` document wrapper (Next requirement) keeping original controls. Deliberate check: `src/app/global-error.test.tsx` 3 tests — static wrapper assertion (React 19 hoists html/body out of RTL containers), auto-reset-once + manual retry wiring, 320px layout classes. Tests 15/15. |
| 27 | Give revenue routes intentional loading and failure states | WYZMiND | done | Shared `RouteLoading` (aria-busy + role=status + sr-only label; calendar/form/cards variants) + `RouteErrorState` (role=alert, trackError, Retry, Go Home) with thin wrappers for booking, contact, plans, gift-card (8 files). Only those 4 revenue routes + existing merch. |
| 28 | Make merch purchasable or stop presenting it as a store | WYZMiND + Torreé Marcel | urgent | The live catalog and quick-view work, but there is no merch checkout route. Product-page “Add to Cart” only changes its label and the quick-view CTA links to Featured Artist, not purchase. Choose an authorized fulfilment and payment design, then implement cart/order/payment/confirmation or relabel the experience as a non-purchasable catalog until it is real. |
| 29 | Keep the mobile chat launcher clear of content and controls | Claude | done (code) | Merged `3278627` via `7591d7d` + WYZMiND rootMargin corner fix per Codex review (top+left, lower-right footprint). `data-chat-avoid` on home trust bar, Footer, CookieBanner; `clearZone` hides bubble. Live verified at `6005b5f`: FAQ overlap **0 px2** (bubble opacity->0 + pointer-events none, avoid=3 incl new FAQ tags), footer hide confirmed (opacity 0.155 mid-transition, 0 overlaps), 320px visual captured; axe 0/10 + E2E 7/7 clean. |
| 30 | Confirm the public proof-metric canon | Torreé Marcel + Codex | needs decision | Live Home and About use 60+ events and 30+ clients, while Events presents 90+ client events. Confirm the approved definitions and figures before a unified public metric pass. |
| 31 | Reconcile WYZMiND public capability claims with reality | Torreé Marcel + WYZMiND | needs decision | `/wyzmind` says its assistant sends no data to third parties and that payments include merch checkout. The site uses OpenRouter for chat and has no merch purchase path. Approve accurate public positioning, privacy language, and capability boundaries before copy changes. |
| 32 | Add keyboard access to events page video-play cards | Claude | done | Merged `598eba0` via `bbacb85` — role/tabIndex/aria-label/Enter-Space on `ColorAuraVideo` + `VideoCarousel`, merged with existing swipe onKeyDown (duplicate-prop caught by tsc). 1 file +4/-1. |
| 35 | Hero headlines invisible for seconds after hydration (TextSplit/TextMaskReveal/TextReveal) | Claude | implemented, pending integration | Branch `claude/hero-text-reveal-flash-fix` (commit `a714f82`), docs on `claude/hero-text-flash-docs`. Found live on /services mobile sweep: H1 "CREATIVE SERVICES" absent from hero for several seconds post-hydration, then self-animated in late. All 3 char/line-reveal components (used on 9 routes: home, about, designs, events, photography, services, blog, faq, printing, contact) flip SSR-visible content to hidden on hydration and wait on an async IntersectionObserver with no fallback -- fine below the fold, broken for an already-in-view hero H1. Fixed with a synchronous getBoundingClientRect() mount-time check (same pattern as ChatWidget clearZone fix) that skips the hide step when already in/near viewport. ScrollReveal.tsx already had an 800ms timeout safety net for the same class of bug -- not touched. tsc clean; only /services re-verified live post-fix, other 8 routes not individually re-screenshotted (identical shared-component fix). May also be board row #34/#35 depending on merge order with claude/mobile-visual-perf-audit -- renumber freely on integration. |

| Area | Claimed by | Since |
|---|---|---|
| `AGENT_COLLABORATION_PROTOCOL.md`, `_agent/`, `AUDIT.md`, `vercel.json` | WYZMiND | 2026-10-02 |

**Claim 2026-10-02:** WYZMiND claims task #10 (gutter-24). Scope: all non-marquee text elements <24px from viewport edges at 320px, excluding files claimed by Codex (src/app/faq/page.tsx, src/app/globals.css, src/components/CookieBanner.tsx, src/components/Footer.tsx — board #13). Tool: _agent/gutter_audit.py (24px threshold). Status: CLAIMED.

### WYZMiND status update (2026-10-02, after ae7b86c)

- **#10 done (ae7b86c, LIVE):** 6 px-4 containers -> px-6 (printing/services/plans/events/fd/web-design) + merch px-6! (beats global section strip). Live re-audit: 17 routes, page-level <24px items down from 16 to **2 centered-typography artifacts** (home nowrap h2 L=19, events centered hero p L=17 — centering, not gutters; left intentionally). axe 0/10 + E2E 7/7 on ae7b86c.
- **CookieBanner (L=20 x4/route):** blocked on #13 (Codex's dirty file) — fix lands with your batch or hand it to me after you commit.
- **#5 WYZMiND half done:** WYZ_OPERATIONS_MAP.md (intake→repeat, code-evidence only). Codex review + delivery-stage notes welcome.
- **New #14:** globals.css section sledgehammer — section, .section { padding: 1rem !important } (line ~214, mobile) + tablet 2rem (line ~370) overrides every section's intended padding (same bug class as Round 24/28 globals). File is Codex-claimed (#13) → whoever owns #13, remove the padding lines (keep margin-bottom) and re-run _agent/gutter_audit.py for regressions; section:first-of-type full-bleed strip (line ~968) also suspect.
- **#13 integration DONE:** full Codex batch (11 src files) reviewed diff-by-diff, landed `8528ab6`, gates green, acceptance criteria all PASS live @320 (see #13 row).
- **#10 final close (`a77bca1`):** CookieBanner modal `p-5→p-6` → gutter audit **74→10** (cookie 48→0). Residual 10 = symmetric centered-typography only (events hero 17/17, fd 16/16, home 19/19) — accepted, documented AUDIT R29.
- **New #16:** optional — cap centered hero text widths (events `SIMPLIFY...`+p, fd `HOW THE ORACLE WORKS`, home `DIGITAL PRINTING`) so L=R ≥ 24: set max-widths to `calc(100vw - 3rem)` / trim `max-w-xs` on the centered hero blocks; re-run `_agent/gutter_audit.py`. Low priority (balanced ≥16px margins, nothing touches edges).
