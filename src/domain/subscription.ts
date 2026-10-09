/**
 * The plans we offer. Prices are in US cents. Keep these in sync with the products
 * set up in App Store Connect; on device, the App Store's localized price wins.
 */
export const planIds = ['monthly', 'yearly'] as const;
export type PlanId = (typeof planIds)[number];

export type Plan = {
  id: PlanId;
  /** Must match the App Store Connect product id once it exists. */
  productId: string;
  priceCents: number;
  period: 'month' | 'year';
  trialDays: number;
};

export const TRIAL_DAYS = 7;

export const plans: Record<PlanId, Plan> = {
  monthly: {
    id: 'monthly',
    productId: 'mamababybites.premium.monthly',
    priceCents: 1299,
    period: 'month',
    trialDays: TRIAL_DAYS,
  },
  yearly: {
    id: 'yearly',
    productId: 'mamababybites.premium.yearly',
    priceCents: 6600,
    period: 'year',
    trialDays: TRIAL_DAYS,
  },
};

/** Preselected and labeled "Most popular" on the paywall. */
export const featuredPlan: PlanId = 'yearly';

export function formatUsd(cents: number): string {
  return `$${(cents / 100).toFixed(2)}`;
}

/** The plan's price per month, rounded down to the cent so we never overstate the saving. */
export function monthlyEquivalentCents(plan: Plan): number {
  return plan.period === 'month' ? plan.priceCents : Math.floor(plan.priceCents / 12);
}

/** How much yearly saves over 12 months of monthly, as a whole percent (rounded down). */
export function yearlySavingsPercent(monthly: Plan, yearly: Plan): number {
  return Math.floor((1 - yearly.priceCents / (monthly.priceCents * 12)) * 100);
}
