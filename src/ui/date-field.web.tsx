import { View } from 'react-native';

import type { IsoDate } from '@/domain/dates';

import { AppText } from './app-text';

export type DateFieldProps = {
  label: string;
  value: IsoDate;
  onChange(date: IsoDate): void;
  minimumDate?: IsoDate;
  maximumDate?: IsoDate;
};

/** Browser preview only: a native HTML date input. */
export function DateField({ label, value, onChange, minimumDate, maximumDate }: DateFieldProps) {
  return (
    <View className="gap-2">
      <AppText variant="label">{label}</AppText>
      <input
        aria-label={label}
        type="date"
        value={value}
        min={minimumDate}
        max={maximumDate}
        onChange={(e) => e.target.value && onChange(e.target.value)}
        style={{ fontSize: 18, padding: 14, borderRadius: 16, border: '2px solid #E4DBD0' }}
      />
    </View>
  );
}
