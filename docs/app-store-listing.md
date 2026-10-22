# App Store listing (draft)

Text to paste into App Store Connect for version 1.0. Character limits are Apple's; the
counts were checked when this was written. Keep the wording in line with the app: no claim
that a food boosts milk supply, no "approved by doctors", and the "not medical advice" line.

## App information

| Field              | Value                                                                                             |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| Name (30)          | Mama & Baby Bites                                                                                 |
| Subtitle (30)      | Baby food, recipes & meal plan                                                                    |
| Primary category   | Food & Drink                                                                                      |
| Secondary category | Health & Fitness                                                                                  |
| Bundle ID          | com.mamababybites.app                                                                             |
| SKU                | mamababybites-ios                                                                                 |
| Content rights     | No third-party content that needs rights. Food photos are licensed; see Settings → Photo credits. |
| Copyright          | 2026 Culman Brothers LLC                                                                          |

## URLs

| Field              | Value                                  |
| ------------------ | -------------------------------------- |
| Support URL        | https://mamababybites.com/support.html |
| Marketing URL      | https://mamababybites.com              |
| Privacy Policy URL | https://mamababybites.com/privacy.html |

## Promotional text (170)

Can be changed any time without a new app version.

> Start solids with a calm, week-by-week plan, track the top 9 allergens, and cook real food
> for the whole family. Your family's details stay on your phone.

## Keywords (100)

Comma-separated, no spaces. Words already in the name and subtitle (mama, baby, bites, food,
recipes, meal, plan) count anyway, so they're left out.

```
solids,weaning,blw,puree,allergen,tracker,first foods,toddler,mom,postpartum,grocery,shopping list
```

## Description (4,000)

```
Healthy food for mama and baby, made simple.

Mama & Baby Bites brings everything you need to feed your family into one calm app: a week-by-week plan for starting solids, an allergen tracker, recipes for your baby and for you, and a shopping list that fills itself.

START SOLIDS WITH CONFIDENCE
• A 26-week starting-solids plan that moves at your baby's own pace, from first tastes to chopped family foods
• Signs of readiness, textures by age, and how to serve 44 first foods safely
• Choking and gagging basics, always one tap away

TRACK FIRST FOODS AND ALLERGENS
• Log each new food in seconds and note any reaction
• Follow the 9 most common allergens step by step
• Share a tidy PDF food log with your pediatrician before checkups

REAL FOOD YOUR WHOLE FAMILY WILL EAT
• 180+ recipes for baby and for you, from smooth purees to quick, nourishing meals
• Filter by time, diet and allergies, and save your favorites
• Family meals that share ingredients with your baby's food, so you cook once

PLAN THE WEEK IN MINUTES
• Plan your baby's meals next to family dinners
• Add a recipe's ingredients, or your whole week, to the shopping list in one tap
• The list sorts itself by store section
• See today's meals at a glance with the home screen widget

MEAL IDEAS WHEN YOU'RE OUT OF IDEAS
• Ask about meal ideas, textures, freezing and picky eating, and get suggestions tailored to your baby's age
• Send a suggested dish's ingredients straight to your shopping list

GUIDES FOR YOU AND YOUR BABY
• Monthly guides from newborn to age 3
• Short articles and tips, chosen for your baby's age
• Support for your own recovery and wellbeing, with US helplines when you need them

PRIVATE BY DESIGN
No account needed. Your baby's name, birth date, food log and plans stay on your phone. Only questions you type in Ask (with your baby's age in months) are sent to write an answer, and the chat isn't saved.

Content reviewed by a nutritionist and based on official US guidance from sources like the CDC, the American Academy of Pediatrics, the FDA and the USDA Dietary Guidelines.

FREE AND PREMIUM
Mama & Baby Bites is free to download, with the monthly guides, the first foods guide, safety information and emergency resources always free. Premium unlocks the recipes, the solids plan, the meal planner, the food log and allergen tracker, Ask, the shopping list and more, with a 7-day free trial for new subscribers.

Premium is $12.99 a month or $79.99 a year (US prices). Payment is charged to your Apple Account when you confirm the purchase, after any free trial. Subscriptions renew automatically unless canceled at least 24 hours before the end of the current period. You can manage or cancel anytime in your App Store account settings.

Terms of Use: https://mamababybites.com/terms.html
Privacy Policy: https://mamababybites.com/privacy.html

Mama & Baby Bites shares general information, not medical advice. Always talk to your pediatrician or healthcare provider about your baby's health, and call 911 in an emergency.
```

