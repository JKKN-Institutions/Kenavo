-- Migration: Strengthen RLS policies for profile_questions and profile_answers tables
-- Purpose: Change from generic 'authenticated' to 'service_role' only for write operations
-- This prevents any authenticated user from modifying questions and answers

-- ============================================
-- PROFILE_QUESTIONS TABLE
-- ============================================

-- Drop existing weak policies
DROP POLICY IF EXISTS "Admins can manage questions" ON profile_questions;

-- Keep public read policy (it's correctly configured)
-- CREATE POLICY "Public can view active questions" ON profile_questions FOR SELECT USING (is_active = true);
-- (This policy already exists from migration 002, no need to recreate)

-- Create strict write policy for service role only
CREATE POLICY "Service role can manage questions"
ON profile_questions
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- ============================================
-- PROFILE_ANSWERS TABLE
-- ============================================

-- Drop existing weak policies
DROP POLICY IF EXISTS "Admins can manage answers" ON profile_answers;

-- Keep public read policy (it's correctly configured)
-- CREATE POLICY "Public can view all answers" ON profile_answers FOR SELECT USING (true);
-- (This policy already exists from migration 003, no need to recreate)

-- Create strict write policy for service role only
CREATE POLICY "Service role can manage answers"
ON profile_answers
FOR ALL
USING (auth.role() = 'service_role')
WITH CHECK (auth.role() = 'service_role');

-- Add comments for documentation
COMMENT ON TABLE profile_questions IS 'Profile questions with RLS. Public read active questions, service role write.';
COMMENT ON TABLE profile_answers IS 'Profile answers with RLS. Public read all, service role write.';
