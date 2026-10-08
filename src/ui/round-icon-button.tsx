import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable, Text } from 'react-native';

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

/** White round 44pt button for floating over a picture (back, close). */
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
        'h-11 w-11 items-center justify-center rounded-full bg-surface active:opacity-70',
        className,
      )}
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
