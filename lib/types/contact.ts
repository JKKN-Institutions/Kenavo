// TypeScript types for contact form submissions

export interface ContactSubmission {
  id: number;
  full_name: string;
  email: string;
  message: string;
  files: ContactFile[];
  status: 'unread' | 'read' | 'replied' | 'archived';
  ip_address: string | null;
  user_agent: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ContactFile {
  name: string;
  size: number;
  type: string;
  url: string;
}

export interface ContactFormData {
  full_name: string;
  email: string;
  message: string;
  files: File[];
}

export interface ContactSubmissionResponse {
  success: boolean;
  message: string;
  submissionId?: number;
  error?: string;
}

export interface ContactListResponse {
  submissions: ContactSubmission[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
