import { insights } from '@/content/insights';
import { solidsArticles } from '@/content/solids-articles';

import { noticesFor } from './safety-notices';

describe('noticesFor', () => {
  it('puts the emergency and allergy notices at the top of choking and allergy articles', () => {
    expect(noticesFor({ id: 'gagging-vs-choking', category: 'safety' }).top).toEqual([
      'choking-emergency',
    ]);
    const allergy = noticesFor({ id: 'allergens', category: 'starting-solids' });
    expect(allergy.top).toEqual(['allergy-safety']);
    expect(allergy.bottom).toContain('allergy-safety');
  });

  it("gives every mom article and tip the maternal health notice", () => {
    const mom = [...solidsArticles, ...insights].filter(
      (x) => x.category === 'your-wellbeing' || x.category === 'nourishing-you',
    );
    expect(mom.length).toBeGreaterThan(0);
    for (const item of mom) expect(noticesFor(item).bottom).toContain('maternal-health');
  });

  it('only names articles and tips that exist', () => {
    const ids = new Set([...solidsArticles, ...insights].map((x) => x.id));
    for (const id of [
      'allergens',
      'allergic-reaction-signs',
      'gagging-vs-choking',
      'solids-choking',
      'cows-milk',
      'cups-and-drinks',
      'brushing-baby-teeth',
      'toddler-picky-phases',
      'food-refusal',
      'purees-vs-finger-foods',
      'learning-to-chew',
      'first-foods',
    ])
      expect(ids.has(id)).toBe(true);
  });

  it('shows nothing extra on an ordinary article', () => {
    expect(noticesFor({ id: 'high-chair', category: 'safety' })).toEqual({ top: [], bottom: [] });
  });
});
