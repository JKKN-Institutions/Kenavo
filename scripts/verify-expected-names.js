const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Expected names from the user's list
const expectedNames = [
  "A Arjoon",
  "A S SYED AHAMED KHAN",
  "Abishek Valluru",
  "Abraham Francis",
  "Admin Selvaraj",
  "Aji P George",
  "Alemo Francis",
  "Anand",
  "Annadurai S.V",
  "Annamalai Natarajan",
  "Antony G Prakash",
  "Antony J",
  "Aravinth N",
  "AROKIA ROCHE J",
  "Arul Doss S P S",
  "Arun R",
  "Arvind Chennu",
  "Ashish Adyanthaya",
  "Ashok kumar Rajendran",
  "Ashok Loganathan",
  "Ashok Kumar S",
  "Avaneesh Jasti",
  "Bachan",
  "Badrinath",
  "Balaji A",
  "Balaji Srimurugan",
  "Bharanidharan",
  "Bhargavan Jayanth Kumar",
  "Bilal",
  "Biswajith Nayak",
  "Cam Braganza",
  "Carlin Aron Tannen",
  "Chacko",
  "Charles Ernest",
  "Chenthil Aruun Mohan",
  "Daniel Vincent",
  "Darwin",
  "David A",
  "David Jacob",
  "Debin Davis",
  "Deepak Chakravarthy Munirathinam",
  "Deepan MK",
  "Devaraj",
  "Dinesh",
  "Frank David",
  "Geethakannan",
  "George Hriatpuia",
  "Ghopal Krishnan",
  "Gopinath Perumal",
  "Hariharan P",
  "Harinivas Rajasekaran",
  "James Thomson",
  "Jeffery",
  "Jimmy",
  "Joe Abraham",
  "John Kennedy Francis",
  "Jose Peter Cletus",
  "Jose Thomas",
  "Joseph Cyriac",
  "Jossey Jacob",
  "K Arun Chakkravarthy",
  "K.C. Rameshkumar",
  "Kamalakannan",
  "Karthikeyan D",
  "Karthikeyan m",
  "Karun Mathulla Mathew",
  "Krishnakumar Murugesan",
  "Kumaran Srinivasan",
  "Kumaravel",
  "Kunal",
  "Lalchhanhima",
  "Lalhruaitluanga Khiangte",
  "Lura (deceased)",
  "M. Deepan Chakaravarthy",
  "Lalmalsawma Pachuau",
  "Mantah",
  "Mathew Kodath",
  "Medo Lalzarliana",
  "Mehfooz",
  "Mickey",
  "Mohamed Niaz",
  "Naveen G",
  "Niresh Ramalingam",
  "Nirmal Kumar (deceased)",
  "Nirmal Suresh Pattassery",
  "Ommsharravana",
  "Paul Mathew",
  "Pinga",
  "Prabhu",
  "Pradeep Seshan",
  "Pramod Sankar",
  "Pranesh Mario Bhaskar",
  "Prasadhkanna Kanthruban Rathinavelu",
  "Prasanna venkidasamy Sathyanarayanan",
  "Pratap",
  "PRAVIN KUMAR RAJU",
  "Prem Kumar Soundarrajan",
  "Prithivinath Ravindranath",
  "Purushothaman Elango",
  "R Praveen Kumar",
  "R.Rangaraj",
  "R Ramesh Krishnan",
  "Rathishkanth",
  "Salai Sivaprakasam",
  "SARAN KUMAR",
  "Selvakumar Sundaram",
  "Shankkar Suyambulingam",
  "Shravan Kumar Avula",
  "Sri Vishnu",
  "Srinivasan N",
  "Subbu Shanmugam Sundaresan",
  "Suraj de Rozario",
  "Suresh Louis",
  "Tabish",
  "Tarunesh Pasuparthy",
  "Thiagu R",
  "Tom Jogy",
  "Tony Luke",
  "Vairavan Subramanian",
  "Varadharajulu Chandrasekaran",
  "Venkatesh",
  "Vibin J Cheeran",
  "Vignesh M Ramamoorthy",
  "Vinod Maliyekal",
  "Vinoth Kannan",
  "Vishnu palanisami",
  "Vishnuvardan Raveendran",
  "Vishwanath Raj",
  "Vongsatorn Lertsethtakarn",
  "VT MARTIN VABEIDUAKHEI",
  "Yuvaraj",
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

async function verifyNames() {
  console.log('=== VERIFYING NAMES IN SUPABASE ===\n');
  console.log(`Expected names: ${expectedNames.length}\n`);

  // Fetch all profiles from Supabase
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, name')
    .order('name');

  if (error) {
    console.error('Error fetching profiles:', error);
    return;
  }

  console.log(`Profiles in database: ${profiles.length}\n`);

  // Normalize names for comparison (trim whitespace)
  const normalizedExpected = expectedNames.map(name => name.trim());
  const normalizedDb = profiles.map(p => ({ ...p, normalized: p.name.trim() }));

  // Find extras in database (not in expected list)
  const extras = normalizedDb.filter(
    dbProfile => !normalizedExpected.includes(dbProfile.normalized)
  );

  // Find missing from database (in expected list but not in DB)
  const missing = normalizedExpected.filter(
    expected => !normalizedDb.some(dbProfile => dbProfile.normalized === expected)
  );

  // Display results
  if (extras.length > 0) {
    console.log('❌ EXTRA PROFILES IN DATABASE (should be removed):');
    console.log('─'.repeat(60));
    extras.forEach(profile => {
      console.log(`  ID: ${profile.id}`);
      console.log(`  Name: "${profile.name}"`);
      console.log('');
    });
    console.log(`Total extras: ${extras.length}\n`);

    // Generate SQL to remove extras
    console.log('SQL to remove extras:');
    console.log('─'.repeat(60));
    extras.forEach(profile => {
      console.log(`DELETE FROM profiles WHERE id = '${profile.id}'; -- ${profile.name}`);
    });
    console.log('');
  } else {
    console.log('✅ No extra profiles found!\n');
  }

  if (missing.length > 0) {
    console.log('⚠️  MISSING PROFILES (in expected list but not in database):');
    console.log('─'.repeat(60));
    missing.forEach(name => {
      console.log(`  "${name}"`);
    });
    console.log(`Total missing: ${missing.length}\n`);
  } else {
    console.log('✅ No missing profiles!\n');
  }

  // Summary
  console.log('=== SUMMARY ===');
  console.log(`Expected names: ${expectedNames.length}`);
  console.log(`Database profiles: ${profiles.length}`);
  console.log(`Extras: ${extras.length}`);
  console.log(`Missing: ${missing.length}`);
  console.log(`Match: ${profiles.length - extras.length === expectedNames.length - missing.length ? '✅' : '❌'}`);
}

verifyNames().catch(console.error);
