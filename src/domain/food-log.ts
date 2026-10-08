import { z } from 'zod';

import { isIsoDate, type IsoDate } from './dates';
import { allergens, type Allergen } from './profile';

export const reactions = ['none', 'mild', 'concerning'] as const;
export type Reaction = (typeof reactions)[number];

export const foodLogEntrySchema = z.object({
  id: z.string().min(1),
  date: z.string().refine(isIsoDate),
  food: z.string().trim().min(1).max(80),
  allergen: z.enum(allergens).nullable(),
  isNew: z.boolean(),
  reaction: z.enum(reactions),
  notes: z.string().max(500).nullable(),
});
export type FoodLogEntry = z.infer<typeof foodLogEntrySchema>;

export type AllergenStatus = 'not-tried' | 'tried' | 'reaction';

/**
 * For each major allergen: not tried yet, tried with no reaction logged,
 * or a reaction was logged (which always takes precedence).
 */
export function allergenProgress(entries: FoodLogEntry[]): Record<Allergen, AllergenStatus> {
  const status = Object.fromEntries(allergens.map((a) => [a, 'not-tried'])) as Record<
    Allergen,
    AllergenStatus
  >;
  for (const e of entries) {
    if (!e.allergen) continue;
    if (e.reaction !== 'none') status[e.allergen] = 'reaction';
    else if (status[e.allergen] === 'not-tried') status[e.allergen] = 'tried';
  }
  return status;
}

/** Distinct foods logged (case-insensitive). */
export function foodsTriedCount(entries: FoodLogEntry[]): number {
  return new Set(entries.map((e) => e.food.trim().toLowerCase())).size;
}

/** Newest first; ties broken by insertion order (later id first). */
export function sortEntries(entries: FoodLogEntry[]): FoodLogEntry[] {
  return [...entries].sort((a, b) => b.date.localeCompare(a.date) || b.id.localeCompare(a.id));
}

/** Plan week to show: clamped to the plan, or null before solids. */
export function planWeekFor(solidsWeek: number | null, totalWeeks: number): number | null {
  if (solidsWeek === null) return null;
  return Math.min(Math.max(solidsWeek, 1), totalWeeks);
}

/** Weeks where new foods go one at a time, 3 to 5 days apart (CDC, AAP). */
export const ONE_AT_A_TIME_WEEKS = 12;

/** Heading for a week's food list: paced new foods early on, ideas later. */
export function tryFoodsHeading(week: number): { title: string; detail: string | null } {
  return week <= ONE_AT_A_TIME_WEEKS
    ? { title: 'New foods this week', detail: 'One at a time, 3 to 5 days apart' }
    : { title: 'Ideas this week', detail: null };
}

export function newEntryId(now: Date = new Date()): string {
  return `${now.getTime().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

export type NewEntryInput = {
  date: IsoDate;
  food: string;
  allergen: Allergen | null;
  isNew: boolean;
  reaction: Reaction;
  notes?: string | null;
};

export function makeEntry(input: NewEntryInput, id = newEntryId()): FoodLogEntry {
  return foodLogEntrySchema.parse({
    id,
    ...input,
    food: input.food.trim(),
    notes: input.notes?.trim() ? input.notes.trim() : null,
  });
}
