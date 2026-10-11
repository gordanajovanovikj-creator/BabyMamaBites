import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { recipeCategories, recipes } from '@/content/recipes';
import { findRecipes, recipeSections } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { FavoritesList } from '@/features/favorites/favorites-list';
import { useHousehold } from '@/features/profile/use-household';
import { CategoryChips } from '@/features/recipes/category-chips';
import { HouseholdNote } from '@/features/recipes/household-note';
import { RecipeGrid } from '@/features/recipes/recipe-grid';
import { RecipeSearchResults } from '@/features/recipes/recipe-search-results';
import { RecipeSection } from '@/features/recipes/recipe-section';
import { AppText, Screen, SearchButton, SearchField, SegmentedTabs } from '@/ui';

type Tab = 'recipes' | 'favorites';

export default function MomScreen() {
  const insets = useSafeAreaInsets();
  const household = useHousehold();
  const { ids: favoriteIds } = useFavorites();
  const [tab, setTab] = useState<Tab>('recipes');
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const searching = searchOpen && query.trim().length > 0;
  const toggleSearch = () => {
    setSearchOpen((open) => !open);
    setQuery('');
  };

  const sections = recipeSections(recipeCategories, recipes, household);
  const hidden = findRecipes(recipes, household).hiddenForSafety;
  const favorites = favoriteIds
    .map((id) => recipes.find((r) => r.id === id))
    .filter((r) => r !== undefined);
  const chips = recipeCategories.filter((c) => sections.some((s) => s.category.id === c.id));
  const selected = chips.find((c) => c.id === categoryId);

  return (
    <Screen
      padded={false}
      edgeToEdgeTop
      className="gap-6"
      stickyHeader={
        <View className="gap-3 px-5" style={{ paddingTop: insets.top + 16 }}>
          <View className="gap-1">
            <View className="flex-row items-center justify-between gap-3">
              <AppText variant="display">Mom</AppText>
              {tab === 'recipes' ? (
                <SearchButton open={searchOpen} onPress={toggleSearch} subject="recipes" />
              ) : null}
            </View>
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
          {searchOpen ? (
            <View className="px-5">
              <SearchField
                label="Search recipes"
                placeholder="Search recipes or ingredients"
                value={query}
                onChangeText={setQuery}
                autoFocus
              />
            </View>
          ) : null}
          {!searching ? (
            <CategoryChips categories={chips} selectedId={categoryId} onSelect={setCategoryId} />
          ) : null}
          <View className="px-5">
            <HouseholdNote household={household} hidden={hidden} />
          </View>
          {searching ? (
            <RecipeSearchResults recipes={findRecipes(recipes, household).recipes} query={query} />
          ) : selected ? (
            <RecipeGrid
              title={selected.label}
              subtitle={selected.description}
              recipes={findRecipes(recipes, household, { categoryId: selected.id }).recipes}
            />
          ) : (
            sections.map((s) => (
              <RecipeSection key={s.category.id} category={s.category} recipes={s.recipes} />
            ))
          )}
        </>
      ) : (
        <FavoritesList recipes={favorites} />
      )}
    </Screen>
  );
}
