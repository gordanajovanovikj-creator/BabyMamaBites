import { View } from 'react-native';

import { babyRecipeCategories, type Recipe } from '@/content/recipes';
import { nutritionFor, nutritionSource } from '@/content/recipe-nutrition';
import { nutritionRows } from '@/domain/nutrition';
import { AppText, cn } from '@/ui';

/** Themed baby collections (like "One pot for family and baby") hold family meals. */
const familyCategories = new Set(babyRecipeCategories.filter((c) => c.theme).map((c) => c.id));

/** Estimated nutrition per serving, from USDA data. Nothing shows if it hasn't been calculated. */
export function NutritionCard({ recipe }: { recipe: Recipe }) {
  const nutrients = nutritionFor(recipe.id);
  if (!nutrients) return null;
  const family = recipe.categories.some((c) => familyCategories.has(c));
  // Baby portions show iron, protein and sodium; family meals show the full panel.
  const forBaby = recipe.fromMonths !== undefined && !family;
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
