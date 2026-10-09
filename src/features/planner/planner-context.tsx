import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { usePlannerStore } from '@/data/stores-context';
import type { IsoDate } from '@/domain/dates';
import type { FreezerItem, MealPlan } from '@/domain/planner';

type PlannerState = {
  plan: MealPlan;
  setMeal(date: IsoDate, recipeId: string | null): Promise<void>;
  freezer: FreezerItem[];
  saveFreezerItem(item: FreezerItem): Promise<void>;
  removeFreezerItem(id: string): Promise<void>;
};

const PlannerContext = createContext<PlannerState | null>(null);

export function PlannerProvider({ children }: { children: ReactNode }) {
  const store = usePlannerStore();
  const [plan, setPlan] = useState<MealPlan>({});
  const [freezer, setFreezer] = useState<FreezerItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([store.loadPlan().catch(() => ({})), store.listFreezer().catch(() => [])]).then(
      ([loadedPlan, loadedFreezer]) => {
        if (cancelled) return;
        setPlan(loadedPlan);
        setFreezer(loadedFreezer);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [store]);

  const setMeal = useCallback(
    async (date: IsoDate, recipeId: string | null) => {
      await store.setMeal(date, recipeId);
      setPlan((current) => {
        const next = { ...current };
        if (recipeId === null) delete next[date];
        else next[date] = recipeId;
        return next;
      });
    },
    [store],
  );

  const saveFreezerItem = useCallback(
    async (item: FreezerItem) => {
      await store.saveFreezerItem(item);
      setFreezer((current) => [item, ...current.filter((i) => i.id !== item.id)]);
    },
    [store],
  );

  const removeFreezerItem = useCallback(
    async (id: string) => {
      await store.removeFreezerItem(id);
      setFreezer((current) => current.filter((i) => i.id !== id));
    },
    [store],
  );

  const value = useMemo(
    () => ({ plan, setMeal, freezer, saveFreezerItem, removeFreezerItem }),
    [plan, setMeal, freezer, saveFreezerItem, removeFreezerItem],
  );
  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerState {
  const value = useContext(PlannerContext);
  if (!value) throw new Error('usePlanner must be used inside <PlannerProvider>');
  return value;
}
