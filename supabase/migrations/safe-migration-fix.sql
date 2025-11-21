-- ============================================================================
-- SAFE MIGRATION FIX - Handles Existing Objects
-- Run this in Supabase Dashboard → SQL Editor
-- ============================================================================
-- This script checks what exists and only creates what's missing
-- Safe to run multiple times
-- ============================================================================

-- Step 1: Check current state
DO $$
BEGIN
  -- Check if table exists
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'app_users') THEN
    RAISE NOTICE '✅ app_users table already exists';
  ELSE
    RAISE NOTICE '❌ app_users table does NOT exist';
  END IF;

  -- Check if policies exist
  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'app_users' AND policyname = 'Users can read own record') THEN
    RAISE NOTICE '✅ Policy "Users can read own record" already exists';
  ELSE
    RAISE NOTICE '❌ Policy "Users can read own record" does NOT exist';
  END IF;

  IF EXISTS (SELECT FROM pg_policies WHERE tablename = 'app_users' AND policyname = 'Service role has full access') THEN
    RAISE NOTICE '✅ Policy "Service role has full access" already exists';
  ELSE
    RAISE NOTICE '❌ Policy "Service role has full access" does NOT exist';
  END IF;
END $$;

-- ============================================================================
-- Step 2: Drop existing policies (safe - will recreate)
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own record" ON app_users;
DROP POLICY IF EXISTS "Service role has full access" ON app_users;

RAISE NOTICE 'Existing policies dropped (if any)';

-- ============================================================================
-- Step 3: Create or recreate the app_users table
-- ============================================================================

-- Drop table if you want to start fresh (CAREFUL - deletes all user data!)
-- Uncomment only if you want to completely recreate:
-- DROP TABLE IF EXISTS app_users CASCADE;

-- Create table (will skip if already exists)
CREATE TABLE IF NOT EXISTS app_users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  has_directory_access BOOLEAN NOT NULL DEFAULT true,
  status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================================================
-- Step 4: Create indexes (IF NOT EXISTS)
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_status ON app_users(status);
CREATE INDEX IF NOT EXISTS idx_app_users_directory_access ON app_users(has_directory_access);

-- ============================================================================
-- Step 5: Enable RLS
-- ============================================================================

ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- Step 6: Create fresh RLS policies
-- ============================================================================

-- Policy 1: Users can read their own record
CREATE POLICY "Users can read own record" ON app_users
  FOR SELECT
  USING (id = auth.uid());

-- Policy 2: Service role has full access (for admin operations)
CREATE POLICY "Service role has full access" ON app_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================================
-- Step 7: Create or replace trigger function
-- ============================================================================

CREATE OR REPLACE FUNCTION update_app_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- ============================================================================
-- Step 8: Create or replace trigger
-- ============================================================================

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS trigger_update_app_users_updated_at ON app_users;

-- Create trigger
CREATE TRIGGER trigger_update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_app_users_updated_at();

-- ============================================================================
-- Step 9: Add comments
-- ============================================================================

COMMENT ON TABLE app_users IS 'Application users with directory access control';
COMMENT ON COLUMN app_users.has_directory_access IS 'Whether user can access the directory pages';
COMMENT ON COLUMN app_users.status IS 'User account status: active or inactive';

-- ============================================================================
-- Step 10: Verify setup
-- ============================================================================

DO $$
DECLARE
  table_exists BOOLEAN;
  policy_count INTEGER;
  index_count INTEGER;
BEGIN
  -- Check table
  SELECT EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_name = 'app_users'
  ) INTO table_exists;

  -- Count policies
  SELECT COUNT(*) INTO policy_count
  FROM pg_policies
  WHERE tablename = 'app_users';

  -- Count indexes
  SELECT COUNT(*) INTO index_count
  FROM pg_indexes
  WHERE tablename = 'app_users';

  -- Report
  RAISE NOTICE '============================================';
  RAISE NOTICE 'VERIFICATION RESULTS:';
  RAISE NOTICE '============================================';
  RAISE NOTICE 'Table exists: %', table_exists;
  RAISE NOTICE 'RLS policies: %', policy_count;
  RAISE NOTICE 'Indexes: %', index_count;
  RAISE NOTICE '============================================';

  IF table_exists AND policy_count = 2 AND index_count >= 3 THEN
    RAISE NOTICE '✅ ✅ ✅ MIGRATION SUCCESSFUL! ✅ ✅ ✅';
  ELSE
    RAISE NOTICE '⚠️ MIGRATION INCOMPLETE - Check errors above';
  END IF;
END $$;

-- ============================================================================
-- Step 11: Test query (should return empty result, no error)
-- ============================================================================

SELECT 'Migration test' as test, COUNT(*) as user_count FROM app_users;

-- ============================================================================
-- SUCCESS MESSAGE
-- ============================================================================

DO $$
BEGIN
  RAISE NOTICE '';
  RAISE NOTICE '🎉 Migration script completed!';
  RAISE NOTICE '';
  RAISE NOTICE 'Next steps:';
  RAISE NOTICE '1. Check the messages above for any errors';
  RAISE NOTICE '2. If you see "MIGRATION SUCCESSFUL", proceed to cleanup';
  RAISE NOTICE '3. Run the cleanup script to remove orphaned users';
  RAISE NOTICE '4. Test user creation in admin panel';
  RAISE NOTICE '';
END $$;
