import type { EnergyLevel, Recipe, RecipeTag } from '@/content/recipes';

import type { Allergen, CookingTime, Diet } from './profile';

export type RecipeFilters = {
  categoryId?: string | null;
  /** Every selected tag must be present. */
  tags?: RecipeTag[];
  /** Only show recipes needing at most this much energy. */
  maxEnergy?: EnergyLevel | null;
};

export type Household = {
  allergens: Allergen[];
  diets: Diet[];
  cookingTime: CookingTime;
};

const energyRank: Record<EnergyLevel, number> = { low: 0, medium: 1, high: 2 };

/** Safe for this household: contains none of its allergens and suits every diet it follows. */
export function suitsHousehold(
  recipe: Recipe,
  household: Pick<Household, 'allergens' | 'diets'>,
): boolean {
  if (recipe.allergens.some((a) => household.allergens.includes(a))) return false;
  return household.diets.every((d) => recipe.diets.includes(d));
}

/** Whether the hands-on time fits the time the user said they usually have. */
export function fitsCookingTime(recipe: Recipe, cookingTime: CookingTime): boolean {
  switch (cookingTime) {
    case 'minimal':
      return recipe.activeMinutes <= 5;
    case 'short':
      return recipe.activeMinutes <= 15;
    default:
      return true;
  }
}

export function matchesFilters(recipe: Recipe, filters: RecipeFilters): boolean {
  if (filters.categoryId && !recipe.categories.includes(filters.categoryId)) return false;
  if (filters.tags?.some((t) => !recipe.tags.includes(t))) return false;
  if (filters.maxEnergy && energyRank[recipe.energy] > energyRank[filters.maxEnergy]) return false;
  return true;
}

export type RecipeResults = {
  recipes: Recipe[];
  /** Matching recipes hidden because of the household's allergies or diets. */
  hiddenForSafety: number;
};

/**
 * Recipes to show: matching the filters, never containing a household allergen,
 * suiting the household's diets, with ones that fit their usual cooking time first.
 */
export function findRecipes(
  all: Recipe[],
  household: Household,
  filters: RecipeFilters = {},
): RecipeResults {
  const matching = all.filter((r) => matchesFilters(r, filters));
  const safe = matching.filter((r) => suitsHousehold(r, household));
  const sorted = [...safe].sort((a, b) => {
    const fitA = fitsCookingTime(a, household.cookingTime) ? 0 : 1;
    const fitB = fitsCookingTime(b, household.cookingTime) ? 0 : 1;
    return fitA - fitB || a.activeMinutes - b.activeMinutes || a.title.localeCompare(b.title);
  });
  return { recipes: sorted, hiddenForSafety: matching.length - safe.length };
}

/** "5 min" / "1 hr 10 min" for display. */
export function formatMinutes(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h} hr ${m} min` : `${h} hr`;
}
