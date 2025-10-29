// API functions for fetching profile data from Supabase
import { supabase } from '../supabase'
import type { Profile, ProfileWithGallery } from '../types/database'

/**
 * Fetch all profiles from the database
 * @returns Array of all alumni profiles
 */
export async function getAllProfiles(): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching profiles:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch profiles by graduation year
 * @param year - Graduation year (e.g., "2000")
 * @returns Array of profiles from that year
 */
export async function getProfilesByYear(year: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('year_graduated', year)
    .order('name')

  if (error) {
    console.error('Error fetching profiles by year:', error)
    throw error
  }

  return data || []
}

/**
 * Fetch a single profile by ID with gallery images
 * @param id - Profile ID
 * @returns Profile with associated gallery images
 */
export async function getProfileById(id: number): Promise<ProfileWithGallery | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select(`
      *,
      gallery_images (
        id,
        image_url,
        caption,
        image_type,
        order_index,
        created_at
      )
    `)
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching profile:', error)
    throw error
  }

  return data as ProfileWithGallery
}

/**
 * Search profiles by name or location
 * @param searchTerm - Search query
 * @returns Array of matching profiles
 */
export async function searchProfiles(searchTerm: string): Promise<Profile[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .or(`name.ilike.%${searchTerm}%,location.ilike.%${searchTerm}%`)
    .order('name')

  if (error) {
    console.error('Error searching profiles:', error)
    throw error
  }

  return data || []
}

/**
 * Get profiles count
 * @returns Total number of profiles in database
 */
export async function getProfilesCount(): Promise<number> {
  const { count, error } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  if (error) {
    console.error('Error counting profiles:', error)
    throw error
  }

  return count || 0
}

/**
 * Get unique graduation years
 * @returns Array of distinct graduation years
 */
export async function getGraduationYears(): Promise<string[]> {
  const { data, error } = await supabase
    .from('profiles')
    .select('year_graduated')
    .order('year_graduated')

  if (error) {
    console.error('Error fetching graduation years:', error)
    throw error
  }

  // Extract unique years
  const years = [...new Set(data?.map(item => item.year_graduated).filter(Boolean))]
  return years as string[]
}
