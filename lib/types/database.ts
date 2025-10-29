// Database types for Kenavo Alumni Directory
// Auto-generated based on Supabase schema

export interface Profile {
  id: number
  name: string
  profile_image_url: string | null
  location: string | null
  year_graduated: string | null
  current_job: string | null
  company: string | null
  bio: string | null
  email: string | null
  phone: string | null
  linkedin_url: string | null
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

// Profile with gallery images joined
export interface ProfileWithGallery extends Profile {
  gallery_images: GalleryImage[]
}

// API response types
export type ProfilesResponse = Profile[]
export type SingleProfileResponse = Profile
