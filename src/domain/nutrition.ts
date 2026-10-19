import type { Nutrients } from '@/content/recipe-nutrition';

export type NutritionRow = { label: string; value: string };

function grams(n: number): string {
  return n < 10 ? `${Math.round(n * 10) / 10} g` : `${Math.round(n)} g`;
}

function mg(n: number): string {
  return n < 10 ? `${Math.round(n * 10) / 10} mg` : `${Math.round(n)} mg`;
}

/**
 * The rows to show for a recipe's estimated nutrition per serving. Grown-up recipes show
 * the usual panel; baby recipes show iron, protein and sodium only (US pediatric guidance
 * doesn't ask parents to count a baby's calories, and iron matters most from 6 months).
 */
export function nutritionRows(n: Nutrients, forBaby: boolean): NutritionRow[] {
  if (forBaby) {
    return [
      { label: 'Iron', value: mg(n.ironMg) },
      { label: 'Protein', value: grams(n.proteinG) },
      { label: 'Sodium', value: mg(n.sodiumMg) },
    ];
  }
  return [
    { label: 'Calories', value: `${Math.round(n.kcal)}` },
    { label: 'Protein', value: grams(n.proteinG) },
    { label: 'Carbs', value: grams(n.carbsG) },
    { label: 'Fiber', value: grams(n.fiberG) },
    { label: 'Fat', value: grams(n.fatG) },
    { label: 'Sodium', value: mg(n.sodiumMg) },
  ];
}
