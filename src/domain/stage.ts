import { ageRules as defaultRules, type AgeRules } from '@/content/age-rules';

import { addMonths, daysBetween, monthsBetween, type IsoDate } from './dates';

/**
 * The three journeys of the app:
 * - `newborn`: mom-focused, roughly 0–6 months
 * - `solids`: starting solids, roughly 6–12 months
 * - `toddler`: 12 months and up
 */
export type Stage = 'newborn' | 'solids' | 'toddler';

export type BabyDates = {
  birthDate: IsoDate;
  /** Original due date; only set when the baby arrived early. */
  dueDate?: IsoDate | null;
};

export type BabyAge = {
  /** Days since the (effective) birth date. */
  days: number;
  weeks: number;
  /** Completed calendar months. */
  months: number;
  /** True when the age is corrected for being born early. */
  corrected: boolean;
  /** Birth date the age is counted from (due date when corrected). */
  countedFrom: IsoDate;
};

/** Whether corrected age applies today for a baby born early. */
export function usesCorrectedAge(
  baby: BabyDates,
  onDate: IsoDate,
  rules: AgeRules = defaultRules,
): boolean {
  if (!baby.dueDate) return false;
  const daysEarly = daysBetween(baby.birthDate, baby.dueDate);
  if (daysEarly < rules.correctedAge.minDaysEarly) return false;
  return monthsBetween(baby.birthDate, onDate) < rules.correctedAge.useUntilMonths;
}

export function babyAge(baby: BabyDates, onDate: IsoDate, rules: AgeRules = defaultRules): BabyAge {
  const corrected = usesCorrectedAge(baby, onDate, rules);
  const countedFrom = corrected && baby.dueDate ? baby.dueDate : baby.birthDate;
  const days = Math.max(0, daysBetween(countedFrom, onDate));
  const months = Math.max(0, monthsBetween(countedFrom, onDate));
  return { days, weeks: Math.floor(days / 7), months, corrected, countedFrom };
}

export function stageForMonths(months: number, rules: AgeRules = defaultRules): Stage {
  if (months >= rules.stageStartMonths.toddler) return 'toddler';
  if (months >= rules.stageStartMonths.solids) return 'solids';
  return 'newborn';
}

export function babyStage(baby: BabyDates, onDate: IsoDate, rules: AgeRules = defaultRules): Stage {
  return stageForMonths(babyAge(baby, onDate, rules).months, rules);
}

/** Date the solids stage begins (the 6-month mark, using corrected age where it applies). */
export function solidsStartDate(
  baby: BabyDates,
  onDate: IsoDate,
  rules: AgeRules = defaultRules,
): IsoDate {
  const { countedFrom } = babyAge(baby, onDate, rules);
  return addMonths(countedFrom, rules.stageStartMonths.solids);
}

/**
 * Week of the starting-solids plan (1 = the first week after the 6-month mark),
 * or null before then. Not capped: the plan decides how many weeks it has.
 */
export function solidsWeek(
  baby: BabyDates,
  onDate: IsoDate,
  rules: AgeRules = defaultRules,
): number | null {
  const days = daysBetween(solidsStartDate(baby, onDate, rules), onDate);
  return days < 0 ? null : Math.floor(days / 7) + 1;
}

/** Friendly age, e.g. "5 days", "3 weeks", "4 months", "1 year 2 months". */
export function formatAge(age: Pick<BabyAge, 'days' | 'weeks' | 'months'>): string {
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
  if (age.days < 14) return plural(age.days, 'day');
  if (age.weeks < 8 || age.months < 2) return plural(age.weeks, 'week');
  if (age.months < 24) {
    if (age.months < 12) return plural(age.months, 'month');
    const rest = age.months - 12;
    return rest === 0 ? '1 year' : `1 year ${plural(rest, 'month')}`;
  }
  return plural(Math.floor(age.months / 12), 'year');
}

/** Age split into whole months plus the days since the last monthly birthday. */
export function ageBreakdown(
  countedFrom: IsoDate,
  onDate: IsoDate,
): { months: number; days: number } {
  const months = Math.max(0, monthsBetween(countedFrom, onDate));
  const days = Math.max(0, daysBetween(addMonths(countedFrom, months), onDate));
  return { months, days };
}

/** Headline age for the Today screen, e.g. "12 days", "5 months, 12 days", "1 year, 2 months". */
export function formatAgeHeadline(countedFrom: IsoDate, onDate: IsoDate): string {
  const { months, days } = ageBreakdown(countedFrom, onDate);
  const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`;
  if (months === 0) return plural(days, 'day');
  if (months < 24) {
    if (months < 12)
      return days ? `${plural(months, 'month')}, ${plural(days, 'day')}` : plural(months, 'month');
    const rest = months - 12;
    return rest ? `1 year, ${plural(rest, 'month')}` : '1 year';
  }
  return plural(Math.floor(months / 12), 'year');
}
