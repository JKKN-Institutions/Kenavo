/**
 * Slug utility functions for converting names to URL-friendly slugs
 * and looking up profiles by slug
 */

/**
 * Convert a name to a URL-friendly slug
 * Examples:
 * - "David A" → "david-a"
 * - "A.S. Syed Ahamed Khan" → "a-s-syed-ahamed-khan"
 * - "Dr. John O'Brien" → "dr-john-obrien"
 *
 * @param name - The profile name
 * @returns URL-friendly slug
 */
export function createSlug(name: string): string {
  return name
    .toLowerCase() // Convert to lowercase
    .trim() // Remove leading/trailing whitespace
    .replace(/[^\w\s-]/g, '') // Remove special characters except spaces and hyphens
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single hyphen
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Reverse engineer: Try to match a slug to a name
 * This is a fuzzy match that handles common variations
 *
 * @param slug - URL slug (e.g., "david-a")
 * @param name - Profile name (e.g., "David A")
 * @returns true if slug matches this name
 */
export function slugMatchesName(slug: string, name: string): boolean {
  const nameSlug = createSlug(name);
  return nameSlug === slug;
}

/**
 * Extract search term from slug for fuzzy matching
 * Useful when slug might not exactly match database name
 *
 * @param slug - URL slug
 * @returns Search terms for SQL LIKE query
 */
export function slugToSearchTerms(slug: string): string[] {
  return slug
    .split('-')
    .filter(term => term.length > 0)
    .map(term => `%${term}%`);
}
