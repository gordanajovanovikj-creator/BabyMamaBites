import { registerWidgetTaskHandler } from 'react-native-android-widget';

import { widgetTaskHandler } from './widget-task-handler';

// Lets Android update the home screen widget in the background, even with the app closed.
registerWidgetTaskHandler(widgetTaskHandler);
