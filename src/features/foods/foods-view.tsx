import { useState } from 'react';
import { ScrollView, useWindowDimensions, View } from 'react-native';

import { foodCategories, foodCategoryLabels, foods, type FoodCategory } from '@/content/foods';
import { filterFoods, foodTriedOn } from '@/domain/foods';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { useFoodLog } from '@/features/solids/food-log-context';
import { AppText, Chip, SearchField } from '@/ui';

import { FoodCard } from './food-card';

const GAP = 12;
const SIDE = 20;

const categoryEmoji: Record<FoodCategory, string> = {
  vegetables: '🥦',
  fruits: '🍓',
  proteins: '🍗',
  grains: '🌾',
  dairy: '🧀',
};

/** First foods A to Z, with how to serve each one safely by age. */
export function FoodsView({ searchOpen }: { searchOpen: boolean }) {
  const { entries } = useFoodLog();
  const { width } = useWindowDimensions();
  const cell = Math.floor((Math.min(width, 640) - SIDE * 2 - GAP) / 2);
  const [category, setCategory] = useState<FoodCategory | null>(null);
  const [query, setQuery] = useState('');
  // Closing the box clears the search.
  const [wasOpen, setWasOpen] = useState(searchOpen);
  if (wasOpen !== searchOpen) {
    setWasOpen(searchOpen);
    if (!searchOpen) setQuery('');
  }
  const shown = filterFoods(foods, searchOpen ? query : '', category);
  const triedCount = foods.filter((f) => foodTriedOn(entries, f) !== null).length;

  return (
    <>
      {searchOpen ? (
        <View className="px-5">
          <SearchField
            label="Search foods"
            placeholder="Search foods"
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
        </View>
      ) : null}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-5 pb-3 pt-3"
      >
        <Chip
          borderless
          label="All"
          selected={category === null}
          onPress={() => setCategory(null)}
        />
        {foodCategories.map((c) => (
          <Chip
            borderless
            key={c}
            label={`${categoryEmoji[c]} ${foodCategoryLabels[c]}`}
            selected={category === c}
            onPress={() => setCategory(c)}
          />
        ))}
      </ScrollView>
      <View className="gap-4 px-5">
        <View className="gap-1">
          <AppText variant="heading" size="2xl">
            {category ? foodCategoryLabels[category] : 'First foods'}
          </AppText>
          <AppText variant="caption">
            {`How to serve each food by age · ${triedCount} of ${foods.length} tried`}
          </AppText>
        </View>
        {shown.length ? (
          <View className="flex-row flex-wrap" style={{ gap: GAP }}>
            {shown.map((f) => (
              <FoodCard key={f.id} food={f} width={cell} tried={foodTriedOn(entries, f) !== null} />
            ))}
          </View>
        ) : (
          <AppText color="muted">No foods match that search yet.</AppText>
        )}
        <HealthDisclaimerNote draftReviewer="pediatric dietitian" />
      </View>
    </>
  );
}
