import {
  formatUsd,
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

  it('prices yearly at $66.00, which works out to $5.50 a month', () => {
    expect(formatUsd(plans.yearly.priceCents)).toBe('$66.00');
    expect(formatUsd(monthlyEquivalentCents(plans.yearly))).toBe('$5.50');
  });

  it('rounds the monthly figure down, never up', () => {
    const odd: Plan = { ...plans.yearly, priceCents: 6599 };
    expect(monthlyEquivalentCents(odd)).toBe(549);
  });

  it('reports the yearly saving without overstating it', () => {
    // $66.00 vs 12 × $12.99 = $155.88 → 57.66% → 57%
    expect(yearlySavingsPercent(plans.monthly, plans.yearly)).toBe(57);
  });

  it('gives both plans a 7-day free trial', () => {
    expect(plans.monthly.trialDays).toBe(7);
    expect(plans.yearly.trialDays).toBe(7);
  });
});
