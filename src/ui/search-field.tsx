import { Platform, Pressable, TextInput, View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { AppText } from './app-text';
import { SymbolIcon } from './symbol-icon';

export type SearchFieldProps = {
  value: string;
  onChangeText(value: string): void;
  placeholder: string;
  /** Read by VoiceOver, e.g. "Search recipes". */
  label: string;
  /** Focus the box (and open the keyboard) when it appears. */
  autoFocus?: boolean;
};

/** Rounded search box with a clear button, 48pt tall. */
export function SearchField({
  value,
  onChangeText,
  placeholder,
  label,
  autoFocus,
}: SearchFieldProps) {
  const palette = usePalette();
  return (
    <View className="min-h-12 flex-row items-center gap-2 rounded-full border-2 border-border bg-surface pl-4 pr-1">
      <SymbolIcon icon="magnifyingglass" emoji="🔍" size={18} />
      <TextInput
        accessibilityLabel={label}
        accessibilityRole="search"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={palette.inkMuted}
        autoFocus={autoFocus}
        returnKeyType="search"
        autoCorrect={false}
        clearButtonMode="never"
        className="min-h-11 min-w-0 flex-1 text-lg text-ink"
        // The pill is the focus indicator; hide the browser's own outline in the web preview.
        style={Platform.OS === 'web' ? ({ outlineStyle: 'none' } as object) : undefined}
      />
      {value ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Clear search"
          onPress={() => onChangeText('')}
          hitSlop={8}
          className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
        >
          <AppText variant="label" color="muted" size="lg">
            ✕
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
