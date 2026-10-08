import { Pressable, View } from 'react-native';

import { AppText } from './app-text';
import { cn } from './cn';

export type OptionCardProps = {
  title: string;
  detail?: string;
  selected: boolean;
  onPress(): void;
  /** 'radio' for pick-one lists, 'checkbox' for pick-many. */
  kind?: 'radio' | 'checkbox';
};

/** Large, full-width answer card for one-tap choices. */
export function OptionCard({ title, detail, selected, onPress, kind = 'radio' }: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole={kind}
      accessibilityState={kind === 'radio' ? { selected } : { checked: selected }}
      accessibilityLabel={detail ? `${title}. ${detail}` : title}
      onPress={onPress}
      className={cn(
        'min-h-16 flex-row items-center gap-4 rounded-2xl border-2 px-5 py-4 active:opacity-80',
        selected ? 'border-primary bg-surface-muted' : 'border-border bg-surface',
      )}
    >
      <View
        className={cn(
          'h-6 w-6 items-center justify-center border-2',
          kind === 'radio' ? 'rounded-full' : 'rounded-md',
          selected ? 'border-primary bg-primary' : 'border-ink-muted',
        )}
      >
        {selected ? <View className="h-2.5 w-2.5 rounded-full bg-on-primary" /> : null}
      </View>
      <View className="flex-1 gap-0.5">
        <AppText variant="label" size="lg">
          {title}
        </AppText>
        {detail ? <AppText variant="caption">{detail}</AppText> : null}
      </View>
    </Pressable>
  );
}
