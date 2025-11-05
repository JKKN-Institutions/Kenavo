/**
 * Storage Utility Functions
 * Helper functions for managing Supabase Storage operations
 * Includes old image deletion and file management
 */

import { supabaseAdmin } from './supabase-admin';

/**
 * Extract the storage path from a Supabase Storage public URL
 * @param imageUrl - Full public URL from Supabase Storage
 * @returns Storage path (e.g., "profiles/123-abc.jpg") or null if invalid
 */
export function extractStoragePath(imageUrl: string | null): string | null {
  if (!imageUrl) return null;

  try {
    // Parse the URL
    const url = new URL(imageUrl);

    // Extract path after /storage/v1/object/public/profile-images/
    const pathMatch = url.pathname.match(/\/storage\/v1\/object\/public\/profile-images\/(.+)/);

    if (pathMatch && pathMatch[1]) {
      return pathMatch[1];
    }

    return null;
  } catch (error) {
    console.error('Error parsing image URL:', error);
    return null;
  }
}

/**
 * Delete a profile image from Supabase Storage
 * @param imageUrl - Full public URL of the image to delete
 * @returns Promise<{ success: boolean; error?: string }>
 */
export async function deleteProfileImage(
  imageUrl: string | null
): Promise<{ success: boolean; error?: string }> {
  if (!imageUrl) {
    return { success: false, error: 'No image URL provided' };
  }

  const storagePath = extractStoragePath(imageUrl);

  if (!storagePath) {
    return { success: false, error: 'Could not extract storage path from URL' };
  }

  try {
    const { error } = await supabaseAdmin.storage
      .from('profile-images')
      .remove([storagePath]);

    if (error) {
      console.error('Error deleting image from storage:', error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error('Exception while deleting image:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Delete multiple profile images from Supabase Storage
 * @param imageUrls - Array of full public URLs to delete
 * @returns Promise<{ successful: number; failed: number; errors: string[] }>
 */
export async function deleteMultipleProfileImages(
  imageUrls: (string | null)[]
): Promise<{ successful: number; failed: number; errors: string[] }> {
  const storagePaths: string[] = [];
  const errors: string[] = [];

  // Extract all valid storage paths
  for (const url of imageUrls) {
    if (!url) continue;

    const path = extractStoragePath(url);
    if (path) {
      storagePaths.push(path);
    } else {
      errors.push(`Could not extract path from URL: ${url}`);
    }
  }

  if (storagePaths.length === 0) {
    return { successful: 0, failed: errors.length, errors };
  }

  try {
    const { error } = await supabaseAdmin.storage
      .from('profile-images')
      .remove(storagePaths);

    if (error) {
      console.error('Error deleting multiple images:', error);
      errors.push(error.message);
      return { successful: 0, failed: storagePaths.length, errors };
    }

    return { successful: storagePaths.length, failed: 0, errors };
  } catch (error) {
    console.error('Exception while deleting multiple images:', error);
    errors.push(error instanceof Error ? error.message : 'Unknown error');
    return { successful: 0, failed: storagePaths.length, errors };
  }
}

/**
 * Check if a storage path exists
 * @param storagePath - Path in storage bucket (e.g., "profiles/123-abc.jpg")
 * @returns Promise<boolean>
 */
export async function storageFileExists(storagePath: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin.storage
      .from('profile-images')
      .list(storagePath.split('/')[0], {
        search: storagePath.split('/')[1]
      });

    if (error) {
      console.error('Error checking file existence:', error);
      return false;
    }

    return data && data.length > 0;
  } catch (error) {
    console.error('Exception while checking file existence:', error);
    return false;
  }
}

/**
 * Get the size of an image in storage
 * @param imageUrl - Full public URL of the image
 * @returns Promise<number | null> - Size in bytes or null if not found
 */
export async function getImageSize(imageUrl: string): Promise<number | null> {
  const storagePath = extractStoragePath(imageUrl);

  if (!storagePath) return null;

  try {
    const [folder, filename] = storagePath.split('/');
    const { data, error } = await supabaseAdmin.storage
      .from('profile-images')
      .list(folder, {
        search: filename
      });

    if (error || !data || data.length === 0) {
      return null;
    }

    return data[0].metadata?.size || null;
  } catch (error) {
    console.error('Exception while getting image size:', error);
    return null;
  }
}
