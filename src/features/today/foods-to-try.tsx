import { Image } from 'expo-image';
import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import type { Food } from '@/content/foods';
import type { Recipe } from '@/content/recipes';
import { recipeMeta } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { foodPhoto } from '@/features/foods/food-photos';
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

/** A planned food the parent typed in: a soft green box in place of a photo. */
function OwnFoodCard({ name, kicker }: { name: string; kicker: string }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${kicker}: ${name}, your own food. Opens the meal planner.`}
      onPress={openPlanner}
      style={{ width: CARD_WIDTH }}
      className="gap-2 active:opacity-90"
    >
      <View
        className="items-center justify-center rounded-xl bg-sky"
        style={{ height: PHOTO_HEIGHT, boxShadow: shadows.card }}
      >
        <AppText style={{ fontSize: 72, lineHeight: 86 }}>🍽️</AppText>
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
          {name}
        </AppText>
        <AppText variant="caption" size="sm">
          Your own food
        </AppText>
      </View>
    </Pressable>
  );
}

/** A planned single food: its white photo, opening the food guide. */
function SingleFoodCard({ food, kicker }: { food: Food; kicker: string }) {
  const photo = foodPhoto(food.id);
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${kicker}: ${food.name}, a single food. Opens the food guide.`}
      onPress={() => router.push({ pathname: '/food/[id]', params: { id: food.id } })}
      style={{ width: CARD_WIDTH }}
      className="gap-2 active:opacity-90"
    >
      <View
        className="items-center justify-center overflow-hidden rounded-xl border border-border bg-surface"
        style={{ height: PHOTO_HEIGHT, boxShadow: shadows.card }}
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {photo ? (
          <Image
            source={photo}
            contentFit="contain"
            style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
          />
        ) : (
          <AppText style={{ fontSize: 72, lineHeight: 86 }}>{food.emoji}</AppText>
        )}
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
          {food.name}
        </AppText>
        <AppText variant="caption" size="sm">
          Single food
        </AppText>
      </View>
    </Pressable>
  );
}

function openPlanner() {
  router.navigate({ pathname: '/baby', params: { tab: 'plan', at: String(Date.now()) } });
}

/** One planned meal for today: a recipe, or a food the parent typed in. */
export type PlannedFood = { label: string } & (
  { recipe: Recipe } | { food: Food } | { own: string }
);

export type FoodsToTryProps = {
  babyName: string | null;
  recipes: Recipe[];
  /** True before 6 months: these are first foods to read about, not to offer yet. */
  readAhead: boolean;
  /** Today's meals from the planner. When there are any, they replace the suggestions. */
  planned?: PlannedFood[];
  /** Set when the parent is browsing another month, e.g. "9 months". */
  browsingLabel?: string;
};

/**
 * Today's baby food: the meals planned for today if there are any, otherwise
 * "Foods to try today" (meals for the baby's age, changing every day).
 */
export function FoodsToTry({
  babyName,
  recipes,
  readAhead,
  planned = [],
  browsingLabel,
}: FoodsToTryProps) {
  const who = babyName ?? 'your baby';
  const hasPlan = planned.length > 0;
  const cards: PlannedFood[] = hasPlan
    ? planned
    : recipes.map((r) => ({ label: `From ${r.fromMonths} months`, recipe: r }));
  if (!cards.length) return null;
  const title = hasPlan
    ? 'Your food for today'
    : browsingLabel
      ? `Foods for ${browsingLabel}`
      : readAhead
        ? 'First foods to look forward to'
        : 'Foods to try today';
  const subtitle = hasPlan
    ? `What you planned for ${who}`
    : browsingLabel
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
          accessibilityLabel={hasPlan ? 'Open the meal planner' : 'See all baby recipes'}
          onPress={() =>
            hasPlan
              ? router.navigate({
                  pathname: '/baby',
                  params: { tab: 'plan', at: String(Date.now()) },
                })
              : router.navigate('/baby')
          }
          hitSlop={8}
          className="min-h-11 flex-row items-center justify-center pl-3 active:opacity-60"
        >
          <AppText variant="label" color="muted" className="font-bold">
            {hasPlan ? 'Plan ›' : 'See all ›'}
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
        {cards.map((c) =>
          'recipe' in c ? (
            <FeatureCard key={`${c.label}-${c.recipe.id}`} recipe={c.recipe} kicker={c.label} />
          ) : 'food' in c ? (
            <SingleFoodCard key={`${c.label}-${c.food.id}`} food={c.food} kicker={c.label} />
          ) : (
            <OwnFoodCard key={`${c.label}-${c.own}`} name={c.own} kicker={c.label} />
          ),
        )}
      </ScrollView>
    </View>
  );
}
