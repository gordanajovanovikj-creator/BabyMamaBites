import type { ShoppingItem } from '@/domain/shopping';

/** The shopping list. SQLite on devices; localStorage in the web preview. */
export type ShoppingStore = {
  list(): Promise<ShoppingItem[]>;
  /** Adds new items or updates existing ones (matched by id). */
  save(items: ShoppingItem[]): Promise<void>;
  remove(ids: string[]): Promise<void>;
};
