import {
  dayLabel,
  mealsPlanned,
  normalizePlan,
  planKey,
  freezerStatus,
  makeFreezerItem,
  sortFreezer,
  totalCubes,
  bestBefore,
  weekDates,
  weekRangeLabel,
  weekStart,
} from './planner';

describe('weeks', () => {
  it('starts weeks on Monday', () => {
    expect(weekStart('2026-10-08')).toBe('2026-10-05'); // Thursday
    expect(weekStart('2026-10-05')).toBe('2026-10-05'); // Monday
    expect(weekStart('2026-10-11')).toBe('2026-10-05'); // Sunday
  });

  it('lists seven days', () => {
    expect(weekDates('2026-10-05')).toEqual([
      '2026-10-05',
      '2026-10-06',
      '2026-10-07',
      '2026-10-08',
      '2026-10-09',
      '2026-10-10',
      '2026-10-11',
    ]);
  });

  it('labels days and ranges', () => {
    expect(dayLabel('2026-10-05')).toEqual({ weekday: 'Mon', day: '5' });
    expect(weekRangeLabel('2026-10-05')).toBe('Oct 5 – 11');
    expect(weekRangeLabel('2026-09-28')).toBe('Sep 28 – Oct 4');
  });
});

describe('freezer', () => {
  const item = (cubes: number, frozenOn: string, name = 'Pear') =>
    makeFreezerItem({ name, cubes, frozenOn }, name + frozenOn);

  it('uses within 3 months', () => {
    expect(bestBefore({ frozenOn: '2026-07-31' })).toBe('2026-10-31');
  });

  it('flags items to use soon, past their date, or used up', () => {
    expect(freezerStatus(item(6, '2026-09-01'), '2026-10-08')).toBe('ok');
    expect(freezerStatus(item(6, '2026-07-20'), '2026-10-08')).toBe('use-soon');
    expect(freezerStatus(item(6, '2026-06-01'), '2026-10-08')).toBe('past');
    expect(freezerStatus(item(0, '2026-09-01'), '2026-10-08')).toBe('used-up');
  });

  it('sorts soonest first with used-up items last', () => {
    const a = item(4, '2026-09-01', 'A');
    const b = item(4, '2026-08-01', 'B');
    const c = item(0, '2026-07-01', 'C');
    expect(sortFreezer([a, c, b]).map((i) => i.name)).toEqual(['B', 'A', 'C']);
    expect(totalCubes([a, b, c])).toBe(8);
  });

  it('validates new items', () => {
    expect(() => makeFreezerItem({ name: '  ', cubes: 2, frozenOn: '2026-10-08' })).toThrow();
    expect(() => makeFreezerItem({ name: 'Peas', cubes: -1, frozenOn: '2026-10-08' })).toThrow();
    expect(makeFreezerItem({ name: ' Peas ', cubes: 2, frozenOn: '2026-10-08' }).name).toBe('Peas');
  });
});

describe('meal slots', () => {
  it('counts planned meals per day', () => {
    const plan = {
      [planKey('2026-10-05', 'breakfast')]: 'a',
      [planKey('2026-10-05', 'dinner')]: 'b',
    };
    expect(mealsPlanned(plan, '2026-10-05')).toBe(2);
    expect(mealsPlanned(plan, '2026-10-06')).toBe(0);
  });

  it('moves the old one-meal-a-day plan to lunch and drops bad keys', () => {
    expect(
      normalizePlan({
        '2026-10-05': 'a',
        '2026-10-06|dinner': 'b',
        '2026-10-07|snack': 'c',
        x: 'd',
        '2026-10-08|lunch': 3,
      }),
    ).toEqual({ '2026-10-05|lunch': 'a', '2026-10-06|dinner': 'b' });
  });
});
