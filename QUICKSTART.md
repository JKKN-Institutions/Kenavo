# 🚀 QUICK START - Dynamic Profile Pages

## ⚡ 3-Step Setup

### Step 1: Run Migrations (2 minutes)

1. **Open Supabase Dashboard** → **SQL Editor**
2. **Open this file:** `supabase/migrations/000_run_all_migrations.sql`
3. **Copy ALL contents**
4. **Paste in SQL Editor**
5. **Click "Run"**
6. ✅ **Done!** Tables created, questions inserted

### Step 2: Add Sample Data (1 minute)

**Run this SQL to test:**
```sql
-- Add Q&A for one profile (ID 39)
INSERT INTO profile_answers (profile_id, question_id, answer) VALUES
(39, 1, 'Playing cricket during lunch breaks'),
(39, 2, 'The library'),
(39, 3, 'Visit all my favorite teachers')
ON CONFLICT (profile_id, question_id) DO NOTHING;

-- Add a nickname
UPDATE profiles SET nicknames = 'Dave' WHERE id = 39;
```

### Step 3: Test (30 seconds)

```bash
npm run build
npm run dev
```

**Visit:**
- `http://localhost:3000/directory/david-a`

**You should see:**
- ✅ Correct person's name
- ✅ Their profile image
- ✅ Their Q&A responses
- ✅ Their nickname

---

## 🎉 That's It!

**Before:** All profiles showed "Chenthil Aruun Mohan" hardcoded data

**After:** Each profile shows their own data from Supabase!

---

## 📝 Next Steps

### Add Q&A for All 134 Profiles:

**Option 1:** Use CSV import (see `CSV_IMPORT_GUIDE.md`)

**Option 2:** Use SQL bulk insert:
```sql
INSERT INTO profile_answers (profile_id, question_id, answer) VALUES
(39, 1, 'Answer 1'), (39, 2, 'Answer 2'), ...
(40, 1, 'Answer 1'), (40, 2, 'Answer 2'), ...
-- ... for all profiles
ON CONFLICT DO NOTHING;
```

**Option 3:** Manual entry via Supabase Table Editor

---

## 📚 Full Documentation

- **Setup Guide:** `DYNAMIC_PROFILES_SETUP_GUIDE.md`
- **Complete Summary:** `IMPLEMENTATION_COMPLETE.md`
- **CSV Import:** `CSV_IMPORT_GUIDE.md`

---

## ⚠️ Troubleshooting

**Problem:** Build fails with table errors
**Solution:** Run migrations in Supabase first

**Problem:** No Q&A responses showing
**Solution:** Add data to `profile_answers` table

**Problem:** Profile shows "Not Found"
**Solution:** Check profile name matches URL slug

---

**Status: ✅ READY TO USE**

Run migrations → Add data → Test → Deploy! 🚀
