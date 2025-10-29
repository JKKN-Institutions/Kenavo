const fs = require('fs')
const path = require('path')

/**
 * Validation script for alumni data
 * Run this before importing to catch errors early
 */

// Get the correct script directory regardless of where script is run from
const scriptDir = __dirname
const alumniDataPath = path.join(scriptDir, 'alumniDataMapping.js')

// Import the alumni list directly from alumniDataMapping.js
const alumniList = require(alumniDataPath)

const sourcePath = 'C:/Users/admin/Projects/Kenavowebsite/demo/images'

// Validation results
const validationResults = {
  totalProfiles: 0,
  errors: [],
  warnings: [],
  info: []
}

// Check for duplicate IDs
function checkDuplicateIds() {
  const ids = alumniList.map(a => a.id)
  const duplicates = ids.filter((id, index) => ids.indexOf(id) !== index)

  if (duplicates.length > 0) {
    validationResults.errors.push(
      `Duplicate IDs found: ${[...new Set(duplicates)].join(', ')}`
    )
  }
}

// Check for sequential IDs
function checkSequentialIds() {
  const ids = alumniList.map(a => a.id).sort((a, b) => a - b)
  const missing = []

  for (let i = 1; i <= alumniList.length; i++) {
    if (!ids.includes(i)) {
      missing.push(i)
    }
  }

  if (missing.length > 0) {
    validationResults.warnings.push(
      `Missing IDs in sequence: ${missing.join(', ')}`
    )
  }
}

// Check required fields
function checkRequiredFields() {
  alumniList.forEach(alumni => {
    const missingFields = []

    if (!alumni.id) missingFields.push('id')
    if (!alumni.name) missingFields.push('name')
    if (!alumni.location) missingFields.push('location')
    if (!alumni.year) missingFields.push('year')
    if (!alumni.originalImage) missingFields.push('originalImage')

    if (missingFields.length > 0) {
      validationResults.errors.push(
        `Profile ID ${alumni.id || 'unknown'}: Missing fields - ${missingFields.join(', ')}`
      )
    }
  })
}

// Check image files exist and sizes
function checkImageFiles() {
  const missingImages = []
  const foundImages = []
  const imageSizes = []
  let totalSize = 0

  alumniList.forEach(alumni => {
    if (alumni.originalImage) {
      const imagePath = path.join(sourcePath, alumni.originalImage)

      if (!fs.existsSync(imagePath)) {
        missingImages.push({
          profile: alumni.name,
          image: alumni.originalImage
        })
      } else {
        const stats = fs.statSync(imagePath)
        const sizeKB = (stats.size / 1024).toFixed(2)
        const sizeMB = (stats.size / 1024 / 1024).toFixed(2)

        foundImages.push(alumni.originalImage)
        imageSizes.push({
          id: alumni.id,
          name: alumni.name,
          filename: alumni.originalImage,
          size: stats.size,
          sizeKB: parseFloat(sizeKB),
          sizeMB: parseFloat(sizeMB)
        })
        totalSize += stats.size
      }
    }
  })

  if (missingImages.length > 0) {
    validationResults.errors.push(
      `Missing image files (${missingImages.length}):`
    )
    missingImages.forEach(({ profile, image }) => {
      validationResults.errors.push(`  - ${profile}: ${image}`)
    })
  }

  validationResults.info.push(`Found ${foundImages.length} images`)

  if (imageSizes.length > 0) {
    const avgSize = totalSize / imageSizes.length
    const avgSizeKB = (avgSize / 1024).toFixed(2)
    const totalSizeMB = (totalSize / 1024 / 1024).toFixed(2)

    validationResults.info.push(`Total size: ${totalSizeMB} MB`)
    validationResults.info.push(`Average image size: ${avgSizeKB} KB`)

    // Check for unusually large images (> 500 KB)
    const largeImages = imageSizes.filter(img => img.sizeKB > 500)
    if (largeImages.length > 0) {
      validationResults.warnings.push(
        `Large images found (${largeImages.length} > 500 KB):`
      )
      largeImages.forEach(img => {
        validationResults.warnings.push(`  - [${img.id}] ${img.name}: ${img.sizeKB} KB`)
      })
    }

    // Check for unusually small images (< 10 KB - might be corrupted)
    const smallImages = imageSizes.filter(img => img.sizeKB < 10)
    if (smallImages.length > 0) {
      validationResults.warnings.push(
        `Very small images found (${smallImages.length} < 10 KB - may be corrupted):`
      )
      smallImages.forEach(img => {
        validationResults.warnings.push(`  - [${img.id}] ${img.name}: ${img.sizeKB} KB`)
      })
    }
  }
}

// Check duplicate image files
function checkDuplicateImages() {
  const images = alumniList.map(a => a.originalImage)
  const duplicates = images.filter((img, index) => images.indexOf(img) !== index)

  if (duplicates.length > 0) {
    validationResults.warnings.push(
      `Duplicate image filenames (${[...new Set(duplicates)].length}): ${[...new Set(duplicates)].join(', ')}`
    )
  }
}

