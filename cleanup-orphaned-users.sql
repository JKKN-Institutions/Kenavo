-- ============================================================================
-- CLEANUP ORPHANED USERS
-- Run AFTER the migration is successful
-- ============================================================================

-- Step 1: Check for orphaned auth users
SELECT
  '🔍 Orphaned Auth Users (in auth but not in app_users)' as check_type,
  u.id,
  u.email,
  u.created_at,
  CASE
    WHEN u.email IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in') THEN '⚠️ ADMIN - DO NOT DELETE'
    ELSE '✅ Safe to delete'
  END as safety_check
FROM auth.users u
LEFT JOIN app_users au ON u.id = au.id
WHERE au.id IS NULL
ORDER BY u.created_at DESC;

-- Step 2: List all test/roja users
SELECT
  '🔍 Test Users to Clean Up' as check_type,
  id,
  email,
  created_at
FROM auth.users
WHERE (email LIKE '%test%' OR email LIKE '%roja%' OR email LIKE '%example%')
  AND email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in')
ORDER BY created_at DESC;

-- ============================================================================
-- CLEANUP ACTIONS (Uncomment to execute)
-- ============================================================================

-- Option 1: Delete specific user by email (SAFEST)
/*
DELETE FROM auth.users
WHERE email = 'rojasundharam2000@gmail.com';  -- Replace with actual email
*/

-- Option 2: Delete all test users at once
/*
DELETE FROM auth.users
WHERE (email LIKE '%test%' OR email LIKE '%roja%' OR email LIKE '%example%')
  AND email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');
*/

-- Option 3: Delete ALL orphaned users (not in app_users)
/*
DELETE FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM app_users au WHERE au.id = u.id
)
AND u.email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');
*/

-- ============================================================================
-- VERIFICATION
-- ============================================================================

-- After cleanup, verify results
SELECT
  '✅ Remaining Users' as status,
  COUNT(*) as total_auth_users,
  (SELECT COUNT(*) FROM app_users) as total_app_users
FROM auth.users;

-- Should show only admin users if you deleted all test users
SELECT
  '✅ Auth Users List' as status,
  email,
  created_at
FROM auth.users
ORDER BY created_at DESC;
