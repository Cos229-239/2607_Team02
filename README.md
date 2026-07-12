# ECHIRON

## Team

**Kindred Spirit**

## Team Members

- David Fulmer — GitHub: `FlameBorneWhiteHat-FB-91156`
- Jeannie Reyes — GitHub:

## Project Overview

ECHIRON is a human-first personal progress and encouragement application designed to help users organize priorities, recognize completed effort, protect focused time, and continue moving forward without replacing human agency.

The repository preserves two working implementations of the same product:

- `ECHIRON/` — the established Expo and React Native implementation written in TypeScript.
- `ECHIRON-Android/` — the native Android implementation written in Kotlin with Jetpack Compose for the course requirement.

## Native Kotlin Milestone — Completed and Submitted

On July 11, 2026, the existing ECHIRON product architecture was translated into a native Android project and submitted through the required Git workflow.

The Kotlin edition includes:

- First-launch onboarding and preferred-name profile
- Local-first task persistence with Android DataStore
- Quick Capture task creation
- Four-level priority management
- Seven-day weekly planning
- Task completion history
- Twenty-five-minute focus-session logging
- Momentum scoring
- Native encouragement generation
- Progress and encouragement screens
- Material 3 light and dark themes
- Accessibility labels and standard Android touch targets
- Unit tests and Jetpack Compose instrumentation tests

The native project uses Kotlin, Jetpack Compose, Material 3, Android DataStore, JDK 17, Android Gradle Plugin 9.2.1, and Gradle 9.4.1. Application interfaces are written in Kotlin and Compose rather than XML layouts.

## Current Development Status

- Native Kotlin/Compose source: completed
- Pure Kotlin domain compilation: passed
- Android manifest and resource parsing: passed
- Personal branch submission: completed on `david-fulmer-personal`
- Shared integration: merged into `dev`
- Full Android Studio Gradle sync, emulator launch, tests, lint, and debug APK build: final local-machine verification step

## Build the Native Android Edition

Open `ECHIRON-Android/` directly in Android Studio, allow Gradle to sync, and run the `app` configuration on an emulator or Android device.

Windows command-line validation:

```bat
cd ECHIRON-Android
gradlew.bat clean test lint assembleDebug
```

The resulting debug APK is generated at:

```text
ECHIRON-Android/app/build/outputs/apk/debug/app-debug.apk
```

## Repository Structure

- `ECHIRON/` — Expo/React Native ECHIRON implementation
- `ECHIRON-Android/` — native Kotlin/Jetpack Compose implementation
- `Documents/` — course Git workflow instructions, supplied links, Git reference sheets, and Kotlin reference material
- `index.html` — roster editor prototype landing page
- `roster-v2-sample.json` — sample editable roster structure

## Branch Workflow

1. Develop and commit work on `david-fulmer-personal`.
2. Keep the personal branch synchronized with `dev`.
3. Merge completed and reviewed work into `dev` for shared integration.
4. Leave `main` to the designated Build Master.
