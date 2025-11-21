-- ============================================================================
-- DIAGNOSE AND FIX AUTHENTICATION ISSUE
-- Run this in Supabase SQL Editor
-- ============================================================================

-- Step 1: Check if user exists in both auth.users AND app_users
SELECT
  'User Status Check' as check_type,
  COALESCE(au.email, u.email) as email,
  CASE WHEN u.id IS NOT NULL THEN '✅' ELSE '❌' END as in_auth_users,
  CASE WHEN au.id IS NOT NULL THEN '✅' ELSE '❌' END as in_app_users,
  u.encrypted_password IS NOT NULL as has_password,
  u.email_confirmed_at,
  u.confirmed_at,
  CASE
    WHEN u.id IS NULL THEN '❌ NOT in auth.users - Need to recreate'
    WHEN au.id IS NULL THEN '❌ NOT in app_users - Need to sync'
    WHEN u.encrypted_password IS NULL THEN '❌ No password set'
    WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email not confirmed'
    ELSE '✅ Should work'
  END as diagnosis
FROM auth.users u
FULL OUTER JOIN app_users au ON u.id = au.id
WHERE COALESCE(u.email, au.email) = 'testuser@example.com';

-- Step 2: Check password confirmation status for the user
SELECT
  'Password Status' as check_type,
  email,
  encrypted_password IS NOT NULL as has_encrypted_password,
  email_confirmed_at IS NOT NULL as email_confirmed,
  confirmed_at IS NOT NULL as account_confirmed,
  last_sign_in_at,
  created_at
FROM auth.users
WHERE email = 'testuser@example.com';

-- ============================================================================
-- FIXES (Uncomment based on diagnosis above)
-- ============================================================================

-- FIX 1: If user is NOT in auth.users (only in app_users)
-- This means auth user was deleted but app_users record remains
-- Solution: Delete from app_users and recreate user via admin panel
/*
DELETE FROM app_users WHERE email = 'testuser@example.com';
-- Then go to admin panel and create user again
*/

-- FIX 2: If user IS in auth.users but NOT in app_users
-- This means the user creation failed at the app_users insert step
-- Solution: Manually insert into app_users
/*
INSERT INTO app_users (id, email, has_directory_access, status)
SELECT
  id,
  email,
  true,
  'active'
FROM auth.users
WHERE email = 'testuser@example.com'
ON CONFLICT (id) DO UPDATE
SET has_directory_access = true, status = 'active';
*/

-- FIX 3: If user exists in both but password doesn't work
-- This means password mismatch or not confirmed
-- Solution: Reset the user's password via Supabase Auth Admin
/*
-- You'll need to do this via admin panel or update password
-- Cannot reset password directly via SQL for security
*/

-- FIX 4: NUCLEAR OPTION - Delete everything and start fresh
-- Use this if nothing else works
/*
-- Delete from app_users first
DELETE FROM app_users WHERE email = 'testuser@example.com';

-- Delete from auth.users
DELETE FROM auth.users WHERE email = 'testuser@example.com';

-- Verify deletion
SELECT 'Deleted - Ready for fresh creation' as status;

-- Now go to admin panel and create user again with known password
*/

-- ============================================================================
-- VERIFICATION QUERIES
-- ============================================================================

-- After applying fix, verify everything is correct
SELECT
  'Final Verification' as status,
  u.email,
  u.id,
  au.email as app_email,
  au.has_directory_access,
  au.status,
  u.encrypted_password IS NOT NULL as has_password,
  u.email_confirmed_at IS NOT NULL as email_confirmed,
  CASE
    WHEN u.id IS NOT NULL AND au.id IS NOT NULL AND u.encrypted_password IS NOT NULL AND u.email_confirmed_at IS NOT NULL
    THEN '✅ Ready to login'
    ELSE '❌ Still has issues'
  END as ready_status
FROM auth.users u
INNER JOIN app_users au ON u.id = au.id
WHERE u.email = 'testuser@example.com';
