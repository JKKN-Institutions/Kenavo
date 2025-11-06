const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

// Helper function to normalize names for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Helper function to extract name from image filename
function extractNameFromFilename(filename) {
  // Remove "Img-" prefix and file extension
  let name = filename.replace(/^Img-/i, '').replace(/\.(png|jpg|jpeg|webp)$/i, '');
  return name.trim();
}

// Read profiles CSV to create name mapping
function createNameToIdMapping(profilesCSVPath) {
  const content = fs.readFileSync(profilesCSVPath, 'utf-8');
  const lines = content.split('\n');

  const mapping = new Map();
  const normalizedMapping = new Map();

  // Skip header row
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    // Parse CSV line
    const parts = [];
    let current = '';
    let inQuotes = false;

    for (let j = 0; j < line.length; j++) {
      const char = line[j];

      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        parts.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    parts.push(current.trim());

    if (parts.length > 0 && parts[0]) {
      const name = parts[0].replace(/^"|"$/g, ''); // Remove surrounding quotes
      const profileId = i; // Use row number as placeholder ID (1-based)

      mapping.set(name, profileId);
      normalizedMapping.set(normalizeName(name), { id: profileId, originalName: name });
    }
  }

  return { mapping, normalizedMapping };
}

// Find best match for a name
function findBestMatch(imageName, normalizedMapping) {
  const normalized = normalizeName(imageName);

  // Try exact match first
  if (normalizedMapping.has(normalized)) {
    return normalizedMapping.get(normalized);
  }

  // Try partial matches
  for (const [key, value] of normalizedMapping.entries()) {
    if (key.includes(normalized) || normalized.includes(key)) {
      return value;
    }
  }

  // Try name parts matching
  const imageParts = normalized.split(/[^a-z0-9]+/).filter(p => p.length > 2);
  for (const [key, value] of normalizedMapping.entries()) {
    const keyParts = key.split(/[^a-z0-9]+/).filter(p => p.length > 2);
    const matchCount = imageParts.filter(p => keyParts.includes(p)).length;
    if (matchCount >= 2) { // At least 2 parts match
      return value;
    }
  }

  return null;
}

