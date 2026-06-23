-- ============================================================
-- portfolio_projects: dedicated table for Our Work page
-- Run once in Supabase SQL Editor
-- ============================================================

CREATE TABLE IF NOT EXISTS portfolio_projects (
  id            uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  title         text         NOT NULL DEFAULT '',
  title_th      text         DEFAULT '',
  description   text         DEFAULT '',
  client        text         NOT NULL DEFAULT '',
  image_url     text         DEFAULT '',
  project_link  text         DEFAULT '',
  tags          text         DEFAULT '',       -- comma-separated: "Gift Sets,Custom Branding"
  metrics       jsonb        DEFAULT '[]'::jsonb,
  icon          text         DEFAULT 'ti-star', -- Tabler icon class, shown when no image_url
  aspect        text         DEFAULT 'square' CHECK (aspect IN ('tall', 'wide', 'square')),
  display_order int          DEFAULT 0,
  visible       boolean      DEFAULT true,
  created_at    timestamptz  DEFAULT now()
);

-- ── RLS ──────────────────────────────────────────────────────
ALTER TABLE portfolio_projects ENABLE ROW LEVEL SECURITY;

-- Drop before recreating so this script is safe to re-run
DROP POLICY IF EXISTS "portfolio_anon_select" ON portfolio_projects;
DROP POLICY IF EXISTS "portfolio_auth_all"    ON portfolio_projects;

-- Public visitors: read visible projects only
CREATE POLICY "portfolio_anon_select" ON portfolio_projects
  FOR SELECT TO anon
  USING (visible = true);

-- Authenticated admins: full CRUD
CREATE POLICY "portfolio_auth_all" ON portfolio_projects
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- ── Seed data (only inserts if table is empty) ────────────────
-- display_order uses multiples of 10 so items can be inserted between
INSERT INTO portfolio_projects
  (title, title_th, description, client, tags, metrics, icon, aspect, display_order)
SELECT * FROM (VALUES
  (
    'Premium New Year Gift Sets',
    'ชุดของขวัญปีใหม่พรีเมียม',
    'Designed and produced 12,000 curated gift sets for P&G Thailand''s New Year campaign.',
    'P&G',
    'Gift Sets,Custom Packaging,Logistics',
    '[{"n":"12,000","label":"Units Produced"},{"n":"5","label":"Provinces Covered"},{"n":"10","label":"Days to Delivery"}]'::jsonb,
    'ti-gift', 'tall', 10
  ),
  (
    'Branded Corporate Merchandise',
    'สินค้าองค์กรแบรนด์ครบเซ็ต',
    'A full suite of branded merchandise for Acer''s distributor conference.',
    'Acer',
    'OEM Manufacturing,Custom Branding,Screen Print',
    '[{"n":"8,500","label":"Items Delivered"},{"n":"3","label":"Product Types"},{"n":"100%","label":"On-time Rate"}]'::jsonb,
    'ti-award', 'wide', 20
  ),
  (
    'Toothbrush Gift Packs',
    '',
    '',
    'Oral-B',
    'Gift Sets',
    '[]'::jsonb,
    'ti-package', 'square', 30
  ),
  (
    'Scented Promo Kits',
    '',
    '',
    'Ambipur',
    'Custom Branding',
    '[]'::jsonb,
    'ti-certificate', 'wide', 40
  ),
  (
    'Tech Distributor Gifts',
    '',
    '',
    'VSTECS',
    'OEM Manufacturing',
    '[]'::jsonb,
    'ti-cpu', 'square', 50
  ),
  (
    'Wellness Premium Sets',
    '',
    '',
    'Absolute You',
    'Premium Gifts',
    '[]'::jsonb,
    'ti-heart', 'tall', 60
  ),
  (
    'VIP Client Gift Collection',
    '',
    '',
    'SCB Bank',
    'Luxury Gifts',
    '[]'::jsonb,
    'ti-diamond', 'wide', 70
  ),
  (
    'Rider Appreciation Kits',
    '',
    '',
    'LINE MAN',
    'Corporate',
    '[]'::jsonb,
    'ti-bike', 'square', 80
  )
) AS v(title, title_th, description, client, tags, metrics, icon, aspect, display_order)
WHERE NOT EXISTS (SELECT 1 FROM portfolio_projects LIMIT 1);
