import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

import { freeTrialDays, type ActiveSubscriptionInfo } from '@/domain/subscription';

type ExpoIap = typeof import('expo-iap');

let iap: ExpoIap | null | undefined;

/**
 * expo-iap, loaded only in an iPhone build that includes it. Expo Go and the web preview
 * have no App Store module, so there it's null and the app runs without purchases.
 */
function store(): ExpoIap | null {
  if (iap !== undefined) return iap;
  if (Platform.OS !== 'ios' || isRunningInExpoGo()) {
    iap = null;
    return iap;
  }
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    iap = require('expo-iap') as ExpoIap;
  } catch {
    iap = null;
  }
  return iap;
}

/** Whether App Store purchases can work in this build. */
export function storeAvailable(): boolean {
  return store() !== null;
}

/** A plan as the App Store shows it: localized price and the free trial it offers. */
export type StoreProduct = {
  productId: string;
  /** Localized, e.g. "$79.99". */
  displayPrice: string;
  /** ISO currency code of that price, e.g. "USD". */
  currency: string;
  /** Free-trial days set up in App Store Connect (0 if none). */
  trialDays: number;
  /** Subscription group, for checking free-trial eligibility. */
  groupId: string | null;
};

export type PurchaseResult =
  | { status: 'subscribed' }
  | { status: 'cancelled' }
  | { status: 'failed' }
  /** Ask to Buy: waiting for a parent or guardian to approve. */
  | { status: 'pending' }
  | { status: 'unavailable' };

export async function connect(): Promise<boolean> {
  const s = store();
  if (!s) return false;
  return s.initConnection();
}

export async function loadProducts(productIds: string[]): Promise<StoreProduct[]> {
  const s = store();
  if (!s) return [];
  const products = (await s.fetchProducts({ skus: productIds, type: 'subs' })) ?? [];
  return products.flatMap((p) =>
    p.platform === 'ios' && p.type === 'subs'
      ? [
          {
            productId: p.id,
            displayPrice: p.displayPrice,
            currency: p.currency,
            trialDays: freeTrialDays(p),
            groupId: p.subscriptionGroupIdIOS ?? null,
          },
        ]
      : [],
  );
}

export async function activeSubscriptions(productIds: string[]): Promise<ActiveSubscriptionInfo[]> {
  const s = store();
  if (!s) return [];
  const subs = await s.getActiveSubscriptions(productIds);
  return subs.map((sub) => ({
    productId: sub.productId,
    isActive: sub.isActive,
    expirationDateIOS: sub.expirationDateIOS ?? null,
  }));
}

/** Whether this Apple account can still get the free trial (it's offered once per group). */
export async function trialEligible(groupId: string | null): Promise<boolean> {
  const s = store();
  if (!s || !groupId) return false;
  return s.isEligibleForIntroOfferIOS(groupId).catch(() => false);
}

/**
 * Finishes purchases the App Store delivers outside a purchase sheet (renewals, Ask to
 * Buy approvals, purchases interrupted last time). Returns a function that stops listening.
 */
export function onPurchaseDelivered(listener: () => void): () => void {
  const s = store();
  if (!s) return () => {};
  const sub = s.purchaseUpdatedListener((purchase) => {
    s.finishTransaction({ purchase, isConsumable: false })
      .catch(() => {})
      .finally(listener);
  });
  return () => sub.remove();
}

/** Opens Apple's purchase sheet for a plan and waits for the answer. */
export function buy(productId: string): Promise<PurchaseResult> {
  const s = store();
  if (!s) return Promise.resolve({ status: 'unavailable' });
  return new Promise((resolve) => {
    // Older transactions for the same plan can replay at any time; only this purchase counts.
    // (A little slack for the clock difference between the App Store and the phone.)
    const startedAt = Date.now() - 60_000;
    let settled = false;
    const done = (result: PurchaseResult) => {
      if (settled) return;
      settled = true;
      ok.remove();
      failed.remove();
      resolve(result);
    };
    const ok = s.purchaseUpdatedListener((purchase) => {
      if (purchase.productId !== productId || purchase.transactionDate < startedAt) return;
      s.finishTransaction({ purchase, isConsumable: false })
        .catch(() => {})
        .finally(() => done({ status: 'subscribed' }));
    });
    const failed = s.purchaseErrorListener((error) => {
      if (error.code === s.ErrorCode.DeferredPayment) done({ status: 'pending' });
      else done({ status: s.isUserCancelledError(error) ? 'cancelled' : 'failed' });
    });
    s.requestPurchase({ request: { apple: { sku: productId } }, type: 'subs' }).catch(
      (error: unknown) => done({ status: s.isUserCancelledError(error) ? 'cancelled' : 'failed' }),
    );
  });
}

/** Asks the App Store for this Apple account's earlier purchases. */
export async function restore(): Promise<void> {
  const s = store();
  if (!s) return;
  await s.restorePurchases();
}

/** Opens Apple's "Manage subscription" screen. */
export async function manage(): Promise<void> {
  const s = store();
  if (!s) return;
  await s.deepLinkToSubscriptions({});
}
