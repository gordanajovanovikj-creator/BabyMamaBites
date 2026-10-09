import type { SQLiteDatabase } from 'expo-sqlite';

import { freezerItemSchema, normalizePlan, type FreezerItem } from '@/domain/planner';

import type { PlannerStore } from './planner-store';

type FreezerRow = { id: string; name: string; cubes: number; frozen_on: string };

export function createSqlitePlannerStore(db: SQLiteDatabase): PlannerStore {
  return {
    async loadPlan() {
      const rows = await db.getAllAsync<{ date: string; slot: string; recipe_id: string }>(
        'SELECT date, slot, recipe_id FROM meal_slot',
      );
      return normalizePlan(
        Object.fromEntries(rows.map((r) => [`${r.date}|${r.slot}`, r.recipe_id])),
      );
    },
    async setMeal(date, slot, recipeId) {
      if (recipeId === null) {
        await db.runAsync('DELETE FROM meal_slot WHERE date = ? AND slot = ?', date, slot);
        return;
      }
      await db.runAsync(
        `INSERT INTO meal_slot (date, slot, recipe_id, updated_at) VALUES (?, ?, ?, ?)
         ON CONFLICT(date, slot) DO UPDATE SET recipe_id = excluded.recipe_id, updated_at = excluded.updated_at`,
        date,
        slot,
        recipeId,
        new Date().toISOString(),
      );
    },
    async listFreezer() {
      const rows = await db.getAllAsync<FreezerRow>(
        'SELECT id, name, cubes, frozen_on FROM freezer_item',
      );
      return rows.flatMap((r) => {
        const parsed = freezerItemSchema.safeParse({
          id: r.id,
          name: r.name,
          cubes: r.cubes,
          frozenOn: r.frozen_on,
        });
        return parsed.success ? [parsed.data] : [];
      });
    },
    async saveFreezerItem(item: FreezerItem) {
      await db.runAsync(
        `INSERT INTO freezer_item (id, name, cubes, frozen_on, created_at) VALUES (?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET name = excluded.name, cubes = excluded.cubes, frozen_on = excluded.frozen_on`,
        item.id,
        item.name,
        item.cubes,
        item.frozenOn,
        new Date().toISOString(),
      );
    },
    async removeFreezerItem(id) {
      await db.runAsync('DELETE FROM freezer_item WHERE id = ?', id);
    },
  };
}
