-- ============================================================================
-- Migration: Add role column to app_users table
-- Purpose: Allow role-based access control (admin vs regular user)
-- ============================================================================

-- Step 1: Add role column
ALTER TABLE app_users
ADD COLUMN IF NOT EXISTS role TEXT NOT NULL DEFAULT 'user'
CHECK (role IN ('admin', 'user'));

-- Step 2: Add index for faster role lookups
CREATE INDEX IF NOT EXISTS idx_app_users_role ON app_users(role);

-- Step 3: Update any existing users to 'user' role (safe default)
UPDATE app_users
SET role = 'user'
WHERE role IS NULL;

-- Step 4: Add comment
COMMENT ON COLUMN app_users.role IS 'User role: admin (full access) or user (directory access only)';

-- Step 5: Verify
SELECT 'Migration completed - role column added' as status;
