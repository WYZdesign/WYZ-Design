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
| 8 | Normalize public founder, location, and social copy | WYZMiND + Codex | ready | Torreé Marcel is owner-confirmed as the official founder name. Replace visible and primary metadata uses of legacy “Torreé Marcel Harris” in About, Brands, Home, layout JSON-LD, SEO, blog attribution, and chat answers. Keep historical/alternate search names only where Torreé explicitly approves them; verify location and social links separately. |

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
| 16 | Cap centered hero text widths (events/fd/home, L=R 16-19) to 24px | anyone | ready | optional; symmetric ≥16px margins already, nothing touches edges — see status update below |
| 17 | Complete release gates for `56b5498` | WYZMiND | done | `56b5498` READY = `DEPLOY IS LIVE ✅`; build 0 / lint 0-92 / vitest 12/12 on matching tree (clean worktree); axe 0/10 + E2E 7/7 live; 320px visual `faq_320_top_deadband.png` — dead band gone, hero flush under nav, scrollW=320 (right sliver = 10px scrollbar gutter, div 310 = clientWidth); FAQ gap metrics unchanged (12/4px) |
| 18 | Remove the mobile/tablet global section-padding override | WYZMiND | ready | `src/app/globals.css` lines 214-218 and 350 overwrite component-owned section gutters. Preserve vertical spacing, remove only forced side padding, then run the gutter audit at 320px and 360px across all routes. |
| 19 | Type the Cal.com embed bridge without explicit `any` | WYZMiND | ready | `src/app/booking/page.tsx` uses `Record<string, any>` and several `as any` casts. Replace them with a small local interface while preserving the synchronous Cal.com namespace behavior; run TypeScript and booking interaction checks. |
| 20 | Make narrow visual captures deterministic | WYZMiND | ready | The local narrow audit can capture unrevealed `ScrollReveal` sections. Update the WYZMiND-owned audit harness to wait for settled reveal states and record viewport, route, and capture timestamp with each image. |
| 21 | Define a safe production visual-audit policy | WYZMiND + Torreé Marcel | needs decision | Production rate limiting can return 429 pages during broad route sweeps. Propose a trusted, rate-limited QA path or staged preview policy without weakening public protections. |
| 22 | Turn delivery into proof, referral, and repeat-work automation | WYZMiND | ready to spec | Operations map confirms delivery confirmation, testimonial request, referral prompt, and lapsed-client win-back are gaps. Produce a scoped implementation spec with triggers, consent, owners, and success measures; no customer messaging goes live without Torreé's approval. |
| 23 | Resolve visible subscription-term contradiction | Torreé Marcel | needs decision | Live `/plans` says both “all plans auto-renew monthly” and “monthly or quarterly.” Confirm the actual billing cadence and cancellation policy before Codex inventories and reconciles all price language under task 2. |
| 24 | Close the gift-card redemption promise gap | WYZMiND + Torreé Marcel | ready to spec | Live `/gift-card` promises redemption for services or merch. The code creates a Stripe session and records `gift_cards` after payment, but exposes no customer redemption flow. Specify secure code issuance, balance ledger, checkout redemption, expiry policy, support fallback, and migration before implementation. |
| 25 | Inventory remaining explicit-`any` type debt | WYZMiND | ready | The Cal.com bridge is not the only instance: Sentry boundaries also use explicit `any`. Produce a file-level inventory and a low-risk replacement plan; keep task 19 focused on the booking-critical bridge. |
| 26 | Repair and exercise the global failure boundary | WYZMiND | ready | `src/app/global-error.tsx` renders a `main` directly; a Next global error boundary must render the document wrapper. Correct that structure and add a deliberate safe failure-path check proving refresh and home recovery controls work at 320px. |
| 27 | Give revenue routes intentional loading and failure states | WYZMiND | ready | Merch has a route loading file and local catalog states; booking, contact, plans, and gift cards fall back to the generic app loader/error boundary. Decide where route-level feedback materially improves a slow or failed transaction and add only those states, with screen-reader status and retry guidance. |
| 28 | Make merch purchasable or stop presenting it as a store | WYZMiND + Torreé Marcel | urgent | The live catalog and quick-view work, but there is no merch checkout route. Product-page “Add to Cart” only changes its label and the quick-view CTA links to Featured Artist, not purchase. Choose an authorized fulfilment and payment design, then implement cart/order/payment/confirmation or relabel the experience as a non-purchasable catalog until it is real. |
| 29 | Keep the mobile chat launcher clear of content and controls | Claude | ready | Live narrow homepage review shows the fixed chat launcher visually colliding with the lower-right proof metric. Reposition or reserve space so it clears content, primary controls, safe areas, and cookie surfaces at 320px and 360px. Verify with screenshots on Home, FAQ, booking, and plans. |
| 30 | Confirm the public proof-metric canon | Torreé Marcel + Codex | needs decision | Live Home and About use 60+ events and 30+ clients, while Events presents 90+ client events. Confirm the approved definitions and figures before a unified public metric pass. |
| 31 | Reconcile WYZMiND public capability claims with reality | Torreé Marcel + WYZMiND | needs decision | `/wyzmind` says its assistant sends no data to third parties and that payments include merch checkout. The site uses OpenRouter for chat and has no merch purchase path. Approve accurate public positioning, privacy language, and capability boundaries before copy changes. |
| 32 | Add keyboard access to events page video-play cards | Claude | implemented, pending integration | `claude/events-video-keyboard-a11y` @ `598eba0` -- self-identified, not previously on board. `ColorAuraVideo` + `VideoCarousel` opened the video modal via onClick on a plain div (cursor-pointer, no/incomplete tabIndex, no role) -- unreachable by keyboard. Added role="button", tabIndex, aria-label, and Enter/Space onKeyDown (merged with existing useSwipe arrow-key handler where present). 1 file, +4/-1. `npx tsc --noEmit` clean. |

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
