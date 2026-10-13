/** Adds a recipe to the front of the saved list, or removes it if already saved. */
export function toggleFavorite(ids: readonly string[], id: string): string[] {
  return ids.includes(id) ? ids.filter((x) => x !== id) : [id, ...ids];
}

// Single foods from the food guide share the favorites list as "food:<id>".
const FOOD_PREFIX = 'food:';

export function foodFavoriteId(foodId: string): string {
  return `${FOOD_PREFIX}${foodId}`;
}

/** Saved food guide ids, most recent first (recipe ids are skipped). */
export function favoriteFoodIds(ids: readonly string[]): string[] {
  return ids.filter((id) => id.startsWith(FOOD_PREFIX)).map((id) => id.slice(FOOD_PREFIX.length));
}
