-- Migration: Create app_users table for user management and directory access control
-- This table extends Supabase Auth users with application-specific data

-- Create app_users table
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

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_app_users_email ON app_users(email);
CREATE INDEX IF NOT EXISTS idx_app_users_status ON app_users(status);
CREATE INDEX IF NOT EXISTS idx_app_users_directory_access ON app_users(has_directory_access);

-- Enable Row Level Security
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own record
CREATE POLICY "Users can read own record" ON app_users
  FOR SELECT
  USING (id = auth.uid());

-- RLS Policy: Service role has full access (for admin operations)
CREATE POLICY "Service role has full access" ON app_users
  FOR ALL
  USING (auth.role() = 'service_role');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_app_users_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function
CREATE TRIGGER trigger_update_app_users_updated_at
  BEFORE UPDATE ON app_users
  FOR EACH ROW
  EXECUTE FUNCTION update_app_users_updated_at();

-- Add comment to table
COMMENT ON TABLE app_users IS 'Application users with directory access control';
COMMENT ON COLUMN app_users.has_directory_access IS 'Whether user can access the directory pages';
COMMENT ON COLUMN app_users.status IS 'User account status: active or inactive';
