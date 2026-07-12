@echo off
setlocal
cd /d "%~dp0"

echo.
echo ==========================================
echo       ECHIRON - Browser Preview
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install the current Node.js LTS release, then run this file again.
  echo Official download: https://nodejs.org/
  echo.
  pause
  exit /b 1
)

where npm >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Reinstall Node.js with npm included.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing ECHIRON dependencies...
  call npm install
  if errorlevel 1 (
    echo.
    echo Dependency installation failed. Check your internet connection and try again.
    pause
    exit /b 1
  )
)

echo.
echo Starting ECHIRON in your web browser...
echo Keep this window open while testing the app.
echo Press Ctrl+C here when you are finished.
echo.
call npm run web

pause
