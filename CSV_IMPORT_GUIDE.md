# 📊 CSV Import Guide - Bulk Update Profiles

## Overview
This guide shows you how to bulk update profile images and content using CSV files. Perfect for updating multiple profiles at once!

---

## 🚀 Quick Start (3 Steps)

### Step 1: Export Current Data
```bash
node scripts/json-to-csv.js
```
This creates `profiles_template.csv` with all your current profiles.

### Step 2: Edit the CSV
Open `profiles_template.csv` in Excel or Google Sheets and update:
- Profile images URLs
- Names, locations, bios
- Any other profile data

### Step 3: Import Back to Supabase
```bash
node scripts/csv-to-supabase.js profiles_template.csv
```
Done! Changes are live on your website. 🎉

---

## 📋 CSV Format

### Column Headers (Required):
```csv
id,name,profile_image_url,location,year_graduated,current_job,company,bio,email,phone,linkedin_url
```

### Example Row:
```csv
39,David A,https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/39-david-a.png,New York,2005,Software Engineer,Google,Passionate about tech,david@example.com,+1234567890,https://linkedin.com/in/davida
```

### Important Notes:
- ✅ **id** must match existing profile ID (for updates)
- ✅ **name** is required
- ✅ **profile_image_url** should be full Supabase Storage URL
- ✅ Empty cells = null values
- ✅ Use double quotes for values with commas: `"San Francisco, CA"`

---

## 🖼️ Updating Profile Images via CSV

### Option 1: Upload Images First, Then CSV

**Step A:** Upload all images to Supabase Storage
1. Go to **Supabase Dashboard** → **Storage** → `profile-images/alumni/`
2. Upload all new images
3. Copy the URLs

**Step B:** Update CSV with image URLs
```csv
id,name,profile_image_url
39,David A,https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/39-david-a-new.png
40,David Jacob,https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/40-david-jacob-new.png
```

**Step C:** Import CSV
```bash
node scripts/csv-to-supabase.js profiles_template.csv
```

### Option 2: Batch Upload Images with Naming Convention

Use consistent naming:
```
alumni/1-john-doe.png
alumni/2-jane-smith.png
alumni/3-bob-johnson.png
```

Then in CSV:
```csv
id,name,profile_image_url
1,John Doe,https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/1-john-doe.png
2,Jane Smith,https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/2-jane-smith.png
```

---

## 📝 Detailed Instructions

### 1. Export Current Profiles

```bash
cd C:\Users\admin\Projects\KenavoFinal
node scripts/json-to-csv.js
```

**Output:**
- ✅ Creates `profiles_template.csv`
- Contains all 134 current profiles
- Ready to edit in Excel/Google Sheets

### 2. Edit CSV File

**Open in Excel:**
- Double-click `profiles_template.csv`
- Excel opens it automatically

**Open in Google Sheets:**
- Go to Google Sheets
- File → Import → Upload `profiles_template.csv`

**Edit the data:**
- Update profile_image_url column with new image URLs
- Update names, locations, bios, etc.
- Leave cells empty for null values
- Save as CSV when done

**Example edits:**
| id | name | profile_image_url | location | bio |
|----|------|-------------------|----------|-----|
| 39 | David A | https://...new-image.png | New York | Updated bio here |
| 40 | David Jacob | https://...new-image2.png | London | Another updated bio |

### 3. Import to Supabase

```bash
node scripts/csv-to-supabase.js profiles_template.csv
```

**What happens:**
- ✅ Reads your CSV file
- ✅ Updates each profile in Supabase
- ✅ Automatically updates `updated_at` timestamp (forces cache refresh!)
- ✅ Shows progress for each profile
- ✅ Displays summary of successes/failures

**Example output:**
```
📊 Importing 134 profiles to Supabase...

✅ Updated: David A (ID: 39)
✅ Updated: David Jacob (ID: 40)
✅ Updated: Debin Davis (ID: 41)
...

==================================================
📊 IMPORT SUMMARY
==================================================
✅ Success: 134
❌ Failed: 0
📝 Total: 134

✨ Import completed!
🔄 Refresh your website to see updates (Ctrl + Shift + R)
```

### 4. Verify Changes

1. Open your website: `http://localhost:3000/directory`
2. Hard refresh: **Ctrl + Shift + R**
3. Check updated profiles
4. Verify images are showing correctly

---

## 🎨 CSV Templates for Common Updates

### Update Only Images:
```csv
id,profile_image_url
39,https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/39-new.png
40,https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/public/profile-images/alumni/40-new.png
```

### Update Only Bios:
```csv
id,bio
39,Software engineer with 10+ years experience
40,Product manager passionate about UX
```

### Update Multiple Fields:
```csv
id,name,location,current_job,company
39,David Anderson,San Francisco,Senior Engineer,Google
40,David Jacob,London,Tech Lead,Microsoft
```

---

## ⚠️ Common Issues & Solutions

