import type { ReactNode } from 'react';
import { Pressable, View } from 'react-native';

import { AppText, cn, toneBackground } from '@/ui';

export type AisleCardProps = {
  emoji: string;
  title: string;
  count: number;
  children: ReactNode;
  /** Softer card, for items already in the cart. */
  muted?: boolean;
  /** A small text action on the right of the heading, e.g. "Clear". */
  action?: { label: string; accessibilityLabel: string; onPress(): void };
};

/** One store section of the list: a heading with a picture and count, then its items. */
export function AisleCard({
  emoji,
  title,
  count,
  children,
  muted = false,
  action,
}: AisleCardProps) {
  return (
    <View
      className={cn('overflow-hidden rounded-3xl', toneBackground(muted ? 'muted' : 'surface'))}
    >
      <View className="flex-row items-center gap-3 px-4 pb-1 pt-4">
        <AppText size="xl" accessibilityElementsHidden importantForAccessibility="no">
          {emoji}
        </AppText>
        <AppText variant="heading" size="lg" accessibilityRole="header" className="flex-1">
          {`${title} · ${count}`}
        </AppText>
        {action ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={action.accessibilityLabel}
            onPress={action.onPress}
            hitSlop={8}
            className="min-h-11 justify-center pl-3 active:opacity-60"
          >
            <AppText variant="label" color="primary" className="font-bold">
              {action.label}
            </AppText>
          </Pressable>
        ) : null}
      </View>
      {children}
    </View>
  );
}
