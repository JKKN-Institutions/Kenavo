# Admin Panel - Quick Start Guide

## 🚀 Access the Panel

**Local:** http://localhost:3000/admin-panel
**Production:** https://your-domain.vercel.app/admin-panel

---

## ⚡ Quick Setup (2 Minutes)

### Step 1: Create Storage Bucket
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project
3. Click **Storage** in sidebar
4. Click **"New bucket"**
5. Name: `profile-images`
6. ✅ Check **"Public bucket"**
7. Click **"Create bucket"**

### Step 2: Verify Database Tables
Run this in Supabase SQL Editor:
```sql
-- Check tables exist
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
AND table_name IN ('profiles', 'profile_questions', 'profile_answers');
```

Should return 3 rows. If not, run migrations from `supabase/migrations/` folder.

---

## 📤 Upload Your 134 Profiles

### Method 1: Bulk CSV Upload (RECOMMENDED)

**Prepare your CSV:**
```csv
name,email,phone,location,year_graduated,current_job,company,profile_image_url,nicknames
David A,david@email.com,+91xxx,Chennai,2005,Engineer,TCS,https://i.imgur.com/xxx.jpg,Dave
John Doe,john@email.com,+91xxx,Mumbai,2008,Manager,Infosys,https://i.imgur.com/yyy.jpg,Johnny
... (all 134 profiles)
```

**Upload:**
1. Go to admin panel → **"Bulk Upload"** tab
2. Click **"Download CSV Template"** (optional)
3. Upload your CSV file
4. Click **"Upload Profiles"**
5. ✅ Success! All profiles created

---

### Method 2: Single Profile Upload

Use for individual profiles or profiles with large images:

1. Go to **"Single Profile"** tab
2. Fill in details
3. Upload image directly (JPG/PNG up to 50MB)
4. Click **"Create Profile"**

---

## 📝 Add Q&A Answers for All Profiles

### Step 1: Get Profile IDs

After uploading profiles, get their IDs from Supabase:

```sql
SELECT id, name FROM profiles ORDER BY id;
```

Copy the results (you'll need profile IDs).

### Step 2: Prepare Q&A CSV

Create a CSV with this format:

```csv
profile_id,question_id,answer
1,1,"Playing cricket during lunch was the best"
1,2,"The library corner"
1,3,"I would mentor students"
1,4,"Stay curious and keep learning"
1,5,"The book 'Sapiens' changed my perspective"
1,6,"Completing my first marathon"
1,7,"Photography on weekends"
1,8,"Don't Stop Believin' by Journey"
1,9,"It reminds me of my roots"
1,10,"Yes absolutely!"
2,1,"Annual day celebrations"
2,2,"The playground"
... (repeat for all 134 profiles)
```

**Question IDs (1-10):**
1. School memory that makes you smile
2. Favourite spot in school
3. One full day in school today
4. Advice to younger students
5. Book/movie that changed perspective
6. Personal achievement
7. Favourite hobby
8. Go-to song
9. What reconnecting means
10. Open to mentoring

### Step 3: Upload Q&A

1. Go to **"Q&A Answers"** tab
2. Click **"Download CSV Template"** (optional)
3. Upload your Q&A CSV
4. Click **"Upload Q&A Answers"**
5. ✅ Done!

---

## 🖼️ Image Options

### Option 1: Direct Image URLs (Easiest for Bulk)
- Upload images to Imgur, Cloudinary, or any CDN
- Use direct URLs in CSV `profile_image_url` column
- Example: `https://i.imgur.com/abc123.jpg`

### Option 2: Upload via Admin Panel
- Best for single profiles
- Files uploaded to Supabase Storage
- Automatic URL generation

### Option 3: Supabase Storage Direct Upload
- Upload all images to Supabase Storage bucket
- Get public URLs
- Update database manually

---

## ✅ Verification Checklist

After uploading everything:

- [ ] Visit `/directory` - See all 134 profiles listed
- [ ] Click any profile - Opens at `/directory/[slug]`
- [ ] Profile page shows image, name, details
- [ ] Q&A section displays 10 questions with answers
- [ ] No "No Q&A responses available yet" message

---

## 🐛 Troubleshooting

### Issue: Image upload fails
**Solution:**
- Verify `profile-images` bucket exists
- Ensure bucket is set to **Public**
- Check file size < 50MB

### Issue: CSV upload says "Failed to insert"
**Solution:**
- Check CSV format (use template)
- Ensure no duplicate names
- Verify required columns present

### Issue: Q&A not showing on profile pages
**Solution:**
- Check `profile_id` matches actual profile IDs
- Verify `question_id` is between 1-10
- Run migration `004_insert_profile_questions.sql`

### Issue: Profile URLs not working
**Solution:**
- Profiles automatically generate slugs from names
- Example: "A.S. Syed Ahamed Khan" → `/directory/a-s-syed-ahamed-khan`
- Check `lib/utils/slug.ts` for slug generation logic

---

## 📊 Database Structure

```
profiles (134 rows)
├─ id: 1, 2, 3, ... 134
├─ name: "David A", "John Doe", ...
├─ profile_image_url: URL or NULL
└─ ... (other fields)

profile_questions (10 rows)
├─ id: 1-10
└─ question_text: "A school memory..."

profile_answers (up to 1,340 rows = 134 × 10)
├─ profile_id: 1-134
├─ question_id: 1-10
└─ answer: "My answer text..."
```

---

## 🎯 Pro Tips

1. **Use CSV for bulk operations** - Much faster than one-by-one
2. **Host images externally** - Imgur/Cloudinary for bulk uploads
3. **Test with 2-3 profiles first** - Verify everything works
4. **Keep CSV backups** - Easy to re-import if needed
5. **Answers can have commas** - Just wrap in double quotes: `"Hello, world"`

---

## 🔒 Security Notice

⚠️ **This admin panel has NO authentication!**

**For production:**
- Remove `/admin-panel` after initial setup
- Or add password protection
- Or restrict access by IP

**Current setup is OK for:**
- Initial data import
- Local development
- Temporary one-time use

---

## 📞 Need Help?

- Check `ADMIN_PANEL_GUIDE.md` for detailed instructions
- View CSV templates in `/public/templates/`
- Check Supabase dashboard for data verification

---

**That's it! You're ready to upload all 134 profiles.** 🎉

Total time: ~10 minutes for bulk upload of all profiles + Q&A
