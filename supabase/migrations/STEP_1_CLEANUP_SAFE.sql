-- STEP 1: Safe Cleanup (Ignores errors if objects don't exist)
-- This version won't error even if nothing exists

-- Drop tables first (CASCADE will remove dependent policies/triggers)
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS gallery_albums CASCADE;

-- Drop function if it exists
DROP FUNCTION IF EXISTS update_gallery_updated_at() CASCADE;

-- Verify cleanup
SELECT
  tablename
FROM pg_tables
WHERE tablename IN ('gallery_albums', 'gallery_images');

-- Should return 0 rows (empty result = success)
