import type { Household } from '@/domain/recipes';
import { allergenLabels, dietLabels } from '@/domain/profile-labels';
import { AppText } from '@/ui';

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
