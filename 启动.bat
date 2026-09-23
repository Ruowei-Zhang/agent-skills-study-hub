@echo off
chcp 65001 >nul
title Agent Skills Study Hub - Start
cd /d "%~dp0"

echo ============================================
echo   Agent Skills Study Hub - Startup
echo ============================================
echo.

where node >nul 2>&1
if errorlevel 1 (
  echo [ERROR] Node.js not found.
  echo         Please install Node.js 20+ from https://nodejs.org and run this script again.
  echo.
  pause
  exit /b 1
)

echo [1/3] Checking dependencies ...
if not exist "node_modules" (
  echo       First run detected. Installing dependencies, please wait ...
  call npm install
  if errorlevel 1 (
    echo [ERROR] npm install failed. Check your network and retry.
    pause
    exit /b 1
  )
) else (
  echo       Dependencies ready.
)

echo [2/3] Checking production build ...
if not exist "out\index.html" (
  echo       No build found. Building now, please wait about 1 minute ...
  call npm run build
  if errorlevel 1 (
    echo [ERROR] Build failed. See messages above.
    pause
    exit /b 1
  )
) else (
  echo       Build found.
)

echo [3/3] Starting web app at http://localhost:3000
echo       Close this window or press Ctrl+C to stop the app.
echo.
start "" http://localhost:3000
call npm start
