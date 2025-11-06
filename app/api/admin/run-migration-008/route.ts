import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase-admin';
import { protectAdminRoute } from '@/lib/auth/api-protection';

export const dynamic = 'force-dynamic';

/**
 * Migration 008: Add Auto-Increment to profiles.id
 *
 * This endpoint runs the migration to add SERIAL behavior to profiles.id
 * while preserving existing manually-assigned IDs.
 */
export async function POST() {
  // Protect this route - require admin authentication
  const authCheck = await protectAdminRoute();
  if (authCheck) return authCheck;

  try {
    console.log('🚀 Starting Migration 008: Add Auto-Increment to profiles.id');

    // Step 1: Create sequence
    console.log('Step 1: Creating sequence...');
    const { error: error1 } = await supabaseAdmin.rpc('exec_sql', {
      sql: 'CREATE SEQUENCE IF NOT EXISTS profiles_id_seq;'
    });

    if (error1 && !error1.message?.includes('already exists')) {
      console.error('Error in step 1:', error1);
      return NextResponse.json(
        {
          error: 'Failed to create sequence',
          details: error1.message,
          step: 1
        },
        { status: 500 }
      );
    }

    // Step 2: Get max ID and set sequence
    console.log('Step 2: Getting max profile ID...');
    const { data: maxIdResult, error: maxIdError } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .order('id', { ascending: false })
      .limit(1);

    if (maxIdError) {
      console.error('Error getting max ID:', maxIdError);
      return NextResponse.json(
        {
          error: 'Failed to get max profile ID',
          details: maxIdError.message,
          step: 2
        },
        { status: 500 }
      );
    }

    const maxId = maxIdResult && maxIdResult.length > 0 ? maxIdResult[0].id : 0;
    console.log(`Current max profile ID: ${maxId}`);

    console.log('Step 3: Setting sequence value...');
    const { error: error2 } = await supabaseAdmin.rpc('exec_sql', {
      sql: `SELECT setval('profiles_id_seq', ${maxId}, true);`
    });

    if (error2) {
      console.error('Error in step 3:', error2);
      return NextResponse.json(
        {
          error: 'Failed to set sequence value',
          details: error2.message,
          step: 3
        },
        { status: 500 }
      );
    }

    // Step 4: Alter column default
    console.log('Step 4: Setting column default...');
    const { error: error3 } = await supabaseAdmin.rpc('exec_sql', {
      sql: `ALTER TABLE profiles ALTER COLUMN id SET DEFAULT nextval('profiles_id_seq');`
    });

    if (error3) {
      console.error('Error in step 4:', error3);
      return NextResponse.json(
        {
          error: 'Failed to set column default',
          details: error3.message,
          step: 4
        },
        { status: 500 }
      );
    }

    // Step 5: Grant permissions
    console.log('Step 5: Granting permissions...');
    const { error: error4 } = await supabaseAdmin.rpc('exec_sql', {
      sql: `
        GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO authenticated;
        GRANT USAGE, SELECT ON SEQUENCE profiles_id_seq TO anon;
      `
    });

    if (error4) {
      console.error('Error in step 5:', error4);
      // This is non-critical, so we'll just warn
      console.warn('Warning: Could not grant permissions, but migration should still work');
    }

    console.log('✅ Migration 008 completed successfully!');

    return NextResponse.json({
      success: true,
      message: 'Migration 008 completed successfully',
      details: {
        maxProfileId: maxId,
        nextProfileId: maxId + 1,
        changes: [
          'Created sequence: profiles_id_seq',
          `Set sequence to start from ${maxId + 1}`,
          'Set profiles.id column default to auto-increment',
          'Granted sequence permissions'
        ]
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Migration 008 failed:', error);
    return NextResponse.json(
      {
        error: 'Migration failed',
        details: error instanceof Error ? error.message : 'Unknown error',
        manualInstructions: {
          step1: 'Go to https://app.supabase.com/project/_/sql/new',
          step2: 'Copy the SQL from supabase/migrations/008_add_profiles_id_autoincrement.sql',
          step3: 'Paste and click Run'
        }
      },
      { status: 500 }
    );
  }
}
