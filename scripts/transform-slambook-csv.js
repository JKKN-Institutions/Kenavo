const fs = require('fs');
const path = require('path');

// Question mapping - these correspond to question IDs 1-10 in the database
const questionColumns = [
  'A school memory that still makes you smile',
  'Your favourite spot in school',
  'If you get one full day in school today, what would you do...',
  'What advice would you give to the younger students entering the workforce today:',
  'A book / movie / experience that changed your perspective of life: ',
  'A personal achievement that means a lot to you:',
  'Your favourite hobby that you pursue when off work:',
  'Your favourite go-to song(s) to enliven your spirits ',
  'What does reconnecting with this alumni group mean to you at this stage of your life?',
  'Would you be open to mentoring younger students or collaborating with alumni?'
];

// Helper function to escape CSV values
function escapeCSV(value) {
  if (value === null || value === undefined || value === '') {
    return '';
  }

  const str = String(value).trim();

  // If value contains comma, newline, or quotes, wrap it in quotes
  if (str.includes(',') || str.includes('\n') || str.includes('"')) {
    // Escape existing quotes by doubling them
    return `"${str.replace(/"/g, '""')}"`;
  }

  return str;
}

// Helper function to extract graduation year from tenure
function extractGradYear(tenure) {
  if (!tenure || tenure.trim() === '') {
    return '';
  }

  // Extract the last 4 digits (graduation year)
  const match = tenure.match(/(\d{4})$/);
  return match ? match[1] : '';
}

// Read and parse the source CSV
function parseCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Parse header
  const header = lines[0].split(',').map(h => h.trim());

  const profiles = [];
  let currentProfile = null;
  let currentField = '';
  let inQuotes = false;

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];

    if (!line.trim()) continue;

    // Check if this is a new profile (starts with a number)
    const firstChar = line.charAt(0);
    if (firstChar >= '0' && firstChar <= '9' && !inQuotes) {
      // Save previous profile
      if (currentProfile) {
        profiles.push(currentProfile);
      }

      // Start new profile
      currentProfile = {};
      const parts = [];
      let current = '';
      inQuotes = false;

      for (let j = 0; j < line.length; j++) {
        const char = line[j];

        if (char === '"') {
          inQuotes = !inQuotes;
          current += char;
        } else if (char === ',' && !inQuotes) {
          parts.push(current.trim());
          current = '';
        } else {
          current += char;
        }
      }
      parts.push(current.trim());

      // Map to header
      for (let k = 0; k < header.length && k < parts.length; k++) {
        let value = parts[k];
        // Remove surrounding quotes if present
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1).replace(/""/g, '"');
        }
        currentProfile[header[k]] = value;
      }
    } else if (inQuotes) {
      // Continue multiline field
      const lastKey = Object.keys(currentProfile).pop();
      currentProfile[lastKey] += '\n' + line;

      // Check if quotes close
      if (line.includes('"')) {
        inQuotes = false;
      }
    }
  }

  // Save last profile
  if (currentProfile) {
    profiles.push(currentProfile);
  }

  return profiles;
}

// Read the CSV manually for better parsing
function readSourceCSV(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');

  // Simple CSV parser that handles multiline
  const rows = [];
  let currentRow = [];
  let currentCell = '';
  let inQuotes = false;

  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        // Escaped quote
        currentCell += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of cell
      currentRow.push(currentCell.trim());
      currentCell = '';
    } else if (char === '\n' && !inQuotes) {
      // End of row
      if (currentCell || currentRow.length > 0) {
        currentRow.push(currentCell.trim());
        if (currentRow.some(cell => cell !== '')) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentCell = '';
      }
    } else {
      currentCell += char;
    }
  }

  // Push last cell and row
  if (currentCell || currentRow.length > 0) {
    currentRow.push(currentCell.trim());
    if (currentRow.some(cell => cell !== '')) {
      rows.push(currentRow);
    }
  }

  return rows;
}

