import { allRecipes, babyRecipes, getRecipe } from '@/content/recipes';

import { NO_FAMILY_MEAL } from './family-meals';
import { foodMealId, planKey } from './planner';
import {
  aisleFor,
  defaultPicked,
  groupByAisle,
  ingredientPicks,
  isOnList,
  itemsToAdd,
  listAsText,
  makeShoppingItem,
  plannedRecipes,
  shoppingProgress,
  type ShoppingItem,
} from './shopping';

const anyone = { allergens: [], diets: [] };
const t0 = new Date('2026-10-20T10:00:00.000Z');

function item(text: string, extra: Partial<ShoppingItem> = {}): ShoppingItem {
  return { ...makeShoppingItem({ text, recipeTitle: null }, t0, text), ...extra };
}

describe('aisleFor', () => {
  it('sorts common ingredient lines into store sections', () => {
    expect(aisleFor('2 ripe bananas, mashed')).toBe('produce');
    expect(aisleFor('1 small zucchini, ends trimmed and diced')).toBe('produce');
    expect(aisleFor('1/2 cup plain Greek yogurt')).toBe('dairy');
    expect(aisleFor('2 eggs')).toBe('dairy');
    expect(aisleFor('8 oz boneless, skinless chicken thighs')).toBe('meat');
    expect(aisleFor('4 large whole-wheat tortillas')).toBe('bakery');
    expect(aisleFor('1 cup quinoa')).toBe('pantry');
    expect(aisleFor('1 to 2 tbsp iron-fortified oat infant cereal')).toBe('baby');
    expect(aisleFor('Paper towels')).toBe('other');
  });

  it('checks the more specific phrase first', () => {
    expect(aisleFor('1 tbsp smooth peanut butter')).toBe('pantry');
    expect(aisleFor('1 cup frozen peas')).toBe('frozen');
    expect(aisleFor('1/3 cup fresh or frozen berries')).toBe('produce');
    expect(aisleFor('Diapers size 3')).toBe('baby');
    expect(aisleFor('1 can (15 oz) black beans, rinsed')).toBe('pantry');
    expect(aisleFor('1 small eggplant')).not.toBe('dairy');
    expect(aisleFor('Pepper')).toBe('pantry');
    expect(aisleFor('1 red bell pepper')).toBe('produce');
  });
});

describe('defaultPicked', () => {
  it('leaves water, ice and breast milk unticked', () => {
    expect(defaultPicked('Water for steaming')).toBe(false);
    expect(defaultPicked('Warm breast milk, formula or water')).toBe(false);
    expect(defaultPicked('Breast milk, formula or water to thin')).toBe(false);
    expect(defaultPicked('3 to 4 ice cubes')).toBe(true);
    expect(defaultPicked('Ice cubes')).toBe(false);
    expect(defaultPicked('1 cup milk')).toBe(true);
    expect(defaultPicked('3 cups water')).toBe(false);
    expect(defaultPicked('1 cup unsweetened coconut water')).toBe(true);
    expect(defaultPicked('1 tbsp cornstarch mixed with 2 tbsp cold water')).toBe(true);
  });
});

describe('makeShoppingItem', () => {
  it('tidies the text and picks an aisle', () => {
    const i = makeShoppingItem({ text: '  2   apples ', recipeTitle: 'Apple puree' }, t0, 'a');
    expect(i).toEqual({
      id: 'a',
      text: '2 apples',
      checked: false,
      aisle: 'produce',
      recipeTitle: 'Apple puree',
      addedAt: t0.toISOString(),
    });
  });

  it('refuses a blank item', () => {
    expect(() => makeShoppingItem({ text: '   ', recipeTitle: null })).toThrow();
  });
});

