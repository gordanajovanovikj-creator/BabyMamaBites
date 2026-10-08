import { createContext, useContext } from 'react';

import type { FavoritesStore } from './favorites-store';

export const FavoritesStoreContext = createContext<FavoritesStore | null>(null);

export function useFavoritesStore(): FavoritesStore {
  const store = useContext(FavoritesStoreContext);
  if (!store) throw new Error('useFavoritesStore must be used inside <StorageProvider>');
  return store;
}
