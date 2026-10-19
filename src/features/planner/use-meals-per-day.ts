import { mealsPerDayGuide } from '@/content/solids-plan';
import type { IsoDate } from '@/domain/dates';
import { mealSlots, suggestedMealsPerDay } from '@/domain/planner';
import { babyAge, solidsWeek } from '@/domain/stage';
import { useProfile } from '@/features/profile/profile-context';

/** How many meals a day the planner shows on `date` for this baby's stage (1 to 3). */
export function useMealsPerDay(date: IsoDate): number {
  const { profile } = useProfile();
  if (!profile) return mealSlots.length;
  return suggestedMealsPerDay(
    mealsPerDayGuide,
    solidsWeek(profile, date),
    babyAge(profile, date).months,
  );
}
