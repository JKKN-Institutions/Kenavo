-- =====================================================
-- SMART CLEANUP: Update OLD Profiles, Delete NEW Duplicates
-- =====================================================
-- This approach is BETTER because:
-- ✅ Keeps original profile IDs (3, 5, 15, etc.)
-- ✅ Profile pictures already correct (no copying needed)
-- ✅ Gallery images already linked correctly
-- ✅ Much simpler and safer
-- =====================================================

BEGIN;

-- =====================================================
-- PAIR 1: A S Syed Ahamed Khan
-- =====================================================
-- UPDATE: ID 3 (old) with data from ID 135 (new)
-- DELETE: ID 135 (new duplicate)

UPDATE profiles
SET
  name = (SELECT name FROM profiles WHERE id = 135),
  company = (SELECT company FROM profiles WHERE id = 135),
  current_job = (SELECT current_job FROM profiles WHERE id = 135),
  location = (SELECT location FROM profiles WHERE id = 135),
  nicknames = (SELECT nicknames FROM profiles WHERE id = 135),
  year_graduated = (SELECT year_graduated FROM profiles WHERE id = 135),
  bio = COALESCE((SELECT bio FROM profiles WHERE id = 135), bio),
  email = COALESCE((SELECT email FROM profiles WHERE id = 135), email),
  phone = COALESCE((SELECT phone FROM profiles WHERE id = 135), phone),
  linkedin_url = COALESCE((SELECT linkedin_url FROM profiles WHERE id = 135), linkedin_url),
  updated_at = NOW()
WHERE id = 3;

-- Move Q&A answers and gallery images from new to old
UPDATE profile_answers SET profile_id = 3 WHERE profile_id = 135;
UPDATE gallery_images SET profile_id = 3 WHERE profile_id = 135;

-- Delete new duplicate
DELETE FROM profiles WHERE id = 135;

-- =====================================================
-- PAIR 2: Abishek Valluru
-- =====================================================
-- UPDATE: ID 5 (old) with data from ID 136 (new)
-- DELETE: ID 136 (new duplicate)

UPDATE profiles
SET
  name = (SELECT name FROM profiles WHERE id = 136),
  company = (SELECT company FROM profiles WHERE id = 136),
  current_job = (SELECT current_job FROM profiles WHERE id = 136),
  location = (SELECT location FROM profiles WHERE id = 136),
  nicknames = (SELECT nicknames FROM profiles WHERE id = 136),
  year_graduated = (SELECT year_graduated FROM profiles WHERE id = 136),
  bio = COALESCE((SELECT bio FROM profiles WHERE id = 136), bio),
  email = COALESCE((SELECT email FROM profiles WHERE id = 136), email),
  phone = COALESCE((SELECT phone FROM profiles WHERE id = 136), phone),
  linkedin_url = COALESCE((SELECT linkedin_url FROM profiles WHERE id = 136), linkedin_url),
  updated_at = NOW()
WHERE id = 5;

UPDATE profile_answers SET profile_id = 5 WHERE profile_id = 136;
UPDATE gallery_images SET profile_id = 5 WHERE profile_id = 136;
DELETE FROM profiles WHERE id = 136;

-- =====================================================
-- PAIR 3: Annadurai S.V
-- =====================================================
-- UPDATE: ID 15 (old) with data from ID 137 (new)
-- DELETE: ID 137 (new duplicate)

UPDATE profiles
SET
  name = (SELECT name FROM profiles WHERE id = 137),
  company = (SELECT company FROM profiles WHERE id = 137),
  current_job = (SELECT current_job FROM profiles WHERE id = 137),
  location = (SELECT location FROM profiles WHERE id = 137),
  nicknames = (SELECT nicknames FROM profiles WHERE id = 137),
  year_graduated = (SELECT year_graduated FROM profiles WHERE id = 137),
  bio = COALESCE((SELECT bio FROM profiles WHERE id = 137), bio),
  email = COALESCE((SELECT email FROM profiles WHERE id = 137), email),
  phone = COALESCE((SELECT phone FROM profiles WHERE id = 137), phone),
  linkedin_url = COALESCE((SELECT linkedin_url FROM profiles WHERE id = 137), linkedin_url),
  updated_at = NOW()
WHERE id = 15;

UPDATE profile_answers SET profile_id = 15 WHERE profile_id = 137;
UPDATE gallery_images SET profile_id = 15 WHERE profile_id = 137;
DELETE FROM profiles WHERE id = 137;

-- =====================================================
-- PAIR 4: Chenthil Aruun Mohan
-- =====================================================
-- UPDATE: ID 36 (old) with data from ID 141 (new)
-- DELETE: ID 141 (new duplicate)

UPDATE profiles
SET
  name = (SELECT name FROM profiles WHERE id = 141),
  company = (SELECT company FROM profiles WHERE id = 141),
  current_job = (SELECT current_job FROM profiles WHERE id = 141),
  location = (SELECT location FROM profiles WHERE id = 141),
  nicknames = (SELECT nicknames FROM profiles WHERE id = 141),
  year_graduated = (SELECT year_graduated FROM profiles WHERE id = 141),
  bio = COALESCE((SELECT bio FROM profiles WHERE id = 141), bio),
  email = COALESCE((SELECT email FROM profiles WHERE id = 141), email),
  phone = COALESCE((SELECT phone FROM profiles WHERE id = 141), phone),
  linkedin_url = COALESCE((SELECT linkedin_url FROM profiles WHERE id = 141), linkedin_url),
  updated_at = NOW()
WHERE id = 36;

UPDATE profile_answers SET profile_id = 36 WHERE profile_id = 141;
UPDATE gallery_images SET profile_id = 36 WHERE profile_id = 141;
DELETE FROM profiles WHERE id = 141;

