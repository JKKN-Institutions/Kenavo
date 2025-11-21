-- ============================================================================
-- DATABASE DIAGNOSTICS & CLEANUP SCRIPT
-- Kenavo Alumni Directory - User Management System
-- ============================================================================
-- Purpose: Diagnose and fix issues with app_users table and orphaned users
-- Run this in: Supabase Dashboard → SQL Editor
-- ============================================================================

-- ============================================================================
-- SECTION 1: DIAGNOSTICS
-- ============================================================================

-- 1.1 Check if app_users table exists
DO $$
BEGIN
  IF EXISTS (
    SELECT FROM information_schema.tables
    WHERE table_schema = 'public'
    AND table_name = 'app_users'
  ) THEN
    RAISE NOTICE '✅ app_users table EXISTS';
  ELSE
    RAISE NOTICE '❌ app_users table DOES NOT EXIST - MIGRATION REQUIRED!';
  END IF;
END $$;

-- 1.2 Count users in both tables
SELECT
  'User Counts' as check_type,
  (SELECT COUNT(*) FROM auth.users) as auth_users_count,
  CASE WHEN EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'app_users')
    THEN (SELECT COUNT(*) FROM app_users)
    ELSE 0
  END as app_users_count;

-- 1.3 List all auth users
SELECT
  'All Auth Users' as report_type,
  id,
  email,
  created_at,
  confirmed_at,
  last_sign_in_at,
  CASE
    WHEN last_sign_in_at IS NULL THEN '⚠️ Never logged in'
    ELSE '✅ Has logged in'
  END as login_status
FROM auth.users
ORDER BY created_at DESC;

-- 1.4 Find orphaned auth users (exist in auth but not in app_users)
-- Only run if app_users table exists
DO $$
BEGIN
  IF EXISTS (SELECT FROM information_schema.tables WHERE table_name = 'app_users') THEN
    RAISE NOTICE '--- Checking for orphaned auth users ---';
    PERFORM email
    FROM auth.users u
    LEFT JOIN app_users au ON u.id = au.id
    WHERE au.id IS NULL
      AND u.email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');

    IF NOT FOUND THEN
      RAISE NOTICE '✅ No orphaned auth users found';
    ELSE
      RAISE NOTICE '⚠️ Orphaned auth users exist (see query results)';
    END IF;
  END IF;
END $$;

SELECT
  '🚨 Orphaned Auth Users' as report_type,
  u.id,
  u.email,
  u.created_at,
  'User exists in auth.users but not in app_users' as issue
FROM auth.users u
LEFT JOIN app_users au ON u.id = au.id
WHERE au.id IS NULL
  AND u.email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');

-- 1.5 Check RLS policies on app_users (if table exists)
SELECT
  'RLS Policies' as report_type,
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'app_users'
ORDER BY policyname;

-- 1.6 Check indexes on app_users (if table exists)
SELECT
  'Indexes' as report_type,
  indexname,
  indexdef
FROM pg_indexes
WHERE tablename = 'app_users'
ORDER BY indexname;

-- ============================================================================
-- SECTION 2: CLEANUP (COMMENTED OUT FOR SAFETY)
-- ============================================================================

-- ⚠️ UNCOMMENT ONLY WHEN YOU'RE SURE YOU WANT TO DELETE DATA!

-- 2.1 Delete specific orphaned auth user by email
/*
DELETE FROM auth.users
WHERE email = 'test@example.com';  -- ⚠️ REPLACE WITH ACTUAL EMAIL
*/

-- 2.2 Delete orphaned auth user by ID
/*
DELETE FROM auth.users
WHERE id = 'uuid-here';  -- ⚠️ REPLACE WITH ACTUAL USER ID
*/

-- 2.3 Delete ALL test users (DANGEROUS!)
/*
-- Delete from app_users first (if table exists)
DELETE FROM app_users
WHERE email LIKE '%test%' OR email LIKE '%example.com%';

-- Then delete from auth
DELETE FROM auth.users
WHERE email LIKE '%test%' OR email LIKE '%example.com%'
  AND email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');
*/

-- 2.4 Delete ALL orphaned auth users (DANGEROUS!)
/*
DELETE FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM app_users au WHERE au.id = u.id
)
AND u.email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');
*/

-- ============================================================================
-- SECTION 3: VERIFICATION QUERIES
-- ============================================================================

-- 3.1 Verify app_users table structure (if exists)
SELECT
  'Table Structure' as report_type,
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'app_users'
ORDER BY ordinal_position;

