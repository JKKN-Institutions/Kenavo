#!/usr/bin/env node
/**
 * CSV to Supabase Importer
 *
 * Imports profile data from CSV file to Supabase
 * Usage: node scripts/csv-to-supabase.js <csv-file-path>
 */

const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Parse CSV
function parseCSV(csvContent) {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length < 2) {
    throw new Error('CSV file is empty or has no data rows');
  }

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const profiles = [];

  for (let i = 1; i < lines.length; i++) {
    const values = parseCSVLine(lines[i]);
    if (values.length === 0) continue;

    const profile = {};
    headers.forEach((header, index) => {
      const value = values[index]?.trim();
      profile[header] = value === '' || value === 'null' ? null : value;
    });

    // Convert ID to number
    if (profile.id) {
      profile.id = parseInt(profile.id);
    }

    profiles.push(profile);
  }

  return profiles;
}

// Parse a CSV line handling quoted values
function parseCSVLine(line) {
  const values = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  values.push(current);
  return values;
}

// Update profiles in Supabase
async function updateProfiles(profiles) {
  console.log(`\n📊 Importing ${profiles.length} profiles to Supabase...\n`);

  let successCount = 0;
  let errorCount = 0;
  const errors = [];

  for (const profile of profiles) {
    try {
      // Update profile (upsert based on ID)
      const { data, error } = await supabase
        .from('profiles')
        .upsert({
          ...profile,
          updated_at: new Date().toISOString() // Force cache refresh
        }, {
          onConflict: 'id'
        });

      if (error) {
        throw error;
      }

      successCount++;
      console.log(`✅ Updated: ${profile.name} (ID: ${profile.id})`);
    } catch (error) {
      errorCount++;
      errors.push({ profile: profile.name, error: error.message });
      console.error(`❌ Failed: ${profile.name} - ${error.message}`);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 IMPORT SUMMARY');
  console.log('='.repeat(50));
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Failed: ${errorCount}`);
  console.log(`📝 Total: ${profiles.length}`);

  if (errors.length > 0) {
    console.log('\n❌ Errors:');
    errors.forEach(({ profile, error }) => {
      console.log(`   - ${profile}: ${error}`);
    });
  }

  console.log('\n✨ Import completed!');
  console.log('🔄 Refresh your website to see updates (Ctrl + Shift + R)');
}

// Main function
async function main() {
  const csvFilePath = process.argv[2];

  if (!csvFilePath) {
    console.error('❌ Usage: node scripts/csv-to-supabase.js <csv-file-path>');
    console.error('Example: node scripts/csv-to-supabase.js profiles_template.csv');
    process.exit(1);
  }

  const fullPath = path.resolve(csvFilePath);

  if (!fs.existsSync(fullPath)) {
    console.error(`❌ File not found: ${fullPath}`);
    process.exit(1);
  }

  console.log('📂 Reading CSV file...');
  const csvContent = fs.readFileSync(fullPath, 'utf8');

  console.log('🔄 Parsing CSV...');
  const profiles = parseCSV(csvContent);

  console.log(`✅ Parsed ${profiles.length} profiles`);

  // Confirm before import
  console.log('\n⚠️  WARNING: This will update profiles in your Supabase database!');
  console.log('Press Ctrl+C to cancel, or wait 3 seconds to continue...\n');

  await new Promise(resolve => setTimeout(resolve, 3000));

  await updateProfiles(profiles);
}

// Run
main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