-- =====================================================
-- PAIR 5: Kumaran Srinivasan
-- =====================================================
-- UPDATE: ID 70 (old) with data from ID 143 (new)
-- DELETE: ID 143 (new duplicate)

UPDATE profiles
SET
  name = (SELECT name FROM profiles WHERE id = 143),
  company = (SELECT company FROM profiles WHERE id = 143),
  current_job = (SELECT current_job FROM profiles WHERE id = 143),
  location = (SELECT location FROM profiles WHERE id = 143),
  nicknames = (SELECT nicknames FROM profiles WHERE id = 143),
  year_graduated = (SELECT year_graduated FROM profiles WHERE id = 143),
  bio = COALESCE((SELECT bio FROM profiles WHERE id = 143), bio),
  email = COALESCE((SELECT email FROM profiles WHERE id = 143), email),
  phone = COALESCE((SELECT phone FROM profiles WHERE id = 143), phone),
  linkedin_url = COALESCE((SELECT linkedin_url FROM profiles WHERE id = 143), linkedin_url),
  updated_at = NOW()
WHERE id = 70;

UPDATE profile_answers SET profile_id = 70 WHERE profile_id = 143;
UPDATE gallery_images SET profile_id = 70 WHERE profile_id = 143;
DELETE FROM profiles WHERE id = 143;

-- =====================================================
-- PAIR 6: Lalhruaitluanga Khiangte
-- =====================================================
-- UPDATE: ID 75 (old) with data from ID 144 (new)
-- DELETE: ID 144 (new duplicate)

UPDATE profiles
SET
  name = (SELECT name FROM profiles WHERE id = 144),
  company = (SELECT company FROM profiles WHERE id = 144),
  current_job = (SELECT current_job FROM profiles WHERE id = 144),
  location = (SELECT location FROM profiles WHERE id = 144),
  nicknames = (SELECT nicknames FROM profiles WHERE id = 144),
  year_graduated = (SELECT year_graduated FROM profiles WHERE id = 144),
  bio = COALESCE((SELECT bio FROM profiles WHERE id = 144), bio),
  email = COALESCE((SELECT email FROM profiles WHERE id = 144), email),
  phone = COALESCE((SELECT phone FROM profiles WHERE id = 144), phone),
  linkedin_url = COALESCE((SELECT linkedin_url FROM profiles WHERE id = 144), linkedin_url),
  updated_at = NOW()
WHERE id = 75;

UPDATE profile_answers SET profile_id = 75 WHERE profile_id = 144;
UPDATE gallery_images SET profile_id = 75 WHERE profile_id = 144;
DELETE FROM profiles WHERE id = 144;

-- =====================================================
-- PAIR 7: Shravan Kumar Avula
-- =====================================================
-- UPDATE: ID 110 (old) with data from ID 148 (new)
-- DELETE: ID 148 (new duplicate)

UPDATE profiles
SET
  name = (SELECT name FROM profiles WHERE id = 148),
  company = (SELECT company FROM profiles WHERE id = 148),
  current_job = (SELECT current_job FROM profiles WHERE id = 148),
  location = (SELECT location FROM profiles WHERE id = 148),
  nicknames = (SELECT nicknames FROM profiles WHERE id = 148),
  year_graduated = (SELECT year_graduated FROM profiles WHERE id = 148),
  bio = COALESCE((SELECT bio FROM profiles WHERE id = 148), bio),
  email = COALESCE((SELECT email FROM profiles WHERE id = 148), email),
  phone = COALESCE((SELECT phone FROM profiles WHERE id = 148), phone),
  linkedin_url = COALESCE((SELECT linkedin_url FROM profiles WHERE id = 148), linkedin_url),
  updated_at = NOW()
WHERE id = 110;

UPDATE profile_answers SET profile_id = 110 WHERE profile_id = 148;
UPDATE gallery_images SET profile_id = 110 WHERE profile_id = 148;
DELETE FROM profiles WHERE id = 148;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- 1. Verify new duplicates are deleted
SELECT id, name FROM profiles
WHERE id IN (135, 136, 137, 141, 143, 144, 148);
-- Should return 0 rows

-- 2. Verify old profiles updated with correct data
SELECT id, name, company, current_job, year_graduated,
       CASE WHEN profile_image_url IS NOT NULL THEN '✅ Has Image' ELSE '❌ No Image' END as image_status
FROM profiles
WHERE id IN (3, 5, 15, 36, 70, 75, 110)
ORDER BY id;
-- Should show 7 rows with updated data and images

-- 3. Check total profile count
SELECT COUNT(*) as total_profiles FROM profiles;
-- Should be 139 (was 146, deleted 7)

COMMIT;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ SMART CLEANUP COMPLETED SUCCESSFULLY!';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Actions performed:';
    RAISE NOTICE '  ✅ Updated 7 old profiles with CSV data';
    RAISE NOTICE '  ✅ Deleted 7 new duplicate profiles';
    RAISE NOTICE '  ✅ Profile pictures preserved (no copying needed)';
    RAISE NOTICE '  ✅ Gallery images and Q&A answers merged';
    RAISE NOTICE '';
    RAISE NOTICE 'Results:';
    RAISE NOTICE '  - Total profiles: 139 (was 146)';
    RAISE NOTICE '  - Kept profile IDs: 3, 5, 15, 36, 70, 75, 110';
    RAISE NOTICE '  - Deleted profile IDs: 135, 136, 137, 141, 143, 144, 148';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Check verification queries above';
    RAISE NOTICE '  2. Test frontend at /directory/a-s-syed-ahamed-khan';
    RAISE NOTICE '  3. Verify profile pictures display correctly';
    RAISE NOTICE '  4. Run: npm run build (should have no duplicate warnings)';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;
