-- Migration: Gallery Management System (ULTIMATE FIX)
-- Description: Creates tables for gallery albums and images with proper relationships and RLS policies
-- Date: 2025-11-06
-- Fix: Complete cleanup and recreation to avoid any conflicts

-- =====================================================
-- STEP 1: COMPLETE CLEANUP (START FRESH)
-- =====================================================

-- Drop all policies first (they reference tables)
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

-- Drop triggers
DROP TRIGGER IF EXISTS gallery_albums_updated_at ON gallery_albums;
DROP TRIGGER IF EXISTS gallery_images_updated_at ON gallery_images;

-- Drop tables (CASCADE removes all dependencies)
DROP TABLE IF EXISTS gallery_images CASCADE;
DROP TABLE IF EXISTS gallery_albums CASCADE;

-- Drop function
DROP FUNCTION IF EXISTS update_gallery_updated_at() CASCADE;

-- =====================================================
-- STEP 2: CREATE GALLERY_ALBUMS TABLE
-- =====================================================

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

-- =====================================================
-- STEP 3: CREATE GALLERY_IMAGES TABLE
-- =====================================================

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

-- =====================================================
-- STEP 4: CREATE INDEXES
-- =====================================================

CREATE INDEX idx_gallery_images_album_id ON gallery_images(album_id);
CREATE INDEX idx_gallery_albums_slug ON gallery_albums(slug);
CREATE INDEX idx_gallery_albums_display_order ON gallery_albums(display_order);
CREATE INDEX idx_gallery_images_display_order ON gallery_images(display_order);
CREATE INDEX idx_gallery_albums_is_active ON gallery_albums(is_active);
CREATE INDEX idx_gallery_images_is_active ON gallery_images(is_active);

-- =====================================================
-- STEP 5: CREATE TRIGGER FUNCTION
-- =====================================================

CREATE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- =====================================================
-- STEP 6: CREATE TRIGGERS
-- =====================================================

CREATE TRIGGER gallery_albums_updated_at
  BEFORE UPDATE ON gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

-- =====================================================
-- STEP 7: SEED ALBUM DATA
-- =====================================================

INSERT INTO gallery_albums (name, slug, description, display_order, is_active) VALUES
  ('Group Photos', 'group', 'Class photos and group memories from our time together', 1, true),
  ('Sports', 'sports', 'Athletic achievements, tournaments, and sports day celebrations', 2, true),
  ('Hostel Life', 'hostel', 'Dormitory memories, late-night study sessions, and hostel fun', 3, true),
  ('Tours & Trips', 'tours', 'Educational trips, excursions, and travel adventures', 4, true),
  ('Events', 'events', 'School events, cultural programs, and special occasions', 5, true),
  ('Annual Day', 'annual-day', 'Annual day celebrations, performances, and ceremonies', 6, true);

-- =====================================================
-- STEP 8: ENABLE RLS
-- =====================================================

ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 9: CREATE RLS POLICIES FOR GALLERY_ALBUMS
-- =====================================================

CREATE POLICY "Public users can view active albums"
  ON gallery_albums
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all albums"
  ON gallery_albums
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert albums"
  ON gallery_albums
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can update albums"
  ON gallery_albums
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can delete albums"
  ON gallery_albums
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- STEP 10: CREATE RLS POLICIES FOR GALLERY_IMAGES
-- =====================================================

CREATE POLICY "Public users can view active images"
  ON gallery_images
  FOR SELECT
  USING (
    is_active = true
    AND EXISTS (
      SELECT 1 FROM gallery_albums
      WHERE gallery_albums.id = gallery_images.album_id
      AND gallery_albums.is_active = true
    )
  );

CREATE POLICY "Authenticated users can view all images"
  ON gallery_images
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Admin users can insert images"
  ON gallery_images
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can update images"
  ON gallery_images
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

CREATE POLICY "Admin users can delete images"
  ON gallery_images
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'admin'
    )
  );

-- =====================================================
-- STEP 11: GRANT PERMISSIONS
-- =====================================================

GRANT USAGE ON SEQUENCE gallery_albums_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE gallery_images_id_seq TO authenticated;

GRANT SELECT ON gallery_albums TO anon, authenticated;
GRANT SELECT ON gallery_images TO anon, authenticated;
GRANT ALL ON gallery_albums TO authenticated;
GRANT ALL ON gallery_images TO authenticated;

-- =====================================================
-- VERIFICATION
-- =====================================================

SELECT
  'gallery_albums' as table_name,
  COUNT(*) as record_count
FROM gallery_albums
UNION ALL
SELECT
  'gallery_images' as table_name,
  COUNT(*) as record_count
FROM gallery_images;

-- =====================================================
-- MIGRATION COMPLETE
-- =====================================================
