import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { recipeMeta } from '@/domain/recipes';
import { AppText } from '@/ui';

import { RecipeImage } from './recipe-image';

export type FamilyMealCardProps = {
  recipe: Recipe;
  /** How to make the family meal work for the baby too, when the pairing has one. */
  note?: string | null;
};

/** The family meal that goes with a baby recipe: a recipe photo with the text underneath. */
export function FamilyMealCard({ recipe, note }: FamilyMealCardProps) {
  const open = () => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } });
  const label = `Family meal: ${recipe.title}. ${note ? `${note} ` : ''}Opens the recipe.`;
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
        {note ? <AppText className="pt-1">{note}</AppText> : null}
      </View>
    </Pressable>
  );
}
