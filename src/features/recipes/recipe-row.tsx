import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { recipeKicker, recipeMeta } from '@/domain/recipes';
import { AppText } from '@/ui';

import { RecipeImage } from './recipe-image';

/** Sweat-style list row: thumbnail, meal label, title, time and servings, chevron. */
export function RecipeRow({ recipe, fitsTime }: { recipe: Recipe; fitsTime: boolean }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${recipe.title}. ${recipeKicker(recipe)}. ${recipeMeta(recipe)}.${fitsTime ? ' Fits your time.' : ''}`}
      onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
      className="flex-row items-center gap-4 border-b border-border px-5 py-4 active:bg-surface-muted"
    >
      <RecipeImage recipe={recipe} className="h-24 w-28 rounded-2xl" iconSize={36} />
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
