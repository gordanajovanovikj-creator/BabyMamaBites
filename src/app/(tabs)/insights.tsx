import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { insightCategories } from '@/content/insight-categories';
import { librarySections, pickedForAge } from '@/domain/library';
import { LibraryCarousel } from '@/features/library/library-carousel';
import { LibraryTile } from '@/features/library/library-tile';
import { useLibrary } from '@/features/library/use-library';
import { AppText, Chip, Notice, Screen } from '@/ui';

const GAP = 12;
const SIDE = 20;

/** Insights library for mom and baby, Flo-style: category chips, then story-card rows. */
export default function InsightsScreen() {
  const insets = useSafeAreaInsets();
  const { items, ageMonths, babyName } = useLibrary();
  const { width } = useWindowDimensions();
  const [categoryId, setCategoryId] = useState<string | null>(null);

  const sections = librarySections(insightCategories, items, ageMonths);
  const picked = pickedForAge(items, ageMonths);
  const selected = sections.find((s) => s.category.id === categoryId);
  const cell = Math.floor((Math.min(width, 640) - SIDE * 2 - GAP) / 2);
  const name = babyName ?? 'your baby';

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-6">
      <View className="gap-1 px-5" style={{ paddingTop: insets.top + 16 }}>
        <AppText variant="display">Insights</AppText>
        <AppText variant="caption">Articles and tips for you and {name}, chosen by age.</AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-5"
      >
        <Chip label="All" selected={categoryId === null} onPress={() => setCategoryId(null)} />
        {sections.map((s) => (
          <Chip
            key={s.category.id}
            label={`${s.category.emoji} ${s.category.label}`}
            selected={categoryId === s.category.id}
            onPress={() => setCategoryId(s.category.id)}
          />
        ))}
      </ScrollView>

      {selected ? (
        <View className="gap-4 px-5">
          <View className="gap-1">
            <AppText variant="heading" size="2xl">
              {selected.category.label}
            </AppText>
            <AppText variant="caption">{selected.category.description}</AppText>
          </View>
          <View className="flex-row flex-wrap" style={{ gap: GAP }}>
            {selected.items.map((item) => (
              <LibraryTile
                key={`${item.source}-${item.id}`}
                item={item}
                ageMonths={ageMonths}
                width={cell}
              />
            ))}
          </View>
        </View>
      ) : (
        <>
          {picked.length ? (
            <LibraryCarousel
              title={`Picked for ${name}'s age`}
              subtitle="What matters most right now"
              items={picked}
              ageMonths={ageMonths}
            />
          ) : null}
          {sections.map((s) => (
            <LibraryCarousel
              key={s.category.id}
              title={s.category.label}
              subtitle={s.category.audience === 'mom' ? 'For you' : `For ${name}`}
              items={s.items}
              ageMonths={ageMonths}
              onSeeAll={() => setCategoryId(s.category.id)}
            />
          ))}
        </>
      )}

      <View className="px-5">
        <Notice
          tone="caution"
          title="Drafts from official sources"
          body="These articles and tips haven't been reviewed by a health professional yet. They're not medical advice. Follow your doctor's and pediatrician's advice, and call 911 in an emergency."
        />
      </View>
    </Screen>
  );
}
