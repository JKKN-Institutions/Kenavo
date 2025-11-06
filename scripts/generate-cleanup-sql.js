/**
 * Generate SQL Cleanup Script for Duplicate Profiles
 *
 * This script analyzes duplicate profiles and generates SQL commands
 * to merge/delete them automatically.
 *
 * Usage: node scripts/generate-cleanup-sql.js
 * Output: cleanup-duplicates.sql (ready to run in Supabase SQL Editor)
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Normalize name for comparison
 */
function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function generateCleanupSQL() {
  console.log('🔍 Analyzing duplicate profiles...\n');

  // Fetch all profiles
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, year_graduated, company, location, current_job, created_at, updated_at')
    .order('id');

  if (error) {
    console.error('❌ Error fetching profiles:', error);
    process.exit(1);
  }

  console.log(`📊 Total profiles: ${profiles.length}\n`);

  // Group by normalized name + year
  const groups = new Map();

  profiles.forEach(profile => {
    const normalized = normalizeName(profile.name);
    const year = profile.year_graduated || 'no-year';
    const key = `${normalized}|${year}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }
    groups.get(key).push(profile);
  });

  // Find duplicates
  const duplicates = [];
  for (const [key, profileGroup] of groups.entries()) {
    if (profileGroup.length > 1) {
      // Determine which profile to keep
      const keep = profileGroup.reduce((best, current) => {
        const bestScore = (best.company ? 1 : 0) + (best.current_job ? 1 : 0) + (best.location ? 1 : 0);
        const currentScore = (current.company ? 1 : 0) + (current.current_job ? 1 : 0) + (current.location ? 1 : 0);

        if (currentScore > bestScore) return current;
        if (currentScore === bestScore) {
          return new Date(current.updated_at) > new Date(best.updated_at) ? current : best;
        }
        return best;
      });

      const toDelete = profileGroup.filter(p => p.id !== keep.id);

      duplicates.push({
        key,
        keep,
        delete: toDelete
      });
    }
  }

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found! Database is clean.');
    return;
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate groups\n`);

  // Generate SQL
  let sql = `-- =====================================================
-- CLEANUP DUPLICATE PROFILES - GENERATED SQL
-- =====================================================
-- Generated: ${new Date().toISOString()}
-- Total duplicate groups: ${duplicates.length}
-- Total profiles to delete: ${duplicates.reduce((sum, d) => sum + d.delete.length, 0)}
-- =====================================================
-- ⚠️  IMPORTANT: Review this SQL before running!
-- ⚠️  Make sure you're keeping the correct profiles!
-- =====================================================

BEGIN;

-- =====================================================
-- CLEANUP OPERATIONS
-- =====================================================

`;

  duplicates.forEach((dup, index) => {
    const [normalized, year] = dup.key.split('|');

    sql += `\n-- ${index + 1}. ${normalized} (Year: ${year})\n`;
    sql += `-- KEEP: ID ${dup.keep.id} - "${dup.keep.name}"\n`;
    sql += `-- DELETE: ${dup.delete.map(p => `ID ${p.id}`).join(', ')}\n`;
    sql += `-- Reason: Most complete data (Company: ${dup.keep.company || 'N/A'}, Job: ${dup.keep.current_job || 'N/A'})\n\n`;

    dup.delete.forEach(profile => {
      sql += `-- Move data from ID ${profile.id} to ID ${dup.keep.id}\n`;
      sql += `UPDATE gallery_images SET profile_id = ${dup.keep.id} WHERE profile_id = ${profile.id};\n`;
      sql += `UPDATE profile_answers SET profile_id = ${dup.keep.id} WHERE profile_id = ${profile.id};\n`;
      sql += `DELETE FROM profiles WHERE id = ${profile.id};\n\n`;
    });

    sql += `-- Verify: Check that ID ${dup.keep.id} is the only one remaining\n`;
    sql += `-- SELECT * FROM profiles WHERE id IN (${[dup.keep.id, ...dup.delete.map(p => p.id)].join(', ')});\n\n`;
  });

  sql += `\n-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Count remaining profiles
SELECT COUNT(*) as total_profiles FROM profiles;

-- Check for any remaining duplicates
WITH normalized_profiles AS (
  SELECT
    id,
    name,
    year_graduated,
    LOWER(TRIM(REGEXP_REPLACE(name, '[^a-zA-Z0-9\\s]', '', 'g'))) as normalized_name
  FROM profiles
)
SELECT
  normalized_name,
  year_graduated,
  COUNT(*) as duplicate_count,
  STRING_AGG(id::text, ', ') as profile_ids
FROM normalized_profiles
GROUP BY normalized_name, year_graduated
HAVING COUNT(*) > 1;

-- This should return 0 rows if cleanup was successful

COMMIT;

-- =====================================================
-- SUCCESS!
-- =====================================================
-- If you see this without errors, duplicates are cleaned up!
-- Next step: Run migration 009 if not already done
-- =====================================================
`;

  // Write to file
  const outputPath = path.join(__dirname, '..', 'cleanup-duplicates.sql');
  fs.writeFileSync(outputPath, sql, 'utf-8');

  console.log('✅ Generated SQL cleanup script!\n');
  console.log('📁 Output file: cleanup-duplicates.sql\n');
  console.log('📋 SUMMARY:');
  console.log(`   - Duplicate groups: ${duplicates.length}`);
  console.log(`   - Profiles to keep: ${duplicates.length}`);
  console.log(`   - Profiles to delete: ${duplicates.reduce((sum, d) => sum + d.delete.length, 0)}\n`);
  console.log('⚠️  NEXT STEPS:');
  console.log('   1. Review the generated SQL file: cleanup-duplicates.sql');
  console.log('   2. Open Supabase SQL Editor');
  console.log('   3. Copy and paste the SQL');
  console.log('   4. Review one more time to ensure correct profiles are kept');
  console.log('   5. Run the SQL (within a transaction for safety)');
  console.log('   6. Verify no duplicates remain\n');

  // Generate summary report
  console.log('📊 DETAILED BREAKDOWN:\n');
  duplicates.forEach((dup, index) => {
    const [normalized, year] = dup.key.split('|');
    console.log(`${index + 1}. ${normalized} (Year: ${year})`);
    console.log(`   KEEP: ID ${dup.keep.id} - "${dup.keep.name}"`);
    dup.delete.forEach(p => {
      console.log(`   DELETE: ID ${p.id} - "${p.name}"`);
    });
    console.log('');
  });
}

// Run the script
generateCleanupSQL()
  .then(() => {
    console.log('✅ SQL generation complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error during SQL generation:', error);
    process.exit(1);
  });
