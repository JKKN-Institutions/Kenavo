# Quick Start Guide - Alumni Import

## Prerequisites

1. ✅ Supabase project created
2. ✅ Storage buckets created (`profile-images`, `gallery-images`)
3. ✅ Environment variables set in `.env.local`
4. ✅ Alumni images ready in source directory

## Step-by-Step Import Process

### Step 1: Prepare Alumni Data

1. Open `scripts/importToSupabase.js`
2. Locate the `alumniList` array (around line 11)
3. Fill in all 134 alumni profiles using this format:

```javascript
const alumniList = [
  {
    id: 1,
    name: 'Full Name',
    location: 'City, State',
    year: '2000',
    originalImage: 'image-1.jpg'
  },
  // ... add remaining 133 profiles
]
```

**Tips:**
- Keep IDs sequential (1-134)
- Use Title Case for names
- Location format: "City, ST"
- Year as string: '2000' not 2000
- Match exact image filenames

### Step 2: Verify Image Files

Ensure all images exist in:
```
C:\Users\admin\Projects\Kenavowebsite\demo\images\
```

If your images are elsewhere, update the `sourcePath` in `importToSupabase.js` (line 94).

### Step 3: Validate Data (Recommended)

Run the validation script to catch errors before importing:

```bash
npm run validate:alumni
```

This checks for:
- Duplicate IDs
- Missing required fields
- Image file existence
- Format issues

**Fix any errors before proceeding!**

### Step 4: Run Import

Once validation passes, run the import:

```bash
npm run import:alumni
```

### Step 5: Monitor Progress

Watch the console output for:
- ✓ Successful uploads
- ✗ Failed uploads
- Summary report

### Step 6: Review Results

Check the summary at the end:
```
========== IMPORT COMPLETE ==========
✓ Successful: 132 profiles
✗ Failed: 2 profiles
```

If any failed, review the error messages and fix issues.

### Step 7: Verify in Supabase

1. Go to Supabase Dashboard
2. Check **Storage** > `profile-images` > `alumni/` folder
3. Check **Table Editor** > `profiles` table
4. Verify images and data look correct

## Common Issues

### Issue: "Image not found"
**Solution:**
- Check image file exists
- Verify filename matches exactly (case-sensitive)
- Check `sourcePath` is correct

### Issue: "Database error"
**Solution:**
- Verify `profiles` table exists
- Check no duplicate IDs
- Ensure proper permissions/RLS policies

### Issue: "Upload failed"
**Solution:**
- Check Supabase credentials in `.env.local`
- Verify `profile-images` bucket exists and is public
- Check image file is valid (not corrupted)

## File Structure After Import

```
Supabase
├── Storage
│   └── profile-images
│       └── alumni
│           ├── 1-a-arjoon.jpg
│           ├── 2-annamalai-natarajan.jpg
│           └── ... (134 images)
└── Database
    └── profiles table
        └── 134 records
```

## Re-running the Import

The script uses `upsert: true`, so you can safely re-run it to:
- Update existing profiles
- Add missing profiles
- Fix errors

It will overwrite existing images and update database records.

## Next Steps

After successful import:

1. **Test the data:**
   ```sql
   SELECT COUNT(*) FROM profiles;  -- Should be 134
   ```

2. **View sample profile:**
   ```sql
   SELECT * FROM profiles LIMIT 1;
   ```

3. **Check image URLs work:**
   - Copy a `profile_image_url` from database
   - Paste in browser
   - Should display the image

4. **Build your directory page** to display the alumni!

## Quick Commands Reference

```bash
# Validate data before import
npm run validate:alumni

# Run import
npm run import:alumni

# Check what images you have
dir C:\Users\admin\Projects\Kenavowebsite\demo\images

# Count images
dir C:\Users\admin\Projects\Kenavowebsite\demo\images | find /c ".jpg"
```

## Need Help?

- Check `scripts/README.md` for detailed documentation
- Review `alumniData.template.js` for data format examples
- Run `npm run validate:alumni` to diagnose issues

---

**Remember:** Always run validation before import to catch errors early!
