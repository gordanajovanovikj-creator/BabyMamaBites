import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { useCalendarStore } from '@/data/stores-context';
import type { CalendarEntry } from '@/domain/calendar';

type CalendarState = {
  entries: CalendarEntry[];
  save(entry: CalendarEntry): Promise<void>;
  remove(id: string): Promise<void>;
};

const CalendarContext = createContext<CalendarState | null>(null);

export function CalendarProvider({ children }: { children: ReactNode }) {
  const store = useCalendarStore();
  const [entries, setEntries] = useState<CalendarEntry[]>([]);

  useEffect(() => {
    let cancelled = false;
    store
      .list()
      .catch(() => [])
      .then((loaded) => {
        if (!cancelled) setEntries(loaded);
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const save = useCallback(
    async (entry: CalendarEntry) => {
      await store.save(entry);
      setEntries((current) => [entry, ...current.filter((e) => e.id !== entry.id)]);
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

  const value = useMemo(() => ({ entries, save, remove }), [entries, save, remove]);
  return <CalendarContext.Provider value={value}>{children}</CalendarContext.Provider>;
}

export function useCalendar(): CalendarState {
  const value = useContext(CalendarContext);
  if (!value) throw new Error('useCalendar must be used inside <CalendarProvider>');
  return value;
}
