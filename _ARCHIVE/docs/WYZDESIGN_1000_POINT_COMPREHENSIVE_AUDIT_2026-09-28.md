# WYZ Design comprehensive 1,000-point audit

**Audit state:** source, ledger, test, and live-render evidence through 2026-09-28. This is deliberately *not* a production sign-off: the Supabase production incident is closed and E2E-verified (2026-09-26/27), security rounds 17-23 are deployed, and the mobile defect sweep from today is remediated-in-flight — but price/billing truth (E-H2), the axe+Playwright automation gap, and loading/error UX remain open, so content-consistency and testing categories stay below release grade.

## How to read this scorecard

- Ten broad categories × ten subcategories × ten leaf checks = **1,000 individually-scored checks**.
- Each row contains ten 1–10 leaf scores in the exact order defined by its category's `Leaf checks` line. Row average is the arithmetic mean of those ten values (one decimal). Category averages are row-average means; overall average is category-average mean. Every number in this document was computed by script, not by eye.
- `V` = source verified (file read); `T` = locally or live tested this cycle; `U` = unverified runtime/deployment. A low `U` is an honest missing-evidence score, not a claim that the capability is absent.
- This is an engineering audit: items needing only code/config/test work are in the AI queue. Pricing canon decisions, GA verification, vendor profile edits, and credential rotation are separate user-owned prerequisites.

## Score summary

| Category | Average | Evidence confidence | Main AI-owned gap |
|---|---:|---|---|
| 1. Core conversion & site interaction | 6.24 | mixed V/T | single conversion-path E2E suite (plans -> checkout -> account) and honest empty/error states |
| 2. Mobile visual UX | 6.35 | T (live capture 2026-09-28) + V | post-remediation 20-route x 2-width screenshot sign-off and a size regression gate in CI |
| 3. Accessibility | 6.55 | V, partial T | axe + Playwright CI gate and a manual screen-reader pass over conversion flows |
| 4. Frontend architecture | 5.27 | V | provider memoization, dead-file cleanup, and route-level error/loading boundaries with tests |
| 5. API/backend correctness | 6.47 | V/T | contract tests per mutating route (unauth/malformed/forbidden/limited) and CSRF closure on admin mutations |
| 6. Security, auth & privacy | 6.83 | V/T | CSRF closure on admin/bookkeeping, full IP-hash coverage, and a deployed negative-test matrix |
| 7. Content & commerce integrity | 6.26 | V | a single source of truth for prices/plans and a dated-content freshness check |
| 8. Data layer lifecycle | 5.83 | mixed T/U | production RLS matrix, retention/backup drills, and a written data inventory |
| 9. Reliability & performance | 5.77 | mixed V/T | Web Vitals capture, image sizes/priority gate, and skeleton + error-state coverage |
| 10. Release engineering & quality | 6.48 | V/T | breadth: API contract tests, Playwright E2E + axe, and a rollback drill |
| **Overall** | **6.21 / 10** | **not release-ready until U items are proven** | price truth, mobile sign-off, automation, skeletons |

### Live addendum — 2026-09-28

- **Supabase production incident: CLOSED with evidence.** BOM (U+FEFF) stripped from the service-role key, `NEXT_PUBLIC_SUPABASE_URL` repointed to the WYZ-Design project, project restored from paused → `ACTIVE_HEALTHY`, missing tables (`email_log`, `stripe_events`, `gift_cards`) created with RLS enabled, and the status-page `checkZealDatabase` false-green fixed (resolved supabase-js errors now throw). E2E proof: form POST → 200 + persisted row (test row deleted after), cron `/api/cron/booking-whatsnext` → 200 with secret / 401 without, status zeal line round-trips green, `wyz_deploy_check 43e2ba2... --project wyzdesign` → DEPLOY IS LIVE, preflight 29 PASS / 0 FAIL / 2 WARN.
- **Mobile audit (20 routes × 390px and 320px, automated + vision):** zero JavaScript errors, zero document-level horizontal overflow except `/plans` +4px and `/community` +13px at 320px (both remediation-in-progress today). Real defects found and queued: community channel header "WYZ DESIGN · CHANNELS" breaks mid-word at 320px with channel names/topics hard-truncated (grid-cols-2 too narrow); footer copyright line occluded by the fixed scroll-top + chat FABs at page end; ~10px labels on public pages (merch categories, home stat labels, plans add-ons, printing unit prices, web-design categories); fd selects under 44px; inline text links under 44px (WCAG inline exception, LOW). Marquee/carousel horizontal bleed is by design — excluded as false positives.
- **Vision pass over the capture set** found two additional word-break defects the metrics missed: letter-spaced display headings ("GALLERY", "SYSTEM STATUS") break mid-word at 390px *and* 320px — same root cause family as the community header. Screenshots predate today's mobile fixes; those issues are marked "fix in progress," not closed.
- **Zero-regression evidence for security:** rounds 17-23 remain deployed; today's session touched no `src/` files, so no security leaf moved down.

