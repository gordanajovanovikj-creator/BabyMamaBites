import type { Food, FoodCategory } from '@/content/foods';
import type { Recipe } from '@/content/recipes';

import type { IsoDate } from './dates';
import type { FoodLogEntry } from './food-log';
import type { Allergen } from './profile';

/** Foods matching a search (name, case-insensitive) and an optional category, A to Z. */
export function filterFoods(foods: Food[], query: string, category: FoodCategory | null): Food[] {
  const q = query.trim().toLowerCase();
  return foods
    .filter((f) => (category ? f.category === category : true))
    .filter((f) => (q ? f.name.toLowerCase().includes(q) : true))
    .sort((a, b) => a.name.localeCompare(b.name));
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

type FoodWords = Pick<Food, 'name' | 'alsoMatches'>;

/** Singular and plural forms of a food word ("Strawberries" ↔ "strawberry", "Egg" ↔ "eggs"). */
function wordForms(word: string): string[] {
  const w = word.toLowerCase();
  if (w.endsWith('ies')) return [w, `${w.slice(0, -3)}y`];
  if (w.endsWith('es') && /(ch|sh|x|o)es$/.test(w)) return [w, w.slice(0, -2)];
  if (w.endsWith('s')) return [w, w.slice(0, -1)];
  if (w.endsWith('y')) return [w, `${w.slice(0, -1)}ies`];
  if (/(ch|sh|x|o)$/.test(w)) return [w, `${w}es`];
  return [w, `${w}s`];
}

/**
 * Matches a food's name (or another word for it) as a whole word, so "Pear"
 * matches "pear puree" but "Peas" doesn't match "peach".
 */
export function foodPattern(food: FoodWords): RegExp {
  const forms = [food.name, ...(food.alsoMatches ?? [])].flatMap(wordForms).map(escapeRegExp);
  return new RegExp(`\\b(${forms.join('|')})\\b`, 'i');
}

/** Latest date a food shows up in the log, or null. */
export function foodTriedOn(entries: FoodLogEntry[], food: FoodWords): IsoDate | null {
  const pattern = foodPattern(food);
  let latest: IsoDate | null = null;
  for (const e of entries) {
    if (pattern.test(e.food) && (latest === null || e.date > latest)) latest = e.date;
  }
  return latest;
}

/** Recipes that use a food (title or ingredients), youngest age first. */
export function recipesWithFood(recipes: Recipe[], food: FoodWords): Recipe[] {
  const pattern = foodPattern(food);
  return recipes
    .filter((r) => pattern.test(r.title) || r.ingredients.some((i) => pattern.test(i)))
    .sort((a, b) => (a.fromMonths ?? 0) - (b.fromMonths ?? 0));
}

/** Whether a logged reaction mentions this food. */
export function foodHadReaction(entries: FoodLogEntry[], food: FoodWords): boolean {
  return entries.some((e) => e.reaction !== 'none' && foodTriedOn([e], food) !== null);
}

/** Foods safe for a household: none of the allergens it avoids. */
export function foodsForHousehold(foods: Food[], avoid: readonly Allergen[]): Food[] {
  return foods.filter((f) => !f.allergen || !avoid.includes(f.allergen));
}

/** Food counts worth a small celebration on the Foods tab. */
export const FOOD_MILESTONES = [1, 5, 10, 20, 30] as const;

export type FoodProgress = {
  tried: number;
  total: number;
  /** The last milestone reached, or `total` once every food has been tried. */
  milestone: number | null;
  /** How many more foods until the next milestone (null when all are tried). */
  toNext: number | null;
  byCategory: { category: FoodCategory; tried: number; total: number }[];
};

/** How many of the guide's foods the baby has tried, overall and per category. */
export function foodProgress(entries: FoodLogEntry[], all: Food[]): FoodProgress {
  const triedIds = new Set(all.filter((f) => foodTriedOn(entries, f) !== null).map((f) => f.id));
  const tried = triedIds.size;
  const total = all.length;
  const reached = FOOD_MILESTONES.filter((m) => m <= tried && m < total);
  const next = FOOD_MILESTONES.find((m) => m > tried && m < total) ?? total;
  const categories = [...new Set(all.map((f) => f.category))];
  return {
    tried,
    total,
    milestone: tried === total && total > 0 ? total : (reached.at(-1) ?? null),
    toNext: tried >= total ? null : next - tried,
    byCategory: categories.map((category) => {
      const inCategory = all.filter((f) => f.category === category);
      return {
        category,
        tried: inCategory.filter((f) => triedIds.has(f.id)).length,
        total: inCategory.length,
      };
    }),
  };
}
