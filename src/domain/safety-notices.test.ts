import { insights } from '@/content/insights';
import { solidsArticles } from '@/content/solids-articles';

import { noticesFor } from './safety-notices';

describe('noticesFor', () => {
  it('puts one emergency card after the text, never a second one above it', () => {
    const tip = noticesFor({ id: 'solids-choking', category: 'safety' });
    expect(tip.top).toEqual([]);
    expect(tip.afterBody).toEqual(['choking-emergency']);
    // The choking article's own text ends with its emergency card.
    const article = noticesFor({ id: 'gagging-vs-choking', category: 'safety' });
    expect(article.top).toEqual([]);
    expect(article.afterBody).toEqual([]);
  });

  it('never adds a second red card to the allergy articles', () => {
    for (const id of ['allergens', 'allergic-reaction-signs']) {
      const n = noticesFor({ id, category: 'safety' });
      expect([...n.top, ...n.afterBody, ...n.bottom]).not.toContain('allergy-safety');
    }
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
    expect(noticesFor({ id: 'high-chair', category: 'safety' })).toEqual({ top: [], afterBody: [], bottom: [] });
  });
});
