import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';

import { useShoppingStore } from '@/data/stores-context';
import { itemsToAdd, sortShopping, type ShoppingItem, type ShoppingLine } from '@/domain/shopping';

type ShoppingState = {
  items: ShoppingItem[];
  /** Adds the lines that aren't already on the list; resolves to how many were added. */
  add(lines: ShoppingLine[]): Promise<number>;
  toggle(id: string): Promise<void>;
  remove(id: string): Promise<void>;
  clearChecked(): Promise<void>;
};

const ShoppingContext = createContext<ShoppingState | null>(null);

/** The shopping list, kept on this phone only. */
export function ShoppingProvider({ children }: { children: ReactNode }) {
  const store = useShoppingStore();
  const [items, setItemsState] = useState<ShoppingItem[]>([]);
  // The latest list, so taps in quick succession (or Done and + together) never act on an
  // old copy: two adds of the same item, or a double tap that only toggles once.
  const latest = useRef<ShoppingItem[]>([]);
  const setItems = useCallback((next: (current: ShoppingItem[]) => ShoppingItem[]) => {
    latest.current = next(latest.current);
    setItemsState(latest.current);
  }, []);

  useEffect(() => {
    let cancelled = false;
    store
      .list()
      .catch(() => [])
      .then((loaded) => {
        if (!cancelled) setItems(() => sortShopping(loaded));
      });
    return () => {
      cancelled = true;
    };
  }, [setItems, store]);

  const add = useCallback(
    async (lines: ShoppingLine[]) => {
      const added = itemsToAdd(latest.current, lines);
      if (!added.length) return 0;
      setItems((current) => [...current, ...added]);
      try {
        await store.save(added);
      } catch (error) {
        const ids = new Set(added.map((i) => i.id));
        setItems((current) => current.filter((i) => !ids.has(i.id)));
        throw error;
      }
      return added.length;
    },
    [setItems, store],
  );

  const toggle = useCallback(
    async (id: string) => {
      const item = latest.current.find((i) => i.id === id);
      if (!item) return;
      const next = { ...item, checked: !item.checked };
      setItems((current) => current.map((i) => (i.id === id ? next : i)));
      try {
        await store.save([next]);
      } catch (error) {
        // Put it back, so the screen never shows a change that wasn't saved.
        setItems((current) => current.map((i) => (i.id === id ? item : i)));
        throw error;
      }
    },
    [setItems, store],
  );

  const remove = useCallback(
    async (id: string) => {
      setItems((current) => current.filter((i) => i.id !== id));
      await store.remove([id]);
    },
    [setItems, store],
  );

  const clearChecked = useCallback(async () => {
    const ids = latest.current.filter((i) => i.checked).map((i) => i.id);
    setItems((current) => current.filter((i) => !i.checked));
    await store.remove(ids);
  }, [setItems, store]);

  const value = useMemo(
    () => ({ items, add, toggle, remove, clearChecked }),
    [items, add, toggle, remove, clearChecked],
  );
  return <ShoppingContext.Provider value={value}>{children}</ShoppingContext.Provider>;
}

export function useShopping(): ShoppingState {
  const value = useContext(ShoppingContext);
  if (!value) throw new Error('useShopping must be used inside <ShoppingProvider>');
  return value;
}
