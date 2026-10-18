import type { Food } from '@/content/foods';
import type { Recipe } from '@/content/recipes';

import type { LibraryItem } from './library';
import { normalize } from './search';

/** How a filtered list is ordered. */
export type SortOrder = 'recommended' | 'newest' | 'a-z' | 'z-a';

export const sortLabels: Record<SortOrder, string> = {
  recommended: 'Recommended',
  newest: 'Recently added',
  'a-z': 'Alphabetical (A-Z)',
  'z-a': 'Alphabetical (Z-A)',
};

/** One "Age" chip in the filter sheet: a range of baby ages in months, inclusive. */
export type AgeRange = { id: string; label: string; from: number; to: number };

/** Everything a person can pick in the filter sheet. Empty lists mean "no filter". */
export type ListFilters = {
  sort: SortOrder;
  ageId: string | null;
  /** Show items in any of these categories (food type, recipe type, topic). */
  categories: string[];
  /** Hide items containing any of these allergens. */
  excludeAllergens: string[];
  /** Foods only: whether the baby has tried it, from the food log. */
  tried: 'tried' | 'not-tried' | null;
  /** Every checked option must hold (e.g. iron-rich, freezer-friendly). */
  flags: string[];
};

export const NO_FILTERS: ListFilters = {
  sort: 'recommended',
  ageId: null,
  categories: [],
  excludeAllergens: [],
  tried: null,
  flags: [],
};

/** What the filters need to know about one item. */
export type FilterFacts = {
  title: string;
  /** Position in its content file; later entries are newer. */
  added: number;
  fromMonths?: number;
  /** Set for articles, which cover a range of ages. */
  toMonths?: number;
  categories: readonly string[];
  allergens: readonly string[];
  flags: readonly string[];
  tried?: boolean;
};

/** How many filters are switched on (sort order not counted), for the badge on the filter button. */
export function activeFilterCount(filters: ListFilters): number {
  return (
    (filters.ageId ? 1 : 0) +
    filters.categories.length +
    filters.excludeAllergens.length +
    (filters.tried ? 1 : 0) +
    filters.flags.length
  );
}

/** True when the list should switch from its browsing sections to one filtered, sorted grid. */
export function filtersChangeList(filters: ListFilters): boolean {
  return activeFilterCount(filters) > 0 || filters.sort !== 'recommended';
}

/**
 * Whether an item fits an age chip. Recipes fit the chip their starting age falls in
 * ("From 9 months" is under 9 months); articles fit any chip their age range overlaps.
 */
export function fitsAge(facts: Pick<FilterFacts, 'fromMonths' | 'toMonths'>, range: AgeRange) {
  if (facts.fromMonths === undefined) return false;
  if (facts.toMonths === undefined) return facts.fromMonths >= range.from && facts.fromMonths <= range.to;
  return facts.fromMonths <= range.to && facts.toMonths >= range.from;
}

/** Toggles a value in a list of picks (a chip or checkbox in the sheet). */
export function toggled<T>(list: readonly T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

/**
 * The items that pass every filter, in the chosen order. "Recommended" keeps the order
 * the list already has (each screen's own best-first order).
 */
export function applyFilters<T>(
  items: readonly T[],
  filters: ListFilters,
  factsOf: (item: T) => FilterFacts,
  ages: readonly AgeRange[] = [],
): T[] {
  const age = ages.find((a) => a.id === filters.ageId);
  const kept = items
    .map((item) => ({ item, facts: factsOf(item) }))
    .filter(({ facts }) => {
      if (age && !fitsAge(facts, age)) return false;
      if (filters.categories.length && !filters.categories.some((c) => facts.categories.includes(c)))
        return false;
      if (filters.excludeAllergens.some((a) => facts.allergens.includes(a))) return false;
      if (filters.tried === 'tried' && !facts.tried) return false;
      if (filters.tried === 'not-tried' && facts.tried) return false;
      return filters.flags.every((f) => facts.flags.includes(f));
    });
  const byTitle = (a: FilterFacts, b: FilterFacts) =>
    normalize(a.title).localeCompare(normalize(b.title));
  switch (filters.sort) {
    case 'newest':
      kept.sort((a, b) => b.facts.added - a.facts.added);
      break;
    case 'a-z':
      kept.sort((a, b) => byTitle(a.facts, b.facts));
      break;
    case 'z-a':
      kept.sort((a, b) => byTitle(b.facts, a.facts));
      break;
    default:
      break;
  }
  return kept.map(({ item }) => item);
}

/** Position of each item in its content file, so "Recently added" can put the newest first. */
function addedOrder(all: readonly { id: string }[]): (id: string) => number {
  const order = new Map(all.map((x, i) => [x.id, i]));
  return (id) => order.get(id) ?? 0;
}

/** Filter facts for recipes; `all` is the recipe file, in the order recipes were added. */
export function recipeFacts(all: readonly Recipe[]): (recipe: Recipe) => FilterFacts {
  const added = addedOrder(all);
  return (r) => ({
    title: r.title,
    added: added(r.id),
    fromMonths: r.fromMonths,
    categories: r.categories,
    allergens: r.allergens,
    flags: r.tags,
  });
}

/** Filter facts for foods; `tried` reads the food log. */
export function foodFacts(
  all: readonly Food[],
  tried: (food: Food) => boolean,
): (food: Food) => FilterFacts {
  const added = addedOrder(all);
  return (f) => ({
    title: f.name,
    added: added(f.id),
    fromMonths: f.fromMonths,
    categories: [f.category],
    allergens: f.allergen ? [f.allergen] : [],
    flags: f.ironRich ? ['iron-rich'] : [],
    tried: tried(f),
  });
}

/** Filter facts for articles and tips, which cover a range of ages. */
export function libraryFacts(all: readonly LibraryItem[]): (item: LibraryItem) => FilterFacts {
  const order = new Map(all.map((x, i) => [x, i]));
  return (i) => ({
    title: i.title,
    added: order.get(i) ?? 0,
    fromMonths: i.fromMonths,
    toMonths: i.toMonths,
    categories: [i.category],
    allergens: [],
    flags: [],
  });
}
