/**
 * Check Recent Uploads
 */

const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkRecentUploads() {
  console.log('Checking recent uploads (IDs: 179, 181, 183)...\n');

  // Fetch specific profiles by ID
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name, year_graduated, created_at')
    .in('id', [179, 181, 183])
    .order('id');

  if (error) {
    console.error('Error:', error);
    return;
  }

  if (profiles.length === 0) {
    console.log('No profiles found with those IDs');
    return;
  }

  console.log('Recent Profiles:');
  console.log('='.repeat(80));
  profiles.forEach(p => {
    console.log(`ID: ${p.id}`);
    console.log(`Name: ${p.name}`);
    console.log(`Year Graduated: "${p.year_graduated}"`);
    console.log(`Created At: ${p.created_at}`);
    console.log();
  });
  console.log('='.repeat(80));

  // Also check all profiles with year "2000" to see if any might need updating
  console.log('\n\nChecking all profiles with year_graduated = "2000"...\n');

  const { data: year2000Profiles, error: error2 } = await supabase
    .from('profiles')
    .select('id, name, year_graduated')
    .eq('year_graduated', '2000')
    .order('id')
    .limit(10);

  if (error2) {
    console.error('Error:', error2);
    return;
  }

  console.log(`Found ${year2000Profiles.length} profiles (showing first 10):`);
  console.log('='.repeat(80));
  year2000Profiles.forEach(p => {
    console.log(`${p.id}. ${p.name} - Year: "${p.year_graduated}"`);
  });
  console.log('='.repeat(80));
}

checkRecentUploads()
  .then(() => process.exit(0))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
