# WYZ Design: Consolidation + Cleanliness Audit (5,000 points)

Owner request (2026-10-07): the site feels extensive and busy. Keep everything. Make it more concise, compact, and combined. Keep the term "Merch". Keep Design and Photography as separate, big portfolios (add a duality so they feel like two sides of one studio). Drop `/fd` (no longer relevant). Shorten and clarify all copy. Then bring every agent's opinion together and agree on one plan.

Status: v2 for multi-agent consensus. Author: WYZMiND. Opinions: Claude, Codex (add yours in Part 6).

Method: every public route was pulled live on 2026-10-07 and measured (word count, heading counts). Nothing here changes the site yet.

## Writing rules (locked by owner, apply everywhere)
- Plain words. If a 12-year-old would pause, rewrite it.
- Contractions. "we'll", "you're", "it's".
- No em-dashes or en-dashes. Use commas or periods.
- No AI tells. Banned: leverage, seamless, delve, elevate, unlock, curate, empower, moreover, furthermore, "in today's fast-paced", "we're passionate about", "take it to the next level".
- One idea per sentence. Short sentences. Cut adverbs.
- Second person ("you"); "we" for the studio.
- Digits for numbers.

---

## Part 1: The problem in numbers

Live measurement, 2026-10-07. 53 public routes measured, about 23,000 words, 57 sitemap routes, 9 nav links.

| Route | Words | H2 | H3 | Read |
|---|---:|---:|---:|---|
| / | 1016 | 7 | 23 | Long, 30 blocks. Duplicate of /home |
| /home | 1010 | 7 | 23 | Exact duplicate of / |
| /plans | 1057 | 4 | 21 | Longest page |
| /services | 955 | 0 | 56 | 56 items, no grouping |
| /printing | 953 | 9 | 9 | 9 sections |
| /wyzmind | 861 | 3 | 7 | Separate product marketing |
| /about | 854 | 6 | 9 | Long founder story |
| /web-design | 758 | 6 | 27 | 27 sub-blocks |
| /community | 696 | 5 | 3 | Static demo data |
| /partnerships | 601 | 5 | 10 | Overlaps /contact |
| /photography | 509 | 2 | 10 | Portfolio (one of two big ones) |
| /designs | 480 | 6 | 4 | Portfolio (the other big one) |
| /events | 472 | 5 | 40 | 40 blocks |
| /merch/concepts | 470 | 1 | 11 | Archive |
| /featured-artist | 458 | 3 | 9 | Culture |
| /brands | 332 | 4 | 1 | Thin. Overlaps /about |
| /legal x5 | ~1900 | | | 5 legal pages |

What is actually wrong (nothing here says "delete"):
1. Two exact duplicates: `/` and `/home`.
2. Two families for the same 4 services: `/service-page/*` and `/booking-calendar/*`.
3. Pages that carry the same idea twice: brands within about, gallery within photography, case studies within designs, partnerships within contact, referral within loyalty.
4. Pages that are long and dense: Home 30 blocks, plans 1057 words, services 56 items, events 40 blocks, web-design 27 blocks.
5. Photography has 12 category pages.

---

## Part 2: Scorecard (5 domains x 1,000 points)

Scored from the 2026-10-07 evidence. 0 = broken or missing, 100 = clean. Current total: **3,150 / 5,000**.

### D1. Information architecture + navigation, 1,000
| # | Area | Score | Evidence + action |
|---|---|---:|---|
|1.1|Primary nav clear|80|9 links. Keep.|
|1.2|Every page reachable|50|Most routes are orphans. Group them under clear hubs.|
|1.3|Page count sane|55|57 routes. Reduce duplicates only; keep the real pages.|
|1.4|Clean URLs|60|`/service-page/x` and `/booking-calendar/x` are ugly and doubled.|
|1.5|No duplicate routes|25|`/` = `/home`. Two service families.|
|1.6|Redirect plan|0|None yet. Build one for the few real merges.|
|1.7|Plain nav labels|85|OK.|
|1.8|Footer organized|60|Group into 3 clean columns.|
|1.9|Breadcrumbs|25|Missing on deep pages.|
|1.10|Sitemap matches reality|55|Trim lab pages from public listing.|

Subtotal D1: **495 / 1,000**

### D2. Layout + formatting, 1,000
| # | Area | Score | Evidence + action |
|---|---|---:|---|
|2.1|One container width|75|Mostly consistent.|
|2.2|Consistent spacing scale|60|Lock one scale.|
|2.3|Clean heading hierarchy|65|`/services` has 56 H3s with no H2 grouping.|
|2.4|One card pattern|60|Cards differ per page.|
|2.5|Density (not busy)|40|Home 30 blocks, events 40, web-design 27. Cap at 8 to 12.|
|2.6|Above the fold says who/what/CTA|60|Some heroes are decorative only.|
|2.7|One primary CTA per page|50|Several pages have 3+ CTAs.|
|2.8|Image sizing|70|Optimizer bug just fixed (task 41).|
|2.9|Dark and light parity|80|Shipped. Spot-check.|
|2.10|Mobile composition|70|Gutters pass. Cut block count on mobile too.|

