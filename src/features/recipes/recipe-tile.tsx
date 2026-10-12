import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { allergenLabels } from '@/domain/profile-labels';
import { babyAllergenWarning, recipeKicker, recipeMeta } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { AppText, HeartButton } from '@/ui';

import { AllergenBadge } from './allergen-badge';
import { RecipeImage } from './recipe-image';

export const RECIPE_TILE_WIDTH = 240;

/** Large, picture-style recipe card for horizontal rows (Sweat-style) and grids. */
export function RecipeTile({
  recipe,
  width = RECIPE_TILE_WIDTH,
}: {
  recipe: Recipe;
  /** Set for grid cells; defaults to the row width. */
  width?: number;
}) {
  const { isFavorite, toggle } = useFavorites();
  const saved = isFavorite(recipe.id);
  const allergens = babyAllergenWarning(recipe);
  const allergenNote = allergens.length
    ? ` Contains common allergens: ${allergens.map((a) => allergenLabels[a]).join(', ')}.`
    : '';

  return (
    <View style={{ width }} className="gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${recipe.title}. ${recipeKicker(recipe)}. ${recipeMeta(recipe)}.${allergenNote}`}
        onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
        className="gap-2 active:opacity-80"
      >
        <RecipeImage recipe={recipe} className="h-44 rounded-xl" iconSize={64} />
        <View className="gap-0.5 pr-2">
          <AppText
            variant="label"
            size="xs"
            color="on-accent"
            className="font-bold uppercase tracking-wider"
          >
            {recipeKicker(recipe)}
          </AppText>
          <AppText variant="label" size="lg" className="font-bold leading-6" numberOfLines={2}>
            {recipe.title}
          </AppText>
          <AppText variant="caption" size="sm">
            {recipeMeta(recipe)}
          </AppText>
        </View>
      </Pressable>
      {allergens.length ? <AllergenBadge className="absolute left-3 top-3" /> : null}
      <HeartButton
        saved={saved}
        onPress={() => toggle(recipe.id)}
        label={recipe.title}
        className="absolute right-3 top-3"
      />
    </View>
  );
}
