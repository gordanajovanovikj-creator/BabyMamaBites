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
    priceCents: 7999,
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

/**
 * Parts of the app that need a subscription. Today, the monthly guides, the food guide,
 * starting-solids readiness and every safety page stay free.
 */
export const premiumFeatures = [
  'recipes',
  'solids-plan',
  'planner',
  'food-log',
  'library',
  'ask',
  'shopping',
  'calendar',
] as const;
export type PremiumFeature = (typeof premiumFeatures)[number];

/** What a locked screen says about the feature behind it. */
export const premiumFeatureCopy: Record<
  PremiumFeature,
  { icon: string; emoji: string; title: string; detail: string }
> = {
  recipes: {
    icon: 'fork.knife',
    emoji: '🍽️',
    title: 'Recipes for baby and you',
    detail: 'Purees, finger foods and family meals, each with textures and safety tips.',
  },
  'solids-plan': {
    icon: 'safari',
    emoji: '🧭',
    title: 'Your week-by-week solids plan',
    detail: 'What to try each week, with allergens introduced step by step.',
  },
  planner: {
    icon: 'calendar',
    emoji: '🗓️',
    title: 'Meal planner and freezer',
    detail: "Plan your baby's meals, pair them with family dinners and track freezer cubes.",
  },
  'food-log': {
    icon: 'list.bullet.clipboard',
    emoji: '📝',
    title: 'Food log and allergen tracker',
    detail: 'Log every new food and see which allergens your baby has tried.',
  },
  library: {
    icon: 'books.vertical.fill',
    emoji: '📚',
    title: 'The full Insights library',
    detail: 'Articles on feeding, cooking for baby and looking after yourself.',
  },
  ask: {
    icon: 'bubble.left.and.bubble.right.fill',
    emoji: '💬',
    title: 'Ask, your feeding helper',
    detail: 'Quick answers about meals, textures and recipes from what you have at home.',
  },
  shopping: {
    icon: 'cart.fill',
    emoji: '🛒',
    title: 'Shopping list',
    detail: 'Add recipe ingredients in a tap and check them off in the store.',
  },
  calendar: {
    icon: 'calendar.badge.clock',
    emoji: '📅',
    title: 'Your calendar',
    detail: 'Appointments and notes with gentle reminders.',
  },
};

/**
 * Library categories that stay free: safety (choking, foods to avoid, allergic reactions)
 * and mom's wellbeing (postpartum warning signs). Help for a red flag is never paywalled.
 */
export const freeLibraryCategories = ['safety', 'your-wellbeing'] as const;

export function isFreeLibraryCategory(category: string): boolean {
  return (freeLibraryCategories as readonly string[]).includes(category);
}

/** The App Store product ids of our plans. */
export const planProductIds: string[] = planIds.map((id) => plans[id].productId);

/** The bits of an App Store subscription we use to decide access. */
export type ActiveSubscriptionInfo = {
  productId: string;
  isActive: boolean;
  /** Milliseconds since 1970; null when the store doesn't say. */
  expirationDateIOS?: number | null;
};

/**
 * Whether one of our plans is active right now, and until when (ISO timestamp, or null
 * when the store gave no end date).
 */
export function premiumFromSubscriptions(
  subs: ActiveSubscriptionInfo[],
  now: number = Date.now(),
): { premium: boolean; until: string | null } {
  const ours = subs.filter(
    (s) =>
      s.isActive &&
      planProductIds.includes(s.productId) &&
      (s.expirationDateIOS == null || s.expirationDateIOS > now),
  );
  if (!ours.length) return { premium: false, until: null };
  const ends = ours.map((s) => s.expirationDateIOS).filter((t): t is number => t != null);
  return {
    premium: true,
    until: ends.length === ours.length ? new Date(Math.max(...ends)).toISOString() : null,
  };
}

/**
 * Whether a remembered subscription still counts while the App Store is checked again
 * (so a subscriber never sees a locked screen flash by on launch).
 */
export function cachedPremiumValid(until: string | null, now: number = Date.now()): boolean {
  if (!until) return false;
  const end = Date.parse(until);
  return Number.isFinite(end) && end > now;
}

const PERIOD_DAYS: Record<string, number> = { day: 1, week: 7, month: 30, year: 365 };

/** How many free-trial days a store product offers, or 0 if its intro offer isn't a free trial. */
export function freeTrialDays(product: {
  introductoryPricePaymentModeIOS?: string | null;
  introductoryPriceNumberOfPeriodsIOS?: string | null;
  introductoryPriceSubscriptionPeriodIOS?: string | null;
}): number {
  if (product.introductoryPricePaymentModeIOS !== 'free-trial') return 0;
  const count = Number(product.introductoryPriceNumberOfPeriodsIOS ?? '1') || 1;
  const unit = PERIOD_DAYS[product.introductoryPriceSubscriptionPeriodIOS ?? ''] ?? 0;
  return count * unit;
}
