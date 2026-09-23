@echo off
chcp 65001 >nul
title Agent Skills Study Hub - Start
cd /d "%~dp0"

echo ============================================
echo   Agent Skills Study Hub - Startup
echo ============================================
echo.

echo [1/2] Checking production build ...
if not exist ".next\BUILD_ID" (
  echo       No build found. Building now, please wait about 1 minute ...
  call npm run build
) else (
  echo       Build found.
)

echo [2/2] Starting web app at http://localhost:3000
echo       Close this window or press Ctrl+C to stop the app.
echo.
start "" http://localhost:3000
call npm start
