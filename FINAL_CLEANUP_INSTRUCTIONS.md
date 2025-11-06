# 🎯 Final Cleanup - Remove Test Data Profiles

## ✅ Status

**Migration 009**: ✅ Complete - Constraint exists correctly
**Duplicate Detection**: Shows "No duplicates" (correct by new constraint)
**Actual Issue**: 7 profiles have "test" data with wrong years

## 📊 Profiles to Clean Up

These are the **SAME people** with duplicate entries:

| Delete ID | Keep ID | Name | Reason |
|-----------|---------|------|--------|
| 3 ❌ | 135 ✅ | A S Syed Ahamed Khan | ID 3 has "test" data, ID 135 has real CSV data |
| 5 ❌ | 136 ✅ | Abishek Valluru | ID 5 has "test" data, ID 136 has real data |
| 15 ❌ | 137 ✅ | Annadurai S.V | ID 15 has minimal data, ID 137 has full data |
| 36 ❌ | 141 ✅ | Chenthil Aruun Mohan | Older vs newer data |
| 70 ❌ | 143 ✅ | Kumaran Srinivasan | Older vs newer data |
| 75 ❌ | 144 ✅ | Lalhruaitluanga Khiangte | Older vs newer data |
| 110 ❌ | 148 ✅ | Shravan Kumar Avula | Older vs newer data |

**After cleanup**: 146 → 139 profiles (7 deleted)

## 🚀 Quick Fix (1 Step)

### **Run the Cleanup SQL**

1. Open Supabase SQL Editor: https://supabase.com/dashboard
2. Open this file: `cleanup-remaining-test-profiles.sql`
3. Copy **ALL** contents
4. Paste into Supabase SQL Editor
5. **REVIEW** the SQL to confirm (see what gets deleted above)
6. Click **Run**

**Expected Result**:
```sql
-- total_profiles: 139
-- Second query returns: 0 rows (all deleted profiles gone)
```

## ✅ Verification

After running the cleanup:

```bash
# 1. Detect duplicates again
node scripts/detect-duplicate-profiles.js
# Should still show: "No duplicates found!"

# 2. Rebuild project
npm run build
# Should complete WITHOUT "Multiple profiles match" warnings ✅

# 3. Test frontend
npm run dev
# Visit: http://localhost:3000/directory/a-s-syed-ahamed-khan
# Should show: Real data from CSV, not "test" data
```

## 🎉 Success Criteria

You'll know it's fixed when:

- [ ] Profile count: 139 (was 146, deleted 7)
- [ ] Build completes without "Multiple profiles match" warnings
- [ ] Frontend shows REAL data (not "test" values)
- [ ] `/directory/a-s-syed-ahamed-khan` shows correct company, job, location

## 📁 Files Created

1. **`cleanup-remaining-test-profiles.sql`** ⭐ **RUN THIS!**
   - Removes 7 old "test" data profiles
   - Keeps real CSV data profiles
   - Safe to run (uses transactions)

2. **`scripts/compare-duplicate-profiles.js`**
   - Compare profile data side-by-side
   - Shows which has real vs test data

## ⚠️ Why This Happened

1. **Original state**: Placeholder profiles with "test" data (IDs 3, 5, 15, etc.)
2. **CSV upload attempted**: Matching failed (before code fix)
3. **Result**: New profiles created instead of updates (IDs 135, 136, 137, etc.)
4. **Now**: Same person exists twice - once with "test" data, once with real data

## 🔧 What the SQL Does

For each duplicate pair:
1. Moves gallery images to the correct profile
2. Moves Q&A answers to the correct profile
3. Deletes the old "test" data profile
4. Keeps the real CSV data profile

All wrapped in a transaction - either all succeed or none.

---

## 📞 Next Step

**Open and run**: `cleanup-remaining-test-profiles.sql` in Supabase SQL Editor

This will remove all the old "test" data and keep only the real CSV data!
