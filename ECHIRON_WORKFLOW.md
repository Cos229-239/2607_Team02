# Echiron Paired-Version Workflow

Maintainer: David Eugene Fulmer Jr.

Echiron is maintained as two implementations of the same product:

- `ECHIRON-Expo/` — Expo and React Native application
- `ECHIRON-Android/` — native Kotlin and Jetpack Compose application

## Release rule

A feature is not considered complete until its behavior, data model, user-facing controls, documentation, and relevant tests have been reviewed in both implementations. Platform-specific code may differ, but the product capability and compassionate design principles must remain aligned.

## Personal branch workflow

1. Switch to `dev`, fetch the remote, and pull the latest `dev`.
2. Switch to `DavidPersonal`.
3. Merge `dev` down into `DavidPersonal`.
4. Make and verify changes on `DavidPersonal`.
5. Commit with a message that describes the completed work.
6. Push `DavidPersonal` to the shared repository.
7. Before a future merge into `dev`, pull `dev` again, merge it down, resolve conflicts, and verify both applications.

## Verification

Expo:

```bash
cd ECHIRON-Expo
npm install
npm run typecheck
npm run lint
npm run test:encouragement
```

Android:

```bash
cd ECHIRON-Android
./gradlew test
```

Generated dependencies, caches, IDE metadata, and build outputs should not be committed. The source projects and their meaningful configuration, tests, and documentation should remain visible to the team.
