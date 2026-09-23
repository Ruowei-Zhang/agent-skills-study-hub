@echo off
chcp 65001 >nul
title Agent Skills Study Hub - Stop

echo Stopping web app (port 3000) ...
for /f "tokens=5" %%p in ('netstat -ano ^| findstr ":3000" ^| findstr "LISTENING"') do (
  taskkill /F /PID %%p >nul 2>&1
)
echo       Web app stopped.
echo.
pause
