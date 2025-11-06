const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

/**
 * CORRECT IMAGE MAPPING SCRIPT
 *
 * This script matches images to profiles by NAME, not row number.
 * Uses original ZIP filenames that contain profile names.
 *
 * PREREQUISITE:
 * 1. Upload profiles_upload.csv and additional_profiles.csv
 * 2. Export profile IDs from Admin Panel
 * 3. Save as: C:\Users\admin\Downloads\exported_profile_ids.csv
 */

// Normalize name for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '') // Remove all spaces
    .replace(/[^a-z0-9]/g, ''); // Remove punctuation
}

// Extract name from image filename
function extractNameFromFilename(filename) {
  // Remove "Img-" prefix and file extension
  let name = filename
    .replace(/^Img-/i, '')
    .replace(/\.(png|jpg|jpeg|webp)$/i, '')
    .trim();
  return name;
}

// Parse CSV
function parseCSV(content) {
  const lines = content.split('\n');
  const result = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    const parts = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim().replace(/^"|"$/g, ''));
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim().replace(/^"|"$/g, ''));
    result.push(parts);
  }

  return result;
}

// Read exported profile IDs
function readExportedProfileIds(csvPath) {
  const content = fs.readFileSync(csvPath, 'utf-8');
  const rows = parseCSV(content);

  const mapping = new Map();
  const normalizedMapping = new Map();

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    const id = parseInt(row[0], 10);
    const name = row[1];

    if (!isNaN(id) && name) {
      mapping.set(name, id);
      normalizedMapping.set(normalizeName(name), { id, originalName: name });
    }
  }

  console.log(`Loaded ${mapping.size} profiles from database export`);
  return { mapping, normalizedMapping };
}

// Find best match for an image name
function findBestMatch(imageName, normalizedMapping, mapping) {
  // Try exact match first
  if (mapping.has(imageName)) {
    return { id: mapping.get(imageName), name: imageName, matchType: 'exact' };
  }

  // Try normalized match
  const normalized = normalizeName(imageName);
  if (normalizedMapping.has(normalized)) {
    const match = normalizedMapping.get(normalized);
    return { id: match.id, name: match.originalName, matchType: 'normalized' };
  }

  // Try partial matches
  for (const [key, value] of normalizedMapping.entries()) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return { id: value.id, name: value.originalName, matchType: 'partial' };
    }
  }

  // Try word-by-word matching
  const imageWords = normalized.split(/[^a-z0-9]+/).filter(w => w.length > 2);

  for (const [key, value] of normalizedMapping.entries()) {
    const profileWords = key.split(/[^a-z0-9]+/).filter(w => w.length > 2);
    const matchCount = imageWords.filter(w => profileWords.includes(w)).length;

    // If at least 2 words match, consider it a match
    if (matchCount >= 2) {
      return { id: value.id, name: value.originalName, matchType: 'multi-word' };
    }
  }

  return null;
}

