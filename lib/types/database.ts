// Database types for Kenavo Alumni Directory
// Auto-generated based on Supabase schema

export interface Profile {
  id: number
  name: string
  profile_image_url: string | null
  location: string | null
  year_graduated: string | null
  current_job: string | null
  designation_organisation: string | null
  bio: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
  nicknames: string | null
  created_at: string
  updated_at: string
}

export interface GalleryImage {
  id: number
  profile_id: number
  image_url: string
  caption: string | null
  image_type: string | null
  order_index: number | null
  created_at: string
}

// Profile Question (master question list)
export interface ProfileQuestion {
  id: number
  question_text: string
  order_index: number
  is_active: boolean
  created_at: string
  updated_at: string
}

// Profile Answer (alumni response to a question)
export interface ProfileAnswer {
  id: number
  profile_id: number
  question_id: number
  answer: string | null
  created_at: string
  updated_at: string
}

// Q&A pair for display (joins question and answer)
export interface ProfileQA {
  question_id: number
  question_text: string
  answer: string | null
  order_index: number
}

// Profile with gallery images joined
export interface ProfileWithGallery extends Profile {
  gallery_images: GalleryImage[]
}

// Profile with Q&A answers
export interface ProfileWithAnswers extends Profile {
  qa_responses: ProfileQA[]
}

// Complete profile data (with gallery and Q&A)
export interface ProfileComplete extends Profile {
  gallery_images: GalleryImage[]
  qa_responses: ProfileQA[]
}

// API response types
export type ProfilesResponse = Profile[]
export type SingleProfileResponse = Profile
