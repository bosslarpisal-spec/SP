-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql

CREATE TABLE tags (
  id uuid DEFAULT gen_random_uuid()
    PRIMARY KEY,
  name text NOT NULL UNIQUE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE tags
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read tags"
  ON tags FOR SELECT USING (true);

CREATE POLICY "Admin write tags"
  ON tags FOR ALL USING (
    auth.email() IN (
      SELECT email FROM admins
    )
  );

INSERT INTO tags (name)
SELECT DISTINCT unnest(tags) FROM products
ON CONFLICT (name) DO NOTHING;
