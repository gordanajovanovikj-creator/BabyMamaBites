import { createContext, useContext } from 'react';

import type { FavoritesStore } from './favorites-store';
import type { FoodLogStore } from './food-log-store';

export const FavoritesStoreContext = createContext<FavoritesStore | null>(null);
export const FoodLogStoreContext = createContext<FoodLogStore | null>(null);

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
