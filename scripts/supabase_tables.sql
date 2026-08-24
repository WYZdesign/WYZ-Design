-- WYZ Design — Supabase table migrations
-- Run these in the Supabase SQL editor if the tables don't exist.

-- Bug reports (migrated from ephemeral /tmp on Vercel)
CREATE TABLE IF NOT EXISTS bug_reports (
  id bigint PRIMARY KEY,
  title text NOT NULL,
  description text NOT NULL,
  severity text DEFAULT 'medium',
  createdAt text NOT NULL,
  ip text DEFAULT ''
);

-- Page content (CMS pages, migrated from filesystem on Vercel)
CREATE TABLE IF NOT EXISTS page_content (
  page text PRIMARY KEY,
  html text NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Referral codes (unique codes for each referrer)
CREATE TABLE IF NOT EXISTS referral_codes (
  id BIGSERIAL PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  referrer_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Referral conversions (tracks when a referred person signs up or purchases)
CREATE TABLE IF NOT EXISTS referral_conversions (
  id BIGSERIAL PRIMARY KEY,
  referral_code TEXT NOT NULL REFERENCES referral_codes(code),
  referred_email TEXT NOT NULL,
  event_type TEXT NOT NULL CHECK(event_type IN ('signup','purchase')),
  amount NUMERIC DEFAULT 0,
  commission NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'pending' CHECK(status IN ('pending','approved','paid')),
  created_at TIMESTAMPTZ DEFAULT now()
);