// Main function
async function matchImagesByName() {
  const zipPath = 'C:\\Users\\admin\\Downloads\\New set ai-20251106T054135Z-1-001.zip';
  const exportedCSVPath = 'C:\\Users\\admin\\Downloads\\exported_profile_ids.csv';
  const outputDir = 'C:\\Users\\admin\\Downloads\\correct_images';
  const outputZipPath = 'C:\\Users\\admin\\Downloads\\profile_images_CORRECT.zip';

  console.log('\n' + '='.repeat(70));
  console.log('CORRECT IMAGE MAPPING - Name-Based Matching');
  console.log('='.repeat(70) + '\n');

  // Check if exported profile IDs exists
  if (!fs.existsSync(exportedCSVPath)) {
    console.error('❌ ERROR: exported_profile_ids.csv not found!\n');
    console.error('You must:');
    console.error('1. Go to Admin Panel → Bulk Update tab');
    console.error('2. Click "🆔 Export Profile IDs" button');
    console.error('3. Save file as: C:\\Users\\admin\\Downloads\\exported_profile_ids.csv');
    console.error('4. Then run this script again\n');
    process.exit(1);
  }

  // Check if source ZIP exists
  if (!fs.existsSync(zipPath)) {
    console.error('❌ ERROR: Source ZIP not found!\n');
    console.error(`Expected: ${zipPath}\n`);
    process.exit(1);
  }

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Load profile IDs
  console.log('📂 Loading exported profile IDs...');
  const { mapping, normalizedMapping } = readExportedProfileIds(exportedCSVPath);

  // Process ZIP
  console.log('📦 Extracting and processing images...\n');
  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();

  const results = {
    total: 0,
    matched: 0,
    unmatched: 0,
    matchDetails: [],
    unmatchedFiles: []
  };

  zipEntries.forEach(entry => {
    if (entry.isDirectory) return;

    const filename = entry.entryName.split('/').pop();

    // Skip non-image files
    if (!filename.match(/\.(png|jpg|jpeg|webp)$/i)) return;

    // Skip macOS metadata
    if (filename.startsWith('._') || entry.entryName.includes('__MACOSX')) return;

    results.total++;

    // Extract name from filename
    const imageName = extractNameFromFilename(filename);
    const fileExt = path.extname(filename);

    // Find matching profile
    const match = findBestMatch(imageName, normalizedMapping, mapping);

    if (match) {
      results.matched++;

      // New filename: {profile_id}.png
      const newFilename = `${match.id}${fileExt}`;
      const outputPath = path.join(outputDir, newFilename);

      // Save renamed file
      fs.writeFileSync(outputPath, entry.getData());

      results.matchDetails.push({
        originalFilename: filename,
        extractedName: imageName,
        matchedProfileName: match.name,
        profileId: match.id,
        newFilename,
        matchType: match.matchType
      });

      const matchIcon = match.matchType === 'exact' ? '✓' :
                       match.matchType === 'normalized' ? '≈' : '~';

      console.log(`${matchIcon} ${filename}`);
      console.log(`  → Matched: "${match.name}" (ID: ${match.id})`);
      console.log(`  → Renamed: ${newFilename}\n`);

    } else {
      results.unmatched++;
      results.unmatchedFiles.push({ filename, extractedName: imageName });

      console.log(`❌ ${filename}`);
      console.log(`  → No match found for: "${imageName}"\n`);
    }
  });

  // Create final ZIP
  if (results.matched > 0) {
    console.log('📦 Creating final ZIP file...');
    const finalZip = new AdmZip();

    fs.readdirSync(outputDir).forEach(file => {
      const filePath = path.join(outputDir, file);
      finalZip.addLocalFile(filePath);
    });

    finalZip.writeZip(outputZipPath);
    console.log(`✓ Created: ${outputZipPath}\n`);
  }

  // Generate report
  const report = `
${'='.repeat(80)}
CORRECT IMAGE MAPPING REPORT - Name-Based Matching
${'='.repeat(80)}
Generated: ${new Date().toISOString()}

SUMMARY:
--------
Total images processed: ${results.total}
Successfully matched: ${results.matched}
Unmatched: ${results.unmatched}
Success rate: ${((results.matched / results.total) * 100).toFixed(1)}%

MATCHED IMAGES (${results.matched}):
${'-'.repeat(80)}
${'Original Filename'.padEnd(40)} | ${'Matched Profile'.padEnd(25)} | ${'ID'.padEnd(5)} | Match
${'-'.repeat(80)}
${results.matchDetails.map(d =>
  `${d.originalFilename.padEnd(40)} | ${d.matchedProfileName.padEnd(25)} | ${d.profileId.toString().padEnd(5)} | ${d.matchType}`
).join('\n')}

${results.unmatched > 0 ? `
UNMATCHED IMAGES (${results.unmatched}):
${'-'.repeat(80)}
These images could not be matched to any profile:
${results.unmatchedFiles.map(f =>
  `- ${f.filename}\n  Extracted name: "${f.extractedName}"`
).join('\n')}

TROUBLESHOOTING UNMATCHED IMAGES:
- Verify these people exist in your uploaded profiles
- Check name spelling in both image filename and database
- If these are new people, upload their profiles first
- You can manually upload these images via admin panel
` : '✅ ALL IMAGES MATCHED SUCCESSFULLY!'}

OUTPUT FILES:
-------------
Renamed images folder: ${outputDir}
Final ZIP for upload: ${outputZipPath}

MATCH TYPE LEGEND:
------------------
✓ exact      = Exact name match
≈ normalized = Match after removing spaces/punctuation
~ partial    = Partial name match
~ multi-word = Multiple words matched

${results.matched === results.total ? `
${'='.repeat(80)}
✅ SUCCESS! All ${results.matched} images correctly mapped!
${'='.repeat(80)}

NEXT STEPS:
1. Review the matches above to verify correctness
2. Go to Admin Panel → Bulk Update tab
3. Scroll to "📸 Bulk Image Upload" section
4. Upload: ${outputZipPath}
5. Preview the mappings
6. Click "Apply Changes"

Your images will now go to the CORRECT profiles! ✓
` : `
${'='.repeat(80)}
⚠️ ATTENTION: ${results.unmatched} image(s) could not be matched
${'='.repeat(80)}

NEXT STEPS:
1. Review unmatched images above
2. Check if those profiles exist in database
3. Either:
   a) Upload missing profiles first, then re-run this script
   b) Manually upload those images via admin panel
4. For matched images, upload: ${outputZipPath}
`}
`;

  const reportPath = 'C:\\Users\\admin\\Downloads\\CORRECT_MAPPING_REPORT.txt';
  fs.writeFileSync(reportPath, report, 'utf-8');

  console.log(report);
  console.log(`\n📄 Full report saved to: ${reportPath}\n`);

  // Exit with appropriate code
  if (results.unmatched > 0) {
    console.log('⚠️  Some images unmatched. See report above.');
    process.exit(1);
  } else {
    console.log('✅ All images successfully matched!');
    process.exit(0);
  }
}

// Run the script
matchImagesByName()
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
