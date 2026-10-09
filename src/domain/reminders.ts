import { z } from 'zod';

import { addDays, daysBetween, fromIsoDate, type IsoDate } from './dates';
import { bestBefore, type FreezerItem } from './planner';

/** Times offered for the daily food-log nudge (24-hour clock). */
export const logTimes = [
  { hour: 12, minute: 30 },
  { hour: 18, minute: 30 },
  { hour: 20, minute: 0 },
] as const;

const timeSchema = z.object({
  hour: z.number().int().min(0).max(23),
  minute: z.number().int().min(0).max(59),
});

export const reminderSettingsSchema = z.object({
  foodLog: z.object({ enabled: z.boolean(), time: timeSchema }),
  weeklyPlan: z.object({ enabled: z.boolean() }),
  freezer: z.object({ enabled: z.boolean() }),
  solidsWeek: z.object({ enabled: z.boolean() }),
});
export type ReminderSettings = z.infer<typeof reminderSettingsSchema>;

/** Everything starts off: reminders are opt-in. */
export const defaultReminderSettings: ReminderSettings = {
  foodLog: { enabled: false, time: { hour: 18, minute: 30 } },
  weeklyPlan: { enabled: false },
  freezer: { enabled: false },
  solidsWeek: { enabled: false },
};

export function anyReminderOn(s: ReminderSettings): boolean {
  return s.foodLog.enabled || s.weeklyPlan.enabled || s.freezer.enabled || s.solidsWeek.enabled;
}

export type ReminderTrigger =
  | { kind: 'daily'; hour: number; minute: number }
  /** weekday: 1 = Sunday … 7 = Saturday (as iOS and expo-notifications count). */
  | { kind: 'weekly'; weekday: number; hour: number; minute: number }
  | { kind: 'date'; date: IsoDate; hour: number; minute: number };

export type PlannedReminder = {
  id: string;
  title: string;
  body: string;
  trigger: ReminderTrigger;
};

export type ReminderContext = {
  today: IsoDate;
  freezer: FreezerItem[];
  /** First day of the solids plan (6-month mark), or null if unknown. */
  solidsStart: IsoDate | null;
  /** Number of weeks in the plan. */
  planWeeks: number;
  /** Title of a plan week, e.g. "Peanut, the early way". */
  weekTitle(week: number): string | undefined;
};

/** iOS keeps at most 64 pending local notifications per app; stay under it. */
export const MAX_REMINDERS = 60;
const FREEZER_DAYS_BEFORE = 7;
const UPCOMING_WEEKS = 4;
const MORNING = { hour: 9, minute: 0 };

function shortDate(date: IsoDate): string {
  return fromIsoDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * The reminders to schedule for these settings. Pure, so it can be tested and re-run
 * whenever anything changes. Copy is gentle and never includes the baby's name,
 * because notifications can show on the lock screen.
 */
export function planReminders(s: ReminderSettings, ctx: ReminderContext): PlannedReminder[] {
  const out: PlannedReminder[] = [];

  if (s.foodLog.enabled) {
    out.push({
      id: 'food-log',
      title: 'Anything new on the menu?',
      body: 'If your little one tried a new food today, add it to the food log.',
      trigger: { kind: 'daily', ...s.foodLog.time },
    });
  }

  if (s.weeklyPlan.enabled) {
    out.push({
      id: 'weekly-plan',
      title: 'Plan the week ahead',
      body: 'A few minutes now: pick breakfast, lunch and dinner for next week.',
      trigger: { kind: 'weekly', weekday: 1, hour: 10, minute: 0 },
    });
  }

  if (s.solidsWeek.enabled && ctx.solidsStart) {
    for (let week = 1; week <= ctx.planWeeks; week++) {
      const date = addDays(ctx.solidsStart, (week - 1) * 7);
      if (daysBetween(ctx.today, date) <= 0) continue;
      out.push({
        id: `solids-week-${week}`,
        title: week === 1 ? 'First foods start this week' : `Week ${week} of first foods`,
        body: ctx.weekTitle(week)
          ? `This week: ${ctx.weekTitle(week)}. Open the Baby tab for ideas.`
          : 'Open the Baby tab for ideas.',
        trigger: { kind: 'date', date, ...MORNING },
      });
      if (out.filter((r) => r.id.startsWith('solids-week')).length >= UPCOMING_WEEKS) break;
    }
  }

  if (s.freezer.enabled) {
    for (const item of ctx.freezer) {
      if (item.cubes === 0) continue;
      const useBy = bestBefore(item);
      const date = addDays(useBy, -FREEZER_DAYS_BEFORE);
      if (daysBetween(ctx.today, date) <= 0) continue;
      out.push({
        id: `freezer-${item.id}`,
        title: 'Freezer check',
        body: `${item.name} is best used by ${shortDate(useBy)}.`,
        trigger: { kind: 'date', date, ...MORNING },
      });
    }
  }

  return out.slice(0, MAX_REMINDERS);
}
