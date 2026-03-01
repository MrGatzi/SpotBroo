# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

SpotBroo is a React Native / Expo mobile app (SDK 52) that displays European electricity spot prices from the ENTSO-E API. It is a single-product repo (not a monorepo).

### Key commands

- **Install deps:** `npm install`
- **Lint:** `npm run lint` (wraps `expo lint` / ESLint)
- **Type check:** `npx tsc --noEmit`
- **Tests:** `npx jest --ci --passWithNoTests` (no test files exist currently; `npm test` uses `--watchAll` which blocks the terminal)
- **Start dev server (web):** `npx expo start --web` (serves on port 8081)
- **Start dev server (mobile):** `npx expo start` (interactive Metro menu)

### Non-obvious caveats

- **Skia on web:** `@shopify/react-native-skia` (used by `victory-native` charts) does not support web. Running `npx expo start --web` will bundle successfully but throw a runtime `SkiaViewApi is not defined` error in the browser. This is a known limitation — the app is designed for Android/iOS.
- **No test files:** The repository has `jest` configured but contains zero test files. Use `--passWithNoTests` or `--ci` to avoid a non-zero exit code.
- **ESLint auto-config:** On first `npm run lint`, Expo auto-installs `eslint` and `eslint-config-expo` if not present. Subsequent runs are fast.
- **Background fetch / alarm permissions:** `AlarmPermissionChecker` and `expo-background-fetch` use native Android APIs. These features do not work in Expo Go or on web.
