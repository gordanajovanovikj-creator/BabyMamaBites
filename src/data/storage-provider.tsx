import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useMemo, type ReactNode } from 'react';

import { ProfileStoreContext } from './profile-store-context';
import { createSqliteProfileStore, DATABASE_NAME, migrate } from './sqlite-profile-store';

function SqliteStores({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const store = useMemo(() => createSqliteProfileStore(db), [db]);
  return <ProfileStoreContext.Provider value={store}>{children}</ProfileStoreContext.Provider>;
}

/** Opens the on-device database, runs migrations, and provides the stores. */
export function StorageProvider({ children }: { children: ReactNode }) {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
      <SqliteStores>{children}</SqliteStores>
    </SQLiteProvider>
  );
}
