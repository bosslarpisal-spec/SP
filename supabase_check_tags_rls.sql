-- Run this in the Supabase SQL editor:
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql
--
-- PURPOSE: Audit the actual current state of RLS on the tags table.
-- Paste all three blocks and run them together.

-- 1. Is RLS enabled on the table?
SELECT tablename, rowsecurity AS rls_enabled
FROM pg_tables
WHERE schemaname = 'public' AND tablename = 'tags';

-- 2. What policies exist (name, command, roles, expression)?
SELECT
  policyname,
  cmd,
  roles,
  qual       AS using_expression,
  with_check AS with_check_expression,
  permissive
FROM pg_policies
WHERE schemaname = 'public' AND tablename = 'tags'
ORDER BY policyname;

-- 3. What privileges does the anon role have on the table?
SELECT grantee, privilege_type, is_grantable
FROM information_schema.role_table_grants
WHERE table_schema = 'public' AND table_name = 'tags'
ORDER BY grantee, privilege_type;

-- 4. How many rows are actually in the table?
SELECT count(*) AS tag_count FROM tags;
