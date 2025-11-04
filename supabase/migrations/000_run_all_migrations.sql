-- =====================================================
-- RUN ALL MIGRATIONS - Dynamic Profile Pages
-- =====================================================
-- This script runs all migrations needed to make individual
-- profile pages dynamic (fetching data from Supabase)
--
-- Run this in Supabase SQL Editor:
-- 1. Copy entire contents
-- 2. Paste in SQL Editor
-- 3. Click "Run"
-- =====================================================

-- MIGRATION 001: Add nicknames column
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS nicknames TEXT;

COMMENT ON COLUMN profiles.nicknames IS 'Alumni nicknames from school days, comma-separated if multiple';

-- MIGRATION 002: Create profile_questions table
CREATE TABLE IF NOT EXISTS profile_questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_questions_order
ON profile_questions(order_index)
WHERE is_active = true;

ALTER TABLE profile_questions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view active questions" ON profile_questions;
CREATE POLICY "Public can view active questions"
ON profile_questions FOR SELECT
USING (is_active = true);

DROP POLICY IF EXISTS "Admins can manage questions" ON profile_questions;
CREATE POLICY "Admins can manage questions"
ON profile_questions FOR ALL
USING (auth.role() = 'authenticated');

COMMENT ON TABLE profile_questions IS 'Master list of questions asked to alumni in their profile pages';

-- MIGRATION 003: Create profile_answers table
CREATE TABLE IF NOT EXISTS profile_answers (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES profile_questions(id) ON DELETE CASCADE,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_profile_question UNIQUE(profile_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_profile_answers_profile_id
ON profile_answers(profile_id);

CREATE INDEX IF NOT EXISTS idx_profile_answers_question_id
ON profile_answers(question_id);

ALTER TABLE profile_answers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public can view all answers" ON profile_answers;
CREATE POLICY "Public can view all answers"
ON profile_answers FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Admins can manage answers" ON profile_answers;
CREATE POLICY "Admins can manage answers"
ON profile_answers FOR ALL
USING (auth.role() = 'authenticated');

-- Create trigger function if not exists
CREATE OR REPLACE FUNCTION update_profile_answers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

DROP TRIGGER IF EXISTS update_profile_answers_updated_at ON profile_answers;
CREATE TRIGGER update_profile_answers_updated_at
    BEFORE UPDATE ON profile_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_answers_updated_at();

COMMENT ON TABLE profile_answers IS 'Alumni responses to profile questions';

-- MIGRATION 004: Insert 10 questions
INSERT INTO profile_questions (question_text, order_index, is_active) VALUES
('A school memory that still makes you smile', 1, true),
('Your favourite spot in school', 2, true),
('If you get one full day in school today, what would you do...', 3, true),
('What advice would you give to the younger students entering the workforce today:', 4, true),
('A book / movie / experience that changed your perspective of life:', 5, true),
('A personal achievement that means a lot to you:', 6, true),
('Your favourite hobby that you pursue when off work:', 7, true),
('Your favourite go-to song(s) to enliven your spirits', 8, true),
('What does reconnecting with this alumini group mean to you at this stage of your life?', 9, true),
('Would you be open to mentoring younger students or collaborating with alumni?', 10, true)
ON CONFLICT DO NOTHING;

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check if nicknames column added
SELECT column_name, data_type
FROM information_schema.columns
WHERE table_name = 'profiles' AND column_name = 'nicknames';

-- Check questions inserted
SELECT id, question_text, order_index
FROM profile_questions
ORDER BY order_index;

-- Check tables created
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public'
  AND table_name IN ('profile_questions', 'profile_answers')
ORDER BY table_name;

-- =====================================================
-- SUCCESS MESSAGE
-- =====================================================
DO $$
BEGIN
    RAISE NOTICE '✅ All migrations completed successfully!';
    RAISE NOTICE '📊 Tables created: profile_questions, profile_answers';
    RAISE NOTICE '📝 10 questions inserted into profile_questions';
    RAISE NOTICE '🎯 Next step: Add Q&A data via CSV import or Supabase dashboard';
END $$;
