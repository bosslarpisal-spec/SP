-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql
--
-- Enables RLS on `products` and `page_content` (tables already exist —
-- this migration only adds the missing security policies, mirroring
-- the pattern already used for `categories` in
-- supabase_categories_migration.sql).
--
-- Admin writes go through the server-side service-role client
-- (src/lib/supabase-server.ts), which bypasses RLS entirely — these
-- policies only govern direct anon-key access (e.g. public pages and
-- the browser-side queries in src/app/(public)/profile/page.tsx and
-- src/hooks/useWishlist.ts).

ALTER TABLE products
  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read products" ON products;
CREATE POLICY "Public read products"
  ON products FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write products" ON products;
CREATE POLICY "Admin write products"
  ON products FOR ALL USING (
    auth.email() IN (
      SELECT email FROM admins
    )
  );

ALTER TABLE page_content
  ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public read page_content" ON page_content;
CREATE POLICY "Public read page_content"
  ON page_content FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admin write page_content" ON page_content;
CREATE POLICY "Admin write page_content"
  ON page_content FOR ALL USING (
    auth.email() IN (
      SELECT email FROM admins
    )
  );
