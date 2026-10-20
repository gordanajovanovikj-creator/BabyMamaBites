# Mama & Baby Bites

A calm, one-handed postpartum and baby-feeding companion for iOS, built with Expo, for families in the US.

> **Health-adjacent content.** All recipes and feeding guidance live in `src/content/` as
> data files, summarized from official US sources. The app ships with disclaimers that
> its content is for general information only.

## Stack

| Concern       | Choice                                                               |
| ------------- | -------------------------------------------------------------------- |
| App framework | Expo SDK 57, TypeScript, Expo Router (routes in `src/app/`)          |
| Styling       | NativeWind 5 (RC) + Tailwind CSS 4, color tokens in `src/global.css` |
| Storage       | `expo-sqlite` (user data, on-device only); content is bundled JSON   |
| Reminders     | `expo-notifications` (local only)                                    |
| Tests         | Jest (`jest-expo`)                                                   |
| Builds        | EAS Build (`eas.json`: development, preview, production)             |

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
  app/api/    server routes (the Ask chat), hosted on EAS Hosting
  content/    bundled JSON content + zod schemas
  domain/     pure TypeScript logic (unit-tested)
  data/       SQLite stores, migrations (localStorage in the web preview)
  features/   feature components and hooks (reminders, chat, subscription, shopping…)
  ui/         shared primitives (AppText, Button, Card, IconBadge, BulletList, Screen…)
  theme/      raw color values for native props
  widgets/    the iOS home screen widget
```

## Privacy

v1 stores everything on the device. There are no accounts and no analytics.
App Store privacy label: the only data that leaves the phone is what people type into the Ask chat (plus the baby's age in months), sent to our server and Anthropic to write an answer and not linked to an identity: "User Content – Other", used for App Functionality. See `docs/chat-assistant.md`. Subscriptions go through Apple's StoreKit with no purchase data kept by us (see `docs/subscriptions.md`).
