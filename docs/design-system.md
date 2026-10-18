# Design system

One set of rules so every screen feels like the same calm, modern app. The look follows
current iOS design: flat, softly tinted surfaces instead of outlines and drop shadows,
rounded "continuous" corners, bold type and plenty of space. Real food photos stay the
focal point.

## Surfaces

| Surface                   | Use for                                                          | Classes                                       |
| ------------------------- | ---------------------------------------------------------------- | --------------------------------------------- |
| **White card**            | Content blocks on the white page                                 | `Card` (white, hairline `border-border`)      |
| **Tinted card**           | Highlights: guides, tips, tracker                                | `Card tone="sky" / "accent" / "muted"`        |
| **Soft control**          | Anything you tap or type in: search, inputs, chips, tiles, pills | `bg-surface-muted`, no border, no shadow      |
| **Selected**              | The chosen chip, tab, day or week                                | `bg-primary` with `on-primary` text           |
| **Floating over a photo** | Back, close, heart, allergen pill, "tried" check                 | White, `shadows.floatTight` (the only shadow) |

- No drop shadows on cards or controls. Depth comes from the tint, not the shadow.
- Borders are 1px hairlines (`border border-border`) on white cards only. A 2px border is
  only for a selection outline (an option or plan picked) or an empty dashed slot.
- No second `bg-*`/`text-*` class on `Card` or `AppText`; use their `tone`/`color` props.

## Shapes and sizes

- Buttons, chips, search boxes and icon buttons: fully round (`rounded-full`), 48pt tall
  (main buttons 56pt).
- Small tiles (day pills, week tiles, option cards, inputs): `rounded-2xl`, at least 48pt.
- Cards: `rounded-3xl`. A photo inside a card uses `rounded-2xl`.
- Tap targets are never smaller than 48pt.

## Type

- Page titles: `AppText variant="display"`. Section titles: `variant="heading" size="2xl"`
  with a muted one-line subtitle under them and a "See all ›" link on the right.
- Small uppercase kickers (`size="xs"`, bold, wide tracking) sit above titles on cards.
- Body text is ink or ink-muted; green is for actions and selected states.

## Color

Sage green `primary` for actions and selection, cream `surface-muted` for controls, oat
`accent`, soft sage `sky`, terracotta `deep`/`danger` for warnings. Light-only. Never raw
hex in components; SVG drawings read raw colors from `src/theme/colors.ts`.