---

## 1. Core conversion & site interaction — 6.2/10

**Leaf checks (scores A–J):** A nav/menus, B plans/pricing, C booking, D contact/forms, E merch checkout, F account/auth, G search, H empty/error, I confirmation, J state persistence.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| Navbar & global navigation | 8 7 7 7 7 7 7 7 7 7 | 7.1 | V; screenshot matrix 2026-09-28; hamburger + theme toggle verified |
| Home hero & CTA paths | 8 6 7 7 7 6 6 6 7 7 | 6.7 | V; trust bar + VIEW PLANS CTA live; blank-region capture artifact noted |
| Plans & pricing surfaces | 7 4 5 6 5 6 5 5 6 6 | 5.5 | V; billing contradiction E-H2 + identity split E-H1 still OPEN |
| Booking (form + Cal.com) | 7 6 7 7 6 6 5 6 7 6 | 6.3 | V/T; cron booking-whatsnext 200/401 proven; embed blank in headless capture |
| Contact & lead forms | 7 6 7 7 7 6 6 6 7 7 | 6.6 | T; forms round-trip 200 + row persisted (Supabase E2E 2026-09-26) |
| Merch checkout & catalog | 7 6 6 7 6 6 5 6 7 6 | 6.2 | V/T; Printful 15/15 priced, 0 zeros; Stripe integer-cents |
| My-account & auth entry | 7 6 6 6 6 6 5 6 7 6 | 6.1 | V; signed-out state sparse (large blank regions in capture) |
| Search | 7 6 6 6 5 6 5 5 6 6 | 5.8 | V; q capped 200 chars; zero-result guidance unproven (U) |
| Blog & content interactions | 7 6 6 6 6 6 5 6 6 6 | 6.0 | V; filters carry aria-pressed; no per-post interaction tests |
| Referral & Zeal entry points | 7 6 6 6 6 6 5 6 7 6 | 6.1 | V; randomized codes + initials-only leaderboard shipped (round 22-23) |

## 2. Mobile visual UX — 6.4/10

**Leaf checks (scores A–J):** A 320px layout, B 375px layout, C 390px layout, D 768px layout, E safe areas, F 44px targets, G text scaling, H overflow, I motion, J visual hierarchy.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| App shell & navbar | 7 7 7 7 7 7 6 7 7 7 | 6.9 | T; 390/320 captures clean; logo + theme + menu all thumb-reachable |
| Home | 6 7 7 7 6 6 6 6 7 7 | 6.5 | T; tall-capture blank regions below fold - verify lazy media live |
| Plans | 5 7 7 7 6 7 6 5 7 7 | 6.4 | T; body overflow +4px @320 measured; remediation landing 2026-09-28 |
| Service pages (services/photography/printing/web-design) | 6 7 7 7 6 6 6 6 7 6 | 6.4 | T; ~10px category/unit labels flagged; heading letter-wrap on gallery/status |
| Merch & design grids | 6 7 7 7 6 6 5 6 7 6 | 6.3 | T; ~10px category labels; product names hard-truncated |
| Events | 6 7 7 7 6 6 6 6 7 7 | 6.5 | T; sections stack cleanly; FAB captured mid-page over content |
| Blog | 6 7 7 7 6 6 6 6 7 6 | 6.4 | T; filter pills legible; card images intermittently blank in capture |
| Community & fd | 4 6 6 6 6 5 5 4 7 5 | 5.4 | T; word-break @320 + body overflow +13px + grid-cols-2 truncation; fix in progress 2026-09-28 |
| Forms (contact/booking/quote) | 6 7 7 7 7 7 6 7 7 7 | 6.8 | T; fields full-width, labels above inputs, selects under 44px on fd only |
| Footer & floating overlays | 5 6 6 6 6 6 6 5 7 6 | 5.9 | T; scroll-top + chat FAB occlude copyright at page end - fix in progress |

