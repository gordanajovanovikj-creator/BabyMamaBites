import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useFavoritesStore } from '@/data/stores-context';
import { toggleFavorite } from '@/domain/favorites';

type FavoritesState = {
  /** Saved recipe ids, most recent first. */
  ids: string[];
  isFavorite(id: string): boolean;
  toggle(id: string): void;
};

const FavoritesContext = createContext<FavoritesState | null>(null);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const store = useFavoritesStore();
  const [ids, setIds] = useState<string[]>([]);

  useEffect(() => {
    let cancelled = false;
    store
      .list()
      .catch(() => [])
      .then((loaded) => {
        if (!cancelled) setIds(loaded);
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const toggle = useCallback(
    (id: string) => {
      const saving = !ids.includes(id);
      setIds((current) => toggleFavorite(current, id));
      // Persist in the background; the UI has already updated.
      (saving ? store.add(id) : store.remove(id)).catch(() => {});
    },
    [ids, store],
  );

  const value = useMemo(
    () => ({ ids, isFavorite: (id: string) => ids.includes(id), toggle }),
    [ids, toggle],
  );
  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites(): FavoritesState {
  const value = useContext(FavoritesContext);
  if (!value) throw new Error('useFavorites must be used inside <FavoritesProvider>');
  return value;
}
