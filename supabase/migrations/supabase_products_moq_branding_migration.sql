-- Run this in your Supabase SQL Editor:
-- https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS moq integer,
  ADD COLUMN IF NOT EXISTS branding_methods text[] DEFAULT '{}';
