-- ============================================================================
-- STEP 2: CLEANUP ORPHANED USERS
-- Run this AFTER SIMPLE_FIX.sql completes successfully
-- ============================================================================

-- First, check what users exist
SELECT
  'Current users in auth.users' as info,
  email,
  created_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC;

-- ============================================================================
-- CLEANUP OPTIONS (Uncomment ONE option below)
-- ============================================================================

-- OPTION 1: Delete specific test user by email (SAFEST)
-- Uncomment and replace email, then run:
/*
DELETE FROM auth.users
WHERE email = 'rojasundharam2000@gmail.com';
*/

-- OPTION 2: Delete all test/roja/example users at once
-- Uncomment to run:
/*
DELETE FROM auth.users
WHERE (email LIKE '%test%' OR email LIKE '%roja%' OR email LIKE '%example%')
  AND email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');
*/

-- OPTION 3: Delete ALL orphaned users (exist in auth but not in app_users)
-- Uncomment to run:
/*
DELETE FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM app_users au WHERE au.id = u.id
)
AND u.email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');
*/

-- ============================================================================
-- After cleanup, verify only admin users remain
-- ============================================================================
SELECT
  'Remaining users after cleanup' as info,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;
