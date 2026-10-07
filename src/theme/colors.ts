/**
 * Raw colour values for places that cannot take a className (native tab bar,
 * status bar, date picker, notification tint). Keep in sync with src/global.css.
 * Palette: warm blush and rose with a soft lavender accent.
 */
export const colors = {
  light: {
    canvas: '#FFF7F5',
    surface: '#FFFFFF',
    ink: '#2A1E24',
    inkMuted: '#6E5A64',
    primary: '#C2255C',
    border: '#F3DFE5',
  },
  dark: {
    canvas: '#16111A',
    surface: '#231B27',
    ink: '#F9EEF2',
    inkMuted: '#C7B4BE',
    primary: '#FF8FB3',
    border: '#3A2D3D',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type Palette = (typeof colors)[ColorScheme];
