# Chat assistant (Ask tab)

The Ask tab is a simple chat with an AI helper (Anthropic's Claude). It uses **Claude Haiku 5.5**
(`claude-haiku-5-5`) by default; set `CHAT_MODEL=opus` on the server to use Claude Opus 5.5 instead.
The app never talks to Anthropic directly: it sends the conversation to the app's own server
route, `src/app/api/chat+api.ts`, which holds the secret API key and calls the model.

## How it works

- **App:** `src/app/(tabs)/ask.tsx` keeps the conversation in memory only (nothing is saved on
  the phone). It sends the messages plus the baby's age in months. No name, birth date,
  allergies or other profile data is sent.
- **Urgent messages:** before sending, `detectUrgent` (`src/domain/chat.ts`) looks for emergency
  or crisis wording and immediately shows 911, or 988 and 1-833-TLC-MAMA, in the app.
- **Server:** validates the request (max 20 messages, 2,000 characters each), adds a fixed
  safety system prompt (`src/content/chat-prompt.ts`, marked for expert review), and calls the
  model at low effort (Opus also gets server-side refusal fallbacks; Haiku has none, so a
  declined question shows a gentle "talk to your pediatrician" message). The system prompt is
  prompt-cached.

## What you need to switch it on

1. **Anthropic account and API key.** Create a key at console.anthropic.com. Set a monthly
   spend limit there.
2. **Expo / EAS account** to host the server route (EAS Hosting).
3. **Store the key on the server only**, never in the app or in git:
   `npx eas-cli@latest env:create --name ANTHROPIC_API_KEY --value <key> --environment production --visibility secret`
   (or add it in the EAS dashboard under Environment variables).
4. **Deploy the server:**
   `npx expo export --platform web` then `npx eas-cli@latest deploy --prod`.
   Note the URL it prints (for example `https://mamababybites.expo.app`).
5. **Point the iPhone app at it:** in `app.json`, change the `expo-router` plugin entry to
   `["expo-router", { "origin": "https://<your-url>/" }]`, then make a new build.
6. **Local testing:** `ANTHROPIC_API_KEY=<key> npx expo start` makes the chat work in
   development.

## Choosing the model

|                                              | Claude Haiku 5.5 (default)                                  | Claude Opus 5.5                                        |
| -------------------------------------------- | ----------------------------------------------------------- | ------------------------------------------------------ |
| Price per million tokens                     | $0.10 in / $0.50 out                                        | $4 in / $20 out                                        |
| One typical answer (about 2,000 in, 300 out) | about 0.04 cents                                            | about 1.4 cents                                        |
| 1,000 questions a day                        | about $10 a month                                           | about $400 a month                                     |
| Speed                                        | fastest                                                     | slower                                                 |
| Answers                                      | short, simple, good for everyday meal and texture questions | more nuanced, better at tricky or multi-part questions |
| If a safety filter declines                  | shows the gentle fallback message                           | retried automatically on another model                 |

To compare them yourself: add `CHAT_MODEL=opus` to the server's environment variables (or run
`CHAT_MODEL=opus ANTHROPIC_API_KEY=<key> npx expo start` locally), ask the same questions,
then remove it to go back to Haiku. No app update is needed; the switch is on the server.

Suggested test questions: a recipe from 3 ingredients, finger foods for 9 months, "can my
6-month-old have honey?", "my baby gags on lumps", and one low-mood message to check the
988 / 1-833-TLC-MAMA response.

## Before launch

- **Expert review** of `src/content/chat-prompt.ts` (pediatric dietitian, pediatrician,
  perinatal mental-health clinician).
- **Privacy policy:** say that questions typed into Ask are sent to our server and to
  Anthropic to generate an answer, are not stored by the app, and that the baby's age in
  months is included. Check Anthropic's data-retention terms for your account.
- **App Store privacy label:** add "User Content → Other User Content", used for "App
  Functionality", not linked to identity, not used for tracking.
- **Abuse protection:** consider rate limiting (per device) on the server route, and keep an
  Anthropic spend limit in place.
- **App Store guideline 1.4.1** (medical apps): keep the "not medical advice" notice and the
  911 / 988 escalation visible.
