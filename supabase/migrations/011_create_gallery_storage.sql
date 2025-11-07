-- Migration: Create storage bucket and policies for gallery images
-- Purpose: Secure the gallery-images bucket with proper access control
-- Public read access, admin-only write/delete
-- Date: 2025-11-06

-- ==============================================
-- 1. CREATE GALLERY-IMAGES BUCKET
-- ==============================================

-- Create the gallery-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images',
  true,  -- Public read access
  5242880,  -- 5MB file size limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']  -- Allowed image types
)
ON CONFLICT (id) DO UPDATE
SET
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

-- ==============================================
-- 2. STORAGE POLICIES FOR gallery-images BUCKET
-- ==============================================

-- Policy 1: Allow public read access to all gallery images
-- This enables the gallery pages to display images to all visitors
CREATE POLICY "Public can view gallery images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'gallery-images');

-- Policy 2: Allow service role to upload images
-- This restricts image uploads to admin panel operations only
CREATE POLICY "Service role can upload gallery images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'gallery-images'
  AND auth.role() = 'service_role'
);

-- Policy 3: Allow service role to update images
-- This restricts image updates to admin panel operations only
CREATE POLICY "Service role can update gallery images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'gallery-images'
  AND auth.role() = 'service_role'
)
WITH CHECK (
  bucket_id = 'gallery-images'
  AND auth.role() = 'service_role'
);

-- Policy 4: Allow service role to delete images
-- This restricts image deletion to admin panel operations only
CREATE POLICY "Service role can delete gallery images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'gallery-images'
  AND auth.role() = 'service_role'
);

-- ==============================================
-- 3. ADD DOCUMENTATION
-- ==============================================

COMMENT ON POLICY "Public can view gallery images" ON storage.objects IS
  'Allows public read access to gallery images for website display';

COMMENT ON POLICY "Service role can upload gallery images" ON storage.objects IS
  'Restricts gallery image uploads to admin panel (service role) only';

COMMENT ON POLICY "Service role can update gallery images" ON storage.objects IS
  'Restricts gallery image updates to admin panel (service role) only';

COMMENT ON POLICY "Service role can delete gallery images" ON storage.objects IS
  'Restricts gallery image deletion to admin panel (service role) only';

-- ==============================================
-- MIGRATION COMPLETE
-- ==============================================

-- Summary:
-- ✅ Created gallery-images storage bucket with 5MB file limit
-- ✅ Configured public read access for all users
-- ✅ Restricted write/update/delete to service role (admin) only
-- ✅ Added allowed MIME types: JPEG, PNG, WebP, GIF
-- ✅ Added storage policies with proper documentation

-- Recommended folder structure within bucket:
-- gallery-images/
-- ├── thumbnails/           (Album thumbnail images)
-- │   ├── group.jpg
-- │   ├── sports.jpg
-- │   └── ...
-- └── albums/               (Individual gallery images)
--     ├── group/
--     │   ├── img-001.jpg
--     │   └── ...
--     ├── sports/
--     └── ...
