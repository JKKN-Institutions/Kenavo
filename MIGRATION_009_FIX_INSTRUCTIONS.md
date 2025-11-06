# ✅ Migration 009 Error Fixed - Instructions

## 🔍 What Was Wrong

You got this error:
```
ERROR: 42P07: relation "profiles_name_year_unique" already exists
```

**Cause**: Migration 009 was run previously but failed partway through. The constraint already exists in the database, but the original SQL tried to create it again without checking.

**Your cleanup was successful**: 150 profiles → 146 profiles (4 duplicates removed) ✅

---

## 🚀 Quick Fix (3 Steps)

### **Step 1: Run the Fixed Migration**

1. Open **Supabase SQL Editor**: https://supabase.com/dashboard
2. Go to your project → **SQL Editor** → **New Query**
3. Open this file: **`RUN_THIS_IN_SUPABASE.sql`** (in project root)
4. Copy **ALL** the contents
5. Paste into Supabase SQL Editor
6. Click **Run** (Ctrl+Enter)

**Expected Result**:
- ✅ "Old constraint already dropped" (it was already done)
- ✅ "New constraint already exists" (skipping, already created)
- ✅ Table showing `profiles_name_year_unique` constraint
- ✅ Empty result for duplicates (0 rows)

### **Step 2: Verify Migration**

Run the verification script (optional but recommended):

1. Open: **`scripts/verify-migration-009.sql`**
2. Copy and paste into Supabase SQL Editor
3. Click **Run**

**Expected Output**:
- ✅ New constraint exists
- ✅ Old constraint removed
- ✅ Index created
- ✅ 146 profiles total
- ✅ 0 duplicate groups
- ✅ "MIGRATION 009 COMPLETE AND SUCCESSFUL"

### **Step 3: Test CSV Upload**

1. Start dev server: `npm run dev`
2. Go to: http://localhost:3000/admin-panel
3. Upload your CSV: `Kevavo2kSlambookRecord - Sheet1 (1).csv`

**Expected Result**:
- ✅ "Updated 4 existing profiles" (NOT "Created 4 new profiles")
- ✅ No duplicate profiles created
- ✅ Frontend shows CORRECT data (not "test" data)

---

## 📁 Files Created for You

### **Ready to Use:**
1. **`RUN_THIS_IN_SUPABASE.sql`** ⭐ **START HERE!**
   - Simple, clean SQL to copy-paste
   - Safe to run multiple times
   - Fixes the migration error

### **Verification:**
2. **`scripts/verify-migration-009.sql`**
   - Complete verification queries
   - Checks constraints, duplicates, indexes
   - Gives detailed status report

### **Updated Migration Files:**
3. **`supabase/migrations/009_update_profiles_unique_constraint.sql`**
   - Updated to be idempotent (safe to re-run)
   - Has IF EXISTS checks
   - Won't fail if constraint already exists

4. **`supabase/migrations/009_update_profiles_unique_constraint_idempotent.sql`**
   - Full version with detailed comments
   - Includes extensive verification queries
   - Use for reference or future migrations

---

## 🎯 What Changed

### **Before (Not Idempotent):**
```sql
-- This would fail on second run!
ALTER TABLE profiles
ADD CONSTRAINT profiles_name_year_unique
UNIQUE (name, year_graduated);
```

### **After (Idempotent):**
```sql
-- This checks first - safe to run multiple times!
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'profiles_name_year_unique'
    ) THEN
        ALTER TABLE profiles ADD CONSTRAINT profiles_name_year_unique
        UNIQUE (name, year_graduated);
    ELSE
        RAISE NOTICE 'Constraint already exists (skipping)';
    END IF;
END $$;
```

---

## ✅ Success Checklist

After running the fixed migration:

- [ ] No errors in Supabase SQL Editor
- [ ] Constraint `profiles_name_year_unique` exists
- [ ] Old constraint `profiles_name_key` removed
- [ ] Index `idx_profiles_name_year` created
- [ ] 0 duplicate profiles in database
- [ ] CSV upload shows "Updated" not "Created"
- [ ] Frontend displays correct data

---

## 🆘 Troubleshooting

### **Still getting constraint error?**
The constraint definitely already exists. Just run `RUN_THIS_IN_SUPABASE.sql` - it will skip the constraint creation and just verify everything.

### **Duplicates found after migration?**
Run the cleanup script again:
```bash
node scripts/generate-cleanup-sql.js
# Then run the generated cleanup-duplicates.sql in Supabase
```

### **CSV upload still creates new profiles?**
1. Verify migration completed: Run `scripts/verify-migration-009.sql`
2. Check code changes are active: Restart dev server
3. Clear browser cache: Hard refresh (Ctrl+Shift+R)

---

## 📊 What This Migration Does

**Old Constraint:**
- `UNIQUE (name)` - Only ONE "John Smith" allowed in entire database
- Problem: Can't have "John Smith (1995)" and "John Smith (2000)"

**New Constraint:**
- `UNIQUE (name, year_graduated)` - One person per name+year combination
- Allows: "John Smith (1995)" and "John Smith (2000)" ✅
- Prevents: Two "John Smith (2000)" profiles ❌

**Result:**
- CSV uploads will now UPDATE existing profiles instead of creating duplicates
- Same names allowed in different graduation years
- Duplicate prevention for same name + same year

---

## 🎉 You're Almost Done!

1. **Copy-paste** `RUN_THIS_IN_SUPABASE.sql` into Supabase SQL Editor
2. **Click Run**
3. **Test CSV upload** at `/admin-panel`
4. **Verify frontend** shows correct data

That's it! The migration error is fixed and your database is ready for CSV uploads.
