-- Check current database state
-- Run this first to see what already exists

-- Check if tables exist
SELECT
    tablename,
    schemaname
FROM pg_tables
WHERE tablename IN ('gallery_albums', 'gallery_images')
ORDER BY tablename;

-- Check if policies exist
SELECT
    schemaname,
    tablename,
    policyname
FROM pg_policies
WHERE tablename IN ('gallery_albums', 'gallery_images')
ORDER BY tablename, policyname;

-- Check if triggers exist
SELECT
    trigger_name,
    event_object_table,
    action_statement
FROM information_schema.triggers
WHERE event_object_table IN ('gallery_albums', 'gallery_images')
ORDER BY event_object_table, trigger_name;

-- Check if functions exist
SELECT
    proname as function_name,
    pg_get_functiondef(oid) as definition
FROM pg_proc
WHERE proname LIKE '%gallery%'
ORDER BY proname;

-- If tables exist, check their structure
SELECT
    table_name,
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns
WHERE table_name IN ('gallery_albums', 'gallery_images')
ORDER BY table_name, ordinal_position;
