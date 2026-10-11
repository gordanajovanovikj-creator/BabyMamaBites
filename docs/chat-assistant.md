# Chat assistant (Ask tab)

The Ask tab is a simple chat with an AI helper (Anthropic's Claude, model `claude-opus-5-5`).
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
  model at low effort with server-side refusal fallbacks enabled. The system prompt is
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

## Cost (rough guide)

Claude Opus 5.5 costs $4 per million input tokens and $20 per million output tokens. A typical
question and short answer is roughly 2,000 input and 300 output tokens, so about 1 to 2 cents
per answer (less when the system prompt is cached). 1,000 questions a day would be about
$300 to $600 a month. A smaller model (Claude Haiku 5.5, $0.10 / $0.50 per million) would cut
that by over 90%, with somewhat simpler answers: change `MODEL` in `chat+api.ts`.

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
