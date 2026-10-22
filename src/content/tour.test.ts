import { appTabs } from '@/features/navigation/tabs';
import { hasAndroidSymbol } from '@/ui/symbol-name';

import { tourSteps } from './tour';

describe('app tour', () => {
  it('covers every tab, in tab bar order', () => {
    expect(tourSteps.flatMap((s) => (s.tab ? [s.tab] : []))).toEqual(appTabs.map((t) => t.name));
  });

  it('has an Android icon for every step', () => {
    expect(tourSteps.filter((s) => !hasAndroidSymbol(s.icon)).map((s) => s.id)).toEqual([]);
  });
});
