import type { ReactNode } from 'react';

import { foodLogEntrySchema, type FoodLogEntry } from '@/domain/food-log';
import { profileSchema } from '@/domain/profile';

import type { FavoritesStore } from './favorites-store';
import type { FoodLogStore } from './food-log-store';
import type { ProfileStore } from './profile-store';
import { ProfileStoreContext } from './profile-store-context';
import { FavoritesStoreContext, FoodLogStoreContext } from './stores-context';

const KEY = 'mamababybites.profile';

/** Browser preview only: keeps the profile in localStorage instead of SQLite. */
const localStore: ProfileStore = {
  async load() {
    try {
      const raw = globalThis.localStorage?.getItem(KEY);
      if (!raw) return null;
      const result = profileSchema.safeParse(JSON.parse(raw));
      return result.success ? result.data : null;
    } catch {
      return null;
    }
  },
  async save(profile) {
    globalThis.localStorage?.setItem(KEY, JSON.stringify(profile));
  },
  async clear() {
    globalThis.localStorage?.removeItem(KEY);
  },
};

const FAVORITES_KEY = 'mamababybites.favorites';

function readFavorites(): string[] {
  try {
    const raw = globalThis.localStorage?.getItem(FAVORITES_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === 'string') : [];
  } catch {
    return [];
  }
}

const localFavorites: FavoritesStore = {
  async list() {
    return readFavorites();
  },
  async add(id) {
    const next = [id, ...readFavorites().filter((x) => x !== id)];
    globalThis.localStorage?.setItem(FAVORITES_KEY, JSON.stringify(next));
  },
  async remove(id) {
    const next = readFavorites().filter((x) => x !== id);
    globalThis.localStorage?.setItem(FAVORITES_KEY, JSON.stringify(next));
  },
};

const FOOD_LOG_KEY = 'mamababybites.foodLog';

function readFoodLog(): FoodLogEntry[] {
  try {
    const raw = globalThis.localStorage?.getItem(FOOD_LOG_KEY);
    const parsed: unknown = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((x) => {
      const result = foodLogEntrySchema.safeParse(x);
      return result.success ? [result.data] : [];
    });
  } catch {
    return [];
  }
}

function writeFoodLog(entries: FoodLogEntry[]) {
  globalThis.localStorage?.setItem(FOOD_LOG_KEY, JSON.stringify(entries));
}

const localFoodLog: FoodLogStore = {
  async list() {
    return readFoodLog();
  },
  async add(entry) {
    writeFoodLog([entry, ...readFoodLog().filter((e) => e.id !== entry.id)]);
  },
  async remove(id) {
    writeFoodLog(readFoodLog().filter((e) => e.id !== id));
  },
};

export function StorageProvider({ children }: { children: ReactNode }) {
  return (
    <ProfileStoreContext.Provider value={localStore}>
      <FavoritesStoreContext.Provider value={localFavorites}>
        <FoodLogStoreContext.Provider value={localFoodLog}>{children}</FoodLogStoreContext.Provider>
      </FavoritesStoreContext.Provider>
    </ProfileStoreContext.Provider>
  );
}
