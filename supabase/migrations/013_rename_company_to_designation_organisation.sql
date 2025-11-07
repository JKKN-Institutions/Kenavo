-- =====================================================
-- MIGRATION 013: Rename company to designation_organisation
-- =====================================================
-- This migration renames the 'company' column to 'designation_organisation'
-- to better reflect that it combines both designation and organisation
-- separated by '/' instead of ' at '
-- =====================================================

-- Rename the company column to designation_organisation
ALTER TABLE profiles
RENAME COLUMN company TO designation_organisation;

-- Add a comment to the column explaining its purpose
COMMENT ON COLUMN profiles.designation_organisation IS 'Alumni designation and organisation combined with "/" separator (e.g., "CEO / Tech Corp")';

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Check if column was renamed successfully
SELECT column_name, data_type, column_default
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'designation_organisation';

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ Migration 013 completed successfully!';
    RAISE NOTICE '📝 Column renamed: company → designation_organisation';
    RAISE NOTICE '💡 Remember to update your application code to use the new column name';
    RAISE NOTICE '💡 Update displays to use "/" separator instead of " at "';
END $$;
