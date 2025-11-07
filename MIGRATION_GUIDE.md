# 🚀 Gallery System Migration Guide

## Two Migration Methods

### Method 1: Automated (Recommended) ⚡
Use a Supabase database function to run migrations programmatically.

### Method 2: Manual (Fallback) 📝
Run migrations directly in Supabase SQL Editor.

---

## ⚡ Method 1: Automated Migration (NEW!)

### Step 1: Create Migration Function (One-Time Setup)

1. Go to: **https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/sql/new**
2. Open file: `supabase/migrations/009_create_migration_function.sql`
3. Copy ALL contents and paste into SQL Editor
4. Click **RUN**

This creates a special function that can execute migration SQL.

### Step 2: Run Automated Migration Script

```bash
node scripts/run-gallery-migration-via-function.js
```

**Expected Output:**
```
✅ Migration function is available
✅ Migration 010 completed successfully
✅ Migration 011 completed successfully
✅ Gallery albums verified:
   - Group Photos (group)
   - Sports (sports)
   - Hostel Life (hostel)
   - Tours & Trips (tours)
   - Events (events)
   - Annual Day (annual-day)
✅ Storage bucket verified
🎉 Gallery system is ready to use!
```

### Step 3 (Optional): Drop Unsafe Function

For security, after migration completes, run in SQL Editor:

```sql
DROP FUNCTION IF EXISTS public.run_migration_sql_unsafe(text);
```

---

## 📝 Method 2: Manual Migration (Fallback)

If automated method fails, use this approach.

## ✅ Migration Steps (5 minutes)

### Step 1: Open Supabase SQL Editor

1. Go to: **https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/sql/new**
2. Log in if prompted

### Step 2: Run Migration 010 (Gallery Tables)

1. Open file: `supabase/migrations/010_create_gallery_system.sql`
2. Copy **ALL contents** (Ctrl+A, Ctrl+C)
3. Paste into Supabase SQL Editor
4. Click **"RUN"** button (bottom right)
5. Wait for success message

**Expected Output:**
```
Success. No rows returned
```

### Step 3: Run Migration 011 (Storage Bucket)

1. Open file: `supabase/migrations/011_create_gallery_storage.sql`
2. Copy **ALL contents**
3. Paste into SQL Editor (clear previous query first)
4. Click **"RUN"**

**Expected Output:**
```
Success. No rows returned
```

### Step 4: Verify Setup

Run this verification query in SQL Editor:

```sql
-- Check if tables exist
SELECT 'Albums' as table_name, COUNT(*) as count FROM gallery_albums
UNION ALL
SELECT 'Images' as table_name, COUNT(*) as count FROM gallery_images;

-- List all albums
SELECT id, name, slug, is_active FROM gallery_albums ORDER BY display_order;
```

**Expected Results:**
- Albums: 6 rows (Group Photos, Sports, Hostel Life, Tours & Trips, Events, Annual Day)
- Images: 0 rows (normal - no images uploaded yet)

### Step 5: Verify Storage Bucket

1. Go to: **https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/storage/buckets**
2. Look for bucket named: **`gallery-images`**
3. Should show: **Public** access, **5 MB** file limit

---

## ✅ Post-Migration Checklist

After running migrations:

- [ ] 6 albums visible in database
- [ ] `gallery-images` storage bucket exists
- [ ] Storage bucket is PUBLIC
- [ ] RLS policies are enabled
- [ ] No error messages in SQL Editor

---

## 🔧 Troubleshooting

### Error: "relation already exists"
**Solution**: Tables already created - safe to ignore, continue to next step

### Error: "permission denied"
**Solution**: Ensure you're logged in as project owner/admin

### Error: "policy already exists"
**Solution**: Policies already created - safe to ignore

### Can't find SQL Editor
**Direct Link**: https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/sql/new

---

## 📊 What Gets Created

### Database Tables
1. **`gallery_albums`** - Album metadata (6 pre-seeded albums)
2. **`gallery_images`** - Individual images within albums

### Indexes (Performance)
- Album lookups by slug
- Image lookups by album
- Display order sorting
- Active/inactive filtering

### RLS Policies
- **Public**: View active albums/images
- **Authenticated**: View all albums/images
- **Admin**: Full CRUD access

### Storage Bucket
- **Name**: `gallery-images`
- **Access**: Public read, admin write
- **Limit**: 5 MB per file
- **Types**: JPEG, PNG, WebP, GIF

### Folder Structure
```
gallery-images/
├── thumbnails/       (Album covers)
└── albums/           (Gallery images)
    ├── group/
    ├── sports/
    ├── hostel/
    ├── tours/
    ├── events/
    └── annual-day/
```

---

## 🎯 Next Steps

After successful migration:

1. **Start dev server**: `npm run dev`
2. **Open admin panel**: http://localhost:3000/admin-panel
3. **Click "Gallery" tab** (once implemented)
4. **Upload test images** to verify system

---

## 💡 Why Can't This Be Automated?

**Security by Design:**
- Supabase blocks raw SQL execution via REST API
- MCP servers don't have SQL execution permissions
- CLI requires local project initialization
- Prevents SQL injection and unauthorized DDL changes

**This is normal and affects ALL Supabase projects!**

---

## 📞 Support

If migration fails:
1. Check you're logged into correct Supabase project
2. Verify project ref: `rihoufidmnqtffzqhplc`
3. Try running statements one-by-one
4. Check Supabase status: https://status.supabase.com
