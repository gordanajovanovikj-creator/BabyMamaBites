/** Saved ("hearted") recipes. SQLite on devices; localStorage in the web preview. */
export type FavoritesStore = {
  /** Recipe ids, most recently saved first. */
  list(): Promise<string[]>;
  add(recipeId: string): Promise<void>;
  remove(recipeId: string): Promise<void>;
};
