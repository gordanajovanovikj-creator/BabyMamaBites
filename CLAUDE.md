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
  raw hex in components.
- **UX.** Tap targets ≥ 48pt, warm non-judgemental copy, support Dynamic Type, VoiceOver,
  light and dark mode.
- Run `npm run check` before committing.
