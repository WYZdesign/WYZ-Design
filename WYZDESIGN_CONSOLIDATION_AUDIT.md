# WYZ Design: Consolidation + Cleanliness Audit (5,000 points)

Owner request (2026-10-07): the site feels extensive and busy. Consolidate, shorten, plain-language everything, remove noise, make it easy to understand at a glance and easy to book. All agents contribute opinions, then we agree on one plan.

Status: DRAFT for multi-agent consensus. Author: WYZMiND. Contributors: Claude, Codex, (add yours below).

Method: every public route was pulled live on 2026-10-07 and measured (word count, heading counts). Scores below cite that evidence. Nothing here changes the site yet. This is the agreement doc.

Writing rules for everything in this repo and every page (locked by owner):
- Plain words. If a 12-year-old would pause, rewrite it.
- Contractions. "we'll", "you're", "it's".
- No em-dashes or en-dashes. Use commas or periods.
- No AI tells. Banned: leverage, seamless, delve, elevate, unlock, curate, empower, moreover, furthermore, "in today's fast-paced", "we're passionate about", "take it to the next level", "elevate your brand".
- One idea per sentence. Short sentences. Cut adverbs.
- Second person. Talk to "you". Use "we" for the studio.
- Digits for numbers.

---

## Part 1: The problem in numbers

Live page volume (2026-10-07). "Busy" = heading/section count and word count both high.

| Route | Words | H2 | H3 | Read |
|---|---:|---:|---:|---|
| / | 1016 | 7 | 23 | Long, 30 blocks. Duplicate of /home |
| /home | 1010 | 7 | 23 | Exact duplicate of / |
| /plans | 1057 | 4 | 21 | Longest page. Pricing heavy |
| /services | 955 | 0 | 56 | 56 items on one page |
| /printing | 953 | 9 | 9 | Long, 9 sections |
| /wyzmind | 861 | 3 | 7 | Marketing for a separate product |
| /about | 854 | 6 | 9 | Long founder story |
| /web-design | 758 | 6 | 27 | 27 sub-blocks |
| /community | 696 | 5 | 3 | Static demo data |
| /faq | 607 | 1 | 1 | Fine size, needs trim |
| /partnerships | 601 | 5 | 10 | Overlaps /contact |
| /blog | 587 | 1 | 12 | Fine |
| /merch | 574 | 4 | 4 | Store |
| /photography | 509 | 2 | 10 | Portfolio |
| /designs | 480 | 6 | 4 | Overlaps /services |
| /events | 472 | 5 | 40 | 40 blocks |
| /merch/concepts | 470 | 1 | 11 | Archive |
| /featured-artist | 458 | 3 | 9 | Overlaps /community |
| /brands | 332 | 4 | 1 | Thin. Overlaps /about |
| /legal x5 | ~1900 | | | 5 separate legal pages |

Totals: 53 public routes measured, about 23,000 words, 57 sitemap routes, 9 nav links.

Three structural problems jump out:

1. Duplicate routes. `/` and `/home` are the same page. `/service-page/{service}` and `/booking-calendar/{service}` both exist for the same 4 services.
2. Cluster sprawl. "What we do" is spread over `/services`, `/web-design`, `/printing`, `/photography`, `/designs`, `/brands`, plus 4 `/service-page/*`. Merch is spread over `/merch`, `/merch/concepts`, `/dying-breed-crew`, `/nomadic-breed`, `/featured-artist`, `/model-archive`. Proof is spread over `/events`, `/gallery`, `/case-studies` (+4 details), `/community`.
3. Long pages. Home 1016 words over 30 blocks; plans 1057. Both should be roughly half.

---

## Part 2: Scorecard (5 domains x 1,000 points)

Scored from the 2026-10-07 evidence. 0 = broken or missing, 100 = clean and done. Current total: **3,020 / 5,000** (Needs work).

### D1. Information architecture + navigation, 1,000

