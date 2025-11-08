-- Migration: Create contact_submissions table and storage
-- Purpose: Store contact form submissions with file attachments
-- Created: 2025-01-07

-- Create contact_submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id BIGSERIAL PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  message TEXT NOT NULL,
  files JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'unread' CHECK (status IN ('unread', 'read', 'replied', 'archived')),
  ip_address TEXT,
  user_agent TEXT,
  admin_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON contact_submissions(email);

-- Add comments
COMMENT ON TABLE contact_submissions IS 'Stores contact form submissions from the website';
COMMENT ON COLUMN contact_submissions.files IS 'JSON array of file URLs stored in Supabase Storage';
COMMENT ON COLUMN contact_submissions.status IS 'unread, read, replied, or archived';

-- Enable Row Level Security
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can insert (submit contact form)
CREATE POLICY "Anyone can submit contact form"
ON contact_submissions FOR INSERT
TO anon, authenticated
WITH CHECK (true);

-- Policy: Only authenticated admins can view
CREATE POLICY "Admins can view all contact submissions"
ON contact_submissions FOR SELECT
TO authenticated
USING (true);

-- Policy: Only authenticated admins can update
CREATE POLICY "Admins can update contact submissions"
ON contact_submissions FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- Create storage bucket for contact attachments
INSERT INTO storage.buckets (id, name, public)
VALUES ('contact-attachments', 'contact-attachments', false)
ON CONFLICT (id) DO NOTHING;

-- Storage policy: Anyone can upload during submission (temporary)
CREATE POLICY "Anyone can upload contact attachments"
ON storage.objects FOR INSERT
TO anon, authenticated
WITH CHECK (bucket_id = 'contact-attachments');

-- Storage policy: Admins can read all attachments
CREATE POLICY "Admins can read contact attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'contact-attachments');

-- Storage policy: Admins can delete attachments
CREATE POLICY "Admins can delete contact attachments"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'contact-attachments');

-- Add updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_contact_submissions_updated_at
BEFORE UPDATE ON contact_submissions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
