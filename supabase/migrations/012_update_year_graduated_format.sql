-- Migration: Update year_graduated column to accept batch year format (e.g., "1993-2000")
-- Currently VARCHAR(4) only allows single years like "2007"
-- Change to VARCHAR(20) to accommodate batch format like "1993-2000"

BEGIN;

-- Step 1: Update the column type
ALTER TABLE profiles
  ALTER COLUMN year_graduated TYPE VARCHAR(20);

-- Step 2: Add a comment explaining the format
COMMENT ON COLUMN profiles.year_graduated IS 'Year graduated or batch years (e.g., "2007" or "1993-2000")';

COMMIT;

-- Verification query (run separately to check):
-- SELECT column_name, data_type, character_maximum_length
-- FROM information_schema.columns
-- WHERE table_name = 'profiles' AND column_name = 'year_graduated';
