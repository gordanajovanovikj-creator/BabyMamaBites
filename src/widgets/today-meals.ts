import type { TodayWidgetProps } from '@/domain/widget';

/**
 * Home screen widgets are iOS-only (see today-meals.ios.tsx). On Android and web
 * this stand-in keeps the same shape and does nothing.
 */
export const todayMealsWidget = {
  updateTimeline(_entries: { date: Date; props: TodayWidgetProps }[]): void {},
};
