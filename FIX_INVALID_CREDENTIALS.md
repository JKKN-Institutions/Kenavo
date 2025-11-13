# 🔧 Fix "Invalid Login Credentials" Error

## Error Details
```
AuthApiError: Invalid login credentials
at signInWithPassword (lib/auth/client.ts:39:27)
```

## Root Cause
The user might exist in `app_users` table but:
- ❌ NOT in `auth.users` table (auth user was deleted/failed to create)
- ❌ OR password doesn't match
- ❌ OR email not confirmed

---

## ✅ Quick Fix (Recommended)

### **Option 1: Delete and Recreate User (Simplest)**

This is the cleanest solution - start fresh.

**Step 1: Run this in Supabase SQL Editor:**

```sql
-- Delete testuser completely
DELETE FROM app_users WHERE email = 'testuser@example.com';
DELETE FROM auth.users WHERE email = 'testuser@example.com';

-- Verify deletion
SELECT 'User deleted - ready for fresh creation' as status;
```

**Step 2: Create user via Admin Panel:**

1. Go to: http://localhost:3000/admin-panel
2. Click "Users" tab
3. Click "Add New User"
4. Fill in:
   - Email: `testuser@example.com`
   - Username: `testuser`
   - Password: `Test123!` (use a NEW password you'll remember)
   - ✅ Directory Access: CHECKED
   - Status: Active
5. Click "Create User"
6. Should see success message

**Step 3: Test Login:**

1. Go to: http://localhost:3000/login
2. Login with: `testuser@example.com` / `Test123!`
3. Should work! ✅

---

## 🔍 Diagnosis First (If You Want Details)

**Run this in Supabase SQL Editor to see what's wrong:**

```sql
-- Check user status
SELECT
  'User Status' as check_type,
  COALESCE(au.email, u.email) as email,
  CASE WHEN u.id IS NOT NULL THEN '✅ In auth.users' ELSE '❌ NOT in auth.users' END as auth_status,
  CASE WHEN au.id IS NOT NULL THEN '✅ In app_users' ELSE '❌ NOT in app_users' END as app_status,
  CASE
    WHEN u.id IS NULL THEN '❌ User does not exist in auth - Need to recreate'
    WHEN au.id IS NULL THEN '⚠️ User in auth but not app_users - Need to sync'
    WHEN u.encrypted_password IS NULL THEN '❌ No password set'
    WHEN u.email_confirmed_at IS NULL THEN '⚠️ Email not confirmed'
    ELSE '✅ Should work (might be password mismatch)'
  END as diagnosis
FROM auth.users u
FULL OUTER JOIN app_users au ON u.id = au.id
WHERE COALESCE(u.email, au.email) = 'testuser@example.com';
```

---

## 🔧 Targeted Fixes Based on Diagnosis

### **Scenario A: User NOT in auth.users (only in app_users)**

**Problem:** Auth user was deleted but app_users record remains

**Fix:**
```sql
-- Delete orphaned app_users record
DELETE FROM app_users WHERE email = 'testuser@example.com';

-- Then create user again via admin panel
```

### **Scenario B: User in auth.users but NOT in app_users**

**Problem:** User creation failed at app_users insert step

**Fix:**
```sql
-- Manually add to app_users
INSERT INTO app_users (id, email, has_directory_access, status)
SELECT id, email, true, 'active'
FROM auth.users
WHERE email = 'testuser@example.com'
ON CONFLICT (id) DO UPDATE
SET has_directory_access = true, status = 'active';

-- Verify
SELECT * FROM app_users WHERE email = 'testuser@example.com';
```

### **Scenario C: User exists in both but password doesn't work**

**Problem:** Password mismatch or you forgot the password

**Fix - Reset Password via SQL:**

You can't see the actual password in the database (it's encrypted), but you can reset it:

```sql
-- Get the user ID
SELECT id FROM auth.users WHERE email = 'testuser@example.com';
-- Copy the ID (looks like: 963ade85-b62d-488f-833b-289cce7215e1)
```

Then use this API approach or just delete and recreate (easier).

**OR just delete and recreate (recommended):**
```sql
DELETE FROM app_users WHERE email = 'testuser@example.com';
DELETE FROM auth.users WHERE email = 'testuser@example.com';
-- Then create via admin panel with known password
```

### **Scenario D: Email not confirmed**

**Problem:** Email confirmation is pending

**Fix:**
```sql
-- Manually confirm email
UPDATE auth.users
SET
  email_confirmed_at = NOW(),
  confirmed_at = NOW()
WHERE email = 'testuser@example.com';

-- Verify
SELECT email, email_confirmed_at, confirmed_at
FROM auth.users
WHERE email = 'testuser@example.com';
```

---

## ⚡ Super Quick Fix (Copy-Paste Solution)

If you just want it to work RIGHT NOW:

**1. Copy and run this:**

```sql
-- Clean slate
DELETE FROM app_users WHERE email = 'testuser@example.com';
DELETE FROM auth.users WHERE email = 'testuser@example.com';
```

**2. Create user in admin panel:**
- Email: `testuser@example.com`
- Password: `Test123!` (or whatever you want)
- ✅ Directory Access checked

**3. Login:**
- Email: `testuser@example.com`
- Password: `Test123!`

**Done!** ✅

---

## 🎯 Why This Happens

When you create a user via admin panel, this process happens:

```
1. Create auth.users record ✅ or ❌
2. Create app_users record ✅ or ❌
3. If step 2 fails, rollback step 1 ✅ or ❌
```

Sometimes:
- Rollback fails → auth user remains but app_users fails
- Rollback succeeds → both deleted, but you see success message
- Password mismatch → everything created but password is different than expected

**Solution:** Delete everything and start fresh = guaranteed consistency

---

## 📋 Verification Checklist

After fix, verify:

```sql
-- Should return ONE row with all ✅
SELECT
  u.email,
  CASE WHEN u.id IS NOT NULL THEN '✅' ELSE '❌' END as in_auth,
  CASE WHEN au.id IS NOT NULL THEN '✅' ELSE '❌' END as in_app_users,
  CASE WHEN u.encrypted_password IS NOT NULL THEN '✅' ELSE '❌' END as has_password,
  CASE WHEN u.email_confirmed_at IS NOT NULL THEN '✅' ELSE '❌' END as confirmed
FROM auth.users u
INNER JOIN app_users au ON u.id = au.id
WHERE u.email = 'testuser@example.com';
```

**Expected output:**
```
email                 | in_auth | in_app_users | has_password | confirmed
testuser@example.com  |    ✅   |      ✅      |      ✅      |    ✅
```

---

## 🆘 Still Not Working?

### Check Environment Variables

Make sure in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=your_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

### Restart Dev Server

```bash
# Stop current server (Ctrl+C)
npm run dev
```

### Clear Browser Cache

- Press: `Ctrl + Shift + Delete`
- Clear cache and cookies
- Or use Incognito mode

---

## 💡 Best Practice Going Forward

**When creating test users:**

1. Use a consistent, memorable password (e.g., `Test123!`)
2. Write it down immediately
3. Test login right after creation
4. If it fails, delete and recreate immediately

**Password Requirements:**
- Minimum 6 characters
- Can include letters, numbers, special chars
- No maximum length

---

## 🎉 Expected Result After Fix

1. ✅ User exists in both auth.users AND app_users
2. ✅ Password works
3. ✅ Email confirmed
4. ✅ Can login successfully
5. ✅ Redirects to /directory
6. ✅ Can view directory and profiles
7. ✅ No more "Invalid credentials" error

---

**Bottom Line:** Delete the user completely and recreate via admin panel. This is the cleanest, fastest fix. 🚀
