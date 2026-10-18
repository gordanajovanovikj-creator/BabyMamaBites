import { useState } from 'react';
import { useWindowDimensions, View } from 'react-native';

import {
  foodCategories,
  foodCategoryLabels,
  foods,
  type Food,
  type FoodCategory,
} from '@/content/foods';
import { applyFilters, filtersChangeList, foodFacts, NO_FILTERS } from '@/domain/filters';
import { filterFoods, foodProgress, foodTriedOn } from '@/domain/foods';
import { ALL_SORTS, allergenOptions } from '@/features/filters/filter-options';
import { NoMatches } from '@/features/filters/no-matches';
import { SearchFilterBar } from '@/features/filters/search-filter-bar';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { useFoodLog } from '@/features/solids/food-log-context';
import { AppText } from '@/ui';

import { FoodCard } from './food-card';
import { FoodProgressCard } from './food-progress-card';

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
export function FoodsView({ babyName }: { babyName: string | null }) {
  const { entries } = useFoodLog();
  const { width } = useWindowDimensions();
  const cell = Math.floor((Math.min(width, 640) - SIDE * 2 - GAP) / 2);
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(NO_FILTERS);
  const filtering = query.trim().length > 0 || filtersChangeList(filters);
  const isTried = (f: Food) => foodTriedOn(entries, f) !== null;
  // A to Z is the recommended order for foods.
  const shown = applyFilters(filterFoods(foods, query, null), filters, foodFacts(foods, isTried));
  const progress = foodProgress(entries, foods);
  const oneType =
    filters.categories.length === 1 ? (filters.categories[0] as FoodCategory) : undefined;
  const heading = oneType
    ? foodCategoryLabels[oneType]
    : filtering
      ? `${shown.length} ${shown.length === 1 ? 'food' : 'foods'} found`
      : 'First foods';

  return (
    <>
      <SearchFilterBar
        label="Search foods"
        placeholder="Food name"
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={setFilters}
        config={{
          sorts: ALL_SORTS,
          categories: {
            title: 'Food type',
            options: foodCategories.map((c) => ({
              id: c,
              label: `${categoryEmoji[c]} ${foodCategoryLabels[c]}`,
            })),
          },
          allergens: allergenOptions,
          tracked: true,
          flags: [{ id: 'iron-rich', label: 'Iron-rich' }],
        }}
      />
      <View className="gap-4 px-5">
        {!filtering ? (
          <FoodProgressCard progress={progress} name={babyName ?? 'Your baby'} />
        ) : null}
        <View className="gap-1">
          <AppText variant="heading" size="2xl">
            {heading}
          </AppText>
          <AppText variant="caption">How to serve each food by age</AppText>
        </View>
        {shown.length ? (
          <View className="flex-row flex-wrap" style={{ gap: GAP }}>
            {shown.map((f) => (
              <FoodCard key={f.id} food={f} width={cell} tried={isTried(f)} />
            ))}
          </View>
        ) : (
          <NoMatches
            query={query}
            onReset={() => {
              setQuery('');
              setFilters(NO_FILTERS);
            }}
          />
        )}
        <HealthDisclaimerNote draftReviewer="pediatric dietitian" />
      </View>
    </>
  );
}
