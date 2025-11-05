/**
 * Image Cache Busting Utilities
 *
 * Solves the problem of cached images when updating/deleting in Supabase Storage
 * Even if you upload a new image with the same filename, browsers cache the old one.
 */

/**
 * Add cache-busting parameter to image URL
 * @param url - Original image URL (from Supabase Storage or any CDN)
 * @param timestamp - Optional timestamp (use updated_at from database)
 * @returns URL with cache-busting parameter
 */
export function addCacheBuster(url: string | null | undefined, timestamp?: string | number): string {
  // Return placeholder if no URL
  if (!url) return '/placeholder-profile.svg';

  try {
    // Parse URL to handle existing query parameters
    const urlObj = new URL(url, window.location.origin);

    // Use provided timestamp or current time
    const cacheBuster = timestamp
      ? (typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp)
      : Date.now();

    // Add cache-busting parameter
    urlObj.searchParams.set('t', cacheBuster.toString());

    return urlObj.toString();
  } catch (error) {
    // If URL parsing fails, use simple string concatenation
    const separator = url.includes('?') ? '&' : '?';
    const cacheBuster = timestamp
      ? (typeof timestamp === 'string' ? new Date(timestamp).getTime() : timestamp)
      : Date.now();
    return `${url}${separator}t=${cacheBuster}`;
  }
}

/**
 * Force refresh image by adding current timestamp
 * Use this when you know the image was just updated
 */
export function forceRefreshImage(url: string | null | undefined): string {
  return addCacheBuster(url, Date.now());
}

/**
 * Get Supabase Storage public URL with cache busting
 * @param bucket - Storage bucket name
 * @param path - File path in bucket
 * @param projectUrl - Supabase project URL
 * @param timestamp - Optional timestamp for cache control
 */
export function getSupabaseImageUrl(
  bucket: string,
  path: string,
  projectUrl: string,
  timestamp?: string | number
): string {
  const baseUrl = `${projectUrl}/storage/v1/object/public/${bucket}/${path}`;
  return addCacheBuster(baseUrl, timestamp);
}

/**
 * Clear image cache by updating src attribute
 * Useful for updating images after upload without page refresh
 */
export function refreshImageElement(imgElement: HTMLImageElement, newUrl?: string): void {
  const currentSrc = newUrl || imgElement.src.split('?')[0]; // Remove existing query params
  imgElement.src = forceRefreshImage(currentSrc);
}

// Example usage:
// 1. With database timestamp (recommended):
//    <img src={addCacheBuster(profile.profile_image_url, profile.updated_at)} />
//
// 2. Force fresh load:
//    <img src={forceRefreshImage(profile.profile_image_url)} />
//
// 3. After uploading new image:
//    const imgElement = document.getElementById('profile-img') as HTMLImageElement;
//    refreshImageElement(imgElement);
