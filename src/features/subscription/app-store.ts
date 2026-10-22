import { isRunningInExpoGo } from 'expo';
import { Linking, Platform } from 'react-native';

import {
  androidTrialDays,
  freeTrialDays,
  type ActiveSubscriptionInfo,
} from '@/domain/subscription';

type ExpoIap = typeof import('expo-iap');

let iap: ExpoIap | null | undefined;

/**
 * expo-iap, loaded only in an iPhone or Android build that includes it. Expo Go and the web
 * preview have no store module, so there it's null and the app runs without purchases.
 */
function store(): ExpoIap | null {
  if (iap !== undefined) return iap;
  if ((Platform.OS !== 'ios' && Platform.OS !== 'android') || isRunningInExpoGo()) {
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

/** Whether App Store or Google Play purchases can work in this build. */
export function storeAvailable(): boolean {
  return store() !== null;
}

/** A plan as the store shows it: localized price and the free trial it offers. */
export type StoreProduct = {
  productId: string;
  /** Localized, e.g. "$79.99". */
  displayPrice: string;
  /** ISO currency code of that price, e.g. "USD". */
  currency: string;
  /** Free-trial days set up in App Store Connect or the Play Console (0 if none). */
  trialDays: number;
  /** Apple's subscription group, for checking free-trial eligibility. */
  groupId: string | null;
};

/** Google Play buys a specific offer of a subscription: the free trial when there is one. */
const androidOfferTokens = new Map<string, string>();

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
  return products.flatMap((p): StoreProduct[] => {
    if (p.type !== 'subs') return [];
    if (p.platform === 'ios') {
      return [
        {
          productId: p.id,
          displayPrice: p.displayPrice,
          currency: p.currency,
          trialDays: freeTrialDays(p),
          groupId: p.subscriptionGroupIdIOS ?? null,
        },
      ];
    }
    const offers = p.subscriptionOffers ?? [];
    const trial = offers.find((o) => o.paymentMode === 'free-trial' && o.offerTokenAndroid);
    const offer = trial ?? offers.find((o) => o.offerTokenAndroid);
    if (!offer?.offerTokenAndroid) return [];
    androidOfferTokens.set(p.id, offer.offerTokenAndroid);
    return [
      {
        productId: p.id,
        displayPrice: p.displayPrice,
        currency: p.currency,
        trialDays: androidTrialDays(offers),
        groupId: null,
      },
    ];
  });
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

/**
 * Whether this account can still get the free trial. Apple offers it once per subscription
 * group; Google Play only lists the trial offer to accounts that can still use it.
 */
export async function trialEligible(products: StoreProduct[]): Promise<boolean> {
  const s = store();
  if (!s) return false;
  if (Platform.OS === 'android') return products.some((p) => p.trialDays > 0);
  const groupId = products.find((p) => p.groupId)?.groupId;
  if (!groupId) return false;
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
    // A pending Google Play payment can't be finished yet; it arrives again once it clears.
    if (purchase.purchaseState === 'pending') return;
    s.finishTransaction({ purchase, isConsumable: false })
      .catch(() => {})
      .finally(listener);
  });
  return () => sub.remove();
}

/** Opens the App Store or Google Play purchase sheet for a plan and waits for the answer. */
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
      if (purchase.purchaseState === 'pending') {
        done({ status: 'pending' });
        return;
      }
      s.finishTransaction({ purchase, isConsumable: false })
        .catch(() => {})
        .finally(() => done({ status: 'subscribed' }));
    });
    const failed = s.purchaseErrorListener((error) => {
      if (error.code === s.ErrorCode.DeferredPayment) done({ status: 'pending' });
      else done({ status: s.isUserCancelledError(error) ? 'cancelled' : 'failed' });
    });
    const offerToken = androidOfferTokens.get(productId);
    if (Platform.OS === 'android' && !offerToken) {
      done({ status: 'unavailable' });
      return;
    }
    s.requestPurchase({
      request: {
        apple: { sku: productId },
        google: {
          skus: [productId],
          subscriptionOffers: offerToken ? [{ sku: productId, offerToken }] : [],
        },
      },
      type: 'subs',
    }).catch((error: unknown) =>
      done({ status: s.isUserCancelledError(error) ? 'cancelled' : 'failed' }),
    );
  });
}

/** Asks the store for this Apple or Google account's earlier purchases. */
export async function restore(): Promise<void> {
  const s = store();
  if (!s) return;
  await s.restorePurchases();
}

/** Opens the store's "Manage subscription" screen. */
export async function manage(): Promise<void> {
  const s = store();
  if (!s) return;
  if (Platform.OS === 'android') {
    // Google Play's subscriptions page; it lists this app's subscription with the others.
    await Linking.openURL('https://play.google.com/store/account/subscriptions');
    return;
  }
  await s.deepLinkToSubscriptions({});
}
