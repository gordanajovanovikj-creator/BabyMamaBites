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
import {
  planKey,
  type FamilyPlan,
  type FreezerItem,
  type MealPlan,
  type MealSlot,
} from '@/domain/planner';

type PlannerState = {
  plan: MealPlan;
  /** Also resets that slot's family meal to the new recipe's suggestion. */
  setMeal(date: IsoDate, slot: MealSlot, recipeId: string | null): Promise<void>;
  family: FamilyPlan;
  /** A grown-up recipe id, `NO_FAMILY_MEAL`, or null for the suggested family meal. */
  setFamilyMeal(date: IsoDate, slot: MealSlot, choice: string | null): Promise<void>;
  freezer: FreezerItem[];
  saveFreezerItem(item: FreezerItem): Promise<void>;
  removeFreezerItem(id: string): Promise<void>;
};

const PlannerContext = createContext<PlannerState | null>(null);

function withEntry(map: Record<string, string>, key: string, value: string | null) {
  const next = { ...map };
  if (value === null) delete next[key];
  else next[key] = value;
  return next;
}

export function PlannerProvider({ children }: { children: ReactNode }) {
  const store = usePlannerStore();
  const [plan, setPlan] = useState<MealPlan>({});
  const [family, setFamily] = useState<FamilyPlan>({});
  const [freezer, setFreezer] = useState<FreezerItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      store.loadPlan().catch(() => ({})),
      store.loadFamilyPlan().catch(() => ({})),
      store.listFreezer().catch(() => []),
    ]).then(([loadedPlan, loadedFamily, loadedFreezer]) => {
      if (cancelled) return;
      setPlan(loadedPlan);
      setFamily(loadedFamily);
      setFreezer(loadedFreezer);
    });
    return () => {
      cancelled = true;
    };
  }, [store]);

  const setFamilyMeal = useCallback(
    async (date: IsoDate, slot: MealSlot, choice: string | null) => {
      await store.setFamilyMeal(date, slot, choice);
      setFamily((current) => withEntry(current, planKey(date, slot), choice));
    },
    [store],
  );

  const setMeal = useCallback(
    async (date: IsoDate, slot: MealSlot, recipeId: string | null) => {
      await store.setMeal(date, slot, recipeId);
      setPlan((current) => withEntry(current, planKey(date, slot), recipeId));
      if (family[planKey(date, slot)] !== undefined) await setFamilyMeal(date, slot, null);
    },
    [store, family, setFamilyMeal],
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
    () => ({ plan, setMeal, family, setFamilyMeal, freezer, saveFreezerItem, removeFreezerItem }),
    [plan, setMeal, family, setFamilyMeal, freezer, saveFreezerItem, removeFreezerItem],
  );
  return <PlannerContext.Provider value={value}>{children}</PlannerContext.Provider>;
}

export function usePlanner(): PlannerState {
  const value = useContext(PlannerContext);
  if (!value) throw new Error('usePlanner must be used inside <PlannerProvider>');
  return value;
}
