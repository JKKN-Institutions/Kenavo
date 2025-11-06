-- =====================================================
-- VERIFICATION SCRIPT FOR SMART CLEANUP
-- =====================================================
-- Run this AFTER cleanup-duplicates-smart-approach.sql
-- to verify everything worked correctly
-- =====================================================

-- =====================================================
-- 1. VERIFY NEW DUPLICATES ARE DELETED
-- =====================================================
SELECT
    'DELETED PROFILES CHECK' as test_name,
    COUNT(*) as found_count,
    CASE
        WHEN COUNT(*) = 0 THEN '✅ PASS - All new duplicates deleted'
        ELSE '❌ FAIL - Some duplicates still exist'
    END as status
FROM profiles
WHERE id IN (135, 136, 137, 141, 143, 144, 148);

-- List any remaining duplicates (should be empty)
SELECT id, name, year_graduated
FROM profiles
WHERE id IN (135, 136, 137, 141, 143, 144, 148);

-- =====================================================
-- 2. VERIFY OLD PROFILES STILL EXIST WITH UPDATED DATA
-- =====================================================
SELECT
    'UPDATED PROFILES CHECK' as test_name,
    COUNT(*) as found_count,
    CASE
        WHEN COUNT(*) = 7 THEN '✅ PASS - All 7 profiles exist'
        ELSE '❌ FAIL - Some profiles missing'
    END as status
FROM profiles
WHERE id IN (3, 5, 15, 36, 70, 75, 110);

-- Show updated profiles with their data
SELECT
    id,
    name,
    company,
    current_job,
    location,
    year_graduated,
    CASE WHEN profile_image_url IS NOT NULL THEN '✅ Has Image' ELSE '❌ No Image' END as image_status,
    CASE WHEN nicknames IS NOT NULL THEN '✅ Has Nickname' ELSE '' END as nickname_status,
    updated_at
FROM profiles
WHERE id IN (3, 5, 15, 36, 70, 75, 110)
ORDER BY id;

-- =====================================================
-- 3. VERIFY PROFILE PICTURES INTACT
-- =====================================================
SELECT
    'PROFILE PICTURES CHECK' as test_name,
    COUNT(*) as profiles_with_images,
    CASE
        WHEN COUNT(*) = 7 THEN '✅ PASS - All profiles have images'
        WHEN COUNT(*) > 0 THEN '⚠️  PARTIAL - Some profiles have images'
        ELSE '❌ FAIL - No profile images'
    END as status
FROM profiles
WHERE id IN (3, 5, 15, 36, 70, 75, 110)
  AND profile_image_url IS NOT NULL;

-- Show profile image URLs
SELECT
    id,
    name,
    profile_image_url
FROM profiles
WHERE id IN (3, 5, 15, 36, 70, 75, 110)
ORDER BY id;

-- =====================================================
-- 4. VERIFY TOTAL PROFILE COUNT
-- =====================================================
SELECT
    'TOTAL PROFILES CHECK' as test_name,
    COUNT(*) as total_profiles,
    CASE
        WHEN COUNT(*) = 139 THEN '✅ PASS - Correct count (139)'
        ELSE '⚠️  Count is ' || COUNT(*) || ' (expected 139)'
    END as status
FROM profiles;

-- =====================================================
-- 5. CHECK FOR ANY REMAINING DUPLICATES
-- =====================================================
-- This checks for profiles with same name AND year (should be 0)
SELECT
    'DUPLICATE CHECK' as test_name,
    COUNT(*) as duplicate_groups,
    CASE
        WHEN COUNT(*) = 0 THEN '✅ PASS - No duplicates found'
        ELSE '❌ FAIL - ' || COUNT(*) || ' duplicate groups found'
    END as status
FROM (
    SELECT name, year_graduated, COUNT(*) as count
    FROM profiles
    WHERE name IS NOT NULL AND year_graduated IS NOT NULL
    GROUP BY name, year_graduated
    HAVING COUNT(*) > 1
) as duplicates;

-- List any remaining duplicates (should be empty)
SELECT
    name,
    year_graduated,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as profile_ids
FROM profiles
WHERE name IS NOT NULL AND year_graduated IS NOT NULL
GROUP BY name, year_graduated
HAVING COUNT(*) > 1;

-- =====================================================
-- 6. VERIFY Q&A ANSWERS MERGED
-- =====================================================
SELECT
    'Q&A ANSWERS CHECK' as test_name,
    COUNT(DISTINCT pa.profile_id) as profiles_with_qa,
    COUNT(*) as total_answers
FROM profile_answers pa
WHERE pa.profile_id IN (3, 5, 15, 36, 70, 75, 110);

-- Show Q&A count per profile
SELECT
    p.id,
    p.name,
    COUNT(pa.id) as qa_count,
    CASE
        WHEN COUNT(pa.id) > 0 THEN '✅ Has Q&A'
        ELSE '  No Q&A'
    END as status
FROM profiles p
LEFT JOIN profile_answers pa ON p.id = pa.profile_id
WHERE p.id IN (3, 5, 15, 36, 70, 75, 110)
GROUP BY p.id, p.name
ORDER BY p.id;

