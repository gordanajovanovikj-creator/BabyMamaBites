import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { RecipeTile } from '@/features/recipes/recipe-tile';
import { AppText } from '@/ui';

const CARD_WIDTH = 200;

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
          <RecipeTile key={r.id} recipe={r} width={CARD_WIDTH} />
        ))}
      </ScrollView>
    </View>
  );
}
