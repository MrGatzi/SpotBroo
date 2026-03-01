# AGENTS.md

## Cursor Cloud specific instructions

### Project overview

SpotBroo is a React Native / Expo mobile app (SDK 55) that displays European electricity spot prices from the ENTSO-E API. It is a single-product repo (not a monorepo).

### Key commands

- **Install deps:** `npm install --legacy-peer-deps`
- **Lint:** `npm run lint` (wraps `expo lint` / ESLint)
- **Type check:** `npx tsc --noEmit`
- **Tests:** `npx jest --ci --passWithNoTests` (no test files exist currently; `npm test` uses `--watchAll` which blocks the terminal)
- **Start dev server (web):** `npx expo start --web` (serves on port 8081)
- **Start dev server (mobile):** `npx expo start` (interactive Metro menu)

### Non-obvious caveats

- **CORS on web:** The ENTSO-E API does not support CORS. Running the app on web (`npx expo start --web`) will render the UI correctly but price data will fail to load due to browser CORS restrictions. On mobile (Android/iOS) this works fine.
- **Chart library:** Charts use `react-native-svg` directly (replaced the previous `victory-native` / `@shopify/react-native-skia` which did not support web). The chart component is at `components/chart/ChartComponent.tsx`.
- **Android Widget:** Uses `react-native-android-widget` with a config plugin (defined in `app.json`). Widget component is in `widgets/SpotBrooWidget.tsx`, task handler is in `widget-task-handler.tsx`, and entry point is `index.ts`. After changing widget config, run `npx expo prebuild --clean` to regenerate native code.
- **iOS Widget:** Uses `expo-widgets` (alpha) with `@expo/ui` SwiftUI components. Widget defined in `widgets/SpotBrooWidgetIOS.tsx`. Requires development build (not Expo Go). Uses native Swift Charts for bar chart in the widget.
- **Entry point:** The app entry is `index.ts` (not `expo-router/entry`) to register the Android widget task handler alongside expo-router. See `package.json` `"main"` field.
- **No test files:** The repository has `jest` configured but contains zero test files. Use `--passWithNoTests` or `--ci` to avoid a non-zero exit code.
- **Legacy peer deps:** Some packages require `--legacy-peer-deps` flag during `npm install`.
- **Background fetch / alarm permissions:** `AlarmPermissionChecker` and `expo-background-fetch` use native Android APIs. These features do not work in Expo Go or on web.
