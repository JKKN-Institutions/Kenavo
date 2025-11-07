-- Migration: Gallery Management System (FIXED VERSION)
-- Description: Creates tables for gallery albums and images with proper relationships and RLS policies
-- Date: 2025-11-06
-- Fix: Ensures proper execution order and handles existing tables

-- =====================================================
-- STEP 1: DROP EXISTING TABLES IF NEEDED (CAREFUL!)
-- =====================================================

-- Uncomment these lines ONLY if you want to start fresh
-- DROP TABLE IF EXISTS gallery_images CASCADE;
-- DROP TABLE IF EXISTS gallery_albums CASCADE;

-- =====================================================
-- STEP 2: CREATE GALLERY_ALBUMS TABLE
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gallery_albums') THEN
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
        RAISE NOTICE 'Table gallery_albums created';
    ELSE
        RAISE NOTICE 'Table gallery_albums already exists';
    END IF;
END $$;

-- =====================================================
-- STEP 3: CREATE GALLERY_IMAGES TABLE
-- =====================================================

DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'gallery_images') THEN
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
        RAISE NOTICE 'Table gallery_images created';
    ELSE
        RAISE NOTICE 'Table gallery_images already exists';
    END IF;
END $$;

-- =====================================================
-- STEP 4: CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index on album_id for faster image lookups by album
CREATE INDEX IF NOT EXISTS idx_gallery_images_album_id ON gallery_images(album_id);

-- Index on slug for faster album lookups by slug
CREATE INDEX IF NOT EXISTS idx_gallery_albums_slug ON gallery_albums(slug);

-- Index on display_order for sorted queries
CREATE INDEX IF NOT EXISTS idx_gallery_albums_display_order ON gallery_albums(display_order);
CREATE INDEX IF NOT EXISTS idx_gallery_images_display_order ON gallery_images(display_order);

-- Index on is_active for filtering active items
CREATE INDEX IF NOT EXISTS idx_gallery_albums_is_active ON gallery_albums(is_active);
CREATE INDEX IF NOT EXISTS idx_gallery_images_is_active ON gallery_images(is_active);

-- =====================================================
-- STEP 5: CREATE TRIGGER FOR UPDATED_AT
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gallery_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS gallery_albums_updated_at ON gallery_albums;
DROP TRIGGER IF EXISTS gallery_images_updated_at ON gallery_images;

-- Trigger for gallery_albums
CREATE TRIGGER gallery_albums_updated_at
  BEFORE UPDATE ON gallery_albums
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

-- Trigger for gallery_images
CREATE TRIGGER gallery_images_updated_at
  BEFORE UPDATE ON gallery_images
  FOR EACH ROW
  EXECUTE FUNCTION update_gallery_updated_at();

-- =====================================================
-- STEP 6: SEED INITIAL ALBUM DATA
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
-- STEP 7: ENABLE ROW LEVEL SECURITY
-- =====================================================

ALTER TABLE gallery_albums ENABLE ROW LEVEL SECURITY;
ALTER TABLE gallery_images ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- STEP 8: CREATE RLS POLICIES FOR GALLERY_ALBUMS
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public users can view active albums" ON gallery_albums;
DROP POLICY IF EXISTS "Authenticated users can view all albums" ON gallery_albums;
DROP POLICY IF EXISTS "Admin users can insert albums" ON gallery_albums;
DROP POLICY IF EXISTS "Admin users can update albums" ON gallery_albums;
DROP POLICY IF EXISTS "Admin users can delete albums" ON gallery_albums;

-- Policy: Public can view active albums
CREATE POLICY "Public users can view active albums"
  ON gallery_albums
  FOR SELECT
  USING (is_active = true);

-- Policy: Authenticated users can view all albums
CREATE POLICY "Authenticated users can view all albums"
  ON gallery_albums
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admin users can insert albums
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

-- Policy: Admin users can update albums
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

-- Policy: Admin users can delete albums
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
-- STEP 9: CREATE RLS POLICIES FOR GALLERY_IMAGES
-- =====================================================

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public users can view active images" ON gallery_images;
DROP POLICY IF EXISTS "Authenticated users can view all images" ON gallery_images;
DROP POLICY IF EXISTS "Admin users can insert images" ON gallery_images;
DROP POLICY IF EXISTS "Admin users can update images" ON gallery_images;
DROP POLICY IF EXISTS "Admin users can delete images" ON gallery_images;

-- Policy: Public can view active images in active albums
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

-- Policy: Authenticated users can view all images
CREATE POLICY "Authenticated users can view all images"
  ON gallery_images
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Admin users can insert images
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

-- Policy: Admin users can update images
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

-- Policy: Admin users can delete images
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
-- STEP 10: GRANT PERMISSIONS
-- =====================================================

-- Grant usage on sequences to authenticated users
GRANT USAGE ON SEQUENCE gallery_albums_id_seq TO authenticated;
GRANT USAGE ON SEQUENCE gallery_images_id_seq TO authenticated;

-- Grant permissions on tables
GRANT SELECT ON gallery_albums TO anon, authenticated;
GRANT SELECT ON gallery_images TO anon, authenticated;
GRANT ALL ON gallery_albums TO authenticated;
GRANT ALL ON gallery_images TO authenticated;

-- =====================================================
-- VERIFICATION QUERY
-- =====================================================

-- Run this to verify setup
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

-- Summary:
-- ✅ Created gallery_albums table with 6 seeded albums
-- ✅ Created gallery_images table with album relationship
-- ✅ Added indexes for performance optimization
-- ✅ Set up updated_at triggers
-- ✅ Configured RLS policies (public read, admin write)
-- ✅ Granted necessary permissions
