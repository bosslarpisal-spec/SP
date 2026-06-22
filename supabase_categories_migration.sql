-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql

CREATE TABLE categories (
  id uuid DEFAULT gen_random_uuid()
    PRIMARY KEY,
  name text NOT NULL UNIQUE,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories
  ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read categories"
  ON categories FOR SELECT USING (true);

CREATE POLICY "Admin write categories"
  ON categories FOR ALL USING (
    auth.email() IN (
      SELECT email FROM admins
    )
  );

INSERT INTO categories
  (name, display_order, is_visible)
VALUES
  ('IT Gadgets', 1, true),
  ('Premium Sets', 2, true),
  ('Bags', 3, true),
  ('Stationery', 4, true),
  ('Drinkware', 5, true),
  ('Souvenirs', 6, true),
  ('Packaging', 7, true);
