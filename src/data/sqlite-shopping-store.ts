import type { SQLiteDatabase } from 'expo-sqlite';

import { shoppingItemSchema, type ShoppingItem } from '@/domain/shopping';

import type { ShoppingStore } from './shopping-store';

type Row = {
  id: string;
  text: string;
  checked: number;
  aisle: string;
  recipe_title: string | null;
  added_at: string;
};

export function createSqliteShoppingStore(db: SQLiteDatabase): ShoppingStore {
  return {
    async list() {
      const rows = await db.getAllAsync<Row>(
        'SELECT id, text, checked, aisle, recipe_title, added_at FROM shopping_item ORDER BY added_at',
      );
      return rows.flatMap((r) => {
        const parsed = shoppingItemSchema.safeParse({
          id: r.id,
          text: r.text,
          checked: r.checked === 1,
          aisle: r.aisle,
          recipeTitle: r.recipe_title,
          addedAt: r.added_at,
        });
        return parsed.success ? [parsed.data] : [];
      });
    },
    async save(items: ShoppingItem[]) {
      await db.withTransactionAsync(async () => {
        for (const item of items) {
          await db.runAsync(
            `INSERT INTO shopping_item (id, text, checked, aisle, recipe_title, added_at) VALUES (?, ?, ?, ?, ?, ?)
             ON CONFLICT(id) DO UPDATE SET text = excluded.text, checked = excluded.checked, aisle = excluded.aisle`,
            item.id,
            item.text,
            item.checked ? 1 : 0,
            item.aisle,
            item.recipeTitle,
            item.addedAt,
          );
        }
      });
    },
    async remove(ids) {
      if (!ids.length) return;
      await db.runAsync(
        `DELETE FROM shopping_item WHERE id IN (${ids.map(() => '?').join(', ')})`,
        ...ids,
      );
    },
  };
}
