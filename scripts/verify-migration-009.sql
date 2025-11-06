-- =====================================================
-- VERIFICATION SCRIPT FOR MIGRATION 009
-- =====================================================
-- Run this to check if Migration 009 is properly applied
-- Safe to run anytime - no modifications, only queries
-- =====================================================

-- =====================================================
-- 1. CHECK UNIQUE CONSTRAINTS ON PROFILES TABLE
-- =====================================================
-- Expected: Should show 'profiles_name_year_unique' constraint
-- Expected: Should NOT show 'profiles_name_key' constraint

SELECT
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition,
    CASE
        WHEN conname = 'profiles_name_year_unique' THEN '✅ CORRECT (new constraint)'
        WHEN conname = 'profiles_name_key' THEN '❌ OLD CONSTRAINT STILL EXISTS'
        ELSE '⚠️  Unknown constraint'
    END as status
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'profiles'::regclass
  AND contype = 'u'  -- UNIQUE constraints only
ORDER BY conname;

-- =====================================================
-- 2. CHECK FOR DUPLICATE PROFILES
-- =====================================================
-- Expected: 0 rows (no duplicates after cleanup)

SELECT
    name,
    year_graduated,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as profile_ids,
    '❌ DUPLICATES FOUND - Run cleanup script!' as action
FROM profiles
WHERE name IS NOT NULL
  AND year_graduated IS NOT NULL
GROUP BY name, year_graduated
HAVING COUNT(*) > 1
ORDER BY duplicate_count DESC, name;

-- =====================================================
-- 3. VERIFY PROFILE COUNT
-- =====================================================
-- Expected: 146 profiles (after deleting 4 duplicates)

SELECT
    COUNT(*) as total_profiles,
    CASE
        WHEN COUNT(*) = 146 THEN '✅ CORRECT (4 duplicates cleaned)'
        WHEN COUNT(*) = 150 THEN '⚠️  Still 150 profiles - cleanup not run'
        ELSE '⚠️  Unexpected count'
    END as status
FROM profiles;

-- =====================================================
-- 4. CHECK INDEXES ON PROFILES TABLE
-- =====================================================
-- Expected: Should include 'idx_profiles_name_year' index

SELECT
    indexname,
    indexdef,
    CASE
        WHEN indexname = 'idx_profiles_name_year' THEN '✅ Migration 009 index exists'
        ELSE '  Other index'
    END as status
FROM pg_indexes
WHERE tablename = 'profiles'
  AND schemaname = 'public'
ORDER BY indexname;

-- =====================================================
-- 5. TEST DUPLICATE PREVENTION
-- =====================================================
-- This will FAIL if constraint is working correctly
-- Uncomment to test (will rollback automatically)

/*
BEGIN;

-- Try to insert duplicate name + year (should fail)
INSERT INTO profiles (id, name, year_graduated)
VALUES (99999, 'Test User', '2000');

INSERT INTO profiles (id, name, year_graduated)
VALUES (99998, 'Test User', '2000');  -- This should fail!

ROLLBACK;
-- If you see "duplicate key value violates unique constraint", migration works! ✅
*/

-- =====================================================
-- 6. SUMMARY REPORT
-- =====================================================

DO $$
DECLARE
    constraint_exists BOOLEAN;
    old_constraint_exists BOOLEAN;
    duplicate_count INTEGER;
    profile_count INTEGER;
    index_exists BOOLEAN;
BEGIN
    -- Check new constraint
    SELECT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_name_year_unique'
        AND conrelid = 'profiles'::regclass
    ) INTO constraint_exists;

    -- Check old constraint
    SELECT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_name_key'
        AND conrelid = 'profiles'::regclass
    ) INTO old_constraint_exists;

    -- Count duplicates
    SELECT COUNT(*) INTO duplicate_count
    FROM (
        SELECT name, year_graduated
        FROM profiles
        WHERE name IS NOT NULL AND year_graduated IS NOT NULL
        GROUP BY name, year_graduated
        HAVING COUNT(*) > 1
    ) dups;

    -- Count profiles
    SELECT COUNT(*) INTO profile_count FROM profiles;

    -- Check index
    SELECT EXISTS (
        SELECT 1 FROM pg_indexes
        WHERE indexname = 'idx_profiles_name_year'
        AND tablename = 'profiles'
    ) INTO index_exists;

    -- Print summary
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'MIGRATION 009 VERIFICATION SUMMARY';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
    RAISE NOTICE 'Constraint Status:';
    RAISE NOTICE '  New constraint (profiles_name_year_unique): %', CASE WHEN constraint_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    RAISE NOTICE '  Old constraint (profiles_name_key): %', CASE WHEN old_constraint_exists THEN '❌ STILL EXISTS' ELSE '✅ REMOVED' END;
    RAISE NOTICE '  Index (idx_profiles_name_year): %', CASE WHEN index_exists THEN '✅ EXISTS' ELSE '❌ MISSING' END;
    RAISE NOTICE '';
    RAISE NOTICE 'Data Status:';
    RAISE NOTICE '  Total profiles: %', profile_count;
    RAISE NOTICE '  Duplicate groups: %', duplicate_count;
    RAISE NOTICE '';
    RAISE NOTICE 'Overall Status:';
    IF constraint_exists AND NOT old_constraint_exists AND duplicate_count = 0 AND index_exists THEN
        RAISE NOTICE '  ✅ MIGRATION 009 COMPLETE AND SUCCESSFUL';
        RAISE NOTICE '  ✅ Database is ready for CSV uploads with UPSERT';
    ELSIF constraint_exists AND duplicate_count > 0 THEN
        RAISE NOTICE '  ⚠️  Migration complete but duplicates found';
        RAISE NOTICE '  ⚠️  Run cleanup-duplicates.sql script';
    ELSIF NOT constraint_exists THEN
        RAISE NOTICE '  ❌ Migration not complete - run migration 009';
    ELSE
        RAISE NOTICE '  ⚠️  Partial migration state - review above';
    END IF;
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;
