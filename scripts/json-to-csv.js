// Convert JSON export to CSV template
const fs = require('fs');
const path = require('path');

// Read the JSON file
const jsonPath = path.join(__dirname, '..', 'profiles_export.json');
const profiles = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));

// CSV headers
const headers = [
  'id',
  'name',
  'profile_image_url',
  'location',
  'year_graduated',
  'current_job',
  'company',
  'bio',
  'email',
  'phone',
  'linkedin_url'
];

// Convert to CSV
function escapeCSV(value) {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Create CSV content
let csv = headers.join(',') + '\n';

profiles.forEach(profile => {
  const row = headers.map(header => escapeCSV(profile[header]));
  csv += row.join(',') + '\n';
});

// Save CSV
const csvPath = path.join(__dirname, '..', 'profiles_template.csv');
fs.writeFileSync(csvPath, csv, 'utf8');

console.log(`✅ CSV template created: ${csvPath}`);
console.log(`📊 Total profiles: ${profiles.length}`);
console.log('\n📝 Next steps:');
console.log('1. Open profiles_template.csv in Excel or Google Sheets');
console.log('2. Update the data (name, profile_image_url, etc.)');
console.log('3. Save as CSV');
console.log('4. Run: node scripts/csv-to-supabase.js profiles_template.csv');
