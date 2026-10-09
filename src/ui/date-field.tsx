import DateTimePicker, { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { Platform, Pressable, View } from 'react-native';

import { fromIsoDate, toIsoDate, type IsoDate } from '@/domain/dates';
import { usePalette } from '@/theme/use-palette';

import { AppText } from './app-text';

export type DateFieldProps = {
  label: string;
  value: IsoDate;
  onChange(date: IsoDate): void;
  minimumDate?: IsoDate;
  maximumDate?: IsoDate;
  /** 'calendar' (default) shows a month grid; 'wheel' shows spinning month/day/year wheels. */
  display?: 'calendar' | 'wheel';
};

function formatLong(date: IsoDate): string {
  return fromIsoDate(date).toLocaleDateString(undefined, {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

/** Date picker: an inline calendar or wheel on iOS, a tap-to-open dialog on Android. */
export function DateField({
  label,
  value,
  onChange,
  minimumDate,
  maximumDate,
  display = 'calendar',
}: DateFieldProps) {
  const palette = usePalette();
  const min = minimumDate ? fromIsoDate(minimumDate) : undefined;
  const max = maximumDate ? fromIsoDate(maximumDate) : undefined;

  if (Platform.OS === 'android') {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${label}: ${formatLong(value)}. Tap to change.`}
        onPress={() =>
          DateTimePickerAndroid.open({
            value: fromIsoDate(value),
            mode: 'date',
            minimumDate: min,
            maximumDate: max,
            onValueChange: (_event, date) => onChange(toIsoDate(date)),
          })
        }
        className="min-h-14 justify-center rounded-2xl border-2 border-border bg-surface px-5 active:opacity-80"
      >
        <AppText variant="caption">{label}</AppText>
        <AppText variant="label">{formatLong(value)}</AppText>
      </Pressable>
    );
  }

  if (display === 'wheel') {
    return (
      <View className="items-center">
        <DateTimePicker
          accessibilityLabel={label}
          value={fromIsoDate(value)}
          mode="date"
          display="spinner"
          minimumDate={min}
          maximumDate={max}
          textColor={palette.ink}
          themeVariant="light"
          onValueChange={(_event, date) => onChange(toIsoDate(date))}
        />
      </View>
    );
  }

  return (
    <View className="gap-2">
      <AppText variant="label">{label}</AppText>
      <View className="rounded-3xl border border-border bg-surface p-2">
        <DateTimePicker
          accessibilityLabel={label}
          value={fromIsoDate(value)}
          mode="date"
          display="inline"
          minimumDate={min}
          maximumDate={max}
          accentColor={palette.primary}
          themeVariant="light"
          onValueChange={(_event, date) => onChange(toIsoDate(date))}
        />
      </View>
      <AppText variant="caption">Selected: {formatLong(value)}</AppText>
    </View>
  );
}
