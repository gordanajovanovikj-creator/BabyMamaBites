import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { recipeMeta } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { RecipeImage } from '@/features/recipes/recipe-image';
import { AppText, HeartButton } from '@/ui';

const CARD_WIDTH = 280;
const CARD_HEIGHT = 360;

/** Big feature card: the photo fills the card, with the meal's name on a soft dark band. */
function FeatureCard({ recipe }: { recipe: Recipe }) {
  const { isFavorite, toggle } = useFavorites();
  return (
    <View style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${recipe.title}, from ${recipe.fromMonths} months. ${recipeMeta(recipe)}. Opens the recipe.`}
        onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
        className="flex-1 overflow-hidden rounded-xl active:opacity-90"
      >
        <RecipeImage
          recipe={recipe}
          className="absolute bottom-0 left-0 right-0 top-0"
          iconSize={96}
        />
        <View className="absolute bottom-0 left-0 right-0 gap-0.5 px-4 pb-4 pt-6">
          <View className="absolute bottom-0 left-0 right-0 top-0 bg-ink opacity-50" />
          <AppText variant="caption" size="sm" color="on-primary" className="font-semibold">
            From {recipe.fromMonths} months
          </AppText>
          <AppText variant="heading" size="xl" color="on-primary" numberOfLines={2}>
            {recipe.title}
          </AppText>
          <AppText variant="caption" size="sm" color="on-primary">
            {recipeMeta(recipe)}
          </AppText>
        </View>
      </Pressable>
      <HeartButton
        saved={isFavorite(recipe.id)}
        onPress={() => toggle(recipe.id)}
        label={recipe.title}
        className="absolute right-3 top-3"
      />
    </View>
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
          <FeatureCard key={r.id} recipe={r} />
        ))}
      </ScrollView>
    </View>
  );
}
