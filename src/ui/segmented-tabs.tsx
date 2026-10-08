import { Pressable, View } from 'react-native';

import { AppText } from './app-text';
import { cn } from './cn';

export type SegmentedTabsProps<T extends string> = {
  tabs: { id: T; label: string }[];
  selected: T;
  onSelect(id: T): void;
};

/** Text tabs with an underline on the selected one. */
export function SegmentedTabs<T extends string>({
  tabs,
  selected,
  onSelect,
}: SegmentedTabsProps<T>) {
  return (
    <View className="flex-row border-b border-border" accessibilityRole="tablist">
      {tabs.map((t) => {
        const active = t.id === selected;
        return (
          <Pressable
            key={t.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: active }}
            onPress={() => onSelect(t.id)}
            className={cn(
              'min-h-12 flex-1 items-center justify-center border-b-[3px]',
              active ? 'border-primary' : 'border-transparent',
            )}
          >
            <AppText
              variant="label"
              size="lg"
              color={active ? 'ink' : 'muted'}
              className="font-bold"
            >
              {t.label}
            </AppText>
          </Pressable>
        );
      })}
    </View>
  );
}
