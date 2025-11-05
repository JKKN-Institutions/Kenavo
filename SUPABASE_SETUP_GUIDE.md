# Supabase Setup Guide - Apply Security Migrations

## 🎯 Overview
This guide will walk you through applying the 3 critical security migrations to your Supabase database.

**Time Required:** 10-15 minutes
**Difficulty:** Easy (Copy & Paste)

---

## 📋 Prerequisites

✅ Access to Supabase Dashboard
✅ Your project URL (already in `.env.local`)
✅ Admin access to the project

---

## 🚀 Step-by-Step Instructions

### Step 1: Open Supabase SQL Editor

1. Go to: https://supabase.com/dashboard
2. Select your project
3. Click **SQL Editor** in the left sidebar
4. Click **New Query** button

---

### Step 2: Apply Migration 005 - Profiles RLS

**What this does:** Secures the profiles table with Row Level Security

**Copy and paste this SQL:**

```sql
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
```

**Click "Run" button** (or press Ctrl+Enter / Cmd+Enter)

**Expected Result:**
✅ "Success. No rows returned"

**If you see an error:**
- "policy already exists" → That's OK, skip to next migration
- "table does not exist" → Check your database connection
- Other errors → Copy error and ask for help

---

### Step 3: Apply Migration 006 - Q&A Tables RLS

**What this does:** Strengthens security on profile_questions and profile_answers tables

**Copy and paste this SQL:**

```sql
-- Migration: Strengthen RLS policies for profile_questions and profile_answers tables
-- Purpose: Change from generic 'authenticated' to 'service_role' only for write operations
-- This prevents any authenticated user from modifying questions and answers

-- ============================================
-- PROFILE_QUESTIONS TABLE
-- ============================================

-- Drop existing weak policies
DROP POLICY IF EXISTS "Admins can manage questions" ON profile_questions;

-- Keep public read policy (it's correctly configured)
-- CREATE POLICY "Public can view active questions" ON profile_questions FOR SELECT USING (is_active = true);
-- (This policy already exists from migration 002, no need to recreate)

-- Create strict write policy for service role only
CREATE POLICY "Service role can manage questions"
ON profile_questions
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- PROFILE_ANSWERS TABLE
-- ============================================

-- Drop existing weak policies
DROP POLICY IF EXISTS "Admins can manage answers" ON profile_answers;

-- Keep public read policy (it's correctly configured)
-- CREATE POLICY "Public can view all answers" ON profile_answers FOR SELECT USING (true);
-- (This policy already exists from migration 003, no need to recreate)

-- Create strict write policy for service role only
CREATE POLICY "Service role can manage answers"
ON profile_answers
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE profile_questions IS 'Profile questions with RLS. Public read active questions, service role write.';
COMMENT ON TABLE profile_answers IS 'Profile answers with RLS. Public read all, service role write.';
```

**Click "Run" button**

**Expected Result:**
✅ "Success. No rows returned"

---

### Step 4: Apply Migration 007 - Storage Policies

**What this does:** Secures the profile-images storage bucket

**Copy and paste this SQL:**

```sql
-- Migration: Create storage bucket and policies for profile images
-- Purpose: Secure the profile-images bucket with proper access control
-- Public read access, admin-only write/delete

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ============================================
-- STORAGE POLICIES FOR profile-images BUCKET
-- ============================================

-- Policy 1: Allow public read access to all images
-- This enables the directory and profile pages to display images
CREATE POLICY "Public can view profile images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');

-- Policy 2: Allow service role to upload images
-- This restricts image uploads to admin panel operations only
CREATE POLICY "Service role can upload profile images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.role() = 'service_role'
);

-- Policy 3: Allow service role to update images
-- This restricts image updates to admin panel operations only
CREATE POLICY "Service role can update profile images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images'
  AND auth.role() = 'service_role'
)
WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.role() = 'service_role'
);

-- Policy 4: Allow service role to delete images
-- This restricts image deletion to admin panel operations only
CREATE POLICY "Service role can delete profile images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images'
  AND auth.role() = 'service_role'
);

-- Add comment for documentation
COMMENT ON TABLE storage.buckets IS 'Storage buckets. profile-images bucket is public with service role write access.';
```

