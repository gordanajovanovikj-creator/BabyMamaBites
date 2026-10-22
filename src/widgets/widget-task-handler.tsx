import type { WidgetTaskHandlerProps } from 'react-native-android-widget';

import { today } from '@/domain/dates';
import { widgetPropsFor } from '@/domain/widget';

import { loadWidgetDays } from './android-widget-store';
import { isSmallWidget, TodayMealsAndroid } from './today-meals-android';

/**
 * Android calls this when the widget is added, resized or due for its regular update
 * (every 30 minutes, so it rolls over to the new day). It shows today's saved meals.
 */
export async function widgetTaskHandler(props: WidgetTaskHandlerProps): Promise<void> {
  if (props.widgetInfo.widgetName !== 'TodayMeals') return;
  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      const saved = await loadWidgetDays().catch(() => null);
      props.renderWidget(
        <TodayMealsAndroid
          props={widgetPropsFor(saved, today())}
          small={isSmallWidget(props.widgetInfo.width)}
        />,
      );
      break;
    }
    default:
      break;
  }
}
