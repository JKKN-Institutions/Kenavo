# Alumni Import Commands Cheatsheet

Quick reference for all available commands.

## 📋 Available Commands

### Core Import Commands

```bash
# Validate data before import
npm run validate:alumni

# Import all 134 profiles to Supabase
npm run import:alumni

# Batch rename images locally (preview)
npm run rename:images
```

## 🎯 Common Workflows

### Workflow 1: Quick Import (Fastest)
```bash
npm run validate:alumni  # Check for errors
npm run import:alumni    # Upload to Supabase
```

**Time:** ~3-5 minutes
**Use when:** Ready to go straight to production

---

### Workflow 2: Preview First (Safest)
```bash
npm run rename:images    # Rename locally first
# Review files in public/renamed-images/
npm run validate:alumni  # Check for errors
npm run import:alumni    # Upload to Supabase
```

**Time:** ~5-7 minutes
**Use when:** Want to preview images before upload

---

### Workflow 3: Local Development Only
```bash
npm run rename:images    # Rename locally
# Use images from public/renamed-images/ in development
```

**Time:** ~2 minutes
**Use when:** Testing UI without Supabase

---

## 📊 Command Details

### `npm run validate:alumni`

**What it does:**
- Checks all 134 profiles are present
- Verifies no duplicate IDs
- Confirms all image files exist
- Validates data format (names, locations, years)

**Output:**
```
🔍 Starting validation...

========== VALIDATION RESULTS ==========

📊 Total Profiles: 134

ℹ️  INFO:
   Found 134 images

✅ All validations passed! Ready to import.
```

**When to use:**
- Before every import
- After modifying data
- To diagnose issues

---

### `npm run import:alumni`

**What it does:**
- Uploads all 134 images to Supabase Storage
- Renames images (e.g., `1-a-arjoon.png`)
- Creates database records in `profiles` table
- Generates public URLs
- Creates auto-generated bios

**Output:**
```
========== STARTING IMPORT PROCESS ==========
Total profiles to import: 134

[1/134] Processing: A Arjoon
  📤 Uploading image for A Arjoon...
  ✓ Image uploaded: 1-a-arjoon.png
  💾 Creating database record...
  ✓ Profile created successfully: A Arjoon
...

========== IMPORT COMPLETE ==========
✓ Successful: 134 profiles
✗ Failed: 0 profiles
```

**When to use:**
- After validation passes
- To upload to Supabase
- To update existing profiles (safe to re-run)

---

### `npm run rename:images`

**What it does:**
- Copies images from demo folder
- Renames to clean format
- Saves to `public/renamed-images/`
- Creates manifest file
- Shows progress and stats

**Output:**
```
🚀 Starting batch image rename process...

[1/134] ✓ SUCCESS: A Arjoon
           From: envato_labs_image_edit__4__1_1761718503874_157.png
           To:   1-a-arjoon.png (45.23 KB)
...

========== BATCH RENAME COMPLETE ==========

📊 Statistics:
   Total:    134
   ✓ Success: 134
   ✗ Failed:  0

📦 Total size: 18.45 MB

📄 Manifest saved: public/renamed-images/rename-manifest.json
```

**When to use:**
- Before import (to preview)
- For local development
- To create backup
- To verify image quality

---

## 🔍 Troubleshooting Commands

### Check if images exist
```bash
# Windows
dir "C:\Users\admin\Projects\Kenavowebsite\demo\images" | find /c ".png"

# Git Bash / WSL
ls C:/Users/admin/Projects/Kenavowebsite/demo/images/*.png | wc -l
```

**Expected output:** 205

---

### Check renamed images
```bash
# Windows
dir public\renamed-images | find /c ".png"

# Git Bash / WSL
ls public/renamed-images/*.png | wc -l
```

**Expected output:** 134 (after running rename:images)

---

### View manifest
```bash
# Windows
type public\renamed-images\rename-manifest.json

# Git Bash / WSL
cat public/renamed-images/rename-manifest.json
```

---

### Clean up renamed images
```bash
# Windows
rmdir /s /q public\renamed-images

# Git Bash / WSL
rm -rf public/renamed-images
```

---

## 📦 Package.json Scripts

All commands are defined in `package.json`:

```json
{
  "scripts": {
    "import:alumni": "node scripts/importToSupabase.js",
    "validate:alumni": "node scripts/validateData.js",
    "rename:images": "node scripts/batchRenameImages.js"
  }
}
```

## 🎓 Script Locations

```
scripts/
├── alumniDataMapping.js        # Data source (134 profiles)
├── importToSupabase.js         # Upload to Supabase
├── validateData.js             # Validation script
└── batchRenameImages.js        # Local rename script
```

## 💡 Pro Tips

### Tip 1: Always Validate First
```bash
npm run validate:alumni && npm run import:alumni
```
This runs import only if validation succeeds (uses `&&`).

---

### Tip 2: Preview in Browser
After renaming locally:
```bash
npm run rename:images
npm run dev
```
Then visit: `http://localhost:3000/renamed-images/1-a-arjoon.png`

---

### Tip 3: Check Specific Profile
To test one profile image:
```bash
# After rename
ls public/renamed-images/1-a-arjoon.png

# After import (in Supabase dashboard)
# Storage > profile-images > alumni > 1-a-arjoon.png
```

---

### Tip 4: Re-run Safely
All scripts are safe to re-run:
- `validate:alumni` - Read-only, always safe
- `rename:images` - Skips existing files
- `import:alumni` - Uses upsert (updates existing)

---

## 🚨 Common Errors

### Error: "Cannot find module './alumniDataMapping.js'"
**Fix:** Make sure you're in the project root directory
```bash
cd C:/Users/admin/Projects/KenavoFinal
npm run import:alumni
```

---

### Error: "Image not found"
**Fix:** Check source path in script
```bash
# Edit scripts/importToSupabase.js or scripts/batchRenameImages.js
# Verify: const sourcePath = 'C:/Users/admin/Projects/Kenavowebsite/demo/images'
```

---

### Error: "Table 'profiles' does not exist"
**Fix:** Create table in Supabase first (see IMPORT_INSTRUCTIONS.md)

---

### Error: "ENOENT: no such file or directory"
**Fix:** Create destination folder manually
```bash
mkdir public\renamed-images  # Windows
mkdir -p public/renamed-images  # macOS/Linux
```

---

## 📚 More Documentation

- **SUMMARY.md** - Complete overview
- **IMPORT_INSTRUCTIONS.md** - Step-by-step import guide
- **BATCH_RENAME_GUIDE.md** - Local rename details
- **QUICKSTART.md** - Quick reference
- **README.md** - Technical documentation

---

## ✨ Quick Reference Card

| Command | Time | Output | Safe to Re-run |
|---------|------|--------|----------------|
| `validate:alumni` | 10s | Console report | ✅ Yes |
| `import:alumni` | 3-5m | 134 uploads | ✅ Yes (upsert) |
| `rename:images` | 2m | Local files | ✅ Yes (skips existing) |

---

**Need help?** Check the full documentation in `scripts/` folder.