-- =====================================================
-- 7. VERIFY GALLERY IMAGES MERGED
-- =====================================================
SELECT
    'GALLERY IMAGES CHECK' as test_name,
    COUNT(DISTINCT gi.profile_id) as profiles_with_gallery,
    COUNT(*) as total_gallery_images
FROM gallery_images gi
WHERE gi.profile_id IN (3, 5, 15, 36, 70, 75, 110);

-- Show gallery image count per profile
SELECT
    p.id,
    p.name,
    COUNT(gi.id) as gallery_count,
    CASE
        WHEN COUNT(gi.id) > 0 THEN '✅ Has Gallery'
        ELSE '  No Gallery'
    END as status
FROM profiles p
LEFT JOIN gallery_images gi ON p.id = gi.profile_id
WHERE p.id IN (3, 5, 15, 36, 70, 75, 110)
GROUP BY p.id, p.name
ORDER BY p.id;

-- =====================================================
-- 8. CHECK DATA COMPLETENESS
-- =====================================================
SELECT
    id,
    name,
    CASE WHEN company IS NOT NULL AND company != 'N/A' THEN '✅' ELSE '  ' END as has_company,
    CASE WHEN current_job IS NOT NULL AND current_job != 'N/A' THEN '✅' ELSE '  ' END as has_job,
    CASE WHEN location IS NOT NULL AND location != 'test' THEN '✅' ELSE '  ' END as has_location,
    CASE WHEN nicknames IS NOT NULL THEN '✅' ELSE '  ' END as has_nickname,
    CASE WHEN year_graduated IS NOT NULL THEN '✅' ELSE '  ' END as has_year,
    (
        (CASE WHEN company IS NOT NULL AND company != 'N/A' THEN 1 ELSE 0 END) +
        (CASE WHEN current_job IS NOT NULL AND current_job != 'N/A' THEN 1 ELSE 0 END) +
        (CASE WHEN location IS NOT NULL AND location != 'test' THEN 1 ELSE 0 END) +
        (CASE WHEN nicknames IS NOT NULL THEN 1 ELSE 0 END) +
        (CASE WHEN year_graduated IS NOT NULL THEN 1 ELSE 0 END)
    ) as completeness_score
FROM profiles
WHERE id IN (3, 5, 15, 36, 70, 75, 110)
ORDER BY id;

-- =====================================================
-- SUMMARY REPORT
-- =====================================================
DO $$
DECLARE
    deleted_count INTEGER;
    updated_count INTEGER;
    total_count INTEGER;
    duplicates_count INTEGER;
    images_count INTEGER;
BEGIN
    -- Count deleted profiles (should be 0)
    SELECT COUNT(*) INTO deleted_count FROM profiles WHERE id IN (135, 136, 137, 141, 143, 144, 148);

    -- Count updated profiles (should be 7)
    SELECT COUNT(*) INTO updated_count FROM profiles WHERE id IN (3, 5, 15, 36, 70, 75, 110);

    -- Total profiles (should be 139)
    SELECT COUNT(*) INTO total_count FROM profiles;

    -- Duplicates (should be 0)
    SELECT COUNT(*) INTO duplicates_count FROM (
        SELECT name, year_graduated
        FROM profiles
        WHERE name IS NOT NULL AND year_graduated IS NOT NULL
        GROUP BY name, year_graduated
        HAVING COUNT(*) > 1
    ) dups;

    -- Profiles with images (should be 7)
    SELECT COUNT(*) INTO images_count
    FROM profiles
    WHERE id IN (3, 5, 15, 36, 70, 75, 110)
      AND profile_image_url IS NOT NULL;

    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'CLEANUP VERIFICATION SUMMARY';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Deleted Profiles: % (expected: 0)', deleted_count;
    RAISE NOTICE 'Updated Profiles: % (expected: 7)', updated_count;
    RAISE NOTICE 'Total Profiles: % (expected: 139)', total_count;
    RAISE NOTICE 'Duplicate Groups: % (expected: 0)', duplicates_count;
    RAISE NOTICE 'Profiles with Images: % (expected: 7)', images_count;
    RAISE NOTICE '';

    IF deleted_count = 0 AND updated_count = 7 AND total_count = 139 AND duplicates_count = 0 AND images_count = 7 THEN
        RAISE NOTICE '✅ ✅ ✅ ALL CHECKS PASSED! ✅ ✅ ✅';
        RAISE NOTICE '';
        RAISE NOTICE 'Cleanup was successful!';
        RAISE NOTICE '  - All new duplicates deleted';
        RAISE NOTICE '  - All old profiles updated with CSV data';
        RAISE NOTICE '  - Profile pictures intact';
        RAISE NOTICE '  - No duplicates remaining';
    ELSE
        RAISE NOTICE '⚠️  ⚠️  ⚠️  SOME CHECKS FAILED ⚠️  ⚠️  ⚠️';
        RAISE NOTICE '';
        RAISE NOTICE 'Review the verification queries above.';
    END IF;

    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;
