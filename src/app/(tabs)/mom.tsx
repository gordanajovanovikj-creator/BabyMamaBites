import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { allRecipes, recipeCategories, recipes } from '@/content/recipes';
import { findRecipes, fitsCookingTime, recipeSections } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { useHousehold } from '@/features/profile/use-household';
import { CategoryRow } from '@/features/recipes/category-row';
import { HouseholdNote } from '@/features/recipes/household-note';
import { RecipeCard } from '@/features/recipes/recipe-card';
import { RecipeSection } from '@/features/recipes/recipe-section';
import { AppText, Notice, Screen, SegmentedTabs, SymbolIcon } from '@/ui';

type Tab = 'recipes' | 'favorites';

export default function MomScreen() {
  const insets = useSafeAreaInsets();
  const household = useHousehold();
  const { ids: favoriteIds } = useFavorites();
  const [tab, setTab] = useState<Tab>('recipes');

  const sections = recipeSections(recipeCategories, recipes, household);
  const hidden = findRecipes(recipes, household).hiddenForSafety;
  const favorites = favoriteIds
    .map((id) => allRecipes.find((r) => r.id === id))
    .filter((r) => r !== undefined);

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-6">
      <View className="gap-3 px-5" style={{ paddingTop: insets.top + 16 }}>
        <View className="gap-1">
          <AppText variant="display">Mom</AppText>
          <AppText variant="caption">Recipes to keep you nourished, matched to your time.</AppText>
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

      {tab === 'recipes' ? (
        <>
          <CategoryRow
            categories={recipeCategories}
            onSelect={(id) => id && router.push({ pathname: '/category/[id]', params: { id } })}
          />
          <View className="px-5">
            <HouseholdNote household={household} hidden={hidden} />
          </View>
          {sections.map((s) => (
            <RecipeSection key={s.category.id} category={s.category} recipes={s.recipes} />
          ))}
        </>
      ) : (
        <View className="gap-3 px-5">
          {favorites.length ? (
            favorites.map((r) => (
              <RecipeCard
                key={r.id}
                recipe={r}
                fitsTime={fitsCookingTime(r, household.cookingTime)}
              />
            ))
          ) : (
            <View className="items-center gap-3 py-12">
              <View className="h-20 w-20 items-center justify-center rounded-full bg-surface-muted">
                <SymbolIcon icon="heart" emoji="♡" size={36} />
              </View>
              <AppText variant="heading" className="text-center">
                No favorites yet
              </AppText>
              <AppText variant="caption" className="text-center">
                Tap the heart on any recipe to save it here.
              </AppText>
            </View>
          )}
          {favorites.length ? <Notice body="Favorites are saved on this phone only." /> : null}
        </View>
      )}
    </Screen>
  );
}
