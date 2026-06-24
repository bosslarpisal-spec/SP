-- ─────────────────────────────────────────────────────────────────────────────
-- Storage policies for the `page-images` bucket
-- Run in Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql
--
-- WHY THIS IS NEEDED
-- ------------------
-- Supabase Storage RLS lives on the `storage.objects` table. Creating a
-- bucket (even as "public") gives it zero policies by default — "public"
-- only means the download URL is accessible without a JWT; it does NOT
-- allow unauthenticated uploads or bypass the INSERT/UPDATE/DELETE policies.
--
-- The `product-images` bucket already has upload policies (set via the
-- Supabase dashboard when the bucket was created). The `page-images`
-- bucket was created without any mutating policies, so every call to
-- supabase.storage.from("page-images").upload(...) made from the
-- browser-side anon client (src/lib/supabase.ts) gets blocked:
--   "new row violates row-level security policy"
--
-- HOW AUTH WORKS HERE
-- -------------------
-- Admin users sign in via supabase.auth.signInWithPassword() on the
-- login page, giving them a Supabase Auth JWT with role = 'authenticated'.
-- Browser-side storage uploads run with that JWT, so:
--   auth.role() = 'authenticated'   ← true while admin is logged in
--   auth.email() = 'admin@...'      ← their Supabase Auth email
--
-- We restrict uploads to admins only (auth.email() IN admins) to prevent
-- any other authenticated Supabase user from writing to this bucket.
-- ─────────────────────────────────────────────────────────────────────────────

-- SELECT: anyone can read (download) page images — needed for public URLs
-- shown on the homepage, admin previews, etc.
DROP POLICY IF EXISTS "Public read page-images" ON storage.objects;
CREATE POLICY "Public read page-images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'page-images');

-- INSERT: only admins can upload new files
DROP POLICY IF EXISTS "Admin upload page-images" ON storage.objects;
CREATE POLICY "Admin upload page-images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'page-images'
    AND auth.email() IN (SELECT email FROM admins)
  );

-- UPDATE: only admins can replace/upsert existing files
-- (supabase.storage.upload(..., { upsert: true }) triggers this)
DROP POLICY IF EXISTS "Admin update page-images" ON storage.objects;
CREATE POLICY "Admin update page-images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'page-images'
    AND auth.email() IN (SELECT email FROM admins)
  );

-- DELETE: only admins can remove files
-- (called by deleteSlide() in actions.ts when a slide with an uploaded
-- image is deleted)
DROP POLICY IF EXISTS "Admin delete page-images" ON storage.objects;
CREATE POLICY "Admin delete page-images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'page-images'
    AND auth.email() IN (SELECT email FROM admins)
  );
