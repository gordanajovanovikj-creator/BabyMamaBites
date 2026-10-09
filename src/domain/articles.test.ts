import { solidsArticles } from '@/content/solids-articles';
import { PLACEHOLDER_MARKER } from '@/content/schemas';
import { getSolidsSource } from '@/content/solids-plan';

import { ageRangeLabel, articlesForAge, articleTiming } from './articles';

const a = (id: string, fromMonths: number, toMonths: number) => ({ id, fromMonths, toMonths });

describe('articleTiming', () => {
  it('is now inside the range, inclusive', () => {
    expect(articleTiming(a('x', 4, 7), 4)).toBe('now');
    expect(articleTiming(a('x', 4, 7), 7)).toBe('now');
    expect(articleTiming(a('x', 4, 7), 3)).toBe('coming-up');
    expect(articleTiming(a('x', 4, 7), 8)).toBe('earlier');
  });
});

describe('articlesForAge', () => {
  it('lists current articles first, then the soonest upcoming, then the most recent earlier ones', () => {
    const list = [
      a('past-old', 0, 3),
      a('later', 12, 18),
      a('now', 5, 9),
      a('soon', 8, 12),
      a('past', 4, 6),
    ];
    expect(articlesForAge(list, 7).map((x) => x.id)).toEqual([
      'now',
      'soon',
      'later',
      'past',
      'past-old',
    ]);
  });
});

describe('ageRangeLabel', () => {
  it('shows open-ended ranges as "From"', () => {
    expect(ageRangeLabel(a('x', 4, 7))).toBe('4 to 7 months');
    expect(ageRangeLabel(a('x', 6, 24))).toBe('From 6 months');
  });
});

describe('solids articles content', () => {
  it('has unique ids and the requested topics', () => {
    const ids = solidsArticles.map((x) => x.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(expect.arrayContaining(['ready', 'purees-vs-finger-foods', 'high-chair']));
  });

  it('links every source to a real page', () => {
    for (const article of solidsArticles) {
      for (const id of article.sources) expect(getSolidsSource(id)).toBeDefined();
    }
  });

  it('marks drafts visibly', () => {
    for (const article of solidsArticles.filter((x) => x.reviewStatus === 'placeholder')) {
      expect(article.summary.startsWith(PLACEHOLDER_MARKER)).toBe(true);
    }
  });

  it('has something for every age from 4 to 18 months', () => {
    for (let m = 4; m <= 18; m++) {
      expect(solidsArticles.some((x) => articleTiming(x, m) === 'now')).toBe(true);
    }
  });

  it('never claims a food increases milk supply', () => {
    expect(JSON.stringify(solidsArticles)).not.toMatch(/milk supply|lactation|boost/i);
  });
});
