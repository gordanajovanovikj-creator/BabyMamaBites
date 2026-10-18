import type { Household } from '@/domain/recipes';
import { allergenLabels, dietLabels } from '@/domain/profile-labels';
import { AppText } from '@/ui';

/** True when the household has allergies or diets, so there's a note to show. */
export function hasHouseholdNote(household: Household): boolean {
  return household.allergens.length > 0 || household.diets.length > 0;
}

/** "Matched to your household: no peanut · vegetarian. 3 hidden." */
export function HouseholdNote({ household, hidden }: { household: Household; hidden: number }) {
  const parts = [
    household.allergens.length
      ? `no ${household.allergens.map((a) => allergenLabels[a].toLowerCase()).join(', ')}`
      : null,
    ...household.diets.map((d) => dietLabels[d].toLowerCase()),
  ].filter(Boolean);
  if (!parts.length) return null;
  return (
    <AppText variant="caption" size="sm">
      Matched to your household: {parts.join(' · ')}.{hidden ? ` ${hidden} hidden.` : ''}
    </AppText>
  );
}
