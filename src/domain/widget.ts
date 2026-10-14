import { addDays, fromIsoDate, type IsoDate } from './dates';
import { mealSlots, planKey, type MealPlan } from './planner';

/** What the "Today's meals" home screen widget shows. Flat strings only: widgets get plain props. */
export type TodayWidgetProps = {
  heading: string;
  breakfast: string;
  lunch: string;
  dinner: string;
};

export const NOT_PLANNED = 'Not planned yet';

/**
 * Widget timeline entries: one per day starting today, each taking effect at local
 * midnight (today's entry right away), so the widget rolls over without the app open.
 */
export function todayWidgetEntries(
  plan: MealPlan,
  now: IsoDate,
  babyName: string | null,
  titleFor: (mealId: string) => string | null,
  days = 3,
): { date: Date; props: TodayWidgetProps }[] {
  return Array.from({ length: days }, (_, i) => {
    const date = addDays(now, i);
    const [breakfast, lunch, dinner] = mealSlots.map((slot) => {
      const id = plan[planKey(date, slot)];
      return (id && titleFor(id)) || NOT_PLANNED;
    });
    return {
      date: i === 0 ? new Date() : fromIsoDate(date),
      props: { heading: babyName ? `Today for ${babyName}` : 'Today', breakfast, lunch, dinner },
    };
  });
}
