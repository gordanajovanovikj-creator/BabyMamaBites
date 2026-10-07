import type { SQLiteDatabase } from 'expo-sqlite';

import { migrations } from './migrations';
import { profileToRow, rowToProfile, type ProfileRow } from './profile-row';
import type { ProfileStore } from './profile-store';

export const DATABASE_NAME = 'mamababybites.db';

export async function migrate(db: SQLiteDatabase): Promise<void> {
  const result = await db.getFirstAsync<{ user_version: number }>('PRAGMA user_version');
  let version = result?.user_version ?? 0;
  if (version === 0) await db.execAsync('PRAGMA journal_mode = WAL;');
  while (version < migrations.length) {
    await db.withTransactionAsync(async () => {
      await db.execAsync(migrations[version]);
      await db.execAsync(`PRAGMA user_version = ${version + 1}`);
    });
    version += 1;
  }
}

export function createSqliteProfileStore(db: SQLiteDatabase): ProfileStore {
  return {
    async load() {
      const row = await db.getFirstAsync<ProfileRow>(
        'SELECT birth_date, due_date, feeding, allergens, diets, cooking_time FROM profile WHERE id = 1',
      );
      return row ? rowToProfile(row) : null;
    },
    async save(profile) {
      const row = profileToRow(profile);
      await db.runAsync(
        `INSERT INTO profile (id, birth_date, due_date, feeding, allergens, diets, cooking_time, updated_at)
         VALUES (1, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(id) DO UPDATE SET
           birth_date = excluded.birth_date,
           due_date = excluded.due_date,
           feeding = excluded.feeding,
           allergens = excluded.allergens,
           diets = excluded.diets,
           cooking_time = excluded.cooking_time,
           updated_at = excluded.updated_at`,
        row.birth_date,
        row.due_date,
        row.feeding,
        row.allergens,
        row.diets,
        row.cooking_time,
        new Date().toISOString(),
      );
    },
    async clear() {
      await db.runAsync('DELETE FROM profile');
    },
  };
}
