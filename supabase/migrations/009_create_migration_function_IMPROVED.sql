-- IMPROVED: Create a database function to execute migration SQL
-- This function can be called via Supabase RPC to run migrations programmatically
-- Improvements: Better error handling, audit logging, auto-cleanup

-- ==============================================
-- 1. CREATE MIGRATION EXECUTION FUNCTION
-- ==============================================

-- Drop if exists
DROP FUNCTION IF EXISTS public.run_migration_sql_unsafe(text);

CREATE OR REPLACE FUNCTION public.run_migration_sql_unsafe(migration_sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_message text;
  execution_start timestamptz;
  execution_end timestamptz;
  execution_duration interval;
BEGIN
  -- Log execution start
  execution_start := clock_timestamp();

  -- Validate input (prevent empty SQL)
  IF migration_sql IS NULL OR trim(migration_sql) = '' THEN
    RAISE EXCEPTION 'Migration SQL cannot be empty';
  END IF;

  -- Prevent dangerous operations (optional safety check)
  IF migration_sql ~* 'DROP\s+DATABASE|DROP\s+SCHEMA\s+public' THEN
    RAISE EXCEPTION 'Dropping database or public schema is not allowed';
  END IF;

  -- Execute the SQL
  EXECUTE migration_sql;

  -- Log execution end
  execution_end := clock_timestamp();
  execution_duration := execution_end - execution_start;

  result_message := format(
    'Migration executed successfully in %s',
    execution_duration::text
  );

  -- Return success with timing
  RETURN jsonb_build_object(
    'success', true,
    'message', result_message,
    'execution_time', execution_duration::text,
    'started_at', execution_start,
    'completed_at', execution_end
  );

EXCEPTION WHEN OTHERS THEN
  -- Return detailed error information
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'error_detail', SQLSTATE,
    'error_hint', 'Check SQL syntax and permissions',
    'started_at', execution_start,
    'failed_at', clock_timestamp()
  );
END;
$$;

-- Grant execute permission ONLY to service_role
GRANT EXECUTE ON FUNCTION public.run_migration_sql_unsafe(text) TO service_role;

-- Revoke from all other roles for safety
REVOKE EXECUTE ON FUNCTION public.run_migration_sql_unsafe(text) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.run_migration_sql_unsafe(text) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.run_migration_sql_unsafe(text) FROM anon;

-- Add comprehensive comment
COMMENT ON FUNCTION public.run_migration_sql_unsafe IS
  'UNSAFE: Executes migration SQL without auth check.
   - Only callable via service_role (backend only)
   - Includes basic safety checks (no DROP DATABASE/SCHEMA)
   - Returns execution timing and detailed errors
   - MUST be dropped after initial setup for security
   - Usage: SELECT run_migration_sql_unsafe(''CREATE TABLE...'');';

-- ==============================================
-- 2. CREATE CLEANUP FUNCTION
-- ==============================================

-- Function to safely drop the unsafe migration function
CREATE OR REPLACE FUNCTION public.drop_unsafe_migration_function()
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Drop the unsafe function
  DROP FUNCTION IF EXISTS public.run_migration_sql_unsafe(text);

  -- Also drop self (cleanup function)
  DROP FUNCTION IF EXISTS public.drop_unsafe_migration_function();

  RETURN jsonb_build_object(
    'success', true,
    'message', 'Unsafe migration functions removed successfully'
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.drop_unsafe_migration_function() TO service_role;

COMMENT ON FUNCTION public.drop_unsafe_migration_function IS
  'Cleanup function that drops the unsafe migration function and itself.
   Run after migrations are complete.
   Usage: SELECT drop_unsafe_migration_function();';

-- ==============================================
-- 3. CREATE SAFE ADMIN-ONLY VERSION (OPTIONAL)
-- ==============================================

-- This version requires admin authentication
DROP FUNCTION IF EXISTS public.run_migration_sql(text);

CREATE OR REPLACE FUNCTION public.run_migration_sql(migration_sql text)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  result_message text;
  user_role text;
BEGIN
  -- Get current user's role
  SELECT role INTO user_role
  FROM profiles
  WHERE id = auth.uid();

  -- Check if user is admin
  IF user_role IS NULL OR user_role != 'admin' THEN
    RAISE EXCEPTION 'Unauthorized: Admin access required. Current role: %', COALESCE(user_role, 'none');
  END IF;

  -- Validate input
  IF migration_sql IS NULL OR trim(migration_sql) = '' THEN
    RAISE EXCEPTION 'Migration SQL cannot be empty';
  END IF;

  -- Execute the SQL
  EXECUTE migration_sql;

  result_message := 'Migration executed successfully by admin';

  RETURN jsonb_build_object(
    'success', true,
    'message', result_message,
    'executed_by', auth.uid()
  );

EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'detail', SQLSTATE
  );
END;
$$;

GRANT EXECUTE ON FUNCTION public.run_migration_sql(text) TO authenticated;

COMMENT ON FUNCTION public.run_migration_sql IS
  'SAFE: Executes migration SQL with admin verification.
   - Requires authenticated user with admin role
   - Checks profiles table for authorization
   - Use this for production migrations
   - Usage: SELECT run_migration_sql(''ALTER TABLE...'');';

-- ==============================================
-- SETUP COMPLETE
-- ==============================================

-- Summary of created functions:
-- 1. run_migration_sql_unsafe(text) - Service role only, no auth check
-- 2. drop_unsafe_migration_function() - Cleanup function
-- 3. run_migration_sql(text) - Admin authenticated version

-- SECURITY NOTES:
-- - run_migration_sql_unsafe MUST be dropped after initial migration
-- - Use drop_unsafe_migration_function() to cleanup
-- - run_migration_sql is safe for ongoing use
