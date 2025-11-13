# 🔧 FIX: User Creation & Login Error

## 🚨 Problem Summary

**Error:** "Invalid email or password" when trying to login with newly created user

**Root Cause:** The `app_users` table was never created in the database. The migration file exists but was never executed.

**What Happened:**
1. Admin tried to create a user via admin panel
2. System created Supabase Auth user successfully ✅
3. System tried to insert into `app_users` table → **FAILED** (table doesn't exist) ❌
4. Error: `PGRST205: Could not find the table 'public.app_users' in the schema cache`
5. Rollback attempted (deleting auth user) → may or may not have succeeded
6. User is now orphaned or partially created
7. Login fails with "Invalid login credentials"

---

## ✅ SOLUTION: 3-Step Fix Process

### Step 1: Check Current Database State
### Step 2: Run the Migration to Create app_users Table
### Step 3: Clean Up Orphaned Users & Test

---

## 📊 Step 1: Check Current Database State

### 1.1 Check if app_users Table Exists

Go to **Supabase Dashboard** → **SQL Editor** and run:

```sql
-- Check if app_users table exists
SELECT EXISTS (
   SELECT FROM information_schema.tables
   WHERE table_schema = 'public'
   AND table_name = 'app_users'
);
```

**Expected Result:** `false` (table doesn't exist)

### 1.2 Check for Orphaned Auth Users

```sql
-- List all users in Supabase Auth
SELECT
  id,
  email,
  created_at,
  confirmed_at,
  last_sign_in_at
FROM auth.users
ORDER BY created_at DESC
LIMIT 20;
```

**Look for:**
- Any test users you created (e.g., rojasundharam2000@..., test@example.com)
- Users created recently but never logged in
- These are likely orphaned users

### 1.3 Save Orphaned User IDs

Note down the `id` and `email` of any orphaned test users. You'll delete these later.

---

## 🗄️ Step 2: Run the Migration to Create app_users Table

### Option A: Via Supabase Dashboard (RECOMMENDED)

1. **Go to Supabase Dashboard** → **SQL Editor**

2. **Open the migration file:**
   - Navigate to: `C:\Users\admin\Projects\KenavoFinal\supabase\migrations\015_create_app_users_table.sql`
   - Copy the entire contents

3. **Paste into SQL Editor and click "RUN"**

   The SQL will:
   - Create `app_users` table
   - Create indexes
   - Enable RLS policies
   - Create trigger for auto-updating timestamps

4. **Verify Success:**
   ```sql
   -- Check table was created
   SELECT * FROM app_users LIMIT 1;
   ```

   **Expected:** Empty result (no error) = Success! ✅

### Option B: Via Supabase CLI

```bash
cd C:\Users\admin\Projects\KenavoFinal
npx supabase db push
```

**Note:** This may fail if you have other pending migrations with errors. Use Option A if CLI fails.

---

## 🧹 Step 3: Clean Up Orphaned Users

### 3.1 Delete Orphaned Auth Users

**⚠️ IMPORTANT:** Only delete test users you created, NOT real admin accounts!

```sql
-- Delete specific orphaned user by email (SAFE)
DELETE FROM auth.users
WHERE email = 'test@example.com';  -- Replace with actual test user email

-- OR delete by ID
DELETE FROM auth.users
WHERE id = 'uuid-here';  -- Replace with actual user ID

-- Verify deletion
SELECT email FROM auth.users WHERE email = 'test@example.com';
-- Should return empty result
```

### 3.2 Verify Database is Clean

```sql
-- Check app_users table exists and is empty
SELECT COUNT(*) FROM app_users;  -- Should be 0

-- Check auth.users for any remaining test users
SELECT email FROM auth.users
WHERE email LIKE '%test%' OR email LIKE '%roja%';
```

---

## ✅ Step 4: Test User Creation & Login

### 4.1 Create a Fresh Test User

1. **Login to admin panel** (http://localhost:3000/admin-panel)
2. **Click "Users" tab**
3. **Click "Add New User"**
4. **Fill in the form:**
   - Email: `testuser@example.com`
   - Username: `testuser`
   - Password: `test12345`
   - Directory Access: ✅ Checked
   - Status: Active
5. **Click "Create User"**

**Expected Result:**
- Success message: "User created successfully!" ✅
- User appears in the user list
- **No 500 error!**

### 4.2 Verify User in Database

```sql
-- Check user was created in app_users table
SELECT * FROM app_users WHERE email = 'testuser@example.com';

-- Expected: One row with has_directory_access = true, status = 'active'
```

### 4.3 Test Login

1. **Logout from admin**
2. **Go to login page** (http://localhost:3000/login)
3. **Login with:**
   - Email: `testuser@example.com`
   - Password: `test12345`
4. **Expected:** Successful login ✅

### 4.4 Test Directory Access

1. **After logging in, navigate to:** http://localhost:3000/directory
2. **Expected:** You can see the directory page ✅
3. **Try clicking on a profile**
4. **Expected:** You can see individual profile details ✅

### 4.5 Test Access Denial

1. **Logout and login as admin**
2. **Go to Users tab**
3. **Edit the test user**
4. **Uncheck "Directory Access"**
5. **Save changes**
6. **Logout and login as test user again**
7. **Try to access:** http://localhost:3000/directory
8. **Expected:** Redirected to access denied page ✅

---

## 🐛 Step 5: If Issues Persist - Additional Debugging

### Issue: Still Getting 500 Error on User Creation

**Check API logs in browser console:**

```javascript
// Look for errors in the Network tab
// POST /api/admin/users should return 201, not 500
```

**Possible causes:**
1. Migration didn't apply correctly
2. RLS policies blocking inserts
3. Service role key not configured

**Fix:**
```sql
-- Temporarily disable RLS to test (RE-ENABLE AFTER!)
ALTER TABLE app_users DISABLE ROW LEVEL SECURITY;

-- Try creating user again via UI

-- Re-enable RLS
ALTER TABLE app_users ENABLE ROW LEVEL SECURITY;
```

### Issue: User Created but Can't Login

**Check auth user exists:**
```sql
SELECT * FROM auth.users WHERE email = 'testuser@example.com';
```

**Check app_users record exists:**
```sql
SELECT * FROM app_users WHERE email = 'testuser@example.com';
```

**Both should return a record.** If one is missing:
- Auth user exists but app_users doesn't → Delete auth user, recreate properly
- app_users exists but auth user doesn't → Delete app_users record, recreate properly

### Issue: Can Login but Directory Access Denied

**Check directory access flag:**
```sql
SELECT email, has_directory_access, status
FROM app_users
WHERE email = 'testuser@example.com';
```

**Should show:**
- `has_directory_access`: `true`
- `status`: `active`

**If not, update:**
```sql
UPDATE app_users
SET has_directory_access = true, status = 'active'
WHERE email = 'testuser@example.com';
```

---

## 📋 Quick Reference: SQL Snippets

### Check Everything is Working

```sql
-- 1. Verify app_users table exists
SELECT tablename FROM pg_tables WHERE tablename = 'app_users';

-- 2. Count users
SELECT
  (SELECT COUNT(*) FROM auth.users) as auth_users,
  (SELECT COUNT(*) FROM app_users) as app_users;

-- 3. List all app users with details
SELECT
  au.email,
  au.username,
  au.has_directory_access,
  au.status,
  au.created_at,
  u.last_sign_in_at
FROM app_users au
LEFT JOIN auth.users u ON au.id = u.id
ORDER BY au.created_at DESC;

-- 4. Find orphaned auth users (in auth but not in app_users)
SELECT
  u.id,
  u.email,
  u.created_at
FROM auth.users u
LEFT JOIN app_users au ON u.id = au.id
WHERE au.id IS NULL
  AND u.email NOT IN ('sroja@jkkn.ac.in', 'automation@jkkn.ac.in');  -- Exclude admins

-- 5. Find orphaned app_users (in app_users but not in auth)
SELECT
  au.id,
  au.email,
  au.created_at
FROM app_users au
LEFT JOIN auth.users u ON au.id = u.id
WHERE u.id IS NULL;
```

### Clean Up All Test Users

```sql
-- ⚠️ DANGEROUS: Only run if you want to delete ALL test data!

-- Delete test users from app_users
DELETE FROM app_users
WHERE email LIKE '%test%' OR email LIKE '%example.com%';

-- Delete test users from auth
DELETE FROM auth.users
WHERE email LIKE '%test%' OR email LIKE '%example.com%';
```

---

## ✅ Success Checklist

After completing all steps, verify:

- [ ] `app_users` table exists in database
- [ ] Can create a new user via admin panel without errors
- [ ] New user appears in Users tab
- [ ] Can login with newly created user
- [ ] Can access `/directory` page when directory access is enabled
- [ ] Cannot access `/directory` when directory access is disabled (shows access denied page)
- [ ] No orphaned users in auth.users or app_users tables
- [ ] Console shows no errors

---

## 🆘 Still Having Issues?

### Check Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
ADMIN_EMAILS=sroja@jkkn.ac.in,automation@jkkn.ac.in
```

### Check Supabase Connection

```bash
# Test Supabase connection
npx supabase status
```

### Review Logs

1. **Browser Console** → Network tab → Check API responses
2. **Supabase Dashboard** → Logs → API Logs
3. **Terminal** → Check Next.js server logs

---

## 📞 Common Error Messages & Fixes

| Error | Cause | Fix |
|-------|-------|-----|
| `PGRST205: Could not find table` | Migration not run | Run Step 2 |
| `Invalid login credentials` | Orphaned auth user | Run Step 3 |
| `relation "app_users" does not exist` | Migration not run | Run Step 2 |
| `duplicate key value` | User already exists | Delete existing user first |
| `permission denied for table` | RLS policy issue | Check service role key is set |

---

## 🎉 Expected Final State

After the fix:

```
✅ Database:
   ├── app_users table exists
   ├── All indexes created
   ├── RLS policies active
   └── Trigger for timestamps working

✅ Users:
   ├── Admins (sroja@jkkn.ac.in, automation@jkkn.ac.in) - unchanged
   ├── Test users in both auth.users AND app_users
   └── No orphaned users

✅ Functionality:
   ├── Can create users via admin panel
   ├── Users can login successfully
   ├── Directory access control working
   └── Access denied page shows for unauthorized users
```

---

**Last Updated:** 2025-11-13
**Issue:** User creation failed due to missing app_users table
**Status:** Ready to fix - follow steps above
