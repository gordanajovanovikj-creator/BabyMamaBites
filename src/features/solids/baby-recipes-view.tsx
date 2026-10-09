import { router } from 'expo-router';
import { View } from 'react-native';

import { babyRecipeCategories, babyRecipes } from '@/content/recipes';
import { babyCollectionsFor, findRecipes, recipeSections } from '@/domain/recipes';
import { useHousehold } from '@/features/profile/use-household';
import { CategoryRow } from '@/features/recipes/category-row';
import { HouseholdNote } from '@/features/recipes/household-note';
import { RecipeSection } from '@/features/recipes/recipe-section';
import { Notice } from '@/ui';

export type BabyRecipesViewProps = {
  babyName: string | null;
  /** Age used for feeding (corrected where it applies). */
  ageMonths: number;
};

/** Baby and toddler recipes grouped by age, the baby's current group first (Mom-tab style). */
export function BabyRecipesView({ babyName, ageMonths }: BabyRecipesViewProps) {
  const household = useHousehold();
  const { ordered, current } = babyCollectionsFor(babyRecipeCategories, ageMonths);
  const byAge = [...babyRecipeCategories].sort((a, b) => (a.fromMonths ?? 0) - (b.fromMonths ?? 0));
  const sections = recipeSections(ordered, babyRecipes, household);
  const hidden = findRecipes(babyRecipes, household).hiddenForSafety;

  return (
    <>
      <CategoryRow
        categories={byAge}
        selectedId={current}
        onSelect={(id) => id && router.push({ pathname: '/category/[id]', params: { id } })}
      />
      <View className="gap-3 px-5">
        {current === null ? (
          <Notice
            title="Solids start at about 6 months"
            body={`These recipes are here so you can read ahead. Most babies are ready around 6 months; check the readiness signs on the Plan tab.`}
          />
        ) : null}
        <HouseholdNote household={household} hidden={hidden} />
      </View>
      {sections.map((s) => {
        const from = s.category.fromMonths ?? 0;
        const subtitle =
          s.category.id === current
            ? `For ${babyName ?? 'your baby'} now · from ${from} months`
            : from > ageMonths
              ? `Coming up · from ${from} months`
              : `From ${from} months`;
        return (
          <RecipeSection
            key={s.category.id}
            category={s.category}
            recipes={s.recipes}
            subtitle={subtitle}
          />
        );
      })}
      <View className="px-5">
        <Notice
          tone="caution"
          title="Draft recipes"
          body="Not yet reviewed by a pediatric dietitian. Offer new foods one at a time, always stay with your baby while they eat, and follow your pediatrician's advice."
        />
      </View>
    </>
  );
}