Subtotal D2: **630 / 1,000**

### D3. Content clarity + brevity, 1,000
| # | Area | Score | Evidence + action |
|---|---|---:|---|
|3.1|Page word budgets|35|Home 1016, plans 1057. Target: home 450, hubs 200, service 300.|
|3.2|Short sentences|45|Split long ones.|
|3.3|Plain language|50|Jargon in services and plans.|
|3.4|Contractions + human voice|55|Standardize.|
|3.5|No AI tells|60|Sweep corporate phrasing.|
|3.6|No em/en-dashes|70|Remove all.|
|3.7|Clear headlines|60|Some are clever but vague.|
|3.8|Jargon removed|50|Plain swaps needed.|
|3.9|One idea per block|55|Blocks often carry 2 to 3 ideas.|
|3.10|No repeated copy|40|Founder story and metrics repeat on home/about/service.|

Subtotal D3: **520 / 1,000**

### D4. Findability, sorting + flows, 1,000
| # | Area | Score | Evidence + action |
|---|---|---:|---|
|4.1|Search useful|45|Index all real pages.|
|4.2|Filtering and sorting|65|Store has sorting; portfolio needs filters.|
|4.3|Portfolios organized|55|Two big ones plus gallery plus case studies plus designs. Organize, do not merge.|
|4.4|Category count sane|45|12 photography categories. Keep the best 6 to 8 as filters.|
|4.5|Booking flow short|60|`/booking` works; kill the duplicate calendar routes.|
|4.6|Pricing easy to find|55|One source of truth for prices.|
|4.7|Contact obvious|70|Merge partnership into contact.|
|4.8|Cross-links|50|Add "next step" links, especially Design <-> Photo.|
|4.9|Mobile menu simple|75|OK.|
|4.10|Empty states|45|Add a nudge when a list is empty.|

Subtotal D4: **565 / 1,000**

