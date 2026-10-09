import { colors, type Palette } from './colors';

/** The app is light-only (white background at all times). */
export function usePalette(): Palette {
  return colors.light;
}
