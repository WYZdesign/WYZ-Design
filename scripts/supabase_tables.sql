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
