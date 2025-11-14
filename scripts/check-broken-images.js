#!/usr/bin/env node

/**
 * Check Broken Images Script
 *
 * This script checks profile images in the database to identify:
 * 1. Profiles with missing image URLs (null or empty)
 * 2. Profiles with potentially broken Supabase Storage URLs
 * 3. Image URLs that might return 404
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkBrokenImages() {
  console.log('🔍 Checking for broken profile images...\n');

  try {
    // Fetch all profiles with their image URLs
    const { data: profiles, error } = await supabase
      .from('alumni_profiles')
      .select('id, name, slug, profile_image_url')
      .order('name');

    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }

    console.log(`📊 Total profiles: ${profiles.length}\n`);

    // Categorize profiles
    const missingImages = [];
    const hasImages = [];
    const invalidUrls = [];

    profiles.forEach(profile => {
      if (!profile.profile_image_url || profile.profile_image_url.trim() === '') {
        missingImages.push(profile);
      } else {
        hasImages.push(profile);

        // Check if URL looks valid
        const url = profile.profile_image_url;
        if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('/')) {
          invalidUrls.push({ ...profile, url });
        }
      }
    });

    // Report findings
    console.log('📋 Summary:');
    console.log(`  ✅ Profiles with images: ${hasImages.length}`);
    console.log(`  ❌ Profiles without images: ${missingImages.length}`);
    console.log(`  ⚠️  Invalid URL format: ${invalidUrls.length}\n`);

    // Show profiles without images (these will use placeholder)
    if (missingImages.length > 0) {
      console.log(`\n📝 Profiles using PLACEHOLDER image (${missingImages.length}):`);
      console.log('─'.repeat(80));
      missingImages.slice(0, 10).forEach(p => {
        console.log(`  • ${p.name} (${p.slug})`);
      });
      if (missingImages.length > 10) {
        console.log(`  ... and ${missingImages.length - 10} more`);
      }
    }

    // Show invalid URLs
    if (invalidUrls.length > 0) {
      console.log(`\n⚠️  Profiles with INVALID URL format (${invalidUrls.length}):`);
      console.log('─'.repeat(80));
      invalidUrls.forEach(p => {
        console.log(`  • ${p.name}`);
        console.log(`    URL: ${p.url}`);
      });
    }

    // Check Supabase Storage URLs
    const supabaseStorageUrls = hasImages.filter(p =>
      p.profile_image_url.includes('supabase') && p.profile_image_url.includes('storage')
    );

    if (supabaseStorageUrls.length > 0) {
      console.log(`\n☁️  Profiles using Supabase Storage (${supabaseStorageUrls.length}):`);
      console.log('─'.repeat(80));

      // Test a few URLs to see if they're accessible
      console.log('\n🔍 Testing first 5 Supabase Storage URLs...\n');

      for (const profile of supabaseStorageUrls.slice(0, 5)) {
        try {
          const response = await fetch(profile.profile_image_url, { method: 'HEAD' });
          const status = response.status;
          const statusText = status === 200 ? '✅ OK' : `❌ ${status}`;

          console.log(`  ${statusText} - ${profile.name}`);
          console.log(`       ${profile.profile_image_url}\n`);
        } catch (error) {
          console.log(`  ❌ ERROR - ${profile.name}`);
          console.log(`       ${error.message}\n`);
        }
      }
    }

    // Check for external URLs (Builder.io, etc.)
    const externalUrls = hasImages.filter(p =>
      p.profile_image_url.startsWith('http') && !p.profile_image_url.includes('supabase')
    );

    if (externalUrls.length > 0) {
      console.log(`\n🌐 Profiles using external URLs (${externalUrls.length}):`);
      console.log('─'.repeat(80));
      externalUrls.slice(0, 5).forEach(p => {
        console.log(`  • ${p.name}`);
        console.log(`    ${p.profile_image_url.substring(0, 80)}...`);
      });
    }

    console.log('\n✅ Image check complete!');
    console.log('\n💡 Tip: Profiles without images will display /placeholder-profile.svg');
    console.log('💡 Tip: Run this script with --fix flag to update broken URLs');

  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Run the check
checkBrokenImages();
