-- =====================================================
-- CLEANUP DUPLICATE PROFILES - GENERATED SQL
-- =====================================================
-- Generated: 2025-11-06T08:53:51.108Z
-- Total duplicate groups: 4
-- Total profiles to delete: 4
-- =====================================================
-- ⚠️  IMPORTANT: Review this SQL before running!
-- ⚠️  Make sure you're keeping the correct profiles!
-- =====================================================

BEGIN;

-- =====================================================
-- CLEANUP OPERATIONS
-- =====================================================


-- 1. arokia roche j (Year: 2000)
-- KEEP: ID 139 - "AROKIA ROCHE J"
-- DELETE: ID 11
-- Reason: Most complete data (Company: N/A, Job: MANAGER)

-- Move data from ID 11 to ID 139
UPDATE gallery_images SET profile_id = 139 WHERE profile_id = 11;
UPDATE profile_answers SET profile_id = 139 WHERE profile_id = 11;
DELETE FROM profiles WHERE id = 11;

-- Verify: Check that ID 139 is the only one remaining
-- SELECT * FROM profiles WHERE id IN (139, 11);


-- 2. karthikeyan m (Year: 2000)
-- KEEP: ID 142 - "Karthikeyan m"
-- DELETE: ID 67
-- Reason: Most complete data (Company: --, Job: Business Owner)

-- Move data from ID 67 to ID 142
UPDATE gallery_images SET profile_id = 142 WHERE profile_id = 67;
UPDATE profile_answers SET profile_id = 142 WHERE profile_id = 67;
DELETE FROM profiles WHERE id = 67;

-- Verify: Check that ID 142 is the only one remaining
-- SELECT * FROM profiles WHERE id IN (142, 67);


-- 3. mathew kodath (Year: 2000)
-- KEEP: ID 145 - "MATHEW KODATH"
-- DELETE: ID 79
-- Reason: Most complete data (Company: GUACAMAYA FILMS, Job: CEO - GUACAMAYA FILMS / PRODUCER / DIRECTOR)

-- Move data from ID 79 to ID 145
UPDATE gallery_images SET profile_id = 145 WHERE profile_id = 79;
UPDATE profile_answers SET profile_id = 145 WHERE profile_id = 79;
DELETE FROM profiles WHERE id = 79;

-- Verify: Check that ID 145 is the only one remaining
-- SELECT * FROM profiles WHERE id IN (145, 79);


-- 4. pravin kumar raju (Year: 2000)
-- KEEP: ID 146 - "PRAVIN KUMAR RAJU"
-- DELETE: ID 99
-- Reason: Most complete data (Company: BHARATHI AND CO. AND RASVIN MOBILES PVT.LTD., Job: Business Owner)

-- Move data from ID 99 to ID 146
UPDATE gallery_images SET profile_id = 146 WHERE profile_id = 99;
UPDATE profile_answers SET profile_id = 146 WHERE profile_id = 99;
DELETE FROM profiles WHERE id = 99;

-- Verify: Check that ID 146 is the only one remaining
-- SELECT * FROM profiles WHERE id IN (146, 99);


-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count remaining profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check for any remaining duplicates
WITH normalized_profiles AS (
  SELECT
    id,
    name,
    year_graduated,
    LOWER(TRIM(REGEXP_REPLACE(name, '[^a-zA-Z0-9\s]', '', 'g'))) as normalized_name
  FROM profiles
)
SELECT
  normalized_name,
  year_graduated,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as profile_ids
FROM normalized_profiles
GROUP BY normalized_name, year_graduated
HAVING COUNT(*) > 1;

-- This should return 0 rows if cleanup was successful

COMMIT;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- If you see this without errors, duplicates are cleaned up!
-- Next step: Run migration 009 if not already done
-- =====================================================
