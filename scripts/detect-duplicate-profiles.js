/**
 * Detect Duplicate Profiles Script
 *
 * Identifies profiles that are likely duplicates based on normalized names
 * and graduation years. This helps admin identify and merge duplicates.
 *
 * Usage: node scripts/detect-duplicate-profiles.js
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Normalize name for comparison (same logic as upload API)
 */
function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '') // Remove special characters
    .replace(/\s+/g, ' ')     // Normalize whitespace
    .trim();
}

/**
 * Generate slug from name (same as frontend)
 */
function createSlug(name) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function detectDuplicates() {
  console.log('🔍 Detecting Duplicate Profiles...\n');

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
      duplicates.push({
        key,
        count: profileGroup.length,
        profiles: profileGroup
      });
    }
  }

  if (duplicates.length === 0) {
    console.log('✅ No duplicates found! Database is clean.');
    return;
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate groups:\n`);
  console.log('='.repeat(80));

  duplicates.forEach((dup, index) => {
    const [normalized, year] = dup.key.split('|');
    console.log(`\n${index + 1}. Normalized Name: "${normalized}" | Year: ${year}`);
    console.log('   Profiles:');

    dup.profiles.forEach(profile => {
      const slug = createSlug(profile.name);
      const dataScore = (profile.company ? 1 : 0) + (profile.current_job ? 1 : 0) + (profile.location ? 1 : 0);

      console.log(`   - ID: ${profile.id.toString().padEnd(6)} Name: "${profile.name}"`);
      console.log(`     Slug: ${slug}`);
      console.log(`     Data: Company="${profile.company || 'N/A'}", Job="${profile.current_job || 'N/A'}", Location="${profile.location || 'N/A'}"`);
      console.log(`     Score: ${dataScore}/3 | Updated: ${profile.updated_at}`);
    });

    // Suggest which to keep
    const best = dup.profiles.reduce((best, current) => {
      const bestScore = (best.company ? 1 : 0) + (best.current_job ? 1 : 0) + (best.location ? 1 : 0);
      const currentScore = (current.company ? 1 : 0) + (current.current_job ? 1 : 0) + (current.location ? 1 : 0);

      if (currentScore > bestScore) return current;
      if (currentScore === bestScore) {
        return new Date(current.updated_at) > new Date(best.updated_at) ? current : best;
      }
      return best;
    });

    console.log(`   💡 RECOMMENDED: Keep ID ${best.id} (most complete/recent data)`);
    console.log('   ' + '-'.repeat(76));
  });

  console.log('\n' + '='.repeat(80));
  console.log('\n📋 SUMMARY:');
  console.log(`   - Total duplicate groups: ${duplicates.length}`);
  console.log(`   - Total duplicate profiles: ${duplicates.reduce((sum, d) => sum + d.count - 1, 0)}`);
  console.log('\n⚠️  NEXT STEPS:');
  console.log('   1. Review the duplicate profiles above');
  console.log('   2. Manually verify which profiles to keep/merge');
  console.log('   3. Run the dedupe script or manually update in Supabase');
  console.log('   4. Consider running migration 009 if not already done\n');
}

// Run the script
detectDuplicates()
  .then(() => {
    console.log('✅ Duplicate detection complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Error during duplicate detection:', error);
    process.exit(1);
  });
