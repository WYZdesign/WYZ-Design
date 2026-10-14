# UI interaction handoff, 2026-10-13

## Ready for WYZMiND review and deployment

- Home carousels now gently enlarge each image on desktop hover.
- Hero dots use a unique, deterministic random field for every hero instance. Each dot has its own path, duration, phase, size, and placement, so pages do not reuse the same dot composition. Motion remains smooth and reduced-motion safe.
- Splash pointer handling ignores touch-originated mouse events. On supported phones, device orientation drives the same interaction field as a desktop pointer and is eased to remove sensor jitter. Ripple no longer creates effects from taps.
- Photography hero dots are confined to the copy and CTA side on desktop. Its intro copy is constrained to the headline measure.
- Designs carousels share a taller, consistent image stage and preserve full image dimensions. The Danny Davis feature now has a concise introduction and two clear actions.
- Services category controls are centered. Desktop service-card titles are 50% larger. Subscription plan cards use content-based heights, preventing the larger plans from clipping their added features.
- Events video hero fades in only once its chosen video can play from five seconds. The YouTube background has a permanent black overlay and hover-only spotlight, with no item glow or scale effect. The About crown hero follows the same treatment.
- Earn Zeal is pinned to a single line. WYZMiND filter controls are centered. Footer social buttons have additional lower breathing room, and mobile footer links become compact horizontal groups.
- Desktop navigation has wider link spacing. Services moved into Shop, Printing joins Shop, and the More menu content is centered. Mobile navigation now enters from the right, matching the right-side menu trigger. The desktop search field clips during width animation to prevent a visual spill. Account menu labels are now `Rewards Dashboard` and `Referrals & Earnings`, with centered actions.

## Validation

- `npx tsc --noEmit --incremental false` passed.
- `npm run lint` passed with no errors.
- `npm run test:run` passed: 52 tests across 9 files.

## WYZMiND visual pass, 2026-10-14

Headless Playwright screenshots at 1440x900 and 390x844 against the local dev build, plus a full gate re-run against the working tree:

- `npx tsc --noEmit` passed. `npm run lint` passed with no errors. `npm run test:run` passed: 69 tests across 9 files. `npm run build` passed.
- Home hero: no dot field, by design. Mobile 390px hero stacks the headline, subtext, and both actions without overflow; stats grid renders 2x2.
- Designs: hero dots sit on the copy side. The Danny Davis feature renders with the portrait, the concise intro, and both actions (`MEET DANNY ->`, `VIEW FEATURE`).
- Services: category controls centered, card titles render at the larger size, subscription plan cards use content heights.
- Events: hero copy centered, video row with titles renders, YouTube spotlight section renders with its black overlay, subscribe actions, and stats.
- Desktop nav: link spacing wider, `MORE` hover opens a centered dropdown with STUDIO / SHOP / TOOLS. SHOP contains Services and Printing, verified in `Navbar.tsx` (`MORE_GROUPS`) and in the rendered dropdown.
- Mobile nav (390px): panel enters from the right with close control, account card, search, and grouped link sections. Footer renders grouped sections, contact lines, and social buttons.
- Console noise is limited to pre-existing items: the CSP report-only `upgrade-insecure-requests` warning and `_next/image` 400s for filenames containing spaces or apostrophes (both reproduce on production).

## Remaining owner check

- Motion permission on a physical iPhone, then tilt-test the splash variants. iOS requires an explicit user gesture before Safari grants `DeviceOrientationEvent` access, so this cannot be verified headlessly. The splash pages stay ambient until permission is granted, which is the intended fallback.

## Motion platform note

iOS requires an explicit user gesture before Safari will grant access to `DeviceOrientationEvent`. That is an operating-system privacy rule and cannot be bypassed by site code. Android and browsers that expose orientation without that prompt begin tilt interaction automatically. The splash pages never require a tap, swipe, or drag for their visual interaction; on an iPhone that has not granted motion access, the visual remains ambient until Safari permission has been granted.

## Required final QA before push

1. Review at 1440px and iPhone 13 width, especially the taller Designs carousel tiles and Services card heights.
2. Verify the motion-permission state on a physical iPhone, then tilt-test several splash variants.
3. Confirm the revised desktop navigation still fits at the intended 1440px breakpoint.
4. Do not overwrite parallel work. WYZMiND should commit and push this integrated batch after its visual pass.
