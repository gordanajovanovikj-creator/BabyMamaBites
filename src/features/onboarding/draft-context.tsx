import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

import type { Allergen, CookingTime, Diet, FeedingStatus, Profile } from '@/domain/profile';

/** Answers collected across the onboarding screens before they are saved. */
export type Draft = {
  babyName: string;
  birthDate: string | null;
  bornEarly: boolean;
  dueDate: string | null;
  feeding: FeedingStatus | null;
  allergens: Allergen[];
  diets: Diet[];
  cookingTime: CookingTime | null;
};

export function draftFromProfile(profile: Profile | null): Draft {
  return {
    babyName: profile?.babyName ?? '',
    birthDate: profile?.birthDate ?? null,
    bornEarly: !!profile?.dueDate,
    dueDate: profile?.dueDate ?? null,
    feeding: profile?.feeding ?? null,
    allergens: profile?.allergens ?? [],
    diets: profile?.diets ?? [],
    cookingTime: profile?.cookingTime ?? null,
  };
}

/** Returns a complete profile, or null if a required answer is missing. */
export function draftToProfile(draft: Draft): Profile | null {
  if (!draft.birthDate || !draft.feeding || !draft.cookingTime) return null;
  const name = draft.babyName.trim();
  return {
    babyName: name ? name : null,
    birthDate: draft.birthDate,
    dueDate: draft.bornEarly ? draft.dueDate : null,
    feeding: draft.feeding,
    allergens: draft.allergens,
    diets: draft.diets,
    cookingTime: draft.cookingTime,
  };
}

type DraftState = {
  draft: Draft;
  update(patch: Partial<Draft>): void;
};

const DraftContext = createContext<DraftState | null>(null);

export function DraftProvider({ initial, children }: { initial: Draft; children: ReactNode }) {
  const [draft, setDraft] = useState(initial);
  const value = useMemo(
    () => ({ draft, update: (patch: Partial<Draft>) => setDraft((d) => ({ ...d, ...patch })) }),
    [draft],
  );
  return <DraftContext.Provider value={value}>{children}</DraftContext.Provider>;
}

export function useDraft(): DraftState {
  const value = useContext(DraftContext);
  if (!value) throw new Error('useDraft must be used inside <DraftProvider>');
  return value;
}
