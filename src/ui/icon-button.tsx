import { SymbolView, type SymbolViewProps } from 'expo-symbols';
import { Pressable } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { AppText } from './app-text';
import { cn } from './cn';

export type IconButtonProps = {
  /** SF Symbol name (iOS). */
  symbol: SymbolViewProps['name'];
  /** Short text shown where SF Symbols aren't available (Android, web). */
  fallback: string;
  accessibilityLabel: string;
  onPress(): void;
  className?: string;
};

/** Round 48pt icon button for headers. */
export function IconButton({
  symbol,
  fallback,
  accessibilityLabel,
  onPress,
  className,
}: IconButtonProps) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      className={cn(
        'h-12 w-12 items-center justify-center rounded-full bg-surface-muted active:opacity-70',
        className,
      )}
    >
      <SymbolView
        name={symbol}
        size={22}
        tintColor={palette.primary}
        fallback={
          <AppText variant="label" color="primary">
            {fallback}
          </AppText>
        }
      />
    </Pressable>
  );
}
