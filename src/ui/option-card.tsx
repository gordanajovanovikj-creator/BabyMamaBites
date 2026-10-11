import { Pressable, View } from 'react-native';

import { shadows } from '@/theme/colors';

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

/**
 * Large, full-width answer card for one-tap choices: a raised white card with
 * a soft shadow and an iOS-style check on the right.
 */
export function OptionCard({ title, detail, selected, onPress, kind = 'radio' }: OptionCardProps) {
  return (
    <Pressable
      accessibilityRole={kind}
      accessibilityState={kind === 'radio' ? { selected } : { checked: selected }}
      accessibilityLabel={detail ? `${title}. ${detail}` : title}
      onPress={onPress}
      className={cn(
        'min-h-16 flex-row items-center gap-4 rounded-2xl border-2 bg-surface px-5 py-4 active:opacity-70',
        selected ? 'border-primary' : 'border-surface',
      )}
      style={{ borderCurve: 'continuous', boxShadow: shadows.card }}
    >
      <View className="flex-1 gap-0.5">
        <AppText variant="label" size="lg">
          {title}
        </AppText>
        {detail ? <AppText variant="caption">{detail}</AppText> : null}
      </View>
      <View
        className={cn(
          'h-7 w-7 items-center justify-center',
          kind === 'radio' ? 'rounded-full' : 'rounded-lg',
          selected ? 'bg-primary' : 'border-2 border-border',
        )}
      >
        {selected ? (
          <AppText variant="label" color="on-primary" size="sm" className="font-bold">
            ✓
          </AppText>
        ) : null}
      </View>
    </Pressable>
  );
}
