# _CONFER Brief: Codex

**Lane:** routing, redirects, copy, audit structure, search-risk review, and measurement.

## Evidence reviewed

- `WYZDESIGN_CONSOLIDATION_AUDIT.md`, including the current 2,354/5,000 baseline.
- `WYZDESIGN_CONSOLIDATION_5000_TOPIC_MATRIX.md`, the 50-topic, 500-subcategory review index.
- `WYZDESIGN_ROUTE_DECISION_LEDGER.md`, static sitemap inventory, Navbar, Footer, and current route families.
- WYZMiND's consensus brief in `_CONFER/WYZMIND.md`.
- Claude's visual and consolidation handovers in `_HANDOVER_CLAUDE.md` and `HANDOFF.md`.

## Codex verdict

I agree with the owner direction and WYZMiND's implementation sequence.

1. **Duality entry: A.** Build `/work` as a simple Design and Photography gateway. Keep both portfolios as full, separate destinations. The gateway should create orientation, not replace either portfolio.
2. **Photography filters: target 6, owner chooses the final names.** The density goal is sound, but Claude correctly noted that the proposed names do not match the eight current categories. Do not rename or suppress Boudoir, Bodypaint, Outdoors, Urbex, or Conceptual from an audit guess. Use owner intent, real inventory, and search evidence to choose the six primary filters and retain the rest under More where appropriate.
3. **Service detail family: A.** Use `/services/{service}` and redirect the old detail and calendar families only once equivalent pages and booking context are live.
4. **Testimonials: A, otherwise B.** Add direct review links or permission records. If that proof cannot be supplied, remove the quotes instead of linking visitors to broad Google searches.
5. **Lab pages: hide from the prospect sitemap.** Keep support and real campaign content available through clear parents. `/fd` follows Torreé's explicit decision to drop it.
6. **Legal: A.** Nest legal content under `/legal` while preserving permanent redirects from current URLs.
7. **Combine list: agree.** Brands into About, Gallery into Photography, Case Studies into Design, Partnerships into Contact, and Referral into Loyalty. Preserve useful page content and inbound paths.

## Sequencing recommendation

1. Ship shared visual primitives first: one Section wrapper, one Hero pattern, and one Card pattern. Claude identified this as the layout root cause of the busy feeling.
2. Condense home, services, plans, events, web-design, and printing copy before changing their URLs.
3. Build the Work duality and persistent cross-switch. Test its mobile tap behavior before adding motion.
4. Make only the approved true merges, with permanent redirects, sitemap changes, metadata, internal-link updates, and 30-day measurement.

## Risks and owner decisions

- Use analytics and Search Console before reducing the visibility of search-intent pages.
- Preserve the word **Merch**. Do not rename it to Shop.
- Keep Design and Photography separate after `/work` is added.
- Do not move public prices, legal terms, testimonials, metrics, or WYZMiND privacy claims without current evidence and Torreé's approval.

## Vote summary

| # | Vote | Reason |
|---:|---|---|
| 1 | A | `/work` provides a shared entrance without erasing portfolio intent. |
| 2 | 6 target, owner chooses | Six primary filters reduce density, but current category names and real portfolio value must decide the final set. |
| 3 | A | One service family is easier to maintain and explain. |
| 4 | A, else B | Trust needs direct proof, not a broad search link. |
| 5 | Hide, with `/fd` dropped | Utility and campaign routes should not compete with booking. |
| 6 | A | One Legal hub reduces footer and route clutter. |
| 7 | Agree | The five combinations reduce duplication while preserving content. |

## Independent route and interface findings

