/**
 * Raw colour values for places that cannot take a className (native tab bar,
 * status bar, notification tint). Keep in sync with src/global.css.
 */
export const colors = {
  light: {
    canvas: '#FBF7F2',
    surface: '#FFFFFF',
    ink: '#2B2724',
    inkMuted: '#645B53',
    primary: '#4F6E55',
    border: '#E4DBD0',
  },
  dark: {
    canvas: '#1C1A18',
    surface: '#282522',
    ink: '#F4EFE9',
    inkMuted: '#BDB4AA',
    primary: '#A7C7AB',
    border: '#3D3833',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type Palette = (typeof colors)[ColorScheme];
