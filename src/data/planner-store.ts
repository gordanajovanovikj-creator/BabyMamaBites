import type { IsoDate } from '@/domain/dates';
import type { FreezerItem, MealPlan, MealSlot } from '@/domain/planner';

/** Weekly baby menu and freezer inventory. SQLite on devices; localStorage on web. */
export type PlannerStore = {
  loadPlan(): Promise<MealPlan>;
  setMeal(date: IsoDate, slot: MealSlot, recipeId: string | null): Promise<void>;
  listFreezer(): Promise<FreezerItem[]>;
  saveFreezerItem(item: FreezerItem): Promise<void>;
  removeFreezerItem(id: string): Promise<void>;
};
