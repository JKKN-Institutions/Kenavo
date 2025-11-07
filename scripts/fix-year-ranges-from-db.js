/**
 * Migration Script: Fix Year Ranges from Database
 *
 * This script checks the database for profiles that might have incomplete year data
 * and attempts to find year ranges from Q&A answers or other fields.
 *
 * Usage: node scripts/fix-year-ranges-from-db.js
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Enhanced extractGradYear function
function extractGradYear(tenure) {
  if (!tenure || tenure.trim() === '') {
    return '';
  }

  // PRIORITY 1: Year range (e.g., "1993-2000" or "1993 - 2000")
  const rangeMatch = tenure.match(/(\d{4})\s*[-–]\s*(\d{4})/);
  if (rangeMatch) {
    return `${rangeMatch[1]}-${rangeMatch[2]}`;
  }

  // PRIORITY 2: Single year patterns
  const singleYearPatterns = [
    /class of (\d{4})/i,
    /batch[:\s]+(\d{4})/i,
    /(\d{4})[:\s]*batch/i,
    /graduated[:\s]+(\d{4})/i,
    /(\d{4})$/,
    /\b(\d{4})\b/,
  ];

  for (const pattern of singleYearPatterns) {
    const match = tenure.match(pattern);
    if (match) {
      return match[1];
    }
  }

  return '';
}

// Main function
async function fixYearRanges() {
  console.log('Starting year range fix from database...\n');

  try {
    // 1. Fetch all profiles with their Q&A answers
    console.log('Fetching profiles and Q&A answers from database...');
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select(`
        id,
        name,
        year_graduated,
        profile_answers (
          answer,
          profile_questions (
            question_text
          )
        )
      `);

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError);
      return;
    }

    console.log(`Found ${profiles.length} profiles\n`);

    // 2. Find profiles that might need updating
    const updates = [];

    for (const profile of profiles) {
      // Skip if no answers
      if (!profile.profile_answers || profile.profile_answers.length === 0) {
        continue;
      }

      // Look for tenure/year information in Q&A answers
      const tenureAnswer = profile.profile_answers.find(qa =>
        qa.profile_questions &&
        qa.profile_questions.question_text &&
        qa.profile_questions.question_text.toLowerCase().includes('tenure')
      );

      if (tenureAnswer && tenureAnswer.answer) {
        const newYear = extractGradYear(tenureAnswer.answer);
        const oldYear = profile.year_graduated || '';

        // Update if:
        // 1. New year is a range (contains hyphen)
        // 2. Old year is just the end year (e.g., "2000")
        // 3. New year is different from old year
        if (newYear && newYear.includes('-') && newYear !== oldYear) {
          // Check if old year matches the end of the new range
          const endYear = newYear.split('-')[1];
          if (oldYear === endYear) {
            updates.push({
              id: profile.id,
              name: profile.name,
              oldYear: oldYear,
              newYear: newYear,
              source: tenureAnswer.answer
            });
          }
        }
      }
    }

    console.log(`Profiles needing update: ${updates.length}\n`);

    if (updates.length === 0) {
      console.log('No profiles need updating. All year ranges are already correct or no tenure data found!');
      return;
    }

    // 3. Display proposed changes
    console.log('Proposed Changes:');
    console.log('='.repeat(80));
    updates.forEach((update, index) => {
      console.log(`${index + 1}. ${update.name} (ID: ${update.id})`);
      console.log(`   Source: "${update.source}"`);
      console.log(`   Old: "${update.oldYear}" → New: "${update.newYear}"`);
      console.log();
    });

    // 4. Apply updates
    console.log('Applying updates...\n');

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

    // 5. Summary
    console.log('\n' + '='.repeat(80));
    console.log('Migration Complete!');
    console.log(`- Successfully updated: ${successCount} profiles`);
    console.log(`- Failed: ${errorCount} profiles`);
    console.log('='.repeat(80));

  } catch (error) {
    console.error('Migration failed:', error);
    throw error;
  }
}

// Run migration
fixYearRanges()
  .then(() => {
    console.log('\nMigration script finished.');
    process.exit(0);
  })
  .catch(error => {
    console.error('\nMigration script failed:', error);
    process.exit(1);
  });
