/**
 * Migration Script: Fix Existing Year Ranges
 *
 * This script re-parses the original CSV data to extract full year ranges
 * (e.g., "1993-2000") instead of just the end year (e.g., "2000").
 *
 * Usage: node scripts/fix-existing-year-ranges.js
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced extractGradYear function (matches updated version)
function extractGradYear(tenure) {
  if (!tenure || tenure.trim() === '') {
    return '';
  }

  // PRIORITY 1: Year range (e.g., "1993-2000" or "1993 - 2000")
  const rangeMatch = tenure.match(/(\d{4})\s*[-–]\s*(\d{4})/);
  if (rangeMatch) {
    return `${rangeMatch[1]}-${rangeMatch[2]}`;  // Return full range
  }

  // PRIORITY 2: Single year patterns
  const singleYearPatterns = [
    /class of (\d{4})/i,                 // Matches "Class of 1995"
    /batch[:\s]+(\d{4})/i,               // Matches "Batch: 1995" or "Batch 1995"
    /(\d{4})[:\s]*batch/i,               // Matches "1995 Batch"
    /graduated[:\s]+(\d{4})/i,           // Matches "Graduated: 1995"
    /(\d{4})$/,                          // Matches "1995" at end
    /\b(\d{4})\b/,                       // Any 4-digit number (fallback)
  ];

  for (const pattern of singleYearPatterns) {
    const match = tenure.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return '';
}

// Parse CSV file
function parseCSV(filePath) {
  if (!fs.existsSync(filePath)) {
    console.error(`CSV file not found: ${filePath}`);
    return [];
  }

  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n').filter(line => line.trim());

  if (lines.length === 0) {
    console.error('CSV file is empty');
    return [];
  }

  // Parse header
  const headers = lines[0].split(',').map(h => h.trim());
  const nameIndex = headers.findIndex(h => h.toLowerCase().includes('name'));
  const tenureIndex = headers.findIndex(h => h.toLowerCase().includes('tenure'));

  if (nameIndex === -1 || tenureIndex === -1) {
    console.error('Could not find "Name" and "Tenure" columns in CSV');
    return [];
  }

  const profiles = [];
  for (let i = 1; i < lines.length; i++) {
    const values = lines[i].split(',').map(v => v.trim());
    const name = values[nameIndex] || '';
    const tenure = values[tenureIndex] || '';

    if (name && tenure) {
      profiles.push({ name, tenure });
    }
  }

  return profiles;
}

// Main migration function
async function migrateYearRanges(csvFilePath) {
  console.log('Starting year range migration...\n');

  // 1. Parse CSV file
  console.log(`Reading CSV file: ${csvFilePath}`);
  const csvData = parseCSV(csvFilePath);
  console.log(`Found ${csvData.length} profiles in CSV\n`);

  if (csvData.length === 0) {
    console.log('No data to process. Exiting.');
    return;
  }

  // 2. Fetch all profiles from database
  console.log('Fetching profiles from database...');
  const { data: dbProfiles, error } = await supabase
    .from('profiles')
    .select('id, name, year_graduated');

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log(`Found ${dbProfiles.length} profiles in database\n`);

  // 3. Match CSV data to database profiles and identify updates
  const updates = [];
  let matchedCount = 0;
  let updatedCount = 0;

  for (const csvProfile of csvData) {
    // Find matching profile in database (case-insensitive)
    const dbProfile = dbProfiles.find(p =>
      p.name.toLowerCase().trim() === csvProfile.name.toLowerCase().trim()
    );

    if (dbProfile) {
      matchedCount++;
      const newYear = extractGradYear(csvProfile.tenure);
      const oldYear = dbProfile.year_graduated || '';

      // Only update if the new year is different and is a range
      if (newYear && newYear !== oldYear && newYear.includes('-')) {
        updates.push({
          id: dbProfile.id,
          name: dbProfile.name,
          oldYear: oldYear,
          newYear: newYear,
          tenure: csvProfile.tenure
        });
        updatedCount++;
      }
    }
  }

  console.log(`Match Summary:`);
  console.log(`- Matched profiles: ${matchedCount}/${csvData.length}`);
  console.log(`- Profiles needing update: ${updatedCount}\n`);

  if (updates.length === 0) {
    console.log('No profiles need updating. All year ranges are already correct!');
    return;
  }

  // 4. Display changes for review
  console.log('Proposed Changes:');
  console.log('='.repeat(80));
  updates.forEach((update, index) => {
    console.log(`${index + 1}. ${update.name} (ID: ${update.id})`);
    console.log(`   Tenure: "${update.tenure}"`);
    console.log(`   Old: "${update.oldYear}" → New: "${update.newYear}"`);
    console.log();
  });

  // 5. Ask for confirmation (in production, you might want to add a prompt)
  console.log('Applying updates...\n');

  // 6. Apply updates
  let successCount = 0;
  let errorCount = 0;

  for (const update of updates) {
    const { error } = await supabase
      .from('profiles')
      .update({ year_graduated: update.newYear })
      .eq('id', update.id);

    if (error) {
      console.error(`✗ Failed to update ${update.name}:`, error.message);
      errorCount++;
    } else {
      console.log(`✓ Updated ${update.name}: "${update.oldYear}" → "${update.newYear}"`);
      successCount++;
    }
  }

  // 7. Summary
  console.log('\n' + '='.repeat(80));
  console.log('Migration Complete!');
  console.log(`- Successfully updated: ${successCount} profiles`);
  console.log(`- Failed: ${errorCount} profiles`);
  console.log('='.repeat(80));
}

// Run migration
const csvFilePath = process.argv[2] || path.join(__dirname, '../data/Kevayo2kSlambookRecord - Sheet1.csv');

migrateYearRanges(csvFilePath)
  .then(() => {
    console.log('\nMigration script finished.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nMigration script failed:', error);
    process.exit(1);
  });
