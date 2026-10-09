import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

import { fromIsoDate } from '@/domain/dates';
import type { PlannedReminder } from '@/domain/reminders';
import { colors } from '@/theme/colors';

/** Show reminders as quiet banners if they arrive while the app is open. */
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

const CHANNEL = 'reminders';

export const notificationsSupported = true;

/** Asks for permission only when needed (when the user turns a reminder on). */
export async function ensurePermission(): Promise<boolean> {
  const current = await Notifications.getPermissionsAsync();
  if (current.granted) return true;
  if (!current.canAskAgain) return false;
  const asked = await Notifications.requestPermissionsAsync({
    ios: { allowAlert: true, allowBadge: false, allowSound: true },
  });
  return asked.granted;
}

export async function hasPermission(): Promise<boolean> {
  return (await Notifications.getPermissionsAsync()).granted;
}

function toTrigger(r: PlannedReminder): Notifications.NotificationTriggerInput {
  const channelId = Platform.OS === 'android' ? CHANNEL : undefined;
  switch (r.trigger.kind) {
    case 'daily':
      return {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: r.trigger.hour,
        minute: r.trigger.minute,
        channelId,
      };
    case 'weekly':
      return {
        type: Notifications.SchedulableTriggerInputTypes.WEEKLY,
        weekday: r.trigger.weekday,
        hour: r.trigger.hour,
        minute: r.trigger.minute,
        channelId,
      };
    case 'date': {
      const date = fromIsoDate(r.trigger.date);
      date.setHours(r.trigger.hour, r.trigger.minute, 0, 0);
      return { type: Notifications.SchedulableTriggerInputTypes.DATE, date, channelId };
    }
  }
}

/** Replaces every scheduled reminder with this list (simple and idempotent). */
export async function syncReminders(reminders: PlannedReminder[]): Promise<void> {
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!reminders.length || !(await hasPermission())) return;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CHANNEL, {
      name: 'Gentle reminders',
      importance: Notifications.AndroidImportance.DEFAULT,
      lightColor: colors.light.primary,
    });
  }
  for (const r of reminders) {
    await Notifications.scheduleNotificationAsync({
      identifier: r.id,
      content: { title: r.title, body: r.body },
      trigger: toTrigger(r),
    });
  }
}
