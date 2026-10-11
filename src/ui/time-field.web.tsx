import { View } from 'react-native';

import { AppText } from './app-text';

export type TimeFieldProps = {
  label: string;
  /** "HH:MM", 24-hour. */
  value: string;
  onChange(value: string): void;
};

/** Browser preview only: a native HTML time input. */
export function TimeField({ label, value, onChange }: TimeFieldProps) {
  return (
    <View className="gap-2">
      <AppText variant="label">{label}</AppText>
      <input
        aria-label={label}
        type="time"
        value={value}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        style={{ fontSize: 18, padding: 14, borderRadius: 16, border: '2px solid #E9E3D8' }}
      />
    </View>
  );
}
