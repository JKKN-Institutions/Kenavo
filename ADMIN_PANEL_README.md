# 🎉 Admin Panel for Kenavo Alumni Directory

## ✅ What's Been Created

A complete admin panel has been set up for uploading all 134 alumni profiles without authentication.

### Files Created:
1. **`app/admin-panel/page.tsx`** - Main admin panel UI
2. **`app/api/admin/upload-profile/route.ts`** - Single profile upload API
3. **`app/api/admin/bulk-upload-profiles/route.ts`** - Bulk CSV upload API
4. **`app/api/admin/upload-qa-answers/route.ts`** - Q&A answers upload API
5. **`public/templates/profiles_template.csv`** - Profile CSV template
6. **`public/templates/qa_answers_template.csv`** - Q&A CSV template

---

## 🚀 How to Access

### Local Development:
```
http://localhost:3000/admin-panel
```
or if port 3000 is busy:
```
http://localhost:3003/admin-panel
```

### Production (after deployment):
```
https://kenavo.vercel.app/admin-panel
```

---

## 📋 Features

### 1. Single Profile Upload
- Upload one profile at a time
- Direct image upload (JPG/PNG)
- All profile fields supported
- Image automatically uploaded to Supabase Storage

### 2. Bulk Profile Upload
- Upload 134 profiles via CSV
- Download template provided
- Supports image URLs
- Fast batch processing

### 3. Q&A Answers Upload
- Upload all Q&A responses via CSV
- 10 questions per profile
- Bulk upsert (updates existing, creates new)
- Download template provided

---

## 🎯 Quick Start

### For Your 134 Profiles:

**Step 1: Prepare Profiles CSV**
```csv
name,email,phone,location,year_graduated,current_job,company,nicknames,profile_image_url
David A,david@email.com,+91xxx,Chennai,2005,Engineer,TCS,Dave,https://i.imgur.com/xxx.jpg
John Doe,john@email.com,+91xxx,Mumbai,2008,Manager,Infosys,Johnny,https://i.imgur.com/yyy.jpg
... (132 more)
```

**Step 2: Upload Profiles**
- Go to admin panel → "Bulk Upload" tab
- Upload CSV
- Get profile IDs from response

**Step 3: Prepare Q&A CSV**
```csv
profile_id,question_id,answer
1,1,"My favorite school memory"
1,2,"The library"
... (1,340 rows for all 134 profiles × 10 questions)
```

**Step 4: Upload Q&A**
- Go to "Q&A Answers" tab
- Upload CSV
- Done!

---

## 📖 Documentation

- **Quick Start Guide**: `ADMIN_PANEL_QUICKSTART.md`
- **Detailed Guide**: `ADMIN_PANEL_GUIDE.md`
- **CSV Templates**: `/public/templates/`

---

## ⚙️ Technical Details

### API Endpoints:
- `POST /api/admin/upload-profile` - Single profile
- `POST /api/admin/bulk-upload-profiles` - Bulk profiles
- `POST /api/admin/upload-qa-answers` - Q&A answers

### Database Tables:
- `profiles` - Alumni profiles
- `profile_questions` - 10 standard questions
- `profile_answers` - Alumni answers to questions

### Image Storage:
- Bucket: `profile-images` (Supabase Storage)
- Public access enabled
- Automatic URL generation

---

## 🔒 Security

⚠️ **No Authentication Required**

This is intentional for quick setup. After uploading all data:
1. Delete the `/admin-panel` route
2. Or add password protection
3. Or restrict by IP/VPN

---

## 🛠️ Setup Requirements

Before using the admin panel:

1. **Create Supabase Storage Bucket**
   - Name: `profile-images`
   - Type: Public
   - Location: Supabase Dashboard → Storage

2. **Verify Database Tables**
   - Run migrations from `/supabase/migrations/`
   - Check tables: `profiles`, `profile_questions`, `profile_answers`

3. **Check Environment Variables**
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## 🎨 UI Features

- Clean, modern interface
- Purple/Indigo gradient design
- Real-time upload progress
- Success/Error messages
- Image preview before upload
- CSV template downloads
- Responsive mobile-friendly design

---

## 📊 What Happens Behind the Scenes

### Single Upload:
1. Form data collected
2. Image uploaded to Supabase Storage
3. Public URL generated
4. Profile inserted into database
5. Profile ID returned

### Bulk Upload:
1. CSV file parsed
2. Validation performed
3. Bulk insert to database
4. Count of uploaded profiles returned

### Q&A Upload:
1. CSV file parsed
2. Validation (profile_id, question_id)
3. Upsert to database (update if exists)
4. Count of answers uploaded

---

## 🧪 Testing

Test with 2-3 profiles first:

1. Create small CSV with 2 profiles
2. Upload via admin panel
3. Check `/directory` page
4. Click profile to verify individual page
5. Check Q&A display
6. If all works, upload remaining profiles

---

## 🔍 Verification

After uploading all data:

```sql
-- Check profile count
SELECT COUNT(*) FROM profiles;
-- Should return: 134

-- Check Q&A answers
SELECT COUNT(*) FROM profile_answers;
-- Should return: up to 1,340 (134 × 10)

-- Check profiles with images
SELECT COUNT(*) FROM profiles WHERE profile_image_url IS NOT NULL;

-- Check profiles with Q&A
SELECT p.name, COUNT(pa.id) as answer_count
FROM profiles p
LEFT JOIN profile_answers pa ON p.id = pa.profile_id
GROUP BY p.id, p.name
ORDER BY answer_count DESC;
```

---

## 🚢 Deployment

The admin panel is already part of your Next.js app:
- No additional deployment needed
- Works in production automatically
- Same URL structure in production

---

## 💡 Tips

1. **Image URLs**: Use Imgur, Cloudinary, or any CDN for bulk uploads
2. **CSV Formatting**: Wrap text with commas in quotes
3. **Question IDs**: Always 1-10 (fixed questions)
4. **Profile IDs**: Get from database after profile upload
5. **Backups**: Keep CSV files as backup for re-import

---

## 📞 Support

If you need help:
- Check browser console for errors
- Verify Supabase dashboard for data
- Check Network tab for API responses
- Ensure storage bucket is public

---

## ✨ Summary

You now have a fully functional admin panel to:
- ✅ Upload all 134 profiles (bulk or single)
- ✅ Upload profile images (direct or URL)
- ✅ Upload Q&A answers for all profiles
- ✅ No authentication needed
- ✅ User-friendly interface
- ✅ CSV templates provided
- ✅ Complete documentation

**Ready to upload!** 🎉

Access at: http://localhost:3000/admin-panel
