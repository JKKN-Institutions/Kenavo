# How to Run Migration 009 Manually

## ⚠️ IMPORTANT: Run this AFTER fixing duplicates

Migration 009 changes the UNIQUE constraint from `name` only to `(name, year_graduated)`. If you have duplicate profiles with the same name AND year, the migration will FAIL.

## Steps:

### 1. Detect Duplicates First
```bash
node scripts/detect-duplicate-profiles.js
```

This will show you all duplicate profiles. Review and fix them before proceeding.

### 2. Open Supabase SQL Editor
- Go to https://supabase.com/dashboard/project/YOUR_PROJECT_ID
- Navigate to: **SQL Editor**
- Click: **New Query**

### 3. Copy and Paste Migration SQL
Copy the entire contents of `supabase/migrations/009_update_profiles_unique_constraint.sql` into the SQL editor.

Or copy this directly:

```sql
-- =====================================================
-- MIGRATION 009: Update profiles UNIQUE Constraint
-- =====================================================

-- Step 1: Drop the existing UNIQUE constraint on name
ALTER TABLE profiles
DROP CONSTRAINT IF EXISTS profiles_name_key;

-- Step 2: Add new composite UNIQUE constraint
ALTER TABLE profiles
ADD CONSTRAINT profiles_name_year_unique
UNIQUE (name, year_graduated);

-- Step 3: Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_name_year
ON profiles(name, year_graduated);

COMMENT ON CONSTRAINT profiles_name_year_unique ON profiles IS
'Ensures unique alumni per graduation year - same name allowed in different years';
```

### 4. Run the Migration
- Click **Run** (or press Ctrl+Enter)
- Wait for success message

### 5. Verify Migration
Run this verification query:

```sql
-- Check the new constraint exists
SELECT
    conname AS constraint_name,
    pg_get_constraintdef(c.oid) AS constraint_definition
FROM pg_constraint c
JOIN pg_namespace n ON n.oid = c.connamespace
WHERE conrelid = 'profiles'::regclass
  AND conname = 'profiles_name_year_unique';

-- Check for any duplicates (should return 0 rows)
SELECT
    name,
    year_graduated,
    COUNT(*) as duplicate_count
FROM profiles
WHERE name IS NOT NULL
  AND year_graduated IS NOT NULL
GROUP BY name, year_graduated
HAVING COUNT(*) > 1;
```

### 6. Test CSV Upload
- Go to Admin Panel
- Upload a CSV with existing profile names
- Verify that profiles are UPDATED instead of creating duplicates

## Troubleshooting

### Error: "duplicate key value violates unique constraint"
This means you have duplicate profiles with the same name and year. You MUST fix these first:

1. Run: `node scripts/detect-duplicate-profiles.js`
2. Identify the duplicates
3. Manually merge or delete duplicates in Supabase
4. Then retry the migration

### How to Merge Duplicates Manually
For each duplicate group:
1. Identify the "best" profile (most complete data, most recent)
2. Copy its ID
3. Update foreign key references:
   ```sql
   -- Update gallery images
   UPDATE gallery_images
   SET profile_id = <KEEP_ID>
   WHERE profile_id = <DELETE_ID>;

   -- Update Q&A answers
   UPDATE profile_answers
   SET profile_id = <KEEP_ID>
   WHERE profile_id = <DELETE_ID>;
   ```
4. Delete the duplicate profile:
   ```sql
   DELETE FROM profiles WHERE id = <DELETE_ID>;
   ```
5. Repeat for all duplicates

## Success!
Once migration 009 is applied:
- ✅ Same names allowed in different years
- ✅ Duplicate names in same year blocked
- ✅ CSV uploads will update existing profiles correctly
- ✅ No more duplicate profile issues
