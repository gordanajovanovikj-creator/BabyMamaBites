import type { FoodLogEntry } from '@/domain/food-log';

/** Foods the baby has tried. SQLite on devices; localStorage in the web preview. */
export type FoodLogStore = {
  list(): Promise<FoodLogEntry[]>;
  add(entry: FoodLogEntry): Promise<void>;
  remove(id: string): Promise<void>;
};
