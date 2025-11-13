-- Migration: Create Gemini AI Documents Table
-- Description: Stores documents uploaded to Gemini RAG Store for AI-powered search

-- Create enum for document categories
CREATE TYPE document_category AS ENUM (
  'alumni_profiles',
  'knowledge_base',
  'events',
  'newsletters',
  'resources'
);

-- Create gemini_documents table
CREATE TABLE IF NOT EXISTS gemini_documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  display_name TEXT NOT NULL,
  file_name TEXT NOT NULL,
  file_size BIGINT,
  file_type TEXT,
  category document_category NOT NULL DEFAULT 'knowledge_base',
  tags TEXT[] DEFAULT '{}',
  description TEXT,
  rag_store_name TEXT,
  gemini_file_name TEXT,
  upload_status TEXT NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploading', 'completed', 'failed')),
  error_message TEXT,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_gemini_documents_category ON gemini_documents(category);
CREATE INDEX IF NOT EXISTS idx_gemini_documents_status ON gemini_documents(upload_status);
CREATE INDEX IF NOT EXISTS idx_gemini_documents_uploaded_by ON gemini_documents(uploaded_by);
CREATE INDEX IF NOT EXISTS idx_gemini_documents_created_at ON gemini_documents(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_gemini_documents_tags ON gemini_documents USING GIN(tags);

-- Enable Row Level Security
ALTER TABLE gemini_documents ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Service role has full access
CREATE POLICY "Service role has full access" ON gemini_documents
  FOR ALL
  USING (auth.role() = 'service_role');

-- RLS Policy: Public can read all documents (for chat functionality)
CREATE POLICY "Public can read documents" ON gemini_documents
  FOR SELECT
  USING (upload_status = 'completed');

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_gemini_documents_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER trigger_update_gemini_documents_updated_at
  BEFORE UPDATE ON gemini_documents
  FOR EACH ROW
  EXECUTE FUNCTION update_gemini_documents_updated_at();

-- Create gemini_chat_history table for storing chat conversations
CREATE TABLE IF NOT EXISTS gemini_chat_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  message_role TEXT NOT NULL CHECK (message_role IN ('user', 'model')),
  message_text TEXT NOT NULL,
  grounding_chunks JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for chat history
CREATE INDEX IF NOT EXISTS idx_gemini_chat_session ON gemini_chat_history(session_id);
CREATE INDEX IF NOT EXISTS idx_gemini_chat_user ON gemini_chat_history(user_id);
CREATE INDEX IF NOT EXISTS idx_gemini_chat_created ON gemini_chat_history(created_at DESC);

-- Enable RLS for chat history
ALTER TABLE gemini_chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can read their own chat history
CREATE POLICY "Users can read own chat history" ON gemini_chat_history
  FOR SELECT
  USING (
    user_id = auth.uid() OR
    user_id IS NULL -- Allow reading anonymous chats
  );

-- RLS Policy: Service role has full access
CREATE POLICY "Service role has full access to chat" ON gemini_chat_history
  FOR ALL
  USING (auth.role() = 'service_role');

-- Add comments
COMMENT ON TABLE gemini_documents IS 'Documents uploaded to Gemini RAG Store for AI-powered search';
COMMENT ON COLUMN gemini_documents.category IS 'Document category for organization';
COMMENT ON COLUMN gemini_documents.tags IS 'Flexible tags for better search and filtering';
COMMENT ON COLUMN gemini_documents.rag_store_name IS 'Reference to Gemini RAG Store';
COMMENT ON COLUMN gemini_documents.upload_status IS 'Current upload status: pending, uploading, completed, failed';

COMMENT ON TABLE gemini_chat_history IS 'Chat conversation history with Gemini AI assistant';
COMMENT ON COLUMN gemini_chat_history.session_id IS 'Unique session identifier for chat conversations';
COMMENT ON COLUMN gemini_chat_history.grounding_chunks IS 'Source citations from documents';
