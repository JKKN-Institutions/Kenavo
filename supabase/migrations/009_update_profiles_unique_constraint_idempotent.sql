-- =====================================================
-- MIGRATION 009: Update profiles UNIQUE Constraint (IDEMPOTENT VERSION)
-- =====================================================
-- Changes UNIQUE constraint from 'name' only to 'name + year_graduated'
-- This allows same names in different graduation years (more realistic)
-- while preventing duplicate entries for same person
--
-- SAFE TO RUN MULTIPLE TIMES - Uses IF EXISTS checks
-- =====================================================

BEGIN;

-- =====================================================
-- Step 1: Drop old UNIQUE constraint on name (if exists)
-- =====================================================
DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'profiles_name_key'
        AND conrelid = 'profiles'::regclass
    ) THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_name_key;
        RAISE NOTICE '✅ Dropped old constraint: profiles_name_key';
    ELSE
        RAISE NOTICE '⏭️  Old constraint profiles_name_key does not exist (already dropped)';
    END IF;
END $$;

-- =====================================================
-- Step 2: Add new composite UNIQUE constraint (if not exists)
-- =====================================================
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'profiles_name_year_unique'
        AND conrelid = 'profiles'::regclass
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_name_year_unique
        UNIQUE (name, year_graduated);
        RAISE NOTICE '✅ Created new constraint: profiles_name_year_unique';
    ELSE
        RAISE NOTICE '⏭️  Constraint profiles_name_year_unique already exists (skipping)';
    END IF;
END $$;

-- =====================================================
-- Step 3: Create index for performance (already idempotent)
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_profiles_name_year
ON profiles(name, year_graduated);

-- =====================================================
-- Step 4: Add constraint comment
-- =====================================================
DO $$
BEGIN
    -- Only set comment if constraint exists
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'profiles_name_year_unique'
        AND conrelid = 'profiles'::regclass
    ) THEN
        EXECUTE 'COMMENT ON CONSTRAINT profiles_name_year_unique ON profiles IS
        ''Ensures unique alumni per graduation year - same name allowed in different years''';
        RAISE NOTICE '✅ Added constraint comment';
    END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check current UNIQUE constraints on profiles table
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'profiles'::regclass
  AND contype = 'u'  -- UNIQUE constraints only
ORDER BY conname;

-- Check for any remaining duplicates (should return 0 rows)
SELECT
    name,
    year_graduated,
    COUNT(*) as duplicate_count,
    STRING_AGG(id::text, ', ') as profile_ids
FROM profiles
WHERE name IS NOT NULL
  AND year_graduated IS NOT NULL
GROUP BY name, year_graduated
HAVING COUNT(*) > 1;

-- Count total profiles (should be 146 after cleanup)
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check indexes on profiles table
SELECT
    indexname,
    indexdef
FROM pg_indexes
WHERE tablename = 'profiles'
  AND schemaname = 'public'
ORDER BY indexname;

COMMIT;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '========================================';
    RAISE NOTICE '✅ Migration 009 completed successfully!';
    RAISE NOTICE '========================================';
    RAISE NOTICE 'Changes applied:';
    RAISE NOTICE '  - Old constraint (name only): REMOVED';
    RAISE NOTICE '  - New constraint (name + year): ACTIVE';
    RAISE NOTICE '  - Performance index: CREATED';
    RAISE NOTICE '';
    RAISE NOTICE 'Benefits:';
    RAISE NOTICE '  ✅ Same names allowed in different years';
    RAISE NOTICE '  ✅ Prevents duplicates within same year';
    RAISE NOTICE '  ✅ CSV uploads will use UPSERT logic';
    RAISE NOTICE '';
    RAISE NOTICE 'Next steps:';
    RAISE NOTICE '  1. Review verification query results above';
    RAISE NOTICE '  2. Ensure duplicate_count query returns 0 rows';
    RAISE NOTICE '  3. Test CSV upload at /admin-panel';
    RAISE NOTICE '  4. Verify frontend shows updated data';
    RAISE NOTICE '========================================';
    RAISE NOTICE '';
END $$;
