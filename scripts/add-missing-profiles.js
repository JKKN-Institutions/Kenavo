const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Missing profiles to add
const missingProfiles = [
  "George Hriatpuia",
  "Lura (deceased)",
  "M. Deepan Chakaravarthy",
  "Lalmalsawma Pachuau",
  "Mathew Kodath",
  "Nirmal Kumar (deceased)",
  "Paul Mathew",
  "Prasanna venkidasamy Sathyanarayanan",
  "R.Rangaraj",
  "SARAN KUMAR",
  "VT MARTIN VABEIDUAKHEI",
  "Lalfak Zuala",
  "Amos Lalfinga",
  "David Lalhmangaiha",
  "Lalbaik Sanga",
  "Ricky B.Hlychho",
  "Rosiamliana Rokhum",
  "Rymer Kharkongar",
  "Imitiaz Khan (SAI athlete)",
  "Riaz (SAI athlete)",
  "David Jain (day scholar)",
  "Staney",
  "SRIDHAR C",
  "R SENTHIL",
  "Dilip A",
  "MM Pratap",
  "VASANTH BENJAMIN G",
  "RAMESH P",
  "KARTHIK ANNAMALAI N",
  "SENDHIL KUMAR C P",
  "PRADEEP R"
];

async function addMissingProfiles() {
  console.log('=== ADDING MISSING PROFILES ===\n');
  console.log(`Total profiles to add: ${missingProfiles.length}\n`);

  // Get the highest ID first
  const { data: maxIdData } = await supabase
    .from('profiles')
    .select('id')
    .order('id', { ascending: false })
    .limit(1);

  let nextId = maxIdData && maxIdData.length > 0 ? maxIdData[0].id + 1 : 1;
  console.log(`Starting ID: ${nextId}\n`);

  let successCount = 0;
  let errorCount = 0;

  for (const name of missingProfiles) {
    // Check if profile already exists
    const { data: existing } = await supabase
      .from('profiles')
      .select('id, name')
      .eq('name', name)
      .single();

    if (existing) {
      console.log(`⚠️  Profile already exists: ${name} (ID: ${existing.id})`);
      continue;
    }

    // Insert the profile
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        id: nextId,
        name: name,
        year_graduated: 2007  // Default year, can be updated later
      })
      .select();

    if (error) {
      console.log(`❌ Failed to add "${name}":`, error.message);
      errorCount++;
    } else {
      console.log(`✅ Added: ${name} (ID: ${data[0].id})`);
      successCount++;
      nextId++;  // Increment for next profile
    }
  }

  console.log('\n=== ADDITION SUMMARY ===');
  console.log(`Successfully added: ${successCount}`);
  console.log(`Errors: ${errorCount}`);
  console.log(`Already existed: ${missingProfiles.length - successCount - errorCount}`);
  console.log(`Total processed: ${missingProfiles.length}`);

  // Final count
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true });

  console.log(`\nTotal profiles in database now: ${count}`);
}

addMissingProfiles().catch(console.error);
