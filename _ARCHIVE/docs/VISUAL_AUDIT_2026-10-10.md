# Route-Wide Visual Audit — 2026-10-10

## Coverage

- Desktop: 1440 × 900
- iPhone 13: 390 × 844
- Narrow mobile: 320 × 568
- Routes: root, portfolio, service, conversion, legal, and secondary public route families listed in `src/app/sitemap.ts`.

## Measured results

### 390px

29 of 29 checked routes returned HTTP 200. No page exceeded viewport width and no page exposed an application-error state. This includes `/`, `/photography`, `/events`, `/designs`, `/services`, `/printing`, `/about`, `/contact`, `/faq`, `/merch`, `/booking`, service details, and legal pages.

### 320px

29 of 29 checked routes returned HTTP 200. No horizontal overflow was measured. Every rendered content root stayed within the 320px viewport.

### 1440px

The first 21 routes returned HTTP 200 without horizontal overflow or an application-error state. The next requests received HTTP 429 from the site’s rate limiter. This is expected security behavior during a synthetic audit, not evidence of a visitor-facing page failure. The later desktop routes must be rechecked through a paced QA allow-list or preview deployment.

## Visual evidence

- Live Merch at 1440px: consistent hero composition, readable primary action, clean collection controls, and good product-frame proportions.
- Live Merch at 390px: hero, Shop section, filter wrapping, sort control, and the two-column product grid stayed legible and inside the viewport.
- Live Services at 390px: hero and category treatment are legible with no overflow. Source review found a major content-duplication issue below the fold and it was repaired locally.

## Fixed in this pass

1. Removed full Plans and Web Design page renders from the bottom of Services.
2. Focused Services on Photography by default, with other categories still available through the category controls.
3. Reduced oversized mobile service-card titles and excessive card height.
4. Scoped the service-card image request hint to its actual grid width instead of `100vw`, reducing needless desktop image transfer.

## Must verify after deployment

1. Services at 390px and 320px, top, first card, category switch, final card, wizard, and footer.
2. Real Merch Printful inventory at 390px and 1440px, including image lazy-loading after entering the viewport, filters, sort, quick view, product page, cart, and checkout handoff.
3. The remaining desktop legal and service-detail routes, paced enough to avoid a 429 response.
4. Full keyboard path for cookie preferences, mobile navigation, modal close, product quick view, and booking forms.

## Source validation

- `npx tsc -p tsconfig.audit.json --noEmit` passed after the Services repair. The alternate config excludes a malformed generated `.next/dev/types/validator.ts`; it does not exclude application source files.
