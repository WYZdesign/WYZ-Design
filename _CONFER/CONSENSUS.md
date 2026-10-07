# _CONFER: Consensus

Date: 2026-10-07. Author: WYZMiND. This merges the audit with four independent agent reviews plus Codex's parallel audit, topic matrix, and route ledger.

## Who conferred
- WYZMiND (infra, DB, integration): `_CONFER/WYZMIND.md`
- Codex (routing, copy, audit, search risk): `_CONFER/CODEX.md` plus `WYZDESIGN_CONSOLIDATION_5000_POINT_AUDIT.md`, `WYZDESIGN_CONSOLIDATION_5000_TOPIC_MATRIX.md`, `WYZDESIGN_CONSOLIDATION_AGENT_HANDOVER.md`, `WYZDESIGN_ROUTE_DECISION_LEDGER.md`
- Verification agent (inventory evidence)
- IA + SEO agent (navigation, redirects, sitemap)
- Layout + accessibility + performance agent (visual system, duality, perf)
- Copy + UX agent (voice, brevity, house rules)

Agreement level: **full agreement on all 7 decisions, with two corrections to route targets and one open question on photography filter names.**

## Agreed decisions

| # | Decision | Resolution | Votes |
|---|---|---|---|
|1|Duality entry|**A. `/work` split gateway.** Already shipped (4212228). Wire it into nav, sitemap, search, and footer.|Unanimous|
|2|Photography filters|**Keep 6, owner picks the names.** Current reality is 8 hub albums, 13 defined categories, 11 in sitemap. Do not rename or hide from an audit guess. Keep Boudoir and Bodypaint behind the age gate.|Unanimous on 6; names differ, owner decides|
|3|Service detail family|**A. `/services/{service}`.** 301 the old `/service-page/*`. Repoint `next.config.ts:140-141` to avoid chains.|Unanimous|
|4|Testimonials|**A if real links, else B cut.** The current links are `google.com/search?q=<Name>+review`, which reads as fake proof. Keep the quotes only with a real source or permission record.|Unanimous|
|5|Lab pages|**Hide from the prospect sitemap** (splash x4, match, secret, 3pointprogram, merch/concepts, view, clear-cache). Keep `/status` and `/offline` working for support. Drop `/fd`.|Unanimous|
|6|Legal|**A. Nest under `/legal`**, 301 the five flat routes. IA agent condition: only if a real `/legal` hub exists, otherwise keep flat.|Majority A|
|7|Combine list|**Agree**, with two corrections: `/gallery` -> `/photography` (not `/work`), and case studies -> `/designs/<slug>` (not `/work/<slug>`).|Unanimous with corrections|

## Agreed navigation
Primary top bar: WORK (`/work`), PHOTOGRAPHY, DESIGNS, SERVICES, MERCH, then MORE. The logo already links home, so drop the text "HOME" item. Keep "Merch" (owner). Mobile must render the same 5 plus a grouped More, not the current flat 18-link list.

Footer: four audience columns, not 23 mixed links.
- Hire WYZ: Services, Photography, Designs, Web Design, Printing, Plans, Contact
- Explore Work: Work, Photography, Designs, Events, Merch, Blog
- Existing Clients: Booking, Rewards, Gift Cards, Account, FAQ
- Company + Legal: About, Community, Featured Artist, WYZMiND, then the legal set

## Agreed route + redirect plan
| Old | 301 target |
|---|---|
|`/home`|`/`|
|`/booking-calendar/{4}`|`/booking?service=...`|
|`/service-page/{4}`|`/services/{service}`|
|`/brands`|`/about`|
|`/gallery`|`/photography`|
|`/case-studies` + 4|`/designs` + `/designs/<slug>`|
|`/partnerships`|`/contact?type=partnership`|
|`/referral`|`/loyalty`|
|`/fd`|`/about`|

Chain fixes in the same release: repoint `next.config.ts:137-143` (e.g. `/booking-photoshoot` and `/service-photoshoot` currently point into `/booking-calendar/photoshoot`, and `/service-consultation` points into `/service-page/creative-consultation`). Everything one hop.