| # | Area | Score | Evidence + action |
|---|---|---:|---|
|1.1|Primary nav is minimal and clear|80|Only 9 links. Good. Keep.|
|1.2|Every page is reachable from nav or hub|45|57 sitemap routes, 9 in nav. Most pages are orphans found only by luck. Give each a home in a hub.|
|1.3|Page count is sane|40|57 public routes for a small studio. Target 26 to 30.|
|1.4|Clean URL structure|60|`/service-page/x` and `/booking-calendar/x` are ugly and duplicated. Nest under one hub.|
|1.5|No duplicate routes|25|`/` = `/home`. Two families for the same 4 services.|
|1.6|Redirect plan for merges|0|None yet. Build a redirect map so nothing 404s.|
|1.7|Nav labels use plain words|85|"Book", "Rewards" style. Fine.|
|1.8|Footer earns its space|55|Likely a link dump. Group into 3 columns max.|
|1.9|Breadcrumbs on deep pages|20|Missing on case studies and service pages.|
|1.10|Sitemap + robots match reality|60|Sitemap lists orphan and internal pages (splash, match). Trim to real public pages.|

Subtotal D1: **490 / 1,000**

### D2. Layout + formatting, 1,000

| # | Area | Score | Evidence + action |
|---|---|---:|---|
|2.1|One consistent container width|75|Mostly consistent. Audit outliers.|
|2.2|Consistent section spacing|65|Varies a lot across pages. Lock a spacing scale.|
|2.3|One H1 per page, logical H2/H3|70|OK. `/services` has 56 H3s with no H2 grouping.|
|2.4|Grid and card consistency|65|Cards differ between pages. One card pattern.|
|2.5|Screen density (not busy)|40|Home 30 blocks, events 40, web-design 27. Cut to 8 to 12 per page.|
|2.6|Above the fold says who/what/CTA|60|Some heroes are decorative only. Add a one-line promise and a button.|
|2.7|One primary CTA per page|50|Several pages have 3+ competing CTAs.|
|2.8|Image sizing and quality|70|Image optimizer bug just fixed (task 41). Recheck sizes after.|
|2.9|Dark and light parity|80|Both shipped. Spot-check contrast.|
|2.10|Mobile composition|70|Gutters pass (34/34). Cut block count on mobile too.|

Subtotal D2: **645 / 1,000**

### D3. Content clarity + brevity, 1,000

| # | Area | Score | Evidence + action |
|---|---|---:|---|
|3.1|Page word budgets|35|Home 1016, plans 1057. Target: home 500, hubs 200, service 300.|
|3.2|Short sentences (20 words max)|45|Long sentences common. Split them.|
|3.3|Plain language (grade 6 to 8)|50|Jargon in service and plans copy.|
|3.4|Contractions + human voice|55|Mixed. Standardize.|
|3.5|No AI tells|60|Some corporate phrasing. Sweep it.|
|3.6|No em/en-dashes|70|Audit found em-dash usage. Remove all.|
|3.7|Clear headlines (8 words max)|60|Some are clever but vague.|
|3.8|Jargon removed|50|"Composite and manipulation", "Brand strategy" need plain swaps.|
|3.9|One idea per block|55|Blocks often carry two or three ideas.|
|3.10|No duplicated copy across pages|40|Home/about/service repeat the founder story and metrics.|

Subtotal D3: **520 / 1,000**

### D4. Findability, sorting + flows, 1,000

| # | Area | Score | Evidence + action |
|---|---|---:|---|
|4.1|Search is useful|45|Search works but lists few results. Index real pages.|
|4.2|Filtering and sorting on listings|65|Store has sorting. Portfolio has little.|
|4.3|Portfolio is organized|50|Gallery, designs, case studies, photography all overlap. One work hub.|
|4.4|Category count is sane|40|12 photography categories. Cut to 4 or 5.|
|4.5|Booking flow is short|55|`/booking` embeds Cal.com. The 4 booking-calendar pages duplicate it.|
|4.6|Pricing is easy to find|50|Prices live on plans, service pages, and booking. One source of truth.|
|4.7|Contact paths are obvious|70|Contact plus partnerships plus forms. Merge partnership into contact.|
|4.8|Related pages cross-link|50|Weak. Add "next step" links.|
|4.9|Mobile menu is simple|75|OK.|
|4.10|Empty and zero states|40|Some listings show nothing when empty. Add a nudge.|