1. **Root entry adds a session splash.** `src/app/page.tsx` renders `RandomSplash` and locks scroll until the visitor presses Enter. `/home` renders the same home content without that step. This is not a literal duplicate route. It is a first-visit friction decision. Test a Skip or direct-to-work path before replacing or redirecting either route.
2. **Home Quick Links are a confirmed density problem.** The `QUICK_LINKS` array in `src/app/home/page.tsx` contains 12 links, repeats Model Archive twice, points to the old `/service-page/creative-consultation` family, and mixes prospect, member, culture, merch, and program paths. It should become a short, audience-grouped secondary area or leave Home after its useful content is represented elsewhere. The similarly named `src/components/QuickLinks.tsx` is currently unused.
3. **Partnerships is not fully orphaned.** It is linked from Home and Quick Links. Its merge into Contact is still sensible, but the redirect plan must preserve those internal links at the same release.
4. **Case Studies is searchable and indexed.** It appears in SEO data and the search API even where direct visible links are weak. Any move under Design needs metadata, search-index, sitemap, and internal-link updates, not a simple redirect alone.
5. **Service-family cleanup has a concrete stale-link target.** Quick Links proves old `/service-page/*` links are already embedded in shared UI. The service-route migration must include a repo-wide internal-link inventory before old URLs redirect.
6. **Do not assume the splash is decorative.** It is a brand moment by design. Measure its Enter rate, abandonment, and time to booking before shortening it or adding a skip control.
7. **Production search is a separate consolidation surface.** `src/app/api/search/route.ts` uses a hard-coded page list on Vercel. It still sends Booking queries to `/booking-calendar/photoshoot` and promotes Match and 3-Point Program. Update this index in the same release as every approved route change so search does not resurrect old navigation.
8. **Home currently repeats the offer decision multiple times.** It contains a Services versus Pricing Plans tab, service category cards, Popular Services flip cards, a digital-printing banner, client logos, testimonials, a full FAQ, value cards, Quick Links, a design carousel, and a lead magnet. Consolidation should preserve the strongest proof, but not make a first-time visitor evaluate every system in one visit.
9. **Navigation data has to migrate as one system.** `Navbar.tsx` has direct links, More links, and a separate `ALL_PAGES` search catalogue. Footer has its own sitemap data. The production API search has a third hard-coded catalogue. A route decision is incomplete until all three sources, plus sitemap and internal page links, agree.

## Add, change, edit, and remove recommendations

### Add

- A shared route registry used by navigation, footer, search, sitemap, and Quick Links. It prevents a completed redirect from remaining discoverable through an old link.
- A redirect acceptance checklist: destination loaded, 301 verified, metadata updated, search updated, internal links updated, analytics event preserved, and mobile path tested.
- A short “Which service fits?” chooser inside Services, not a separate Match page. It should return 3 relevant routes and a Book action.
- A concise proof module with verified client result, direct testimonial source, and relevant work. Reuse it near booking decisions.
- A consented measurement plan for splash entry, Work gateway selection, Services category selection, booking start, booking completion, and contact completion.

### Change

- Make Home a short story: promise, proof, 2 portfolio paths, 4 to 6 service groups, one booking action, then optional support content.
- Convert flip-card essentials into visible card details. Price, scope, and action should never require hover or a second tap to discover.
- Move the full FAQ, broad Quick Links, and long plan comparison out of Home. Use previews with one clear link instead.
- Make footer groups audience-based: Hire WYZ, Explore Work, Existing Clients, and Legal. Do not give every page equal weight.
- Keep Work as a gateway only. Photography and Designs remain the SEO and portfolio destinations after it.

### Edit

- Replace old internal booking and service-detail links wherever they occur before redirects ship.
- Remove duplicate Model Archive links and correct mixed labels in Home Quick Links.
- Sweep public text for long sentences, vague headings, banned jargon, and em dashes after hierarchy is settled. Copy edits should follow the final section list, not precede it.
- Add direct source or permission records for every testimonial and public metric.

### Remove from prospect-facing surfaces

- Repeated offer menus, duplicate home content, old route links, and utility routes from search and sitemap.
- Extra animations, marquees, carousels, and flip interactions that do not reveal proof or help a visitor choose.
- `/fd` as directed by Torreé. Preserve any desired content in its approved parent before the route is removed.

## In-flight Work gateway review

`src/app/work/page.tsx` and `src/components/WorkCrossSwitch.tsx` implement the agreed duality cleanly in source: the gateway keeps Design and Photography separate, uses a two-panel desktop view, becomes two full-width tap targets on mobile, and gives each portfolio a quiet cross-switch. `src/app/work/layout.tsx` supplies route metadata and a canonical URL.

Before integration, add these release checks:

1. Add `/work` to the sitemap and the production search index. It is not present in either source inventory yet.
2. Verify the 320px seam label does not cover either panel's only actionable text and both panels remain easy to tap.
3. Verify reduced-motion behavior and keyboard focus for the expanding desktop panels.
4. Verify both chosen image assets load on production after the SafeImage image-optimizer rollback.
5. Record one analytics event per gateway selection so WYZ can learn whether visitors prefer Design or Photography.

**Source-review result:** the in-flight cross-switch import and placement in both portfolio pages are small, consistent, and appropriate. No code-level blocker found. The release checks above are integration and evidence requirements, not a request to redesign the component.

## Customer-promise conflict found during consolidation review

Do not shorten or move this copy until the commercial canon resolves it:

- `src/app/home/page.tsx` FAQ says a $100 per hour photoshoot includes a **24-hour turnaround**.
- `src/app/photography/layout.tsx` repeats a **24-hour turnaround** in search and social metadata.
- `src/app/service-page/photoshoot/page.tsx` says standard high-resolution delivery is **within 5 business days** and describes **24-hour delivery as a rush add-on**.

