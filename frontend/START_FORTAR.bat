@echo off
echo ====================================
echo    FORTAR - Fresh Start
echo ====================================
echo.

echo [1/5] Stopping old processes...
taskkill /F /IM node.exe 2>nul >nul
timeout /t 2 /nobreak >nul

echo [2/5] Removing cache...
if exist .next rmdir /s /q .next
if exist node_modules\.cache rmdir /s /q node_modules\.cache

echo [3/5] Cleaning npm cache...
call npm cache clean --force >nul 2>&1

echo [4/5] Starting dev server...
echo.
echo ====================================
echo   Opening http://localhost:3002
echo   Press Ctrl+C to stop
echo ====================================
echo.

call npm run dev

pause

