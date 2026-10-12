import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, Text } from 'react-native';

import { shadows } from '@/theme/colors';
import { usePalette } from '@/theme/use-palette';

import { cn } from './cn';

export type RoundIconButtonProps = {
  symbol: SymbolViewProps['name'];
  /** Text shown where SF Symbols aren't available. */
  fallback: string;
  accessibilityLabel: string;
  onPress(): void;
  className?: string;
};

/**
 * White round 48pt button with a soft floating shadow, matching the search
 * button: back buttons in headers and over pictures, close.
 */
export function RoundIconButton({
  symbol,
  fallback,
  accessibilityLabel,
  onPress,
  className,
}: RoundIconButtonProps) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={8}
      className={cn(
        'h-12 w-12 items-center justify-center rounded-full bg-surface active:opacity-70',
        className,
      )}
      style={{ boxShadow: shadows.floatTight }}
    >
      <SymbolView
        name={symbol}
        size={18}
        weight="semibold"
        tintColor={palette.ink}
        fallback={<Text style={{ fontSize: 20, color: palette.ink }}>{fallback}</Text>}
      />
    </Pressable>
  );
}
