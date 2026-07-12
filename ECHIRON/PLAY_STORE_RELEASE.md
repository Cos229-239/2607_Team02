# Echiron — Google Play Release Package

## Release status

The source project is configured to build an Android App Bundle for Google Play. Publishing requires the owner's Google Play Console and Expo accounts; those private identity and signing steps cannot be embedded in source code.

## Build commands

```bash
npm install
npm install -g eas-cli
eas login
eas build:configure
eas build --platform android --profile production
```

After the build completes, download the `.aab` from the Expo dashboard.

## Play Console sequence

1. Create or verify the Google Play developer account.
2. Create an app named **Echiron** with default language English (United States).
3. Accept Play App Signing.
4. Upload the production `.aab` to the Internal testing track first.
5. Complete App content, Data safety, Content rating, Target audience, Ads, and privacy-policy declarations.
6. Test on physical Android phones and resolve every crash, ANR, and pre-launch warning.
7. Move to Closed testing when ready.
8. For a newly created personal developer account, maintain at least 12 opted-in testers for 14 consecutive days before applying for production access.
9. Submit production access and then promote the approved release to Production.

## Current technical baseline

- Expo SDK 56
- React Native 0.85
- Android App Bundle output
- Android package: `com.flameborne.echiron`
- Target API: supplied by the current Expo SDK/EAS Android build image; verify the generated bundle reports API 35 or later before uploading
- No sensitive Android permissions requested by application code

## Store listing copy

### App name

Echiron

### Short description

Turn overload into clear priorities, a realistic week, and visible progress.

### Full description

Echiron is a calm, local-first planning app for students, professionals, parents, and anyone carrying too many open loops.

Capture a task the moment it appears. Sort it by real priority. Give it a place in the week. Complete one focused work block. Then see evidence of movement without turning productivity into punishment.

Echiron includes:

- Quick Capture for tasks and details
- Four-level priority sorting
- Seven-day weekly planning
- Accessible light and dark modes
- Clear written labels that do not rely on color alone
- Progress by completion, focus time, and category
- Local profile and preference storage
- No ads
- No analytics
- No account required
- No sale of personal information

Your profile, tasks, schedule, and focus history remain on your device in Echiron 1.0.

### Release notes — 1.0.0

Echiron 1.0 establishes the complete local-first foundation: profile setup, guest access, dashboard, Quick Capture, priority sorting, weekly planning, focus-session logging, progress tracking, accessibility support, and persistent device storage.

## Suggested category

Productivity

## Ads declaration

No. Echiron 1.0 contains no advertising SDK or ad placement.

## Data Safety answers for 1.0

- Does the app collect or share required user data with the developer or third parties? **No**
- Is all user data encrypted in transit? **Not applicable; the app does not transmit user data**
- Can users request deletion? **Yes; users can select “Reset all local data” inside the Progress screen, or uninstall the app**
- Does the app contain an account-creation system? **No; the profile is local and is not a network account**
- Does the app use analytics? **No**
- Does the app use advertising identifiers? **No**
- Does the app access precise location, contacts, photos, microphone, camera, health, financial, or calendar data? **No**

These declarations must be revised before adding cloud sync, Google Calendar, notifications, crash analytics, AI integrations, authentication, or any third-party SDK that transmits data.

## Required visual assets

- App icon: included at `assets/images/icon.png`
- Adaptive Android icon: included
- Monochrome Android icon: included
- Feature graphic: included at `store-assets/feature-graphic-1024x500.png`
- Phone screenshots: included in `store-assets/`
- Privacy policy: included as `privacy-policy.html`; publish it at a stable public HTTPS address before production submission

## Final release gate

Do not submit Production until:

- The package name is confirmed as permanent
- The publisher name and support contact are final
- The privacy policy is publicly hosted
- Every screen has been tested on a physical Android device
- TalkBack navigation has been tested
- Text scaling at 200% has been tested
- The generated `.aab` meets the current target API requirement
- Internal/closed test feedback is resolved
- Play Console declarations exactly match the installed build
