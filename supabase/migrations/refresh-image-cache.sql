-- ========================================
-- REFRESH IMAGE CACHE SQL SCRIPT
-- ========================================
-- Use this to force all profile images to reload fresh
-- Run this in Supabase SQL Editor after updating images

-- ========================================
-- OPTION 1: Refresh ALL profiles
-- ========================================
-- Use this if you updated many images at once
UPDATE profiles
SET updated_at = NOW();

-- ========================================
-- OPTION 2: Refresh specific profiles by ID
-- ========================================
-- Replace the IDs with your actual profile IDs
UPDATE profiles
SET updated_at = NOW()
WHERE id IN (39, 40, 41);

-- ========================================
-- OPTION 3: Refresh profiles by name
-- ========================================
-- Replace names with actual profile names
UPDATE profiles
SET updated_at = NOW()
WHERE name IN ('David A', 'David Jacob', 'Debin Davis');

-- ========================================
-- OPTION 4: Refresh profiles updated today
-- ========================================
-- Useful if you just uploaded several new images
UPDATE profiles
SET updated_at = NOW()
WHERE DATE(updated_at) = CURRENT_DATE;

-- ========================================
-- CHECK: View recent updates
-- ========================================
-- Verify which profiles were updated
SELECT id, name, profile_image_url, updated_at
FROM profiles
ORDER BY updated_at DESC
LIMIT 10;

-- ========================================
-- BONUS: Add automatic timestamp trigger
-- ========================================
-- This auto-updates updated_at whenever profile is modified
-- Run this ONCE to set it up

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Drop trigger if it already exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;

-- Create the trigger
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ========================================
-- VERIFY: Check profiles with image URLs
-- ========================================
SELECT
    id,
    name,
    profile_image_url,
    updated_at,
    CASE
        WHEN profile_image_url IS NULL THEN '❌ No image'
        WHEN profile_image_url LIKE '%supabase.co%' THEN '✅ Supabase Storage'
        ELSE '⚠️  External URL'
    END as image_status
FROM profiles
ORDER BY updated_at DESC
LIMIT 20;

-- ========================================
-- USAGE INSTRUCTIONS:
-- ========================================
-- 1. Copy the SQL you need (e.g., OPTION 1)
-- 2. Go to Supabase Dashboard → SQL Editor
-- 3. Paste and run the query
-- 4. Refresh your website (Ctrl + Shift + R)
-- 5. Images should now be fresh! ✅
