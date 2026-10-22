import { isRunningInExpoGo } from 'expo';
import { useEffect } from 'react';
import { Platform } from 'react-native';

import { today } from '@/domain/dates';
import { storedWidgetDays, todayWidgetEntries } from '@/domain/widget';
import { useProfile } from '@/features/profile/profile-context';

import { plannedMeal } from './planned-meal';
import { usePlanner } from './planner-context';

/**
 * Keeps the "Today's meals" home screen widget (iPhone and Android) in step with the meal
 * plan. The data goes only to the widget on this phone, never off the device.
 */
export function useTodayWidgetSync() {
  const { plan } = usePlanner();
  const { profile } = useProfile();
  const name = profile?.babyName ?? null;
  useEffect(() => {
    const titleFor = (id: string) => plannedMeal(id)?.title ?? null;
    if (Platform.OS === 'android') {
      if (isRunningInExpoGo()) return;
      // Loaded lazily, like the iPhone widget below: Expo Go has no widget module.
      const { syncAndroidWidget } =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@/widgets/today-meals-android-sync') as typeof import('@/widgets/today-meals-android-sync');
      syncAndroidWidget(storedWidgetDays(plan, today(), name, titleFor)).catch(() => {});
      return;
    }
    try {
      // Loaded lazily: the widget's native module isn't in Expo Go, and importing it
      // there throws, so a top-level import would crash the app on start.
      const { todayMealsWidget } =
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        require('@/widgets/today-meals') as typeof import('@/widgets/today-meals');
      todayMealsWidget.updateTimeline(todayWidgetEntries(plan, today(), name, titleFor));
    } catch {
      // No widget support here (Expo Go, web): nothing to update.
    }
  }, [plan, name]);
}
