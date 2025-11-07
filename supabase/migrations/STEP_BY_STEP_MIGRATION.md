# Step-by-Step Gallery Migration Guide

Run each SQL block separately in Supabase SQL Editor.
After each step, click RUN and wait for success before moving to the next.

---

## STEP 1: Cleanup (Run First)

```sql
-- Drop all existing gallery-related objects
DROP POLICY IF EXISTS "Public users can view active albums" ON gallery_albums;
DROP POLICY IF EXISTS "Authenticated users can view all albums" ON gallery_albums;
DROP POLICY IF EXISTS "Admin users can insert albums" ON gallery_albums;
DROP POLICY IF EXISTS "Admin users can update albums" ON gallery_albums;
DROP POLICY IF EXISTS "Admin users can delete albums" ON gallery_albums;

DROP POLICY IF EXISTS "Public users can view active images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can view all images" ON gallery_images;
DROP POLICY IF EXISTS "Admin users can insert images" ON gallery_images;
DROP POLICY IF EXISTS "Admin users can update images" ON gallery_images;
DROP POLICY IF EXISTS "Admin users can delete images" ON gallery_images;

DROP TRIGGER IF EXISTS gallery_albums_updated_at ON gallery_albums;
DROP TRIGGER IF EXISTS gallery_images_updated_at ON gallery_images;

DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS gallery_albums CASCADE;

DROP FUNCTION IF EXISTS update_gallery_updated_at() CASCADE;
```

**Expected:** Success. No rows returned

---

## STEP 2: Create Tables (Run Second)

```sql
-- Create gallery_albums table
CREATE TABLE gallery_albums (
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

-- Create gallery_images table
CREATE TABLE gallery_images (
  id BIGSERIAL PRIMARY KEY,
  album_id BIGINT NOT NULL REFERENCES gallery_albums(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  caption TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

**Expected:** Success. No rows returned

---

## STEP 3: Create Indexes (Run Third)

```sql
CREATE INDEX idx_gallery_images_album_id ON gallery_images(album_id);
CREATE INDEX idx_gallery_albums_slug ON gallery_albums(slug);
CREATE INDEX idx_gallery_albums_display_order ON gallery_albums(display_order);
CREATE INDEX idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX idx_gallery_albums_is_active ON gallery_albums(is_active);
CREATE INDEX idx_gallery_images_is_active ON gallery_images(is_active);
```

**Expected:** Success. No rows returned

---

## STEP 4: Create Trigger Function (Run Fourth)

```sql
CREATE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Expected:** Success. No rows returned

---

## STEP 5: Create Triggers (Run Fifth)

```sql
CREATE TRIGGER gallery_albums_updated_at
  BEFORE UPDATE ON gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();
```

**Expected:** Success. No rows returned

---

## STEP 6: Seed Album Data (Run Sixth)

```sql
INSERT INTO gallery_albums (name, slug, description, display_order, is_active) VALUES
  ('Group Photos', 'group', 'Class photos and group memories from our time together', 1, true),
  ('Sports', 'sports', 'Athletic achievements, tournaments, and sports day celebrations', 2, true),
  ('Hostel Life', 'hostel', 'Dormitory memories, late-night study sessions, and hostel fun', 3, true),
  ('Tours & Trips', 'tours', 'Educational trips, excursions, and travel adventures', 4, true),
  ('Events', 'events', 'School events, cultural programs, and special occasions', 5, true),
  ('Annual Day', 'annual-day', 'Annual day celebrations, performances, and ceremonies', 6, true);
```

**Expected:** Success. 6 rows

---

## STEP 7: Enable RLS (Run Seventh)

```sql
ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;
```

**Expected:** Success. No rows returned

---

## STEP 8: Create Album Policies (Run Eighth)

```sql
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
```

**Expected:** Success. No rows returned

---

## STEP 9: Create Image Policies (Run Ninth)

```sql
CREATE POLICY "Public users can view active images"
  ON gallery_images FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM gallery_albums
      WHERE gallery_albums.id = gallery_images.album_id
      AND gallery_albums.is_active = true
    )
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
```

**Expected:** Success. No rows returned

---

## STEP 10: Grant Permissions (Run Tenth)

```sql
GRANT USAGE ON SEQUENCE gallery_albums_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE gallery_images_id_seq TO authenticated;
GRANT SELECT ON gallery_albums TO anon, authenticated;
GRANT SELECT ON gallery_images TO anon, authenticated;
GRANT ALL ON gallery_albums TO authenticated;
GRANT ALL ON gallery_images TO authenticated;
```

**Expected:** Success. No rows returned

---

## STEP 11: Verify (Run Last)

```sql
SELECT 'gallery_albums' as table_name, COUNT(*) as record_count FROM gallery_albums
UNION ALL
SELECT 'gallery_images' as table_name, COUNT(*) as record_count FROM gallery_images;
```

**Expected:**
```
table_name        | record_count
------------------+-------------
gallery_albums    | 6
gallery_images    | 0
```

---

## ✅ Success Criteria

After completing all 11 steps, you should have:
- ✅ 6 albums in gallery_albums
- ✅ 0 images in gallery_images (normal - none uploaded yet)
- ✅ All indexes created
- ✅ All triggers active
- ✅ All RLS policies in place

If verification shows 6 albums, you're ready for the storage migration!
