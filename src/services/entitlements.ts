/**
 * Paywall seam. v1 has no subscriptions, so everything is unlocked.
 * Later this will read RevenueCat customer info; screens only ever call
 * `useEntitlement`, so swapping the implementation won't touch UI code.
 */
export type Entitlement = 'premium';

export function useEntitlement(_entitlement: Entitlement): { active: boolean; loading: boolean } {
  return { active: true, loading: false };
}
