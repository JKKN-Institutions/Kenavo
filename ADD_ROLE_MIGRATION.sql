-- ============================================================================
-- SIMPLE: Add Role to app_users Table
-- Copy and paste this entire script into Supabase SQL Editor and run
-- ============================================================================

-- Add role column
ALTER TABLE app_users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('admin', 'user'));

-- Add index
CREATE INDEX IF NOT EXISTS idx_app_users_role ON app_users(role);

-- Update existing users to 'user' role
UPDATE app_users
SET role = 'user'
WHERE role IS NULL OR role = '';

-- Add comment
COMMENT ON COLUMN app_users.role IS 'User role: admin (full access) or user (directory access only)';

-- Verify migration
SELECT
  'Migration Complete!' as status,
  COUNT(*) as total_users,
  SUM(CASE WHEN role = 'admin' THEN 1 ELSE 0 END) as admin_users,
  SUM(CASE WHEN role = 'user' THEN 1 ELSE 0 END) as regular_users
FROM app_users;
