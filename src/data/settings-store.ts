import type { ReminderSettings } from '@/domain/reminders';

/** Small app settings (reminders, disclaimer). SQLite on devices; localStorage on web. */
export type SettingsStore = {
  loadReminders(): Promise<ReminderSettings>;
  saveReminders(settings: ReminderSettings): Promise<void>;
  /** The date the medical disclaimer was accepted, or null if it hasn't been. */
  loadDisclaimerAccepted(): Promise<string | null>;
  saveDisclaimerAccepted(onDate: string): Promise<void>;
};
