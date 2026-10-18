import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { babyRecipeCategories, babyRecipes } from '@/content/recipes';
import { applyFilters, filtersChangeList, NO_FILTERS, recipeFacts } from '@/domain/filters';
import { babyCollectionsFor, findRecipes, recipeSections } from '@/domain/recipes';
import { searchRecipes } from '@/domain/search';
import { useFavorites } from '@/features/favorites/favorites-context';
import {
  ALL_SORTS,
  allergenOptions,
  babyRecipeAges,
  recipeTagOptions,
} from '@/features/filters/filter-options';
import { NoMatches } from '@/features/filters/no-matches';
import { SearchFilterBar } from '@/features/filters/search-filter-bar';
import { useHousehold } from '@/features/profile/use-household';
import { hasHouseholdNote, HouseholdNote } from '@/features/recipes/household-note';
import { RecipeGrid } from '@/features/recipes/recipe-grid';
import { RecipeSection } from '@/features/recipes/recipe-section';
import { RECIPE_TILE_WIDTH, RecipeTile } from '@/features/recipes/recipe-tile';
import { SafetyNotice } from '@/features/shared/safety-notice';
import { AppText, Card, Notice, SymbolIcon } from '@/ui';

export type BabyRecipesViewProps = {
  babyName: string | null;
  /** Age used for feeding (corrected where it applies). */
  ageMonths: number;
};

/** Baby and toddler recipes grouped by age, the baby's current group first (Mom-tab style). */
export function BabyRecipesView({ babyName, ageMonths }: BabyRecipesViewProps) {
  const household = useHousehold();
  const { ids: favoriteIds } = useFavorites();
  const makeAgain = favoriteIds
    .map((id) => babyRecipes.find((r) => r.id === id))
    .filter((r) => r !== undefined);
  const { ordered, current } = babyCollectionsFor(babyRecipeCategories, ageMonths);
  const sections = recipeSections(ordered, babyRecipes, household);
  const hidden = findRecipes(babyRecipes, household).hiddenForSafety;
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState(NO_FILTERS);
  const searching = query.trim().length > 0;
  const filtering = searching || filtersChangeList(filters);
  const safe = findRecipes(babyRecipes, household).recipes;
  const shown = filtering
    ? applyFilters(
        searching ? searchRecipes(safe, query) : safe,
        filters,
        recipeFacts(babyRecipes),
        babyRecipeAges,
      )
    : [];

  return (
    <>
      <SearchFilterBar
        label="Search baby recipes"
        placeholder="Search recipes"
        query={query}
        onQueryChange={setQuery}
        filters={filters}
        onFiltersChange={setFilters}
        config={{
          sorts: ALL_SORTS,
          ages: babyRecipeAges,
          allergens: allergenOptions,
          flags: recipeTagOptions,
        }}
      />
      {current === null || hasHouseholdNote(household) ? (
        <View className="gap-3 px-5">
          {current === null ? (
            <Notice
              title="Solids start at about 6 months"
              body={`These recipes are here so you can read ahead. Most babies are ready around 6 months; check the readiness signs on the Plan tab.`}
            />
          ) : null}
          <HouseholdNote household={household} hidden={hidden} />
        </View>
      ) : null}
      {filtering ? (
        shown.length ? (
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
        )
      ) : (
        <>
          {sections.map((s) => {
            const from = s.category.fromMonths ?? 0;
            const subtitle = s.category.theme
              ? s.category.description
              : s.category.id === current
                ? `For ${babyName ?? 'your baby'} now · from ${from} months`
                : from > ageMonths
                  ? `Coming up · from ${from} months`
                  : `From ${from} months`;
            return (
              <RecipeSection
                key={s.category.id}
                category={s.category}
                recipes={s.recipes}
                subtitle={subtitle}
              />
            );
          })}
          <View className="mt-4 gap-3">
            <View className="px-5">
              <AppText variant="heading" size="2xl">
                Make again
              </AppText>
              <AppText variant="caption" size="sm">
                {`${babyName ?? 'Your baby'}'s favorites, saved on this phone`}
              </AppText>
            </View>
            {makeAgain.length ? (
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                decelerationRate="fast"
                snapToInterval={RECIPE_TILE_WIDTH + 16}
                contentContainerClassName="gap-4 px-5"
              >
                {makeAgain.map((r) => (
                  <RecipeTile key={r.id} recipe={r} />
                ))}
              </ScrollView>
            ) : (
              <View className="px-5">
                <Card tone="muted" className="flex-row items-center gap-4">
                  <SymbolIcon icon="heart" emoji="♡" size={28} />
                  <AppText className="flex-1">
                    Tap the heart on a recipe {babyName ?? 'your baby'} loved to keep it here.
                  </AppText>
                </Card>
              </View>
            )}
          </View>
        </>
      )}

      <View className="px-5">
        <SafetyNotice id="age-guidelines" />
      </View>
    </>
  );
}
