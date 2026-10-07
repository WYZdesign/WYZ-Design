# WYZ Design Route Decision Ledger

**Date:** 2026-10-07  
**Purpose:** give every public route a proposed job before any consolidation work begins.  
**Rule:** this is an audit record. It does not authorize removal, redirects, de-indexing, or copy changes.

## Decision keys

- **Keep:** retain as a public destination.
- **Merge:** fold the content into a clearer destination, then use a measured permanent redirect.
- **Secondary:** retain, but remove from prospect navigation and place under a relevant group.
- **Utility:** retain only for a direct link, state, or signed-in flow. Keep out of navigation and routine sitemap promotion.
- **Review:** owner, search, legal, or product evidence is required before a decision.

| Route | Proposed treatment | Proposed home or destination | Why it exists or why it should move |
|---|---|---|---|
| `/` | Keep | Canonical home | Primary entry point. |
| `/home` | Merge | `/` | Duplicate home experience. |
| `/about` | Keep | About | Founder, studio story, and trust. |
| `/brands` | Merge | `/about` | Brand identity and credibility overlap with About. |
| `/services` | Keep | Services hub | The main offer selector, but reduce visible service choices. |
| `/service-page/photoshoot` | Merge | `/services/photoshoot` | Keep only one service-detail route family. |
| `/service-page/photo-retouching` | Merge | `/services/photo-retouching` | Keep only one service-detail route family. |
| `/service-page/event-photography` | Merge | `/services/event-photography` | Keep only one service-detail route family. |
| `/service-page/creative-consultation` | Merge | `/services/consultation` | Keep only one service-detail route family. |
| `/booking` | Keep | Booking hub | One place to book or send an inquiry. |
| `/booking-calendar/photoshoot` | Merge | `/booking` | Duplicate scheduling surface. Preserve service context in query or prefill. |
| `/booking-calendar/consultation` | Merge | `/booking` | Duplicate scheduling surface. Preserve service context in query or prefill. |
| `/booking-calendar/event-photography` | Merge | `/booking` | Duplicate scheduling surface. Preserve service context in query or prefill. |
| `/booking-calendar/photo-retouching` | Merge | `/booking` | Duplicate scheduling surface. Preserve service context in query or prefill. |
| `/contact` | Keep | Contact and booking fallback | General inquiry path when calendar is not appropriate. |
| `/partnerships` | Merge | `/contact?type=partnership` | Partnership inquiries do not need a separate first-visit destination. |
| `/plans` | Review | Plans or Services | Keep only after subscription, pricing, and cancellation terms are confirmed. |
| `/photography` | Keep | Photography work hub | High-intent portfolio and service proof. |
| `/photography/portraits` | Keep or Secondary | Photography filter | Retain only if traffic and portfolio volume justify a dedicated landing page. |
| `/photography/events` | Keep or Secondary | Photography filter | Retain only if it complements, not duplicates, Events. |
| `/photography/editorial` | Secondary | Photography filter | Better as a filter unless search evidence is strong. |
| `/photography/commercial` | Keep or Secondary | Photography filter | Keep if it supports a distinct commercial buyer. |
| `/photography/urbex` | Secondary | Photography filter | Culture and archive content, not a core buyer path. |
| `/photography/outdoors` | Secondary | Photography filter | Better as a filter unless search evidence is strong. |
| `/photography/studio` | Keep or Secondary | Photography filter | Retain if it supports a distinct studio booking offer. |
| `/photography/products` | Keep or Secondary | Photography filter | Retain if it supports a distinct product photography offer. |
| `/photography/conceptual` | Secondary | Photography filter | Better as a filter unless search evidence is strong. |
| `/photography/concerts` | Secondary | Photography filter | May fold into Events or a music proof filter. |
| `/photography/street` | Secondary | Photography filter | Better as a filter unless search evidence is strong. |
| `/events` | Keep | Events proof page | Keep only the most persuasive event work and one booking path. |
| `/designs` | Keep or Merge | Work hub or Design work filter | Strong proof surface. Do not merge until search and inquiry evidence is reviewed. |
| `/web-design` | Keep or Merge | Services or Web design service detail | Keep only if it has its own clear offer and proof. |
| `/printing` | Keep or Merge | Services or Print service detail | Keep only if it has its own clear offer and proof. |
| `/case-studies` | Merge | `/work` | A work hub can introduce and filter all proof formats. |
| `/case-studies/artfinix` | Keep or Merge | `/work/artfinix` | Preserve a complete, credible study under one work route family. |
| `/case-studies/kid-bode` | Keep or Merge | `/work/kid-bode` | Preserve a complete, credible study under one work route family. |
| `/case-studies/dawneeahs-glow` | Keep or Merge | `/work/dawneeahs-glow` | Preserve a complete, credible study under one work route family. |
| `/case-studies/gft-foods` | Keep or Merge | `/work/gft-foods` | Preserve a complete, credible study under one work route family. |
| `/gallery` | Merge | `/work` | Broad archive overlaps with Photography, Designs, and case studies. |
| `/merch` | Keep, consider rename | Shop | A real purchase path. Keep separate from booking. |
| `/merch/concepts` | Secondary or Merge | Shop collection | Collection, not a top-level public sales page. |
| `/merch/[id]` | Keep | Shop product detail | Required purchase detail route. |
| `/merch/order` | Utility | Order confirmation | Customer-only state. Keep out of navigation and search. |
| `/cart` | Utility | Cart | Customer-only commerce state. Keep out of navigation and search. |
| `/gift-card` | Secondary | Shop or Gift | Valid product, but not a prospect-navigation priority. |
| `/featured-artist` | Secondary or Merge | Culture or Community | Brand culture proof, not core service selection. |
| `/model-archive` | Secondary or Merge | Culture or Community | Archive, not core service selection. |
| `/community` | Secondary | Culture or Community | Clearly label any preview and keep the real Discord path prominent. |
| `/3pointprogram` | Review | Culture or Community | Owner must confirm its current public purpose. |
| `/partnerships` | Merge | Contact | See Contact row. |
| `/nomadic-breed` | Secondary | Shop collection or Projects | Brand project. Needs context before public navigation. |
| `/dying-breed-crew` | Secondary | Shop collection or Projects | Brand project. Needs context before public navigation. |
| `/match` | Review | Projects or private utility | Current buyer and maintenance purpose must be confirmed. |
| `/fd` | Review | Projects or private utility | Current buyer and maintenance purpose must be confirmed. |
| `/wyzmind` | Secondary | WYZMiND product | Keep only with accurate privacy and product positioning. |
| `/blog` | Secondary | Journal | Keep only with a sustainable publishing and quality plan. |
| `/blog/[slug]` | Keep or Review | Journal article | Retain posts with a current purpose, source, and internal next step. |
| `/faq` | Keep | Help | Help route. Surface only the strongest answers near the relevant CTA. |
| `/loyalty` | Merge | Rewards | Existing-customer utility. |
| `/referral` | Merge | Rewards | Existing-customer utility. |
| `/account/my-account` | Utility | Account | Signed-in customer state. |
| `/search` | Utility | Search | Keep functional, improve its route inventory after consolidation. |
| `/splash` | Utility or Review | Campaign entry | Do not promote until its campaign purpose is confirmed. |
| `/splash-gallery` | Utility or Review | Campaign entry | Do not promote until its campaign purpose is confirmed. |
| `/splash-showcase` | Utility or Review | Campaign entry | Do not promote until its campaign purpose is confirmed. |
| `/mobile-splash` | Utility or Review | Campaign entry | Do not promote until its campaign purpose is confirmed. |
| `/offline` | Utility | Offline fallback | Necessary fallback, not a destination. |
| `/status` | Utility | Status | Support and incident state, not a destination. |
| `/clear-cache` | Utility | Support action | Do not expose in navigation or normal search. |
| `/view/[page]` | Review | Internal or campaign view | Confirm ownership before sitemap inclusion. |
| `/secret` | Review | Private or campaign route | Remove from sitemap and navigation unless a current public purpose exists. |
| `/privacy-policy` | Keep, Secondary | Legal | Required support content. |
| `/terms-and-conditions` | Keep, Secondary | Legal | Required support content. |
| `/refund-return-policy` | Keep, Secondary | Legal | Required support content. |
| `/shipping-policy` | Keep, Secondary | Legal | Required support content. |
| `/copyright-notice` | Keep, Secondary | Legal | Required support content. |

## Required checks before a route changes

1. Record traffic, search impressions, conversions, backlinks, and current owner purpose.
2. Decide the canonical destination and match its search intent.
3. Add a permanent redirect only after the replacement is live and tested.
4. Update sitemap, metadata, navigation, internal links, analytics, and support material in the same release.
5. Check mobile and desktop, keyboard flow, loading, errors, empty states, and payment or booking paths where relevant.
6. Measure the result for at least 30 days before the next large consolidation round.