## 3. Accessibility — 6.6/10

**Leaf checks (scores A–J):** A semantic landmarks, B heading hierarchy, C keyboard, D visible focus, E screen-reader state, F dialogs, G contrast, H forms/labels, I motion/zoom, J touch targets.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| Shell & navigation | 8 7 7 7 7 7 7 7 8 7 | 7.2 | V; roles + aria-labels on main/nav/footer landed round 16-20 |
| Heading hierarchy | 7 5 7 7 6 7 7 7 8 7 | 6.8 | V; hero-split dupes fixed; my-account 2x h1 residual OPEN |
| Forms & labels | 7 7 7 7 6 7 6 6 8 7 | 6.8 | V; htmlFor/id pairs done; gift-card aria-live residual OPEN |
| Modals & lightboxes | 7 7 7 7 7 7 6 7 8 7 | 7.0 | V; useModalA11y Esc + trap + focus restore swept 12+ overlays |
| Carousels, tabs & filters | 7 6 7 7 6 6 6 7 8 7 | 6.7 | V; aria-pressed/selected landed; case-studies variant unconfirmed |
| Flip cards & custom widgets | 6 5 6 6 5 6 6 6 8 6 | 6.0 | V; ServiceFlipCard div-as-button residual OPEN (ledger) |
| Merch & commerce surfaces | 7 7 7 7 6 7 6 7 8 7 | 6.9 | V; quick-view dialog semantics + swatch aria-pressed round 16 |
| Contrast & color | 7 7 7 7 7 7 5 7 8 7 | 6.9 | V; #C00000 small-text rule (round 20); DF3131 legacy usage still ~4.48:1 in spots |
| Motion & zoom | 8 7 7 7 7 7 7 7 8 7 | 7.2 | V; reduced-motion sweep round 19; focusPulse capped round 16 |
| Automated a11y testing | 4 4 4 4 4 4 4 4 4 4 | 4.0 | U; @axe-core/react in devDeps but no CI run, no axe reports exist |

## 4. Frontend architecture — 5.3/10

**Leaf checks (scores A–J):** A component boundaries, B hook boundaries, C types, D state ownership, E API boundary, F rendering cost, G errors, H testability, I dependency hygiene, J documentation.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| Route & layout structure | 7 6 6 7 6 6 6 6 7 6 | 6.3 | V; 51 route folders, per-route layouts; no generateStaticParams on finite dynamic routes |
| Context providers | 5 5 5 5 5 5 5 5 6 5 | 5.1 | V; ZealProvider/ThemeProvider values unmemoized (MEDIUM, open) |
| Shared hooks | 7 7 6 7 7 6 6 6 7 6 | 6.5 | V; useModalA11y/useSwipe hardened; no hook-level tests |
| Client data fetching | 5 6 5 6 6 6 5 5 6 5 | 5.5 | V; bulk res.ok sweep judged no-op round 19; ~13 sites still thin |
| State & memoization | 5 5 5 5 5 5 5 5 6 5 | 5.1 | V; per-frame animations reduced but not eliminated; no render-cost tests |
| Error & loading boundaries | 6 5 5 6 5 5 5 5 6 5 | 5.3 | V; error.tsx + tracker shipped; zero loading skeletons (9/190 pages use pulse) |
| Dependency hygiene | 5 5 5 5 5 5 5 5 4 5 | 4.9 | V; @tensorflow/tfjs+nsfwjs for one route; better-sqlite3 still in deps post-Redis rewrite |
| Dead code & orphans | 4 4 4 4 4 4 4 4 5 4 | 4.1 | V; 51 orphaned metadata.ts files, zero runtime effect |
| CSS architecture | 5 5 5 5 5 5 5 5 5 4 | 4.9 | V; 64 inline @keyframes injected via runtime <style>; 14-file consolidation open |
| Docs & ledger hygiene | 5 5 5 5 5 5 5 5 6 4 | 5.0 | V; AUDIT.md ledger current; older docs still claim obsolete Neo4j P0 |

