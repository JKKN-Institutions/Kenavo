# Batch Image Rename Guide

## Overview

The batch rename script copies all 134 alumni images from the demo folder and renames them locally before uploading to Supabase. This is useful for:

- Preview renamed files before uploading
- Use renamed images locally in development
- Verify image quality and format
- Keep a local backup with clean names

## How It Works

### Source → Destination

```
Source:
C:/Users/admin/Projects/Kenavowebsite/demo/images/
├── envato_labs_image_edit__4__1_1761718503874_157.png
├── envato_labs_image_edit__4__1_1761718503874_906.png
└── ...

Destination:
C:/Users/admin/Projects/KenavoFinal/public/renamed-images/
├── 1-a-arjoon.png
├── 2-annamalai-natarajan.png
└── ...
```

### Naming Convention

```
{id}-{safe-name}.{original-extension}

Examples:
- ID 1: A Arjoon → 1-a-arjoon.png
- ID 42: Deepak Chakravarthy Munirathinam → 42-deepak-chakravarthy-munirathinam.png
- ID 131: Vongsatorn Lertsethtakarn → 131-vongsatorn-lertsethtakarn.png
```

**Safe name rules:**
- Lowercase
- Spaces → hyphens
- Special characters removed (dots, apostrophes, etc.)
- Limited to 50 characters

## Usage

### Run the Script

```bash
npm run rename:images
```

### Output Example

```
🚀 Starting batch image rename process...

Source: C:/Users/admin/Projects/Kenavowebsite/demo/images
Destination: C:/Users/admin/Projects/KenavoFinal/public/renamed-images
Total images to process: 134

📁 Creating destination folder...
✓ Destination folder created

========== PROCESSING IMAGES ==========

[1/134] ✓ SUCCESS: A Arjoon
           From: envato_labs_image_edit__4__1_1761718503874_157.png
           To:   1-a-arjoon.png (45.23 KB)

[2/134] ✓ SUCCESS: Annamalai Natarajan
           From: envato_labs_image_edit__4__1_1761718503874_906.png
           To:   2-annamalai-natarajan.png (52.11 KB)

...

========== BATCH RENAME COMPLETE ==========

📊 Statistics:
   Total:    134
   ✓ Success: 134
   ✗ Failed:  0
   ⚠ Skipped: 0

📦 Total size: 18.45 MB

📄 Manifest saved: C:/Users/admin/Projects/KenavoFinal/public/renamed-images/rename-manifest.json

✨ All images processed successfully!
```

## Features

### 1. Progress Tracking
- Shows current progress `[1/134]`
- Real-time status updates
- Individual file success/failure

### 2. Error Handling
- Missing files detected
- Permission errors caught
- Detailed error messages
- Process continues on failure

### 3. Skip Existing Files
- Won't overwrite existing files
- Shows skipped count
- Safe to re-run

### 4. Manifest File
Generates `rename-manifest.json` with:
```json
{
  "timestamp": "2025-01-15T10:30:00.000Z",
  "sourcePath": "C:/Users/admin/Projects/Kenavowebsite/demo/images",
  "destPath": "C:/Users/admin/Projects/KenavoFinal/public/renamed-images",
  "stats": {
    "total": 134,
    "success": 134,
    "failed": 0,
    "skipped": 0
  },
  "successFiles": [
    {
      "id": 1,
      "name": "A Arjoon",
      "originalImage": "envato_labs_image_edit__4__1_1761718503874_157.png",
      "newFileName": "1-a-arjoon.png",
      "size": 46315
    },
    ...
  ],
  "failedFiles": []
}
```

### 5. Statistics Report
- Total files processed
- Success count
- Failed count
- Skipped count
- Total file size

## Use Cases

### 1. Local Development

Use renamed images locally without uploading:

```jsx
// In your component
<img src="/renamed-images/1-a-arjoon.png" alt="A Arjoon" />
```

### 2. Preview Before Upload

Check renamed files before committing to Supabase:
1. Run batch rename
2. Open `public/renamed-images/`
3. Verify all images look correct
4. Then run Supabase import

### 3. Generate Image Manifest

Use manifest file for other purposes:
```javascript
const manifest = require('../public/renamed-images/rename-manifest.json')

// Get list of all successful renames
const renamedFiles = manifest.successFiles.map(f => f.newFileName)
```

### 4. Backup

Keep a local backup with clean names:
- Copy `renamed-images/` to backup location
- Easy to identify files
- Safe archive

## Troubleshooting

### Issue: "File not found"

**Cause:** Source image doesn't exist

**Solution:**
1. Check source path is correct
2. Verify image filename matches exactly
3. Check if file was moved/deleted

### Issue: "Permission denied"

**Cause:** No write access to destination

**Solution:**
1. Check folder permissions
2. Run as administrator (Windows)
3. Close any apps accessing the folder

### Issue: "All files skipped"

**Cause:** Files already exist

**Solution:**
1. Delete `public/renamed-images/` folder
2. Run script again
3. Or manually delete specific files

## Directory Structure After Rename

```
KenavoFinal/
├── public/
│   └── renamed-images/
│       ├── 1-a-arjoon.png
│       ├── 2-annamalai-natarajan.png
│       ├── ...
│       ├── 134-suhail.png
│       └── rename-manifest.json
└── scripts/
    └── batchRenameImages.js
```

## Comparison: Batch Rename vs Direct Upload

### Batch Rename (Local)
**Pros:**
- Preview before upload
- Use locally in development
- Keep backup
- Verify quality

**Cons:**
- Extra step
- Uses local storage (~20MB)
- Files not in Supabase yet

### Direct Upload (importToSupabase.js)
**Pros:**
- One-step process
- Files immediately in Supabase
- No local storage needed

**Cons:**
- Can't preview locally first
- Harder to verify before upload

## Recommended Workflow

### For Production:
1. **Batch rename** first (preview)
2. Review renamed images
3. **Then import** to Supabase

```bash
# Step 1: Rename locally
npm run rename:images

# Step 2: Review files in public/renamed-images/

# Step 3: Upload to Supabase
npm run import:alumni
```

### For Quick Testing:
Skip batch rename, go straight to import:

```bash
npm run import:alumni
```

## File Size Considerations

- Average image size: ~150 KB
- 134 images = ~20 MB total
- Ensure you have space in `public/`
- Consider `.gitignore` for renamed-images

### Add to .gitignore

```gitignore
# Renamed images (generated file)
public/renamed-images/
```

## Clean Up

To remove renamed images:

### Windows:
```cmd
rmdir /s /q public\renamed-images
```

### macOS/Linux:
```bash
rm -rf public/renamed-images
```

### Or manually:
Delete `public/renamed-images/` folder

## Advanced: Modify Naming Convention

Edit `batchRenameImages.js` to change naming:

```javascript
// Current format: {id}-{safe-name}.ext
const destFile = path.join(destPath, `${alumni.id}-${safeName}${fileExt}`)

// Alternative formats:

// Format: {name}-{id}.ext
const destFile = path.join(destPath, `${safeName}-${alumni.id}${fileExt}`)

// Format: alumni-{id}.ext
const destFile = path.join(destPath, `alumni-${alumni.id}${fileExt}`)

// Format: {year}-{id}-{name}.ext
const destFile = path.join(destPath, `${alumni.year}-${alumni.id}-${safeName}${fileExt}`)
```

## Next Steps After Rename

1. ✅ Review renamed images
2. ✅ Check manifest file
3. ✅ Verify total size
4. ✅ (Optional) Use in local development
5. ✅ Run Supabase import
6. ✅ Deploy to production

---

**Ready to rename?** Run `npm run rename:images`
