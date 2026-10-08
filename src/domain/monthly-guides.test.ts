import { monthlyGuides } from '@/content/monthly-guides';

import { adjacentGuides, guideForMonths } from './monthly-guides';

describe('guideForMonths', () => {
  it('gives every age from birth to 5 years exactly one guide', () => {
    for (let m = 0; m <= 60; m++) {
      const matches = monthlyGuides.filter(
        (g) => m >= g.fromMonth && (g.toMonth === null || m < g.toMonth),
      );
      expect(matches).toHaveLength(1);
    }
  });

  it('has a separate guide for each month of the first year', () => {
    for (let m = 0; m < 12; m++) {
      expect(guideForMonths(monthlyGuides, m)?.title).toBe(`Month ${m + 1}`);
    }
  });

  it('groups the toddler months', () => {
    expect(guideForMonths(monthlyGuides, 12)?.id).toBe('months-12-18');
    expect(guideForMonths(monthlyGuides, 17)?.id).toBe('months-12-18');
    expect(guideForMonths(monthlyGuides, 18)?.id).toBe('months-18-24');
    expect(guideForMonths(monthlyGuides, 40)?.id).toBe('months-24-plus');
  });
});

describe('adjacentGuides', () => {
  it('links months in order', () => {
    expect(adjacentGuides(monthlyGuides, 'month-6').previous?.id).toBe('month-5');
    expect(adjacentGuides(monthlyGuides, 'month-6').next?.id).toBe('month-7');
  });
  it('has no previous for the first guide or next for the last', () => {
    expect(adjacentGuides(monthlyGuides, 'month-1').previous).toBeUndefined();
    expect(adjacentGuides(monthlyGuides, 'months-24-plus').next).toBeUndefined();
  });
});

describe('bundled monthly guides', () => {
  it('mark every unreviewed section visibly', () => {
    for (const g of monthlyGuides.filter((x) => x.reviewStatus === 'placeholder')) {
      expect(g.intro).toContain('[PLACEHOLDER - needs expert review]');
      for (const s of g.sections) expect(s.body).toContain('[PLACEHOLDER - needs expert review]');
    }
  });

  it('always end with when to call your doctor', () => {
    for (const g of monthlyGuides) expect(g.sections.at(-1)?.id).toBe('when-to-call');
  });

  it('never claim a food increases milk supply', () => {
    const text = JSON.stringify(monthlyGuides).toLowerCase();
    for (const banned of ['milk supply', 'boost milk', 'increase milk', 'galactagogue']) {
      expect(text).not.toContain(banned);
    }
  });
});