// Main function
async function renameImages() {
  const zipPath = 'C:\\Users\\admin\\Downloads\\New set ai-20251106T054135Z-1-001.zip';
  const profilesCSVPath = 'C:\\Users\\admin\\Downloads\\profiles_upload.csv';
  const outputDir = 'C:\\Users\\admin\\Downloads\\renamed_images';
  const outputZipPath = 'C:\\Users\\admin\\Downloads\\profile_images_renamed.zip';

  console.log('Starting image rename process...\n');

  // Step 1: Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Step 2: Load profiles and create mapping
  console.log('Loading profiles CSV...');
  const { mapping, normalizedMapping } = createNameToIdMapping(profilesCSVPath);
  console.log(`Loaded ${mapping.size} profiles\n`);

  // Step 3: Extract and process ZIP
  console.log('Extracting ZIP file...');
  const zip = new AdmZip(zipPath);
  const zipEntries = zip.getEntries();

  const results = {
    total: 0,
    matched: 0,
    unmatched: 0,
    renamed: [],
    unmatchedFiles: []
  };

  // Step 4: Process each image file
  console.log('Processing images...\n');

  zipEntries.forEach(entry => {
    if (entry.isDirectory) return;

    const filename = entry.entryName.split('/').pop(); // Get filename only

    // Skip non-image files
    if (!filename.match(/\.(png|jpg|jpeg|webp)$/i)) {
      return;
    }

    // Skip macOS metadata files
    if (filename.startsWith('._') || entry.entryName.includes('__MACOSX')) {
      return;
    }

    results.total++;

    // Extract name from filename
    const imageName = extractNameFromFilename(filename);
    const fileExt = path.extname(filename);

    // Find matching profile
    const match = findBestMatch(imageName, normalizedMapping);

    if (match) {
      results.matched++;

      // New filename: {profile_id}.png
      const newFilename = `${match.id}${fileExt}`;
      const outputPath = path.join(outputDir, newFilename);

      // Save renamed file
      fs.writeFileSync(outputPath, entry.getData());

      results.renamed.push({
        original: filename,
        new: newFilename,
        profileId: match.id,
        profileName: match.originalName
      });

      console.log(`✓ ${filename} → ${newFilename} (${match.originalName})`);
    } else {
      results.unmatched++;
      results.unmatchedFiles.push({
        filename,
        extractedName: imageName
      });

      console.log(`✗ ${filename} - NO MATCH FOUND (${imageName})`);
    }
  });

  // Step 5: Create new ZIP with renamed files
  console.log('\nCreating new ZIP file...');
  const newZip = new AdmZip();

  fs.readdirSync(outputDir).forEach(file => {
    const filePath = path.join(outputDir, file);
    newZip.addLocalFile(filePath);
  });

  newZip.writeZip(outputZipPath);
  console.log(`✓ Created: ${outputZipPath}\n`);

  // Step 6: Generate report
  const report = `
PROFILE IMAGE RENAMING REPORT
==============================
Generated: ${new Date().toISOString()}

SUMMARY:
--------
Total images processed: ${results.total}
Successfully matched: ${results.matched}
Unmatched: ${results.unmatched}

RENAMED FILES (${results.matched}):
${'-'.repeat(80)}
${ results.renamed.map(r =>
  `${r.original.padEnd(50)} → ${r.new.padEnd(15)} (ID: ${r.profileId}, ${r.profileName})`
).join('\n')}

${results.unmatched > 0 ? `
UNMATCHED FILES (${results.unmatched}):
${'-'.repeat(80)}
These files could not be matched to any profile. Please review manually:
${results.unmatchedFiles.map(f =>
  `- ${f.filename} (extracted name: "${f.extractedName}")`
).join('\n')}

ACTION REQUIRED:
- Check if these profiles exist in the database
- Verify name spelling
- Manually rename these files if needed
` : 'All files matched successfully! ✓'}

OUTPUT FILES:
-------------
1. Renamed images folder: ${outputDir}
2. ZIP file ready for upload: ${outputZipPath}

NEXT STEPS:
-----------
${results.unmatched === 0 ? `
✓ All images successfully renamed!

UPLOAD WORKFLOW:

IMPORTANT: You need REAL profile IDs before uploading images!

Current Status:
- Files are renamed with PLACEHOLDER IDs (1, 2, 3... 71)
- These are NOT the database profile IDs

What to do:
1. First, upload profiles_upload.csv in Admin Panel (Bulk Create tab)
2. After upload, go to Admin Panel → Bulk Update tab
3. Click "🆔 Export Profile IDs" button to download real IDs
4. Run this script again with real IDs to rename images correctly
5. Then upload the final ZIP file via "📸 Bulk Image Upload"

Alternatively, if profiles are already uploaded:
1. Export Profile IDs from admin panel
2. Update this script to use real IDs
3. Re-run the renaming process
4. Upload via Bulk Image Upload in admin panel
` : `
⚠ ${results.unmatched} file(s) need manual attention

Please review the unmatched files above and either:
1. Manually rename them to match profile names exactly
2. Add them to the profiles CSV if they're missing
3. Skip them if they're not needed

Then re-run this script.
`}
`;

  // Save report
  const reportPath = 'C:\\Users\\admin\\Downloads\\image_rename_report.txt';
  fs.writeFileSync(reportPath, report, 'utf-8');

  console.log(report);
  console.log(`\n✓ Report saved to: ${reportPath}`);

  // Return summary
  return results;
}

// Run the script
renameImages()
  .then(results => {
    console.log('\n' + '='.repeat(60));
    console.log('RENAMING COMPLETE!');
    console.log('='.repeat(60));
    console.log(`Matched: ${results.matched}/${results.total}`);
    if (results.unmatched > 0) {
      console.log(`⚠ Warning: ${results.unmatched} file(s) unmatched`);
      process.exit(1);
    } else {
      console.log('✓ All images successfully renamed!');
      process.exit(0);
    }
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });
