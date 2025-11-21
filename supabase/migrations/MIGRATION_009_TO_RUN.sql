-- Drop old UNIQUE constraint on name
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_name_key;

-- Add new composite UNIQUE constraint on (name, year_graduated)
ALTER TABLE profiles ADD CONSTRAINT profiles_name_year_unique UNIQUE (name, year_graduated);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_name_year ON profiles(name, year_graduated);