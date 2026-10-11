import DateTimePicker from '@react-native-community/datetimepicker';
import { View } from 'react-native';

import { usePalette } from '@/theme/use-palette';

import { AppText } from './app-text';

export type TimeFieldProps = {
  label: string;
  /** "HH:MM", 24-hour. */
  value: string;
  onChange(value: string): void;
};

function toDate(value: string): Date {
  const [h, m] = value.split(':').map(Number);
  const d = new Date();
  d.setHours(h, m, 0, 0);
  return d;
}

function fromDate(d: Date): string {
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

/** Time picker (spinning wheels on iOS). */
export function TimeField({ label, value, onChange }: TimeFieldProps) {
  const palette = usePalette();
  return (
    <View className="gap-2">
      <AppText variant="label">{label}</AppText>
      <View className="items-center">
        <DateTimePicker
          accessibilityLabel={label}
          value={toDate(value)}
          mode="time"
          display="spinner"
          minuteInterval={5}
          textColor={palette.ink}
          themeVariant="light"
          onValueChange={(_event, date) => onChange(fromDate(date))}
        />
      </View>
    </View>
  );
}
