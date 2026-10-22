import type { SQLiteDatabase } from 'expo-sqlite';

import {
  defaultReminderSettings,
  reminderSettingsSchema,
  type ReminderSettings,
} from '@/domain/reminders';

import type { SettingsStore } from './settings-store';

const REMINDERS = 'reminders';
const DISCLAIMER = 'disclaimer-accepted';
const CHAT_CONSENT = 'chat-consent';
const PREMIUM_UNTIL = 'premium-until';
const TOUR_SEEN = 'tour-seen';

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
    async loadDisclaimerAccepted() {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM app_setting WHERE key = ?',
        DISCLAIMER,
      );
      return row?.value ?? null;
    },
    async saveDisclaimerAccepted(onDate) {
      await db.runAsync(
        `INSERT INTO app_setting (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        DISCLAIMER,
        onDate,
      );
    },
    async loadChatConsent() {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM app_setting WHERE key = ?',
        CHAT_CONSENT,
      );
      return row?.value ?? null;
    },
    async saveChatConsent(onDate) {
      await db.runAsync(
        `INSERT INTO app_setting (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        CHAT_CONSENT,
        onDate,
      );
    },
    async loadPremiumUntil() {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM app_setting WHERE key = ?',
        PREMIUM_UNTIL,
      );
      return row?.value ?? null;
    },
    async savePremiumUntil(until) {
      if (until === null) {
        await db.runAsync('DELETE FROM app_setting WHERE key = ?', PREMIUM_UNTIL);
        return;
      }
      await db.runAsync(
        `INSERT INTO app_setting (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        PREMIUM_UNTIL,
        until,
      );
    },
    async loadTourSeen() {
      const row = await db.getFirstAsync<{ value: string }>(
        'SELECT value FROM app_setting WHERE key = ?',
        TOUR_SEEN,
      );
      return row?.value ?? null;
    },
    async saveTourSeen(onDate) {
      await db.runAsync(
        `INSERT INTO app_setting (key, value) VALUES (?, ?)
         ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
        TOUR_SEEN,
        onDate,
      );
    },
  };
}