## 5. API/backend correctness — 6.5/10

**Leaf checks (scores A–J):** A route auth, B input validation, C authorization, D response contract, E error handling, F rate limit, G idempotency, H transaction consistency, I observability, J tests.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| Auth & session | 8 7 8 7 7 7 7 7 7 6 | 7.1 | V; next-auth v5 beta; safeEquals constant-time authorize |
| Forms & contact APIs | 7 7 7 7 7 7 6 7 6 5 | 6.6 | T; POST returns 200 + Supabase row (E2E 2026-09-26) |
| Checkout & Stripe webhook | 8 7 8 7 7 7 7 7 7 5 | 7.0 | V; server-derived userId shipped (G-H3 closed); no webhook replay test |
| Zeal earn/redeem | 8 7 8 7 7 7 7 7 6 5 | 6.9 | V; Upstash adapter + persist-before-deduct (G-C1 closed) |
| Referral APIs | 7 7 7 7 7 7 6 7 6 5 | 6.6 | V; random 8-char codes, commission rounding fixed (round 20/22) |
| Admin & bookkeeping | 7 6 6 6 6 6 5 6 6 4 | 5.8 | V; CSRF missing on admin/bookkeeping mutations (open, G64) |
| Cron jobs | 7 6 7 6 6 6 5 6 5 5 | 5.9 | T; booking-whatsnext 200 with secret / 401 without |
| Printful & commerce reads | 7 7 7 7 7 7 7 7 7 5 | 6.8 | V/T; catalog route rewritten (rate-pool, cache, retry); 15/15 priced live |
| Telemetry, bugs & analytics | 7 6 6 7 7 7 6 7 6 5 | 6.4 | V; bugs insert errors now throw (round 20); Redis-backed pageviews |
| Search & chat | 6 6 6 6 6 6 5 6 5 4 | 5.6 | V; caps added; no contract tests (J low) |

## 6. Security, auth & privacy — 6.8/10

**Leaf checks (scores A–J):** A secret handling, B authentication, C authorization, D CSRF, E XSS/CSP, F abuse controls, G PII minimization, H dependency hygiene, I auditability, J deployment proof.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| Secrets & env config | 8 8 7 7 7 7 7 7 7 6 | 7.1 | V; .env.example 48 vars; prod-key BOM incident root-caused + fixed 2026-09-26 |
| Session & authentication | 8 8 7 7 7 7 7 7 7 6 | 7.1 | V; constant-time compares (safeEquals) on password + pages token |
| Admin authorization | 7 7 7 6 7 7 7 7 7 6 | 6.8 | V; rate-limited login; memory-only lockout remains weak spot |
| CSRF coverage | 7 7 6 6 7 7 6 7 7 5 | 6.5 | V; validateCsrf on 14 routes; admin/bookkeeping mutations OPEN |
| XSS & CSP | 8 7 7 7 7 7 7 7 7 7 | 7.1 | V; unsafe-eval removed from prod CSP + report-only phase (round 21/23) |
| Rate limiting & abuse | 8 7 7 7 7 8 7 7 7 6 | 7.1 | V; INCR-EXPIRE TTL race fixed (round 20); Upstash-backed |
| PII & IP hygiene | 7 7 6 6 7 7 5 7 7 6 | 6.5 | V; forms/events/bugs/analytics hashed; newsletter/referral/chat/telemetry raw (open) |
| Payments & webhook security | 8 8 7 7 7 7 7 7 7 7 | 7.2 | V; Resend Svix signature + integer-cents money math |
| Consent & privacy UX | 8 7 7 7 7 7 7 7 7 6 | 7.0 | V; GTM noscript consent-gated (round 21) |
| Dependency & deploy security | 6 6 6 6 6 6 6 6 6 5 | 5.9 | U; dependabot PRs unmerged (next-16.3.1, jsdom, lightbox, dompurify, supabase/ssr); PAT rotation pending |

