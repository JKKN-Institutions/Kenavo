-- =====================================================
-- MIGRATION 008: Add Auto-Increment to profiles.id
-- =====================================================
-- This migration adds SERIAL behavior to the profiles.id column
-- while preserving existing manually-assigned IDs (1-134)
--
-- Problem: profiles table has INTEGER PRIMARY KEY without auto-increment
-- Solution: Create sequence and set as default for id column
-- =====================================================

-- Step 1: Create a sequence for profiles.id
CREATE SEQUENCE IF NOT EXISTS profiles_id_seq;

-- Step 2: Find the current max ID and set sequence to start after it
-- This ensures new auto-generated IDs won't conflict with existing ones
SELECT setval('profiles_id_seq', (SELECT COALESCE(MAX(id), 0) FROM profiles), true);

-- Step 3: Set the sequence as the default for the id column
-- This makes the id column behave like SERIAL
ALTER TABLE profiles
ALTER COLUMN id SET DEFAULT nextval('profiles_id_seq');

-- Step 4: Grant usage on sequence (for RLS compatibility)
GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO anon;

-- =====================================================
-- COMMENTS
-- =====================================================

COMMENT ON SEQUENCE profiles_id_seq IS 'Auto-increment sequence for profiles.id, starts after existing manual IDs';

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Check the sequence current value
SELECT 'profiles_id_seq current value:' AS info, last_value FROM profiles_id_seq;

-- Check the id column default
SELECT
    column_name,
    column_default,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'id';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 008 completed successfully!';
    RAISE NOTICE '🔢 Auto-increment added to profiles.id';
    RAISE NOTICE '📝 Existing profile IDs (1-134) preserved';
    RAISE NOTICE '🎯 New profiles will auto-generate IDs starting from max+1';
END $$;
