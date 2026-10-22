# Subscriptions (in-app purchases)

Mama & Baby Bites sells one Premium subscription in two plans, with a 7-day free trial.
Purchases go straight through Apple's StoreKit on iPhone and Google Play Billing on Android,
using [expo-iap](https://github.com/hyodotdev/openiap/tree/main/libraries/expo-iap). There is
no purchase server and no third-party service: the store checks the subscription on the
phone.

## What's free and what's Premium

- **Free:** Today, the monthly guides, the food guide, starting-solids readiness, the
  choking page, emergency resources, legal pages and Settings, plus every safety and
  mom-wellbeing article (choking, foods to avoid, allergic reaction signs, high chair,
  postpartum recovery). Help for a red flag is never behind the paywall.
- **Premium:** recipes (Mom and Baby tabs, categories), the week-by-week solids plan, the
  meal planner and freezer, the food log and allergen tracker, the rest of the Insights
  library, Ask, the shopping list and the calendar.

The list lives in `src/domain/subscription.ts` (`premiumFeatures`,
`freeLibraryCategories`). Screens opt in with `withPremium('<feature>', Screen)` or
`<PremiumGate>` (`src/features/subscription/premium-gate.tsx`).

## Plans

| Plan    | Product ID                      | Price  | Free trial |
| ------- | ------------------------------- | ------ | ---------- |
| Monthly | `mamababybites.premium.monthly` | $12.99 | 1 week     |
| Yearly  | `mamababybites.premium.yearly`  | $79.99 | 1 week     |

The paywall shows the App Store's localized price. The fallback prices and the "Save 48%"
and "$6.66/month" lines come from `plans` in `src/domain/subscription.ts`, so keep those in
sync with App Store Connect.

## Set up App Store Connect (once)

1. **Agreements:** in App Store Connect → Business, accept the **Paid Apps** agreement and
   fill in tax and banking. Subscriptions can't be sold or tested in TestFlight until this
   is done.
2. **App record:** create the app with bundle ID `com.mamababybites.app`.
3. **Subscription group:** your app → Monetization → Subscriptions → create a group, for
   example "Premium".
4. **Two subscriptions** in that group, with the product IDs above:
   - Duration 1 month and 1 year; prices $12.99 and $79.99 (United States base price).
   - A display name and description (for example "Premium Monthly", "All recipes, the
     solids plan, planner, food log and Ask").
   - A review screenshot of the paywall.
5. **Free trial:** on each subscription, add an **Introductory Offer** → **Free** → **1
   week**, for all territories. The app reads the trial length from the App Store and only
   offers it to Apple IDs that haven't used it.
6. **Sandbox tester:** Users and Access → Sandbox → add a test Apple ID.

## Set up Google Play (once, for Android)

1. **Payments profile:** in the Play Console → Settings → Payments profile, add the company,
   tax and bank details. Subscriptions can't be sold until this is done.
2. **App:** create the app with package name `com.mamababybites.app`, and upload one build
   (internal testing is enough) so Play knows the app uses billing.
3. **Two subscriptions:** Monetize → Products → Subscriptions → Create subscription, with the
   **same product IDs** as the App Store: `mamababybites.premium.monthly` and
   `mamababybites.premium.yearly`.
4. **Base plan** on each: auto-renewing, billing period 1 month or 1 year, priced $12.99 and
   $79.99 for the United States (Play converts other countries). Activate it.
5. **Free trial:** add an **offer** to each base plan → eligibility **New customer
   acquisition** → phase **Free trial, 7 days**. Activate it. Play only shows the trial offer
   to Google accounts that can still use it, and the app buys it automatically when it's
   there.
6. **License testers:** Settings → License testing → add the Google accounts that test
   purchases. Their purchases aren't charged, and renewals run fast.


Purchases don't work in Expo Go or the web preview. There, Premium is unlocked so the whole
app can be tested, and Settings → Subscription has **Preview the free version** to see the
locked screens.

To test real purchases, make a build that includes the App Store module:

- `npx eas-cli@latest build --profile development --platform ios` (installs on your phone
  as a development build), or
- a TestFlight build: `npx eas-cli@latest build --profile production --platform ios`, then
  `npx eas-cli@latest submit --platform ios`.

On the phone, sign in with the sandbox tester when the purchase sheet asks. Sandbox trials
and renewals run fast (a week passes in minutes).

On Android, build with `--platform android` instead. Purchases only work in a build that
Google Play delivered (internal testing track), on a phone or emulator signed in to a
license tester's Google account.

## App Store review notes

- The paywall shows the price, the billing period, the trial length, the auto-renewal
  wording, **Restore purchases**, and links to the Terms of Use and Privacy Policy.
- Settings → Subscription opens Apple's **Manage subscription** screen for subscribers.
- Submit both subscriptions together with the first app version.
- **Privacy:** purchases are handled by Apple and we keep no purchase data, so the App Store
  privacy label doesn't change.

## Google Play review notes

- Same paywall and wording; on Android, Settings → Subscription opens Google Play's
  subscriptions page.
- **Data safety form:** the app collects no purchase or payment data (Google handles it).
  Declare what the Privacy Policy describes: the Ask chat sends the question and the baby's
  age in months to our server (not stored), and nothing else leaves the phone.
