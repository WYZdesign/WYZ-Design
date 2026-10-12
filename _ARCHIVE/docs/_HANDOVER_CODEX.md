# WYZ Design — Handover for Codex

**Date:** 2026-10-07
**Repo:** `WYZdesign/WYZ-Design` (V:\wyzdesign)
**Live:** https://www.wyzdesign.com
**Owner:** Torreé Marcel

This is your working brief. It pairs with `WYZ_AI_HANDOVER.md` (durable context, your file) and `AGENT_COLLABORATION_PROTOCOL.md` (process). You are the implementation and verification partner. WYZMiND is the sole code integrator (reviews diffs, commits to master, pushes, deploys). Work on a branch and hand the diff back.

## The job: consolidation + cleanliness

Owner direction (2026-10-07): the site feels extensive and busy. Keep every real page. Make it more concise, compact, and combined. Keep the word "Merch". Keep Design and Photography as separate, big portfolios. Drop `/fd`. Shorten and clarify all copy.

Read first:
- `WYZDESIGN_CONSOLIDATION_AUDIT.md` (v2): the 5-domain, 5,000-point audit, scorecard, condense map, copy rules.
- `WYZDESIGN_ROUTE_DECISION_LEDGER.md` (yours): route-by-route treatment, still the reference for the redirect work.
- Writing rules (locked): plain words, contractions, no em/en-dashes, no AI tells, one idea per sentence, second person, digits. Budgets: Home 450 words, hubs 200, service pages 300, headlines 8 words.

## Your tasks

1. **Route + redirect map (with WYZMiND).** True merges only: `/home` -> `/`, and `/booking-calendar/{4}` -> `/booking`. Pick one service detail family: move `/service-page/*` content to `/services/{service}` and 301 the old paths. Drop `/fd` (301 to `/about`). Combined sections (fold the weaker page into the stronger one, 301 the old URL): `/brands` -> `/about`, `/gallery` -> `/photography`, `/case-studies` (+4 details) -> `/designs/<slug>`, `/partnerships` -> `/contact?type=partnership`, `/referral` -> `/loyalty`. Update sitemap, robots, nav, internal links, and metadata in the same release.
2. **Copy condense pass.** Apply the writing rules to every page and hit the word budgets. Deliver as a reviewable branch or a copy doc; WYZMiND integrates code.
3. **Copy lint in CI.** Add a check that flags banned words, em/en-dashes, sentences over 20 words, and pages over budget. Warn first, then fail.
4. **Search index.** Once routes settle, make sure every kept page is indexed and returns sensible results.
5. **Sitemap trim.** Remove lab pages (`/splash*`, `/mobile-splash`, `/secret`, `/match`, `/3pointprogram`, `/view/[page]`, `/clear-cache`) from public promotion unless the owner gives a purpose.

## Open tasks already on the board for you

- **#41: testimonial sources.** The community/testimonial quotes link to broad Google searches, not real review URLs. Get the owner's real links or recommend cutting the quotes.
- **#42: pending-order cleanup job.** Merch orders can be left in `pending` after an abandoned checkout start. Scope a safe sweep (age-based) plus the reservation release already shipped for gift cards.
- **#45: `/_next/image` 400 root cause.** SafeImage's optimizer routing was disabled (task 41) because nested `/images/**` paths return 400. Next `<Image>` is fine. Find the infra cause so the optimizer can be re-enabled (likely a width not in `deviceSizes`).

## Divisions of labor

- **Claude:** visual, layout, kinetic, device verification. The `/work` design/photography split gateway is Claude's (see `_HANDOVER_CLAUDE.md`).
- **WYZMiND:** infra, DB/migrations, Vercel, API/security, integration.
- **You (Codex):** routing/redirects, content condensing, CI/lint, verification, audits.

## Reporting

Follow the protocol: never say "done" without the revision, the command, and the output. Treat deployed state and Git state separately. Report verified, inferred, and unverified separately. Record your work in `HANDOFF.md` (From/To/What was done/Next) and update the board row.
