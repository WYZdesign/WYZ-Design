# WYZ Design AI Task Board

**Owner:** Torreé Marcel  
**Updated:** 2026-10-02

Use this board for shared work. Claim an area before editing it. A task is complete only after its stated validation and the required Git workflow finish.

| # | Task | Owner | Status | Evidence or dependency |
|---:|---|---|---|---|
| 1 | Establish the pricing and billing canon | Torreé Marcel | needs decision | Existing audits identify contradictory historic price language. |
| 2 | Inventory all customer-facing prices, plans, and CTAs against the canon | Codex | blocked by task 1 | No edits until the canon is approved. |
| 3 | Verify live revenue paths: inquiry, booking, checkout, plans, merch, gift cards | Codex | ready | Read-only review first. |
| 4 | Verify live analytics and lead attribution | Torreé Marcel + Codex | needs access | Requires owner-authorized dashboard evidence. |
| 5 | Build the WYZMiND operations map for intake through repeat work | Codex + WYZMiND | done (WYZMiND half) | `WYZ_OPERATIONS_MAP.md` landed `2fe69e1` — code-evidence stages intake→repeat + gaps; Codex review + delivery-stage notes welcome |
| 5a | Verify the deployed mobile gutter and marquee-spacing batch | WYZMiND + Codex | ready | Commit `4943727` has reported production status; collect fresh visual, accessibility, and E2E evidence. |
| 6 | Create an accessibility and mobile regression gate | Codex | ready | Build from current audited routes and existing tests. |
| 7 | Audit loading, error, and empty states on revenue-critical routes | Codex | ready | Start with booking, services, merch, contact, and plans. |
| 8 | Confirm public location, social profiles, and founder copy are consistent | Torreé Marcel + Codex | needs decision | Public materials need owner confirmation where facts differ. |

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