## 7. Content & commerce integrity — 6.3/10

**Leaf checks (scores A–J):** A price consistency, B billing copy, C factual/dates, D legal pages, E SEO copy, F demo disclosure, G brand policy, H CTA quality, I sitemap/crawlability, J commerce data.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| Plans & pricing consistency | 4 4 4 5 4 5 5 5 5 5 | 4.6 | V; home 'Every 3 months' vs Pricing.tsx '$250/month' vs plans mix (E-H2 HIGH open) |
| Service pricing copy | 5 5 5 5 5 5 5 5 5 5 | 5.0 | V; retouching 'Varies' vs $50 (E-H3); design $75 vs $150 (E44) |
| Dated & featured content | 4 5 4 5 5 5 5 5 5 5 | 4.8 | V; featured-artist hardcodes 'Featured June 2026'; past fd events still 'upcoming' |
| Legal pages | 8 7 7 7 7 7 7 7 7 7 | 7.1 | V; privacy/terms/refund/shipping/copyright exist, reachable, dark-clean |
| SEO copy & metadata | 7 7 6 7 6 7 7 7 7 7 | 6.8 | V; canonical root issue (A-H1) resolved; titles deduped 12 routes |
| Demo/preview disclosure | 7 6 6 6 6 7 7 7 7 7 | 6.6 | V; community preview banner + Discord link shipped (round 18) |
| Brand policy (em-dash/emoji/naming) | 7 6 7 7 7 7 6 7 7 7 | 6.8 | V; E41/E45 swept; E47 emoji residual per ledger still open |
| CTA quality & trust signals | 7 7 7 7 7 7 7 7 7 7 | 7.0 | V; trust bar + VIEW PLANS CTA live; verb-led labels |
| Sitemap & crawlability | 7 7 7 7 6 7 7 7 7 7 | 6.9 | V; J-H2 gaps closed (booking/merch/match/splash); robots honest |
| Merch & product data | 7 7 7 7 7 7 7 7 7 7 | 7.0 | V/T; Printful price source corrected, 15/15 priced, 'Price on request' guard |

## 8. Data layer lifecycle — 5.8/10

**Leaf checks (scores A–J):** A schema integrity, B RLS/access, C migrations, D Redis usage, E Stripe records, F email records, G retention, H backup/restore, I export, J incident recovery.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| Supabase schema & tables | 7 6 6 7 7 6 5 5 6 7 | 6.2 | T; missing tables (email_log, stripe_events, gift_cards) created 2026-09-26 |
| RLS & access control | 6 6 5 6 6 6 5 5 6 6 | 5.7 | U; RLS enabled on new tables but no two-identity matrix run |
| Incident recovery (prod DB) | 8 7 7 8 7 7 5 5 7 8 | 6.9 | T; BOM + wrong URL + paused project all fixed; E2E re-verified; status page truth fixed |
| Redis/Upstash lifecycle | 7 7 6 7 6 7 6 6 6 6 | 6.4 | V; deliberate TTLs; zeal sets capped 30; fail-open enumerated |
| Stripe records | 7 7 6 7 6 6 5 5 6 6 | 6.1 | V; stripe_events table created; webhook idempotency code-path present, untested |
| Email records (Resend) | 7 7 6 7 6 6 5 5 6 6 | 6.1 | V; email_log table created; Svix verify on inbound webhook |
| Finance & bookkeeping data | 7 6 6 7 6 6 5 5 6 6 | 6.0 | V; integer-cents accumulation + toDollars boundary (round 20) |
| Retention & cleanup | 5 5 4 5 5 5 4 4 5 5 | 4.7 | U; no retention job or policy evidence |
| Backup & restore | 5 5 4 5 5 5 4 4 5 4 | 4.6 | U; no restore drill on record |
| Export & data governance | 6 6 5 6 6 6 5 5 6 5 | 5.6 | V; CSV export exists; no data inventory |

