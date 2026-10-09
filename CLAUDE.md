@AGENTS.md

## MamaBabyBites project rules

- **US-based app.** Health content follows US guidance (CDC, AAP/HealthyChildren.org, FDA,
  USDA Dietary Guidelines, HHS Office on Women's Health; WHO for global context). Write US
  English (mom, diaper, pacifier, pediatrician, color), US units first (oz, then ml), and
  US emergency/crisis numbers (911, 988, 1-833-TLC-MAMA). A test blocks common UK terms.

- **Content safety.** Never invent medical, nutrition or infant-feeding guidance. New
  health-adjacent text goes in `src/content/` with `reviewStatus: "placeholder"` and the
  `[PLACEHOLDER - needs expert review]` marker. Never claim a food increases milk supply.
- **Escalate red flags** (feeding difficulties, signs of postpartum depression, a sick baby)
  to a professional instead of answering them.
- **Privacy first.** User data stays on-device (`expo-sqlite`). Flag anything that would
  need a privacy-policy or App Store privacy-label change.
- **Layers.** Screens in `src/app/` stay thin; logic lives in `src/domain/` (pure, tested);
  UI primitives in `src/ui/`. Use semantic color classes (`bg-canvas`, `text-ink`…), never
  raw hex in components. Set colors and sizes on `Card`/`AppText` via their `tone`/`color`/`size`
  props, not by adding a second `bg-*`/`text-*` class (two conflicting classes resolve unpredictably).
- **Look and feel.** Always-white background with soft, natural earthy tones: sage/fresh green
  (primary, `#487549`), warm cream, oat, soft beige, terracotta/coral and butter yellow. Keep UI
  chrome neutral so real food photos are the focal point. Bold headings, pill buttons, big rounded
  cards (white cards get a hairline border). The app is light-only by design. Primary green meets
  4.5:1 on white; keep body text in ink or ink-muted.
- **UX.** Tap targets ≥ 48pt, warm non-judgmental copy, support Dynamic Type and VoiceOver.
- Run `npm run check` before committing.