This is a trust and conversion issue, not only a copy issue. The final approved delivery promise must update Home, Photography metadata, service detail, search data, booking language, and any confirmation email in one release. No customer-facing claim was changed during this audit.

## Cross-audit reconciliation, current remaining work

I reconciled the master audit, production-readiness audit, 1,000-point, 2,000-point, boardroom, client-experience, visual, Claude, and WYZMiND records against the current task board. Do not reopen resolved work merely because it appears in a September document.

### Closed after older audits

- Real merch cart, Stripe checkout, Printful fulfillment, and order confirmation.
- Secure, atomic gift-card issuance and redemption with versioned schema support.
- Cal.com Discovery Call publication.
- Narrow mobile gutters, FAQ overlap, chat clearance, event-card keyboard access, cart-drawer keyboard access, hero-reveal delay, and major mobile GPU drain.
- Revenue-route loading and error states.

### Confirmed open or owner-dependent

1. **Pricing and billing canon.** Board tasks 1, 2, and 23 are still the highest trust risk. The photoshoot delivery conflict found in this pass is a new concrete example.
2. **Truthful WYZMiND positioning.** Board task 31 remains open. Public privacy and capability claims must match OpenRouter and the actual commerce architecture.
3. **Analytics and attribution.** Board task 4 needs owner-authorized dashboard evidence. Consolidation should not remove search-intent pages without it.
4. **Testimonial provenance.** Direct review source or client permission is still needed for every public quote.
5. **Community truth and operations.** Aggregate invented statistics were removed, but recurring-program, event, and engagement claims need current evidence or dates. The preview needs a deliberate product decision.
6. **Public proof records.** The 90-plus events, 45-plus clients, 1,500-plus photos, and 9-plus years set is internally aligned but still needs owner source records.
7. **Image optimization root cause.** Raw local images render again, but task 45 remains open before the Next image optimization path is restored.
8. **Safe production visual-audit path.** Task 21 needs an owner-approved paced QA or preview policy that respects edge protection.
9. **Delivery, testimonial, referral, and win-back automation.** The specification exists, but task 22 waits for owner approval before sending anything.
10. **External business proof.** Older boardroom evidence still lacks current financial, margin, CAC, Search Console, Google Business Profile, and newsletter-attribution proof. These are evidence gaps, not claims that the business lacks revenue.
11. **Security and dependency follow-up.** Older production findings on PAT rotation, dependency updates, raw-IP handling, and remaining CSRF coverage need a current source and deployment recheck before being called open or closed.
12. **Consolidation execution.** The duality gateway needs integration and release evidence; routes, copy, redirects, sitemap, search, metadata, and internal links must migrate together.

### Audit findings that are historical, not current blockers

The older client-experience P0 findings for merch checkout, gift-card redemption, schema migrations, gift-card races, plaintext gift-card codes, and unpublished Cal.com were closed by tasks 28, 33, 38, and 42 through 44. The older mobile overlap and gutter findings were also closed by tasks 9 through 20, 29, 34, and 35. Recheck them only after a related future change.

## Fresh trust-surface findings

1. **WYZMiND claim conflicts with site privacy wording.** `src/app/wyzmind/page.tsx` says the assistant runs privately and sends no data to third parties. `src/app/privacy-policy/page.tsx` correctly says data may be shared with payment processors, email providers, and analytics tools. The assistant also uses OpenRouter according to the current operations record. Task 31 needs a scoped, truthful disclosure before this page is promoted.
2. **All five public legal pages still say “Last updated: January 2025.”** This includes Privacy, Terms, Refund, Shipping, and Copyright. The gift-card, merch, and data-processing changes since then need a dated legal and operational review before simply changing the date.
3. **Testimonials still fail provenance and copy rules.** They link to broad Google searches, not original reviews. The visible source line uses an em dash, and the share controls share that broad search link rather than WYZ content or a verified original source. Keep quotes untouched until permission or an original link is supplied, then rebuild this component around verified attribution.
4. **Community claims remain more specific than its demo status.** The page still states a Monday challenge, Instagram exposure to “2K+ followers,” Thursday 7PM CT reviews, recurring Chicago and LA meetups, and a Chicago June 2026 recap. Each claim needs an owner-confirmed source, a date, or removal. The existing local-demo notice does not make recurring factual claims safe by itself.
5. **Regression coverage is still narrow.** Current source contains three actual test files: `global-error.test.tsx`, `api.test.ts`, and `utils.test.ts`. The project has Playwright installed, but no repository Playwright specs. The existing live axe and E2E harness evidence is valuable, but consolidation needs durable automated checks for redirects, canonical URLs, search inventory, booking, cart, gift-card redemption, and the Work gateway.
