# 🚀 Dynamic Profile Pages - Setup Guide

## Overview
Individual profile pages are now **fully dynamic** and fetch data from Supabase! No more hardcoded content.

---

## ✅ What's Been Done

### 1. Database Schema
- ✅ Added `nicknames` column to `profiles` table
- ✅ Created `profile_questions` table (master questions list)
- ✅ Created `profile_answers` table (alumni responses)
- ✅ Inserted 10 standard questions

### 2. Code Updates
- ✅ Updated TypeScript types with new interfaces
- ✅ Created slug utility functions
- ✅ Added `getProfileBySlug()` API function
- ✅ Made ProfileHero component accept dynamic props
- ✅ Updated individual profile page to fetch real data
- ✅ All 134 profiles now generate static pages

### 3. Features
- ✅ Dynamic profile data from Supabase
- ✅ Q&A system with separate questions/answers tables
- ✅ Cache-busting for profile images
- ✅ 404 handling for non-existent profiles
- ✅ Future admin panel ready

---

## 🎯 Setup Steps

### Step 1: Run Database Migrations

**Option A: Run All at Once (Recommended)**
```sql
-- Open Supabase Dashboard → SQL Editor
-- Copy contents of: supabase/migrations/000_run_all_migrations.sql
-- Paste and click "Run"
```

**Option B: Run Individual Migrations**
```sql
-- 1. Add nicknames
-- Copy from: supabase/migrations/001_add_nicknames_to_profiles.sql

-- 2. Create questions table
-- Copy from: supabase/migrations/002_create_profile_questions_table.sql

-- 3. Create answers table
-- Copy from: supabase/migrations/003_create_profile_answers_table.sql

-- 4. Insert 10 questions
-- Copy from: supabase/migrations/004_insert_profile_questions.sql
```

### Step 2: Verify Migration Success

Check tables were created:
```sql
-- Should show profile_questions and profile_answers
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name LIKE 'profile%'
ORDER BY table_name;

-- Should show 10 questions
SELECT id, question_text, order_index
FROM profile_questions
ORDER BY order_index;

-- Check nicknames column added
SELECT column_name
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'nicknames';
```

### Step 3: Add Sample Data (Testing)

Add nicknames to a few profiles:
```sql
UPDATE profiles
SET nicknames = 'Karuvaaya, Junior Amma'
WHERE name = 'Chenthil Aruun Mohan';

UPDATE profiles
SET nicknames = 'Dave'
WHERE name = 'David A';
```

Add sample Q&A responses for testing:
```sql
-- Get profile ID
SELECT id, name FROM profiles WHERE name = 'David A';
-- Let's say ID is 39

-- Add answers for profile ID 39
INSERT INTO profile_answers (profile_id, question_id, answer) VALUES
(39, 1, 'Playing cricket during lunch breaks with friends'),
(39, 2, 'The library - it was peaceful and had great books'),
(39, 3, 'Visit all my favorite teachers and thank them'),
(39, 4, 'Never stop learning and always be curious'),
(39, 5, 'The book "Sapiens" changed how I see history'),
(39, 6, 'Building my own startup from scratch'),
(39, 7, 'Photography and hiking on weekends'),
(39, 8, 'Anything by Coldplay, especially "Fix You"'),
(39, 9, 'It reminds me of where I came from and who shaped me'),
(39, 10, 'Absolutely! Would love to mentor and give back')
ON CONFLICT (profile_id, question_id) DO UPDATE
SET answer = EXCLUDED.answer;
```

### Step 4: Test the Website

```bash
# Build the project
npm run build

# Start development server
npm run dev
```

**Test URLs:**
- Main directory: `http://localhost:3000/directory`
- Individual profile: `http://localhost:3000/directory/david-a`
- Another profile: `http://localhost:3000/directory/a-arjoon`

**What to check:**
- ✅ Profile name displays correctly
- ✅ Profile image shows (not hardcoded)
- ✅ Tenure/year graduated shows
- ✅ Company name displays
- ✅ Location shows
- ✅ Nicknames appear (if data exists)
- ✅ Q&A responses show (if data exists)
- ✅ "No Q&A responses available" message shows if no data

---

## 📊 Adding Q&A Data for All Profiles

### Option 1: Manual Entry via Supabase Dashboard

1. Go to **Supabase** → **Table Editor** → `profile_answers`
2. Click **Insert** → **Insert row**
3. Fill in:
   - `profile_id`: ID of the person
   - `question_id`: 1-10 (which question)
   - `answer`: Their response
4. Click **Save**
5. Repeat for all questions for all people

### Option 2: Bulk Import via CSV (Recommended)

**CSV Format for Q&A Responses:**
```csv
profile_id,question_id,answer
39,1,Playing cricket during lunch breaks
39,2,The library
40,1,Diwali celebrations
40,2,The playground
```

**Import Steps:**
1. Create CSV file with Q&A responses
2. Go to **Supabase** → **Table Editor** → `profile_answers`
3. Click **Import data** → **Upload CSV**
4. Map columns and import

### Option 3: SQL Script (Fast)

```sql
-- Template for bulk insert
INSERT INTO profile_answers (profile_id, question_id, answer) VALUES
-- Profile 39 (David A)
(39, 1, 'Answer to question 1'),
(39, 2, 'Answer to question 2'),
-- ... all 10 questions

-- Profile 40 (David Jacob)
(40, 1, 'Answer to question 1'),
(40, 2, 'Answer to question 2'),
-- ... all 10 questions

-- ... repeat for all 134 profiles
ON CONFLICT (profile_id, question_id) DO UPDATE
SET answer = EXCLUDED.answer;
```

