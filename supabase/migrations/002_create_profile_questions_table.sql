-- Create profile_questions table
-- Master list of questions that can be asked to all alumni
-- This allows admin panel to manage questions dynamically in the future

CREATE TABLE IF NOT EXISTS profile_questions (
  id SERIAL PRIMARY KEY,
  question_text TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create unique index on order_index for active questions
CREATE UNIQUE INDEX IF NOT EXISTS idx_profile_questions_order
ON profile_questions(order_index)
WHERE is_active = true;

-- Add RLS policies
ALTER TABLE profile_questions ENABLE ROW LEVEL SECURITY;

-- Allow public read access to active questions
CREATE POLICY "Public can view active questions"
ON profile_questions FOR SELECT
USING (is_active = true);

-- Only admins can insert/update/delete questions (you can manage via Supabase dashboard)
CREATE POLICY "Admins can manage questions"
ON profile_questions FOR ALL
USING (auth.role() = 'authenticated');

COMMENT ON TABLE profile_questions IS 'Master list of questions asked to alumni in their profile pages';
COMMENT ON COLUMN profile_questions.question_text IS 'The question text displayed to users';
COMMENT ON COLUMN profile_questions.order_index IS 'Display order of questions (1 = first)';
COMMENT ON COLUMN profile_questions.is_active IS 'Whether this question is currently active';
