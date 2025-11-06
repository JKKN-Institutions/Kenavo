-- =====================================================
-- COPY AND PASTE THIS ENTIRE FILE INTO SUPABASE SQL EDITOR
-- =====================================================
-- This fixes the "constraint already exists" error
-- Safe to run multiple times - will skip already-completed steps
-- =====================================================

BEGIN;

-- Drop old constraint (if exists)
DO $$
BEGIN
    IF EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_name_key'
        AND conrelid = 'profiles'::regclass
    ) THEN
        ALTER TABLE profiles DROP CONSTRAINT profiles_name_key;
        RAISE NOTICE '✅ Dropped old constraint';
    ELSE
        RAISE NOTICE '⏭️  Old constraint already dropped';
    END IF;
END $$;

-- Add new constraint (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_name_year_unique'
        AND conrelid = 'profiles'::regclass
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_name_year_unique
        UNIQUE (name, year_graduated);
        RAISE NOTICE '✅ Created new constraint';
    ELSE
        RAISE NOTICE '⏭️  New constraint already exists';
    END IF;
END $$;

-- Create index
CREATE INDEX IF NOT EXISTS idx_profiles_name_year
ON profiles(name, year_graduated);

-- Verify constraints
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS definition
FROM pg_constraint c
WHERE conrelid = 'profiles'::regclass AND contype = 'u'
ORDER BY conname;

-- Check for duplicates (should return 0 rows)
SELECT
    name,
    year_graduated,
    COUNT(*) as count
FROM profiles
WHERE name IS NOT NULL AND year_graduated IS NOT NULL
GROUP BY name, year_graduated
HAVING COUNT(*) > 1;

COMMIT;

-- =====================================================
-- SUCCESS! You should see:
-- 1. Messages saying constraints were created or already exist
-- 2. A table showing 'profiles_name_year_unique' constraint
-- 3. Empty result for duplicates query (0 rows)
-- =====================================================
