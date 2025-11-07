const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function cleanupProfileData() {
  console.log('=== CLEANING UP PROFILE DATA ===\n');
  console.log('This will clear all profile field values EXCEPT id and name\n');
  console.log('Fields to be cleared:');
  console.log('  - email, phone, location');
  console.log('  - year_graduated, current_job, company');
  console.log('  - bio, linkedin_url, nicknames');
  console.log('  - profile_image_url (images stay in storage)\n');

  try {
    // Get current profile count
    const { count: totalProfiles } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });

    console.log(`Total profiles in database: ${totalProfiles}\n`);

    // Show a few sample profiles before cleanup
    const { data: sampleBefore, error: sampleError } = await supabase
      .from('profiles')
      .select('id, name, email, location, year_graduated, profile_image_url')
      .limit(3);

    if (sampleBefore && sampleBefore.length > 0) {
      console.log('Sample profiles BEFORE cleanup:');
      console.log('─'.repeat(80));
      sampleBefore.forEach(p => {
        console.log(`ID: ${p.id} | Name: ${p.name}`);
        console.log(`  Email: ${p.email || 'null'}`);
        console.log(`  Location: ${p.location || 'null'}`);
        console.log(`  Year: ${p.year_graduated || 'null'}`);
        console.log(`  Image: ${p.profile_image_url ? 'Has image' : 'null'}`);
        console.log('');
      });
    }

    console.log('Starting cleanup...\n');

    // Update all profiles to clear field values
    const { data: updatedData, error: updateError } = await supabase
      .from('profiles')
      .update({
        email: null,
        phone: null,
        location: null,
        year_graduated: null,
        current_job: null,
        company: null,
        bio: null,
        linkedin_url: null,
        nicknames: null,
        profile_image_url: null,
        updated_at: new Date().toISOString()
      })
      .not('id', 'is', null) // Update all rows
      .select('id, name');

    if (updateError) {
      console.error('❌ Error during cleanup:', updateError);
      return;
    }

    console.log(`✅ Successfully cleared data for ${updatedData.length} profiles\n`);

    // Verify cleanup - check a few profiles
    const { data: sampleAfter, error: verifyError } = await supabase
      .from('profiles')
      .select('id, name, email, location, year_graduated, profile_image_url')
      .limit(3);

    if (sampleAfter) {
      console.log('Sample profiles AFTER cleanup:');
      console.log('─'.repeat(80));
      sampleAfter.forEach(p => {
        console.log(`ID: ${p.id} | Name: ${p.name}`);
        console.log(`  Email: ${p.email || 'null'}`);
        console.log(`  Location: ${p.location || 'null'}`);
        console.log(`  Year: ${p.year_graduated || 'null'}`);
        console.log(`  Image: ${p.profile_image_url || 'null'}`);
        console.log('');
      });
    }

    console.log('=== CLEANUP COMPLETE ===');
    console.log(`✅ All profile data cleared (ID and Name preserved)`);
    console.log(`✅ ${updatedData.length} profiles updated`);
    console.log(`✅ Images remain in Supabase Storage (only URLs cleared)`);

  } catch (error) {
    console.error('❌ Fatal error:', error);
  }
}

cleanupProfileData().catch(console.error);
