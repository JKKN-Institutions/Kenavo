// API functions for fetching profile data from Supabase
import { supabase } from '../supabase'
import type { Profile, ProfileWithGallery, ProfileWithAnswers, ProfileQA } from '../types/database'
import { createSlug, slugMatchesName } from '../utils/slug'

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

/**
 * Fetch Q&A responses for a specific profile
 * @param profileId - Profile ID
 * @returns Array of Q&A pairs for this profile
 */
export async function getProfileQA(profileId: number): Promise<ProfileQA[]> {
  const { data, error } = await supabase
    .from('profile_answers')
    .select(`
      question_id,
      answer,
      profile_questions (
        question_text,
        order_index
      )
    `)
    .eq('profile_id', profileId)
    .order('profile_questions(order_index)')

  if (error) {
    // If table doesn't exist yet, return empty array (migrations not run)
    if (error.code === 'PGRST205') {
      console.warn('Profile Q&A tables not created yet. Run migrations first.')
      return []
    }
    console.error('Error fetching profile Q&A:', error)
    throw error
  }

  // Transform data to ProfileQA format
  const qaData = data?.map((item: any) => ({
    question_id: item.question_id,
    question_text: item.profile_questions?.question_text || '',
    answer: item.answer,
    order_index: item.profile_questions?.order_index || 0
  })) || []

  return qaData.sort((a, b) => a.order_index - b.order_index)
}

/**
 * Fetch profile by slug (URL-friendly version of name)
 * @param slug - URL slug (e.g., "david-a", "john-doe")
 * @returns Profile with Q&A responses, or null if not found
 */
export async function getProfileBySlug(slug: string): Promise<ProfileWithAnswers | null> {
  // First, fetch all profiles and find matching slug
  const { data: profiles, error: profileError } = await supabase
    .from('profiles')
    .select('*')

  if (profileError) {
    console.error('Error fetching profiles for slug match:', profileError)
    throw profileError
  }

  // Find profile where slug matches name
  const profile = profiles?.find(p => slugMatchesName(slug, p.name))

  if (!profile) {
    return null
  }

  // Fetch Q&A responses for this profile
  const qaResponses = await getProfileQA(profile.id)

  return {
    ...profile,
    qa_responses: qaResponses
  }
}

/**
 * Get all profile slugs (for static generation)
 * @returns Array of objects with slug for each profile
 */
export async function getAllProfileSlugs(): Promise<{ slug: string }[]> {
  const profiles = await getAllProfiles()
  return profiles.map(profile => ({
    slug: createSlug(profile.name)
  }))
}
