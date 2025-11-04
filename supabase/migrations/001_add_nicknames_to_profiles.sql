-- Add nicknames column to profiles table
-- This allows storing alumni nicknames like "Karuvaaya", "Junior Amma", etc.

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS nicknames TEXT;

COMMENT ON COLUMN profiles.nicknames IS 'Alumni nicknames from school days, comma-separated if multiple';
