import type { SQLiteDatabase } from 'expo-sqlite';

import { foodLogEntrySchema, type FoodLogEntry } from '@/domain/food-log';

import type { FoodLogStore } from './food-log-store';

type Row = {
  id: string;
  date: string;
  food: string;
  allergen: string | null;
  is_new: number;
  reaction: string;
  notes: string | null;
};

function fromRow(row: Row): FoodLogEntry | null {
  const result = foodLogEntrySchema.safeParse({
    id: row.id,
    date: row.date,
    food: row.food,
    allergen: row.allergen,
    isNew: row.is_new === 1,
    reaction: row.reaction,
    notes: row.notes,
  });
  return result.success ? result.data : null;
}

export function createSqliteFoodLogStore(db: SQLiteDatabase): FoodLogStore {
  return {
    async list() {
      const rows = await db.getAllAsync<Row>(
        'SELECT id, date, food, allergen, is_new, reaction, notes FROM food_log ORDER BY date DESC, id DESC',
      );
      return rows.map(fromRow).filter((e) => e !== null);
    },
    async add(entry) {
      await db.runAsync(
        `INSERT OR REPLACE INTO food_log (id, date, food, allergen, is_new, reaction, notes, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        entry.id,
        entry.date,
        entry.food,
        entry.allergen,
        entry.isNew ? 1 : 0,
        entry.reaction,
        entry.notes,
        new Date().toISOString(),
      );
    },
    async remove(id) {
      await db.runAsync('DELETE FROM food_log WHERE id = ?', id);
    },
  };
}
