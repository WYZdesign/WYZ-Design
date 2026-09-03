-- WYZ Design — Zeal/loyalty + profile + newsletter migration from Neo4j to Supabase Postgres
-- Run once in Supabase SQL Editor (or via `supabase db push` / psql).
-- Replaces the Neo4j User node + EARNED_POINTS edges that could never be
-- reached from Vercel serverless (localhost + Bolt TCP both blocked).

-- ═══════════════════════════════════════════════════════════════
-- 1. zeal_users — one row per user, holds the full Zeal engine state
--    (mirrors the Neo4j `:User` node fields exactly).
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS zeal_users (
  email           TEXT PRIMARY KEY,
  points          INTEGER NOT NULL DEFAULT 0,
  tier            TEXT NOT NULL DEFAULT 'recruit',
  actions         JSONB NOT NULL DEFAULT '[]'::jsonb,
  achievements    JSONB NOT NULL DEFAULT '[]'::jsonb,
  quests_completed JSONB NOT NULL DEFAULT '[]'::jsonb,
  counters        JSONB NOT NULL DEFAULT '{}'::jsonb,
  visit_streak    INTEGER NOT NULL DEFAULT 0,
  longest_streak  INTEGER NOT NULL DEFAULT 0,
  last_visit_day  TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_zeal_users_points ON zeal_users(points DESC);

-- ═══════════════════════════════════════════════════════════════
-- 2. loyalty_transactions — replaces the Neo4j `-[:EARNED_POINTS]->`
--    relationship. Every Zeal award/deduction is an immutable row.
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS loyalty_transactions (
  id         BIGSERIAL PRIMARY KEY,
  email      TEXT NOT NULL,
  amount     INTEGER NOT NULL,
  reason     TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS idx_loyalty_transactions_email ON loyalty_transactions(email, created_at DESC);

-- ═══════════════════════════════════════════════════════════════
-- 3. profiles — user profile fields formerly on the Neo4j User node.
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS profiles (
  email      TEXT PRIMARY KEY,
  name       TEXT,
  bio        TEXT,
  phone      TEXT,
  website    TEXT,
  avatar_url TEXT,
  instagram  TEXT,
  facebook   TEXT,
  provider   TEXT,
  provider_account_id TEXT,
  role       TEXT NOT NULL DEFAULT 'member',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  last_login TIMESTAMPTZ
);

-- ═══════════════════════════════════════════════════════════════
-- 4. newsletter_subscribers — replaces the Neo4j NewsletterSubscriber node.
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS newsletter_subscribers (
  email          TEXT PRIMARY KEY,
  active         BOOLEAN NOT NULL DEFAULT true,
  subscribed_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  unsubscribed_at TIMESTAMPTZ,
  resubscribed_at TIMESTAMPTZ
);
CREATE INDEX IF NOT EXISTS idx_newsletter_subscribers_active ON newsletter_subscribers(active);

-- ═══════════════════════════════════════════════════════════════
-- 5. form_submissions — canonical store for all form submissions
--    (contact/booking/model-application/etc.). The /api/forms route and
--    the /api/admin overview both read/write this table; it was missing
--    from the schema, so submissions were silently dropped and admin
--    showed 0 forms.
-- ═══════════════════════════════════════════════════════════════
CREATE TABLE IF NOT EXISTS form_submissions (
  id           TEXT PRIMARY KEY,
  form_type    TEXT NOT NULL,
  data         JSONB NOT NULL DEFAULT '{}'::jsonb,
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  ip           TEXT
);
CREATE INDEX IF NOT EXISTS idx_form_submissions_submitted_at ON form_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_form_submissions_form_type ON form_submissions(form_type);

-- ═══════════════════════════════════════════════════════════════
-- 6. Row Level Security — service role bypasses RLS, but lock these
--    down so the anon/publishable key can never read/write them.
--    (Data is only ever read/written server-side via the service role.)
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE form_submissions ENABLE ROW LEVEL SECURITY;
-- ═══════════════════════════════════════════════════════════════
ALTER TABLE zeal_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE loyalty_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
