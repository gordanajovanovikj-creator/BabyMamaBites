@AGENTS.md

## MamaBabyBites project rules

- **Content safety.** Never invent medical, nutrition or infant-feeding guidance. New
  health-adjacent text goes in `src/content/` with `reviewStatus: "placeholder"` and the
  `[PLACEHOLDER - needs expert review]` marker. Never claim a food increases milk supply.
- **Escalate red flags** (feeding difficulties, signs of postpartum depression, a sick baby)
  to a professional instead of answering them.
- **Privacy first.** User data stays on-device (`expo-sqlite`). Flag anything that would
  need a privacy-policy or App Store privacy-label change.
- **Layers.** Screens in `src/app/` stay thin; logic lives in `src/domain/` (pure, tested);
  UI primitives in `src/ui/`. Use semantic colour classes (`bg-canvas`, `text-ink`…), never
  raw hex in components. Set colours and sizes on `Card`/`AppText` via their `tone`/`color`/`size`
  props, not by adding a second `bg-*`/`text-*` class (two conflicting classes resolve unpredictably).
- **Look and feel.** Inspired by Sweat and Flo (without copying their branding): blush
  canvas, soft rose primary, lavender accent, bold headings, pill buttons, big rounded cards.
  Soft rose only meets 3:1 contrast, so use it for large or bold text and fills, never
  for small body text.
- **UX.** Tap targets ≥ 48pt, warm non-judgemental copy, support Dynamic Type, VoiceOver,
  light and dark mode.
- Run `npm run check` before committing.
