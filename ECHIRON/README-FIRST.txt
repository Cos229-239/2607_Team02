ECHIRON — OPEN AND TEST IT

WHAT THIS PACKAGE IS
This folder is the complete application source project. It is not yet a compiled Windows program or Android APK. Opening a .tsx, .json, or README file only shows the project files; it does not launch the app.

FASTEST WAY TO TRY IT ON YOUR WINDOWS COMPUTER
1. Extract the entire ZIP file. Do not run it from inside the ZIP.
2. Install Node.js LTS from https://nodejs.org/ if Node.js is not already installed.
3. Double-click START_ECHIRON_WEB.bat.
4. The first run installs the required packages.
5. Echiron then opens in your default web browser.
6. Keep the command window open while testing. Press Ctrl+C in that window when finished.

TRY IT AS AN ANDROID APP
1. Complete the Windows steps above first.
2. Double-click BUILD_ANDROID_TEST_APK.bat.
3. Sign in to or create an Expo account when prompted.
4. The EAS preview build creates an installable APK.
5. Download the APK from the build link and install it on your Android phone.

GOOGLE PLAY
The production command creates an Android App Bundle (.aab), not an APK:
eas build --platform android --profile production
The .aab is uploaded through your Google Play Console account.

IMPORTANT DISTINCTION
- Source project: what is in this ZIP.
- Browser preview: runs after START_ECHIRON_WEB.bat.
- APK: installs directly on an Android device for testing.
- AAB: uploads to Google Play for distribution.
