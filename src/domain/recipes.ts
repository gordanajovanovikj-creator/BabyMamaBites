import type { EnergyLevel, Recipe, RecipeTag } from '@/content/recipes';

import { daysBetween, type IsoDate } from './dates';
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

export type RecipeSection<C> = { category: C; recipes: Recipe[] };

/**
 * One section per category (in the given order) with the household-safe recipes
 * in it, best fit first. Empty categories are left out.
 */
export function recipeSections<C extends { id: string }>(
  categories: C[],
  all: Recipe[],
  household: Household,
  perSection = 10,
): RecipeSection<C>[] {
  // So the page feels varied, each section leads with a recipe that hasn't led an earlier one.
  const leads = new Set<string>();
  return categories
    .map((category) => {
      const found = findRecipes(all, household, { categoryId: category.id }).recipes;
      const leadIndex = found.findIndex((r) => !leads.has(r.id));
      const ordered =
        leadIndex > 0
          ? [found[leadIndex], ...found.slice(0, leadIndex), ...found.slice(leadIndex + 1)]
          : found;
      if (ordered[0]) leads.add(ordered[0].id);
      return { category, recipes: ordered.slice(0, perSection) };
    })
    .filter((s) => s.recipes.length > 0);
}

const mealKickers: [string, string][] = [
  ['breakfast', 'Breakfast'],
  ['lunch', 'Lunch'],
  ['dinner', 'Dinner'],
  ['snack-smart', 'Snack'],
  ['nourish-while-nursing', 'Drink & snack'],
];

/** Short label shown above a recipe title, e.g. "Breakfast", "Snack" or "From 9 months". */
export function recipeKicker(recipe: Recipe): string {
  if (recipe.fromMonths !== undefined) return `From ${recipe.fromMonths} months`;
  for (const [category, label] of mealKickers) {
    if (recipe.categories.includes(category)) return label;
  }
  return 'Recipe';
}

/** "25 min · Serves 4" */
export function recipeMeta(recipe: Recipe): string {
  return `${formatMinutes(recipe.totalMinutes)} · Serves ${recipe.servings}`;
}

/** "Prep 10 min · Cook 15 min · Serves 4" (cook time is everything that isn't hands-on). */
export function recipeTimings(recipe: Recipe): string {
  const cook = Math.max(0, recipe.totalMinutes - recipe.activeMinutes);
  return `Prep ${formatMinutes(recipe.activeMinutes)} · Cook ${cook ? formatMinutes(cook) : '0 min'} · Serves ${recipe.servings}`;
}

/**
 * Baby age-group collections, the one matching the baby's age first, then the rest in
 * age order. `current` is the id of the group the baby is in now (null before 6 months).
 */
export function babyCollectionsFor<C extends { id: string; fromMonths?: number }>(
  categories: C[],
  ageMonths: number,
): { ordered: C[]; current: string | null } {
  const byAge = [...categories].sort((a, b) => (a.fromMonths ?? 0) - (b.fromMonths ?? 0));
  const reached = byAge.filter((c) => (c.fromMonths ?? 0) <= ageMonths);
  const current = reached.at(-1)?.id ?? null;
  const ordered = current
    ? [byAge.find((c) => c.id === current)!, ...byAge.filter((c) => c.id !== current)]
    : byAge;
  return { ordered, current };
}

/** Whether a baby recipe is meant for an older baby than this one. */
export function isAheadOfAge(recipe: Recipe, ageMonths: number): boolean {
  return recipe.fromMonths !== undefined && recipe.fromMonths > ageMonths;
}

/**
 * The grown-up recipe paired with a baby recipe, if it suits the household's
 * allergies and diets (otherwise null, so we never suggest an unsafe meal).
 */
export function familyMealFor(
  babyRecipe: Recipe,
  all: Recipe[],
  household: Pick<Household, 'allergens' | 'diets'>,
): { recipe: Recipe; note: string } | null {
  if (!babyRecipe.familyMeal) return null;
  const recipe = all.find((r) => r.id === babyRecipe.familyMeal?.recipeId);
  if (!recipe || !suitsHousehold(recipe, household)) return null;
  return { recipe, note: babyRecipe.familyMeal.note };
}

const ROTATION_EPOCH = '2026-01-01';
/** First foods are offered from about 6 months (AAP/CDC). */
export const SOLIDS_START_MONTHS = 6;

/**
 * "Foods to try today" on Today: baby meals for the baby's age that suit the household.
 * Meals from the baby's current age group come first (rotated daily so the row changes
 * without being random), then earlier, simpler textures. Before 6 months it returns the
 * first-purees group to read ahead, never anything younger.
 */
export function foodsToTryToday(
  all: Recipe[],
  ageMonths: number,
  household: Pick<Household, 'allergens' | 'diets'>,
  onDate: IsoDate,
  count = 6,
): { recipes: Recipe[]; readAhead: boolean } {
  const readAhead = ageMonths < SOLIDS_START_MONTHS;
  const age = readAhead ? SOLIDS_START_MONTHS : ageMonths;
  const eligible = all
    .filter((r) => r.fromMonths !== undefined && r.fromMonths <= age)
    .filter((r) => suitsHousehold(r, household))
    .sort((a, b) => (b.fromMonths ?? 0) - (a.fromMonths ?? 0) || a.id.localeCompare(b.id));
  if (!eligible.length) return { recipes: [], readAhead };
  const newest = eligible[0].fromMonths;
  const current = eligible.filter((r) => r.fromMonths === newest);
  const earlier = eligible.filter((r) => r.fromMonths !== newest);
  const day = daysBetween(ROTATION_EPOCH, onDate);
  const rotate = (list: Recipe[]) => {
    const offset = ((day % list.length) + list.length) % list.length;
    return [...list.slice(offset), ...list.slice(0, offset)];
  };
  return {
    recipes: [...rotate(current), ...(earlier.length ? rotate(earlier) : [])].slice(0, count),
    readAhead,
  };
}
