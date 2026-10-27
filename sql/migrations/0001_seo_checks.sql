-- SEO Checks persistence table (replaces the dead SQLite approach)
-- Run this migration against the wyzdesign Supabase project.
CREATE TABLE IF NOT EXISTS public.seo_checks (
  id BIGSERIAL PRIMARY KEY,
  url TEXT NOT NULL,
  score INTEGER NOT NULL DEFAULT 0,
  title_length INTEGER DEFAULT 0,
  description_length INTEGER DEFAULT 0,
  has_h1 INTEGER DEFAULT 0,
  has_canonical INTEGER DEFAULT 0,
  has_og INTEGER DEFAULT 0,
  has_schema INTEGER DEFAULT 0,
  issues TEXT DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_seo_checks_url ON public.seo_checks(url);
CREATE INDEX IF NOT EXISTS idx_seo_checks_created ON public.seo_checks(created_at DESC);

ALTER TABLE public.seo_checks ENABLE ROW LEVEL SECURITY;

-- Allow service_role full access (admin dashboard)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_checks TO service_role;

-- Allow anon/authenticated read (for the SEO dashboard)
GRANT SELECT ON public.seo_checks TO anon, authenticated;

CREATE POLICY "service_role_all" ON public.seo_checks FOR ALL TO service_role USING (true) WITH CHECK (true);