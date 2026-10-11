import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { RecipeImage } from '@/features/recipes/recipe-image';
import { AppText, cn, toneBackground } from '@/ui';

const CARD_WIDTH = 156;

/** A soft pastel box with a round photo of the meal, its name and the age it suits. */
function FoodCard({ recipe }: { recipe: Recipe }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${recipe.title}, from ${recipe.fromMonths} months. Opens the recipe.`}
      onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
      style={{ width: CARD_WIDTH }}
      className={cn(
        'min-h-48 justify-between gap-3 rounded-3xl p-4 active:opacity-80',
        toneBackground(recipe.tone === 'surface' ? 'muted' : recipe.tone),
      )}
    >
      <RecipeImage recipe={recipe} className="h-20 w-20 rounded-full" iconSize={32} />
      <View className="gap-0.5">
        <AppText variant="heading" size="base" className="leading-5" numberOfLines={3}>
          {recipe.title}
        </AppText>
        <AppText variant="caption" size="xs" className="font-semibold">
          From {recipe.fromMonths} months
        </AppText>
      </View>
    </Pressable>
  );
}

export type FoodsToTryProps = {
  babyName: string | null;
  recipes: Recipe[];
  /** True before 6 months: these are first foods to read about, not to offer yet. */
  readAhead: boolean;
};

/** "Foods to try today": baby meals for the baby's age, changing every day. */
export function FoodsToTry({ babyName, recipes, readAhead }: FoodsToTryProps) {
  if (!recipes.length) return null;
  const who = babyName ?? 'your baby';
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-5">
        <View className="flex-1">
          <AppText variant="heading" size="2xl">
            {readAhead ? 'First foods to look forward to' : 'Foods to try today'}
          </AppText>
          <AppText variant="caption" size="sm">
            {readAhead
              ? 'Solids usually start around 6 months. Read ahead for now.'
              : `Meals that fit ${who}'s age`}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="See all baby recipes"
          onPress={() => router.navigate('/baby')}
          hitSlop={8}
          className="min-h-11 flex-row items-center justify-center pl-3 active:opacity-60"
        >
          <AppText variant="label" color="muted" className="font-bold">
            See all ›
          </AppText>
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        decelerationRate="fast"
        snapToInterval={CARD_WIDTH + 12}
        contentContainerClassName="gap-3 px-5 pb-1"
      >
        {recipes.map((r) => (
          <FoodCard key={r.id} recipe={r} />
        ))}
      </ScrollView>
    </View>
  );
}
