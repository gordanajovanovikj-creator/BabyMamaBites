import { Pressable, View } from 'react-native';

import { AppText, cn } from '@/ui';

export type PlanCardProps = {
  name: string;
  /** The amount actually billed, e.g. "$66.00/year". Shown most prominently. */
  price: string;
  detail: string;
  /** Short emphasized note, e.g. "Save 57%". */
  highlight?: string;
  badge?: string;
  selected: boolean;
  onPress(): void;
};

/** One subscription option; two sit side by side on the paywall. */
export function PlanCard({
  name,
  price,
  detail,
  highlight,
  badge,
  selected,
  onPress,
}: PlanCardProps) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={[badge, name, price, detail, highlight].filter(Boolean).join('. ')}
      onPress={onPress}
      className={cn(
        'min-h-32 flex-1 gap-2 rounded-3xl border-2 px-4 pb-4 pt-5 active:opacity-80',
        selected ? 'border-primary bg-surface-muted' : 'border-border bg-surface',
      )}
    >
      {badge ? (
        <View className="absolute -top-3.5 self-center rounded-full bg-primary px-3 py-1">
          <AppText variant="label" size="xs" color="on-primary" className="font-bold uppercase">
            {badge}
          </AppText>
        </View>
      ) : null}
      <View className="flex-row items-center justify-between gap-2">
        <AppText variant="heading" size="lg">
          {name}
        </AppText>
        <View
          className={cn(
            'h-6 w-6 items-center justify-center rounded-full border-2',
            selected ? 'border-primary bg-primary' : 'border-ink-muted',
          )}
        >
          {selected ? <View className="h-2.5 w-2.5 rounded-full bg-on-primary" /> : null}
        </View>
      </View>
      <AppText variant="label" size="lg">
        {price}
      </AppText>
      <AppText variant="caption">{detail}</AppText>
      {highlight ? (
        <AppText variant="label" color="primary">
          {highlight}
        </AppText>
      ) : null}
    </Pressable>
  );
}
