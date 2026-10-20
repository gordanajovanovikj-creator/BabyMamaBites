import { Image } from 'expo-image';
import { View } from 'react-native';

import { AppText } from '@/ui';

const mark = require('@/assets/images/logo-mark.png');

/** The list's cream header: the logo, the title and how much is left to buy. */
export function ShoppingHeader({ left, total }: { left: number; total: number }) {
  const done = total - left;
  const summary =
    total === 0
      ? 'Saved on this phone only'
      : left === 0
        ? 'All done! Everything is in the cart.'
        : `${left} of ${total} left to buy`;
  return (
    <View className="gap-4 rounded-3xl bg-accent p-5">
      <View className="flex-row items-center gap-4">
        <Image
          source={mark}
          contentFit="contain"
          accessible={false}
          style={{ width: 64, height: 64 }}
        />
        <View className="flex-1 gap-0.5">
          <AppText variant="title" size="2xl" color="on-accent" accessibilityRole="header">
            Shopping list
          </AppText>
          <AppText variant="body" size="base" color="on-accent">
            {summary}
          </AppText>
        </View>
      </View>
      {total > 0 ? (
        <View
          accessibilityRole="progressbar"
          accessibilityLabel={`${done} of ${total} in the cart`}
          accessibilityValue={{ min: 0, max: total, now: done }}
          className="h-2.5 overflow-hidden rounded-full bg-surface"
        >
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${Math.round((done / total) * 100)}%` }}
          />
        </View>
      ) : null}
    </View>
  );
}
