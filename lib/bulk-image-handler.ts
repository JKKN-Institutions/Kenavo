/**
 * Bulk Image Handler Utilities
 * Helper functions for bulk profile image upload operations
 */

// Supported image formats
export const SUPPORTED_IMAGE_FORMATS = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
export const SUPPORTED_FILE_EXTENSIONS = ['.jpg', '.jpeg', '.png', '.webp'];

// Max file size: 5MB
export const MAX_FILE_SIZE = 5 * 1024 * 1024;

/**
 * Extract profile ID from filename
 * Supports patterns like: 123.jpg, 456-john-doe.png, profile-789.jpg
 *
 * @param filename - The image filename
 * @returns Profile ID as number or null if not found
 */
export function extractProfileIdFromFilename(filename: string): number | null {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');

  // Extract first sequence of digits
  const match = nameWithoutExt.match(/(\d+)/);

  if (match) {
    const id = parseInt(match[1], 10);
    return isNaN(id) ? null : id;
  }

  return null;
}

/**
 * Extract storage path from Supabase public URL
 * Example: https://.../storage/v1/object/public/profile-images/profiles/123.jpg
 * Returns: profiles/123.jpg
 *
 * @param url - Full Supabase storage URL
 * @returns Storage path relative to bucket
 */
export function extractPathFromUrl(url: string): string {
  if (!url) return '';

  // Match everything after "profile-images/"
  const match = url.match(/profile-images\/(.+)$/);
  return match ? match[1] : '';
}

/**
 * Validate image file
 * Checks file type, size, and format
 *
 * @param file - File object or blob
 * @param filename - Original filename
 * @returns Object with isValid flag and error message
 */
export function validateImageFile(
  file: Blob,
  filename: string
): { isValid: boolean; error?: string } {
  // Check file extension
  const hasValidExtension = SUPPORTED_FILE_EXTENSIONS.some(ext =>
    filename.toLowerCase().endsWith(ext)
  );

  if (!hasValidExtension) {
    return {
      isValid: false,
      error: `Unsupported format. Use: ${SUPPORTED_FILE_EXTENSIONS.join(', ')}`
    };
  }

  // Check file type
  if (file.type && !SUPPORTED_IMAGE_FORMATS.includes(file.type)) {
    return {
      isValid: false,
      error: `Invalid MIME type: ${file.type}`
    };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File too large (${formatFileSize(file.size)}). Max: 5MB`
    };
  }

  return { isValid: true };
}

/**
 * Format file size in human-readable format
 *
 * @param bytes - File size in bytes
 * @returns Formatted string (e.g., "2.5 MB")
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Generate unique storage filename for profile image
 *
 * @param profileId - Profile ID
 * @param originalExtension - Original file extension
 * @returns Unique filename with timestamp
 */
export function generateStorageFilename(profileId: number, originalExtension: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  const ext = originalExtension.replace('.', '');

  return `${timestamp}-${profileId}-${random}.${ext}`;
}

/**
 * Get file extension from filename
 *
 * @param filename - The filename
 * @returns Extension including dot (e.g., ".jpg")
 */
export function getFileExtension(filename: string): string {
  const match = filename.match(/\.(jpg|jpeg|png|webp)$/i);
  return match ? match[0].toLowerCase() : '.jpg'; // Default to .jpg
}

/**
 * Convert Blob to ArrayBuffer
 *
 * @param blob - The blob to convert
 * @returns Promise resolving to ArrayBuffer
 */
export async function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
  return await blob.arrayBuffer();
}

/**
 * Convert ArrayBuffer to base64 string
 *
 * @param buffer - ArrayBuffer to convert
 * @returns Base64 encoded string
 */
export function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

/**
 * Create data URL from file for preview
 *
 * @param file - Image file
 * @param mimeType - MIME type of the image
 * @returns Promise resolving to data URL
 */
export async function createImageDataUrl(file: Blob, mimeType: string): Promise<string> {
  const buffer = await blobToArrayBuffer(file);
  const base64 = arrayBufferToBase64(buffer);
  return `data:${mimeType};base64,${base64}`;
}

/**
 * Check if filename has valid profile ID
 *
 * @param filename - The filename to check
 * @returns True if filename contains a valid profile ID
 */
export function hasValidProfileId(filename: string): boolean {
  const id = extractProfileIdFromFilename(filename);
  return id !== null && id > 0;
}

/**
 * Extract profile name from filename
 * Supports patterns like: Img-Name.jpg, Img-John Doe.png
 *
 * @param filename - The image filename
 * @returns Extracted name or null
 */
export function extractNameFromFilename(filename: string): string | null {
  // Remove file extension
  const nameWithoutExt = filename.replace(/\.(jpg|jpeg|png|webp)$/i, '');

  // Check if has "Img-" prefix
  if (nameWithoutExt.match(/^Img-/i)) {
    // Extract everything after "Img-"
    const name = nameWithoutExt.replace(/^Img-/i, '').trim();
    return name || null;
  }

  return null;
}

/**
 * Normalize name for matching
 * Removes spaces, punctuation, converts to lowercase
 *
 * @param name - Name to normalize
 * @returns Normalized name
 */
export function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

/**
 * Match extracted name to profile in database
 * Uses fuzzy matching with normalized names
 *
 * @param imageName - Name extracted from image filename
 * @param profiles - Array of profiles from database
 * @returns Matched profile or null
 */
export function matchNameToProfile(
  imageName: string,
  profiles: Array<{ id: number; name: string; profile_image_url?: string | null }>
): { id: number; name: string; profile_image_url: string | null; matchType: string } | null {
  if (!imageName || !profiles || profiles.length === 0) {
    return null;
  }

  // Try exact match first
  const exactMatch = profiles.find(p =>
    p.name.toLowerCase().trim() === imageName.toLowerCase().trim()
  );
  if (exactMatch) {
    return {
      id: exactMatch.id,
      name: exactMatch.name,
      profile_image_url: exactMatch.profile_image_url || null,
      matchType: 'exact'
    };
  }

  // Try normalized match
  const normalizedImageName = normalizeName(imageName);
  const normalizedMatch = profiles.find(p =>
    normalizeName(p.name) === normalizedImageName
  );
  if (normalizedMatch) {
    return {
      id: normalizedMatch.id,
      name: normalizedMatch.name,
      profile_image_url: normalizedMatch.profile_image_url || null,
      matchType: 'normalized'
    };
  }

  // Try partial match
  for (const profile of profiles) {
    const normalizedProfileName = normalizeName(profile.name);
    if (normalizedProfileName.includes(normalizedImageName) ||
        normalizedImageName.includes(normalizedProfileName)) {
      return {
        id: profile.id,
        name: profile.name,
        profile_image_url: profile.profile_image_url || null,
        matchType: 'partial'
      };
    }
  }

  // Try multi-word matching
  const imageWords = normalizedImageName.split(/[^a-z0-9]+/).filter(w => w.length > 2);
  if (imageWords.length >= 2) {
    for (const profile of profiles) {
      const profileWords = normalizeName(profile.name).split(/[^a-z0-9]+/).filter(w => w.length > 2);
      const matchCount = imageWords.filter(w => profileWords.includes(w)).length;

      // If at least 2 words match, consider it a match
      if (matchCount >= 2) {
        return {
          id: profile.id,
          name: profile.name,
          profile_image_url: profile.profile_image_url || null,
          matchType: 'multi-word'
        };
      }
    }
  }

  return null;
}
