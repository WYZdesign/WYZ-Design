# WYZ Design — Business Boardroom Audit

**Prepared by:** WYZMIND audit engine (opencode session, evidence through 2026-09-28)
**Subject:** wyzdesign.com — investable or not, honest verdict
**Scope:** positioning, market, monetization, product experience, moat, trust, go-to-market, execution, financials, risk/governance — across the live site, `AUDIT.md`, `_HANDOVER_FROM_CLAUDE.md`, the 1,000- and 2,000-point audits, and today's 20-route mobile sweep. Commit `43e2ba2`, live on Vercel.

## How to read this report

- This markdown **is** the boardroom deliverable — the 1,000-cell Excel workbook equivalent lives here, one scored line per category with the reasoning attached. No `.xlsx` is created by design.
- Category scores are a 1–10 business read (not the engineering 1,000-point rubric — that lives in the sibling docs). The headline is the arithmetic mean of the ten category scores, computed by script.
- Disclosure: this is an AI read of source + live evidence. Categories with no financial statements in the reviewed material (revenue, margin, CAC) are scored low on **absence of evidence**, not on hidden weakness.

---

## Headline: **6.1 / 10** — real product, unfinished business

*Sum 61.0 across 10 categories → 6.1. Strong on craft and execution velocity, weak on proof: no financials, thin moat, one stale city listing, and prices that disagree with each other.*

| # | Category | /10 | One-line verdict |
|---:|---|---:|---|
| 1 | Concept, Thesis & Positioning | 7.4 | "Creative growth studio" multi-service + Zeal loyalty + referral loop is a coherent LA/Chicago thesis — the wedge is retention, not just jobs |
| 2 | Market Opportunity & Demand | 6.0 | Local creative-service demand (web, print, photo, design) is real, but no demand/traffic evidence was in the reviewed material |
| 3 | Business Model & Monetization | 6.3 | Four revenue lines live (services, plans, merch, gift cards) + events — undermined by prices that contradict each other on the same site |
| 4 | Product Experience & Value Delivery | 6.5 | Rich, bookable, purchasable site with a closed Supabase incident behind it — but community is a demo and loading states are blank |
| 5 | Competitive Positioning & Moat | 5.8 | Portfolio + FAOTM + loyalty is a start; nothing a Canva/freelancer combo can't imitate in a quarter |
| 6 | Trust, Safety & Compliance | 7.0 | 23 security rounds deployed, truthful status page, legal pages live — three named holes keep it from 8+ |
| 7 | Go-to-Market & Growth | 5.8 | Blog/referral/Zeal exist, but Google Business Profile says Chicago instead of LA and GA newsletter verification is unproven |
| 8 | Team, Founder & Execution Readiness | 7.0 | 427 commits, 23 security rounds, and a production incident closed in 48h with E2E proof — solo + AI ops shipping at team speed |
| 9 | Financial & Investment Potential | 4.0 | No revenue, margin, or unit-economics evidence in reviewed docs — bookkeeping admin exists, the numbers do not |
| 10 | Risk, Governance & Exit Readiness | 5.2 | Single-printful supplier dependency, Supabase free tier, unmerged dependency PRs, PAT rotation pending, demo-page risk |
| | **Overall** | **6.1** | **Ship the business, not just the site — proof layer missing** |

## THE GOOD

The product actually works, and that is rarer than it sounds. Booking, commerce, referrals, gift cards, newsletters, and a cron-scheduled booking follow-up are all wired end-to-end — and when production broke (service-role key BOM, wrong Supabase project, paused project), the team root-caused the whole chain and closed it with E2E proof: form POST → 200 + persisted row, cron 200/401 by secret, deploy SHA verified live, preflight 29/0/2. The site's craft is investor-legible: consistent dark/gold system, splash and scroll-lock discipline, zero JS errors across 40 mobile loads. Security is a genuine program (23 rounds: webhook signing, CSRF on 14 routes, IP hashing, constant-time compares) — not a one-off scan.

## THE BAD

The money path contradicts itself. Home says "Every 3 months. Cancel anytime." while Pricing.tsx says "$250 Every month" and the plans page mixes both (E-H2); retouching shows "Varies" next to $50, design shows $75 in one place and $150 in another (E-H3/E44). A studio that sells design credibility cannot have pricing drift on its own pricing page. Supporting cast of bad: Google Business Profile still lists **Chicago** (should be Los Angeles), GA newsletter verification has no record, and there is not a single Playwright/axe spec — 13 rounds of a11y fixes can regress silently.

## THE UGLY

Trust surfaces leak small lies. The footer copyright line is physically unreadable on mobile — the fixed scroll-top and chat FABs cover it at page end (measured today, both widths). Micro-labels at ~10px sit under the conversion copy (plans add-ons, printing unit prices). Display headings break mid-word — "GALLERY", "SYSTEM STATUS", the community channel header — exactly where brand typography matters most. Two routes still overflow horizontally at 320px (+4px, +13px). Each is small; together they read as "unfinished" to the exact audience that judges polish for a living.

## THE BEAUTIFUL

The closing of the Supabase incident is the strongest asset in this file — not because it happened, but because it was *proven*: root-cause chain documented, vault key-case gotcha recorded, status-page false-green fixed so the system now tells the truth about itself. Add today's mobile sweep: 40 screenshots, zero JS errors, every defect enumerated with a severity and a fix status — including the ones the metrics missed (vision caught the word-breaks). An operation that audits itself this hard, then ships fixes the same session, is the kind of team an investor underwrites.

## THE TERRIBLE

Category 9 scores 4.0 because **no financials exist in the reviewed material** — no revenue, no margin, no CAC, no cohort. Bookkeeping tooling was built, but there are no numbers to board. Alongside it: 51 orphan `metadata.ts` files and two 1,400-line pages signal codebase drift that slows every future change; community is a demo being presented as a surface; and dependabot PRs + PAT rotation sitting unmerged/uneven means the supply-chain door is ajar while the security story is being told.

## Bottom line

**6.1/10 — a genuinely built product with an unproven business.** The engineering risk (the thing that kills most studios' sites) is largely retired and evidence-backed. What stands between this and an investable 7.5+: (1) one price canon enforced by test, (2) ten numbers — revenue, margin, channel performance — on one page, (3) LA listing + GA proof so local demand is real, (4) land the mobile polish already in flight. Execution capability (cat 8, 7.0) is doing the work of a bigger team; close the proof gaps and that velocity becomes the thesis instead of the footnote.

---
*Siblings: `WYZDESIGN_1000_POINT_COMPREHENSIVE_AUDIT_2026-09-28.md` (6.21/10) · `WYZDESIGN_2000_POINT_EXPANDED_AUDIT_2026-09-28.md` (1,241/2,000) · `WYZDESIGN_PRODUCTION_READINESS_AUDIT.md` (6.8/10) · `WYZDESIGN_VISUAL_AUDIT_2026-09-28.md`*
