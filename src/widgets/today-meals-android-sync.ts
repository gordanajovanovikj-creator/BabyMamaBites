import { requestWidgetUpdate } from 'react-native-android-widget';
import { createElement } from 'react';

import { today } from '@/domain/dates';
import { widgetPropsFor, type StoredWidgetDay } from '@/domain/widget';

import { saveWidgetDays } from './android-widget-store';
import { isSmallWidget, TodayMealsAndroid } from './today-meals-android';

/** Saves the week for the Android widget and redraws any widget on the home screen now. */
export async function syncAndroidWidget(days: StoredWidgetDay[]): Promise<void> {
  const json = JSON.stringify(days);
  await saveWidgetDays(json);
  await requestWidgetUpdate({
    widgetName: 'TodayMeals',
    renderWidget: (info) =>
      createElement(TodayMealsAndroid, {
        props: widgetPropsFor(json, today()),
        small: isSmallWidget(info.width),
      }),
    widgetNotFound: () => {},
  });
}