Subtotal D4: **540 / 1,000**

### D5. Trust, accessibility + conversion, 1,000

| # | Area | Score | Evidence + action |
|---|---|---:|---|
|5.1|Proof has real sources|35|Testimonials link to broad Google searches, not real review URLs (Codex task 41). Fix or cut.|
|5.2|Metrics are consistent|70|Just unified to 90+/45+. Confirm against records.|
|5.3|Pricing is clear and current|55|Retouching tiers just aligned. Plans copy fixed. Keep one canon.|
|5.4|Accessibility (automated)|90|axe 0/10.|
|5.5|Keyboard and contrast|80|Cart drawer fixed. Spot-check focus order.|
|5.6|Performance|70|Large image counts. Confirm after optimizer re-enable.|
|5.7|Trust pages present|75|5 policy pages exist. Group under /legal.|
|5.8|Every page has an obvious next step|45|Many pages end without a CTA. Add one.|
|5.9|Forms are low friction|60|Some long forms. Trim fields.|
|5.10|Payment feels safe|75|Cart plus Stripe now real. Add a short reassurance line.|

Subtotal D5: **655 / 1,000**

**Total: 3,020 / 5,000.**

---

## Part 3: Proposed consolidation (the merge map)

Goal: 57 routes down to about 28. Every merge ships a 301 redirect.

Core shape:

| Keep | Absorbs | Notes |
|---|---|---|
|`/` Home|`/home`|Merge. Keep `/` canonical. Redirect `/home` to `/`.|
|`/work` (new hub)|`/gallery`, `/designs`, `/case-studies` list|One portfolio hub with filters (photo, design, print, event). Case study details stay at `/work/<slug>`.|
|`/services` (hub)|`/web-design`, `/printing`, `/designs` copy, `/brands`|One "what we do" hub. 4 service cards, not 56 items.|
|`/services/photoshoot`, `/services/photo-retouching`, `/services/event-photography`, `/services/consultation`|`/service-page/*` AND `/booking-calendar/*`|One detail page per service, each ending in a Book button. Kill both duplicate families.|
|`/photography` (portfolio)|`/photography/[category]` (trim 12 to 5)|Keep as a photography gallery with 5 filters: Portraits, Events, Editorial, Studio, Places.|
|`/booking`|`/booking-calendar/*`|One booking page. Cal.com already embedded.|
|`/shop` (rename `/merch`)|`/merch/concepts`, `/dying-breed-crew`, `/nomadic-breed`|One store. Collections become filters. Keep `/shop/[id]` and `/shop/order`.|
|`/shop/artists` (or `/community`)|`/featured-artist`, `/model-archive`|One artists/community page.|
|`/events`|trim|Keep, cut from 40 blocks to about 12.|
|`/rewards`|`/loyalty` plus `/referral`|One rewards page (earn, tiers, refer, redeem).|
|`/contact`|`/partnerships`|One contact page with a "partnership" option.|
|`/legal` hub|terms, privacy, shipping, refunds, copyright|Nest all 5.|
|`/plans`|keep|Subscriptions. Trim to under 600 words.|
|`/about`|`/brands`|About plus client logos.|
|`/faq`|keep, trim|Fold policy Qs into it.|
|`/blog`|keep|Fine.|
|`/gift-card`|keep|Fine.|
|`/wyzmind`|keep, slim|Separate product. Short teaser, point to wyzmind.com.|
|`/status`|keep|Internal-ish. Fine.|
|`/account/my-account`, `/cart`, `/search`|keep|Utility.|

Remove or hide (not public): `/splash`, `/splash-gallery`, `/splash-showcase`, `/mobile-splash`, `/match`, `/3pointprogram`, `/fd`, `/secret`, `/view/[page]`, `/clear-cache`, `/offline`, `/admin`. Most are experiments, easter eggs, or internal tools. Either delete, gate behind login, or move to a lab.

