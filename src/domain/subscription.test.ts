import {
  cachedPremiumValid,
  formatUsd,
  freeTrialDays,
  isFreeLibraryCategory,
  planForProduct,
  premiumFromSubscriptions,
  monthlyEquivalentCents,
  plans,
  yearlySavingsPercent,
  type Plan,
} from './subscription';

describe('subscription plans', () => {
  it('prices monthly at $12.99', () => {
    expect(formatUsd(plans.monthly.priceCents)).toBe('$12.99');
    expect(monthlyEquivalentCents(plans.monthly)).toBe(1299);
  });

  it('prices yearly at $79.99, which works out to $6.66 a month', () => {
    expect(formatUsd(plans.yearly.priceCents)).toBe('$79.99');
    expect(formatUsd(monthlyEquivalentCents(plans.yearly))).toBe('$6.66');
  });

  it('rounds the monthly figure down, never up', () => {
    const odd: Plan = { ...plans.yearly, priceCents: 6599 };
    expect(monthlyEquivalentCents(odd)).toBe(549);
  });

  it('reports the yearly saving without overstating it', () => {
    // $79.99 vs 12 × $12.99 = $155.88 → 48.68% → 48%
    expect(yearlySavingsPercent(plans.monthly, plans.yearly)).toBe(48);
  });

  it('gives both plans a 7-day free trial', () => {
    expect(plans.monthly.trialDays).toBe(7);
    expect(plans.yearly.trialDays).toBe(7);
  });
});

describe('premium access', () => {
  const now = Date.parse('2026-10-20T12:00:00Z');
  const day = 24 * 60 * 60 * 1000;

  it('counts only our active plans that have not ended', () => {
    expect(
      premiumFromSubscriptions(
        [{ productId: plans.yearly.productId, isActive: true, expirationDateIOS: now + day }],
        now,
      ),
    ).toEqual({ premium: true, until: new Date(now + day).toISOString() });
    expect(
      premiumFromSubscriptions(
        [
          { productId: plans.monthly.productId, isActive: true, expirationDateIOS: now - 1 },
          { productId: 'someone.else', isActive: true },
          { productId: plans.yearly.productId, isActive: false },
        ],
        now,
      ),
    ).toEqual({ premium: false, until: null });
  });

  it('has no end date when the store gives none', () => {
    expect(
      premiumFromSubscriptions([{ productId: plans.monthly.productId, isActive: true }], now),
    ).toEqual({ premium: true, until: null });
  });

  it('trusts a remembered subscription only until it ends', () => {
    expect(cachedPremiumValid(new Date(now + day).toISOString(), now)).toBe(true);
    expect(cachedPremiumValid(new Date(now - day).toISOString(), now)).toBe(false);
    expect(cachedPremiumValid(null, now)).toBe(false);
    expect(cachedPremiumValid('not a date', now)).toBe(false);
  });

  it('reads the free-trial length from the store product', () => {
    expect(
      freeTrialDays({
        introductoryPricePaymentModeIOS: 'free-trial',
        introductoryPriceNumberOfPeriodsIOS: '1',
        introductoryPriceSubscriptionPeriodIOS: 'week',
      }),
    ).toBe(7);
    expect(
      freeTrialDays({
        introductoryPricePaymentModeIOS: 'pay-as-you-go',
        introductoryPriceNumberOfPeriodsIOS: '1',
        introductoryPriceSubscriptionPeriodIOS: 'week',
      }),
    ).toBe(0);
  });

  it('keeps safety and wellbeing articles free', () => {
    expect(isFreeLibraryCategory('safety')).toBe(true);
    expect(isFreeLibraryCategory('your-wellbeing')).toBe(true);
    expect(isFreeLibraryCategory('cooking-for-baby')).toBe(false);
  });

  it('knows our product ids', () => {
    expect(planForProduct('mamababybites.premium.yearly')?.id).toBe('yearly');
    expect(planForProduct('nope')).toBeUndefined();
  });
});
