# WYZ Design — Implementation Specs

Scoped, approval-gated implementation specs. Nothing in this file ships customer-facing messaging without Torreé's explicit approval. Board task numbers referenced inline.

---

## Spec 22 — Delivery into Proof, Referral, and Repeat Work

**Board task:** 22 · **Status:** spec'd, awaiting Torreé approval · **Owner:** WYZMiND (build), Torreé (copy approval + send authority), Codex (review)

### Problem

The operations map (`WYZ_OPERATIONS_MAP.md`) confirms four post-delivery gaps: no delivery confirmation, no testimonial request, no referral prompt, no lapsed-client win-back. Every completed project currently ends at "file delivered".

### Design (four automation stages)

| # | Stage | Trigger | Channel | Timing |
|---|-------|---------|---------|--------|
| 1 | Delivery confirmation | Invoice marked paid / project status → delivered (DB flag) | Email | Same day |
| 2 | Testimonial request | Stage 1 sent + 7 days elapsed | Email | Day +7 |
| 3 | Referral prompt | Stage 1 sent + 21 days elapsed, or client reply to stage 2 | Email | Day +21 |
| 4 | Lapsed-client win-back | No project in 90 days after any completed project | Email | Day +90 from last delivery |

### Rules

- **Consent:** single source of truth per client (Supabase `client_comm_preferences`: email_opt_in, updated_at, source). Opt-out in every message, honored within 24h, suppress list checked before every send.
- **Template staging:** all four messages live in `_STATE/outreach_drafts/` as drafts first. Render to HTML preview, Torreé approves each copy block by name before any send path is enabled.
- **Send authority:** automation may send only after (a) Torreé approved the copy and (b) an explicit `allowlist` flag is set per stage. Default = off for all stages.
- **Cadence cap:** max 1 marketing message per client per 14 days across stages 2-4.
- **No purchased lists, no cold outreach from this spec.** Existing clients only, keyed from the project DB.

### Implementation phases

1. **Phase 1 (schema + events):** `client_comm_preferences` table, delivery event emitter, draft templates. No sends.
2. **Phase 2 (staging sender):** cron/queue runner that renders and logs would-be sends to `_LOGS/outreach_preview.log`. Dry run for 7 days.
3. **Phase 3 (live, per-stage flags):** flip stages on one at a time as Torreé approves, starting with stage 1 (transactional, lowest risk).

### Success measures

- Testimonial capture rate: reviews per delivered project (baseline 0, target set by Torreé after phase 2 dry run).
- Referral traffic: `/referral` sessions + attributed bookings per quarter.
- Repeat rate: clients with a second project within 180 days (baseline measured in phase 1).
- Win-back: replies and reopened projects from lapsed sends.

### Non-goals

SMS, social DMs, third-party marketing platforms, automated pricing/offers.

---

## Spec 24 — Gift-Card Redemption Closeout

**Board task:** 24 · **Status:** spec'd, awaiting Torreé approval · **Owner:** WYZMiND (build), Torreé (policy + approval), Codex (review)

### Problem

Live `/gift-card` promises redemption "for services or merch". Code creates a Stripe checkout session and records the row after payment, but no customer-facing redemption flow exists. Either ship redemption or change the copy (board 28 covers the merch half of the same truth problem).

### Design

**1. Code issuance (already partial, harden):**
- 16-char crypto-random code generated only inside the Stripe `checkout.session.completed` webhook handler (never before payment).
- Store `code_hash` (SHA-256), never plaintext, in the `gift_cards` row; plaintext returned exactly once at purchase confirmation render.

**2. Balance ledger:**
- Extend `gift_cards`: `balance_cents`, `currency`, `status` (`active|redeemed|expired|void`), `expires_at`.
- Append-only `gift_card_ledger` rows (`gift_card_id, delta_cents, order_id, actor, created_at`). Balance = SUM(deltas). No UPDATEs of balance without a ledger row.

**3. Checkout redemption:**
- `POST /api/gift-card/redeem` at checkout: hash code → validate status/expiry → reserve amount atomically (row lock) → apply to session total → on payment webhook confirm, write ledger + decrement.
- Partial balance: remaining balance survives for next use; zero balance auto-status `redeemed`.
- Client-side: promo/gift field on checkout with inline validation, screen-reader `role="status"` feedback.

**4. Expiry policy:** 24 months from purchase (config constant `GIFT_CARD_TTL_MONTHS`). Expired codes fail closed with a clear message. Written into `/gift-card` FAQ copy at launch.

**5. Support fallback:** admin lookup by purchaser email + last 4 of code (never full code in logs). Manual void/refill writes a ledger row with `actor=admin` and reason. View gated by existing admin auth.

**6. Migration:** backfill `balance_cents = purchase_amount`, `expires_at = created_at + 24mo`, `status = active` for existing rows; dry-run report first (row counts, any zero/NULL amounts flagged), Torreé approves before applying.

### Phases

1. Schema + issuance hardening + migration dry run (no UX change).
2. Redeem API + checkout field, tested end-to-end in Stripe test mode.
3. `/gift-card` copy update + support runbook, Torreé sign-off, then live.

### Success measures

- Redemption success path works E2E in test mode (buy → code → redeem at checkout → ledger row).
- Zero codes or full codes in any log file (grep gate).
- Support can resolve a stuck card without engineering (runbook step test).

### Non-goals

Physical card printing, reselling/transfer between customers, in-store POS, partial-amount promotional campaigns.

---

*Specs land as docs-only (no build). Claim tasks 22/24 on the board when starting implementation, and keep the approval gates above intact.*
