import type { ReactNode } from 'react';

import { foodLogEntrySchema, type FoodLogEntry } from '@/domain/food-log';
import { freezerItemSchema, type FreezerItem, type MealPlan } from '@/domain/planner';
import { profileSchema } from '@/domain/profile';

import type { FavoritesStore } from './favorites-store';
import type { FoodLogStore } from './food-log-store';
import type { PlannerStore } from './planner-store';
import type { ProfileStore } from './profile-store';
import { ProfileStoreContext } from './profile-store-context';
import { FavoritesStoreContext, FoodLogStoreContext, PlannerStoreContext } from './stores-context';

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

const PLAN_KEY = 'mamababybites.mealPlan';
const FREEZER_KEY = 'mamababybites.freezer';

function readJson(key: string): unknown {
  try {
    const raw = globalThis.localStorage?.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function readPlan(): MealPlan {
  const value = readJson(PLAN_KEY);
  if (!value || typeof value !== 'object') return {};
  return Object.fromEntries(
    Object.entries(value).filter((e): e is [string, string] => typeof e[1] === 'string'),
  );
}

function readFreezer(): FreezerItem[] {
  const value = readJson(FREEZER_KEY);
  if (!Array.isArray(value)) return [];
  return value.flatMap((x) => {
    const r = freezerItemSchema.safeParse(x);
    return r.success ? [r.data] : [];
  });
}

const localPlanner: PlannerStore = {
  async loadPlan() {
    return readPlan();
  },
  async setMeal(date, recipeId) {
    const plan = readPlan();
    if (recipeId === null) delete plan[date];
    else plan[date] = recipeId;
    globalThis.localStorage?.setItem(PLAN_KEY, JSON.stringify(plan));
  },
  async listFreezer() {
    return readFreezer();
  },
  async saveFreezerItem(item) {
    const next = [item, ...readFreezer().filter((i) => i.id !== item.id)];
    globalThis.localStorage?.setItem(FREEZER_KEY, JSON.stringify(next));
  },
  async removeFreezerItem(id) {
    const next = readFreezer().filter((i) => i.id !== id);
    globalThis.localStorage?.setItem(FREEZER_KEY, JSON.stringify(next));
  },
};

export function StorageProvider({ children }: { children: ReactNode }) {
  return (
    <ProfileStoreContext.Provider value={localStore}>
      <FavoritesStoreContext.Provider value={localFavorites}>
        <FoodLogStoreContext.Provider value={localFoodLog}>
          <PlannerStoreContext.Provider value={localPlanner}>
            {children}
          </PlannerStoreContext.Provider>
        </FoodLogStoreContext.Provider>
      </FavoritesStoreContext.Provider>
    </ProfileStoreContext.Provider>
  );
}
