import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { AppState } from 'react-native';

import { useSettingsStore } from '@/data/stores-context';
import {
  cachedPremiumValid,
  planProductIds,
  plans,
  premiumFromSubscriptions,
  type PlanId,
} from '@/domain/subscription';

import {
  activeSubscriptions,
  buy,
  connect,
  loadProducts,
  manage,
  onPurchaseDelivered,
  restore,
  storeAvailable,
  trialEligible,
  type PurchaseResult,
  type StoreProduct,
} from './app-store';

type SubscriptionState = {
  /** True while the first check runs and nothing is remembered yet. */
  loading: boolean;
  premium: boolean;
  /** Whether App Store purchases work in this build (not in Expo Go or on the web). */
  canPurchase: boolean;
  /** Store products by plan, with localized prices; empty until loaded. */
  products: Partial<Record<PlanId, StoreProduct>>;
  /** Whether this Apple account can still start the free trial. */
  trialEligible: boolean;
  subscribe(plan: PlanId): Promise<PurchaseResult>;
  /** Resolves to whether a subscription was found. */
  restore(): Promise<boolean>;
  manage(): Promise<void>;
  /** Development builds without the App Store unlock everything; this previews the free tier. */
  previewFree: boolean;
  setPreviewFree(on: boolean): void;
};

const SubscriptionContext = createContext<SubscriptionState | null>(null);

/** Whether development builds without the App Store (Expo Go, web preview) unlock Premium. */
const devUnlocked = __DEV__ && !storeAvailable();

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const settings = useSettingsStore();
  const [loading, setLoading] = useState(!devUnlocked);
  const [premium, setPremium] = useState(false);
  const [products, setProducts] = useState<Partial<Record<PlanId, StoreProduct>>>({});
  const [eligible, setEligible] = useState(false);
  const [previewFree, setPreviewFree] = useState(false);

  /** Asks the App Store which of our plans are active and remembers the answer. */
  const check = useCallback(async () => {
    const result = premiumFromSubscriptions(await activeSubscriptions(planProductIds));
    setPremium(result.premium);
    // Without an end date there's nothing safe to remember; the store is asked each launch.
    await settings.savePremiumUntil(result.until).catch(() => {});
    return result.premium;
  }, [settings]);

  useEffect(() => {
    if (devUnlocked) return;
    let cancelled = false;
    (async () => {
      const until = await settings.loadPremiumUntil().catch(() => null);
      if (!cancelled && cachedPremiumValid(until)) {
        setPremium(true);
        setLoading(false);
      }
      if (!(await connect().catch(() => false))) return;
      const loaded = await loadProducts(planProductIds).catch(() => []);
      if (cancelled) return;
      const byPlan: Partial<Record<PlanId, StoreProduct>> = {};
      for (const id of Object.keys(plans) as PlanId[]) {
        const p = loaded.find((x) => x.productId === plans[id].productId);
        if (p) byPlan[id] = p;
      }
      setProducts(byPlan);
      const groupId = loaded.find((p) => p.groupId)?.groupId ?? null;
      setEligible(await trialEligible(groupId));
      await check().catch(() => {});
    })().finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => {
      cancelled = true;
    };
  }, [settings, check]);

  // Renewals, cancellations and Ask to Buy approvals: check again when they arrive and
  // whenever the app comes back to the front.
  useEffect(() => {
    if (devUnlocked) return;
    const stop = onPurchaseDelivered(() => {
      check().catch(() => {});
    });
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') check().catch(() => {});
    });
    return () => {
      stop();
      sub.remove();
    };
  }, [check]);

  const subscribe = useCallback(
    async (plan: PlanId) => {
      const result = await buy(plans[plan].productId);
      if (result.status === 'subscribed') {
        setPremium(true);
        setEligible(false);
        await check().catch(() => {});
      }
      return result;
    },
    [check],
  );

  const restoreAndCheck = useCallback(async () => {
    await restore();
    return check();
  }, [check]);

  const value = useMemo(
    () => ({
      loading,
      premium: devUnlocked ? !previewFree : premium,
      canPurchase: storeAvailable(),
      products,
      trialEligible: eligible,
      subscribe,
      restore: restoreAndCheck,
      manage,
      previewFree,
      setPreviewFree,
    }),
    [loading, premium, products, eligible, subscribe, restoreAndCheck, previewFree],
  );
  return <SubscriptionContext.Provider value={value}>{children}</SubscriptionContext.Provider>;
}

export function useSubscription(): SubscriptionState {
  const value = useContext(SubscriptionContext);
  if (!value) throw new Error('useSubscription must be used inside <SubscriptionProvider>');
  return value;
}

/** True for development builds without the App Store, where Premium is unlocked for testing. */
export const premiumUnlockedForDevelopment = devUnlocked;