// Check location format
function checkLocationFormat() {
  const invalidLocations = []

  alumniList.forEach(alumni => {
    // Expected format: "City, State" or "City, ST" (2+ letters after comma)
    // Allows both "Chennai, TN" and "Chennai, Tamil Nadu"
    if (alumni.location && !alumni.location.match(/^.+,\s*.+$/)) {
      invalidLocations.push({
        profile: alumni.name,
        location: alumni.location
      })
    }
  })

  if (invalidLocations.length > 0) {
    validationResults.warnings.push(
      `Invalid location format (${invalidLocations.length}):`
    )
    invalidLocations.forEach(({ profile, location }) => {
      validationResults.warnings.push(`  - ${profile}: "${location}"`)
    })
    validationResults.info.push('Expected format: "City, State" (e.g., "Chennai, Tamil Nadu" or "Chennai, TN")')
  }
}

// Check year format
function checkYearFormat() {
  const invalidYears = []

  alumniList.forEach(alumni => {
    if (alumni.year && typeof alumni.year !== 'string') {
      invalidYears.push({
        profile: alumni.name,
        year: alumni.year,
        type: typeof alumni.year
      })
    }
  })

  if (invalidYears.length > 0) {
    validationResults.warnings.push(
      `Invalid year format (should be string, not number):`
    )
    invalidYears.forEach(({ profile, year, type }) => {
      validationResults.warnings.push(`  - ${profile}: ${year} (${type})`)
    })
  }
}

// Function to create safe filename (same as in import scripts)
function createSafeFileName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '-')           // Replace spaces with hyphens
    .replace(/[^a-z0-9-]/g, '')     // Remove special characters
    .substring(0, 50)                // Limit length
}

// Check renamed filename naming convention
function checkNamingConvention() {
  const namingIssues = []

  alumniList.forEach(alumni => {
    const safeName = createSafeFileName(alumni.name)
    const ext = path.extname(alumni.originalImage).toLowerCase()
    const expectedFilename = `${alumni.id}-${safeName}${ext}`

    // Check if safe name is too short (might indicate issues)
    if (safeName.length < 3) {
      namingIssues.push({
        id: alumni.id,
        name: alumni.name,
        safeName,
        issue: 'Safe name too short (< 3 chars)'
      })
    }

    // Check if name has special characters that will be removed
    const hasSpecialChars = /[^a-zA-Z0-9\s-]/.test(alumni.name)
    if (hasSpecialChars) {
      validationResults.info.push(
        `[${alumni.id}] ${alumni.name} → ${expectedFilename} (special chars removed)`
      )
    }
  })

  if (namingIssues.length > 0) {
    validationResults.warnings.push(
      `Naming convention issues (${namingIssues.length}):`
    )
    namingIssues.forEach(issue => {
      validationResults.warnings.push(
        `  - [${issue.id}] ${issue.name}: ${issue.issue} (becomes "${issue.safeName}")`
      )
    })
  }

  validationResults.info.push(`All names will follow pattern: {id}-{safe-name}.{ext}`)
}

// Run all validations
function runValidation() {
  console.log('🔍 Starting validation...\n')

  validationResults.totalProfiles = alumniList.length

  if (alumniList.length === 0) {
    console.log('❌ ERROR: No alumni data found!')
    console.log('Make sure alumniList is exported from importToSupabase.js')
    return
  }

  checkDuplicateIds()
  checkSequentialIds()
  checkRequiredFields()
  checkImageFiles()
  checkDuplicateImages()
  checkLocationFormat()
  checkYearFormat()
  checkNamingConvention()

  // Print results
  console.log('========== VALIDATION RESULTS ==========\n')
  console.log(`📊 Total Profiles: ${validationResults.totalProfiles}`)

  if (validationResults.errors.length > 0) {
    console.log(`\n❌ ERRORS (${validationResults.errors.length}):`)
    validationResults.errors.forEach(error => console.log(`   ${error}`))
  }

  if (validationResults.warnings.length > 0) {
    console.log(`\n⚠️  WARNINGS (${validationResults.warnings.length}):`)
    validationResults.warnings.forEach(warning => console.log(`   ${warning}`))
  }

  if (validationResults.info.length > 0) {
    console.log(`\nℹ️  INFO:`)
    validationResults.info.forEach(info => console.log(`   ${info}`))
  }

  console.log('\n========================================')

  // Final verdict
  if (validationResults.errors.length === 0) {
    if (validationResults.warnings.length === 0) {
      console.log('\n✅ All validations passed! Ready to import.')
    } else {
      console.log('\n⚠️  Validation passed with warnings. Review warnings before importing.')
    }
  } else {
    console.log('\n❌ Validation failed! Fix errors before importing.')
  }

  console.log('\n')

  // Save validation report
  const reportPath = path.join(scriptDir, 'validation-report.json')
  const report = {
    timestamp: new Date().toISOString(),
    stats: {
      totalProfiles: validationResults.totalProfiles,
      errorCount: validationResults.errors.length,
      warningCount: validationResults.warnings.length,
      infoCount: validationResults.info.length
    },
    errors: validationResults.errors,
    warnings: validationResults.warnings,
    info: validationResults.info,
    passed: validationResults.errors.length === 0
  }

  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2))
    console.log(`📄 Validation report saved: ${reportPath}`)
  } catch (error) {
    console.log(`⚠️  Could not save report: ${error.message}`)
  }

  // Return exit code
  return validationResults.errors.length === 0 ? 0 : 1
}

// Run validation
if (require.main === module) {
  try {
    const exitCode = runValidation()
    process.exit(exitCode)
  } catch (error) {
    console.error('💥 Validation script error:', error.message)
    console.error('Stack:', error.stack)
    process.exit(1)
  }
}

module.exports = { runValidation, validationResults }
