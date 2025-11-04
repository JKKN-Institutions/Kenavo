-- Create profile_answers table
-- Stores individual alumni responses to questions
-- One row per profile per question

CREATE TABLE IF NOT EXISTS profile_answers (
  id SERIAL PRIMARY KEY,
  profile_id INTEGER NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  question_id INTEGER NOT NULL REFERENCES profile_questions(id) ON DELETE CASCADE,
  answer TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT unique_profile_question UNIQUE(profile_id, question_id)
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_profile_answers_profile_id
ON profile_answers(profile_id);

CREATE INDEX IF NOT EXISTS idx_profile_answers_question_id
ON profile_answers(question_id);

-- Add RLS policies
ALTER TABLE profile_answers ENABLE ROW LEVEL SECURITY;

-- Allow public read access to all answers
CREATE POLICY "Public can view all answers"
ON profile_answers FOR SELECT
USING (true);

-- Only admins can insert/update/delete answers (you can manage via Supabase dashboard or CSV import)
CREATE POLICY "Admins can manage answers"
ON profile_answers FOR ALL
USING (auth.role() = 'authenticated');

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_profile_answers_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_profile_answers_updated_at
    BEFORE UPDATE ON profile_answers
    FOR EACH ROW
    EXECUTE FUNCTION update_profile_answers_updated_at();

COMMENT ON TABLE profile_answers IS 'Alumni responses to profile questions';
COMMENT ON COLUMN profile_answers.profile_id IS 'Reference to the alumni profile';
COMMENT ON COLUMN profile_answers.question_id IS 'Reference to the question being answered';
COMMENT ON COLUMN profile_answers.answer IS 'The alumni''s answer text';
