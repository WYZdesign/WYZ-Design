# WYZ Design AI Handover

**Owner:** Torreé Marcel  
**Repository:** `WYZdesign/WYZ-Design`  
**Production:** `https://www.wyzdesign.com`  
**Updated:** 2026-10-02

## Purpose

This is the durable briefing for Codex, WYZMiND, and any approved future agent working on WYZ Design. It preserves the operating context needed to improve the business and the website without guessing, duplicating work, or claiming unverified results.

## Business and Brand

WYZ Design is Torreé Marcel's founder-led creative growth studio. It began in Chicago's DIY art and music community and is scaling in Los Angeles. The studio supports artists, brands, studios, and cultural projects through photography, design, branding, web, video, printing, event production, strategy, and creative systems.

The operating philosophy is **Wild Yet Zealous**: bold creative vision delivered with disciplined execution and no shortcuts.

Brand architecture:

- **WYZ Design:** studio and commercial umbrella.
- **Wild Yet Zealous:** creative philosophy and quality standard.
- **Dying Breed Crew:** community, culture, merch, events, and collaborations.
- **Nomadic Breed:** mobile and on-location creative production.
- **WYZMiND:** internal intelligence, automation, and operations systems.

## Product and Technical Reality

The site is a Next.js 16, React 19, TypeScript, Tailwind application. Its production stack includes Supabase, Stripe, Resend, Upstash Redis, Vercel, OpenRouter, Ollama, and Qdrant.

It already supports bookings, paid checkout, plans, gift cards, lead forms, newsletter, referrals, Zeal loyalty, merch, admin operations, SEO, analytics, and status reporting. WYZMiND has both a public positioning page and private operations integrations; do not represent a capability publicly unless it is verified in implementation and operations.

## Working Rules

1. Treat `origin/master` as the repository truth. A local change, unmerged branch, or chat summary is not complete work.
2. Treat deployed state separately from Git state. Confirm the deployed commit before saying a change is live.
3. Treat database and provider configuration separately from code state. A migration file does not prove production application.
4. Keep one writer per file. State ownership before editing any file that another agent may be changing.
5. Work on a branch for independent or concurrent work. Direct production-branch work requires owner authorization.
6. Keep public claims, pricing, founder information, privacy claims, and client promises evidence-based.
7. Every completed implementation session must run `npx tsc --noEmit`, update `HANDOVER.md`, commit, and push.

## Priority Order

1. Revenue-path truth: one confirmed price and billing source across the site.
2. Conversion: each major service needs audience, proof, scope, price or inquiry path, and one clear action.
3. Trust: mobile polish, accessibility, performance, loading states, and accurate public information.
4. Measurement: verified analytics, lead attribution, booking conversion, revenue and retention reporting.
5. Operations: WYZMiND-supported intake, follow-up, client delivery, referral, and repeat-work workflows.

## Current Constraints and Decisions Needed

- Do not alter pricing or billing language until Torreé confirms the commercial canon.
- Do not change external dashboards, billing, domain, provider settings, or secrets without explicit authorization.
- Historic audits identify risks, but each must be rechecked before implementation because recent commits may have resolved it.

## Evidence Status

- Local WYZ Design branch: `master`, synchronized with `origin/master` at discovery (`4943727`).
- Public source says WYZ Design is built in Chicago and scaling in Los Angeles.
- Torreé Marcel is the official founder name for future copy.
- Muses by WYZ is a separate application and coordination reference. Its active application source must not be edited from this repository.

## Handoff Format

Each handoff records: objective, verified evidence, changes, files, validation, Git and deployment status, blockers, owner decisions needed, and exact next action.
