# Database Cleanup Steps - Manual SQL Guide

This guide provides the SQL commands needed to complete the database cleanup for re-uploading fresh data.

## Prerequisites
- Access to Supabase Dashboard
- SQL Editor access in Supabase

---

## Step 1: Clear All Q&A Answers

**Purpose**: Remove all Q&A responses from individual profile pages

**SQL to run in Supabase SQL Editor:**

```sql
-- Clear all Q&A answers (keeps questions and profiles)
TRUNCATE TABLE profile_answers;

-- Verify deletion
SELECT COUNT(*) FROM profile_answers;
-- Should return: 0
```

**What this does:**
- Deletes all rows from `profile_answers` table
- Keeps the `profile_questions` table (10 master questions)
- Profile pages will no longer show Q&A until re-uploaded

---

## Step 2: Update year_graduated Column Format

**Purpose**: Allow batch year format like "1993-2000" from CSV upload

**SQL to run in Supabase SQL Editor:**

```sql
-- Change column type from VARCHAR(4) to VARCHAR(20)
ALTER TABLE profiles
  ALTER COLUMN year_graduated TYPE VARCHAR(20);

-- Add helpful comment
COMMENT ON COLUMN profiles.year_graduated
  IS 'Year graduated or batch years (e.g., "2007" or "1993-2000")';

-- Verify change
SELECT column_name, data_type, character_maximum_length
FROM information_schema.columns
WHERE table_name = 'profiles'
  AND column_name = 'year_graduated';
-- Should show: character_maximum_length = 20
```

**What this does:**
- Expands `year_graduated` column from 4 to 20 characters
- Now accepts formats like:
  - `"2007"` (single year)
  - `"1993-2000"` (batch years)
  - `"2002-2007"` (batch years)

---

## Step 3: Verification Queries

**Check profiles table:**
```sql
-- Should show only id and name have values, rest are NULL
SELECT id, name, email, location, year_graduated, current_job, profile_image_url
FROM profiles
LIMIT 5;
```

**Check Q&A tables:**
```sql
-- Should return 0 (answers cleared)
SELECT COUNT(*) FROM profile_answers;

-- Should return 10 (questions preserved)
SELECT COUNT(*) FROM profile_questions;
```

**Check gallery (should be untouched):**
```sql
SELECT COUNT(*) FROM gallery_albums;  -- Should be 6
SELECT COUNT(*) FROM gallery_images;  -- Should be 21
```

---

## Alternative: Run Scripts Instead

If you prefer using Node.js scripts instead of SQL:

### 1. Clear Q&A Answers:
```bash
node scripts/cleanup-qa-answers.js
```

### 2. Verify Cleanup:
```bash
node scripts/verify-cleanup.js
```

---

## Expected Final State

After running all cleanup:

| Table | Count | Fields with Data |
|-------|-------|-----------------|
| `profiles` | 151 | Only `id`, `name`, `created_at`, `updated_at` |
| `profile_questions` | 10 | All fields (preserved) |
| `profile_answers` | 0 | Empty (cleared) |
| `gallery_albums` | 6 | All fields (untouched) |
| `gallery_images` | 21 | All fields (untouched) |

---

## What to Upload Next

After cleanup is complete, you can upload:

1. **Complete Slambook CSV** with:
   - Profile details (name, email, phone, location, job, company, bio, etc.)
   - Year graduated in format like "1993-2000"
   - Q&A answers (all 10 questions)

2. **Profile Images** via bulk ZIP upload:
   - Format: `{profile_id}.jpg` (e.g., `123.jpg`)
   - Or: `Img-{Name}.jpg` (e.g., `Img-John-Doe.jpg`)

---

## Troubleshooting

### Error: "Could not find table 'profile_answers'"
- The table might be named differently
- Check table names in Supabase Dashboard → Table Editor
- Possible alternative names: `profile_qa_responses`, `qa_answers`, `slambook_responses`

### Error: "Permission denied"
- Ensure you're using the Service Role Key (not Anon Key)
- Check RLS policies on the tables
- You may need to run SQL as database owner in SQL Editor

### Verification Failed
If verification shows data still exists:
- Try running `TRUNCATE` instead of `DELETE`
- Check for triggers that might be preventing deletion
- Use Supabase Dashboard → Table Editor to manually verify

---

## Need Help?

If you encounter issues:
1. Check Supabase logs in Dashboard → Database → Logs
2. Verify your Service Role Key is correct in `.env.local`
3. Try running SQL commands directly in Supabase SQL Editor
