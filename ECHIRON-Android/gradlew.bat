@rem
@rem ECHIRON Gradle launcher for Windows
@rem
@if "%DEBUG%"=="" @echo off
setlocal
set APP_HOME=%~dp0
set WRAPPER_JAR=%APP_HOME%gradle\wrapper\gradle-wrapper.jar

if not exist "%WRAPPER_JAR%" (
    echo Preparing the official Gradle 9.4.1 wrapper...
    powershell -NoProfile -ExecutionPolicy Bypass -Command ^
      "$ProgressPreference='SilentlyContinue';" ^
      "New-Item -ItemType Directory -Force -Path '%APP_HOME%gradle\wrapper' | Out-Null;" ^
      "Invoke-WebRequest -UseBasicParsing 'https://raw.githubusercontent.com/gradle/gradle/v9.4.1/gradle/wrapper/gradle-wrapper.jar' -OutFile '%WRAPPER_JAR%'"
    if errorlevel 1 (
        echo ERROR: Could not download the official Gradle wrapper.
        exit /b 1
    )
)

if defined JAVA_HOME (
    set JAVA_EXE=%JAVA_HOME%\bin\java.exe
) else (
    set JAVA_EXE=java.exe
)

"%JAVA_EXE%" -version >NUL 2>&1
if errorlevel 1 (
    echo ERROR: Java was not found. Configure Android Studio JDK 17 or set JAVA_HOME.
    exit /b 1
)

"%JAVA_EXE%" -Dfile.encoding=UTF-8 -Xmx64m -Xms64m ^
  "-Dorg.gradle.appname=gradlew" ^
  -jar "%WRAPPER_JAR%" %*

exit /b %ERRORLEVEL%
