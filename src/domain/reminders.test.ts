import { makeFreezerItem } from './planner';
import {
  anyReminderOn,
  defaultReminderSettings,
  MAX_REMINDERS,
  planReminders,
  type ReminderSettings,
} from './reminders';

const on: ReminderSettings = {
  foodLog: { enabled: true, time: { hour: 18, minute: 30 } },
  weeklyPlan: { enabled: true },
  freezer: { enabled: true },
  solidsWeek: { enabled: true },
};

const ctx = {
  today: '2026-10-09',
  freezer: [
    makeFreezerItem({ name: 'Pear puree', cubes: 4, frozenOn: '2026-09-01' }, 'pear'),
    makeFreezerItem({ name: 'Peas', cubes: 0, frozenOn: '2026-09-01' }, 'peas'),
    makeFreezerItem({ name: 'Old squash', cubes: 3, frozenOn: '2026-07-01' }, 'old'),
  ],
  solidsStart: '2026-09-20',
  planWeeks: 26,
  weekTitle: (w: number) => (w === 4 ? 'Peanut, the early way' : undefined),
};

describe('reminders', () => {
  it('are all off by default and plan nothing', () => {
    expect(anyReminderOn(defaultReminderSettings)).toBe(false);
    expect(planReminders(defaultReminderSettings, ctx)).toEqual([]);
  });

  it('plans a daily log nudge and a Sunday planning reminder', () => {
    const r = planReminders(on, ctx);
    expect(r.find((x) => x.id === 'food-log')?.trigger).toEqual({
      kind: 'daily',
      hour: 18,
      minute: 30,
    });
    expect(r.find((x) => x.id === 'weekly-plan')?.trigger).toEqual({
      kind: 'weekly',
      weekday: 1,
      hour: 10,
      minute: 0,
    });
  });

  it('warns a week before a freezer item is best used, skipping used-up and overdue ones', () => {
    const freezer = planReminders(on, ctx).filter((x) => x.id.startsWith('freezer-'));
    expect(freezer.map((x) => x.id)).toEqual(['freezer-pear']);
    expect(freezer[0].trigger).toEqual({ kind: 'date', date: '2026-11-24', hour: 9, minute: 0 });
    expect(freezer[0].body).toBe('Pear puree is best used by Dec 1.');
  });

  it('announces the next four plan weeks, never past ones', () => {
    const weeks = planReminders(on, ctx).filter((x) => x.id.startsWith('solids-week'));
    expect(weeks.map((x) => x.id)).toEqual([
      'solids-week-4',
      'solids-week-5',
      'solids-week-6',
      'solids-week-7',
    ]);
    expect(weeks[0].trigger).toMatchObject({ kind: 'date', date: '2026-10-11' });
    expect(weeks[0].body).toBe('This week: Peanut, the early way. Open the Baby tab for ideas.');
  });

  it("never puts the baby's name on the lock screen and stays under the iOS limit", () => {
    const many = {
      ...ctx,
      freezer: Array.from({ length: 80 }, (_, i) =>
        makeFreezerItem({ name: `Item ${i}`, cubes: 1, frozenOn: '2026-10-01' }, `i${i}`),
      ),
    };
    const r = planReminders(on, many);
    expect(r.length).toBeLessThanOrEqual(MAX_REMINDERS);
    for (const x of r) expect(`${x.title} ${x.body}`).not.toMatch(/Mila/);
  });
});
