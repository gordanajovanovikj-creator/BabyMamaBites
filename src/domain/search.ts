import type { Recipe } from '@/content/recipes';

import type { LibraryItem } from './library';

/** Lowercase, strip accents and punctuation so "Purée," matches "puree". */
export function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function words(query: string): string[] {
  return normalize(query).split(' ').filter(Boolean);
}

/** True when every word of the query appears somewhere in the fields (any order). */
export function matchesQuery(fields: string[], query: string): boolean {
  const terms = words(query);
  if (!terms.length) return true;
  const haystack = ` ${normalize(fields.join(' '))}`;
  return terms.every((t) => haystack.includes(` ${t}`));
}

/**
 * Recipes matching the query by title, summary or ingredients, title matches first.
 * Keeps the input order otherwise, so household sorting and safety filtering still apply.
 */
export function searchRecipes(list: Recipe[], query: string): Recipe[] {
  if (!words(query).length) return [];
  const byTitle = list.filter((r) => matchesQuery([r.title], query));
  const rest = list.filter(
    (r) => !byTitle.includes(r) && matchesQuery([r.title, r.summary, ...r.ingredients], query),
  );
  return [...byTitle, ...rest];
}

/** Library items matching the query by title, summary or category name; title matches first. */
export function searchLibrary(
  items: LibraryItem[],
  query: string,
  categoryLabel: (id: string) => string = () => '',
): LibraryItem[] {
  if (!words(query).length) return [];
  const byTitle = items.filter((i) => matchesQuery([i.title], query));
  const rest = items.filter(
    (i) =>
      !byTitle.includes(i) && matchesQuery([i.title, i.summary, categoryLabel(i.category)], query),
  );
  return [...byTitle, ...rest];
}
