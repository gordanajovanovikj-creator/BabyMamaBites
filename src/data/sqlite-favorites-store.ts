import type { SQLiteDatabase } from 'expo-sqlite';

import type { FavoritesStore } from './favorites-store';

export function createSqliteFavoritesStore(db: SQLiteDatabase): FavoritesStore {
  return {
    async list() {
      const rows = await db.getAllAsync<{ recipe_id: string }>(
        'SELECT recipe_id FROM favorite_recipe ORDER BY created_at DESC',
      );
      return rows.map((r) => r.recipe_id);
    },
    async add(recipeId) {
      await db.runAsync(
        'INSERT OR IGNORE INTO favorite_recipe (recipe_id, created_at) VALUES (?, ?)',
        recipeId,
        new Date().toISOString(),
      );
    },
    async remove(recipeId) {
      await db.runAsync('DELETE FROM favorite_recipe WHERE recipe_id = ?', recipeId);
    },
  };
}
