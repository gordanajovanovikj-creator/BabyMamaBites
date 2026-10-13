import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { recipeMeta } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { RecipeImage } from '@/features/recipes/recipe-image';
import { shadows } from '@/theme/colors';
import { AppText, HeartButton } from '@/ui';

const CARD_WIDTH = 280;
const PHOTO_HEIGHT = 320;

/** Big feature card: a tall photo box with the meal's age, name and time underneath. */
function FeatureCard({ recipe, kicker }: { recipe: Recipe; kicker: string }) {
  const { isFavorite, toggle } = useFavorites();
  return (
    <View style={{ width: CARD_WIDTH }} className="gap-2">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${kicker}: ${recipe.title}. ${recipeMeta(recipe)}. Opens the recipe.`}
        onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
        className="gap-2 active:opacity-90"
      >
        {/* The shadow sits on a wrapper: the rounded photo clips its own edges. */}
        <View className="rounded-xl bg-surface" style={{ boxShadow: shadows.card }}>
          <RecipeImage
            recipe={recipe}
            className="rounded-xl"
            iconSize={96}
            style={{ height: PHOTO_HEIGHT }}
          />
        </View>
        <View className="gap-0.5 pr-2">
          <AppText
            variant="label"
            size="xs"
            color="on-accent"
            className="font-bold uppercase tracking-wider"
          >
            {kicker}
          </AppText>
          <AppText variant="heading" size="xl" numberOfLines={2}>
            {recipe.title}
          </AppText>
          <AppText variant="caption" size="sm">
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
  /** Set when the parent is browsing another month, e.g. "9 months". */
  browsingLabel?: string;
};

/** "Foods to try today": meals for the baby's age, changing every day. Planned meals live in the This week card. */
export function FoodsToTry({ babyName, recipes, readAhead, browsingLabel }: FoodsToTryProps) {
  const who = babyName ?? 'your baby';
  if (!recipes.length) return null;
  const title = browsingLabel
    ? `Foods for ${browsingLabel}`
    : readAhead
      ? 'First foods to look forward to'
      : 'Foods to try today';
  const subtitle = browsingLabel
    ? 'Meals suited to this age'
    : readAhead
      ? 'Solids usually start around 6 months. Read ahead for now.'
      : `Meals that fit ${who}'s age`;
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-5">
        <View className="flex-1">
          <AppText variant="heading" size="2xl">
            {title}
          </AppText>
          <AppText variant="caption" size="sm">
            {subtitle}
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
        // Room above and below so the card shadows aren't clipped.
        contentContainerClassName="gap-3 px-5 pb-4 pt-1"
      >
        {recipes.map((r) => (
          <FeatureCard key={r.id} recipe={r} kicker={`From ${r.fromMonths} months`} />
        ))}
      </ScrollView>
    </View>
  );
}