## What's New (version 1.0)

```
Welcome to Mama & Baby Bites! A week-by-week solids plan, an allergen tracker, recipes for baby and you, and a shopping list that fills itself.
```

## Screenshots

iPhone 6.9" display (1320 × 2868), in `store/screenshots/ios-6.9/`, in this order:

1. `01-today.png`: Healthy food for mama and baby
2. `02-solids-plan.png`: Start solids one week at a time
3. `03-allergen-tracker.png`: Track first foods and allergens
4. `04-meal-planner.png`: Baby's meals and family dinners
5. `05-shopping-list.png`: A shopping list that fills itself
6. `06-ask.png`: Meal ideas when you're out of ideas
7. `07-recipes.png`: Real food for baby and you

They were made from the app's web preview with sample data (Mila, 6 months). The chat
answer in `06-ask.png` is a real answer from the live server, showing its first two dish
suggestions. Before submitting, compare them with the app on an iPhone or the iOS
simulator; if a screen looks different there, take that one again from the simulator.

Apple scales 6.9" screenshots down for smaller iPhones, so one set is enough. The app is
iPhone-only (`supportsTablet: false`), so no iPad screenshots are needed.

## Age rating

Answer the questionnaire in App Store Connect honestly; it works out the rating. For this app:

- Violence, sexual content, profanity, horror, drugs, alcohol, tobacco, gambling, contests:
  **None**
- Medical or treatment information: **Infrequent**. The app shares general feeding and
  wellbeing information and points to a pediatrician or doctor; it doesn't diagnose or treat.
- Unrestricted web access: **No** (links open specific pages only)
- User-generated content shared with other people, or messaging between people: **No**
- If asked about an AI assistant or chatbot: **Yes** (Ask). It's for meal and feeding
  questions, has a one-time consent screen, always shows the "not medical advice" notice
  with 911, and shows 988 and 1-833-TLC-MAMA when a question is about low mood or a crisis.
- Made for Kids: **No**. The app is for parents.

## App Privacy (privacy label)

Data collection: **Yes, we collect data**, one type only:

| Data type                         | Used for          | Linked to the person? | Used for tracking? |
| --------------------------------- | ----------------- | --------------------- | ------------------ |
| User Content → Other User Content | App Functionality | No                    | No                 |

That's the question typed into Ask and the baby's age in months, sent to our server and to
Anthropic to write the answer. Anthropic keeps API data for up to 30 days for safety, which
is why it counts as collected. Everything else (profile, food log, plans, shopping list,
favorites) stays on the phone and isn't collected. Purchases go through Apple, so we collect
no purchase data. No analytics, ads or tracking SDKs.

If any of this changes (analytics, crash reporting, accounts, sync), update this label and
the privacy policy first.

## Notes for App Review

```
Thank you for reviewing Mama & Baby Bites.

- No account or login is needed. On first launch, set up a sample baby (any name and a birth date about 6 months ago shows the starting-solids features), accept the disclaimer, and you'll land on the Today tab. A short app tour opens once.
- Premium: use a sandbox Apple Account to start the 7-day free trial from any locked screen or from Settings > Subscription. Settings > Subscription also has Restore purchases and opens Apple's subscription management.
- The paywall shows the price, billing period, trial length and auto-renewal terms, with links to the Terms of Use and Privacy Policy.
- Ask (AI meal ideas): shows a one-time consent screen explaining that the question and the baby's age in months are sent to our server and to Anthropic. Answers are general information, not medical advice. The screen always shows 911; questions about low mood or a crisis show 988 and 1-833-TLC-MAMA, and other red-flag questions are pointed to a professional.
- Health content is general information based on official US sources (CDC, AAP/HealthyChildren.org, FDA, USDA Dietary Guidelines, HHS Office on Women's Health) and was reviewed by a nutritionist. Safety content (choking, allergic reactions, emergency resources) is free and never behind the paywall.
- All personal data stays on the device. There are no ads and no tracking.

Contact: support@mamababybites.com
```
