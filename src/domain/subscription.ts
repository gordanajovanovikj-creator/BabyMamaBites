/**
 * The one plan we offer: a yearly subscription with a free trial.
 * Prices are in US cents. Keep these in sync with the product set up in
 * App Store Connect; on device, the App Store's localized price wins.
 */
export const yearlyPlan = {
  /** Must match the App Store Connect product id once it exists. */
  productId: 'mamababybites.premium.yearly',
  yearlyPriceCents: 6600,
  trialDays: 7,
} as const;

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** The yearly price spread over 12 months, rounded down to the cent so we never overstate the saving. */
export function monthlyEquivalentCents(yearlyCents: number): number {
  return Math.floor(yearlyCents / 12);
}
