-- Migration: Create storage bucket and policies for profile images
-- Purpose: Secure the profile-images bucket with proper access control
-- Public read access, admin-only write/delete

-- Create the profile-images bucket if it doesn't exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('profile-images', 'profile-images', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- ============================================
-- STORAGE POLICIES FOR profile-images BUCKET
-- ============================================

-- Policy 1: Allow public read access to all images
-- This enables the directory and profile pages to display images
CREATE POLICY "Public can view profile images"
ON storage.objects
FOR SELECT
USING (bucket_id = 'profile-images');

-- Policy 2: Allow service role to upload images
-- This restricts image uploads to admin panel operations only
CREATE POLICY "Service role can upload profile images"
ON storage.objects
FOR INSERT
WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.role() = 'service_role'
);

-- Policy 3: Allow service role to update images
-- This restricts image updates to admin panel operations only
CREATE POLICY "Service role can update profile images"
ON storage.objects
FOR UPDATE
USING (
  bucket_id = 'profile-images'
  AND auth.role() = 'service_role'
)
WITH CHECK (
  bucket_id = 'profile-images'
  AND auth.role() = 'service_role'
);

-- Policy 4: Allow service role to delete images
-- This restricts image deletion to admin panel operations only
CREATE POLICY "Service role can delete profile images"
ON storage.objects
FOR DELETE
USING (
  bucket_id = 'profile-images'
  AND auth.role() = 'service_role'
);

-- Add comment for documentation
COMMENT ON TABLE storage.buckets IS 'Storage buckets. profile-images bucket is public with service role write access.';
