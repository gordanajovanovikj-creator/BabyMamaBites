import { router } from 'expo-router';
import { Pressable, ScrollView, View } from 'react-native';

import type { Recipe, RecipeCategory } from '@/content/recipes';
import { AppText } from '@/ui';

import { RECIPE_TILE_WIDTH, RecipeTile } from './recipe-tile';

/** A category heading with "See all", then a horizontal row of large recipe tiles. */
export function RecipeSection({
  category,
  recipes,
  subtitle,
}: {
  category: RecipeCategory;
  recipes: Recipe[];
  /** Small line under the heading, e.g. "For Mila now · from 6 months". */
  subtitle?: string;
}) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center justify-between px-5">
        <View className="flex-1">
          <AppText variant="heading" size="2xl">
            {category.label}
          </AppText>
          {subtitle ? (
            <AppText variant="caption" size="sm">
              {subtitle}
            </AppText>
          ) : null}
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`See all ${category.label} recipes`}
          onPress={() => router.push({ pathname: '/category/[id]', params: { id: category.id } })}
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
        snapToInterval={RECIPE_TILE_WIDTH + 16}
        contentContainerClassName="gap-4 px-5"
      >
        {recipes.map((r) => (
          <RecipeTile key={r.id} recipe={r} />
        ))}
      </ScrollView>
    </View>
  );
}