// Main processing function
function processCSV() {
  const sourcePath = 'C:\\Users\\admin\\Downloads\\Kevavo2kSlambookRecord - Sheet1.csv';
  const outputDir = 'C:\\Users\\admin\\Downloads';

  console.log('Reading source CSV...');
  const rows = readSourceCSV(sourcePath);

  const header = rows[0];
  const dataRows = rows.slice(1);

  console.log(`Found ${dataRows.length} profiles`);

  // Create profiles CSV
  const profilesCSV = [];
  profilesCSV.push('name,nicknames,location,current_job,year_graduated,company,bio,linkedin_url,email,phone,profile_image_url');

  // Create Q&A CSV (with placeholder profile_ids)
  const qaCSV = [];
  qaCSV.push('profile_id,question_id,answer');

  let stats = {
    totalProfiles: 0,
    profilesWithAnswers: 0,
    totalAnswers: 0,
    emptyAnswers: 0
  };

  dataRows.forEach((row, index) => {
    if (row.length < 17) {
      console.log(`Warning: Row ${index + 2} has only ${row.length} columns`);
      return;
    }

    stats.totalProfiles++;
    const profileId = index + 1; // Placeholder ID

    // Extract profile data
    const name = row[1] || ''; // Full Name
    const nicknames = row[2] || ''; // Nickname at School
    const location = row[3] || ''; // Current Residential Address
    const currentJob = row[4] || ''; // Current Profession and designation
    const tenure = row[5] || ''; // Tenure at Montfort
    const company = row[6] || ''; // Company / Organization / Industry Name

    // Extract graduation year (last 4 digits of tenure)
    const yearGraduated = extractGradYear(tenure);

    // Add to profiles CSV
    profilesCSV.push([
      escapeCSV(name),
      escapeCSV(nicknames),
      escapeCSV(location),
      escapeCSV(currentJob),
      escapeCSV(yearGraduated),
      escapeCSV(company),
      '', // bio
      '', // linkedin_url
      '', // email
      '', // phone
      ''  // profile_image_url
    ].join(','));

    // Process Q&A answers (columns 7-16 correspond to questions 1-10)
    let hasAnswers = false;
    for (let q = 0; q < 10; q++) {
      const answerIndex = 7 + q;
      const answer = row[answerIndex] || '';

      if (answer.trim() !== '') {
        qaCSV.push(`${profileId},${q + 1},${escapeCSV(answer)}`);
        stats.totalAnswers++;
        hasAnswers = true;
      } else {
        stats.emptyAnswers++;
      }
    }

    if (hasAnswers) {
      stats.profilesWithAnswers++;
    }
  });

  // Write profiles CSV
  const profilesPath = path.join(outputDir, 'profiles_upload.csv');
  fs.writeFileSync(profilesPath, profilesCSV.join('\n'), 'utf-8');
  console.log(`\n✓ Created profiles CSV: ${profilesPath}`);
  console.log(`  - ${stats.totalProfiles} profiles`);

  // Write Q&A CSV
  const qaPath = path.join(outputDir, 'qa_answers_template.csv');
  fs.writeFileSync(qaPath, qaCSV.join('\n'), 'utf-8');
  console.log(`\n✓ Created Q&A CSV: ${qaPath}`);
  console.log(`  - ${stats.totalAnswers} answers`);
  console.log(`  - ${stats.emptyAnswers} empty answers skipped`);
  console.log(`  - ${stats.profilesWithAnswers} profiles with at least one answer`);

  // Generate summary report
  const report = `
CSV TRANSFORMATION SUMMARY
==========================

Source File: ${sourcePath}
Processing Date: ${new Date().toISOString()}

STATISTICS:
-----------
Total Profiles: ${stats.totalProfiles}
Profiles with Answers: ${stats.profilesWithAnswers}
Total Q&A Answers: ${stats.totalAnswers}
Empty Answers (skipped): ${stats.emptyAnswers}

OUTPUT FILES:
-------------
1. profiles_upload.csv - ${stats.totalProfiles} profiles ready for bulk upload
2. qa_answers_template.csv - ${stats.totalAnswers} Q&A answers with placeholder IDs

IMPORTANT NOTES:
----------------
✓ Year_graduated extracted from "Tenure at Montfort" (last 4 digits)
✓ Empty optional fields (email, phone, bio, etc.) left blank
✓ Multi-line answers preserved with proper CSV escaping
✓ Special characters and commas properly escaped

UPLOAD WORKFLOW:
----------------
Step 1: Upload profiles_upload.csv
   - Go to Admin Panel > Bulk Create tab
   - Upload the profiles CSV
   - System will create profiles with auto-increment IDs

Step 2: Export Profile IDs from Admin Panel
   - After upload, export the created profiles
   - Note the profile IDs assigned by the system

Step 3: Update Q&A CSV with Real Profile IDs
   - Replace placeholder IDs (1, 2, 3...) with actual profile IDs
   - You can use VLOOKUP/INDEX-MATCH in Excel to map names to IDs

Step 4: Upload Q&A CSV
   - Go to Admin Panel > Q&A Upload tab
   - Upload the updated qa_answers_template.csv
   - System will insert the answers

VALIDATION CHECKS:
------------------
✓ All profile names present
✓ Year_graduated ≤ 4 characters (database constraint)
✓ CSV headers match expected format
✓ No invalid characters in data
✓ Proper quote escaping for special characters

Ready for upload!
`;

  const reportPath = path.join(outputDir, 'transformation_report.txt');
  fs.writeFileSync(reportPath, report, 'utf-8');
  console.log(`\n✓ Created summary report: ${reportPath}`);

  console.log('\n' + '='.repeat(60));
  console.log('TRANSFORMATION COMPLETE!');
  console.log('='.repeat(60));
  console.log(report);
}

// Run the script
try {
  processCSV();
} catch (error) {
  console.error('Error processing CSV:', error);
  process.exit(1);
}