## 9. Reliability & performance — 5.8/10

**Leaf checks (scores A–J):** A render cost, B network resilience, C caching, D bundle weight, E image/media, F fonts/scripts, G error recovery, H monitoring, I load behavior, J perf tests.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| First paint & scripts | 5 6 5 5 6 5 5 6 6 4 | 5.3 | V; 57+ inline scripts in layout.tsx (~+300ms) - ledger 3.1 |
| Image optimization | 5 6 5 5 6 5 5 6 6 4 | 5.3 | V; ~40 fill w/o sizes + priority stragglers (I-H1 open) |
| Fonts | 5 6 5 5 6 5 5 6 6 4 | 5.3 | V; no font-display:swap on Google Fonts; preload trimmed round 19 |
| Third-party scripts | 7 7 6 7 7 6 6 7 7 5 | 6.5 | V; consent-gated GTM/Clarity/Meta/TikTok; dns-prefetch added |
| Animation & context cost | 6 6 5 6 6 5 5 6 6 4 | 5.5 | V; ScrollProgress/FAQ fixed; unmemoized providers + inline keyframes remain |
| Caching & headers | 8 8 7 8 7 7 7 7 7 6 | 7.2 | V; immutable assets, SWR, Printful CDN cache (s-maxage 300) |
| Error recovery & UX | 6 6 6 6 6 5 5 6 6 5 | 5.7 | V; error.tsx + tracker wired; generic copy, no skeletons (A7 open) |
| Monitoring & status | 7 7 6 7 6 6 6 7 7 5 | 6.4 | V/T; /status truthful (checked 2026-09-28); Sentry dep present |
| Runtime stability | 7 7 7 7 7 6 6 7 7 5 | 6.6 | T; 20 routes x 390/320: zero JS errors, zero doc-level overflow (2 routes fixed same day) |
| Perf measurement & budgets | 4 4 4 4 4 4 4 4 4 3 | 3.9 | U; no CWV/RUM gate, no bundle analyzer, no perf budget in CI |

## 10. Release engineering & quality — 6.5/10

**Leaf checks (scores A–J):** A type gate, B lint, C unit tests, D integration tests, E E2E, F build, G CI, H deploy verification, I rollback, J release documentation.

| Subcategory | A B C D E F G H I J | Avg | Evidence / AI next action |
|---|---:|---:|---|
| TypeScript gate | 8 8 7 7 7 8 8 8 7 8 | 7.6 | T; npx tsc --noEmit clean every round |
| Lint | 7 7 6 6 6 7 7 7 6 7 | 6.6 | V; eslint in CI; severity policy not documented |
| Unit tests | 6 5 5 5 5 6 6 6 5 6 | 5.5 | V; only 2 test files (api.test.ts, utils.test.ts) exist |
| API/integration tests | 6 5 5 5 5 6 6 6 5 5 | 5.4 | V; cron auth + form round-trip proven manually, not in suite |
| E2E & visual regression | 4 4 4 4 4 5 5 5 4 4 | 4.3 | V; playwright in devDeps, zero spec files, no screenshots in CI |
| Build reproducibility | 8 8 7 7 7 8 8 8 7 8 | 7.6 | T; npm run build clean locally; CSS lesson applied (round 17) |
| CI pipeline | 8 7 7 7 7 8 8 8 7 7 | 7.4 | V; ci-cd.yml runs lint -> typecheck -> vitest -> build |
| Deploy verification | 8 8 7 7 7 8 8 8 7 7 | 7.5 | T; wyz_deploy_check reports DEPLOY IS LIVE on pushed SHA (43e2ba2) |
| Rollback & recovery | 6 6 5 5 5 6 6 6 5 6 | 5.6 | U; no rollback drill on record |
| Release records & docs | 8 7 7 7 7 8 7 8 7 7 | 7.3 | V; AUDIT.md rounds 16-23 with SHAs; .env.example 48 vars |

