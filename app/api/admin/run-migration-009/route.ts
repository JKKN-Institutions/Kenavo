import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';

export const dynamic = 'force-dynamic';

/**
 * Migration 009: Update profiles UNIQUE Constraint
 *
 * Changes UNIQUE constraint from 'name' only to 'name + year_graduated'
 * This allows same names in different graduation years (more realistic)
 */
export async function POST() {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    console.log('🚀 Starting Migration 009: Update profiles UNIQUE Constraint');

    // Step 1: Drop old UNIQUE constraint on name
    console.log('Step 1: Dropping old UNIQUE constraint on name...');

    // Try to drop the constraint (it's okay if it doesn't exist)
    try {
      await supabaseAdmin.rpc('exec', {
        sql: 'ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_name_key;'
      });
      console.log('✅ Old constraint dropped');
    } catch (error: any) {
      // Check if error is because exec function doesn't exist
      if (error.code === 'PGRST202' || error.message?.includes('Could not find the function')) {
        // exec function doesn't exist, return manual instructions
        return NextResponse.json(
          {
            error: 'Direct SQL execution not available',
            requiresManualExecution: true,
            instructions: {
              step1: 'Go to Supabase SQL Editor: https://app.supabase.com/project/_/sql/new',
              step2: 'Copy the SQL below and paste it:',
              sql: `-- Drop old UNIQUE constraint on name
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_name_key;

-- Add new composite UNIQUE constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_name_year_unique UNIQUE (name, year_graduated);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_name_year ON profiles(name, year_graduated);`,
              step3: 'Click "Run" to execute the migration',
              step4: 'Reload this page and try uploading the CSV again'
            }
          },
          { status: 400 }
        );
      }
      throw error;
    }

    // Step 2: Add new composite UNIQUE constraint
    console.log('Step 2: Adding new composite UNIQUE constraint...');
    await supabaseAdmin.rpc('exec', {
      sql: 'ALTER TABLE profiles ADD CONSTRAINT profiles_name_year_unique UNIQUE (name, year_graduated);'
    });
    console.log('✅ New constraint added');

    // Step 3: Create index
    console.log('Step 3: Creating performance index...');
    await supabaseAdmin.rpc('exec', {
      sql: 'CREATE INDEX IF NOT EXISTS idx_profiles_name_year ON profiles(name, year_graduated);'
    });
    console.log('✅ Index created');

    console.log('✅ Migration 009 completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Migration 009 completed successfully',
      details: {
        changes: [
          'Dropped UNIQUE constraint on name column',
          'Added composite UNIQUE constraint on (name, year_graduated)',
          'Created index on (name, year_graduated) for performance'
        ],
        impact: [
          'Same names now allowed in different graduation years',
          'CSV uploads will use UPSERT logic',
          'Existing profiles remain unchanged'
        ]
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Migration 009 failed:', error);

    // Return manual instructions as fallback
    return NextResponse.json(
      {
        error: 'Migration failed - manual execution required',
        details: error instanceof Error ? error.message : 'Unknown error',
        requiresManualExecution: true,
        instructions: {
          step1: 'Go to Supabase SQL Editor: https://app.supabase.com/project/_/sql/new',
          step2: 'Copy and paste this SQL:',
          sql: `-- Drop old UNIQUE constraint on name
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_name_key;

-- Add new composite UNIQUE constraint
ALTER TABLE profiles ADD CONSTRAINT profiles_name_year_unique UNIQUE (name, year_graduated);

-- Create index for performance
CREATE INDEX IF NOT EXISTS idx_profiles_name_year ON profiles(name, year_graduated);`,
          step3: 'Click "Run" to execute the migration',
          step4: 'Reload this page and try uploading the CSV again'
        }
      },
      { status: 500 }
    );
  }
}
