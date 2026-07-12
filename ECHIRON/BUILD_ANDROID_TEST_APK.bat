@echo off
setlocal
cd /d "%~dp0"

echo.
echo ==========================================
echo       ECHIRON - Android Test APK
echo ==========================================
echo.

where node >nul 2>nul
if errorlevel 1 (
  echo Node.js is not installed.
  echo Install the current Node.js LTS release, then run this file again.
  echo Official download: https://nodejs.org/
  pause
  exit /b 1
)

if not exist node_modules (
  echo Installing project dependencies...
  call npm install
  if errorlevel 1 goto :failed
)

where eas >nul 2>nul
if errorlevel 1 (
  echo Installing the Expo EAS command-line tool...
  call npm install -g eas-cli
  if errorlevel 1 goto :failed
)

echo.
echo You will be asked to sign in to an Expo account.
echo The preview build produces an installable Android APK.
echo.
call eas login
if errorlevel 1 goto :failed
call eas build --platform android --profile preview
if errorlevel 1 goto :failed

echo.
echo Build request completed. Use the download link shown above to get the APK.
pause
exit /b 0

:failed
echo.
echo The build did not complete. Review the message above, correct the issue, and run this file again.
pause
exit /b 1
