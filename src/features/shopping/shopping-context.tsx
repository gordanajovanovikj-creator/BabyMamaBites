import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
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
  const [items, setItems] = useState<ShoppingItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    store
      .list()
      .catch(() => [])
      .then((loaded) => {
        if (!cancelled) setItems(sortShopping(loaded));
      });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const add = useCallback(
    async (lines: ShoppingLine[]) => {
      const added = itemsToAdd(items, lines);
      if (!added.length) return 0;
      await store.save(added);
      setItems((current) => [...current, ...added]);
      return added.length;
    },
    [items, store],
  );

  const toggle = useCallback(
    async (id: string) => {
      const item = items.find((i) => i.id === id);
      if (!item) return;
      const next = { ...item, checked: !item.checked };
      setItems((current) => current.map((i) => (i.id === id ? next : i)));
      await store.save([next]);
    },
    [items, store],
  );

  const remove = useCallback(
    async (id: string) => {
      setItems((current) => current.filter((i) => i.id !== id));
      await store.remove([id]);
    },
    [store],
  );

  const clearChecked = useCallback(async () => {
    const ids = items.filter((i) => i.checked).map((i) => i.id);
    setItems((current) => current.filter((i) => !i.checked));
    await store.remove(ids);
  }, [items, store]);

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
