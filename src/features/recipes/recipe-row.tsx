import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { allergenLabels } from '@/domain/profile-labels';
import { babyAllergenWarning, recipeKicker, recipeMeta } from '@/domain/recipes';
import { AppText } from '@/ui';

import { AllergenBadge } from './allergen-badge';
import { RecipeImage } from './recipe-image';

/** Sweat-style list row: thumbnail, meal label, title, time and servings, chevron. */
export function RecipeRow({ recipe, fitsTime }: { recipe: Recipe; fitsTime: boolean }) {
  const allergens = babyAllergenWarning(recipe);
  const allergenNote = allergens.length
    ? ` Contains common allergens: ${allergens.map((a) => allergenLabels[a]).join(', ')}.`
    : '';
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${recipe.title}. ${recipeKicker(recipe)}. ${recipeMeta(recipe)}.${fitsTime ? ' Fits your time.' : ''}${allergenNote}`}
      onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
      className="flex-row items-center gap-4 border-b border-border px-5 py-4 active:bg-surface-muted"
    >
      <View>
        <RecipeImage recipe={recipe} className="h-24 w-28 rounded-2xl" iconSize={36} />
        {allergens.length ? <AllergenBadge compact className="absolute left-1.5 top-1.5" /> : null}
      </View>
      <View className="flex-1 gap-0.5">
        <AppText
          variant="label"
          size="xs"
          color="on-accent"
          className="font-bold uppercase tracking-wider"
        >
          {recipeKicker(recipe)}
          {fitsTime ? ' · Fits your time' : ''}
        </AppText>
        <AppText variant="label" size="lg" className="font-bold leading-6" numberOfLines={3}>
          {recipe.title}
        </AppText>
        <AppText variant="caption" size="sm">
          {recipeMeta(recipe)}
        </AppText>
      </View>
      <AppText variant="heading" color="muted">
        ›
      </AppText>
    </Pressable>
  );
}
