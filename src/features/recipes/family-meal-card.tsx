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
};

/** The family meal that goes with a baby recipe: a recipe photo with the text underneath. */
export function FamilyMealCard({ recipe, note }: FamilyMealCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`Family meal: ${recipe.title}. ${note} Opens the recipe.`}
      onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
      className="gap-2 active:opacity-80"
    >
      <RecipeImage recipe={recipe} className="h-48 rounded-xl" iconSize={64} />
      <View className="gap-1 pr-2">
        <AppText
          variant="label"
          size="xs"
          color="on-accent"
          className="font-bold uppercase tracking-wider"
        >
          Family meal
        </AppText>
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
