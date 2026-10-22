import { SymbolView } from 'expo-symbols';
import { Text } from 'react-native';

import { usePalette } from '@/theme/use-palette';
import { symbolName } from './symbol-name';

export type SymbolIconProps = {
  /** SF Symbol name (iOS). */
  icon: string;
  /** Shown where SF Symbols aren't available (Android, web). */
  emoji: string;
  size?: number;
};

/** An SF Symbol tinted in the primary color, with an emoji fallback. Decorative. */
export function SymbolIcon({ icon, emoji, size = 28 }: SymbolIconProps) {
  const palette = usePalette();
  return (
    <SymbolView
      name={symbolName(icon)}
      size={size}
      tintColor={palette.primary}
      fallback={<Text style={{ fontSize: size, lineHeight: size * 1.2 }}>{emoji}</Text>}
    />
  );
}
