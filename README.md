# ECHIRON

## Team

**Kindred Spirit**

## Team Members

- David Fulmer — GitHub: `FlameBorneWhiteHat-FB-91156`
- Jeannie Reyes — GitHub: `Jeannieee17`

## Project Overview

ECHIRON is a human-first personal progress and encouragement application designed to help users organize priorities, recognize completed effort, protect focused time, and continue moving forward without replacing human agency.

ECHIRON is intended to support productivity by helping users organize tasks, maintain focus, and build positive momentum through encouragement and progress tracking while keeping the user in control of their decisions.

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
- Current team integration branch for active work: `DavidPersonal`
- Prior native milestone work: merged into `dev`
- Full Android Studio Gradle sync, emulator launch, tests, lint, and debug APK build: required local-machine validation step for the current Calendar integration

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

1. Develop and commit work on your assigned personal branch.
2. Keep your personal branch synchronized with `dev`.
3. Integrate teammate work into the active team integration branch and resolve conflicts without overwriting either teammate's valid work.
4. Test combined work before moving cards to Waiting for review.
5. Merge completed and reviewed work into `dev` for shared integration.
6. Leave `main` to the designated Build Master.

## Google Calendar Integration — Active Implementation

Google Calendar integration development is underway for the native ECHIRON Android application. The project includes the Google Play Services authentication dependency required for Google authorization.

A dedicated `GoogleCalendarAuthorization.kt` integration layer handles Google Calendar authorization separately from the UI. `GoogleCalendarIntegrationScreen.kt` provides the user-facing Connect Google Calendar interface and is connected to ECHIRON's main application/navigation structure through `EchironApp.kt`.

The implementation requests read-only Google Calendar access, following least-privilege principles. ECHIRON does not request permission to create, edit, or delete Google Calendar events in this first version.

The current implementation now goes beyond the authorization foundation. `GoogleCalendarApi.kt` uses the granted OAuth access token to retrieve the user's visible calendar list and load upcoming events from the primary or selected calendar. Returned Calendar event data is mapped into ECHIRON-facing models with stable Google event IDs, title, description, start/end values, all-day state, location, status, recurrence information, and update timestamps. The integration screen now displays a preview of returned calendars and upcoming events after successful authorization.

The next validation stage is to pull the combined branch locally, run the Android build/tests, complete a real Google consent flow on an emulator or Android device, and verify returned Calendar data before moving the implementation cards to Waiting for review.

No Google passwords, OAuth secrets, access tokens, or other private credentials should ever be committed to the repository or documented in the README.

### Calendar Integration Files

- `ECHIRON-Android/app/build.gradle.kts`
- `ECHIRON-Android/app/src/main/AndroidManifest.xml`
- `ECHIRON-Android/app/src/main/java/com/flameborne/echiron/integration/google/GoogleCalendarAuthorization.kt`
- `ECHIRON-Android/app/src/main/java/com/flameborne/echiron/integration/google/GoogleCalendarApi.kt`
- `ECHIRON-Android/app/src/main/java/com/flameborne/echiron/ui/GoogleCalendarIntegrationScreen.kt`
- `ECHIRON-Android/app/src/main/java/com/flameborne/echiron/ui/EchironApp.kt`
