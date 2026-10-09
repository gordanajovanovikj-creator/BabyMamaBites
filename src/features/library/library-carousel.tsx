import { Pressable, ScrollView, View } from 'react-native';

import type { LibraryItem } from '@/domain/library';
import { AppText } from '@/ui';

import { LIBRARY_TILE_WIDTH, LibraryTile } from './library-tile';

export type LibraryCarouselProps = {
  title: string;
  subtitle?: string;
  items: LibraryItem[];
  ageMonths: number;
  onSeeAll?: () => void;
};

/** A section heading with optional "See all", then a row of story cards. */
export function LibraryCarousel({
  title,
  subtitle,
  items,
  ageMonths,
  onSeeAll,
}: LibraryCarouselProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-5">
        <View className="flex-1">
          <AppText variant="heading" size="2xl">
            {title}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" size="sm">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        {onSeeAll ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`See all: ${title}`}
            onPress={onSeeAll}
            hitSlop={8}
            className="min-h-11 flex-row items-center justify-center pl-3 active:opacity-60"
          >
            <AppText variant="label" color="muted" className="font-bold">
              See all ›
            </AppText>
          </Pressable>
        ) : null}
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
