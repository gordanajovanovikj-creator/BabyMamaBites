import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { recipeCategories, recipes } from '@/content/recipes';
import { applyFilters, filtersChangeList, NO_FILTERS, recipeFacts } from '@/domain/filters';
import { findRecipes, recipeSections } from '@/domain/recipes';
import { searchRecipes } from '@/domain/search';
import { useFavorites } from '@/features/favorites/favorites-context';
import { FavoritesList } from '@/features/favorites/favorites-list';
import { ALL_SORTS, allergenOptions, recipeTagOptions } from '@/features/filters/filter-options';
import { SearchFilterBar } from '@/features/filters/search-filter-bar';
import { useHousehold } from '@/features/profile/use-household';
import { hasHouseholdNote, HouseholdNote } from '@/features/recipes/household-note';
import { RecipeGrid } from '@/features/recipes/recipe-grid';
import { NoMatches } from '@/features/filters/no-matches';
import { RecipeSection } from '@/features/recipes/recipe-section';
import { AppText, Screen, SegmentedTabs } from '@/ui';

type Tab = 'recipes' | 'favorites';

export default function MomScreen() {
  const insets = useSafeAreaInsets();
  const household = useHousehold();
  const { ids: favoriteIds } = useFavorites();
  const [tab, setTab] = useState<Tab>('recipes');
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(NO_FILTERS);
  const searching = query.trim().length > 0;
  const filtering = searching || filtersChangeList(filters);

  const sections = recipeSections(recipeCategories, recipes, household);
  const hidden = findRecipes(recipes, household).hiddenForSafety;
  const favorites = favoriteIds
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r) => r !== undefined);
  const types = recipeCategories.filter((c) => sections.some((s) => s.category.id === c.id));
  const safe = findRecipes(recipes, household).recipes;
  const shown = filtering
    ? applyFilters(searching ? searchRecipes(safe, query) : safe, filters, recipeFacts(recipes))
    : [];

  return (
    <Screen
      padded={false}
      edgeToEdgeTop
      className="gap-6"
      stickyHeader={
        <View className="gap-3 px-5" style={{ paddingTop: insets.top + 16 }}>
          <View className="gap-1">
            <AppText variant="display">Mom</AppText>
            <AppText variant="caption">
              Recipes to keep you nourished, matched to your time.
            </AppText>
          </View>
          <SegmentedTabs<Tab>
            tabs={[
              { id: 'recipes', label: 'Recipes' },
              {
                id: 'favorites',
                label: `Favorites${favorites.length ? ` (${favorites.length})` : ''}`,
              },
            ]}
            selected={tab}
            onSelect={setTab}
          />
        </View>
      }
    >
      {tab === 'recipes' ? (
        <>
          <SearchFilterBar
            label="Search recipes"
            placeholder="Search recipes"
            query={query}
            onQueryChange={setQuery}
            filters={filters}
            onFiltersChange={setFilters}
            config={{
              sorts: ALL_SORTS,
              categories: {
                title: 'Recipe type',
                options: types.map((c) => ({ id: c.id, label: `${c.emoji} ${c.label}` })),
              },
              allergens: allergenOptions,
              flags: recipeTagOptions,
            }}
          />
          {hasHouseholdNote(household) ? (
            <View className="px-5">
              <HouseholdNote household={household} hidden={hidden} />
            </View>
          ) : null}
          {!filtering ? (
            sections.map((s) => (
              <RecipeSection key={s.category.id} category={s.category} recipes={s.recipes} />
            ))
          ) : shown.length ? (
            <RecipeGrid
              title={`${shown.length} ${shown.length === 1 ? 'recipe' : 'recipes'} found`}
              recipes={shown}
            />
          ) : (
            <NoMatches
              query={query}
              onReset={() => {
                setQuery('');
                setFilters(NO_FILTERS);
              }}
            />
          )}
        </>
      ) : (
        <FavoritesList recipes={favorites} />
      )}
    </Screen>
  );
}
