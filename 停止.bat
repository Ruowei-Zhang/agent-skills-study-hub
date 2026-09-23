@echo off
chcp 65001 >nul
title Agent Skills Study Hub - Stop

echo Stopping web app (port 3000) ...
rem ":3000 " with trailing space avoids matching ports like 30000.
set "KILLED="
for /f "tokens=5" %%p in ('netstat -ano ^| findstr /C:":3000 " ^| findstr "LISTENING"') do (
  taskkill /F /PID %%p >nul 2>&1 && set "KILLED=1"
)
if defined KILLED (
  echo       Web app stopped.
) else (
  echo       No app is listening on port 3000.
)
echo.
pause
