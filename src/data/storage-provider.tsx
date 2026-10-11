import { SQLiteProvider, useSQLiteContext } from 'expo-sqlite';
import { useMemo, type ReactNode } from 'react';

import { ProfileStoreContext } from './profile-store-context';
import { createSqliteCalendarStore } from './sqlite-calendar-store';
import { createSqliteFavoritesStore } from './sqlite-favorites-store';
import { createSqliteFoodLogStore } from './sqlite-food-log-store';
import { createSqlitePlannerStore } from './sqlite-planner-store';
import { createSqliteSettingsStore } from './sqlite-settings-store';
import { createSqliteProfileStore, DATABASE_NAME, migrate } from './sqlite-profile-store';
import {
  CalendarStoreContext,
  FavoritesStoreContext,
  FoodLogStoreContext,
  PlannerStoreContext,
  SettingsStoreContext,
} from './stores-context';

function SqliteStores({ children }: { children: ReactNode }) {
  const db = useSQLiteContext();
  const profile = useMemo(() => createSqliteProfileStore(db), [db]);
  const favorites = useMemo(() => createSqliteFavoritesStore(db), [db]);
  const foodLog = useMemo(() => createSqliteFoodLogStore(db), [db]);
  const planner = useMemo(() => createSqlitePlannerStore(db), [db]);
  const settings = useMemo(() => createSqliteSettingsStore(db), [db]);
  const calendar = useMemo(() => createSqliteCalendarStore(db), [db]);
  return (
    <ProfileStoreContext.Provider value={profile}>
      <FavoritesStoreContext.Provider value={favorites}>
        <FoodLogStoreContext.Provider value={foodLog}>
          <PlannerStoreContext.Provider value={planner}>
            <SettingsStoreContext.Provider value={settings}>
              <CalendarStoreContext.Provider value={calendar}>
                {children}
              </CalendarStoreContext.Provider>
            </SettingsStoreContext.Provider>
          </PlannerStoreContext.Provider>
        </FoodLogStoreContext.Provider>
      </FavoritesStoreContext.Provider>
    </ProfileStoreContext.Provider>
  );
}

/** Opens the on-device database, runs migrations, and provides the stores. */
export function StorageProvider({ children }: { children: ReactNode }) {
  return (
    <SQLiteProvider databaseName={DATABASE_NAME} onInit={migrate}>
      <SqliteStores>{children}</SqliteStores>
    </SQLiteProvider>
  );
}
