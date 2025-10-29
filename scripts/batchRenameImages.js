const fs = require('fs')
const path = require('path')
const alumniData = require('./alumniDataMapping')

// Source and destination paths
const sourcePath = 'C:/Users/admin/Projects/Kenavowebsite/demo/images'
const destPath = 'C:/Users/admin/Projects/KenavoFinal/public/renamed-images'

// Statistics tracking
const stats = {
  total: alumniData.length,
  success: 0,
  failed: 0,
  skipped: 0
}

const failedFiles = []
const successFiles = []

// Function to create safe filename
function createSafeFileName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove special characters
    .substring(0, 50)                // Limit length
}

// Function to get file extension
function getFileExtension(filename) {
  return path.extname(filename).toLowerCase()
}

// Create destination folder if not exists
console.log('🚀 Starting batch image rename process...\n')
console.log(`Source: ${sourcePath}`)
console.log(`Destination: ${destPath}`)
console.log(`Total images to process: ${stats.total}\n`)

if (!fs.existsSync(destPath)) {
  console.log('📁 Creating destination folder...')
  fs.mkdirSync(destPath, { recursive: true })
  console.log('✓ Destination folder created\n')
} else {
  console.log('📁 Destination folder already exists\n')
}

// Rename and copy all images
console.log('========== PROCESSING IMAGES ==========\n')

alumniData.forEach((alumni, index) => {
  const progress = `[${index + 1}/${stats.total}]`

  try {
    const sourceFile = path.join(sourcePath, alumni.originalImage)
    const safeName = createSafeFileName(alumni.name)
    const fileExt = getFileExtension(alumni.originalImage)

    // Use original extension instead of hardcoded .jpg
    const destFile = path.join(destPath, `${alumni.id}-${safeName}${fileExt}`)

    // Check if source file exists
    if (!fs.existsSync(sourceFile)) {
      console.log(`${progress} ✗ NOT FOUND: ${alumni.name}`)
      console.log(`           Source: ${alumni.originalImage}\n`)
      failedFiles.push({
        id: alumni.id,
        name: alumni.name,
        originalImage: alumni.originalImage,
        reason: 'File not found'
      })
      stats.failed++
      return
    }

    // Check if destination already exists
    if (fs.existsSync(destFile)) {
      console.log(`${progress} ⚠ SKIPPED: ${alumni.name} (already exists)`)
      console.log(`           File: ${alumni.id}-${safeName}${fileExt}\n`)
      stats.skipped++
      return
    }

    // Copy and rename file
    fs.copyFileSync(sourceFile, destFile)

    // Get file size for reporting
    const fileSize = fs.statSync(destFile).size
    const fileSizeKB = (fileSize / 1024).toFixed(2)

    console.log(`${progress} ✓ SUCCESS: ${alumni.name}`)
    console.log(`           From: ${alumni.originalImage}`)
    console.log(`           To:   ${alumni.id}-${safeName}${fileExt} (${fileSizeKB} KB)\n`)

    successFiles.push({
      id: alumni.id,
      name: alumni.name,
      originalImage: alumni.originalImage,
      newFileName: `${alumni.id}-${safeName}${fileExt}`,
      size: fileSize
    })
    stats.success++

  } catch (error) {
    console.log(`${progress} ✗ ERROR: ${alumni.name}`)
    console.log(`           Error: ${error.message}\n`)
    failedFiles.push({
      id: alumni.id,
      name: alumni.name,
      originalImage: alumni.originalImage,
      reason: error.message
    })
    stats.failed++
  }
})

// Summary Report
console.log('\n========== BATCH RENAME COMPLETE ==========\n')
console.log(`📊 Statistics:`)
console.log(`   Total:    ${stats.total}`)
console.log(`   ✓ Success: ${stats.success}`)
console.log(`   ✗ Failed:  ${stats.failed}`)
console.log(`   ⚠ Skipped: ${stats.skipped}`)

// Calculate total size
if (successFiles.length > 0) {
  const totalSize = successFiles.reduce((sum, file) => sum + file.size, 0)
  const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)
  console.log(`\n📦 Total size: ${totalSizeMB} MB`)
}

// Show failed files if any
if (failedFiles.length > 0) {
  console.log('\n❌ Failed Files:')
  failedFiles.forEach(file => {
    console.log(`   [${file.id}] ${file.name}`)
    console.log(`       Reason: ${file.reason}`)
    console.log(`       Original: ${file.originalImage}`)
  })
}

// Show skipped files if any
if (stats.skipped > 0) {
  console.log('\n⚠️  Files were skipped because they already exist.')
  console.log('   Delete the destination folder to re-process all files.')
}

console.log('\n===========================================')

// Save manifest file
const manifestPath = path.join(destPath, 'rename-manifest.json')
const manifest = {
  timestamp: new Date().toISOString(),
  sourcePath,
  destPath,
  stats,
  successFiles,
  failedFiles
}

fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2))
console.log(`\n📄 Manifest saved: ${manifestPath}`)

// Exit with appropriate code
if (stats.failed > 0) {
  console.log('\n⚠️  Process completed with errors.')
  process.exit(1)
} else {
  console.log('\n✨ All images processed successfully!')
  process.exit(0)
}
