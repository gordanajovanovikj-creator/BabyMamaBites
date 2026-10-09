import { useMemo } from 'react';

import { insights } from '@/content/insights';
import { solidsArticles } from '@/content/solids-articles';
import { today } from '@/domain/dates';
import { libraryItems, type LibraryItem } from '@/domain/library';
import { babyAge } from '@/domain/stage';
import { useProfile } from '@/features/profile/profile-context';

/** Library items for this household, and the baby's age used to order them. */
export function useLibrary(): { items: LibraryItem[]; ageMonths: number; babyName: string | null } {
  const { profile } = useProfile();
  return useMemo(
    () => ({
      items: libraryItems(solidsArticles, insights, profile?.allergens ?? []),
      ageMonths: profile ? babyAge(profile, today()).months : 0,
      babyName: profile?.babyName ?? null,
    }),
    [profile],
  );
}
