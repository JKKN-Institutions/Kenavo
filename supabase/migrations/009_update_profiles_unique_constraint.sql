-- =====================================================
-- MIGRATION 009: Update profiles UNIQUE Constraint (IDEMPOTENT)
-- =====================================================
-- Changes UNIQUE constraint from 'name' only to 'name + year_graduated'
-- This allows same names in different graduation years (more realistic)
-- while preventing duplicate entries for same person
--
-- UPDATED: Now idempotent - safe to run multiple times
-- Problem: Current constraint blocks same names even from different years
-- Solution: Use composite unique key (name, year_graduated)
-- =====================================================

BEGIN;

-- Step 1: Drop the existing UNIQUE constraint on name (if exists)
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

-- Step 2: Add new composite UNIQUE constraint (if not exists)
-- This allows "John Smith" in both 2000 and 2001, but not duplicate in same year
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

-- Step 3: Create index for performance on the composite key
CREATE INDEX IF NOT EXISTS idx_profiles_name_year
ON profiles(name, year_graduated);

-- =====================================================
-- COMMENTS
-- =====================================================

DO $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conname = 'profiles_name_year_unique'
        AND conrelid = 'profiles'::regclass
    ) THEN
        EXECUTE 'COMMENT ON CONSTRAINT profiles_name_year_unique ON profiles IS
        ''Ensures unique alumni per graduation year - same name allowed in different years''';
    END IF;
END $$;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Check the new constraint
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'profiles'::regclass
  AND contype = 'u'
ORDER BY conname;

-- Check for any potential duplicates that would violate new constraint
-- (Should return no rows if data is clean)
SELECT
    name,
    year_graduated,
    COUNT(*) as duplicate_count
FROM profiles
WHERE name IS NOT NULL
  AND year_graduated IS NOT NULL
GROUP BY name, year_graduated
HAVING COUNT(*) > 1;

COMMIT;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '';
    RAISE NOTICE '✅ Migration 009 completed successfully!';
    RAISE NOTICE '🔄 Changed UNIQUE constraint from name to (name, year_graduated)';
    RAISE NOTICE '✅ Same names allowed in different graduation years';
    RAISE NOTICE '🔒 Duplicate prevention: same person in same year blocked';
    RAISE NOTICE '🎯 CSV uploads will now use UPSERT to update existing profiles';
    RAISE NOTICE '';
END $$;
