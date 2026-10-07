import { Pressable, Switch, View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { AppText } from './app-text';

export type SwitchRowProps = {
  label: string;
  detail?: string;
  value: boolean;
  onChange(value: boolean): void;
};

/** A whole-row tappable on/off switch. */
export function SwitchRow({ label, detail, value, onChange }: SwitchRowProps) {
  const palette = usePalette();
  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      accessibilityHint={detail}
      onPress={() => onChange(!value)}
      className="min-h-16 flex-row items-center gap-4 rounded-2xl border border-border bg-surface px-5 py-3 active:opacity-80"
    >
      <View className="flex-1 gap-0.5">
        <AppText variant="label" className="text-lg">
          {label}
        </AppText>
        {detail ? <AppText variant="caption">{detail}</AppText> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onChange}
        trackColor={{ true: palette.primary }}
        accessibilityElementsHidden
        importantForAccessibility="no"
      />
    </Pressable>
  );
}
