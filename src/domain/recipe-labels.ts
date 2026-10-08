import type { EnergyLevel, RecipeTag } from '@/content/recipes';

export const recipeTagLabels: Record<RecipeTag, string> = {
  'five-minute': '5-minute',
  'one-handed': 'One-handed',
  'no-cook': 'No-cook',
  'batch-cook': 'Batch cook',
  'freezer-friendly': 'Freezer-friendly',
};

export const energyLabels: Record<EnergyLevel, string> = {
  low: 'Low energy',
  medium: 'Some energy',
  high: 'More energy',
};
