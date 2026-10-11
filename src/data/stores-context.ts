import { createContext, useContext } from 'react';

import type { CalendarStore } from './calendar-store';
import type { FavoritesStore } from './favorites-store';
import type { FoodLogStore } from './food-log-store';
import type { PlannerStore } from './planner-store';
import type { SettingsStore } from './settings-store';

export const CalendarStoreContext = createContext<CalendarStore | null>(null);
export const FavoritesStoreContext = createContext<FavoritesStore | null>(null);
export const FoodLogStoreContext = createContext<FoodLogStore | null>(null);
export const PlannerStoreContext = createContext<PlannerStore | null>(null);
export const SettingsStoreContext = createContext<SettingsStore | null>(null);

export function useFavoritesStore(): FavoritesStore {
  const store = useContext(FavoritesStoreContext);
  if (!store) throw new Error('useFavoritesStore must be used inside <StorageProvider>');
  return store;
}

export function useFoodLogStore(): FoodLogStore {
  const store = useContext(FoodLogStoreContext);
  if (!store) throw new Error('useFoodLogStore must be used inside <StorageProvider>');
  return store;
}

export function usePlannerStore(): PlannerStore {
  const store = useContext(PlannerStoreContext);
  if (!store) throw new Error('usePlannerStore must be used inside <StorageProvider>');
  return store;
}

export function useSettingsStore(): SettingsStore {
  const store = useContext(SettingsStoreContext);
  if (!store) throw new Error('useSettingsStore must be used inside <StorageProvider>');
  return store;
}

export function useCalendarStore(): CalendarStore {
  const store = useContext(CalendarStoreContext);
  if (!store) throw new Error('useCalendarStore must be used inside <StorageProvider>');
  return store;
}
