import type { AgeRules } from '@/content/age-rules';

import {
  babyAge,
  babyStage,
  formatAge,
  formatAgeHeadline,
  solidsStartDate,
  solidsWeek,
  stageForMonths,
} from './stage';

const rules: AgeRules = {
  version: 1,
  reviewStatus: 'placeholder',
  reviewer: 'test',
  note: '',
  stageStartMonths: { solids: 6, toddler: 12 },
  correctedAge: { minDaysEarly: 21, useUntilMonths: 24 },
};

describe('stageForMonths', () => {
  it.each([
    [0, 'newborn'],
    [5, 'newborn'],
    [6, 'solids'],
    [11, 'solids'],
    [12, 'toddler'],
    [30, 'toddler'],
  ] as const)('%i months → %s', (months, stage) => {
    expect(stageForMonths(months, rules)).toBe(stage);
  });
});

describe('babyAge', () => {
  it('counts from the birth date for a full-term baby', () => {
    const age = babyAge({ birthDate: '2026-04-01' }, '2026-06-10', rules);
    expect(age).toMatchObject({ days: 70, weeks: 10, months: 2, corrected: false });
  });

  it('is zero on the day of birth', () => {
    expect(babyAge({ birthDate: '2026-10-07' }, '2026-10-07', rules)).toMatchObject({
      days: 0,
      weeks: 0,
      months: 0,
    });
  });

  it('uses corrected age for a baby born well before the due date', () => {
    const baby = { birthDate: '2026-01-01', dueDate: '2026-03-01' };
    const age = babyAge(baby, '2026-07-01', rules);
    expect(age.corrected).toBe(true);
    expect(age.countedFrom).toBe('2026-03-01');
    expect(age.months).toBe(4); // actual age is 6 months
  });

  it('never reports a negative age while the corrected age is "before birth"', () => {
    const baby = { birthDate: '2026-01-01', dueDate: '2026-03-01' };
    expect(babyAge(baby, '2026-01-20', rules)).toMatchObject({ days: 0, months: 0 });
  });

  it('ignores a due date only a little after birth', () => {
    const baby = { birthDate: '2026-01-01', dueDate: '2026-01-15' };
    expect(babyAge(baby, '2026-07-01', rules).corrected).toBe(false);
  });

  it('ignores a due date before the birth date (a late baby)', () => {
    const baby = { birthDate: '2026-01-10', dueDate: '2026-01-01' };
    expect(babyAge(baby, '2026-07-10', rules).corrected).toBe(false);
  });

  it('stops correcting once the actual age passes the cut-off', () => {
    const baby = { birthDate: '2024-01-01', dueDate: '2024-03-01' };
    expect(babyAge(baby, '2025-12-31', rules).corrected).toBe(true);
    expect(babyAge(baby, '2026-01-01', rules).corrected).toBe(false);
  });
});

describe('babyStage', () => {
  it('moves a premature baby into solids later than the birth date alone would', () => {
    const baby = { birthDate: '2026-01-01', dueDate: '2026-03-01' };
    expect(babyStage({ birthDate: baby.birthDate }, '2026-07-01', rules)).toBe('solids');
    expect(babyStage(baby, '2026-07-01', rules)).toBe('newborn');
    expect(babyStage(baby, '2026-09-01', rules)).toBe('solids');
  });
});

describe('solidsWeek', () => {
  const baby = { birthDate: '2026-01-15' };

  it('is null before the 6-month mark', () => {
    expect(solidsWeek(baby, '2026-07-14', rules)).toBeNull();
  });
  it('is week 1 for the first seven days', () => {
    expect(solidsStartDate(baby, '2026-07-15', rules)).toBe('2026-07-15');
    expect(solidsWeek(baby, '2026-07-15', rules)).toBe(1);
    expect(solidsWeek(baby, '2026-07-21', rules)).toBe(1);
  });
  it('counts on from there', () => {
    expect(solidsWeek(baby, '2026-07-22', rules)).toBe(2);
    expect(solidsWeek(baby, '2026-10-06', rules)).toBe(12); // day 83
    expect(solidsWeek(baby, '2026-10-07', rules)).toBe(13); // day 84
  });
  it('uses corrected age for babies born early', () => {
    const early = { birthDate: '2026-01-01', dueDate: '2026-03-01' };
    expect(solidsWeek(early, '2026-08-31', rules)).toBeNull();
    expect(solidsWeek(early, '2026-09-01', rules)).toBe(1);
  });
});

describe('formatAge', () => {
  it.each([
    [{ days: 1, weeks: 0, months: 0 }, '1 day'],
    [{ days: 10, weeks: 1, months: 0 }, '10 days'],
    [{ days: 21, weeks: 3, months: 0 }, '3 weeks'],
    [{ days: 70, weeks: 10, months: 2 }, '2 months'],
    [{ days: 200, weeks: 28, months: 6 }, '6 months'],
    [{ days: 366, weeks: 52, months: 12 }, '1 year'],
    [{ days: 430, weeks: 61, months: 14 }, '1 year 2 months'],
    [{ days: 800, weeks: 114, months: 26 }, '2 years'],
  ])('%j → %s', (age, text) => {
    expect(formatAge(age)).toBe(text);
  });
});

describe('formatAgeHeadline', () => {
  it.each([
    ['2026-10-07', '0 days'],
    ['2026-09-26', '11 days'],
    ['2026-09-07', '1 month'],
    ['2026-04-25', '5 months, 12 days'],
    ['2026-03-06', '7 months, 1 day'],
    ['2025-08-07', '1 year, 2 months'],
    ['2025-10-07', '1 year'],
    ['2023-10-01', '3 years'],
  ])('born %s → %s on 2026-10-07', (from, text) => {
    expect(formatAgeHeadline(from, '2026-10-07')).toBe(text);
  });
});
