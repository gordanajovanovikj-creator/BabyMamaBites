import { z } from 'zod';

import { addDays, daysBetween, isIsoDate, type IsoDate } from './dates';

export const feedingStatuses = [
  'breast',
  'formula',
  'mixed',
  'pumping',
  'prefer-not-to-say',
] as const;
export const allergens = [
  'milk',
  'egg',
  'peanut',
  'tree-nuts',
  'sesame',
  'soy',
  'wheat',
  'fish',
  'shellfish',
] as const;
export const diets = [
  'vegetarian',
  'vegan',
  'pescatarian',
  'halal',
  'kosher',
  'gluten-free',
] as const;
export const cookingTimes = ['minimal', 'short', 'relaxed'] as const;

export type FeedingStatus = (typeof feedingStatuses)[number];
export type Allergen = (typeof allergens)[number];
export type Diet = (typeof diets)[number];
export type CookingTime = (typeof cookingTimes)[number];

const isoDate = z.string().refine(isIsoDate, 'Invalid date');

/** Everything we store about the family. Kept deliberately small (privacy first). */
export const profileSchema = z.object({
  birthDate: isoDate,
  dueDate: isoDate.nullable(),
  feeding: z.enum(feedingStatuses),
  /** Foods the household avoids for allergy reasons. */
  allergens: z.array(z.enum(allergens)),
  diets: z.array(z.enum(diets)),
  cookingTime: z.enum(cookingTimes),
});
export type Profile = z.infer<typeof profileSchema>;

/** Oldest birth date we accept; the app covers babies and toddlers. */
const MAX_AGE_DAYS = 5 * 366;
/** A late baby can be born after the due date; an early one long before it. */
const DUE_DATE_MIN_OFFSET_DAYS = -42;
const DUE_DATE_MAX_OFFSET_DAYS = 140;

export type DateError = 'in-future' | 'too-old' | 'out-of-range';

export function validateBirthDate(birthDate: IsoDate, onDate: IsoDate): DateError | null {
  const age = daysBetween(birthDate, onDate);
  if (age < 0) return 'in-future';
  if (age > MAX_AGE_DAYS) return 'too-old';
  return null;
}

export function validateDueDate(dueDate: IsoDate, birthDate: IsoDate): DateError | null {
  const offset = daysBetween(birthDate, dueDate);
  if (offset < DUE_DATE_MIN_OFFSET_DAYS || offset > DUE_DATE_MAX_OFFSET_DAYS) return 'out-of-range';
  return null;
}

/** Bounds for the due-date picker, given a birth date. */
export function dueDateBounds(birthDate: IsoDate): { min: IsoDate; max: IsoDate } {
  return {
    min: addDays(birthDate, DUE_DATE_MIN_OFFSET_DAYS),
    max: addDays(birthDate, DUE_DATE_MAX_OFFSET_DAYS),
  };
}

export function oldestBirthDate(onDate: IsoDate): IsoDate {
  return addDays(onDate, -MAX_AGE_DAYS);
}

/** Toggles an item in a multi-select list, returning a new array. */
export function toggle<T>(list: readonly T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}
