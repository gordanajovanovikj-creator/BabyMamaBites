import { formatUsd, monthlyEquivalentCents, yearlyPlan } from './subscription';

describe('yearly plan pricing', () => {
  it('works out to $5.50 a month', () => {
    expect(formatUsd(monthlyEquivalentCents(yearlyPlan.yearlyPriceCents))).toBe('$5.50');
  });

  it('shows the full yearly price', () => {
    expect(formatUsd(yearlyPlan.yearlyPriceCents)).toBe('$66.00');
  });

  it('rounds the monthly figure down, never up', () => {
    expect(monthlyEquivalentCents(6599)).toBe(549);
  });

  it('offers a 7-day free trial', () => {
    expect(yearlyPlan.trialDays).toBe(7);
  });
});
