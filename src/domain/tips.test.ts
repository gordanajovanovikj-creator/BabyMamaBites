import { foods } from '@/content/foods';
import { babyRecipes } from '@/content/recipes';

import { isSafetyTip, splitTips } from './tips';

describe('splitTips', () => {
  it('pulls out choking and allergen tips, keeping order', () => {
    const tips = [
      'Whole blueberries are a choking hazard; always mash or flatten them.',
      'Freeze leftovers in an ice cube tray.',
      'Offer egg on its own day and watch for an allergic reaction.',
    ];
    expect(splitTips(tips)).toEqual({
      safety: [tips[0], tips[2]],
      other: [tips[1]],
    });
  });

  it('leaves everyday tips in the carousel', () => {
    expect(isSafetyTip('If you warm the berries in the microwave, stir well.')).toBe(false);
    expect(isSafetyTip('Gagging is normal while babies learn.')).toBe(true);
  });

  it('finds safety tips in the real content', () => {
    const all = [...babyRecipes.flatMap((r) => r.tips), ...foods.flatMap((f) => f.tips)];
    expect(all.filter(isSafetyTip).length).toBeGreaterThan(0);
  });
});
