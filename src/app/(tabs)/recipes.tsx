import { ComingSoon } from '@/features/shared/coming-soon';

export default function RecipesScreen() {
  return (
    <ComingSoon
      title="Recipes"
      intro="Nourishing meals for you, matched to the time and energy you have."
      upcoming={[
        'Scrollable categories: Nourish while nursing, Busy moms, With one hand, Dinner in 30…',
        'Filters for 5-minute, one-handed, batch-cook and freezer-friendly',
        'Allergy- and diet-aware suggestions',
      ]}
    />
  );
}
