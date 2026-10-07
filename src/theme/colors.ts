/**
 * Raw colour values for places that cannot take a className (native tab bar,
 * status bar, date picker, notification tint). Keep in sync with src/global.css.
 * Palette: warm blush and soft rose with a lavender accent.
 * Rose text only at large/bold sizes (3:1 contrast); body text stays ink.
 */
export const colors = {
  light: {
    canvas: '#FFF7F5',
    surface: '#FFFFFF',
    ink: '#2A1E24',
    inkMuted: '#6E5A64',
    primary: '#DB6487',
    border: '#F3DFE5',
  },
  dark: {
    canvas: '#16111A',
    surface: '#231B27',
    ink: '#F9EEF2',
    inkMuted: '#C7B4BE',
    primary: '#F5A3BC',
    border: '#3A2D3D',
  },
} as const;

export type ColorScheme = keyof typeof colors;
export type Palette = (typeof colors)[ColorScheme];
