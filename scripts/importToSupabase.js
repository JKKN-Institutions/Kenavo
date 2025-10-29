// Load environment variables from .env.local
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env.local') })

const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')

// Initialize Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Missing Supabase credentials')
  console.error('Please check your .env.local file has:')
  console.error('  NEXT_PUBLIC_SUPABASE_URL=your_url')
  console.error('  NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Import complete alumni list with all 134 profiles
const alumniList = require('./alumniDataMapping.js')

// Function to create safe filename from name
function createSafeFileName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove special characters
    .substring(0, 50)                // Limit length
}

// Upload image with renamed file
async function uploadProfileImage(originalPath, profileName, profileId) {
  try {
    console.log(`  📤 Uploading image for ${profileName}...`)

    // Read the image file
    const fileBuffer = fs.readFileSync(originalPath)

    // Get file extension
    const fileExt = path.extname(originalPath).toLowerCase()

    // Create new filename: id-safe-name.jpg
    const safeFileName = createSafeFileName(profileName)
    const newFileName = `${profileId}-${safeFileName}${fileExt}`

    // Upload to Supabase Storage in profile-images bucket
    const { data, error } = await supabase.storage
      .from('profile-images')
      .upload(`alumni/${newFileName}`, fileBuffer, {
        contentType: `image/${fileExt.replace('.', '')}`,
        upsert: true // Overwrite if exists
      })

    if (error) throw error

    // Get public URL
    const { data: publicUrlData } = supabase.storage
      .from('profile-images')
      .getPublicUrl(`alumni/${newFileName}`)

    console.log(`  ✓ Image uploaded: ${newFileName}`)
    return publicUrlData.publicUrl

  } catch (error) {
    console.error(`  ✗ Error uploading image:`, error.message)
    throw error
  }
}

// Main import function
async function importAllProfiles() {
  console.log('========== STARTING IMPORT PROCESS ==========')
  console.log(`Total profiles to import: ${alumniList.length}\n`)

  const sourcePath = 'C:/Users/admin/Projects/Kenavowebsite/demo/images'
  const successfulImports = []
  const failedImports = []

  for (const alumni of alumniList) {
    try {
      console.log(`\n[${alumni.id}/${alumniList.length}] Processing: ${alumni.name}`)

      // Original image path
      const originalImagePath = path.join(sourcePath, alumni.originalImage)

      // Check if image exists
      if (!fs.existsSync(originalImagePath)) {
        console.log(`  ⚠ Image not found: ${alumni.originalImage}`)
        failedImports.push({ name: alumni.name, reason: 'Image file not found' })
        continue
      }

      // Upload image with new name
      const imageUrl = await uploadProfileImage(
        originalImagePath,
        alumni.name,
        alumni.id
      )

      // Insert profile into database
      console.log(`  💾 Creating database record...`)
      const { data, error } = await supabase
        .from('profiles')
        .insert({
          id: alumni.id,
          name: alumni.name,
          profile_image_url: imageUrl,
          location: alumni.location,
          year_graduated: alumni.year,
          bio: `Alumni from the Class of ${alumni.year}. ${alumni.name} is currently based in ${alumni.location}.`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error

      successfulImports.push(alumni.name)
      console.log(`  ✓ Profile created successfully: ${alumni.name}`)

    } catch (error) {
      console.error(`  ✗ Failed to import ${alumni.name}:`, error.message)
      failedImports.push({ name: alumni.name, reason: error.message })
    }
  }

  // Summary report
  console.log('\n\n========== IMPORT COMPLETE ==========')
  console.log(`✓ Successful: ${successfulImports.length} profiles`)
  console.log(`✗ Failed: ${failedImports.length} profiles`)

  if (failedImports.length > 0) {
    console.log('\n❌ Failed imports:')
    failedImports.forEach(({ name, reason }) => {
      console.log(`  - ${name}: ${reason}`)
    })
  }

  if (successfulImports.length > 0) {
    console.log('\n✅ Successful imports:')
    successfulImports.forEach(name => console.log(`  - ${name}`))
  }

  console.log('\n========================================')
}

// Run the import
if (require.main === module) {
  importAllProfiles()
    .then(() => {
      console.log('\n✨ Import script completed!')
      process.exit(0)
    })
    .catch((error) => {
      console.error('\n💥 Fatal error:', error)
      process.exit(1)
    })
}

module.exports = { importAllProfiles, uploadProfileImage, createSafeFileName, alumniList }
