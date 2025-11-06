const fs = require('fs');
const path = require('path');
const AdmZip = require('adm-zip');

/**
 * This script renames profile images with REAL database profile IDs
 *
 * PREREQUISITE: You must have already:
 * 1. Uploaded profiles_upload.csv (71 profiles)
 * 2. Uploaded additional_profiles.csv (5 profiles)
 * 3. Exported profile IDs from Admin Panel
 *
 * This script takes the exported profile IDs CSV and renames all 66 images
 * from placeholder IDs to real database IDs.
 */

// Helper to normalize names for matching
function normalizeName(name) {
  return name
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9]/g, '');
}

// Parse CSV with proper quote handling
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

// Read exported profile IDs from admin panel
function readExportedProfileIds(exportedCSVPath) {
  const content = fs.readFileSync(exportedCSVPath, 'utf-8');
  const rows = parseCSV(content);

  const mapping = new Map();
  const normalizedMapping = new Map();

  // Skip header row
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (row.length < 2) continue;

    const realId = parseInt(row[0], 10);
    const name = row[1];

    if (!isNaN(realId) && name) {
      mapping.set(name, realId);
      normalizedMapping.set(normalizeName(name), { realId, name });
    }
  }

  return { mapping, normalizedMapping };
}

// Read original profiles to create placeholder ID mapping
function readOriginalProfiles() {
  const profilesPath = 'C:\\Users\\admin\\Downloads\\profiles_upload.csv';
  const additionalPath = 'C:\\Users\\admin\\Downloads\\additional_profiles.csv';

  const placeholderMapping = new Map();

  // Read main profiles (rows 2-72 = IDs 1-71)
  const mainContent = fs.readFileSync(profilesPath, 'utf-8');
  const mainRows = parseCSV(mainContent);

  for (let i = 1; i < mainRows.length; i++) {
    const name = mainRows[i][0];
    if (name) {
      placeholderMapping.set(i, name); // i is the placeholder ID (1-based)
    }
  }

  // Read additional profiles (rows 2-6 = IDs 72-76)
  const additionalContent = fs.readFileSync(additionalPath, 'utf-8');
  const additionalRows = parseCSV(additionalContent);

  for (let i = 1; i < additionalRows.length; i++) {
    const name = additionalRows[i][0];
    if (name) {
      placeholderMapping.set(71 + i, name); // Continue from 72
    }
  }

  return placeholderMapping;
}

