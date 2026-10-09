import type { SQLiteDatabase } from 'expo-sqlite';

import {
  defaultReminderSettings,
  reminderSettingsSchema,
  type ReminderSettings,
} from '@/domain/reminders';

import type { SettingsStore } from './settings-store';

const REMINDERS = 'reminders';

export function parseReminders(raw: string | null | undefined): ReminderSettings {
  if (!raw) return defaultReminderSettings;
  try {
    const result = reminderSettingsSchema.safeParse(JSON.parse(raw));
    return result.success ? result.data : defaultReminderSettings;
  } catch {
    return defaultReminderSettings;
  }
}

export function createSqliteSettingsStore(db: SQLiteDatabase): SettingsStore {
  return {
    async loadReminders() {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM app_setting WHERE key = ?',
        REMINDERS,
      );
      return parseReminders(row?.value);
    },
    async saveReminders(settings) {
      await db.runAsync(
        `INSERT INTO app_setting (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        REMINDERS,
        JSON.stringify(settings),
      );
    },
  };
}
