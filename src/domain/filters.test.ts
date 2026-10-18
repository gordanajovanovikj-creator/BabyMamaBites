import {
  activeFilterCount,
  applyFilters,
  filtersChangeList,
  fitsAge,
  NO_FILTERS,
  toggled,
  type AgeRange,
  type FilterFacts,
} from './filters';

type Item = FilterFacts;

const item = (title: string, added: number, extra: Partial<Item> = {}): Item => ({
  title,
  added,
  categories: [],
  allergens: [],
  flags: [],
  ...extra,
});

const items: Item[] = [
  item('Banana mash', 0, { fromMonths: 6, categories: ['fruits'] }),
  item('Egg muffins', 1, { fromMonths: 9, allergens: ['egg'], flags: ['freezer-friendly'] }),
  item('Apple puree', 2, { fromMonths: 6, categories: ['fruits'], tried: true }),
  item('Lentil soup', 3, { fromMonths: 12, categories: ['proteins'], flags: ['iron-rich'] }),
];

const ages: AgeRange[] = [
  { id: '6', label: '6 months', from: 6, to: 6 },
  { id: '9', label: '9 months', from: 9, to: 11 },
  { id: '12', label: '12 months+', from: 12, to: 99 },
];

const titles = (list: Item[]) => list.map((i) => i.title);
const run = (filters: Partial<typeof NO_FILTERS>) =>
  titles(applyFilters(items, { ...NO_FILTERS, ...filters }, (i) => i, ages));

describe('applyFilters', () => {
  it('keeps the incoming order with no filters', () => {
    expect(run({})).toEqual(['Banana mash', 'Egg muffins', 'Apple puree', 'Lentil soup']);
  });

  it('sorts newest first and alphabetically both ways', () => {
    expect(run({ sort: 'newest' })[0]).toBe('Lentil soup');
    expect(run({ sort: 'a-z' })).toEqual(['Apple puree', 'Banana mash', 'Egg muffins', 'Lentil soup']);
    expect(run({ sort: 'z-a' })[0]).toBe('Lentil soup');
  });

  it('filters by age, category, allergens, tried and flags', () => {
    expect(run({ ageId: '6' })).toEqual(['Banana mash', 'Apple puree']);
    expect(run({ categories: ['proteins', 'fruits'] })).toHaveLength(3);
    expect(run({ excludeAllergens: ['egg'] })).not.toContain('Egg muffins');
    expect(run({ tried: 'tried' })).toEqual(['Apple puree']);
    expect(run({ tried: 'not-tried' })).not.toContain('Apple puree');
    expect(run({ flags: ['iron-rich'] })).toEqual(['Lentil soup']);
  });
});

describe('fitsAge', () => {
  it('places a recipe by its starting age', () => {
    expect(fitsAge({ fromMonths: 9 }, ages[1])).toBe(true);
    expect(fitsAge({ fromMonths: 6 }, ages[1])).toBe(false);
    expect(fitsAge({}, ages[0])).toBe(false);
  });

  it('matches an article whose age range overlaps', () => {
    expect(fitsAge({ fromMonths: 4, toMonths: 10 }, ages[1])).toBe(true);
    expect(fitsAge({ fromMonths: 0, toMonths: 5 }, ages[0])).toBe(false);
  });
});

describe('filter counts', () => {
  it('counts filters but not the sort order', () => {
    expect(activeFilterCount(NO_FILTERS)).toBe(0);
    expect(activeFilterCount({ ...NO_FILTERS, sort: 'a-z' })).toBe(0);
    expect(
      activeFilterCount({ ...NO_FILTERS, ageId: '6', excludeAllergens: ['egg', 'milk'] }),
    ).toBe(3);
  });

  it('switches to a grid when anything differs from the defaults', () => {
    expect(filtersChangeList(NO_FILTERS)).toBe(false);
    expect(filtersChangeList({ ...NO_FILTERS, sort: 'z-a' })).toBe(true);
    expect(filtersChangeList({ ...NO_FILTERS, tried: 'tried' })).toBe(true);
  });

  it('toggles picks on and off', () => {
    expect(toggled(['a'], 'b')).toEqual(['a', 'b']);
    expect(toggled(['a', 'b'], 'a')).toEqual(['b']);
  });
});
