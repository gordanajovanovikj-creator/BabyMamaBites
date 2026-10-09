import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { babyRecipeCategories, babyRecipes } from '@/content/recipes';
import { babyCollectionsFor, findRecipes, recipeSections } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { useHousehold } from '@/features/profile/use-household';
import { CategoryChips } from '@/features/recipes/category-chips';
import { HouseholdNote } from '@/features/recipes/household-note';
import { RecipeGrid } from '@/features/recipes/recipe-grid';
import { RecipeSearchResults } from '@/features/recipes/recipe-search-results';
import { RecipeSection } from '@/features/recipes/recipe-section';
import { RECIPE_TILE_WIDTH, RecipeTile } from '@/features/recipes/recipe-tile';
import { AppText, Card, Notice, SearchField, SymbolIcon } from '@/ui';

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
  const byAge = [...babyRecipeCategories].sort((a, b) => (a.fromMonths ?? 0) - (b.fromMonths ?? 0));
  const sections = recipeSections(ordered, babyRecipes, household);
  const hidden = findRecipes(babyRecipes, household).hiddenForSafety;
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [query, setQuery] = useState('');
  const searching = query.trim().length > 0;
  // Filter chips run youngest to oldest; only age groups with recipes for this household.
  const chips = byAge.filter((c) => sections.some((s) => s.category.id === c.id));
  const selected = chips.find((c) => c.id === categoryId);
  const selectedRecipes = selected
    ? findRecipes(babyRecipes, household, { categoryId: selected.id }).recipes
    : [];

  return (
    <>
      <View className="px-5">
        <SearchField
          label="Search baby recipes"
          placeholder="Search recipes or ingredients"
          value={query}
          onChangeText={setQuery}
        />
      </View>
      {!searching ? (
        <CategoryChips categories={chips} selectedId={categoryId} onSelect={setCategoryId} />
      ) : null}
      <View className="gap-3 px-5">
        {current === null ? (
          <Notice
            title="Solids start at about 6 months"
            body={`These recipes are here so you can read ahead. Most babies are ready around 6 months; check the readiness signs on the Plan tab.`}
          />
        ) : null}
        <HouseholdNote household={household} hidden={hidden} />
      </View>
      {searching ? (
        <RecipeSearchResults recipes={findRecipes(babyRecipes, household).recipes} query={query} />
      ) : selected ? (
        <RecipeGrid
          title={selected.label}
          subtitle={`From ${selected.fromMonths ?? 0} months · ${selected.description}`}
          recipes={selectedRecipes}
        />
      ) : (
        <>
          {sections.map((s) => {
            const from = s.category.fromMonths ?? 0;
            const subtitle =
              s.category.id === current
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
          <View className="gap-3">
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
        <Notice
          tone="caution"
          title="Draft recipes"
          body="Not yet reviewed by a pediatric dietitian. Offer new foods one at a time, always stay with your baby while they eat, and follow your pediatrician's advice."
        />
      </View>
    </>
  );
}