-- 3.2 Check for data consistency
-- Users should exist in BOTH auth.users AND app_users
SELECT
  'Data Consistency Check' as report_type,
  COALESCE(au.email, u.email) as email,
  CASE WHEN u.id IS NOT NULL THEN '✅' ELSE '❌' END as in_auth,
  CASE WHEN au.id IS NOT NULL THEN '✅' ELSE '❌' END as in_app_users,
  CASE
    WHEN u.id IS NOT NULL AND au.id IS NOT NULL THEN '✅ Consistent'
    WHEN u.id IS NOT NULL AND au.id IS NULL THEN '⚠️ Orphaned in auth.users'
    WHEN u.id IS NULL AND au.id IS NOT NULL THEN '⚠️ Orphaned in app_users'
    ELSE '❓ Unknown state'
  END as status
FROM auth.users u
FULL OUTER JOIN app_users au ON u.id = au.id
WHERE u.email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in')
   OR au.email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in')
   OR (u.email IS NULL AND au.email IS NULL)
ORDER BY COALESCE(au.created_at, u.created_at) DESC;

-- 3.3 List all app_users with full details (if table exists)
SELECT
  'App Users Details' as report_type,
  au.*,
  u.last_sign_in_at,
  u.confirmed_at
FROM app_users au
LEFT JOIN auth.users u ON au.id = u.id
ORDER BY au.created_at DESC;

-- ============================================================================
-- SECTION 4: MIGRATION STATUS CHECK
-- ============================================================================

-- 4.1 Check all migrations applied
SELECT
  'Migration Status' as report_type,
  *
FROM supabase_migrations.schema_migrations
ORDER BY version DESC
LIMIT 20;

-- 4.2 Check if specific migration was applied
SELECT
  'app_users Migration Status' as report_type,
  CASE WHEN EXISTS (
    SELECT FROM supabase_migrations.schema_migrations
    WHERE version >= '20250000000000'  -- Approximate timestamp for recent migrations
  ) THEN '✅ Recent migrations applied'
  ELSE '⚠️ No recent migrations found'
  END as status;

-- ============================================================================
-- SECTION 5: QUICK FIX QUERIES
-- ============================================================================

-- 5.1 If you need to manually sync an orphaned auth user to app_users
-- (Only use if user exists in auth but not in app_users)
/*
INSERT INTO app_users (id, email, username, has_directory_access, status, created_by)
SELECT
  id,
  email,
  NULL as username,  -- or set a username
  true as has_directory_access,
  'active' as status,
  NULL as created_by  -- or set to admin user ID
FROM auth.users
WHERE email = 'test@example.com'  -- ⚠️ REPLACE WITH ACTUAL EMAIL
AND NOT EXISTS (SELECT 1 FROM app_users WHERE email = 'test@example.com');
*/

-- 5.2 Update directory access for a specific user
/*
UPDATE app_users
SET has_directory_access = true,  -- or false to deny
    status = 'active'
WHERE email = 'test@example.com';  -- ⚠️ REPLACE WITH ACTUAL EMAIL
*/

-- ============================================================================
-- SECTION 6: EMERGENCY RESET (NUCLEAR OPTION)
-- ============================================================================

-- ⚠️⚠️⚠️ ONLY USE THIS IF YOU WANT TO START COMPLETELY FRESH ⚠️⚠️⚠️
-- This will DELETE ALL non-admin users!

/*
-- Step 1: Delete all app_users except admins
DELETE FROM app_users
WHERE email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');

-- Step 2: Delete all auth users except admins
DELETE FROM auth.users
WHERE email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');

-- Step 3: Verify cleanup
SELECT 'Remaining Auth Users' as type, COUNT(*) as count FROM auth.users
UNION ALL
SELECT 'Remaining App Users' as type, COUNT(*) as count FROM app_users;
*/

-- ============================================================================
-- END OF DIAGNOSTICS SCRIPT
-- ============================================================================

-- INSTRUCTIONS:
-- 1. Run SECTION 1 to diagnose the current state
-- 2. Review the output to identify issues
-- 3. If needed, uncomment and run specific cleanup queries from SECTION 2
-- 4. Run SECTION 3 to verify the fixes worked
-- 5. Check SECTION 4 to see migration status

-- REMINDER:
-- - Always backup your database before running DELETE statements
-- - Test cleanup queries with SELECT first before running DELETE
-- - The migration must be run BEFORE creating users
