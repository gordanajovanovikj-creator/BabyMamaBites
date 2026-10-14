import { useEffect } from 'react';

import { today } from '@/domain/dates';
import { todayWidgetEntries } from '@/domain/widget';
import { useProfile } from '@/features/profile/profile-context';
import { todayMealsWidget } from '@/widgets/today-meals';

import { plannedMeal } from './planned-meal';
import { usePlanner } from './planner-context';

/**
 * Keeps the "Today's meals" home screen widget (iOS) in step with the meal plan.
 * The data goes only to the widget on this phone, never off the device.
 */
export function useTodayWidgetSync() {
  const { plan } = usePlanner();
  const { profile } = useProfile();
  const name = profile?.babyName ?? null;
  useEffect(() => {
    try {
      todayMealsWidget.updateTimeline(
        todayWidgetEntries(plan, today(), name, (id) => plannedMeal(id)?.title ?? null),
      );
    } catch {
      // A widget that can't update (for example in Expo Go) must never break the app.
    }
  }, [plan, name]);
}
