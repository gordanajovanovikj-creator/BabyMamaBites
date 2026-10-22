import fs from 'fs';
import path from 'path';

import { hasAndroidSymbol, symbolName } from './symbol-name';

describe('symbolName', () => {
  it('pairs an SF Symbol with its Material Symbol for Android', () => {
    expect(symbolName('fork.knife')).toEqual({ ios: 'fork.knife', android: 'restaurant' });
    expect(symbolName('not.a.symbol')).toBe('not.a.symbol');
  });

  it('has an Android icon for every icon named in the app content', () => {
    const dir = path.join(__dirname, '../content');
    const icons = new Set<string>();
    for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json'))) {
      const text = fs.readFileSync(path.join(dir, file), 'utf8');
      for (const m of text.matchAll(/"icon"\s*:\s*"([^"]+)"/g)) icons.add(m[1]);
    }
    expect(icons.size).toBeGreaterThan(10);
    expect([...icons].filter((i) => !hasAndroidSymbol(i))).toEqual([]);
  });
});