Redirect examples:
- `/home` -> `/`
- `/service-page/:svc` -> `/services/:svc`
- `/booking-calendar/:svc` -> `/booking`
- `/case-studies` -> `/work`
- `/case-studies/:slug` -> `/work/:slug`
- `/gallery` -> `/work`
- `/designs` -> `/work` (or `/services`)
- `/merch*` -> `/shop*`
- `/featured-artist`, `/model-archive` -> `/shop/artists`
- `/referral` -> `/rewards`
- `/partnerships` -> `/contact`
- legal -> `/legal/*`

---

## Part 4: Copy standards + before/after

Rules: plain words, contractions, no em-dashes, one idea per sentence, second person, digits, short headlines.

Length targets:
- Home: 450 words max.
- Hub pages (services, work, shop, events, about): 200 words max.
- Service detail pages: 300 words max.
- Legal: as long as needed, plain words.
- Headlines: 8 words max. Subheads: 15 words max.
- Paragraphs: 3 sentences max.

Before (current home, 1016 words, trimmed sample):
> "Every service we offer comes from one simple place: we make things that look good and actually work. WYZ Design started in Chicago's DIY art and music scene, making flyers for friends, shooting shows in basements, and learning every part of the creative process by doing it."

After (about 30 words, plain, contractions):
> "We make work that looks good and works. We started in Chicago's DIY scene making flyers and shooting shows. Now we're in LA, doing the same thing for brands and artists."

Before (AI-tell example):
> "We leverage a seamless, end-to-end creative process to elevate your brand and unlock its full potential."

After:
> "We handle the whole job, from idea to final files. You get work that fits your brand."

Before (service jargon):
> "Composite and manipulation work."

After:
> "Photo edits that combine images or add effects."

Before (dash):
> "Photo, design, print -- all in one place."

After:
> "Photo, design, and print. All in one place."

---

## Part 5: Priority actions (in order)

Phase 1 (structure, biggest win):
1. Merge `/` and `/home`. Redirect.
2. Build `/services` hub and one detail page per service. Kill `/service-page/*` and `/booking-calendar/*`.
3. Build `/work` hub. Merge gallery, designs, case studies.
4. Rename `/merch` to `/shop`. Fold collections in.

Phase 2 (trim):
5. Home to 450 words and about 12 blocks.
6. Plans to under 600 words.
7. Events from 40 blocks to about 12.
8. Photography from 12 categories to 5.

Phase 3 (copy sweep):
9. Apply the writing rules to every page. Run a lint pass (banned words, dashes, sentence length).
10. One CTA per page, one pricing source of truth, real testimonial sources.

Phase 4 (housekeeping):
11. Merge rewards, merge contact/partnerships, nest legal.
12. Hide lab pages from the public sitemap.

---

## Part 6: Open questions for consensus

For the owner:
1. Store name: keep "Merch" or rename to "Shop"? (Shop tests clearer.)
2. Portfolio: one `/work` hub, or keep photo and design separate?
3. Testimonials: give me the real review links, or cut the quotes?
4. Keep any lab pages public (secret, 3pointprogram, match, fd)?
5. wyzmind: keep a slim page here, or move it to wyzmind.com only?

For Claude: layout and component consolidation. One section rhythm, one card pattern, one hero pattern.
For Codex: redirect map, sitemap trim, and copy lint rules in CI.
For every agent: add your opinion below, then we pick the final plan.

Consensus log (append your view, date + name):
- WYZMiND (2026-10-07): agree with the full merge map. Biggest wins are merging home, killing the double service routes, and one work hub. Ship redirects the same day as merges.
- Claude (add here):
- Codex (add here):

---

## Part 7: Scoring history

| Date | Score | Note |
|---|---:|---|
|2026-10-07|3,020 / 5,000|Baseline from live measurement|
| | | target 4,200+ after Phase 1 to 3|
