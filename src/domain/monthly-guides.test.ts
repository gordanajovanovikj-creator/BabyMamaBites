import { guideSources, monthlyGuides } from '@/content/monthly-guides';
import { splitReviewMarker } from '@/content/schemas';

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
      for (const s of g.sections) {
        expect(s.paragraphs[0].startsWith('[PLACEHOLDER - needs expert review]')).toBe(true);
      }
    }
  });

  it('have no markers left once a guide is marked reviewed', () => {
    for (const g of monthlyGuides.filter((x) => x.reviewStatus === 'reviewed')) {
      expect(JSON.stringify(g)).not.toContain('[PLACEHOLDER');
    }
  });

  it('use unique section ids within each guide', () => {
    for (const g of monthlyGuides) {
      const ids = g.sections.map((s) => s.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('always end with when to call your doctor', () => {
    for (const g of monthlyGuides) expect(g.sections.at(-1)?.id).toBe('when-to-call');
  });

  it('never claim a food increases milk supply', () => {
    const text = JSON.stringify(monthlyGuides).toLowerCase();
    for (const banned of [
      'boost milk',
      'boosts milk',
      'increase milk',
      'increases milk',
      'increase your milk',
      'milk-boosting',
      'galactagogue',
      'lactogenic',
    ]) {
      expect(text).not.toContain(banned);
    }
  });

  it('cite only known sources, and every source is an official site', () => {
    const ids = new Set(guideSources.map((s) => s.id));
    for (const g of monthlyGuides) {
      for (const s of g.sections) for (const src of s.sources) expect(ids.has(src)).toBe(true);
    }
    const official = [
      'www.cdc.gov',
      'www.healthychildren.org',
      'www.fda.gov',
      'www.womenshealth.gov',
      'www.who.int',
    ];
    for (const s of guideSources) expect(official).toContain(new URL(s.url).host);
  });

  it('point to emergency help in every "when to call" section', () => {
    for (const g of monthlyGuides) {
      const call = g.sections.at(-1)!;
      expect(JSON.stringify(call)).toMatch(/emergency/i);
    }
  });
});

describe('splitReviewMarker', () => {
  it('removes a leading marker for display and reports it', () => {
    expect(splitReviewMarker('[PLACEHOLDER - needs expert review] Hello')).toEqual({
      text: 'Hello',
      isDraft: true,
    });
    expect(splitReviewMarker('Hello')).toEqual({ text: 'Hello', isDraft: false });
  });
});
