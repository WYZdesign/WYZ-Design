-- Gift cards table for WYZ Design
-- Run in Supabase SQL Editor

CREATE TABLE IF NOT EXISTS gift_cards (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  stripe_session_id TEXT UNIQUE NOT NULL,
  buyer_email TEXT NOT NULL,
  recipient_email TEXT,
  amount INTEGER NOT NULL,
  code TEXT UNIQUE NOT NULL,
  redeemed BOOLEAN DEFAULT FALSE,
  redeemed_at TIMESTAMPTZ,
  redeemed_by TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_gift_cards_buyer ON gift_cards(buyer_email);
CREATE INDEX IF NOT EXISTS idx_gift_cards_code ON gift_cards(code);
