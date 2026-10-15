import { useEffect } from 'react';

import { today } from '@/domain/dates';
import { todayWidgetEntries } from '@/domain/widget';
import { useProfile } from '@/features/profile/profile-context';

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
      // Loaded lazily: the widget's native module isn't in Expo Go, and importing it
      // there throws, so a top-level import would crash the app on start.
      const { todayMealsWidget } =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@/widgets/today-meals') as typeof import('@/widgets/today-meals');
      todayMealsWidget.updateTimeline(
        todayWidgetEntries(plan, today(), name, (id) => plannedMeal(id)?.title ?? null),
      );
    } catch {
      // No widget support here (Expo Go, Android, web): nothing to update.
    }
  }, [plan, name]);
}
