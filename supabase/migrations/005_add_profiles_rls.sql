-- Migration: Add Row Level Security policies to profiles table
-- Purpose: Secure profile data by restricting write access to service role only
-- while allowing public read access for the directory

-- Enable RLS on profiles table
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policy 1: Allow public read access to all profiles
-- This enables the directory and individual profile pages to display data
CREATE POLICY "Public can view all profiles"
ON profiles
FOR SELECT
USING (true);

-- Policy 2: Only service role can insert profiles
-- This restricts profile creation to admin panel operations only
CREATE POLICY "Service role can insert profiles"
ON profiles
FOR INSERT
WITH CHECK (auth.role() = 'service_role');

-- Policy 3: Only service role can update profiles
-- This restricts profile updates to admin panel operations only
CREATE POLICY "Service role can update profiles"
ON profiles
FOR UPDATE
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Policy 4: Only service role can delete profiles
-- This restricts profile deletion to admin panel operations only
CREATE POLICY "Service role can delete profiles"
ON profiles
FOR DELETE
USING (auth.role() = 'service_role');

-- Add comment for documentation
COMMENT ON TABLE profiles IS 'Alumni profiles with RLS enabled. Public read, service role write.';
