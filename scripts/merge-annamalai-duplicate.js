/**
 * Merge Duplicate Annamalai Natarajan Profiles
 *
 * Keep: ID 2 (original profile with image)
 * Delete: ID 138 (wrongly created duplicate with better data but no image)
 *
 * Strategy:
 * 1. Copy the better data from ID 138 to ID 2
 * 2. Migrate any Q&A answers from ID 138 to ID 2
 * 3. Delete ID 138
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const KEEP_ID = 2;      // Original profile (has image)
const DELETE_ID = 138;  // Duplicate to delete (has better data)

async function mergeDuplicate() {
  console.log('🔄 Merging Annamalai Natarajan duplicate profiles...\n');

  // Step 1: Fetch both profiles
  console.log('📥 Fetching profiles...');
  const { data: profiles, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .in('id', [KEEP_ID, DELETE_ID]);

  if (fetchError || !profiles || profiles.length !== 2) {
    console.error('❌ Error fetching profiles:', fetchError);
    process.exit(1);
  }

  const keep = profiles.find(p => p.id === KEEP_ID);
  const remove = profiles.find(p => p.id === DELETE_ID);

  console.log(`\n✅ Found both profiles:`);
  console.log(`   KEEP   ID ${keep.id}: Year=${keep.year_graduated}, Job="${keep.current_job}", Image=${keep.profile_image_url ? 'Yes' : 'No'}`);
  console.log(`   DELETE ID ${remove.id}: Year=${remove.year_graduated}, Job="${remove.current_job}", Image=${remove.profile_image_url ? 'Yes' : 'No'}\n`);

  // Step 2: Prepare merged data (but don't update yet - must delete duplicate first)
  console.log('🔀 Preparing merged data...');
  const mergedData = {
    name: keep.name, // Keep original name
    year_graduated: remove.year_graduated || keep.year_graduated, // Prefer non-null
    current_job: remove.current_job || keep.current_job,
    company: remove.company || keep.company,
    location: remove.location || keep.location,
    bio: remove.bio || keep.bio,
    linkedin_url: remove.linkedin_url || keep.linkedin_url,
    nicknames: remove.nicknames || keep.nicknames,
    email: remove.email || keep.email,
    phone: remove.phone || keep.phone,
    profile_image_url: keep.profile_image_url, // PRESERVE original image
  };
  console.log('   ✅ Merge strategy prepared\n');

  // Step 3: Migrate Q&A answers
  console.log('📝 Migrating Q&A answers...');

  // Check if ID 138 has any Q&A answers
  const { data: qaAnswers, error: qaFetchError } = await supabase
    .from('profile_answers')
    .select('*')
    .eq('profile_id', DELETE_ID);

  if (qaFetchError) {
    console.error('❌ Error fetching Q&A answers:', qaFetchError);
    process.exit(1);
  }

  if (qaAnswers && qaAnswers.length > 0) {
    console.log(`   Found ${qaAnswers.length} Q&A answers from ID ${DELETE_ID}`);

    // Delete existing Q&A for ID 2 (if any)
    const { error: qaDeleteError } = await supabase
      .from('profile_answers')
      .delete()
      .eq('profile_id', KEEP_ID);

    if (qaDeleteError) {
      console.error('❌ Error deleting old Q&A:', qaDeleteError);
      process.exit(1);
    }

    // Copy Q&A from ID 138 to ID 2
    const newQA = qaAnswers.map(qa => ({
      profile_id: KEEP_ID,
      question_id: qa.question_id,
      answer: qa.answer
    }));

    const { error: qaInsertError } = await supabase
      .from('profile_answers')
      .insert(newQA);

    if (qaInsertError) {
      console.error('❌ Error inserting Q&A:', qaInsertError);
      process.exit(1);
    }

    console.log(`   ✅ Migrated ${qaAnswers.length} Q&A answers to ID ${KEEP_ID}\n`);
  } else {
    console.log(`   No Q&A answers to migrate\n`);
  }

  // Step 4: Delete the duplicate profile FIRST (to avoid unique constraint)
  console.log(`🗑️  Deleting duplicate profile ID ${DELETE_ID}...`);

  // First delete Q&A answers for the duplicate
  const { error: qaDeleteFinalError } = await supabase
    .from('profile_answers')
    .delete()
    .eq('profile_id', DELETE_ID);

  if (qaDeleteFinalError) {
    console.error('❌ Error deleting Q&A for duplicate:', qaDeleteFinalError);
    process.exit(1);
  }

  // Then delete the duplicate profile
  const { error: deleteError } = await supabase
    .from('profiles')
    .delete()
    .eq('id', DELETE_ID);

  if (deleteError) {
    console.error('❌ Error deleting duplicate profile:', deleteError);
    process.exit(1);
  }

  console.log(`   ✅ Deleted duplicate profile ID ${DELETE_ID}\n`);

  // Step 5: NOW update the original profile with merged data
  console.log(`📝 Updating ID ${KEEP_ID} with merged data...`);
  const { error: updateError } = await supabase
    .from('profiles')
    .update(mergedData)
    .eq('id', KEEP_ID);

  if (updateError) {
    console.error('❌ Error updating profile:', updateError);
    process.exit(1);
  }
  console.log('   ✅ Profile updated with merged data\n');

  // Step 5: Verify final state
  console.log('✅ MERGE COMPLETE!\n');
  console.log('📊 Final Result:');
  const { data: finalProfile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', KEEP_ID)
    .single();

  if (finalProfile) {
    console.log(`   ID: ${finalProfile.id}`);
    console.log(`   Name: "${finalProfile.name}"`);
    console.log(`   Year: ${finalProfile.year_graduated}`);
    console.log(`   Job: ${finalProfile.current_job}`);
    console.log(`   Company: ${finalProfile.company}`);
    console.log(`   Image: ${finalProfile.profile_image_url ? 'Yes' : 'No'}`);
  }

  console.log('\n✅ Duplicate successfully merged and removed!');
  process.exit(0);
}

mergeDuplicate().catch(err => {
  console.error('❌ Fatal error:', err);
  process.exit(1);
});
