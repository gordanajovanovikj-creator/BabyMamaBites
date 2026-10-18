import { Pressable, View } from 'react-native';

import { AppText } from './app-text';
import { cn } from './cn';

export type FilterButtonProps = {
  /** How many filters are on; shown as a small badge. */
  count: number;
  onPress(): void;
};

/** Three lines, shortest at the bottom: the usual "filter" mark, drawn so it looks the same everywhere. */
function FilterMark() {
  return (
    <View className="items-center gap-1">
      <View className="h-0.5 w-5 rounded-full bg-ink" />
      <View className="h-0.5 w-3.5 rounded-full bg-ink" />
      <View className="h-0.5 w-2 rounded-full bg-ink" />
    </View>
  );
}

/** Round 48pt button beside a search box that opens the Filters sheet. */
export function FilterButton({ count, onPress }: FilterButtonProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={count ? `Filters, ${count} on` : 'Filters'}
      onPress={onPress}
      hitSlop={4}
      className={cn(
        'h-12 w-12 items-center justify-center rounded-full border-2 active:opacity-70',
        count ? 'border-primary bg-surface' : 'border-border bg-surface',
      )}
    >
      <FilterMark />
      {count ? (
        <View
          className="absolute -right-1 -top-1 h-6 min-w-6 items-center justify-center rounded-full bg-primary px-1"
          importantForAccessibility="no-hide-descendants"
          accessibilityElementsHidden
        >
          <AppText size="xs" color="on-primary" className="font-bold">
            {String(count)}
          </AppText>
        </View>
      ) : null}
    </Pressable>
  );
}
