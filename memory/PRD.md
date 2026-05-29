# Unit Converter — PRD

## Overview
Colorful, fully offline React Native (Expo) unit converter app with 8 categories, OTA update support, mock AdMob ads, and a mock ₹99 one-time "Remove Ads" IAP.

## Stack
- React Native + Expo SDK 54, expo-router 6
- expo-updates (OTA), expo-haptics, expo-linear-gradient
- @react-native-async-storage/async-storage (via the project's `@/src/utils/storage` wrapper)
- No backend / no Firebase / no API calls

## Screens
1. `/` — Home: 2×4 grid of pastel category cards (neo-brutalist border + shadow in light mode).
2. `/converter?category=<key>` — Two-zone From / To layout, large numeric input, big result, circular swap button between zones, "From" → "To" formula hint.
3. `/settings` — Sunset-gradient "Remove Ads — ₹99" CTA, About card.

## Conversion Categories
| Key | Units |
| --- | ----- |
| length | mm, cm, m, km, inch, foot, yard, mile |
| weight | mg, g, kg, tonne, ounce, pound |
| temperature | C, F, K (formula-based) |
| area | mm², cm², m², km², acre, hectare, sqft, sqin |
| volume | ml, l, m³, tsp, tbsp, cup, pint, gallon (US) |
| speed | m/s, km/h, mph, knot |
| time | s, min, hr, day, week, month, year |
| data | bit, byte, KB, MB, GB, TB (1024-base) |

## Key Files
- `src/constants/units.ts` — category + unit definitions, conversion factors, category colors.
- `src/utils/converter.ts` — `convert()` (base-unit) + `convertTemperature()` (formula) + `formatResult()`.
- `src/hooks/useOTAUpdate.ts` — checks `expo-updates` on mount, prompts Alert ("Restart Now" / "Later"), silent on errors, no-op in `__DEV__`.
- `src/hooks/useAdsRemoved.ts` — AsyncStorage-backed IAP state.
- `src/components/AdBanner.tsx` — 50px placeholder banner.
- `src/components/UnitPicker.tsx` — bottom-sheet unit selector.
- `app/_layout.tsx` — root Stack + SafeAreaProvider + OTA hook.
- `app/index.tsx` — Home grid.
- `app/converter.tsx` — Converter + mock interstitial every 5th conversion.
- `app/settings.tsx` — Remove Ads CTA + About.

## Monetisation
- Banner: mock placeholder at the bottom of Home & Converter.
- Interstitial: mock `Alert` every 5th conversion when ads not removed.
- Remove Ads: mock IAP — taps the gradient CTA, confirms via Alert, sets persistent flag.

## OTA
- `app.json`: `updates.enabled`, `checkAutomatically: ON_LOAD`, `runtimeVersion.policy: appVersion`.
- `useOTAUpdate` runs in root layout, skipped in `__DEV__`.

## Theming
- `userInterfaceStyle: automatic` — `useColorScheme()` drives light/dark surfaces and text.
- Category cards keep their pastel colour in both modes (they are the brand moment); only borders/shadows differ.

## Testing Notes
- No auth — no `test_credentials.md` entries needed.
- All flows are pure client-side.
