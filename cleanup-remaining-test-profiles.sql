-- =====================================================
-- CLEANUP REMAINING TEST DATA PROFILES
-- =====================================================
-- Removes old "test" data profiles and keeps real CSV data
-- =====================================================

BEGIN;

-- 1. A S Syed Ahamed Khan
-- KEEP: ID 135 (Real CSV data, Year 2000, full info)
-- DELETE: ID 3 (Test data, Year 1999)
UPDATE gallery_images SET profile_id = 135 WHERE profile_id = 3;
UPDATE profile_answers SET profile_id = 135 WHERE profile_id = 3;
DELETE FROM profiles WHERE id = 3;

-- 2. Abishek Valluru
-- KEEP: ID 136 (Real CSV data, Year 2000, BnB Infracon)
-- DELETE: ID 5 (Test data, Year 1999)
UPDATE gallery_images SET profile_id = 136 WHERE profile_id = 5;
UPDATE profile_answers SET profile_id = 136 WHERE profile_id = 5;
DELETE FROM profiles WHERE id = 5;

-- 3. Annadurai S.V
-- KEEP: ID 137 (Real CSV data, Year 1998, Businessman/Farmer)
-- DELETE: ID 15 (Minimal data, Year 2000)
UPDATE gallery_images SET profile_id = 137 WHERE profile_id = 15;
UPDATE profile_answers SET profile_id = 137 WHERE profile_id = 15;
DELETE FROM profiles WHERE id = 15;

-- 4. Chenthil Aruun Mohan
-- KEEP: ID 141 (More recent/complete)
-- DELETE: ID 36 (Older)
UPDATE gallery_images SET profile_id = 141 WHERE profile_id = 36;
UPDATE profile_answers SET profile_id = 141 WHERE profile_id = 36;
DELETE FROM profiles WHERE id = 36;

-- 5. Kumaran Srinivasan
-- KEEP: ID 143 (More recent/complete)
-- DELETE: ID 70 (Older)
UPDATE gallery_images SET profile_id = 143 WHERE profile_id = 70;
UPDATE profile_answers SET profile_id = 143 WHERE profile_id = 70;
DELETE FROM profiles WHERE id = 70;

-- 6. Lalhruaitluanga Khiangte
-- KEEP: ID 144 (More recent/complete)
-- DELETE: ID 75 (Older)
UPDATE gallery_images SET profile_id = 144 WHERE profile_id = 75;
UPDATE profile_answers SET profile_id = 144 WHERE profile_id = 75;
DELETE FROM profiles WHERE id = 75;

-- 7. Shravan Kumar Avula
-- KEEP: ID 148 (More recent/complete)
-- DELETE: ID 110 (Older)
UPDATE gallery_images SET profile_id = 148 WHERE profile_id = 110;
UPDATE profile_answers SET profile_id = 148 WHERE profile_id = 110;
DELETE FROM profiles WHERE id = 110;

-- Verification
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check that deleted profiles are gone
SELECT id, name FROM profiles WHERE id IN (3, 5, 15, 36, 70, 75, 110);
-- Should return 0 rows

COMMIT;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- Expected results after cleanup:
--   - Total profiles: 139 (was 146, deleted 7 old profiles)
--   - All "test" data profiles removed
--   - Only real CSV data remains
-- =====================================================
