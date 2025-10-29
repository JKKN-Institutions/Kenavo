# Alumni Import Script

This directory contains scripts for importing alumni data into Supabase.

## Setup

### 1. Environment Variables

Make sure you have a `.env.local` file in the root directory with your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Prepare Alumni Data

Edit `importToSupabase.js` and fill in the `alumniList` array with all 134 alumni profiles:

```javascript
const alumniList = [
  { id: 1, name: 'A Arjoon', location: 'Chennai, TN', year: '2000', originalImage: 'image-1.jpg' },
  { id: 2, name: 'Annamalai Natarajan', location: 'Bangalore, KA', year: '2000', originalImage: 'image-2.jpg' },
  // ... add all 134 profiles
]
```

### 3. Verify Image Source Path

The script expects images to be located at:
```
C:/Users/admin/Projects/Kenavowebsite/demo/images
```

Update the `sourcePath` variable in the script if your images are in a different location.

## How It Works

### Image Renaming

Original images (like `image-1.jpg`) are renamed using this pattern:
```
{id}-{safe-name}.jpg
```

For example:
- `image-1.jpg` → `1-a-arjoon.jpg`
- `image-2.jpg` → `2-annamalai-natarajan.jpg`

The safe name is created by:
1. Converting to lowercase
2. Replacing spaces with hyphens
3. Removing special characters
4. Limiting to 50 characters

### Upload Structure

Images are uploaded to:
```
Supabase Storage
└── profile-images (bucket)
    └── alumni/
        ├── 1-a-arjoon.jpg
        ├── 2-annamalai-natarajan.jpg
        └── ...
```

### Database Records

For each alumni, the script creates a profile record with:
- `id`: Unique identifier
- `name`: Full name
- `profile_image_url`: Public URL to the uploaded image
- `location`: City and state
- `year_graduated`: Graduation year
- `bio`: Auto-generated bio text
- `created_at` and `updated_at`: Timestamps

## Running the Script

### Option 1: Using npm script (Recommended)

```bash
npm run import:alumni
```

### Option 2: Direct Node execution

```bash
node scripts/importToSupabase.js
```

## Output

The script provides detailed progress for each profile:

```
========== STARTING IMPORT PROCESS ==========
Total profiles to import: 134

[1/134] Processing: A Arjoon
  📤 Uploading image for A Arjoon...
  ✓ Image uploaded: 1-a-arjoon.jpg
  💾 Creating database record...
  ✓ Profile created successfully: A Arjoon

[2/134] Processing: Annamalai Natarajan
  ...

========== IMPORT COMPLETE ==========
✓ Successful: 132 profiles
✗ Failed: 2 profiles

❌ Failed imports:
  - John Doe: Image file not found
  - Jane Smith: Database error
```

## Troubleshooting

### Image Not Found

If you see "Image not found" errors:
1. Check that all image files exist in the source directory
2. Verify the `originalImage` filenames match exactly
3. Ensure the `sourcePath` is correct

### Upload Errors

If image uploads fail:
1. Verify Supabase credentials in `.env.local`
2. Check that the `profile-images` bucket exists
3. Ensure you have proper permissions

### Database Errors

If database inserts fail:
1. Check that the `profiles` table exists
2. Verify all required columns are present
3. Ensure no duplicate IDs in the `alumniList`

## Database Schema

The script expects a `profiles` table with these columns:

```sql
CREATE TABLE profiles (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  profile_image_url TEXT,
  location TEXT,
  year_graduated TEXT,
  bio TEXT,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

## Features

- ✅ Automatic image renaming with safe filenames
- ✅ Duplicate handling (upsert)
- ✅ Detailed progress logging
- ✅ Error tracking and reporting
- ✅ Public URL generation
- ✅ Batch processing
- ✅ Summary report

## Notes

- Images are uploaded with `upsert: true`, so running the script multiple times will update existing images
- The script creates a default bio for each alumni based on their year and location
- All images are uploaded to the `alumni/` folder within the `profile-images` bucket
- Failed imports don't stop the script; it continues with remaining profiles
