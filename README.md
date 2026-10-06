# MamaBabyBites

A calm, one-handed postpartum and baby-feeding companion for iOS, built with Expo.

> **Health-adjacent content.** All recipes and feeding guidance live in `src/content/` as
> data files. Anything not yet signed off by a credentialed expert is marked
> `reviewStatus: "placeholder"` and contains `[PLACEHOLDER - needs expert review]`.

## Stack

| Concern       | Choice                                                                |
| ------------- | --------------------------------------------------------------------- |
| App framework | Expo SDK 57, TypeScript, Expo Router (routes in `src/app/`)           |
| Styling       | NativeWind 5 (RC) + Tailwind CSS 4, colour tokens in `src/global.css` |
| Storage       | `expo-sqlite` (user data, on-device only); content is bundled JSON    |
| Reminders     | `expo-notifications` (local only)                                     |
| Tests         | Jest (`jest-expo`)                                                    |
| Builds        | EAS Build (`eas.json`: development, preview, production)              |

## Getting started

Requirements: Node 20+ and the **Expo Go** app on your iPhone (App Store).

```sh
npm install
npx expo start          # scan the QR code with the iPhone Camera app
```

Useful scripts:

```sh
npm run check           # typecheck + lint + tests (run before every commit)
npm test                # unit tests only
npm run web             # quick browser preview (not a target platform)
```

## Project layout

```
src/
  app/        Expo Router screens only (thin)
  content/    bundled, expert-editable JSON + zod schemas
  domain/     pure TypeScript logic (unit-tested)
  data/       SQLite client, migrations, repositories
  services/   notifications, AI, entitlements (paywall seam)
  features/   feature components and hooks
  ui/         shared primitives (AppText, Button, Card, Chip, Notice, Screen)
  theme/      raw colour values for native props
```

## Privacy

v1 stores everything on the device. There are no accounts and no analytics.
See `docs/privacy-notes.md` (added in a later slice) for App Store privacy disclosures.
