# Echiron 1.0

Echiron is a local-first personal progress and habit-support application built with React Native and Expo SDK 56. Its first purpose is to recognize human effort, make small progress visible, and encourage the next positive action.

Echiron is also the starting foundation for a larger human-supportive AI vision: an intelligence designed to stand beside a person, strengthen agency, and learn how to support human progress before expanding into broader language-model capabilities.

## Included in this release

- First-launch profile creation or guest access
- Personal progress dashboard and top priorities
- Quick Capture task creation
- Four-level priority sorting
- Seven-day weekly planning
- Task completion and local progress analytics
- Twenty-five-minute focus-session logging
- Human-first encouragement engine
- Recent wins, saved encouragements, principles, and weekly reflection
- Persistent on-device storage
- System, light, and dark appearance modes
- Explicit labels, visible focus states, 44–48 px touch targets, and color-independent status text
- Android App Bundle production configuration for Google Play

## Core principle

**Echiron is the beginning of an AI whose first lesson is how to encourage a human being forward.**

The goal is not to replace human agency. The goal is support without controlling, guidance without taking over, and intelligence that becomes more useful as a teammate without making the human less necessary.

## Local development

Install Node.js 20 or newer, then run:

```bash
npm install
npx expo start
```

Open the QR code with Expo Go or press `a` to launch an Android emulator.

## Android test build

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile preview
```

The preview profile produces an APK for direct device testing.

## Google Play bundle

```bash
eas build --platform android --profile production
```

The production profile produces an Android App Bundle (`.aab`) for Google Play. The final Play Console submission remains under the publisher's own verified developer account because signing credentials, identity verification, store declarations, and release approval belong to the account owner.

## Application identity

- App name: Echiron
- Android package: `com.flameborne.echiron`
- iOS bundle identifier: `com.flameborne.echiron`
- Expo slug: `echiron`
- URL scheme: `echiron`
- Version: `1.0.0`
- Initial Android version code: `1`

An Android package name becomes permanent after the first Google Play release. Confirm ownership and naming before the first production upload.

## Privacy model

Echiron 1.0 stores profile data, tasks, schedules, focus history, encouragement preferences, saved messages, and locally generated reflections on the device. It includes no ads, analytics, cloud account, external AI connection, or calendar integration in this release.

Existing local Echiron data is migrated to the Echiron storage identity on first load so rebranding does not silently discard a user's progress.

## Development direction

- 1.0: local profiles, task capture, priority sorting, weekly planning, progress, focus sessions, and encouragement engine
- 1.1: optional local notifications and deeper habit/progress modeling
- 1.2: encrypted account sync
- 1.3: user-authorized calendar integration
- Future: expand Echiron's human-supportive context, memory, pattern recognition, and language capabilities while preserving human agency as a foundational design constraint

## License

MIT License. See `LICENSE`.
