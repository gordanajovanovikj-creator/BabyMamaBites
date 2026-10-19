import { nutritionFor } from '@/content/recipe-nutrition';
import { allRecipes } from '@/content/recipes';

import { nutritionRows } from './nutrition';

const n = {
  kcal: 312.4,
  proteinG: 18.26,
  carbsG: 40.2,
  fiberG: 6.04,
  fatG: 9.5,
  sodiumMg: 140.6,
  ironMg: 2.34,
};

describe('nutritionRows', () => {
  it('shows the full panel for grown-up recipes', () => {
    expect(nutritionRows(n, false)).toEqual([
      { label: 'Calories', value: '312' },
      { label: 'Protein', value: '18 g' },
      { label: 'Carbs', value: '40 g' },
      { label: 'Fiber', value: '6 g' },
      { label: 'Fat', value: '9.5 g' },
      { label: 'Sodium', value: '141 mg' },
    ]);
  });

  it('shows iron, protein and sodium for baby recipes, without calories', () => {
    const rows = nutritionRows(n, true);
    expect(rows.map((r) => r.label)).toEqual(['Iron', 'Protein', 'Sodium']);
    expect(rows[0].value).toBe('2.3 mg');
  });
});

describe('recipe nutrition data', () => {
  it('has an estimate for every recipe', () => {
    const missing = allRecipes.filter((r) => !nutritionFor(r.id)).map((r) => r.id);
    expect(missing).toEqual([]);
  });
});
