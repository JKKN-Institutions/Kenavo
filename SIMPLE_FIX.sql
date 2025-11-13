-- ============================================================================
-- SIMPLE FIX - No syntax errors, just works!
-- Copy and paste this entire file into Supabase SQL Editor and run
-- ============================================================================

-- Drop existing policies first (prevents conflicts)
DROP POLICY IF EXISTS "Users can read own record" ON app_users;
DROP POLICY IF EXISTS "Service role has full access" ON app_users;

-- Create table (if it doesn't exist)
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_status ON app_users(status);
CREATE INDEX IF NOT EXISTS idx_app_users_directory_access ON app_users(has_directory_access);

-- Enable RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- Create fresh policies
CREATE POLICY "Users can read own record" ON app_users
  FOR SELECT
  USING (id = auth.uid());

CREATE POLICY "Service role has full access" ON app_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create or replace trigger function
CREATE OR REPLACE FUNCTION update_app_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop and recreate trigger
DROP TRIGGER IF EXISTS trigger_update_app_users_updated_at ON app_users;

CREATE TRIGGER trigger_update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_app_users_updated_at();

-- Add comments
COMMENT ON TABLE app_users IS 'Application users with directory access control';
COMMENT ON COLUMN app_users.has_directory_access IS 'Whether user can access the directory pages';
COMMENT ON COLUMN app_users.status IS 'User account status: active or inactive';

-- Test query (should return 0 rows, no error)
SELECT 'SUCCESS: Table is ready!' as status, COUNT(*) as user_count FROM app_users;
