import { recipeTags } from '@/content/recipes';
import type { AgeRange, SortOrder } from '@/domain/filters';
import { allergens } from '@/domain/profile';
import { allergenLabels } from '@/domain/profile-labels';
import { recipeTagLabels } from '@/domain/recipe-labels';

import type { FilterOption } from './filters-sheet';

export const ALL_SORTS: SortOrder[] = ['recommended', 'newest', 'a-z', 'z-a'];

/** The US top 9 allergens, to leave out of a list. */
export const allergenOptions: FilterOption[] = allergens.map((a) => ({
  id: a,
  label: allergenLabels[a],
}));

export const recipeTagOptions: FilterOption[] = recipeTags.map((t) => ({
  id: t,
  label: recipeTagLabels[t],
}));

/** Baby recipes by the age they start at, matching the age groups on the Baby tab. */
export const babyRecipeAges: AgeRange[] = [
  { id: '6', label: '6 months', from: 6, to: 6 },
  { id: '7', label: '7 months', from: 7, to: 8 },
  { id: '9', label: '9 months', from: 9, to: 11 },
  { id: '12', label: '12 months+', from: 12, to: 99 },
];

/** Articles and tips by the baby's age. */
export const libraryAges: AgeRange[] = [
  { id: 'newborn', label: 'Newborn to 5 months', from: 0, to: 5 },
  { id: 'solids', label: '6 to 11 months', from: 6, to: 11 },
  { id: 'toddler', label: '12 months+', from: 12, to: 99 },
];
