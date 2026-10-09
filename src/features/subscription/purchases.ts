import { yearlyPlan } from '@/domain/subscription';

export type PurchaseResult =
  | { status: 'subscribed' }
  | { status: 'cancelled' }
  /** In-app purchases aren't connected to the App Store yet. */
  | { status: 'unavailable' };

/**
 * Starts the yearly plan's free trial through the App Store.
 *
 * NOT CONNECTED YET: this needs an in-app purchase library (e.g. expo-iap or
 * RevenueCat), a development build, and the product `yearlyPlan.productId`
 * set up in App Store Connect. Until then it never charges anyone.
 */
export async function startYearlyTrial(): Promise<PurchaseResult> {
  void yearlyPlan.productId;
  return { status: 'unavailable' };
}

/** Restores an earlier purchase on a new phone. Not connected yet (see above). */
export async function restorePurchases(): Promise<PurchaseResult> {
  return { status: 'unavailable' };
}
