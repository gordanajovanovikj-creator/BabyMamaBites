import { SymbolView } from 'expo-symbols';
import { Pressable, Text } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { cn } from './cn';

export type SearchButtonProps = {
  /** True while the search box is showing; the button then closes it. */
  open: boolean;
  onPress(): void;
  /** What is being searched, e.g. "recipes", for VoiceOver. */
  subject: string;
};

/** Round 48pt button beside a page title that opens and closes the search box. */
export function SearchButton({ open, onPress, subject }: SearchButtonProps) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={open ? 'Close search' : `Search ${subject}`}
      accessibilityState={{ expanded: open }}
      onPress={onPress}
      hitSlop={4}
      className={cn(
        'h-12 w-12 items-center justify-center rounded-full active:opacity-70',
        open ? 'bg-primary' : 'bg-surface-muted',
      )}
    >
      <SymbolView
        name={open ? 'xmark' : 'magnifyingglass'}
        size={20}
        weight="semibold"
        tintColor={open ? palette.canvas : palette.ink}
        fallback={
          <Text style={{ fontSize: 18, color: open ? palette.canvas : palette.ink }}>
            {open ? '✕' : '🔍'}
          </Text>
        }
      />
    </Pressable>
  );
}
