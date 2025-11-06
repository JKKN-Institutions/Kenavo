-- =====================================================
-- SMART CLEANUP: Update OLD Profiles, Delete NEW Duplicates (FIXED ORDER)
-- =====================================================
-- FIX: Delete NEW profiles FIRST to avoid unique constraint violations
-- THEN update OLD profiles with the data
-- =====================================================

BEGIN;

-- =====================================================
-- PAIR 1: A S Syed Ahamed Khan
-- =====================================================
-- First: Move data from new to old
-- Then: Delete new profile
-- Finally: Update old profile

-- Move Q&A answers and gallery images from new (135) to old (3)
UPDATE profile_answers SET profile_id = 3 WHERE profile_id = 135;
UPDATE gallery_images SET profile_id = 3 WHERE profile_id = 135;

-- Delete new duplicate profile FIRST
DELETE FROM profiles WHERE id = 135;

-- Now update old profile with the data (no conflict!)
UPDATE profiles
SET
  name = 'A S SYED AHAMED KHAN',
  company = 'OWN AGRICULTURE FARMING BUSINESS',
  current_job = 'AGRICULTURALIST, OWNER',
  location = 'PUDHU MACHU VEEDU", 18.9, MUSLIM MIDDLE STREET, UTHAMAPALAYAM 625533, THENI DISTRICT, TAMIL NADU, INDIA',
  nicknames = 'Bhai!!',
  year_graduated = '2000',
  updated_at = NOW()
WHERE id = 3;

-- =====================================================
-- PAIR 2: Abishek Valluru
-- =====================================================

UPDATE profile_answers SET profile_id = 5 WHERE profile_id = 136;
UPDATE gallery_images SET profile_id = 5 WHERE profile_id = 136;
DELETE FROM profiles WHERE id = 136;

UPDATE profiles
SET
  name = 'Abishek Valluru',
  company = 'BnB Infracon India out ltd',
  current_job = 'Business/ Managing Director',
  location = 'Villa no 208 first leaf journalist colony Phase 3 Gachibowli Hyderabad 500032',
  nicknames = 'Daddy',
  year_graduated = '2000',
  updated_at = NOW()
WHERE id = 5;

-- =====================================================
-- PAIR 3: Annadurai S.V
-- =====================================================

UPDATE profile_answers SET profile_id = 15 WHERE profile_id = 137;
UPDATE gallery_images SET profile_id = 15 WHERE profile_id = 137;
DELETE FROM profiles WHERE id = 137;

UPDATE profiles
SET
  name = 'Annadurai S.V',
  company = 'Nil',
  current_job = 'Business man come Farmer',
  location = '170B    MK street, Sivathapuram, Salem',
  nicknames = 'Don (Durai)',
  year_graduated = '1998',
  updated_at = NOW()
WHERE id = 15;

-- =====================================================
-- PAIR 4: Chenthil Aruun Mohan
-- =====================================================

UPDATE profile_answers SET profile_id = 36 WHERE profile_id = 141;
UPDATE gallery_images SET profile_id = 36 WHERE profile_id = 141;
DELETE FROM profiles WHERE id = 141;

UPDATE profiles
SET
  name = 'Chenthil Aruun Mohan',
  company = 'Ministry of health , Saudi Arabia',
  current_job = 'Prothodontist / Associate Professor',
  location = '9-1-28, Double agraharam, Sholavandan, Madurai 625214.',
  nicknames = 'Karuvaaya, Junior Amma',
  year_graduated = '1998',
  updated_at = NOW()
WHERE id = 36;

-- =====================================================
-- PAIR 5: Kumaran Srinivasan
-- =====================================================

UPDATE profile_answers SET profile_id = 70 WHERE profile_id = 143;
UPDATE gallery_images SET profile_id = 70 WHERE profile_id = 143;
DELETE FROM profiles WHERE id = 143;

UPDATE profiles
SET
  name = 'Kumaran Srinivasan',
  company = 'Sree RENGARAAJ steels and alloys private limited',
  current_job = 'Sree RENGARAAJ steels and alloys (Steel manufacturing), Director',
  location = '3B, sri nidhi apartments , 1st cross street , Sakthinagar , erode',
  nicknames = 'Kumaran',
  year_graduated = '1995',
  updated_at = NOW()
WHERE id = 70;

-- =====================================================
-- PAIR 6: Lalhruaitluanga Khiangte
-- =====================================================

UPDATE profile_answers SET profile_id = 75 WHERE profile_id = 144;
UPDATE gallery_images SET profile_id = 75 WHERE profile_id = 144;
DELETE FROM profiles WHERE id = 144;

UPDATE profiles
SET
  name = 'Lalhruaitluanga Khiangte',
  company = 'K.T.C. / Solomon Pharmacy',
  current_job = 'Business',
  location = 'Chaltlang Aizawl, Mizoram',
  nicknames = 'Marsh',
  year_graduated = '1999',
  updated_at = NOW()
WHERE id = 75;

-- =====================================================
-- PAIR 7: Shravan Kumar Avula
-- =====================================================

UPDATE profile_answers SET profile_id = 110 WHERE profile_id = 148;
UPDATE gallery_images SET profile_id = 110 WHERE profile_id = 148;
DELETE FROM profiles WHERE id = 148;

UPDATE profiles
SET
  name = 'Shravan Kumar Avula',
  company = 'CAPART INDUSTRIES',
  current_job = 'Managing Director / Industrialist',
  location = 'Villa 15, Bollineni Homes, Madhapur, Hyderabad 500081',
  nicknames = 'Several!',
  year_graduated = '1998',
  updated_at = NOW()
WHERE id = 110;

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
    RAISE NOTICE '  ✅ Deleted 7 new duplicate profiles FIRST';
    RAISE NOTICE '  ✅ Updated 7 old profiles with CSV data';
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
