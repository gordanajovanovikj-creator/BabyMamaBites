import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { allRecipes, getRecipe, recipes, type Recipe } from '@/content/recipes';
import { isIsoDate } from '@/domain/dates';
import { familyMealOptions, NO_FAMILY_MEAL, plannedFamilyMeal } from '@/domain/family-meals';
import { isMealSlot, mealSlotLabels, planKey } from '@/domain/planner';
import { familyMealFor, recipeMeta } from '@/domain/recipes';
import { usePlanner } from '@/features/planner/planner-context';
import { useHousehold } from '@/features/profile/use-household';
import { RecipeImage } from '@/features/recipes/recipe-image';
import { AppText, Button, Screen } from '@/ui';

const FIRST_OPTIONS = 8;

function OptionRow({
  recipe,
  detail,
  selected,
  onPress,
}: {
  recipe: Recipe;
  detail: string;
  selected: boolean;
  onPress(): void;
}) {
  return (
    <Pressable
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${recipe.title}. ${detail}`}
      onPress={onPress}
      className="min-h-16 flex-row items-center gap-3 border-b border-border py-2 active:opacity-70"
    >
      <RecipeImage recipe={recipe} className="h-14 w-14 rounded-xl" iconSize={24} />
      <View className="flex-1 gap-0.5">
        <AppText variant="label" size="lg">
          {recipe.title}
        </AppText>
        <AppText variant="caption" size="sm">
          {detail}
        </AppText>
      </View>
      {selected ? (
        <AppText variant="label" color="primary" className="font-bold">
          ✓
        </AppText>
      ) : null}
    </Pressable>
  );
}

/**
 * The family meal next to a planned baby recipe: keep the suggestion, pick another
 * grown-up recipe made with the same ingredients, or have no family meal.
 */
export default function FamilyMealScreen() {
  const { date, slot } = useLocalSearchParams<{ date: string; slot: string }>();
  const household = useHousehold();
  const { plan, family, setFamilyMeal } = usePlanner();
  const [showAll, setShowAll] = useState(false);
  const valid = date && isIsoDate(date) && slot && isMealSlot(slot);
  const baby = valid ? getRecipe(plan[planKey(date, slot)] ?? '') : undefined;

  if (!valid || !baby) {
    return (
      <Screen>
        <AppText variant="title">Meal not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const choice = family[planKey(date, slot)];
  const current = plannedFamilyMeal(baby, choice, allRecipes, household);
  const suggested = familyMealFor(baby, allRecipes, household);
  const options = familyMealOptions(baby, recipes, household, slot).filter(
    (o) => o.recipe.id !== suggested?.recipe.id,
  );
  const shown = showAll ? options : options.slice(0, FIRST_OPTIONS);

  const pick = (next: string | null) => {
    setFamilyMeal(date, slot, next)
      .then(() => router.back())
      .catch(() => {});
  };

  return (
    <Screen>
      <View className="gap-1">
        <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
          {`Family meal · ${mealSlotLabels[slot]}`}
        </AppText>
        <AppText variant="title">Cook for the family too?</AppText>
        <AppText color="muted">{`To go with baby's ${baby.title.toLowerCase()}.`}</AppText>
      </View>

      {current ? (
        <Button label={`Keep ${current.recipe.title}`} onPress={() => router.back()} />
      ) : null}
      <Button
        variant="secondary"
        label={current ? 'No family meal' : 'Keep it baby-only'}
        accessibilityState={{ selected: !current }}
        onPress={() => pick(NO_FAMILY_MEAL)}
      />

      {suggested ? (
        <View className="gap-1 pt-2">
          <AppText variant="heading">Suggested</AppText>
          <OptionRow
            recipe={suggested.recipe}
            detail={suggested.note}
            selected={current?.recipe.id === suggested.recipe.id}
            onPress={() => pick(null)}
          />
        </View>
      ) : null}

      {options.length ? (
        <View className="gap-1 pt-2">
          <AppText variant="heading">More family meals with these ingredients</AppText>
          {shown.map((o) => (
            <OptionRow
              key={o.recipe.id}
              recipe={o.recipe}
              detail={`Also uses ${o.shared.join(', ')} · ${recipeMeta(o.recipe)}`}
              selected={current?.recipe.id === o.recipe.id}
              onPress={() => pick(o.recipe.id)}
            />
          ))}
          {options.length > shown.length ? (
            <Button
              variant="quiet"
              label={`Show all ${options.length}`}
              onPress={() => setShowAll(true)}
            />
          ) : null}
        </View>
      ) : null}
    </Screen>
  );
}
