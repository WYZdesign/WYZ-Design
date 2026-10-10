# WYZ Design QA Rate-Limit Policy

## Purpose

Keep automated quality checks useful without making the production rate limiter mistake a careful audit for abusive traffic.

## Preferred target order

1. Preview deployment for all broad route, visual, interaction, accessibility, and checkout-shell checks.
2. Production for one paced smoke pass after deployment.
3. Local development only for work in progress, with one dev server at a time.

## Production smoke-pass rules

- Use one browser session and one viewport at a time.
- Wait at least 3 seconds between route navigations and at least 8 seconds after a 429 response.
- Do not crawl links, prefetch routes, or run parallel workers against production.
- Stop the sweep immediately after a 429. Record the remaining routes as unverified, not failed.
- Test only public, non-destructive paths. Do not submit forms, create orders, or invoke payment flows in production during a visual audit.

## Required route samples

- Desktop: home, one portfolio, services, merch, booking, FAQ, contact, one legal route.
- Mobile: the same revenue path plus menu, filters, product detail, cart shell, and modal close paths.
- Narrow mobile: home, Services, Merch, FAQ, and booking.

## Evidence to record

- Deployed commit and target URL.
- Viewport, route, timestamp, and status.
- Screenshot only where it demonstrates a real result or defect.
- Overflow result, visible error state, keyboard/modal result, and any failed asset after it has had time to load.
- A 429 response must be labeled rate-limited, never as a page failure.

## Local-server guardrail

- Before starting `next dev`, confirm no existing dev server is already writing `.next`.
- Use a single agreed port for the active audit.
- Stop it when finished. Concurrent dev servers can corrupt generated `.next/dev` validator files.
