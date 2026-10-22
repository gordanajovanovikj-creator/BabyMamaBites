import { openDatabaseAsync } from 'expo-sqlite';

import { DATABASE_NAME } from '@/data/sqlite-profile-store';

const KEY = 'android-widget-days';

/**
 * The Android widget's week of meals, kept in the app's own database on the phone. The app
 * writes it whenever the meal plan changes; the widget reads it when Android asks for an
 * update, even with the app closed. Nothing here leaves the device.
 */
async function db() {
  const database = await openDatabaseAsync(DATABASE_NAME);
  await database.execAsync(
    'CREATE TABLE IF NOT EXISTS app_setting (key TEXT PRIMARY KEY NOT NULL, value TEXT NOT NULL);',
  );
  return database;
}

export async function saveWidgetDays(json: string): Promise<void> {
  const database = await db();
  await database.runAsync(
    `INSERT INTO app_setting (key, value) VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value`,
    KEY,
    json,
  );
}

export async function loadWidgetDays(): Promise<string | null> {
  const database = await db();
  const row = await database.getFirstAsync<{ value: string }>(
    'SELECT value FROM app_setting WHERE key = ?',
    KEY,
  );
  return row?.value ?? null;
}
