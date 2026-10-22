import type { TodayWidgetProps } from '@/domain/widget';

/**
 * The iPhone widget lives in today-meals.ios.tsx and Android's in today-meals-android.tsx.
 * Elsewhere this stand-in keeps the same shape and does nothing.
 */
export const todayMealsWidget = {
  updateTimeline(_entries: { date: Date; props: TodayWidgetProps }[]): void {},
};
