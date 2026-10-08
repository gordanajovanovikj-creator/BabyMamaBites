import { SymbolView } from 'expo-symbols';
import { Pressable, Text } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { cn } from './cn';

export type HeartButtonProps = {
  saved: boolean;
  onPress(): void;
  /** Name of the thing being saved, for VoiceOver. */
  label: string;
  className?: string;
};

/** Round 44pt save/unsave button. */
export function HeartButton({ saved, onPress, label, className }: HeartButtonProps) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ selected: saved }}
      accessibilityLabel={saved ? `Remove ${label} from favorites` : `Save ${label} to favorites`}
      onPress={onPress}
      hitSlop={8}
      className={cn(
        'h-11 w-11 items-center justify-center rounded-full bg-surface active:opacity-70',
        className,
      )}
    >
      <SymbolView
        name={saved ? 'heart.fill' : 'heart'}
        size={22}
        tintColor={palette.primary}
        fallback={<Text style={{ fontSize: 20, color: palette.primary }}>{saved ? '♥' : '♡'}</Text>}
      />
    </Pressable>
  );
}
