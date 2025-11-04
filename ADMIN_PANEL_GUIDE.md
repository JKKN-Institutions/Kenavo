# Admin Panel Guide

## Access the Admin Panel

**URL:** `http://localhost:3000/admin-panel` (or your deployment URL)

**Note:** No authentication required - this is a simple upload interface.

---

## Features

### 1. Single Profile Upload

Upload one profile at a time with all details including image.

**Steps:**
1. Click "Single Profile" tab
2. Fill in profile details:
   - **Name** (required)
   - Email, Phone, Location
   - Year Graduated (e.g., "2010")
   - Current Job, Company
   - LinkedIn URL
   - Nicknames
   - Bio
3. Click "Choose Image" to upload profile picture
4. Click "Create Profile"

**Image Requirements:**
- Accepts: JPG, PNG, GIF, WebP
- Automatically uploaded to Supabase Storage
- Public URL generated and saved

---

### 2. Bulk Profile Upload (CSV)

Upload multiple profiles at once using CSV file.

**Steps:**
1. Click "Bulk Upload" tab
2. Click "Download CSV Template" to get the format
3. Fill in your CSV with profile data
4. Upload the CSV file
5. Click "Upload Profiles"

**CSV Format:**
```csv
name,email,phone,location,year_graduated,current_job,company,bio,linkedin_url,nicknames,profile_image_url
John Doe,john@example.com,+1234567890,New York USA,2010,Software Engineer,Tech Corp,Bio text here,https://linkedin.com/in/johndoe,Johnny,https://example.com/image.jpg
Jane Smith,jane@example.com,+9876543210,London UK,2012,Product Manager,Startup Inc,Another bio,https://linkedin.com/in/janesmith,Janey,https://example.com/image2.jpg
```

**Required Column:**
- `name` (must be present)

**Optional Columns:**
- email, phone, location, year_graduated
- current_job, company, bio
- linkedin_url, nicknames
- profile_image_url (must be a publicly accessible URL)

**Tips:**
- Use direct image URLs for `profile_image_url`
- Images must be hosted online (Imgur, Google Drive, etc.)
- Text with commas should be wrapped in quotes
- Example: `"Bio with, commas"`

---

### 3. Q&A Answers Upload (CSV)

Upload Q&A answers for all 134 profiles.

**Steps:**
1. Click "Q&A Answers" tab
2. Click "Download CSV Template" to get the format
3. Fill in answers for each profile
4. Upload the CSV file
5. Click "Upload Q&A Answers"

**CSV Format:**
```csv
profile_id,question_id,answer
1,1,Playing cricket with friends during lunch break
1,2,The library - it was my peaceful corner
1,3,I would spend time mentoring younger students
2,1,Annual day celebrations were always memorable
```

**Required Columns:**
- `profile_id` - The profile ID from database
- `question_id` - Question number (1-10)
- `answer` - The alumni's answer text

**Question IDs:**
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

**Tips:**
- Each profile can have up to 10 answers (one per question)
- Duplicate entries will be updated (upsert)
- Answers with commas/quotes should be wrapped in double quotes
- Example: `1,5,"My favorite book is ""To Kill a Mockingbird"", it changed my life"`

---

## Before You Start

### 1. Create Supabase Storage Bucket

You need to create a storage bucket for profile images:

1. Go to your Supabase Dashboard
2. Navigate to **Storage**
3. Click "Create a new bucket"
4. Bucket name: `profile-images`
5. Set as **Public bucket** (important!)
6. Click "Create bucket"

### 2. Run Database Migrations

Make sure all migrations are applied:

```bash
# Check if tables exist in Supabase dashboard:
# - profiles
# - profile_questions
# - profile_answers
```

Or run the migration SQL files in Supabase SQL Editor:
- `supabase/migrations/001_add_nicknames_to_profiles.sql`
- `supabase/migrations/002_create_profile_questions_table.sql`
- `supabase/migrations/003_create_profile_answers_table.sql`
- `supabase/migrations/004_insert_profile_questions.sql`

---

## Common Workflows

### Workflow 1: Upload All 134 Profiles from Scratch

1. **Prepare your CSV file** with all 134 profiles
   ```csv
   name,email,location,year_graduated,current_job,company,profile_image_url
   David A,david@example.com,Chennai India,2005,Engineer,TCS,https://...
   John Doe,john@example.com,Mumbai India,2008,Manager,Infosys,https://...
   ...
   ```

2. **Bulk Upload** via "Bulk Upload" tab
   - Result: All 134 profiles created with IDs 1-134

3. **Get Profile IDs** from Supabase dashboard or API
   ```sql
   SELECT id, name FROM profiles ORDER BY id;
   ```

4. **Prepare Q&A CSV** with answers
   ```csv
   profile_id,question_id,answer
   1,1,"Memory text for David A"
   1,2,"Favorite spot for David A"
   2,1,"Memory text for John Doe"
   ...
   ```

5. **Upload Q&A Answers** via "Q&A Answers" tab

### Workflow 2: Add Single Profile with Image

1. Go to "Single Profile" tab
2. Fill in all details
3. Upload profile image (JPG/PNG)
4. Click "Create Profile"
5. Note the Profile ID from success message
6. Add Q&A answers for this profile using "Q&A Answers" tab

### Workflow 3: Update Existing Profile Images

For profiles already in database but without images:

1. Upload images to a public URL (Imgur, Cloudinary, etc.)
2. Create CSV:
   ```csv
   name,profile_image_url
   David A,https://imgur.com/abc123.jpg
   John Doe,https://imgur.com/def456.jpg
   ```
3. Use Supabase dashboard to update `profile_image_url` column

Or use SQL:
```sql
UPDATE profiles
SET profile_image_url = 'https://imgur.com/abc123.jpg'
WHERE name = 'David A';
```

---

## Troubleshooting

### Error: "Failed to upload image"
- Check if `profile-images` bucket exists in Supabase Storage
- Verify bucket is set to **Public**
- Check file size (max 50MB typically)

### Error: "Profile already exists"
- Profile names must be unique
- Check for duplicate entries in CSV

### Error: "Question ID not found"
- Question IDs must be 1-10
- Verify questions are inserted in database

### Error: "Profile ID not found"
- Check profile exists in database first
- Get correct profile IDs from Supabase dashboard

---

## Security Note

⚠️ **This admin panel has NO authentication!**

For production use, you should:
1. Add authentication (e.g., password protection, Supabase Auth)
2. Restrict access by IP or VPN
3. Remove the admin panel after initial setup
4. Use Supabase Row Level Security (RLS) policies

**Current RLS Policies:**
- Public can READ profiles and Q&A
- Authenticated users can INSERT/UPDATE (admin operations)

For now, this is fine for initial data population.

---

## Next Steps After Upload

1. **Verify profiles**: Visit `https://your-domain.com/directory`
2. **Check individual profiles**: Visit `https://your-domain.com/directory/[slug]`
3. **Test Q&A display**: Ensure answers show up on profile pages
4. **Update images**: If needed, re-upload via CSV or Supabase dashboard
5. **Deploy**: Push changes to Vercel/production

---

## Support

If you encounter issues:
1. Check browser console for errors
2. Check Supabase dashboard for data
3. Verify all migrations are applied
4. Ensure storage bucket is public

Happy uploading! 🚀
