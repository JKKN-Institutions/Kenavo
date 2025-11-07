-- Create a database function to execute migration SQL
-- This function can be called via Supabase RPC to run migrations programmatically
-- IMPORTANT: Run this migration FIRST before using it to run other migrations

-- Drop function if exists
DROP FUNCTION IF EXISTS public.run_migration_sql(text);

-- Create function to execute arbitrary SQL (admin only)
CREATE OR REPLACE FUNCTION public.run_migration_sql(migration_sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER -- Run with function owner's privileges
AS $$
DECLARE
  result_message text;
BEGIN
  -- Check if the calling user is an admin
  -- This requires profiles table to exist
  IF NOT EXISTS (
    SELECT 1 FROM profiles
    WHERE id = auth.uid()
    AND role = 'admin'
  ) THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required';
  END IF;

  -- Execute the SQL
  EXECUTE migration_sql;

  result_message := 'Migration executed successfully';

  RETURN jsonb_build_object(
    'success', true,
    'message', result_message
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.run_migration_sql(text) TO authenticated;

-- Add comment
COMMENT ON FUNCTION public.run_migration_sql IS
  'Executes migration SQL. Restricted to admin users only. Used for programmatic migrations.';

-- Alternative: Create a simpler version that doesn't require auth check
-- Useful for initial setup when profiles table doesn't exist yet
DROP FUNCTION IF EXISTS public.run_migration_sql_unsafe(text);

CREATE OR REPLACE FUNCTION public.run_migration_sql_unsafe(migration_sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_message text;
BEGIN
  -- WARNING: No auth check - use with caution!
  -- This function should be dropped after initial migration

  EXECUTE migration_sql;

  result_message := 'Migration executed successfully';

  RETURN jsonb_build_object(
    'success', true,
    'message', result_message
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

-- Grant execute permission to service role
GRANT EXECUTE ON FUNCTION public.run_migration_sql_unsafe(text) TO service_role;

COMMENT ON FUNCTION public.run_migration_sql_unsafe IS
  'UNSAFE: Executes migration SQL without auth check. Should be dropped after initial setup.';
