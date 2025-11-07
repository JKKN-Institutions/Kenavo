@echo off
REM Gallery System Setup Script
REM Automates the entire gallery setup process

echo ===============================================
echo    GALLERY SYSTEM SETUP
echo ===============================================
echo.

REM Check if Node.js is available
where node >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Node.js not found. Please install Node.js first.
    pause
    exit /b 1
)

echo Step 1: Creating migration function...
echo.
echo MANUAL ACTION REQUIRED:
echo 1. Open: https://supabase.com/dashboard/project/rihoufidmnqtffzqhplc/sql/new
echo 2. Copy contents of: supabase/migrations/009_create_migration_function.sql
echo 3. Paste and click RUN in SQL Editor
echo 4. Press any key here to continue...
pause >nul

echo.
echo Step 2: Running gallery migrations...
echo.
node scripts/run-gallery-migration-via-function.js

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Migration failed! See error above.
    echo Try manual migration - see MIGRATION_GUIDE.md
    pause
    exit /b 1
)

echo.
echo Step 3: Installing dependencies...
echo.
call npm install jszip @types/jszip

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Warning: Failed to install JSZip. Run manually:
    echo npm install jszip @types/jszip
)

echo.
echo ===============================================
echo    SETUP COMPLETE!
echo ===============================================
echo.
echo Gallery system is ready to use!
echo.
echo Next steps:
echo 1. Start dev server: npm run dev
echo 2. Open: http://localhost:3000/admin-panel
echo 3. Navigate to Gallery tab
echo 4. Start uploading images!
echo.
pause
