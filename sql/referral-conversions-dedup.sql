-- Add stripe_event_id to referral_conversions for webhook dedup
-- Run in Supabase SQL Editor

ALTER TABLE referral_conversions ADD COLUMN IF NOT EXISTS stripe_event_id TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_referral_conversions_event ON referral_conversions(stripe_event_id) WHERE stripe_event_id IS NOT NULL;
