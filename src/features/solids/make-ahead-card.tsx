import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { shadows } from '@/theme/colors';
import { AppText } from '@/ui';

const photo = require('@/assets/images/plan/make-ahead.jpg');

/** Photo card for the make-ahead guide: a tray of frozen purees with the text underneath. */
export function MakeAheadCard() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Make-ahead baby food: a few hours of prep can stock your freezer for weeks. Opens the guide."
      onPress={() =>
        router.push({ pathname: '/solids/article/[id]', params: { id: 'homemade-baby-food' } })
      }
      className="gap-3 active:opacity-90"
    >
      <View className="rounded-xl bg-surface" style={{ height: 220, boxShadow: shadows.card }}>
        <Image
          source={photo}
          contentFit="cover"
          transition={150}
          accessible={false}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12 }}
        />
      </View>
      <View className="gap-1">
        <AppText variant="heading" size="xl">
          Make-ahead baby food
        </AppText>
        <AppText color="muted">A few hours of prep can stock your freezer for weeks.</AppText>
        <AppText variant="label" color="primary" className="pt-1 font-bold">
          See how ›
        </AppText>
      </View>
    </Pressable>
  );
}
