@echo off
echo.
echo ============================================
echo  RESTARTING DEVELOPMENT SERVER
echo ============================================
echo.
echo Stopping any running Node.js processes...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting development server...
echo.
start cmd /k "npm run dev"

echo.
echo ============================================
echo  Server is restarting in a new window
echo ============================================
echo.
echo The new admin email is now active:
echo   - automation@jkkn.ac.in
echo.
echo Test it by:
echo   1. Going to /admin-panel
echo   2. Logging in with automation@jkkn.ac.in
echo   3. Verifying admin access works
echo.
pause
