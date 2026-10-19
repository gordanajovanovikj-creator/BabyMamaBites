import { z } from 'zod';

import type { PlanWeek } from '@/content/solids-plan';

import { daysBetween, isIsoDate, type IsoDate } from './dates';
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

/** New allergens go at least this many days apart (the plan says 3 to 5, per the CDC). */
export const NEW_ALLERGEN_GAP_DAYS = 3;

export type PlanAllergen = NonNullable<PlanWeek['allergen']>;

/**
 * Home's "today's focus" for a plan week:
 * - `try`: offer this allergen today (this week's, or a missed one to catch up on),
 * - `wait`: this week's allergen, but another new allergen was tried in the last few days,
 * - `done`: this week's allergen is logged with no reaction,
 * - `reaction`: a reaction was logged for this week's allergen,
 * - `week`: no allergen to offer; show the week's title.
 */
export type TodayFocusState =
  | { kind: 'try'; allergen: PlanAllergen; catchUp: boolean }
  | { kind: 'wait'; allergen: PlanAllergen; days: number }
  | { kind: 'done'; allergen: PlanAllergen }
  | { kind: 'reaction'; allergen: PlanAllergen }
  | { kind: 'week' };

/** Days since an allergen was first logged for the most recent time, or null if none. */
function daysSinceNewAllergen(entries: FoodLogEntry[], onDate: IsoDate): number | null {
  const firstTried = new Map<Allergen, IsoDate>();
  for (const e of entries) {
    if (!e.allergen) continue;
    const seen = firstTried.get(e.allergen);
    if (!seen || e.date < seen) firstTried.set(e.allergen, e.date);
  }
  const latest = [...firstTried.values()].sort().pop();
  return latest ? daysBetween(latest, onDate) : null;
}

export function todayFocusState(
  week: PlanWeek,
  weeks: PlanWeek[],
  entries: FoodLogEntry[],
  onDate: IsoDate,
): TodayFocusState {
  const status = allergenProgress(entries);
  const since = daysSinceNewAllergen(entries, onDate);
  const rested = since === null || since >= NEW_ALLERGEN_GAP_DAYS;
  const own = week.allergen;

  if (own && status[own.id] === 'reaction') return { kind: 'reaction', allergen: own };
  if (own && status[own.id] === 'not-tried') {
    return rested
      ? { kind: 'try', allergen: own, catchUp: false }
      : { kind: 'wait', allergen: own, days: NEW_ALLERGEN_GAP_DAYS - (since ?? 0) };
  }
  // This week's allergen is done (or there isn't one): catch up on one missed in an
  // earlier week, once a few days have passed since the last new allergen.
  const missed = weeks.find(
    (w) => w.week < week.week && w.allergen && status[w.allergen.id] === 'not-tried',
  )?.allergen;
  if (missed && rested) return { kind: 'try', allergen: missed, catchUp: true };
  return own ? { kind: 'done', allergen: own } : { kind: 'week' };
}