### D5. Trust, accessibility + conversion, 1,000
| # | Area | Score | Evidence + action |
|---|---|---:|---|
|5.1|Proof has real sources|35|Testimonials link to broad Google searches (Codex #41). Fix or cut.|
|5.2|Metrics consistent|70|Unified to 90+/45+. Confirm.|
|5.3|Pricing clear|60|Retouching and plans just aligned. Keep one canon.|
|5.4|Accessibility|90|axe 0/10.|
|5.5|Keyboard + contrast|80|Cart drawer fixed.|
|5.6|Performance|70|Confirm after optimizer task.|
|5.7|Trust pages|75|5 policies. Group under /legal.|
|5.8|Obvious next step|45|Many pages end with no CTA.|
|5.9|Low-friction forms|60|Trim fields.|
|5.10|Payment confidence|75|Real cart now. Add a reassurance line.|

Subtotal D5: **660 / 1,000**

**Total: 3,150 / 5,000.**

---

## Part 3: The condense map (keep everything, tighten and combine)

Principle: no content is lost. Duplicates get merged. Overlapping sections get combined into one stronger page. Nothing is deleted except `/fd`.

Hard merges (true duplicates, ship a 301):
- `/home` -> `/` (same page).
- `/booking-calendar/{photoshoot,photo-retouching,event-photography,consultation}` -> `/booking` (keep the service context as a query, for example `/booking?service=photoshoot`).

Pick one service detail family and retire the other:
- Keep `/services` as the hub. Give each service one detail page. Retire `/service-page/*` by moving its content to `/services/{service}` (301), so there is one family, not two. This keeps all the content, just in one place.

Combined pages (fold an overlapping section into the stronger page; keep the old URL as a redirect only if it was indexed):
- `/brands` content becomes an "Clients and brands" section on `/about`.
- `/gallery` becomes a "Full gallery" section or filter on `/photography` (it is photography).
- `/case-studies` (+4 details) become the "Case studies" section of `/designs` (they are design and web work). Details stay at `/designs/<slug>`.
- `/partnerships` becomes a "Partnerships" option on `/contact` (`/contact?type=partnership`).
- `/referral` becomes a "Refer a friend" section on `/loyalty` (rename the page head to "Rewards"; keep `/loyalty` and add `/referral` redirect).

Kept and condensed (same URL, tighter content):
- `/` (450 words max), `/about`, `/services`, `/photography`, `/designs`, `/web-design`, `/printing`, `/events`, `/merch`, `/plans`, `/faq`, `/blog`, `/community`, `/contact`, `/gift-card`, `/wyzmind`.
- `/photography/[category]`: keep as filters, trim to the best 6 to 8 categories, noindex the thin ones.

Dropped:
- `/fd` (owner says irrelevant). Redirect to `/` or `/about`.

Utility and lab (keep working, keep out of the public sitemap):
- `/cart`, `/merch/order`, `/account/my-account`, `/search`, `/status`, `/offline`, `/clear-cache`, `/view/[page]`.
- `/splash`, `/splash-gallery`, `/splash-showcase`, `/mobile-splash`, `/secret`, `/match`, `/3pointprogram`: keep as-is but remove from the sitemap unless the owner gives a current public purpose.

Result: still every real page, a few true duplicates removed, and overlapping sections combined. Route count drops by about 8, not 30.

### The Design / Photography duality (new)

Design and Photography stay separate. They are the two big portfolios. To make them feel like one studio with two sides, add a shared gateway and a switch:

- New `/work` gateway: a split screen. Left half says "Design", right half says "Photography". Each side expands on hover or tap (reuse the merch ParallaxHero flex-expand pattern). A thin center seam reads "Two sides. One studio." Tapping a side opens `/designs` or `/photography`.
- Persistent switch: on `/designs` a small control "See the photography" and on `/photography` "See the design work". Same position on both, so it feels like one wall with two lenses.
- Keep both hubs full and massive. The gateway just frames them.

This gives the duality the owner asked for without cramming two big portfolios into one page.

---

## Part 4: Copy standards + before/after

Budgets: Home 450 words. Hub pages 200. Service pages 300. Headlines 8 words. Subheads 15 words. Paragraphs 3 sentences max.

Before (home, current):
> "Every service we offer comes from one simple place: we make things that look good and actually work. WYZ Design started in Chicago's DIY art and music scene, making flyers for friends, shooting shows in basements, and learning every part of the creative process by doing it."

After:
> "We make work that looks good and works. We started in Chicago's DIY scene making flyers and shooting shows. Now we're in LA, doing the same thing for brands and artists."

Before (AI tell):
> "We leverage a seamless, end-to-end creative process to elevate your brand and unlock its potential."

After:
> "We handle the whole job, from idea to final files. You get work that fits your brand."

Before (jargon):
> "Composite and manipulation work."

After:
> "Photo edits that combine images or add effects."

Before (dash):
> "Photo, design, print -- all in one place."

After:
> "Photo, design, and print. All in one place."

---

## Part 5: Priority actions

Phase 1 (structure):
1. Merge `/` and `/home`. Merge `/booking-calendar/*` into `/booking`. Pick one service detail family.
2. Build the `/work` duality gateway. Keep design and photography separate underneath.
3. Drop `/fd`. Trim the public sitemap.

Phase 2 (compact):
4. Home to 450 words and about 12 blocks.
5. Plans to under 600 words. Events from 40 blocks to about 12.
6. `/services` regrouped into 5 to 6 categories with H2s (not 56 loose items).
7. Photography filters down to 6 to 8.

Phase 3 (combine):
8. Fold brands into about, gallery into photography, case studies into designs, partnerships into contact, referral into loyalty (sections, plus redirects).

Phase 4 (copy sweep):
9. Apply the writing rules everywhere. Run a lint pass (banned words, dashes, sentence length, word budgets).
10. One CTA per page. One pricing source of truth. Real testimonial sources.

---

## Part 6: Owner decisions + agent opinions

Owner decisions (2026-10-07):
- Keep all content. Condense, compact, and combine a bit. Do not gut the site.
- Keep the word "Merch".
- Keep Design and Photography as separate, big portfolios. Add a duality (the `/work` split gateway plus a cross-switch).
- Drop `/fd`.
- Make full handovers for Claude and Codex, and keep them updated as we go.

Open questions:
1. `/work` gateway: build it, or put the split on the home hero instead?
2. Photography filters: which 6 to 8 categories stay?
3. Testimonials: send the real review links, or cut the quotes?
4. Service detail family: move to `/services/{service}`, or keep `/service-page/*` and retire the booking-calendar copies?
5. Lab pages: keep any public (secret, 3pointprogram, match, splash)?

Consensus log (add your view, date + name):
- WYZMiND (2026-10-07): keep every real page. Do the two true merges (home, calendar) and the one service family. Combine overlapping sections into their stronger page. Add the Design/Photography split gateway. Cap block counts and word budgets. This lifts D2 and D3 the most, which is where the busy feeling comes from.
- Claude (add here):
- Codex (add here):

---

## Part 7: Scoring history

| Date | Score | Note |
|---|---:|---|
|2026-10-07|3,020 / 5,000|Baseline, live measurement|
|2026-10-07|3,150 / 5,000|v2, re-scored for the keep-all direction|
| | | target 4,300+ after Phases 1 to 4|
