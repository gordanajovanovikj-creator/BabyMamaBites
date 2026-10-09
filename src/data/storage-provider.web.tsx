import type { ReactNode } from 'react';

import { foodLogEntrySchema, type FoodLogEntry } from '@/domain/food-log';
import {
  freezerItemSchema,
  normalizePlan,
  planKey,
  type FreezerItem,
  type MealPlan,
} from '@/domain/planner';
import { profileSchema } from '@/domain/profile';

import type { FavoritesStore } from './favorites-store';
import type { FoodLogStore } from './food-log-store';
import type { PlannerStore } from './planner-store';
import type { SettingsStore } from './settings-store';
import { parseReminders } from './sqlite-settings-store';
import type { ProfileStore } from './profile-store';
import { ProfileStoreContext } from './profile-store-context';
import {
  FavoritesStoreContext,
  FoodLogStoreContext,
  PlannerStoreContext,
  SettingsStoreContext,
} from './stores-context';

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
  return normalizePlan(value as Record<string, unknown>);
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
  async setMeal(date, slot, recipeId) {
    const plan = readPlan();
    const key = planKey(date, slot);
    if (recipeId === null) delete plan[key];
    else plan[key] = recipeId;
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

const REMINDERS_KEY = 'mamababybites.reminders';

const localSettings: SettingsStore = {
  async loadReminders() {
    try {
      return parseReminders(globalThis.localStorage?.getItem(REMINDERS_KEY));
    } catch {
      return parseReminders(null);
    }
  },
  async saveReminders(settings) {
    globalThis.localStorage?.setItem(REMINDERS_KEY, JSON.stringify(settings));
  },
};

export function StorageProvider({ children }: { children: ReactNode }) {
  return (
    <ProfileStoreContext.Provider value={localStore}>
      <FavoritesStoreContext.Provider value={localFavorites}>
        <FoodLogStoreContext.Provider value={localFoodLog}>
          <PlannerStoreContext.Provider value={localPlanner}>
            <SettingsStoreContext.Provider value={localSettings}>
              {children}
            </SettingsStoreContext.Provider>
          </PlannerStoreContext.Provider>
        </FoodLogStoreContext.Provider>
      </FavoritesStoreContext.Provider>
    </ProfileStoreContext.Provider>
  );
}
