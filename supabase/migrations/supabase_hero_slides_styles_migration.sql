-- Step 1: Add per-slide style overrides column
-- Run in: https://supabase.com/dashboard/project/wxjsvwosvdzqpqfhwbzr/sql
--
-- Additive and backward-compatible: DEFAULT '{}' means all existing slides
-- get an empty object, so HomeClient.tsx spreads nothing and renders
-- identically to before.

ALTER TABLE hero_slides
  ADD COLUMN IF NOT EXISTS styles jsonb NOT NULL DEFAULT '{}'::jsonb;
