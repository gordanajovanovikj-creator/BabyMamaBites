import { View } from 'react-native';

import { babyRecipes, type Recipe } from '@/content/recipes';
import { nutritionFor, nutritionSource } from '@/content/recipe-nutrition';
import { nutritionRows } from '@/domain/nutrition';
import { AppText, cn } from '@/ui';

const babyRecipeIds = new Set(babyRecipes.map((r) => r.id));

/** Estimated nutrition per serving, from USDA data. Nothing shows if it hasn't been calculated. */
export function NutritionCard({ recipe }: { recipe: Recipe }) {
  const nutrients = nutritionFor(recipe.id);
  if (!nutrients) return null;
  // Baby recipes show iron, protein and sodium for one baby portion. Family meals with a
  // baby portion (the one-pot recipes on the Mom tab) and grown-up recipes show the full panel.
  const forBaby = babyRecipeIds.has(recipe.id);
  const family = !forBaby && recipe.fromMonths !== undefined;
  const rows = nutritionRows(nutrients, forBaby);
  return (
    <View className="gap-3 rounded-3xl border border-border bg-surface p-5">
      <View className="gap-0.5">
        <AppText variant="heading" accessibilityRole="header">
          Nutrition per serving
        </AppText>
        <AppText variant="caption" size="sm">
          {forBaby
            ? 'Estimated, for one baby portion'
            : family
              ? 'Estimated, for one family serving'
              : 'Estimated'}
        </AppText>
      </View>
      <View className="flex-row flex-wrap">
        {rows.map((r, i) => (
          <View
            key={r.label}
            className={cn('w-1/3 gap-0.5 py-2', i % 3 !== 0 && 'border-l border-border pl-3')}
            accessible
            accessibilityLabel={`${r.label}: ${r.value}`}
          >
            <AppText variant="heading" size="lg">
              {r.value}
            </AppText>
            <AppText variant="caption" size="sm">
              {r.label}
            </AppText>
          </View>
        ))}
      </View>
      <AppText variant="caption" size="xs">
        {`Calculated from ${nutritionSource}. Amounts vary with brands and portion sizes. For general information only.`}
      </AppText>
    </View>
  );
}