Robots + sitemap: trim `/home`, `/service-page/*`, `/booking-calendar/*`, `/gallery`, `/brands`, `/case-studies/*`, `/partnerships`, `/referral`, `/match`, splash x4. Add `/work`. Expand `robots.ts` disallow (today only 4 paths). Note `src/proxy.ts:40` 403-blocks AI crawlers; decide deliberately.

## THE MASTER ADD / CHANGE / EDIT / REMOVE LIST

### ADD
- ADD `/work` to `Navbar.tsx`, `Footer.tsx`, `sitemap.ts`, and `src/app/api/search/route.ts`. It is orphaned.
- ADD `src/components/Hero.tsx` and `src/components/Section.tsx` so pages stop hardcoding spacing and heroes (globals.css already has `.section-gap` / `.content-w` / `.card-pad`).
- ADD a shared route registry so nav, footer, search, sitemap, and Quick Links never disagree after a redirect.
- ADD breadcrumbs on deep routes: blog detail, merch detail, photography category, case study, service detail.
- ADD filters + sort on Photography and Designs (only Merch has them today).
- ADD one plain promise line to the home hero: what you do, where, price from, turnaround.
- ADD one reassurance line near the first CTA: "Free 30-minute consult. 50% deposit to book, free reschedule up to 48 hours out."
- ADD a single primary CTA wording, "Book a free consult", everywhere (replaces START A PROJECT, GET A QUOTE, GET STARTED, SUBSCRIBE mix).
- ADD a closing CTA to `/gallery` and `/faq` (both dead-end).
- ADD `aria-label` to the desktop nav search input (`Navbar.tsx:233`), the designs textarea (`designs/page.tsx:441`), and the fd input (`fd/page.tsx:319`).
- ADD a verified proof module (result + direct testimonial source + related work) reused near booking decisions.
- ADD an integration checklist for redirects: destination loads, 301 verified, metadata, search, internal links, analytics, mobile.

### CHANGE
- CHANGE the `/work` panel expand to fine-pointer only, add `focus-visible`, `motion-reduce`, and fix the mobile seam label (`work/page.tsx:26,69`). Match the cross-switch copy (`WorkCrossSwitch.tsx:21` says "Two sides, one studio", the page says "Two sides. One studio.").
- CHANGE `/about` mission metrics from 60+/30+ to the aligned set, and `lib/seo.ts:51` (`about/page.tsx:159`). Metrics are not unified today.
- CHANGE the "three brands" body copy (`about/page.tsx:219`, `partnerships/page.tsx:94`) to match the page title (4 brands total, 3 sub-brands).
- CHANGE the `/services` hub: group the 27 cards under 5 H2 categories, one starting price per group, one Book CTA per group.
- CHANGE the 4 divergent service price sources (home, services, booking, photography) to one shared data file. Motion Graphics is $150 on /services but $150+ on /booking; Video Editing $200 vs $100+.
- CHANGE `next.config.ts:137-143` to point straight at final targets.
- CHANGE `robots.ts:10` to disallow the full utility + lab set.
- CHANGE `sitemap.ts` to remove duplicates and lab routes; add `/work`.
- CHANGE `layout.tsx:344` to drop `role="main"` (67 pages also render `<main>`; that is a duplicate main landmark).
- CHANGE the footer to 4 audience columns and remove `/home`, `/brands`, `/referral` links after merges.
- CHANGE events scroll buttons `aria-label`s to match direction (`events/page.tsx:444-451`).
- CHANGE accordion toggles to carry `aria-expanded`/`aria-controls` (`designs/page.tsx:97`, `printing/page.tsx:30`).

