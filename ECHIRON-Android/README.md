# ECHIRON — Native Android Edition

This folder contains the native Android implementation of **ECHIRON** for Team **Kindred Spirit**.

## Technology

- Kotlin
- Jetpack Compose
- Material 3
- Android DataStore
- Android Gradle Plugin 9.2.1
- Gradle 9.4.1
- JDK 17
- `compileSdk 37`
- No XML interface layouts

The Android manifest and small resource-value files remain XML because Android requires them. Every application screen and interface component is written in Kotlin with Jetpack Compose.

## Implemented systems

- First-launch onboarding and preferred-name profile
- Local-first task storage
- Four-level priority board
- Quick Capture task creation
- Seven-day weekly planning
- Task completion history
- Twenty-five-minute focus-session logging
- Momentum scoring
- Native encouragement engine
- Progress dashboard
- Light and dark system themes
- Accessibility labels and Material touch targets
- Unit and Compose instrumentation tests

## Open in Android Studio

Open the `ECHIRON-Android` folder directly in Android Studio.

Allow Gradle to sync, then run the `app` configuration on an Android emulator or physical Android device.

On the first command-line build, the launcher retrieves the official Gradle 9.4.1 wrapper JAR from the Gradle project if it is not already present.

## Command-line validation

Windows:

```bat
gradlew.bat clean test lint assembleDebug
```

macOS/Linux:

```bash
./gradlew clean test lint assembleDebug
```

The debug APK is produced under:

```text
app/build/outputs/apk/debug/app-debug.apk
```

## Architecture

- `model/` — immutable application models, priority/day definitions, momentum calculation, and encouragement rules
- `data/` — local DataStore repository and JSON persistence
- `ui/` — application state holder and all Compose screens
- `ui/theme/` — ECHIRON color system and Material 3 theme

The existing Expo/React Native ECHIRON implementation remains preserved in the sibling `ECHIRON` folder. This native edition is a parallel implementation for the Android/Kotlin course requirements.
