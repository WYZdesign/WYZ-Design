# WYZ Design — Agent Collaboration Protocol

Standing operating procedure for every AI/model/human agent working in this
repo. Read this before changing code, reporting status, or writing a handoff.
Modeled on `V:\Muse\AGENT_COLLABORATION_PROTOCOL.md` (the proven
Claude/wyzmind/codex trio).

## Coordination file map (single source of truth)

| File | Role | Writer |
|---|---|---|
| `AGENT_COLLABORATION_PROTOCOL.md` | Process contract (this file) | Wyzmind |
| `WYZ_AI_TASK_BOARD.md` | Live task queue, claims, ownership | shared (claim before edit) |
| `WYZ_AI_HANDOVER.md` | Durable business/technical context | Codex |
| `HANDOVER.md` | Session log (append, reverse-chron at top) | shared (own entry only) |
| `HANDOFF.md` | Cross-agent round handoff notes (Muse `HANDOFF.md` pattern: From/To/What was done/Next) | shared (own round block) |
| `AUDIT.md` | Findings + numbered audit rounds | Wyzmind |
| `_agent/` | Reproducible audit/vision scripts | Wyzmind |
| `vercel.json` | Build guard + deploy config | Wyzmind only |

The live queue role belongs to `WYZ_AI_TASK_BOARD.md`; `HANDOFF.md` carries
round-level dialogue between agents.

## 1. Objective

Make wyzdesign.com **fully presentable, professional, and profitable** based on
what the owner already has (40 pages, merch store, booking, forms, newsletter,
referral, loyalty, gift cards, community, SEO metadata). Genuinely excellent
product, not attractive claims of completion.

## 2. Truth and reporting

1. Never say "done," "10/10," "deployed," or "green" without exact revision,
   commands, and outputs proving it.
2. A focused failure overrides a broad success. `npm run build` passing does
   not prove lint, a11y, visual behavior, or live deploy state.
3. Report verified / inferred / unverified separately. State regressions plainly.
4. Never weaken, skip, or exclude a check to manufacture a pass.
5. Live deploy truth comes from:
   `python W:\WYZ_Command_Center\wyz_deploy_check.py <full-sha> --project wyzdesign`
   → must print `DEPLOY IS LIVE ✅`. A local build is not a deploy.

## 3. Roles and ownership

1. **Owner (Torreé)** — product decisions and risk authority only.
2. **Wyzmind (opencode)** — SOLE integrator for CODE: reviews all diffs,
   resolves conflicts, commits code to `master`, pushes, runs gates, deploys,
   records live evidence, owns `vercel.json`. May also land another agent's
   reviewed docs batch.
3. **Codex (ChatGPT)** — implementation + verification partner. Code work
   happens ONLY in its own branch (`codex/<topic>`), one declared bundle at a
   time; Wyzmind reviews the actual diff and lands it. Codex may commit and
   push its OWN session documentation (`.md` only) directly to `master` after
   a local guard dry-run (below) proves the push will CANCEL. Codex never
   pushes code paths (`src/ public/ package*.json next.config.* vercel.json
   tsconfig.json`), never deploys, never touches billing/Vercel config or
   other agents' claimed files.
4. **Any future agent** — same as Codex unless the owner reassigns integrator.

## 4. Worktree / branch contract

1. Branch from current `master`: `codex/<topic>` (e.g. `codex/marquee-gaps`).
   Wyzmind uses `wyzmind/<topic>` only when it needs a review buffer.
2. Before coding, claim the bundle in `WYZ_AI_TASK_BOARD.md` (status `CLAIMED`) with:
   branch, exclusive file manifest, problem evidence, acceptance criteria.
3. File manifests must not overlap another active bundle unless Wyzmind
   serializes the work first.
4. Codex returns: branch + evidence. Wyzmind reviews the ACTUAL diff, reruns
   affected gates, then cherry-picks/replays onto `master` and lands it.
5. One bundle = one measurable outcome, one risk area, explicit stop condition.
   No bulk rewrites of shared files.

## 5. Quality gates (Wyzmind runs these before any master land)

1. `npm run build` — 0 errors (includes tsc).
2. `npm run lint` — 0 errors (baseline: 92 warnings; never increase errors).
3. `npm run test:run` — 12/12 minimum (or improved; never reduced).
4. Visual/a11y for changed routes:
   `$env:WYZ_BASE="https://www.wyzdesign.com"; $env:WYZ_AXE_OUT="W:\WYZ_Command_Center\_STATE\axe_e2e_report_local.json"; python W:\WYZ_Command_Center\_ENGINE\wyz_axe_e2e.py`
   → axe 0/10 violations, E2E 7/7.
