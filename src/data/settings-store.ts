import type { ReminderSettings } from '@/domain/reminders';

/** Small app settings (reminders). SQLite on devices; localStorage on web. */
export type SettingsStore = {
  loadReminders(): Promise<ReminderSettings>;
  saveReminders(settings: ReminderSettings): Promise<void>;
};
