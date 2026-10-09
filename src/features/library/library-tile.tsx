import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { getInsightCategory } from '@/content/insight-categories';
import { ageRangeLabel, articleTiming } from '@/domain/articles';
import type { LibraryItem } from '@/domain/library';
import { insightTextColor } from '@/features/insights/insight-style';
import { AppText, Card, Illustration } from '@/ui';

export const LIBRARY_TILE_WIDTH = 168;

/** "For you", "For now", "Coming up" or an age range, plus reading time. */
export function libraryKicker(item: LibraryItem, ageMonths: number): string {
  const audience = getInsightCategory(item.category)?.audience;
  const timing = articleTiming(item, ageMonths);
  const when =
    audience === 'mom'
      ? 'For you'
      : timing === 'now'
        ? 'For now'
        : timing === 'coming-up'
          ? 'Coming up'
          : ageRangeLabel(item);
  return `${when} · ${item.readMinutes} min`;
}

export function openLibraryItem(item: LibraryItem) {
  if (item.source === 'article') {
    router.push({ pathname: '/solids/article/[id]', params: { id: item.id } });
  } else {
    router.push({ pathname: '/insight/[id]', params: { id: item.id } });
  }
}

export type LibraryTileProps = {
  item: LibraryItem;
  ageMonths: number;
  /** Fixed width for carousels; omit to fill a grid cell. */
  width?: number;
};

/** Tall, colorful story card with the title on the card (Flo-style). */
export function LibraryTile({ item, ageMonths, width = LIBRARY_TILE_WIDTH }: LibraryTileProps) {
  const color = insightTextColor[item.tone];
  const kicker = libraryKicker(item, ageMonths);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${item.title}. ${kicker} read.`}
      onPress={() => openLibraryItem(item)}
      style={{ width }}
      className="active:opacity-80"
    >
      <Card tone={item.tone} className="min-h-60 justify-between gap-2 px-4 pb-3 pt-4">
        <View className="gap-1">
          <AppText
            variant="caption"
            color={color}
            size="xs"
            className="font-bold uppercase tracking-wider opacity-80"
          >
            {kicker}
          </AppText>
          <AppText variant="heading" color={color} size="lg" className="leading-6">
            {item.title}
          </AppText>
        </View>
        <View className="items-center">
          <Illustration
            name={item.illustration}
            on={item.tone === 'surface' ? 'white' : item.tone === 'deep' ? 'dark' : 'pastel'}
            height={100}
          />
        </View>
      </Card>
    </Pressable>
  );
}
