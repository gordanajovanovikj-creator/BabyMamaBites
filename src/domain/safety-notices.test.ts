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

  it('keeps crisis numbers in the postpartum recovery article itself', () => {
    const recovery = solidsArticles.find((x) => x.id === 'postpartum-recovery');
    const text = JSON.stringify(recovery);
    for (const number of ['988', '911', '1-833-TLC-MAMA']) expect(text).toContain(number);
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
