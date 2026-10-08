# Visual Audit — 2026-10-08

**Scope:** Rendered local production-equivalent review, source review, and paced production-access checks.  
**Priority route:** `/merch` at 1440px and 390px.  
**Owner:** Torreé Marcel.  
**Integration:** WYZMiND.  
**Visual review:** Claude Code.  
**Audit and evidence:** Codex.

## Evidence boundary

The in-app browser connection is unavailable because its local browser-service module is missing. A real local browser render was used instead, with a normal desktop browser profile, then visually inspected at 1440px and 390px. Production direct capture is stopped by WYZ edge security for this audit browser. That is a valid security result, but it is not visual evidence that a normal visitor is blocked.

Visual evidence is retained in `screenshots/current/`:

- `merch-desktop-2026-10-08.png`
- `merch-mobile-2026-10-08.png`
- `merch-mobile-y0/y900/y2100/y3900/y5800-2026-10-08.png`
- `merch-desktop-store-open-2026-10-08.png`
- `merch-mobile-store-open-2026-10-08.png`

The local Printful catalog returned an empty collection because this local audit environment does not have live Printful catalog credentials. The expanded-store capture therefore verifies layout, state change, and controls, but not live inventory cards. Live catalog behavior needs a paced authenticated production verification by WYZMiND.

## Merch verdict

### Confirmed strengths

- Desktop hero has a clear focal point, legible title, and one obvious Shop Now action.
- Mobile hero stays inside its viewport with no text clipping in the observed 390px capture.
- The three trust cards stack cleanly at 390px and use readable type.
- The featured artist module reads well at mobile size with clear primary and secondary actions.
- Product imagery maintains consistent card edges and comfortable mobile gutters once images enter the viewport.
- Navigation remains visible at all observed scroll positions.

### Confirmed problems

1. **The purchase path is buried.** The actual expandable store is below the hero, value cards, decorative archive rail, featured artist module, and collection framing. A visitor looking to buy must traverse a long editorial page before seeing shopping controls.
2. **Merch repeats itself too many times.** Archive rail, artist module, collection switch, model-mockup carousel, store grid, product-story grid, and a second archive rail all compete for the same attention. This confirms the owner’s broader concern that the site feels busy.
3. **The product-story grid is visually indistinguishable from a shop grid but is not the real store.** Its cards expand text rather than going to a product page or cart. At mobile size it becomes a long single-column catalog with no visible price or purchase action, which is confusing after a visitor has already asked to shop.
4. **The primary Store disclosure is a second interaction.** “Enter Store” creates a portal animation and only then exposes the real controls. The effect is on-brand but adds friction between intent and checkout.
5. **Mobile page length is excessive.** The 390px rendered page was approximately 10,000px before the expanded live catalog was included. This makes the strongest commercial content hard to find and weakens return-to-cart behavior.
6. **Owner terminology is inconsistent.** The navigation uses “Store” while the owner direction is to keep “Merch.” Pick one customer-facing label. “Merch” is the approved term.
7. **The fixed local issue bubble obscures lower-left content in audit captures.** It appears to be the development issue overlay, not customer-facing production UI. Verify that it cannot appear in a production build.

### Do not classify as a live defect yet

- Full-page captures initially showed gray lower image cards. Section-by-section scrolling confirmed that the images load after entering the viewport. This is a capture/lazy-load limitation, not sufficient proof of a public image failure.
- Empty catalog in the local preview is expected without the production Printful setup. Do not change storefront fallback copy from this evidence alone.

## Required Merch repair order

1. Put an always-visible **Shop Merch** action in the hero and expose the actual category or product grid immediately below the hero.
2. Keep one concise proof strip: printed to order, real crew, returns/support. Remove duplicate generic explanation sections.
3. Choose one editorial support module: Featured Artist *or* one small Crew Story module. Do not put both before shopping.
4. Turn product-story cards into links to real product pages, or move the stories below the store as optional editorial content. Every commerce-like card needs a price and a purchase path.
5. Remove the portal gate. If an animation remains, it should decorate store arrival without hiding the shop.
6. Keep one archive rail at most, and pause its animation for reduced motion and keyboard focus.
7. Rename public “Store” labels to “Merch” in the same navigation release, preserving URLs and search aliases as needed.
8. Before deployment, verify real Printful inventory, filter counts, sort order, quick-view focus return, product-page cart action, checkout, and confirmation.

## Repair applied locally after review

- Replaced the buried expandable store with a direct shop section immediately beneath the hero.
- Kept the actual filters and sort controls visible before the product grid.
- Changed the primary grid to square, padded `object-contain` frames so product assets keep their intended proportions rather than being cropped into narrow or short cards.
- Removed hover-only product text overlays from the primary grid. Category, product name, and price now have a stable place below the image.
- Removed the duplicate product-story grid, repeated archive rails, portal gate, redundant marquees, and extra pre-shop editorial modules from the rendered storefront.
- Retained one short proof-card section and one featured-artist module after the real shop.
- Re-rendered desktop and mobile locally after the repair. The direct hierarchy is visibly cleaner; live inventory remains unverified because the local Printful catalog is intentionally empty without its production credentials.

## Cross-site audit continuation

- Use the local visual harness route by route at 1440px, 1024px, 390px, and 320px.
- For every route, inspect top fold, one mid-page section, footer, sticky navigation, dialogs, menus, forms, empty states, dark mode where supported, and horizontal overflow.
- For production, use a paced browser profile that is deliberately allow-listed for QA. Do not weaken the edge security rule or run high-parallel capture traffic.
- Treat source review as a lead, not visual proof. Capture the post-integration deployment for each repair before closing its task.
