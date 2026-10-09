import { z } from 'zod';

import { addDays, addMonths, daysBetween, fromIsoDate, isIsoDate, type IsoDate } from './dates';

/** Monday of the week containing `date`. */
export function weekStart(date: IsoDate): IsoDate {
  const weekday = fromIsoDate(date).getDay(); // 0 = Sunday
  return addDays(date, weekday === 0 ? -6 : 1 - weekday);
}

/** The seven dates of the week starting on `monday`. */
export function weekDates(monday: IsoDate): IsoDate[] {
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}

/** "Mon 12" style label for a planner row. */
export function dayLabel(date: IsoDate): { weekday: string; day: string } {
  const d = fromIsoDate(date);
  return {
    weekday: d.toLocaleDateString('en-US', { weekday: 'short' }),
    day: String(d.getDate()),
  };
}

/** "Oct 6 – 12" for the week heading. */
export function weekRangeLabel(monday: IsoDate): string {
  const start = fromIsoDate(monday);
  const end = fromIsoDate(addDays(monday, 6));
  const month = (d: Date) => d.toLocaleDateString('en-US', { month: 'short' });
  return month(start) === month(end)
    ? `${month(start)} ${start.getDate()} – ${end.getDate()}`
    : `${month(start)} ${start.getDate()} – ${month(end)} ${end.getDate()}`;
}

export const mealSlots = ['breakfast', 'lunch', 'dinner'] as const;
export type MealSlot = (typeof mealSlots)[number];

export const mealSlotLabels: Record<MealSlot, string> = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  dinner: 'Dinner',
};

/** Planned baby meals keyed by `planKey(date, slot)`, one recipe per slot. */
export type MealPlan = Record<string, string>;

export function planKey(date: IsoDate, slot: MealSlot): string {
  return `${date}|${slot}`;
}

export function isMealSlot(value: string): value is MealSlot {
  return (mealSlots as readonly string[]).includes(value);
}

/** How many meals are planned on a day (0 to 3). */
export function mealsPlanned(plan: MealPlan, date: IsoDate): number {
  return mealSlots.filter((slot) => plan[planKey(date, slot)]).length;
}

/** Turns stored `{date|slot: id}` or legacy `{date: id}` (one meal a day, now lunch) into a plan. */
export function normalizePlan(stored: Record<string, unknown>): MealPlan {
  const plan: MealPlan = {};
  for (const [key, value] of Object.entries(stored)) {
    if (typeof value !== 'string') continue;
    const [date, slot] = key.split('|');
    if (!isIsoDate(date)) continue;
    if (slot === undefined) plan[planKey(date, 'lunch')] = value;
    else if (isMealSlot(slot)) plan[key] = value;
  }
  return plan;
}

// Freezer -------------------------------------------------------------------

/** Homemade purees: use within 3 months of freezing (the app's make-ahead guidance). */
export const FREEZER_MONTHS = 3;
const USE_SOON_DAYS = 14;

export const freezerItemSchema = z.object({
  id: z.string().min(1),
  name: z.string().trim().min(1).max(60),
  cubes: z.number().int().min(0).max(500),
  frozenOn: z.string().refine(isIsoDate),
});
export type FreezerItem = z.infer<typeof freezerItemSchema>;

export type FreezerStatus = 'ok' | 'use-soon' | 'past' | 'used-up';

export function bestBefore(item: Pick<FreezerItem, 'frozenOn'>): IsoDate {
  return addMonths(item.frozenOn, FREEZER_MONTHS);
}

export function freezerStatus(item: FreezerItem, onDate: IsoDate): FreezerStatus {
  if (item.cubes === 0) return 'used-up';
  const left = daysBetween(onDate, bestBefore(item));
  if (left < 0) return 'past';
  if (left <= USE_SOON_DAYS) return 'use-soon';
  return 'ok';
}

/** Soonest use-by first; used-up items last. */
export function sortFreezer(items: FreezerItem[]): FreezerItem[] {
  return [...items].sort((a, b) => {
    const usedA = a.cubes === 0 ? 1 : 0;
    const usedB = b.cubes === 0 ? 1 : 0;
    return (
      usedA - usedB || bestBefore(a).localeCompare(bestBefore(b)) || a.name.localeCompare(b.name)
    );
  });
}

export function totalCubes(items: FreezerItem[]): number {
  return items.reduce((sum, i) => sum + i.cubes, 0);
}

export function makeFreezerItem(
  input: { name: string; cubes: number; frozenOn: IsoDate },
  id = `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`,
): FreezerItem {
  return freezerItemSchema.parse({ id, ...input, name: input.name.trim() });
}
