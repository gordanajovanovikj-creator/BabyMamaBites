import type { Recipe } from '@/content/recipes';

import type { LibraryItem } from './library';
import { matchesQuery, normalize, searchLibrary, searchRecipes } from './search';

const recipe = (id: string, title: string, ingredients: string[] = [], summary = 'Tasty.') =>
  ({ id, title, summary, ingredients }) as unknown as Recipe;

describe('normalize', () => {
  it('ignores case, accents and punctuation', () => {
    expect(normalize('Sweet-Potato Purée!')).toBe('sweet potato puree');
  });
});

describe('matchesQuery', () => {
  it('needs every word, in any order', () => {
    expect(matchesQuery(['Banana oat pancakes'], 'oat banana')).toBe(true);
    expect(matchesQuery(['Banana oat pancakes'], 'banana egg')).toBe(false);
  });
  it('matches the start of words, so partial typing works', () => {
    expect(matchesQuery(['Avocado toast'], 'avo')).toBe(true);
    expect(matchesQuery(['Avocado toast'], 'cado')).toBe(false);
  });
  it('treats an empty query as matching everything', () => {
    expect(matchesQuery(['Anything'], '   ')).toBe(true);
  });
});

describe('searchRecipes', () => {
  const list = [
    recipe('a', 'Lentil soup', ['1 cup red lentils', '1 carrot']),
    recipe('b', 'Carrot puree', ['2 carrots']),
    recipe('c', 'Oat porridge', ['oats']),
  ];
  it('puts title matches before ingredient matches', () => {
    expect(searchRecipes(list, 'carrot').map((r) => r.id)).toEqual(['b', 'a']);
  });
  it('returns nothing for an empty query', () => {
    expect(searchRecipes(list, '')).toEqual([]);
  });
});

describe('searchLibrary', () => {
  const item = (id: string, title: string, category: string, summary = '') =>
    ({ id, title, category, summary }) as unknown as LibraryItem;
  const items = [
    item('1', 'Signs of readiness', 'solids'),
    item('2', 'Sleep basics', 'sleep', 'Gentle routines for naps.'),
  ];
  it('matches summaries too', () => {
    expect(searchLibrary(items, 'naps').map((i) => i.id)).toEqual(['2']);
  });
  it('matches titles and category names', () => {
    expect(searchLibrary(items, 'readiness').map((i) => i.id)).toEqual(['1']);
    expect(
      searchLibrary(items, 'starting', (c) => (c === 'solids' ? 'Starting solids' : '')).map(
        (i) => i.id,
      ),
    ).toEqual(['1']);
  });
});
