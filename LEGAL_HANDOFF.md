# Legal Package Handoff: WYZ Design LLC

Prepared: October 9, 2026. Purpose: attorney review and sign-off. This is a draft prepared by an
AI assistant, not legal advice. Nothing here was filed with any agency.

## What shipped (live on wyzdesign.com, linked from every page footer)

| Page | URL | What it covers |
|---|---|---|
| Terms & Conditions | `/legal/terms` | Acceptance, services, pricing and monthly auto-renewal, payments and deposits, client duties, revisions, scheduling/cancellation, IP license and portfolio rights, model/property releases, acceptable use, AI features, third parties, disclaimers, liability cap, indemnity, force majeure, dispute resolution, termination, general provisions, CA Civil Code 1789.3 notice, accessibility |
| Privacy Policy | `/legal/privacy` | CCPA/CPRA notice (categories, purposes, sale/share, opt-out, non-discrimination), state-law rights, GDPR rights and lawful bases, cookie categories and consent, full vendor list, AI chat disclosure, retention schedule, security, GPC signal, children, how to make a request |
| Return & Refund Policy | `/legal/refund` | Deposits and 48-hour cancellation, subscriptions and the 14-day first-month refund, digital services, event reshoot remedy, merchandise returns, gift cards, refund process, CA consumer rights |
| Shipping Policy | `/legal/shipping` | Processing, methods, estimates, tracking, address accuracy, international duties, lost/damaged packages |
| Copyright Notice | `/legal/copyright` | Ownership, portfolio display, permitted use (incl. no ML training), trademarks, third-party materials, model/property releases, DMCA notice and counter-notification, 512(f) warning, repeat infringers |

Old URLs (`/privacy-policy`, `/terms-and-conditions`, `/refund-return-policy`,
`/shipping-policy`, `/copyright-notice`) 301-redirect to these pages. All five are in the sitemap.

## Business facts used (confirm before signing)

- Entity: WYZ Design LLC (matches site footer and JSON-LD)
- Address on pages: 1200 S. Wall St., Los Angeles, CA 90015 (this address is already public on
  the site; flag if it should be a different registered address)
- Contact: info@wyzdesign.com, (213) 399-9610
- Governing law and venue: California, Los Angeles County
- Pricing canon: the Services page (`/services#plans`) is the authoritative pricing source, per
  owner decision 2026-10-09. All site surfaces now say monthly billing, cancel anytime.
- Gift cards: written as non-expiring, fee-free, per California law. The prior public text said
  "valid 24 months" and was corrected in this pass.
- Payment processing: Stripe. Merch fulfillment: Printful. Scheduling: Cal.com. Hosting: Vercel.
  Database/auth: Supabase. Email: Resend. Error monitoring: Sentry. AI chat: OpenRouter.
  Analytics (consent-gated): Google Analytics via GTM, Microsoft Clarity, Vercel Analytics.
  Advertising pixels (consent-gated only): Meta, TikTok.
- Cookie consent: banner with Necessary / Analytics / Marketing categories, stored locally;
  footer now has a "Cookie Preferences" control to reopen it (this control was missing before
  even though the banner promised it).
- EIN: kept deliberately off all public pages (identity-theft risk). It is in internal bookkeeping
  code only.

## Decisions for the attorney (not invented by the assistant)

1. DMCA designated agent: notices currently route to info@wyzdesign.com. Safe harbor under 17
   U.S.C. 512 requires registering an agent with the U.S. Copyright Office. Provide the agent name
   and address and that registration can be filed.
2. Dispute resolution: current draft is good-faith negotiation for 30 days, then Los Angeles
   County courts, with jury-trial waiver, class-action waiver, and a one-year claim window. If you
   prefer binding arbitration, different venue, or no shortened limitation period, revise.
3. Auto-renewal disclosures: built into the Terms in California Automatic Renewal Law style
   (clear monthly terms, easy cancellation, cancellation before renewal date). Confirm acceptable
   and whether a quarterly plan will ever exist (site is monthly-only now).
4. Cancellation and refund terms: 50% deposit, 48-hour cancellation window, reshoot remedy,
   14-day first-month subscription refund. Confirm these match actual operations.
5. Privacy: confirm DPAs or service-provider terms are in place with each vendor listed, and
   whether Meta/TikTok pixels are actually enabled in production (they are code-gated behind
   marketing consent; if never enabled, the marketing disclosures can stay as forward-looking
   coverage).
6. Model and property releases: the Terms require clients to obtain them, but no standalone
   California release forms are in this package. Want templates drafted?
7. Trademark: "WYZ Design" and the crown logo do not appear to be federally registered. Advise on
   USPTO filing (and whether "Wild Yet Zealous" should be included).
8. Referral/affiliate program pays 10% quarterly. Advise whether a separate affiliate agreement
   with its own terms is needed beyond the loyalty page copy.
9. Accessibility: voluntary statement included in Terms. Advise on ADA web-accessibility posture.
10. Loyalty/rewards program (Zeal points): confirm whether a separate program terms page is
    required in California for a points program with no cash value.

## What was intentionally not done

- No EIN, no bank details, and no internal addresses published.
- No cookie banner redesign, no changes to tracking beyond what already existed.
- No filings, no agency registrations, no trademark applications.
