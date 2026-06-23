-- Run this ONLY if the audit above shows the "Public read tags" policy is missing.
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql

-- Safe to re-run: IF NOT EXISTS means it won't error if the policy already exists.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename  = 'tags'
      AND policyname = 'Public read tags'
  ) THEN
    EXECUTE 'CREATE POLICY "Public read tags" ON tags FOR SELECT USING (true)';
    RAISE NOTICE 'Policy "Public read tags" created.';
  ELSE
    RAISE NOTICE 'Policy "Public read tags" already exists — nothing changed.';
  END IF;
END
$$;
