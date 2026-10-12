import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { babyRecipeCategories, babyRecipes } from '@/content/recipes';
import { fromIsoDate, isIsoDate, today } from '@/domain/dates';
import {
  CUSTOM_MEAL_MAX_LENGTH,
  customMealId,
  customMealName,
  isMealSlot,
  mealSlotLabels,
  planKey,
} from '@/domain/planner';
import { babyCollectionsFor, isAheadOfAge, suitsHousehold } from '@/domain/recipes';
import { babyAge } from '@/domain/stage';
import { usePlanner } from '@/features/planner/planner-context';
import { useProfile } from '@/features/profile/profile-context';
import { useHousehold } from '@/features/profile/use-household';
import { RecipeImage } from '@/features/recipes/recipe-image';
import { AppText, Button, Card, cn, Screen, TextField } from '@/ui';

export default function PickMealScreen() {
  const { date, slot } = useLocalSearchParams<{ date: string; slot: string }>();
  const { profile } = useProfile();
  const household = useHousehold();
  const { plan, setMeal } = usePlanner();
  const planned =
    date && isIsoDate(date) && slot && isMealSlot(slot) ? plan[planKey(date, slot)] : undefined;
  const [ownFood, setOwnFood] = useState(() => (planned ? (customMealName(planned) ?? '') : ''));

  if (!date || !isIsoDate(date) || !slot || !isMealSlot(slot)) {
    return (
      <Screen>
        <AppText variant="title">Day not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const ageMonths = profile ? babyAge(profile, today()).months : 6;
  const { ordered, current } = babyCollectionsFor(babyRecipeCategories, ageMonths);
  const heading = fromIsoDate(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const choose = (recipeId: string | null) => {
    setMeal(date, slot, recipeId)
      .then(() => router.back())
      .catch(() => {});
  };

  return (
    <Screen>
      <View className="gap-1">
        <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
          {mealSlotLabels[slot]}
        </AppText>
        <AppText variant="title">{heading}</AppText>
      </View>
      {plan[planKey(date, slot)] ? (
        <Button
          variant="secondary"
          label={`Clear ${mealSlotLabels[slot].toLowerCase()}`}
          onPress={() => choose(null)}
        />
      ) : null}

      <Card className="gap-3">
        <TextField
          label="Your own food"
          value={ownFood}
          onChangeText={setOwnFood}
          maxLength={CUSTOM_MEAL_MAX_LENGTH}
          placeholder="e.g. Mashed peas"
          returnKeyType="done"
          onSubmitEditing={() => {
            const id = customMealId(ownFood);
            if (id) choose(id);
          }}
        />
        <Button
          label={`Add to ${mealSlotLabels[slot].toLowerCase()}`}
          disabled={!customMealId(ownFood)}
          onPress={() => {
            const id = customMealId(ownFood);
            if (id) choose(id);
          }}
        />
      </Card>

      <AppText variant="heading" size="2xl" className="pt-2">
        Or pick a recipe
      </AppText>

      {ordered.map((group) => {
        const items = babyRecipes.filter(
          (r) => r.categories.includes(group.id) && suitsHousehold(r, household),
        );
        if (!items.length) return null;
        return (
          <View key={group.id} className="gap-1">
            <AppText variant="heading">
              {group.label}
              {group.id === current ? ' · now' : ''}
            </AppText>
            <AppText variant="caption" size="sm">
              From {group.fromMonths} months
            </AppText>
            {items.map((r) => {
              const ahead = isAheadOfAge(r, ageMonths);
              const selected = plan[planKey(date, slot)] === r.id;
              return (
                <Pressable
                  key={r.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${r.title}${ahead ? ', for an older baby' : ''}`}
                  onPress={() => choose(r.id)}
                  className={cn(
                    'min-h-16 flex-row items-center gap-3 border-b border-border py-2 active:opacity-70',
                    ahead && 'opacity-60',
                  )}
                >
                  <RecipeImage recipe={r} className="h-14 w-14 rounded-xl" iconSize={24} />
                  <View className="flex-1">
                    <AppText variant="label" size="lg">
                      {r.title}
                    </AppText>
                    {ahead ? (
                      <AppText variant="caption" size="sm">
                        For babies from {r.fromMonths} months
                      </AppText>
                    ) : null}
                  </View>
                  {selected ? (
                    <AppText variant="label" color="primary" className="font-bold">
                      ✓
                    </AppText>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </Screen>
  );
}