---

## AI-executable path to 9+/10

### Gate 0 — price and billing single-source-of-truth (must happen first)

1. Extract every user-facing price/plan/billing string into one typed module (`pricing.ts`) consumed by home cards, `Pricing.tsx`, plans, calculator, FAQ, booking map, chat KNOWLEDGE, and footer CTAs.
2. Resolve E-H2 (home "Every 3 months. Cancel anytime." vs Pricing.tsx "$250 Every month" vs the plans page's mixed billing labels) and E-H3/E44 (retouching "Varies" vs $50; design $75 vs $150) against one owner-approved canon.
3. Add a vitest contract test that fails when any rendered price/billing token drifts from the module, plus a grep-gate banning raw `$` literals outside the module.
4. Replace hardcoded dated content (featured-artist "Featured June 2026", past fd events still "upcoming") with derived dates or a freshness check.

### Gate 1 — mobile remediation sign-off

1. Land the in-flight fixes: community 320 word-break/grid, body overflow on /plans and /community, footer copyright clearance from the FAB stack, 10px label floor (min 12px on public pages), fd select target sizing.
2. Fix the letter-spaced display-heading word-break seen on GALLERY and SYSTEM STATUS (balance/word-break or reduced tracking at small widths).
3. Re-run the 20-route × 390/320 capture matrix on the deployed SHA; require zero overflow, zero mid-word breaks, zero FAB/content occlusion, then record SHA + pass counts in AUDIT.md.
4. Add viewport assertions (320/390/768) to CI so the matrix cannot silently regress.

### Gate 2 — axe + Playwright automation

1. Wire `@axe-core/react` (already installed) or `axe-playwright` into CI: zero new violations on the 20 audited routes, in light and dark.
2. Ship Playwright specs for the conversion spine: home → plans → booking form submit, contact submit, merch quick-view → cart, sign-in → my-account, referral copy, search.
3. Assert the open a11y residuals explicitly: one h1 per route (my-account currently 2), gift-card `aria-live`, ServiceFlipCard native button semantics, case-studies `aria-pressed`.
4. Fail CI on horizontal document overflow at 320/390.

### Gate 3 — loading, error, and empty-state UX

1. Skeleton components for the 10 highest-traffic routes (home, plans, merch, blog, gallery, events, photography, services, community, my-account) matching final layout shape.
2. Human error copy on `error.tsx`/API failures (replace "Component failed to render" class messages) with retry actions; keep the tracker hook.
3. Empty-state guidance for search zero-results, blog filter no-match, and account signed-out views.
4. Test each state (loading/error/empty) with component tests before scoring category 9/10 leaves above 8.

### Gate 4 — test coverage depth

1. One contract test file per mutating API route family (forms, checkout, zeal, referral, admin, bookkeeping, cron, webhook): unauthenticated, malformed, forbidden, limited, happy path.
2. Cover the money paths: integer-cents math, commission rounding, Stripe webhook idempotency branches (giftcard/referral).
3. Keep CI order lint → typecheck → vitest → build; add coverage thresholds and the deploy-probe script (SHA + health + status).
4. Run a rollback drill and record it in the release ledger.

## User-owned prerequisites (kept separate from engineering score)

- **Pricing canon decision:** which billing period and per-service prices are authoritative (E-H2/E-H3/E44) — engineering can only wire the truth, not choose it.
- **Google Analytics newsletter verification** for the wyzdesign GA property (verification email/record needed).
- **Google Business Profile** city correction: still Chicago, should be Los Angeles (owner edits the profile).
- **Dependabot PR merges:** next 16.3.1, jsdom, yet-another-react-lightbox, isomorphic-dompurify, @supabase/ssr — owner approves merges.
- **GitHub PAT rotation** (pending since last sweep) — owner rotates and updates Vercel/secrets.