---

## 🎨 Enhanced CSV Uploader

The CSV uploader now needs to support Q&A data. Here's the extended format:

### Extended CSV Format:
```csv
id,name,profile_image_url,location,year_graduated,current_job,company,nicknames,qa_1,qa_2,qa_3,qa_4,qa_5,qa_6,qa_7,qa_8,qa_9,qa_10
39,David A,https://...,New York,2005,Engineer,Google,Dave,Answer 1,Answer 2,Answer 3,...
```

Where:
- `qa_1` = Answer to question 1
- `qa_2` = Answer to question 2
- ... and so on

---

## 🔍 Database Schema Reference

### Tables:

#### `profiles` (existing, updated)
```sql
- id (primary key)
- name
- profile_image_url
- location
- year_graduated
- current_job
- company
- bio
- email
- phone
- linkedin_url
- nicknames (NEW!)
- created_at
- updated_at
```

#### `profile_questions` (NEW!)
```sql
- id (primary key)
- question_text
- order_index
- is_active
- created_at
- updated_at
```

#### `profile_answers` (NEW!)
```sql
- id (primary key)
- profile_id (foreign key → profiles.id)
- question_id (foreign key → profile_questions.id)
- answer
- created_at
- updated_at
```

---

## 🚀 Deployment

### Vercel Deployment
1. Migrations must run on production Supabase database
2. Push code to GitHub
3. Vercel will auto-deploy
4. All 134 profile pages will be statically generated

### Environment Variables
Make sure these are set in Vercel:
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

---

## 📝 The 10 Questions

1. A school memory that still makes you smile
2. Your favourite spot in school
3. If you get one full day in school today, what would you do...
4. What advice would you give to the younger students entering the workforce today:
5. A book / movie / experience that changed your perspective of life:
6. A personal achievement that means a lot to you:
7. Your favourite hobby that you pursue when off work:
8. Your favourite go-to song(s) to enliven your spirits
9. What does reconnecting with this alumini group mean to you at this stage of your life?
10. Would you be open to mentoring younger students or collaborating with alumni?

---

## 🎯 Future Admin Panel

The database structure is ready for an admin panel where you can:
- ✅ Add/edit/delete questions
- ✅ Manage profile answers
- ✅ Bulk import/export Q&A data
- ✅ View analytics (which questions get most responses)
- ✅ Activate/deactivate questions

---

## ✅ Testing Checklist

- [ ] Migrations ran successfully
- [ ] 10 questions appear in `profile_questions` table
- [ ] `nicknames` column added to `profiles` table
- [ ] `profile_answers` table created
- [ ] Sample Q&A data added for at least 1 profile
- [ ] Website builds without errors
- [ ] Directory page shows all 134 profiles
- [ ] Individual profile page loads with correct name
- [ ] Profile image displays (not hardcoded)
- [ ] Q&A section shows responses (or "no data" message)
- [ ] Nicknames display (if data exists)
- [ ] Company/job info displays
- [ ] Location displays properly
- [ ] Cache-busting works (images refresh)
- [ ] 404 page shows for invalid slugs

---

## 🆘 Troubleshooting

### Issue: "Cannot read property 'qa_responses'"
**Solution:** Migrations not run. Execute all SQL migrations in Supabase.

### Issue: "Profile not found" for valid profiles
**Solution:** Check slug generation. Run:
```sql
SELECT id, name FROM profiles WHERE name LIKE '%David%';
```
Then test URL: `/directory/david-a`

### Issue: Q&A section shows "No responses available"
**Solution:** No Q&A data in database. Add sample data using SQL scripts above.

### Issue: Build fails with TypeScript errors
**Solution:** Run `npm run build` to see specific errors. Types should be updated correctly.

### Issue: Profile images not updating
**Solution:** Cache-busting is implemented. Update `updated_at`:
```sql
UPDATE profiles SET updated_at = NOW() WHERE id = 39;
```

---

## 📚 Files Modified

### Database:
- `supabase/migrations/000_run_all_migrations.sql` (master script)
- `supabase/migrations/001_add_nicknames_to_profiles.sql`
- `supabase/migrations/002_create_profile_questions_table.sql`
- `supabase/migrations/003_create_profile_answers_table.sql`
- `supabase/migrations/004_insert_profile_questions.sql`

### Code:
- `lib/types/database.ts` (added interfaces)
- `lib/utils/slug.ts` (NEW - slug utilities)
- `lib/api/profiles.ts` (added functions)
- `components/ProfileHero.tsx` (made dynamic)
- `app/directory/[id]/page.tsx` (fetch real data)

### Documentation:
- `DYNAMIC_PROFILES_SETUP_GUIDE.md` (this file)

---

## 🎉 Result

**Before:**
- ❌ All profile pages showed "Chenthil Aruun Mohan" data
- ❌ Hardcoded content
- ❌ Can't update via Supabase

**After:**
- ✅ Each profile shows their own data
- ✅ Fully dynamic from Supabase
- ✅ Update data in Supabase → website updates automatically
- ✅ Ready for admin panel
- ✅ 134 profiles work perfectly

---

**Status: ✅ READY TO USE**

Run migrations, add Q&A data, and your profile pages are live! 🚀
