require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function verifyProfileConsistency() {
  console.log('🔍 Verifying Profile Data Consistency...\n');

  try {
    // Fetch all profiles
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('*')
      .order('id');

    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }

    console.log(`📊 Analyzing ${profiles.length} profiles...\n`);

    // Consistency checks
    const issues = {
      missingRequiredFields: [],
      invalidYearFormat: [],
      missingTimestamps: [],
      futureTimestamps: [],
      invalidEmail: [],
      dataIntegrityIssues: [],
    };

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const now = new Date();

    profiles.forEach(profile => {
      // Check required fields
      if (!profile.name || profile.name.trim() === '') {
        issues.missingRequiredFields.push({
          id: profile.id,
          issue: 'Missing name'
        });
      }

      // Check year format
      if (profile.year_graduated) {
        if (profile.year_graduated.length !== 4 || isNaN(profile.year_graduated)) {
          issues.invalidYearFormat.push({
            id: profile.id,
            name: profile.name,
            year: profile.year_graduated
          });
        }
      }

      // Check timestamps
      if (!profile.created_at) {
        issues.missingTimestamps.push({
          id: profile.id,
          name: profile.name,
          issue: 'Missing created_at'
        });
      }
      if (!profile.updated_at) {
        issues.missingTimestamps.push({
          id: profile.id,
          name: profile.name,
          issue: 'Missing updated_at'
        });
      }

      // Check for future timestamps
      if (profile.created_at && new Date(profile.created_at) > now) {
        issues.futureTimestamps.push({
          id: profile.id,
          name: profile.name,
          timestamp: profile.created_at
        });
      }

      // Check email format
      if (profile.email && !emailRegex.test(profile.email)) {
        issues.invalidEmail.push({
          id: profile.id,
          name: profile.name,
          email: profile.email
        });
      }

      // Check data integrity (created_at should be <= updated_at)
      if (profile.created_at && profile.updated_at) {
        if (new Date(profile.created_at) > new Date(profile.updated_at)) {
          issues.dataIntegrityIssues.push({
            id: profile.id,
            name: profile.name,
            issue: 'created_at is after updated_at',
            created: profile.created_at,
            updated: profile.updated_at
          });
        }
      }
    });

    // Report findings
    let totalIssues = 0;

    console.log('📋 CONSISTENCY CHECK RESULTS:\n');

    if (issues.missingRequiredFields.length > 0) {
      console.log(`❌ Missing Required Fields: ${issues.missingRequiredFields.length}`);
      issues.missingRequiredFields.slice(0, 5).forEach(i => {
        console.log(`   • ID ${i.id}: ${i.issue}`);
      });
      if (issues.missingRequiredFields.length > 5) {
        console.log(`   ... and ${issues.missingRequiredFields.length - 5} more`);
      }
      console.log();
      totalIssues += issues.missingRequiredFields.length;
    }

    if (issues.invalidYearFormat.length > 0) {
      console.log(`⚠️  Invalid Year Format: ${issues.invalidYearFormat.length}`);
      issues.invalidYearFormat.slice(0, 5).forEach(i => {
        console.log(`   • ID ${i.id} (${i.name}): "${i.year}" is not a valid 4-digit year`);
      });
      if (issues.invalidYearFormat.length > 5) {
        console.log(`   ... and ${issues.invalidYearFormat.length - 5} more`);
      }
      console.log();
      totalIssues += issues.invalidYearFormat.length;
    }

    if (issues.missingTimestamps.length > 0) {
      console.log(`⚠️  Missing Timestamps: ${issues.missingTimestamps.length}`);
      issues.missingTimestamps.slice(0, 5).forEach(i => {
        console.log(`   • ID ${i.id} (${i.name}): ${i.issue}`);
      });
      if (issues.missingTimestamps.length > 5) {
        console.log(`   ... and ${issues.missingTimestamps.length - 5} more`);
      }
      console.log();
      totalIssues += issues.missingTimestamps.length;
    }

    if (issues.futureTimestamps.length > 0) {
      console.log(`⚠️  Future Timestamps: ${issues.futureTimestamps.length}`);
      issues.futureTimestamps.slice(0, 5).forEach(i => {
        console.log(`   • ID ${i.id} (${i.name}): ${i.timestamp}`);
      });
      console.log();
      totalIssues += issues.futureTimestamps.length;
    }

    if (issues.invalidEmail.length > 0) {
      console.log(`⚠️  Invalid Email Addresses: ${issues.invalidEmail.length}`);
      issues.invalidEmail.slice(0, 5).forEach(i => {
        console.log(`   • ID ${i.id} (${i.name}): "${i.email}"`);
      });
      if (issues.invalidEmail.length > 5) {
        console.log(`   ... and ${issues.invalidEmail.length - 5} more`);
      }
      console.log();
      totalIssues += issues.invalidEmail.length;
    }

    if (issues.dataIntegrityIssues.length > 0) {
      console.log(`❌ Data Integrity Issues: ${issues.dataIntegrityIssues.length}`);
      issues.dataIntegrityIssues.forEach(i => {
        console.log(`   • ID ${i.id} (${i.name}): ${i.issue}`);
        console.log(`     Created: ${i.created}, Updated: ${i.updated}`);
      });
      console.log();
      totalIssues += issues.dataIntegrityIssues.length;
    }

    if (totalIssues === 0) {
      console.log('✅ All profiles are consistent! No issues found.\n');
    } else {
      console.log(`⚠️  Found ${totalIssues} total issues across ${profiles.length} profiles\n`);
    }

    // Statistics
    console.log('📊 PROFILE STATISTICS:');
    const withEmail = profiles.filter(p => p.email).length;
    const withPhone = profiles.filter(p => p.phone).length;
    const withLocation = profiles.filter(p => p.location).length;
    const withYear = profiles.filter(p => p.year_graduated).length;
    const withJob = profiles.filter(p => p.current_job).length;
    const withCompany = profiles.filter(p => p.company).length;
    const withBio = profiles.filter(p => p.bio).length;
    const withImage = profiles.filter(p => p.profile_image_url).length;

    console.log(`   • With Email: ${withEmail} (${(withEmail/profiles.length*100).toFixed(1)}%)`);
    console.log(`   • With Phone: ${withPhone} (${(withPhone/profiles.length*100).toFixed(1)}%)`);
    console.log(`   • With Location: ${withLocation} (${(withLocation/profiles.length*100).toFixed(1)}%)`);
    console.log(`   • With Year: ${withYear} (${(withYear/profiles.length*100).toFixed(1)}%)`);
    console.log(`   • With Job: ${withJob} (${(withJob/profiles.length*100).toFixed(1)}%)`);
    console.log(`   • With Company: ${withCompany} (${(withCompany/profiles.length*100).toFixed(1)}%)`);
    console.log(`   • With Bio: ${withBio} (${(withBio/profiles.length*100).toFixed(1)}%)`);
    console.log(`   • With Image: ${withImage} (${(withImage/profiles.length*100).toFixed(1)}%)`);
    console.log();

    console.log('✅ Consistency check complete!\n');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

verifyProfileConsistency();
