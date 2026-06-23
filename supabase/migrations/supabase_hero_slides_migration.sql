-- ─────────────────────────────────────────────────────────────────────────────
-- Hero Slides migration
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql
--
-- Creates the hero_slides table that replaces the three hardcoded slides
-- in HomeClient.tsx. RLS mirrors supabase_products_page_content_rls.sql.
-- ─────────────────────────────────────────────────────────────────────────────

CREATE TABLE IF NOT EXISTS hero_slides (
  id            serial      PRIMARY KEY,
  display_order integer     NOT NULL DEFAULT 0,
  badge         text        NOT NULL DEFAULT '',
  heading       text        NOT NULL DEFAULT '',
  subheadline   text        NOT NULL DEFAULT '',
  subtext       text        NOT NULL DEFAULT '',
  description   text        NOT NULL DEFAULT '',
  btn1_text     text        NOT NULL DEFAULT 'Learn More',
  btn1_link     text        NOT NULL DEFAULT '/',
  btn2_text     text        NOT NULL DEFAULT 'Contact Us',
  btn2_link     text        NOT NULL DEFAULT '/contact',
  bg_image_url  text        NOT NULL DEFAULT '',
  bg_color      text        NOT NULL DEFAULT '#0D1E3D',
  is_active     boolean     NOT NULL DEFAULT true,
  created_at    timestamptz          DEFAULT now(),
  updated_at    timestamptz          DEFAULT now()
);

-- Row-level security
ALTER TABLE hero_slides ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read hero_slides" ON hero_slides;
CREATE POLICY "Public read hero_slides"
  ON hero_slides FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write hero_slides" ON hero_slides;
CREATE POLICY "Admin write hero_slides"
  ON hero_slides FOR ALL USING (
    auth.email() IN (SELECT email FROM admins)
  );

-- Seed the 3 slides that are currently hardcoded in HomeClient.tsx.
-- Slide 1 uses the existing public-folder image (/HeroBlockHome.png) so the
-- homepage looks identical immediately after running this migration.
-- Replace bg_image_url values with Supabase Storage URLs once you upload
-- photos via /admin/slides.
INSERT INTO hero_slides
  (display_order, badge, heading, subheadline, subtext, description,
   btn1_text, btn1_link, btn2_text, btn2_link,
   bg_image_url, bg_color)
VALUES
  (
    1,
    'WELCOME TO SP',
    'The Expert In',
    '"Total Premiums & Promotion Solution"',
    'ผู้เชี่ยวชาญด้านของพรีเมียมและโปรโมชันครบวงจร',
    'Designing, producing, and delivering world-class premium gifts and corporate merchandise for leading brands across Thailand and beyond.',
    'Browse Our Work', '/our-work',
    'Get a Quote',     '/contact',
    '/HeroBlockHome.png',
    '#0D1E3D'
  ),
  (
    2,
    'OUR SPECIALTY',
    'Custom Corporate',
    '"Gifts & Branding Solutions"',
    'สร้างแบรนด์ของคุณด้วยของพรีเมียมระดับโลก',
    'Premium products tailored to strengthen your brand identity and leave a lasting impression on your clients and partners.',
    'View Services', '/services',
    'Get a Quote',   '/contact',
    '',
    '#0D1E3D'
  ),
  (
    3,
    'GLOBAL REACH',
    'OEM Manufacturing',
    '"& Global Distribution"',
    'ผลิตและจัดจำหน่ายทั่วโลกกว่า 30 ประเทศ',
    'Trusted production and sourcing solutions for businesses across 30+ countries with strict quality control and worldwide shipping.',
    'Our Work',   '/our-work',
    'Contact Us', '/contact',
    '',
    '#040A14'
  );
