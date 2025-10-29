/**
 * Template for Alumni Data
 *
 * Copy this array and fill in all 134 alumni profiles
 * Then paste it into importToSupabase.js replacing the alumniList array
 */

const alumniList = [
  // Class of 2000
  {
    id: 1,
    name: 'A Arjoon',
    location: 'Chennai, TN',
    year: '2000',
    originalImage: 'image-1.jpg'
  },
  {
    id: 2,
    name: 'Annamalai Natarajan',
    location: 'Bangalore, KA',
    year: '2000',
    originalImage: 'image-2.jpg'
  },
  {
    id: 3,
    name: 'A S Syed Ahamed Khan',
    location: 'Mumbai, MH',
    year: '2000',
    originalImage: 'image-3.jpg'
  },

  // Continue with remaining profiles...
  // ID 4-134

  /*
  Template for adding more entries:

  {
    id: 4,
    name: 'Full Name',
    location: 'City, State Code',
    year: '2000',
    originalImage: 'image-4.jpg'
  },
  */
]

module.exports = alumniList

/**
 * VALIDATION CHECKLIST:
 *
 * Before importing, verify:
 * ✅ All IDs are unique (1-134)
 * ✅ All IDs are sequential with no gaps
 * ✅ All names are spelled correctly
 * ✅ Location format is "City, State Code"
 * ✅ Year format is '2000' (as string)
 * ✅ All originalImage filenames match actual files
 * ✅ No duplicate image files
 * ✅ All image files exist in source directory
 *
 * NAMING CONVENTIONS:
 * - Name: Use proper capitalization (Title Case)
 * - Location: "City, ST" format (e.g., "Chennai, TN")
 * - Year: String format (e.g., '2000', not 2000)
 * - Image: Match exact filename including extension
 *
 * COMMON MISTAKES TO AVOID:
 * ❌ Missing commas between entries
 * ❌ Missing quotes around strings
 * ❌ Wrong file extensions (.jpg vs .jpeg)
 * ❌ Typos in image filenames
 * ❌ Duplicate IDs
 * ❌ Missing trailing comma on last entry
 */
