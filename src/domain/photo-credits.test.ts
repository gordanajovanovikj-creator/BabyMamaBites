import { readFileSync } from 'fs';
import { join } from 'path';

import { photoCredits, type PhotoCredit } from '@/content/photo-credits';

import { creditLine, creditsBySource } from './photo-credits';

const credit = (over: Partial<PhotoCredit>): PhotoCredit => ({
  id: 'x',
  usedOn: 'X',
  source: 'pixabay',
  author: 'Ann',
  url: null,
  ...over,
});

describe('creditLine', () => {
  it('formats each source', () => {
    expect(creditLine(credit({ source: 'dreamstime' }))).toBe('© Ann | Dreamstime.com');
    expect(creditLine(credit({ source: 'pixabay' }))).toBe('Ann on Pixabay');
    expect(creditLine(credit({ source: 'pexels' }))).toBe('Photo by Ann on Pexels');
    expect(creditLine(credit({ source: 'magnific', author: null }))).toBe('Designed by Magnific');
  });
});

describe('creditsBySource', () => {
  it('orders groups and titles, and drops empty groups', () => {
    const groups = creditsBySource([
      credit({ id: 'b', usedOn: 'Beta' }),
      credit({ id: 'a', usedOn: 'Alpha' }),
      credit({ id: 'm', source: 'magnific' }),
    ]);
    expect(groups.map((g) => g.source)).toEqual(['magnific', 'pixabay']);
    expect(groups[1].credits.map((c) => c.id)).toEqual(['a', 'b']);
  });
});

describe('bundled photo credits', () => {
  it('include every stock photo listed in docs/photo-credits.md', () => {
    const md = readFileSync(join(__dirname, '../../docs/photo-credits.md'), 'utf8');
    const stock = md
      .split('\n')
      .filter((l) => l.startsWith('| ') && /\| (Pixabay|Pexels)[\s,]|Dreamstime|Magnific/.test(l))
      .map((l) => l.split('|')[1].trim());
    const ids = new Set(photoCredits.map((c) => c.id));
    expect(stock.filter((id) => !ids.has(id))).toEqual([]);
    expect(photoCredits.length).toBe(stock.length);
  });
});