5. Mobile at 320 + 360 for changed routes (scripts in `_agent/`).
6. Deploy: push → poll to READY → deploy check `DEPLOY IS LIVE ✅` → live smoke.
7. `_LOGS`/browser console: no new errors introduced by the change.

## 6. Vercel build-cost rules (owner pays per build minute)

1. `vercel.json` `ignoreCommand` builds ONLY when these paths change in the
   PUSH RANGE (`VERCEL_GIT_PREVIOUS_COMMIT..HEAD`):
   `src/ public/ package.json package-lock.json next.config.* vercel.json
   tsconfig.json`. Everything else (docs, `_agent/`, AUDIT.md, handoffs)
   auto-CANCELS = free. (Guard is range-based — a docs-head multi-commit push
   still builds if any commit in the push touched build paths. Schema max is
   256 chars; current value is 252.) Dry-run before any push:
   `git -C V:\wyzdesign diff --quiet <LAST_PROD_SHA> HEAD -- src/ public/ package.json package-lock.json next.config.ts next.config.js vercel.json tsconfig.json; echo "exit=$LASTEXITCODE"` —
   exit 0 = push will cancel (free); exit 1 = push will build (cost).
   `<LAST_PROD_SHA>` = `CHECKED SHA` line from `wyz_deploy_check.py --project wyzdesign`.
2. **BUNDLE by default (owner directive 2026-10-02):** accumulate code
   changes and ship them in ONE push/build per work session. Never push
   file-by-file, never spin a build for a cosmetic one-liner. Split into a
   separate push ONLY for serious / highly-impactful issues (site down,
   revenue path broken, security, data loss) — those ship immediately as a
   hotfix bundle and get their own deploy check.
3. Docs/handoff pushes are free — push them liberally (they CANCEL, 0 build minutes).
4. Never force-push. Never re-run failed builds blindly (a real build error
   costs money on retry — fix first, then push).

## 7. Mobile, visual, accessibility standard

1. Every changed route verified at 320 and 360 (and 390 when dense): no
   horizontal overflow, no content within <16px of viewport edges (24px is the
   site standard gutter), no clipping, no overlay collision.
2. Marquee bands: content must not have excessive top/bottom spacing on
   mobile (site pattern: `py-N sm:py-M` — mobile half or less of desktop).
3. Actual controls tested: primary, cancel/close, back, tabs, forms,
   empty/error states. Accessible name + visible focus + ≥44px touch target.
4. Use vision (screenshots via `_agent/*.py` or `wyz_web_shoot.py`), not just
   DOM measurements. Read the PNG.

## 8. What not to do

- No claims without evidence; no invented facts about deploys/providers/URLs.
- No secrets, tokens, or personal data in code, logs, handoffs, or screenshots.
- No unrelated upgrades bundled with targeted fixes.
- No touching: `.env*`, `vercel.json` (Wyzmind only), `AUDIT.md` history
  (append only), other agents' claimed files.
- No em dashes in owner-facing site copy (house style).

## 9. Required handoff footer

Every substantive handoff ends with:

```md
## Verification record
- Revision/worktree:
- Files changed:
- Commands actually run + exact result:
- Browser/mobile widths and flows verified:
- Deploy state (SHA + DEPLOY IS LIVE ✅ or UNVERIFIED):
- Known failures or unverified assumptions:
- Next concrete owner/action:
```

Unknown field = `UNVERIFIED`, never omitted.

## 10. Execution loop

1. **Observe** — reproduce with source/command/rendered evidence.
2. **Reserve** — claim bundle in `WYZ_AI_TASK_BOARD.md` before edits.
3. **Implement** — smallest safe change in your branch.
4. **Verify locally** — gates applicable to your change; state blocked commands.
5. **Integrate** — Wyzmind reviews diff, reruns gates on integration worktree.
6. **Release** — Wyzmind alone pushes/deploys, records SHA + live evidence.
7. **Learn** — append your entry to `HANDOVER.md` and update
   `WYZ_AI_TASK_BOARD.md`: evidence in, next bundle defined.

Safeguards: prose/confidence is not evidence. No agent edits another's active
files. No mass lint suppression or broad ignores. All external side effects
(tool-less agents record exact gaps and hand over reproducible commands).
