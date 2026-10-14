import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, ScrollView, View } from 'react-native';

import { getFood } from '@/content/foods';
import { getRecipe } from '@/content/recipes';
import { fromIsoDate, today, type IsoDate } from '@/domain/dates';
import {
  firstOpenSlot,
  foodMealId,
  mealSlotLabels,
  mealSlots,
  planKey,
  upcomingDays,
  type MealSlot,
} from '@/domain/planner';
import { plannedMeal } from '@/features/planner/planned-meal';
import { usePlanner } from '@/features/planner/planner-context';
import { AppText, Button, Chip, haptics, Notice, Screen } from '@/ui';

const DAYS = 7;

function dayChipLabel(date: IsoDate, now: IsoDate): string {
  if (date === now) return 'Today';
  return fromIsoDate(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' });
}

/** Adds one recipe, or one food from the food guide, to a day and meal of the planner. */
export default function AddToPlanScreen() {
  const params = useLocalSearchParams<{ food?: string; recipe?: string }>();
  const food = params.food ? getFood(params.food) : undefined;
  const recipe = params.recipe ? getRecipe(params.recipe) : undefined;
  const item = recipe
    ? { id: recipe.id, name: recipe.title }
    : food
      ? { id: foodMealId(food.id), name: food.name }
      : undefined;
  const { plan, setMeal } = usePlanner();
  const now = today();
  const [date, setDate] = useState<IsoDate>(now);
  const [slot, setSlot] = useState<MealSlot>(() => firstOpenSlot(plan, now));
  const [saving, setSaving] = useState(false);

  if (!item) {
    return (
      <Screen>
        <AppText variant="title">Not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const current = plannedMeal(plan[planKey(date, slot)]);
  const id = item.id;
  const already = plan[planKey(date, slot)] === id;

  async function save() {
    setSaving(true);
    try {
      await setMeal(date, slot, id);
      haptics.success();
      router.back();
    } catch {
      setSaving(false);
      Alert.alert('Could not save', 'Please try again.');
    }
  }

  return (
    <Screen
      footer={
        <Button
          className="flex-1"
          label={
            already
              ? 'Already planned'
              : current
                ? `Replace with ${item.name}`
                : `Add to ${mealSlotLabels[slot].toLowerCase()}`
          }
          disabled={already || saving}
          onPress={save}
        />
      }
    >
      <View className="gap-1">
        <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
          Add to meal plan
        </AppText>
        <AppText variant="title">{item.name}</AppText>
      </View>

      <View className="gap-2">
        <AppText variant="label">Day</AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="gap-2 py-1"
        >
          {upcomingDays(now, DAYS).map((d) => (
            <Chip
              key={d}
              label={dayChipLabel(d, now)}
              selected={d === date}
              onPress={() => {
                setDate(d);
                setSlot(firstOpenSlot(plan, d));
              }}
            />
          ))}
        </ScrollView>
      </View>

      <View className="gap-2">
        <AppText variant="label">Meal</AppText>
        <View className="flex-row flex-wrap gap-2">
          {mealSlots.map((s) => (
            <Chip
              key={s}
              label={mealSlotLabels[s]}
              selected={s === slot}
              onPress={() => setSlot(s)}
            />
          ))}
        </View>
      </View>

      {current && !already ? (
        <Notice
          title={`${mealSlotLabels[slot]} already has ${current.title}`}
          body={`Adding ${item.name} will replace it.`}
        />
      ) : null}
    </Screen>
  );
}
