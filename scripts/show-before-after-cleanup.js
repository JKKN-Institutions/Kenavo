/**
 * Preview Before/After Cleanup Script
 *
 * Shows what will happen when running the smart cleanup:
 * - Current state of OLD profiles (to be updated)
 * - Current state of NEW profiles (to be deleted)
 * - Preview of what OLD profiles will look like after update
 *
 * Usage: node scripts/show-before-after-cleanup.js
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

const pairs = [
  { old: 3, new: 135, name: 'A S Syed Ahamed Khan' },
  { old: 5, new: 136, name: 'Abishek Valluru' },
  { old: 15, new: 137, name: 'Annadurai S.V' },
  { old: 36, new: 141, name: 'Chenthil Aruun Mohan' },
  { old: 70, new: 143, name: 'Kumaran Srinivasan' },
  { old: 75, new: 144, name: 'Lalhruaitluanga Khiangte' },
  { old: 110, new: 148, name: 'Shravan Kumar Avula' }
];

async function showBeforeAfter() {
  console.log('🔍 PREVIEW: Before/After Smart Cleanup\n');
  console.log('This shows what will happen when you run the cleanup SQL.\n');
  console.log('='.repeat(100));

  for (const pair of pairs) {
    // Fetch both profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .in('id', [pair.old, pair.new])
      .order('id');

    if (error) {
      console.error(`Error fetching profiles for ${pair.name}:`, error);
      continue;
    }

    if (profiles.length !== 2) {
      console.log(`\n⚠️  Warning: Expected 2 profiles for ${pair.name}, found ${profiles.length}`);
      continue;
    }

    const oldProfile = profiles.find(p => p.id === pair.old);
    const newProfile = profiles.find(p => p.id === pair.new);

    console.log(`\n\n📝 ${pair.name.toUpperCase()}`);
    console.log('='.repeat(100));

    // BEFORE: Old Profile
    console.log('\n🔴 BEFORE (Old Profile - ID ' + pair.old + '):');
    console.log('  Name:', oldProfile.name);
    console.log('  Company:', oldProfile.company || 'N/A');
    console.log('  Job:', oldProfile.current_job || 'N/A');
    console.log('  Location:', oldProfile.location || 'N/A');
    console.log('  Nickname:', oldProfile.nicknames || 'N/A');
    console.log('  Year:', oldProfile.year_graduated || 'N/A');
    console.log('  Image:', oldProfile.profile_image_url ? '✅ Has image' : '❌ No image');

    // NEW Profile (will be deleted)
    console.log('\n🟡 NEW Profile (ID ' + pair.new + ') - WILL BE DELETED:');
    console.log('  Name:', newProfile.name);
    console.log('  Company:', newProfile.company || 'N/A');
    console.log('  Job:', newProfile.current_job || 'N/A');
    console.log('  Location:', newProfile.location || 'N/A');
    console.log('  Nickname:', newProfile.nicknames || 'N/A');
    console.log('  Year:', newProfile.year_graduated || 'N/A');
    console.log('  Image:', newProfile.profile_image_url ? '✅ Has image' : '❌ No image');

    // AFTER: Merged Profile
    console.log('\n🟢 AFTER (Updated Old Profile - ID ' + pair.old + '):');
    console.log('  Name:', newProfile.name, '← FROM NEW');
    console.log('  Company:', newProfile.company || 'N/A', '← FROM NEW');
    console.log('  Job:', newProfile.current_job || 'N/A', '← FROM NEW');
    console.log('  Location:', newProfile.location || 'N/A', '← FROM NEW');
    console.log('  Nickname:', newProfile.nicknames || 'N/A', '← FROM NEW');
    console.log('  Year:', newProfile.year_graduated || 'N/A', '← FROM NEW');
    console.log('  Image:', oldProfile.profile_image_url ? '✅ KEPT from OLD' : '❌ No image');

    // Show what's changing
    console.log('\n📊 CHANGES:');
    const changes = [];

    if (oldProfile.name !== newProfile.name) {
      changes.push(`  • Name: "${oldProfile.name}" → "${newProfile.name}"`);
    }
    if (oldProfile.company !== newProfile.company) {
      changes.push(`  • Company: "${oldProfile.company || 'N/A'}" → "${newProfile.company || 'N/A'}"`);
    }
    if (oldProfile.current_job !== newProfile.current_job) {
      changes.push(`  • Job: "${oldProfile.current_job || 'N/A'}" → "${newProfile.current_job || 'N/A'}"`);
    }
    if (oldProfile.location !== newProfile.location) {
      changes.push(`  • Location: "${oldProfile.location || 'N/A'}" → "${newProfile.location || 'N/A'}"`);
    }
    if (oldProfile.year_graduated !== newProfile.year_graduated) {
      changes.push(`  • Year: "${oldProfile.year_graduated || 'N/A'}" → "${newProfile.year_graduated || 'N/A'}"`);
    }

    if (changes.length > 0) {
      console.log(changes.join('\n'));
    } else {
      console.log('  No changes (data already same)');
    }

    // Image status
    if (oldProfile.profile_image_url) {
      console.log(`\n✅ PROFILE PICTURE: Preserved (${oldProfile.profile_image_url.substring(0, 60)}...)`);
    } else {
      console.log('\n⚠️  PROFILE PICTURE: Old profile has no image');
    }
  }

  console.log('\n\n' + '='.repeat(100));
  console.log('\n📋 SUMMARY:');
  console.log('  - Will UPDATE: 7 old profiles (' + pairs.map(p => p.old).join(', ') + ')');
  console.log('  - Will DELETE: 7 new profiles (' + pairs.map(p => p.new).join(', ') + ')');
  console.log('  - Profile pictures: KEPT from old profiles (no changes needed)');
  console.log('  - Gallery images: Merged to old profile IDs');
  console.log('  - Q&A answers: Merged to old profile IDs');
  console.log('\n💡 TIP: This is SAFER than copying images because:');
  console.log('  - Old profiles already have correct image URLs');
  console.log('  - Images are named by old IDs (e.g., 3-a-s-syed-ahamed-khan.png)');
  console.log('  - No risk of broken image links!');
  console.log('\n='.repeat(100));
}

// Run the script
showBeforeAfter()
  .then(() => {
    console.log('\n✅ Preview complete!');
    console.log('\nNext steps:');
    console.log('  1. Review the changes above');
    console.log('  2. If everything looks good, run: cleanup-duplicates-smart-approach.sql in Supabase');
    console.log('  3. After cleanup, verify with: scripts/verify-smart-cleanup.sql\n');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error during preview:', error);
    process.exit(1);
  });
