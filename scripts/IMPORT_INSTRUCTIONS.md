# Alumni Import Instructions

## ✅ Ready to Import!

All 134 alumni profiles have been mapped and are ready to import into Supabase.

## Pre-flight Checklist

Before running the import, ensure:

1. **Environment Variables Set**
   - Check `.env.local` exists with Supabase credentials
   - Or the script will use placeholders (and fail)

2. **Supabase Setup Complete**
   - ✅ `profile-images` bucket exists
   - ✅ Storage policies are configured
   - ✅ `profiles` table exists (needs to be created if it doesn't exist)

3. **Images Available**
   - Source path: `C:/Users/admin/Projects/Kenavowebsite/demo/images`
   - All 134 PNG files with envato names exist

## Database Table Required

First, create the `profiles` table in Supabase if it doesn't exist:

```sql
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  profile_image_url TEXT,
  location TEXT,
  year_graduated TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow public to read profiles
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

-- Allow authenticated users to insert/update
CREATE POLICY "Authenticated users can insert profiles"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update profiles"
  ON profiles FOR UPDATE
  TO authenticated
  USING (true);
```

## Run the Import

### Step 1: Validate Data (Optional but Recommended)

```bash
npm run validate:alumni
```

This checks:
- All 134 profiles are present
- No duplicate IDs
- All image files exist
- Data format is correct

### Step 2: Run Import

```bash
npm run import:alumni
```

Watch the console for progress. The script will:
1. Read each profile from `alumniDataMapping.js`
2. Upload image with new name (e.g., `1-a-arjoon.png`)
3. Create database record
4. Report success/failure

## Expected Output

```
========== STARTING IMPORT PROCESS ==========
Total profiles to import: 134

[1/134] Processing: A Arjoon
  📤 Uploading image for A Arjoon...
  ✓ Image uploaded: 1-a-arjoon.png
  💾 Creating database record...
  ✓ Profile created successfully: A Arjoon

[2/134] Processing: Annamalai Natarajan
  📤 Uploading image for Annamalai Natarajan...
  ✓ Image uploaded: 2-annamalai-natarajan.png
  💾 Creating database record...
  ✓ Profile created successfully: Annamalai Natarajan

...

========== IMPORT COMPLETE ==========
✓ Successful: 134 profiles
✗ Failed: 0 profiles
```

## After Import

### Verify in Supabase Dashboard

1. **Check Storage**
   - Go to Storage > `profile-images` > `alumni/`
   - Should see 134 PNG files with renamed format

2. **Check Database**
   - Go to Table Editor > `profiles`
   - Should see 134 records

### Test Queries

```sql
-- Count total profiles
SELECT COUNT(*) FROM profiles;
-- Should return 134

-- View sample profiles
SELECT id, name, location, year_graduated FROM profiles LIMIT 5;

-- Check image URLs
SELECT id, name, profile_image_url FROM profiles WHERE id = 1;
```

## Image Naming Convention

Original images are renamed using this pattern:

```
{id}-{safe-name}.{ext}

Examples:
- ID 1: A Arjoon → 1-a-arjoon.png
- ID 42: Deepak Chakravarthy Munirathinam → 42-deepak-chakravarthy-munirathinam.png
- ID 95: Prasadhkanna Kanthruban Rathinavelu → 95-prasadhkanna-kanthruban-rathinavelu.png
```

## Troubleshooting

### Error: "Image not found"
- Check that source path is correct
- Verify all 205 PNG files exist in demo/images folder
- Images use long envato_labs names

### Error: "Database error"
- Make sure `profiles` table exists
- Check RLS policies are set
- Verify environment variables

### Error: "Upload failed"
- Check Supabase credentials
- Verify `profile-images` bucket exists and is public
- Check network connection

## File Structure

```
scripts/
├── alumniDataMapping.js       # Complete 134 profiles with image mappings
├── importToSupabase.js        # Main import script
├── validateData.js            # Validation script
├── README.md                  # Detailed documentation
├── QUICKSTART.md             # Quick start guide
└── IMPORT_INSTRUCTIONS.md    # This file
```

## Next Steps After Successful Import

1. **Build directory page** to display alumni
2. **Add search/filter** functionality
3. **Create individual** profile pages
4. **Enable alumni** to update their own profiles
5. **Add social links** and contact information

## Support

If you encounter issues:
1. Check console output for specific error messages
2. Review validation results
3. Verify all prerequisites are met
4. Check Supabase logs in dashboard

---

**Ready?** Run `npm run import:alumni` to begin!
