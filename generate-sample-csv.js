// Generate Sample CSV with Real Profile Data from Supabase
// This script fetches real profiles and creates a sample CSV for testing bulk updates

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function generateSampleCSV() {
  console.log('📥 Fetching real profiles from Supabase...');

  // Fetch first 5 profiles with all fields
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('*')
    .order('id', { ascending: true })
    .limit(5);

  if (error) {
    console.error('❌ Database error:', error);
    process.exit(1);
  }

  if (!profiles || profiles.length === 0) {
    console.error('❌ No profiles found in database');
    process.exit(1);
  }

  console.log(`✅ Found ${profiles.length} profiles`);

  // Create CSV headers
  const headers = [
    'id',
    'name',
    'email',
    'phone',
    'location',
    'year_graduated',
    'current_job',
    'company',
    'bio',
    'linkedin_url',
    'nicknames',
    'profile_image_url'
  ];

  // Helper to escape CSV values
  function escapeCSV(value) {
    if (value === null || value === undefined) return '';
    const str = String(value);
    // If contains comma, newline, or quotes, wrap in quotes and escape existing quotes
    if (str.includes(',') || str.includes('\n') || str.includes('"')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  }

  // Create CSV rows
  const csvRows = [headers.join(',')];

  profiles.forEach(profile => {
    const row = headers.map(header => escapeCSV(profile[header]));
    csvRows.push(row.join(','));
  });

  const csvContent = csvRows.join('\n');

  // Save to file
  const outputPath = path.join(__dirname, 'sample_bulk_update.csv');
  fs.writeFileSync(outputPath, csvContent, 'utf8');

  console.log('\n✅ Sample CSV file created successfully!');
  console.log(`📄 Location: ${outputPath}`);
  console.log(`\n📋 Profiles included:`);

  profiles.forEach(p => {
    console.log(`   - ID: ${p.id} | Name: ${p.name} | Year: ${p.year_graduated || 'N/A'}`);
  });

  console.log('\n💡 Instructions:');
  console.log('   1. Open sample_bulk_update.csv in Excel or any CSV editor');
  console.log('   2. Modify the fields you want to update (keep the ID column!)');
  console.log('   3. Save as CSV');
  console.log('   4. Upload via Admin Panel → Bulk Update tab');
  console.log('\n⚠️  Important: year_graduated must be 4 characters or less (e.g., "2024")');
}

generateSampleCSV().catch(console.error);
