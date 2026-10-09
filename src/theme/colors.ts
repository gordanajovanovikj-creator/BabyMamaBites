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
  border: '#E9E3D8',
} as const;

/** Light-only by design: "dark" mirrors light so older call sites keep working. */
export const colors = { light, dark: light } as const;

export type ColorScheme = keyof typeof colors;
export type Palette = typeof light;
