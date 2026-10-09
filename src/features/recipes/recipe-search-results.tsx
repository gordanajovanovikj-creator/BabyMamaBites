import { View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { searchRecipes } from '@/domain/search';
import { AppText } from '@/ui';

import { RecipeGrid } from './recipe-grid';

/** Search results for a recipe list (already filtered for the household's allergies and diet). */
export function RecipeSearchResults({ recipes, query }: { recipes: Recipe[]; query: string }) {
  const found = searchRecipes(recipes, query);
  if (!found.length) {
    return (
      <View className="gap-1 px-5 py-6">
        <AppText variant="heading" className="text-center">
          No recipes match “{query.trim()}”
        </AppText>
        <AppText variant="caption" className="text-center">
          Try a single ingredient, like “oats” or “carrot”.
        </AppText>
      </View>
    );
  }
  return (
    <RecipeGrid
      title={`${found.length} ${found.length === 1 ? 'recipe' : 'recipes'} found`}
      recipes={found}
    />
  );
}
