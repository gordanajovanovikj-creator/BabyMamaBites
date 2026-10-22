// App entry: Expo Router, plus the Android home screen widget's background updater.
import 'expo-router/entry';

import { Platform } from 'react-native';

if (Platform.OS === 'android') {
  /* eslint-disable @typescript-eslint/no-require-imports */
  const { registerWidgetTaskHandler } =
    require('react-native-android-widget') as typeof import('react-native-android-widget');
  const { widgetTaskHandler } =
    require('./src/widgets/widget-task-handler') as typeof import('./src/widgets/widget-task-handler');
  /* eslint-enable @typescript-eslint/no-require-imports */
  registerWidgetTaskHandler(widgetTaskHandler);
}
