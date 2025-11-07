/**
 * Check for exact name duplicates (ignoring year)
 * This will find profiles with identical names regardless of graduation year
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkExactDuplicates() {
  console.log('🔍 Checking for exact name duplicates (ignoring year)...\n');

  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, year_graduated, company, current_job, location, profile_image_url, updated_at')
    .order('name');

  if (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }

  console.log(`📊 Total profiles: ${profiles.length}\n`);

  // Group by exact name (case-sensitive)
  const nameGroups = {};
  profiles.forEach(p => {
    if (!nameGroups[p.name]) {
      nameGroups[p.name] = [];
    }
    nameGroups[p.name].push(p);
  });

  const duplicates = Object.entries(nameGroups).filter(([_, profiles]) => profiles.length > 1);

  if (duplicates.length === 0) {
    console.log('✅ No exact name duplicates found!\n');
    process.exit(0);
  }

  console.log(`⚠️  Found ${duplicates.length} profiles with exact duplicate names:\n`);
  console.log('='.repeat(80));

  duplicates.forEach(([name, dups], index) => {
    console.log(`\n${index + 1}. "${name}" (${dups.length} profiles):`);
    dups.forEach(p => {
      console.log(`   ID ${p.id.toString().padEnd(6)} Year: ${(p.year_graduated || 'none').padEnd(6)} Job: ${p.current_job || 'N/A'}`);
      console.log(`            Company: ${p.company || 'N/A'}`);
      console.log(`            Image: ${p.profile_image_url ? 'Yes' : 'No'}`);
      console.log(`            Updated: ${p.updated_at}`);
      console.log('');
    });
  });

  console.log('='.repeat(80));
  console.log(`\n📊 SUMMARY:`);
  console.log(`   Total duplicate name groups: ${duplicates.length}`);
  console.log(`   Total duplicate profiles: ${duplicates.reduce((sum, [_, dups]) => sum + dups.length - 1, 0)}\n`);
}

checkExactDuplicates()
  .then(() => process.exit(0))
  .catch(err => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
