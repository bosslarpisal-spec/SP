-- =====================================================================
-- Cleanup: Remove empty placeholder stat rows from About page
-- Run once in Supabase Dashboard → SQL Editor
-- =====================================================================

-- About → Stats: keep only entries with a real value (not 0 / empty)
-- and a real label (not empty / "Label" placeholder)
UPDATE page_content
SET value = (
  SELECT COALESCE(json_agg(elem ORDER BY elem->>'label')::text, '[]')
  FROM json_array_elements(value::json) elem
  WHERE
    -- has a real number (not blank, not "0")
    NULLIF(TRIM((elem->>'value')::text), '') IS NOT NULL
    AND TRIM((elem->>'value')::text) <> '0'
    -- has a real label (not blank, not the placeholder word "Label" / "label")
    AND NULLIF(TRIM((elem->>'label')::text), '') IS NOT NULL
    AND LOWER(TRIM((elem->>'label')::text)) NOT IN ('label', 'ป้ายกำกับ')
)
WHERE page = 'about' AND section = 'stats' AND key = 'items';

-- Verify the result — should show 4 real entries
SELECT value FROM page_content WHERE page = 'about' AND section = 'stats' AND key = 'items';
