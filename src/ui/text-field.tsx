import { TextInput, View, type TextInputProps } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { AppText } from './app-text';

export type TextFieldProps = Omit<TextInputProps, 'onChange' | 'value'> & {
  label: string;
  value: string;
  onChangeText(value: string): void;
  hint?: string;
};

const inputText = { fontSize: 18 };

/** Labelled single-line text input, 56pt tall. */
export function TextField({ label, hint, value, onChangeText, ...rest }: TextFieldProps) {
  const palette = usePalette();
  return (
    <View className="gap-2">
      <AppText variant="label">{label}</AppText>
      <TextInput
        accessibilityLabel={label}
        accessibilityHint={hint}
        value={value}
        onChangeText={onChangeText}
        placeholderTextColor={palette.inkMuted}
        className="min-h-14 rounded-2xl bg-surface-muted px-5 text-ink"
        // Font size only: a line height (as `text-lg` sets) pushes typed text off-center on iOS.
        style={inputText}
        {...rest}
      />
      {hint ? <AppText variant="caption">{hint}</AppText> : null}
    </View>
  );
}