// Main function
async function renameWithRealIds() {
  // Check if exported profile IDs file exists
  const exportedCSVPath = 'C:\\Users\\admin\\Downloads\\exported_profile_ids.csv';

  if (!fs.existsSync(exportedCSVPath)) {
    console.error('\n❌ ERROR: exported_profile_ids.csv not found!');
    console.error('\nYou must:');
    console.error('1. Upload profiles_upload.csv in Admin Panel (Bulk Create tab)');
    console.error('2. Upload additional_profiles.csv in Admin Panel (Bulk Create tab)');
    console.error('3. Go to Bulk Update tab → Click "🆔 Export Profile IDs"');
    console.error('4. Save the downloaded file as: C:\\Users\\admin\\Downloads\\exported_profile_ids.csv');
    console.error('5. Then run this script again\n');
    process.exit(1);
  }

  console.log('Starting final image rename with REAL database IDs...\n');

  // Step 1: Load mappings
  console.log('Loading profile mappings...');
  const placeholderMapping = readOriginalProfiles();
  const { mapping: realIdMapping, normalizedMapping } = readExportedProfileIds(exportedCSVPath);

  console.log(`Loaded ${placeholderMapping.size} placeholder profiles`);
  console.log(`Loaded ${realIdMapping.size} real database profiles\n`);

  // Step 2: Create ID mapping (placeholder → real)
  const idMapping = new Map();

  for (const [placeholderId, name] of placeholderMapping.entries()) {
    const normalized = normalizeName(name);
    const match = normalizedMapping.get(normalized);

    if (match) {
      idMapping.set(placeholderId, match.realId);
    } else {
      console.warn(`⚠ Warning: No real ID found for "${name}" (placeholder ID: ${placeholderId})`);
    }
  }

  console.log(`Successfully mapped ${idMapping.size} profiles\n`);

  // Step 3: Rename images
  const inputDir = 'C:\\Users\\admin\\Downloads\\renamed_images';
  const outputDir = 'C:\\Users\\admin\\Downloads\\final_images';
  const outputZipPath = 'C:\\Users\\admin\\Downloads\\profile_images_FINAL.zip';

  // Create output directory
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true);
  }

  const files = fs.readdirSync(inputDir);
  const results = {
    total: 0,
    renamed: 0,
    skipped: 0,
    details: []
  };

  console.log('Renaming images with real database IDs...\n');

  files.forEach(filename => {
    if (!filename.match(/\.(png|jpg|jpeg|webp)$/i)) {
      return;
    }

    results.total++;

    // Extract placeholder ID from filename
    const match = filename.match(/^(\d+)\./);
    if (!match) {
      console.log(`⚠ Skipping ${filename} - no numeric ID found`);
      results.skipped++;
      return;
    }

    const placeholderId = parseInt(match[1], 10);
    const realId = idMapping.get(placeholderId);

    if (!realId) {
      console.log(`⚠ Skipping ${filename} - no real ID mapping found`);
      results.skipped++;
      return;
    }

    // Get profile name for logging
    const profileName = placeholderMapping.get(placeholderId);
    const fileExt = path.extname(filename);
    const newFilename = `${realId}${fileExt}`;

    // Copy to output directory with new name
    const sourcePath = path.join(inputDir, filename);
    const destPath = path.join(outputDir, newFilename);

    fs.copyFileSync(sourcePath, destPath);

    results.renamed++;
    results.details.push({
      old: filename,
      new: newFilename,
      placeholderId,
      realId,
      profileName
    });

    console.log(`✓ ${filename} → ${newFilename} (${profileName})`);
  });

  // Step 4: Create final ZIP
  console.log('\nCreating final ZIP file...');
  const zip = new AdmZip();

  fs.readdirSync(outputDir).forEach(file => {
    const filePath = path.join(outputDir, file);
    zip.addLocalFile(filePath);
  });

  zip.writeZip(outputZipPath);
  console.log(`✓ Created: ${outputZipPath}\n`);

  // Step 5: Generate report
  const report = `
FINAL IMAGE RENAMING REPORT
============================
Generated: ${new Date().toISOString()}

SUMMARY:
--------
Total images processed: ${results.total}
Successfully renamed: ${results.renamed}
Skipped: ${results.skipped}

ID MAPPINGS (Placeholder → Real):
${'-'.repeat(80)}
${results.details.map(d =>
  `${d.placeholderId.toString().padStart(3)} → ${d.realId.toString().padStart(4)} | ${d.old.padEnd(20)} → ${d.new.padEnd(20)} | ${d.profileName}`
).join('\n')}

OUTPUT FILES:
-------------
1. Final images folder: ${outputDir}
2. ZIP file ready for upload: ${outputZipPath}

NEXT STEPS:
-----------
✓ All images renamed with REAL database IDs!

UPLOAD NOW:
1. Go to Admin Panel → Bulk Update tab
2. Scroll to "📸 Bulk Image Upload" section
3. Upload: ${outputZipPath}
4. Preview the mappings
5. Click "Apply Changes" to upload all ${results.renamed} images

The images will be uploaded to Supabase Storage and linked to profiles automatically!
`;

  const reportPath = 'C:\\Users\\admin\\Downloads\\FINAL_IMAGE_REPORT.txt';
  fs.writeFileSync(reportPath, report, 'utf-8');

  console.log(report);
  console.log(`\n✓ Report saved to: ${reportPath}`);

  console.log('\n' + '='.repeat(60));
  console.log('SUCCESS! Images ready for upload!');
  console.log('='.repeat(60));
  console.log(`Upload file: ${outputZipPath}`);
  console.log(`Total images: ${results.renamed}`);
}

// Run the script
renameWithRealIds()
  .then(() => {
    console.log('\n✓ Process completed successfully!');
    process.exit(0);
  })
  .catch(error => {
    console.error('\n❌ Error:', error.message);
    console.error(error.stack);
    process.exit(1);
  });
