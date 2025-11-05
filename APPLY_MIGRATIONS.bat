@echo off
echo.
echo ============================================
echo  SUPABASE MIGRATIONS - AUTO SETUP
echo ============================================
echo.
echo This will:
echo  1. Open ALL_MIGRATIONS.sql in Notepad
echo  2. Open Supabase Dashboard in your browser
echo.
echo Then you just need to:
echo  - Copy the SQL from Notepad (Ctrl+A, Ctrl+C)
echo  - Paste into Supabase SQL Editor
echo  - Click RUN
echo.
pause

echo.
echo Opening files...
echo.

REM Open the SQL file in Notepad
start notepad "ALL_MIGRATIONS.sql"

timeout /t 2 /nobreak >nul

REM Open Supabase Dashboard
start https://supabase.com/dashboard

echo.
echo ============================================
echo  NEXT STEPS:
echo ============================================
echo.
echo 1. In Supabase Dashboard:
echo    - Select your project
echo    - Click SQL Editor (left sidebar)
echo    - Click + New Query
echo.
echo 2. Copy from Notepad (Ctrl+A, Ctrl+C)
echo.
echo 3. Paste into Supabase SQL Editor (Ctrl+V)
echo.
echo 4. Click RUN button
echo.
echo 5. Wait for "Success" message
echo.
echo ============================================
echo.
pause
