const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// IDs of extra profiles to delete
const extraProfileIds = [
  140, // Cameron Braganza
  48,  // George
  61,  // Joseph Stany
  74,  // Lalfakzuala
  76,  // Lura
  77,  // Malsawma
  145, // MATHEW KODATH
  86,  // Nirmal Kumar
  89,  // Paul
  96,  // Prasanna Venkidasamy Sathyanarayanan
  98,  // Praveen Kumar R
  104, // Rajendran Rangaraj
  107, // Saran Kumar
  149, // satirical film made me rethink how narratives are shaped
  134, // Suhail
  132, // VT Martin Vabeiduakhe
  150  // VT Martin Vabeiduakhei
];

async function deleteExtraProfiles() {
  console.log('=== DELETING EXTRA PROFILES ===\n');
  console.log(`Total profiles to delete: ${extraProfileIds.length}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const id of extraProfileIds) {
    // Get profile name first
    const { data: profile } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('id', id)
      .single();

    if (!profile) {
      console.log(`❌ Profile ID ${id} not found (may have been already deleted)`);
      errorCount++;
      continue;
    }

    // Delete the profile
    const { error } = await supabase
      .from('profiles')
      .delete()
      .eq('id', id);

    if (error) {
      console.log(`❌ Failed to delete ID ${id} (${profile.name}):`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Deleted: ${profile.name} (ID: ${id})`);
      successCount++;
    }
  }

  console.log('\n=== DELETION SUMMARY ===');
  console.log(`Successfully deleted: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Total processed: ${extraProfileIds.length}`);
}

deleteExtraProfiles().catch(console.error);
