import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useFoodLogStore } from '@/data/stores-context';
import { sortEntries, type FoodLogEntry } from '@/domain/food-log';

type FoodLogState = {
  /** Newest first. */
  entries: FoodLogEntry[];
  add(entry: FoodLogEntry): Promise<void>;
  remove(id: string): Promise<void>;
};

const FoodLogContext = createContext<FoodLogState | null>(null);

export function FoodLogProvider({ children }: { children: ReactNode }) {
  const store = useFoodLogStore();
  const [entries, setEntries] = useState<FoodLogEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    store
      .list()
      .catch(() => [])
      .then((loaded) => {
        if (!cancelled) setEntries(sortEntries(loaded));
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const add = useCallback(
    async (entry: FoodLogEntry) => {
      await store.add(entry);
      setEntries((current) => sortEntries([entry, ...current.filter((e) => e.id !== entry.id)]));
    },
    [store],
  );

  const remove = useCallback(
    async (id: string) => {
      await store.remove(id);
      setEntries((current) => current.filter((e) => e.id !== id));
    },
    [store],
  );

  const value = useMemo(() => ({ entries, add, remove }), [entries, add, remove]);
  return <FoodLogContext.Provider value={value}>{children}</FoodLogContext.Provider>;
}

export function useFoodLog(): FoodLogState {
  const value = useContext(FoodLogContext);
  if (!value) throw new Error('useFoodLog must be used inside <FoodLogProvider>');
  return value;
}
