@echo off
setlocal
cd /d "%~dp0"

echo ============================================================
echo ECHIRON Native Android Validation
echo ============================================================
echo.

call gradlew.bat clean test lint assembleDebug
if errorlevel 1 (
    echo.
    echo BUILD FAILED. Read the Gradle output above.
    exit /b 1
)

echo.
echo BUILD PASSED
echo APK: app\build\outputs\apk\debug\app-debug.apk
pause
