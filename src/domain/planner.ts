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

/** Planned baby meals, one recipe per day. */
export type MealPlan = Record<IsoDate, string>;

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