**Click "Run" button**

**Expected Result:**
✅ "Success. No rows returned"

**Note:** If you see "policy already exists", that's fine - it means the policy is already set up.

---

## ✅ Step 5: Verify Migrations

**Check RLS is enabled on all tables:**

```sql
SELECT
  tablename,
  rowsecurity as rls_enabled
FROM pg_tables
WHERE schemaname = 'public'
AND tablename IN ('profiles', 'profile_questions', 'profile_answers')
ORDER BY tablename;
```

**Expected Result:**

| tablename | rls_enabled |
|-----------|-------------|
| profile_answers | true |
| profile_questions | true |
| profiles | true |

**Check policies exist:**

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  cmd as command
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename, policyname;
```

You should see multiple policies for each table.

**Check storage bucket exists:**

```sql
SELECT id, name, public
FROM storage.buckets
WHERE id = 'profile-images';
```

**Expected Result:**

| id | name | public |
|----|------|--------|
| profile-images | profile-images | true |

---

## 🧪 Step 6: Test Security

### Test 1: API Security (Optional)

Open a new browser incognito window and try to access:
```
https://your-domain.com/api/admin/list-profiles
```

**Expected Result:** 401 Unauthorized or redirect to login

### Test 2: Admin Panel (Required)

1. Log in to your admin panel
2. Try to edit a profile
3. Change the bio or name
4. Click Save

**Expected Result:** "Profile updated successfully"

---

## 🎉 Step 7: Test Real-Time Updates

**This is the main feature test!**

1. Open a profile page in a new tab: `https://your-domain.com/directory/john-doe`
2. Note the current bio text
3. Go to admin panel in another tab
4. Edit that profile's bio to something different
5. Click Save
6. Go back to the profile page tab
7. Refresh the page (or click the link again)

**Expected Result:** ✅ New bio appears immediately!

---

## 🐛 Troubleshooting

### Error: "permission denied for table profiles"
**Solution:** You don't have sufficient database permissions. Contact your Supabase project admin.

### Error: "policy already exists"
**Solution:** That's OK! The policy was already created. Continue to next migration.

### Error: "relation does not exist"
**Solution:** The table wasn't created yet. Run the schema migrations first:
- `supabase/migrations/002_create_profile_questions_table.sql`
- `supabase/migrations/003_create_profile_answers_table.sql`

### Updates still not appearing instantly
**Solution:**
1. Check browser console for errors
2. Clear browser cache
3. Try in incognito mode
4. Check that migrations were applied successfully

### Storage policy errors
**Solution:** Check Storage settings in Supabase Dashboard:
- Go to Storage → Policies
- Ensure profile-images bucket exists
- Verify policies are listed

---

## 📊 Success Criteria

After completing all steps, you should have:

- ✅ RLS enabled on profiles, profile_questions, profile_answers
- ✅ 4 policies on profiles table
- ✅ 2+ policies on profile_questions table
- ✅ 2+ policies on profile_answers table
- ✅ profile-images bucket with 4 storage policies
- ✅ Admin panel works without errors
- ✅ Profile updates appear instantly on public pages

---

## 🆘 Need Help?

If you encounter issues:

1. **Check SQL Editor output** - Look for specific error messages
2. **Review existing policies** - Use the verification queries above
3. **Check Supabase logs** - Dashboard → Logs → Database
4. **Test with service role key** - Ensure env variables are correct

---

## 📝 Migration Log

Record your progress:

- [ ] Migration 005 applied (Profiles RLS)
- [ ] Migration 006 applied (Q&A RLS)
- [ ] Migration 007 applied (Storage policies)
- [ ] Verification queries run
- [ ] Security tests passed
- [ ] Real-time updates tested and working

---

**Date Completed:** _______________
**Verified By:** _______________
**Notes:** _______________
