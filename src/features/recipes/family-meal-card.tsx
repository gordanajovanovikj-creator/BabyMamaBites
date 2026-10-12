import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { recipeMeta } from '@/domain/recipes';
import { AppText } from '@/ui';

import { RecipeImage } from './recipe-image';

export type FamilyMealCardProps = {
  recipe: Recipe;
  /** How to make the family meal work for the baby too. */
  note: string;
  /** A small thumbnail beside the text, for tight spaces like the planner. */
  compact?: boolean;
};

/** The family meal that goes with a baby recipe: a recipe photo with the text underneath. */
export function FamilyMealCard({ recipe, note, compact = false }: FamilyMealCardProps) {
  const open = () => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } });
  const label = `Family meal: ${recipe.title}. ${note} Opens the recipe.`;
  const kicker = (
    <AppText
      variant="label"
      size="xs"
      color="on-accent"
      className="font-bold uppercase tracking-wider"
    >
      Family meal
    </AppText>
  );

  if (compact) {
    // Planner: a small square photo beside the text.
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        onPress={open}
        className="gap-2 active:opacity-80"
      >
        <View className="flex-row items-center gap-3">
          <RecipeImage recipe={recipe} className="h-20 w-20 rounded-xl" iconSize={32} />
          <View className="flex-1 gap-0.5">
            {kicker}
            <AppText variant="label" className="font-bold leading-5">
              {recipe.title}
            </AppText>
            <AppText variant="caption" size="sm">
              {recipeMeta(recipe)}
            </AppText>
          </View>
        </View>
        <AppText variant="caption" size="sm">
          {note}
        </AppText>
      </Pressable>
    );
  }

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={open}
      className="gap-2 active:opacity-80"
    >
      <RecipeImage recipe={recipe} className="h-48 rounded-xl" iconSize={64} />
      <View className="gap-1 pr-2">
        {kicker}
        <AppText variant="label" size="lg" className="font-bold leading-6">
          {recipe.title}
        </AppText>
        <AppText variant="caption" size="sm">
          {recipeMeta(recipe)}
        </AppText>
        <AppText className="pt-1">{note}</AppText>
      </View>
    </Pressable>
  );
}
