import type { Food, FoodCategory } from '@/content/foods';

import type { IsoDate } from './dates';
import type { FoodLogEntry } from './food-log';

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

/**
 * Latest date a food shows up in the log, matching its name as a whole word
 * (so "Pear" matches "pear puree" but "Pea" doesn't match "peach").
 */
export function foodTriedOn(entries: FoodLogEntry[], food: Pick<Food, 'name'>): IsoDate | null {
  const name = food.name.toLowerCase();
  const singular = name.endsWith('ies')
    ? `${name.slice(0, -3)}y`
    : name.endsWith('s')
      ? name.slice(0, -1)
      : name;
  const pattern = new RegExp(`\\b(${escapeRegExp(name)}|${escapeRegExp(singular)})\\b`, 'i');
  let latest: IsoDate | null = null;
  for (const e of entries) {
    if (pattern.test(e.food) && (latest === null || e.date > latest)) latest = e.date;
  }
  return latest;
}

/** Whether a logged reaction mentions this food. */
export function foodHadReaction(entries: FoodLogEntry[], food: Pick<Food, 'name'>): boolean {
  return entries.some((e) => e.reaction !== 'none' && foodTriedOn([e], food) !== null);
}
