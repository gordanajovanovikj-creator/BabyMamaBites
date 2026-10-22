import { makeEntry, type FoodLogEntry } from './food-log';
import { buildReport, entriesInPeriod, reportFileName, reportHtml } from './pediatrician-report';

const entry = (date: string, food: string, extra: Partial<FoodLogEntry> = {}): FoodLogEntry => ({
  ...makeEntry({ date, food, allergen: null, isNew: true, reaction: 'none' }, `${date}-${food}`),
  ...extra,
});

const log = [
  entry('2026-06-01', 'Egg', { allergen: 'egg' }),
  entry('2026-09-30', 'Avocado'),
  entry('2026-10-10', 'Peanut butter', {
    allergen: 'peanut',
    reaction: 'mild',
    notes: 'A few hives <around> the mouth',
  }),
  entry('2026-10-20', 'Avocado', { isNew: false }),
];
const baby = { babyName: 'Mila', birthDate: '2026-03-01', dueDate: null };

describe('entriesInPeriod', () => {
  it('keeps the last 30 days, including today', () => {
    expect(entriesInPeriod(log, 'last-30-days', '2026-10-22').map((e) => e.date)).toEqual([
      '2026-09-30',
      '2026-10-10',
      '2026-10-20',
    ]);
    expect(entriesInPeriod(log, 'last-30-days', '2026-10-30').map((e) => e.date)).toEqual([
      '2026-10-10',
      '2026-10-20',
    ]);
  });

  it('keeps the last 3 months, or everything', () => {
    expect(entriesInPeriod(log, 'last-3-months', '2026-10-22')).toHaveLength(3);
    expect(entriesInPeriod(log, 'all', '2026-10-22')).toHaveLength(4);
  });
});

describe('buildReport', () => {
  const report = buildReport(baby, log, 'last-30-days', '2026-10-22');

  it('lists the period newest first, with reactions pulled out', () => {
    expect(report.entries.map((e) => e.date)).toEqual(['2026-10-20', '2026-10-10', '2026-09-30']);
    expect(report.reactions.map((e) => e.food)).toEqual(['Peanut butter']);
    expect(report.foodsTried).toBe(2);
    expect(report.newFoods).toBe(2);
  });

  it('judges allergens on the whole log, not just the period', () => {
    const row = (a: string) => report.allergens.find((r) => r.allergen === a);
    expect(row('egg')).toMatchObject({
      status: 'Tried, no reaction logged',
      firstTried: '2026-06-01',
    });
    expect(row('peanut')?.status).toBe('Reaction logged');
    expect(row('sesame')).toMatchObject({ status: 'Not tried yet', firstTried: null });
    expect(report.allergens).toHaveLength(9);
  });

  it("gives the baby's age", () => {
    expect(report.age).toBe('7 months');
    const early = buildReport({ ...baby, dueDate: '2026-04-01' }, log, 'all', '2026-10-22');
    expect(early.age).toBe('6 months (corrected)');
  });
});

describe('reportHtml', () => {
  it('escapes what the family typed', () => {
    const html = reportHtml(buildReport(baby, log, 'all', '2026-10-22'));
    expect(html).toContain('&lt;around&gt;');
    expect(html).not.toContain('<around>');
    expect(html).toContain('Food log: Mila');
    expect(html).toContain('not a medical record');
  });

  it('works without a name or any entries', () => {
    const html = reportHtml(buildReport({ ...baby, babyName: null }, [], 'all', '2026-10-22'));
    expect(html).toContain('Food log: Your baby');
    expect(html).toContain('Nothing logged in this period.');
    expect(html).toContain('No reactions logged in this period.');
  });
});

describe('reportFileName', () => {
  it('uses the name and date, without characters files dislike', () => {
    expect(
      reportFileName(buildReport({ ...baby, babyName: 'Mi/la' }, log, 'all', '2026-10-22')),
    ).toBe('Food log Mila 2026-10-22');
    expect(reportFileName(buildReport({ ...baby, babyName: null }, log, 'all', '2026-10-22'))).toBe(
      'Food log 2026-10-22',
    );
  });
});
