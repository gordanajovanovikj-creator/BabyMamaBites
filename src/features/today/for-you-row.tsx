import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import type { LibraryItem } from '@/domain/library';
import { LIBRARY_TILE_WIDTH, LibraryTile } from '@/features/library/library-tile';
import { AppText } from '@/ui';

/** "For you": articles and tips for mom, on Today. */
export function ForYouRow({ items, ageMonths }: { items: LibraryItem[]; ageMonths: number }) {
  if (!items.length) return null;
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-5">
        <View className="flex-1">
          <AppText variant="heading" size="2xl">
            For you
          </AppText>
          <AppText variant="caption" size="sm">
            Food, rest and support for mama
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all insights"
          onPress={() => router.navigate('/insights')}
          hitSlop={8}
          className="min-h-11 flex-row items-center justify-center pl-3 active:opacity-60"
        >
          <AppText variant="label" color="muted" className="font-bold">
            See all ›
          </AppText>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={LIBRARY_TILE_WIDTH + 12}
        contentContainerClassName="gap-3 px-5 pb-1"
      >
        {items.map((item) => (
          <LibraryTile key={`${item.source}-${item.id}`} item={item} ageMonths={ageMonths} />
        ))}
      </ScrollView>
    </View>
  );
}
