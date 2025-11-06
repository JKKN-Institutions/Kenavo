# How to Run Gallery System Migration

## Quick Start (2 minutes)

### Step 1: Open Supabase SQL Editor
1. Go to: https://app.supabase.com/project/_/sql/new
2. Or navigate to your project → SQL Editor → New Query

### Step 2: Copy & Paste the Migration SQL
Copy the SQL from: `supabase/migrations/010_create_gallery_system.sql`

Or copy this complete SQL:

```sql
-- Migration: Gallery Management System
-- Description: Creates tables for gallery albums and images
-- Date: 2025-11-06

-- =====================================================
-- 1. CREATE TABLES
-- =====================================================

CREATE TABLE IF NOT EXISTS gallery_albums (
  id BIGSERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  description TEXT,
  thumbnail_url TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS gallery_images (
  id BIGSERIAL PRIMARY KEY,
  album_id BIGINT NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- 2. CREATE INDEXES
-- =====================================================

CREATE INDEX IF NOT EXISTS idx_gallery_images_album_id ON gallery_images(album_id);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON gallery_albums(slug);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_display_order ON gallery_albums(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_albums_is_active ON gallery_albums(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON gallery_images(is_active);

-- =====================================================
-- 3. CREATE TRIGGERS
-- =====================================================

CREATE OR REPLACE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER gallery_albums_updated_at
  BEFORE UPDATE ON gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

-- =====================================================
-- 4. SEED INITIAL ALBUMS
-- =====================================================

INSERT INTO gallery_albums (name, slug, description, display_order, is_active) VALUES
  ('Group Photos', 'group', 'Class photos and group memories from our time together', 1, true),
  ('Sports', 'sports', 'Athletic achievements, tournaments, and sports day celebrations', 2, true),
  ('Hostel Life', 'hostel', 'Dormitory memories, late-night study sessions, and hostel fun', 3, true),
  ('Tours & Trips', 'tours', 'Educational trips, excursions, and travel adventures', 4, true),
  ('Events', 'events', 'School events, cultural programs, and special occasions', 5, true),
  ('Annual Day', 'annual-day', 'Annual day celebrations, performances, and ceremonies', 6, true)
ON CONFLICT (slug) DO NOTHING;

-- =====================================================
-- 5. ENABLE RLS
-- =====================================================

ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- ========== GALLERY_ALBUMS POLICIES ==========

CREATE POLICY "Public users can view active albums"
  ON gallery_albums FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all albums"
  ON gallery_albums FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert albums"
  ON gallery_albums FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin users can update albums"
  ON gallery_albums FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin users can delete albums"
  ON gallery_albums FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- ========== GALLERY_IMAGES POLICIES ==========

CREATE POLICY "Public users can view active images"
  ON gallery_images FOR SELECT
  USING (
    is_active = true
    AND EXISTS (SELECT 1 FROM gallery_albums WHERE gallery_albums.id = gallery_images.album_id AND gallery_albums.is_active = true)
  );

CREATE POLICY "Authenticated users can view all images"
  ON gallery_images FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert images"
  ON gallery_images FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin users can update images"
  ON gallery_images FOR UPDATE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

CREATE POLICY "Admin users can delete images"
  ON gallery_images FOR DELETE
  TO authenticated
  USING (
    EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
  );

-- =====================================================
-- 6. GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SEQUENCE gallery_albums_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE gallery_images_id_seq TO authenticated;
GRANT SELECT ON gallery_albums TO anon, authenticated;
GRANT SELECT ON gallery_images TO anon, authenticated;
GRANT ALL ON gallery_albums TO authenticated;
GRANT ALL ON gallery_images TO authenticated;
```

### Step 3: Run the Migration
1. Click the **"Run"** button (or press Ctrl+Enter)
2. Wait for success message
3. You should see: "Success. No rows returned"

### Step 4: Verify Tables Created
Run this query to verify:
```sql
SELECT * FROM gallery_albums ORDER BY display_order;
```

You should see 6 albums:
- Group Photos
- Sports
- Hostel Life
- Tours & Trips
- Events
- Annual Day

### Step 5: Create Storage Bucket (Optional - for image uploads)

Go to: Storage → Create a new bucket
- Name: `gallery-images`
- Public bucket: YES
- File size limit: 5 MB
- Allowed MIME types: image/jpeg, image/png, image/webp, image/gif

## What This Migration Does

✅ Creates `gallery_albums` table (6 pre-seeded albums)
✅ Creates `gallery_images` table (with foreign key to albums)
✅ Adds performance indexes
✅ Sets up automatic `updated_at` timestamp triggers
✅ Configures RLS policies:
   - Public: Can view active albums and images
   - Admins: Full CRUD access
✅ Grants necessary database permissions

## Next Steps

After running the migration:
1. ✅ Migration complete
2. 🚀 API routes will be created next
3. 🎨 Admin panel UI will be added
4. 🖼️ Frontend integration will connect everything

## Troubleshooting

### Error: "relation already exists"
- This is safe to ignore (means tables already created)
- Migration uses `IF NOT EXISTS` to prevent duplicates

### Error: "permission denied"
- Ensure you're logged in as project owner/admin
- Check you're running query in the correct project

### Albums not showing after migration
Run: `SELECT * FROM gallery_albums;`
- If empty, re-run only the INSERT statement from Step 4

## Migration Status

- [x] Migration file created: `supabase/migrations/010_create_gallery_system.sql`
- [ ] Run migration in Supabase (YOU ARE HERE)
- [ ] Create API routes (Next phase)
- [ ] Create admin UI (Next phase)
- [ ] Update frontend (Next phase)

---

**Estimated time**: 2 minutes
**Risk level**: Low (safe, idempotent migration)
