require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Normalization function (matches the API logic)
function normalizeName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, '')  // Remove special characters
    .replace(/\s+/g, ' ')      // Normalize whitespace
    .trim();
}

// Year extraction function (matches the API logic)
function extractGradYear(tenure) {
  if (!tenure) return '';
  const match = tenure.match(/(\d{4})$/);
  return match ? match[1] : '';
}

// Enhanced partial name matching
function getFirstLastName(normalizedName) {
  const words = normalizedName.split(' ').filter(w => w.length > 0);
  if (words.length >= 2) {
    return `${words[0]} ${words[words.length - 1]}`;
  }
  return normalizedName;
}

// Parse CSV line (handles quoted values)
function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

async function diagnoseMatching(csvFilePath) {
  console.log('🔍 Diagnosing Profile Matching Issues...\n');

  try {
    // Check if CSV file exists
    if (!fs.existsSync(csvFilePath)) {
      console.error(`❌ CSV file not found: ${csvFilePath}`);
      console.log('Usage: node scripts/diagnose-profile-matching.js <path-to-csv>');
      process.exit(1);
    }

    // Read CSV file
    console.log(`📄 Reading CSV file: ${csvFilePath}`);
    const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
    const lines = csvContent.split('\n').filter(line => line.trim());

    if (lines.length === 0) {
      console.error('❌ CSV file is empty');
      process.exit(1);
    }

    const headers = parseCSVLine(lines[0]).map(h => h.trim().replace(/^"|"$/g, '').toLowerCase());
    console.log(`📊 CSV Headers: ${headers.join(', ')}\n`);

    // Parse CSV rows
    const csvRows = [];
    for (let i = 1; i < lines.length; i++) {
      const values = parseCSVLine(lines[i]);
      const row = {};
      headers.forEach((h, idx) => {
        row[h] = values[idx] ? values[idx].trim().replace(/^"|"$/g, '') : '';
      });

      if (row['full name'] || row.name) {
        csvRows.push({
          rowNumber: i + 1,
          name: row['full name'] || row.name || '',
          tenure: row.tenure || row['year graduated'] || row.year_graduated || '',
          ...row
        });
      }
    }

    console.log(`📊 Total CSV rows: ${csvRows.length}\n`);

    // Fetch all profiles from database
    console.log('🔍 Fetching all profiles from database...');
    const { data: dbProfiles, error: dbError } = await supabase
      .from('profiles')
      .select('id, name, year_graduated')
      .order('name');

    if (dbError) {
      console.error('❌ Error fetching profiles:', dbError);
      process.exit(1);
    }

    console.log(`📊 Total DB profiles: ${dbProfiles.length}\n`);

    // Build lookup map
    const profileMap = new Map();
    dbProfiles.forEach(profile => {
      const normalizedName = normalizeName(profile.name);
      const year = profile.year_graduated || '';
      const key = `${normalizedName}|${year}`;

      if (!profileMap.has(key)) {
        profileMap.set(key, []);
      }
      profileMap.get(key).push(profile);
    });

    // Analyze matches
    const results = {
      exactMatch: [],
      partialMatch: [],
      noMatch: [],
      multipleMatch: [],
    };

    csvRows.forEach(row => {
      const csvNormalizedName = normalizeName(row.name);
      const csvYear = extractGradYear(row.tenure);
      const csvKey = `${csvNormalizedName}|${csvYear}`;

      // Try exact match
      const exactMatches = profileMap.get(csvKey);

      if (exactMatches && exactMatches.length === 1) {
        results.exactMatch.push({
          csv: row,
          db: exactMatches[0],
          confidence: 100,
          type: 'exact'
        });
      } else if (exactMatches && exactMatches.length > 1) {
        results.multipleMatch.push({
          csv: row,
          db: exactMatches,
          confidence: 100,
          type: 'multiple-exact'
        });
      } else {
        // Try partial matches
        let foundPartial = false;

        // Try without year
        for (const [key, profiles] of profileMap.entries()) {
          const [dbName, dbYear] = key.split('|');

          // Exact name, different/missing year
          if (dbName === csvNormalizedName) {
            results.partialMatch.push({
              csv: row,
              db: profiles,
              confidence: 90,
              type: 'name-only',
              reason: `Name matches, but year differs (CSV: "${csvYear}", DB: "${dbYear}")`
            });
            foundPartial = true;
            break;
          }

          // First + Last name match
          const csvFirstLast = getFirstLastName(csvNormalizedName);
          const dbFirstLast = getFirstLastName(dbName);
          if (csvFirstLast === dbFirstLast && csvFirstLast.split(' ').length >= 2) {
            results.partialMatch.push({
              csv: row,
              db: profiles,
              confidence: 75,
              type: 'first-last',
              reason: `First+Last name matches (CSV: "${csvNormalizedName}", DB: "${dbName}")`
            });
            foundPartial = true;
            break;
          }
        }

        if (!foundPartial) {
          results.noMatch.push({
            csv: row,
            normalizedName: csvNormalizedName,
            extractedYear: csvYear,
            reason: 'No matching profile found'
          });
        }
      }
    });

    // Display results
    console.log('═══════════════════════════════════════════════════════════\n');
    console.log('📊 MATCHING RESULTS SUMMARY:\n');
    console.log(`✅ Exact Matches:     ${results.exactMatch.length} profiles`);
    console.log(`⚠️  Partial Matches:  ${results.partialMatch.length} profiles`);
    console.log(`🔀 Multiple Matches: ${results.multipleMatch.length} profiles`);
    console.log(`❌ No Matches:       ${results.noMatch.length} profiles`);
    console.log('\n═══════════════════════════════════════════════════════════\n');

    // Show partial matches (potential improvements)
    if (results.partialMatch.length > 0) {
      console.log('⚠️  PARTIAL MATCHES (Could be improved with fuzzy matching):\n');
      results.partialMatch.forEach((match, idx) => {
        console.log(`${idx + 1}. CSV Row ${match.csv.rowNumber}: "${match.csv.name}"`);
        console.log(`   Tenure: "${match.csv.tenure}" → Year: "${extractGradYear(match.csv.tenure)}"`);
        console.log(`   Possible match: ID ${match.db[0].id} - "${match.db[0].name}" (${match.db[0].year_graduated})`);
        console.log(`   Confidence: ${match.confidence}% (${match.type})`);
        console.log(`   Reason: ${match.reason}`);
        console.log();
      });
      console.log('═══════════════════════════════════════════════════════════\n');
    }

    // Show no matches (the 9 problematic profiles)
    if (results.noMatch.length > 0) {
      console.log(`❌ NO MATCHES FOUND (${results.noMatch.length} profiles):\n`);
      console.log('These profiles will be CREATED AS NEW (potential duplicates):\n');

      results.noMatch.forEach((item, idx) => {
        console.log(`${idx + 1}. CSV Row ${item.csv.rowNumber}: "${item.csv.name}"`);
        console.log(`   Normalized: "${item.normalizedName}"`);
        console.log(`   Tenure: "${item.csv.tenure}" → Year: "${item.extractedYear || 'NONE'}"`);
        console.log(`   Reason: ${item.reason}`);

        // Suggest possible similar profiles
        const similarProfiles = dbProfiles.filter(p => {
          const dbNorm = normalizeName(p.name);
          return (
            dbNorm.includes(item.normalizedName.split(' ')[0]) ||
            item.normalizedName.includes(dbNorm.split(' ')[0])
          );
        });

        if (similarProfiles.length > 0) {
          console.log(`   💡 Similar profiles in DB:`);
          similarProfiles.slice(0, 3).forEach(p => {
            console.log(`      - ID ${p.id}: "${p.name}" (${p.year_graduated || 'no year'})`);
          });
        }
        console.log();
      });
      console.log('═══════════════════════════════════════════════════════════\n');
    }

    // Multiple matches (duplicates in DB)
    if (results.multipleMatch.length > 0) {
      console.log(`🔀 MULTIPLE MATCHES (${results.multipleMatch.length} profiles):\n`);
      console.log('These CSV rows match MORE THAN ONE database profile:\n');

      results.multipleMatch.forEach((item, idx) => {
        console.log(`${idx + 1}. CSV Row ${item.csv.rowNumber}: "${item.csv.name}"`);
        console.log(`   Matches ${item.db.length} profiles:`);
        item.db.forEach(p => {
          console.log(`   - ID ${p.id}: "${p.name}" (${p.year_graduated || 'no year'})`);
        });
        console.log();
      });
      console.log('═══════════════════════════════════════════════════════════\n');
    }

    // Recommendations
    console.log('💡 RECOMMENDATIONS:\n');

    if (results.noMatch.length > 0) {
      console.log(`1. Review ${results.noMatch.length} unmatched profiles above`);
      console.log('   → Check for name variations (nicknames, middle names, etc.)');
      console.log('   → Verify graduation years in database');
      console.log('   → Consider manual mapping or fuzzy matching\n');
    }

    if (results.partialMatch.length > 0) {
      console.log(`2. Consider implementing fuzzy matching for ${results.partialMatch.length} partial matches`);
      console.log('   → This would increase match rate significantly\n');
    }

    if (results.multipleMatch.length > 0) {
      console.log(`3. Resolve ${results.multipleMatch.length} duplicate profiles in database`);
      console.log('   → Run: node scripts/detect-duplicate-profiles.js\n');
    }

    console.log('✅ Diagnosis complete!\n');

    // Save results to file
    const reportPath = path.join(__dirname, '..', 'PROFILE_MATCHING_REPORT.json');
    fs.writeFileSync(reportPath, JSON.stringify({
      summary: {
        total: csvRows.length,
        exactMatch: results.exactMatch.length,
        partialMatch: results.partialMatch.length,
        multipleMatch: results.multipleMatch.length,
        noMatch: results.noMatch.length,
      },
      details: results,
      timestamp: new Date().toISOString(),
    }, null, 2));

    console.log(`📄 Detailed report saved to: ${reportPath}\n`);

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get CSV file path from command line
const csvFilePath = process.argv[2];

if (!csvFilePath) {
  console.log('Usage: node scripts/diagnose-profile-matching.js <path-to-csv-file>');
  console.log('Example: node scripts/diagnose-profile-matching.js ./uploads/slambook.csv');
  process.exit(1);
}

diagnoseMatching(csvFilePath);