### EDIT (copy)
- EDIT home to 450 words and 8 to 12 blocks: cut the 34-item FAQ render (keep the schema), the 12-link Quick Links grid, 2 of the 3 hero CTAs, the duplicate founder paragraph, and one set of value cards.
- EDIT plans to under 600 words: one price table (not three), a one-line auto-renew note, drop one of calculator/build-form/add-ons.
- EDIT events from 40 blocks to about 8: the DIY carousel and the autoplay playlist render the same data twice; merge into one video gallery with a filter.
- EDIT web-design from 27 blocks to ~12: merge capabilities + process, fold testimonials into the portfolio, point pricing to `/plans`.
- EDIT printing paper blurbs to one plain sentence each; cut the redundant paper-options line.
- EDIT empty states to add a nudge: `/gallery:146`, `/model-archive:228`, `/loyalty:212`.
- EDIT `lib/seo.ts:227` Kid Bode description to match the index ("Artist Branding + Content Production").
- EDIT every page to the copy rules: plain words, contractions, no em/en-dashes, no AI tells, one idea per sentence, second person, digits.

### REMOVE
- REMOVE `/service-page/*` (after 301), `/booking-calendar/*` (after 301), `/home` (after 301).
- REMOVE the duplicate "THE BRANDS" section from one of `/about` or `/partnerships`.
- REMOVE the inline testimonial block from `/web-design` (repeats the home component).
- REMOVE the fake `google.com/search?q=` testimonial links, the share buttons on reviews, and the `&mdash;` (`Testimonials.tsx:111`).
- REMOVE `99.9% uptime guaranteed` and similar unverifiable lines (`web-design/page.tsx:83`).
- REMOVE em/en-dashes in visible copy: `Testimonials.tsx:111`, `StrategyWizard.tsx:38,39,47`, `shipping-policy/page.tsx:26,33,37,41`, `service-page/event-photography/page.tsx:84`, `service-page/creative-consultation/page.tsx:108`, `community/page.tsx:716`, `loyalty/page.tsx:110`, `merch/concepts/page.tsx:9,11,13,15,16`, `mobile-splash/page.tsx:177`.
- REMOVE the 3D flip-card pattern (fails touch, hover, and reduced motion). Show price, scope, and action without hover.
- REMOVE extra animations: one accent per viewport; one scroll listener per page (merch has three).

### FIX (a11y, keeps axe 0)
- Duplicate main landmark (`layout.tsx:344`).
- `/work` has no `h1` (add a screen-reader `h1` "Our Work").
- Gallery lightbox `alt` repeats the category (`gallery/page.tsx:41`); use a real description.
- Home service tabs need `aria-pressed` (`home/page.tsx:1019`).

## Truth items that need the owner before we touch copy
1. Delivery promise conflict: home FAQ and photography metadata say 24-hour turnaround; `service-page/photoshoot` says 5 business days with 24-hour as a rush add-on. Pick one.
2. Pricing canon: board tasks 1, 2, 23. Retouching now leads with $50; confirm.
3. Metrics records: 90+ events, 45+ clients, 1,500+ photos, 9+ years. Need source records.
4. WYZMiND claims: `/wyzmind` says no data to third parties, but chat uses OpenRouter and privacy policy says otherwise (task 31).
5. Testimonials: real review URLs or permission, else cut.
6. Community claims: Monday challenge, "2K+ followers", Thursday reviews, Chicago and LA meetups need a source or a date (task 39).
7. Legal dates: all five pages still say "Last updated: January 2025".
8. Splash: `src/app/page.tsx` gates `/` behind an Enter splash. Measure its effect before changing.

## Sequencing (agreed)
1. Ship shared visual primitives: `Hero`, `Section`, one card pattern. Fix the duplicate main landmark and the `/work` h1 in the same pass.
2. Condense copy on home, services, plans, events, web-design, printing (before any URL change).
3. Wire `/work` into nav, sitemap, search, footer; add the cross-switch to Photography; polish the pointer/motion/seam.
4. Then the approved true merges with 301s, sitemap, search, metadata, internal links, and 30-day measurement, all in one release.

## Owner decisions still needed
1. Photography filter names (pick 6 of the 13).
2. Delivery promise (24 hours or 5 business days).
3. Real testimonial links or cut.
4. Keep any lab pages public (secret, 3pointprogram, match, splash).
5. `/legal` hub yes or no (if no, keep legal flat).
6. Splash kept, shortened, or skipped.

## Scoring
`WYZDESIGN_CONSOLIDATION_AUDIT.md` v5: **2,504 / 5,000.** Codex's independent baseline: 2,795 / 5,000. Target 4,300 or more after the agreed phases.