### Issue 1: "File not found"
**Solution:**
```bash
# Use full path
node scripts/csv-to-supabase.js C:\Users\admin\Projects\KenavoFinal\profiles_template.csv

# Or navigate to project folder first
cd C:\Users\admin\Projects\KenavoFinal
node scripts/csv-to-supabase.js profiles_template.csv
```

### Issue 2: "Supabase credentials not found"
**Solution:**
Check `.env.local` file exists with:
```
NEXT_PUBLIC_SUPABASE_URL=https://rihoufidmnqtffzqhplc.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Issue 3: CSV has special characters
**Solution:**
- Save CSV as **UTF-8 encoding**
- Use double quotes for values with commas: `"San Francisco, CA"`
- Escape quotes by doubling them: `"He said ""Hello"""`

### Issue 4: Images not updating
**Solution:**
The script automatically updates `updated_at` timestamp, but if still cached:
1. Clear browser cache (Ctrl + Shift + Del)
2. Hard refresh (Ctrl + Shift + R)
3. Check image URL is correct in Supabase

### Issue 5: Some profiles failed to update
**Solution:**
- Check error messages in console output
- Verify ID exists in database
- Check required fields (name) are not empty
- Verify image URLs are valid

---

## 🔧 Advanced Usage

### Update Specific Profiles Only

Create a CSV with just the profiles you want to update:
```csv
id,name,profile_image_url
39,David A,https://...new-image.png
42,John Doe,https://...another-image.png
```

### Batch Upload Images Using Script

Create a bash script to upload images in bulk:
```bash
# upload-images.sh
for file in images/*.png; do
  filename=$(basename "$file")
  # Upload to Supabase Storage
  curl -X POST "https://rihoufidmnqtffzqhplc.supabase.co/storage/v1/object/profile-images/alumni/$filename" \
    -H "Authorization: Bearer YOUR_ANON_KEY" \
    --data-binary "@$file"
done
```

### Export Specific Columns Only

Modify `json-to-csv.js` to export only needed columns:
```javascript
const headers = [
  'id',
  'name',
  'profile_image_url'  // Only these 3 columns
];
```

---

## 📊 Alternative: Direct Supabase Table Editor

If you prefer not to use CSV, you can also:

### Option 1: Supabase Table Editor
1. Go to **Supabase Dashboard** → **Table Editor** → `profiles`
2. Click on any row to edit
3. Update fields directly
4. Click **Save**

### Option 2: SQL Editor (Bulk Update)
```sql
-- Update multiple profiles at once
UPDATE profiles
SET profile_image_url = CASE id
  WHEN 39 THEN 'https://...new-image-39.png'
  WHEN 40 THEN 'https://...new-image-40.png'
  WHEN 41 THEN 'https://...new-image-41.png'
END,
updated_at = NOW()
WHERE id IN (39, 40, 41);
```

### Option 3: Google Sheets → Supabase (Direct)
Use Supabase API with Google Apps Script:
```javascript
function updateProfiles() {
  const sheet = SpreadsheetApp.getActiveSheet();
  const data = sheet.getDataRange().getValues();

  // Loop through rows and update Supabase via API
  // (Advanced - requires Apps Script knowledge)
}
```

---

## 🎯 Best Practices

### 1. Always Backup Before Import
```bash
# Create backup
node scripts/json-to-csv.js
cp profiles_template.csv profiles_backup_2025-11-04.csv
```

### 2. Test with Few Profiles First
Create a test CSV with 2-3 profiles:
```csv
id,name,profile_image_url
39,David A,https://...test-image.png
```

Import and verify before doing bulk update.

### 3. Use Consistent Image Naming
```
✅ Good:
- 39-david-a.png
- 40-david-jacob.png
- 41-debin-davis.png

❌ Bad:
- IMG_001.png
- photo.png
- picture123.png
```

### 4. Keep CSV Files Organized
```
profiles_template.csv           (Current export)
profiles_backup_2025-11-04.csv  (Backup)
profiles_updated_2025-11-04.csv (After edits)
```

---

## 📞 Support

### Scripts Location:
- Export: `scripts/json-to-csv.js`
- Import: `scripts/csv-to-supabase.js`

### Template Location:
- CSV: `profiles_template.csv` (created after export)

### Need Help?
Check these files:
- `IMAGE_CACHE_SOLUTION.md` - Image caching issues
- `QUICK_IMAGE_UPDATE_GUIDE.md` - Manual update guide
- `refresh-image-cache.sql` - SQL scripts

---

## ✅ Summary Checklist

- [ ] Run `node scripts/json-to-csv.js` to export
- [ ] Open `profiles_template.csv` in Excel/Sheets
- [ ] Upload new images to Supabase Storage
- [ ] Update CSV with new image URLs
- [ ] Save CSV file
- [ ] Run `node scripts/csv-to-supabase.js profiles_template.csv`
- [ ] Wait for import to complete
- [ ] Refresh website (Ctrl + Shift + R)
- [ ] Verify changes are live

---

**Status: ✅ READY TO USE**

You can now bulk update profiles and images using CSV! 🎉
