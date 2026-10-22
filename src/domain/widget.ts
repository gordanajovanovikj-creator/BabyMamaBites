import { addDays, fromIsoDate, isIsoDate, type IsoDate } from './dates';
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

/** One day of the Android widget, saved on the phone so the widget can update by itself. */
export type StoredWidgetDay = { date: IsoDate; props: TodayWidgetProps };

/** The next week of widget days, from today. */
export function storedWidgetDays(
  plan: MealPlan,
  now: IsoDate,
  babyName: string | null,
  titleFor: (mealId: string) => string | null,
): StoredWidgetDay[] {
  return todayWidgetEntries(plan, now, babyName, titleFor, 7).map((entry, i) => ({
    date: addDays(now, i),
    props: entry.props,
  }));
}

/**
 * What the Android widget shows on a given day: that day's saved meals, or a nudge to open
 * the app when nothing is saved for it (the app hasn't been opened in a week).
 */
export function widgetPropsFor(
  saved: string | null | undefined,
  onDate: IsoDate,
): TodayWidgetProps {
  let days: StoredWidgetDay[] = [];
  try {
    const parsed: unknown = saved ? JSON.parse(saved) : [];
    if (Array.isArray(parsed)) days = parsed as StoredWidgetDay[];
  } catch {
    days = [];
  }
  const day = days.find((d) => d && isIsoDate(d.date) && d.date === onDate);
  if (day?.props && typeof day.props.heading === 'string') return day.props;
  return { heading: 'Today', breakfast: OPEN_APP, lunch: OPEN_APP, dinner: OPEN_APP };
}

export const OPEN_APP = 'Open the app to update';
