import { useMemo } from 'react';

import type { Household } from '@/domain/recipes';

import { useProfile } from './profile-context';

/** The household's allergies, diets and cooking time, for filtering recipes. */
export function useHousehold(): Household {
  const { profile } = useProfile();
  return useMemo(
    () => ({
      allergens: profile?.allergens ?? [],
      diets: profile?.diets ?? [],
      cookingTime: profile?.cookingTime ?? 'flexible',
    }),
    [profile],
  );
}
