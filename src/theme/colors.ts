/**
 * Raw color values for places that cannot take a className (native tab bar,
 * status bar, date picker, notification tint). Keep in sync with src/global.css.
 * Palette: always-white background with soft earthy tones; sage green is the
 * primary (meets 4.5:1 on white). The app is light-only.
 */
const light = {
  canvas: '#FFFFFF',
  surface: '#FFFFFF',
  ink: '#2C2A25',
  inkMuted: '#6A655B',
  primary: '#487549',
  /** Lighter sage for the top of primary gradients (white bold text still reads on it). */
  primaryLight: '#6E9A6D',
  border: '#E9E3D8',
  /** Matches the danger-ink token, for SVG drawings that can't take a className. */
  dangerInk: '#9A3A1F',
} as const;

/** Light-only by design: "dark" mirrors light so older call sites keep working. */
export const colors = { light, dark: light } as const;

export type ColorScheme = keyof typeof colors;
export type Palette = typeof light;

/** Soft, warm drop shadows (CSS box-shadow syntax) for raised white cards. */
export const shadows = {
  card: '0 1px 2px rgba(44, 42, 37, 0.06), 0 6px 16px rgba(44, 42, 37, 0.08)',
  /** Wide, airy glow for floating pills (like the iOS Library header). */
  float: '0 6px 24px rgba(44, 42, 37, 0.10), 0 1px 3px rgba(44, 42, 37, 0.04)',
  /** The float look, tighter, so it fits inside a sideways-scrolling row without clipping. */
  floatTight: '0 4px 14px rgba(44, 42, 37, 0.10), 0 1px 3px rgba(44, 42, 37, 0.04)',
  chip: '0 1px 2px rgba(44, 42, 37, 0.06), 0 3px 8px rgba(44, 42, 37, 0.07)',
} as const;