describe('itemsToAdd', () => {
  it('skips repeats and what is already on the list, and keeps the order', () => {
    const existing = [item('2 eggs'), item('1 cup milk', { checked: true })];
    const added = itemsToAdd(
      existing,
      [
        { text: '2 Eggs', recipeTitle: 'Pancakes' },
        { text: '1 cup milk', recipeTitle: 'Pancakes' },
        { text: 'Pepper', recipeTitle: 'Pancakes' },
        { text: 'pepper ', recipeTitle: 'Soup' },
        { text: ' ', recipeTitle: 'Soup' },
      ],
      t0,
    );
    expect(added.map((i) => i.text)).toEqual(['1 cup milk', 'Pepper']);
    expect(added[0].addedAt < added[1].addedAt).toBe(true);
  });
});

describe('isOnList', () => {
  it('only counts items not yet checked off', () => {
    const items = [item('2 eggs'), item('Bread', { checked: true })];
    expect(isOnList(items, '2  EGGS')).toBe(true);
    expect(isOnList(items, 'bread')).toBe(false);
  });
});

describe('groupByAisle and progress', () => {
  it('groups items to buy in walking order and counts what is left', () => {
    const items = [
      item('1 cup quinoa'),
      item('2 bananas'),
      item('2 eggs', { checked: true }),
      item('Spinach'),
    ];
    expect(groupByAisle(items).map((g) => [g.aisle, g.items.map((i) => i.text)])).toEqual([
      ['produce', ['2 bananas', 'Spinach']],
      ['pantry', ['1 cup quinoa']],
    ]);
    expect(shoppingProgress(items)).toEqual({ left: 3, total: 4 });
  });

  it('shares the items to buy as text', () => {
    expect(listAsText([item('2 bananas'), item('Bread', { checked: true })])).toBe(
      'Shopping list\n\nProduce\n• 2 bananas',
    );
    expect(listAsText([])).toBe('Shopping list\n\nAll done!');
  });
});

describe('plannedRecipes', () => {
  const withPairing = babyRecipes.find((r) => r.familyMeal);

  it('lists planned baby recipes and their family meals once, skipping foods', () => {
    if (!withPairing?.familyMeal) throw new Error('needs a baby recipe with a family meal');
    const plan = {
      [planKey('2026-10-19', 'lunch')]: withPairing.id,
      [planKey('2026-10-20', 'lunch')]: withPairing.id,
      [planKey('2026-10-20', 'dinner')]: foodMealId('banana'),
      [planKey('2026-10-30', 'lunch')]: 'baby-oat-cereal',
    };
    const found = plannedRecipes(plan, {}, ['2026-10-19', '2026-10-20'], allRecipes, anyone);
    expect(found.map((r) => r.id)).toEqual([withPairing.id, withPairing.familyMeal.recipeId]);
  });

  it('leaves out a family meal the parent removed', () => {
    if (!withPairing) throw new Error('needs a baby recipe with a family meal');
    const key = planKey('2026-10-19', 'lunch');
    const found = plannedRecipes(
      { [key]: withPairing.id },
      { [key]: NO_FAMILY_MEAL },
      ['2026-10-19'],
      allRecipes,
      anyone,
    );
    expect(found.map((r) => r.id)).toEqual([withPairing.id]);
    expect(getRecipe(withPairing.id)).toBeDefined();
  });
});

describe('ingredientPicks', () => {
  it('offers each line once, unticking water and what is already on the list', () => {
    const groups = ingredientPicks(
      [
        { id: 'a', title: 'Puree', ingredients: ['2 apples', 'Water for steaming'] },
        { id: 'b', title: 'Oats', ingredients: ['2 Apples', '1/2 cup oats', '2 eggs'] },
      ],
      [item('2 eggs')],
    );
    expect(
      groups.map((g) => [g.title, g.lines.map((l) => [l.text, l.picked, l.onList])]),
    ).toEqual([
      [
        'Puree',
        [
          ['2 apples', true, false],
          ['Water for steaming', false, false],
        ],
      ],
      [
        'Oats',
        [
          ['1/2 cup oats', true, false],
          ['2 eggs', false, true],
        ],
      ],
    ]);
  });
});
