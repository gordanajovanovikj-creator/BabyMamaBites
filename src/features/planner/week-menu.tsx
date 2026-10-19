import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import type { Food } from '@/content/foods';
import { allRecipes, getRecipe, recipes } from '@/content/recipes';
import { addDays, today, type IsoDate } from '@/domain/dates';
import { familyMealOptions, NO_FAMILY_MEAL, plannedFamilyMeal } from '@/domain/family-meals';
import {
  customMealName,
  dayLabel,
  mealSlotLabels,
  mealSlots,
  mealsPlanned,
  planKey,
  weekDates,
  weekRangeLabel,
  weekStart,
  type MealSlot,
} from '@/domain/planner';
import { foodPhoto } from '@/features/foods/food-photos';
import { useHousehold } from '@/features/profile/use-household';
import { FamilyMealCard } from '@/features/recipes/family-meal-card';
import { AppText, Card, cn } from '@/ui';

import { plannedMeal } from './planned-meal';
import { usePlanner } from './planner-context';

function RoundButton({ label, glyph, onPress }: { label: string; glyph: string; onPress(): void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      hitSlop={6}
      className="h-12 w-12 items-center justify-center rounded-full bg-surface-muted active:opacity-70"
    >
      <AppText variant="heading" color="primary">
        {glyph}
      </AppText>
    </Pressable>
  );
}

export function DayPill({
  date,
  selected,
  isToday,
  planned,
  onPress,
  compact = false,
}: {
  date: IsoDate;
  selected: boolean;
  isToday: boolean;
  planned: number;
  onPress(): void;
  /** Shares a fixed-width row (Home) instead of scrolling. */
  compact?: boolean;
}) {
  const { weekday, day } = dayLabel(date);
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${weekday} ${day}${isToday ? ', today' : ''}, ${planned} of 3 meals planned`}
      onPress={onPress}
      className={cn(
        'min-h-16 items-center justify-center gap-0.5 rounded-2xl active:opacity-80',
        compact ? 'flex-1' : 'w-14',
        selected ? 'bg-primary' : 'bg-surface-muted',
      )}
    >
      <AppText variant="caption" size="xs" color={selected ? 'on-primary' : 'muted'}>
        {isToday ? 'Today' : weekday}
      </AppText>
      <AppText
        variant="label"
        size="lg"
        color={selected ? 'on-primary' : 'ink'}
        className="font-bold"
      >
        {day}
      </AppText>
      <View className="flex-row gap-0.5">
        {[0, 1, 2].map((i) => (
          <View
            key={i}
            className={cn(
              'h-1.5 w-1.5 rounded-full',
              i < planned
                ? selected
                  ? 'bg-on-primary'
                  : 'bg-primary'
                : selected
                  ? 'bg-on-primary opacity-30'
                  : 'bg-border',
            )}
          />
        ))}
      </View>
    </Pressable>
  );
}

/** Small white photo tile for a single food. Decorative. */
function FoodThumb({ food }: { food: Food }) {
  const photo = foodPhoto(food.id);
  return (
    <View
      className="h-12 w-12 items-center justify-center overflow-hidden rounded-xl border border-border bg-surface"
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
    >
      {photo ? (
        <Image
          source={photo}
          contentFit="cover"
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      ) : (
        <AppText size="2xl">{food.emoji}</AppText>
      )}
    </View>
  );
}

/** A small green text button, such as "Change", inside a meal card. */
function TextAction({
  label,
  accessibilityLabel,
  onPress,
}: {
  label: string;
  accessibilityLabel: string;
  onPress(): void;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      hitSlop={6}
      className="min-h-11 justify-center active:opacity-60"
    >
      <AppText variant="label" color="primary" className="font-bold">
        {label}
      </AppText>
    </Pressable>
  );
}

function SlotCard({ date, slot }: { date: IsoDate; slot: MealSlot }) {
  const { plan, family: familyPlan, setFamilyMeal } = usePlanner();
  const household = useHousehold();
  const id = plan[planKey(date, slot)];
  const recipe = id ? getRecipe(id) : undefined;
  const own = id ? customMealName(id) : null;
  const meal = plannedMeal(id);
  const food = meal?.kind === 'food' ? meal.food : null;
  const choice = familyPlan[planKey(date, slot)];
  const family = recipe ? plannedFamilyMeal(recipe, choice, allRecipes, household) : null;
  const canAddFamily =
    !!recipe &&
    !family &&
    (!!recipe.familyMeal || familyMealOptions(recipe, recipes, household, slot).length > 0);
  const pick = () => router.push({ pathname: '/planner/pick', params: { date, slot } });
  const pickFamily = () => router.push({ pathname: '/planner/family', params: { date, slot } });
  const mealName = mealSlotLabels[slot].toLowerCase();

  return (
    <View className="gap-2 rounded-3xl bg-surface-muted p-4">
      <AppText variant="caption" size="xs" className="font-bold uppercase tracking-wider">
        {mealSlotLabels[slot]}
      </AppText>
      {food ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Baby's ${mealSlotLabels[slot].toLowerCase()}: ${food.name}. Opens the food guide.`}
            onPress={() => router.push({ pathname: '/food/[id]', params: { id: food.id } })}
            className="min-h-12 flex-row items-center gap-3 active:opacity-70"
          >
            <FoodThumb food={food} />
            <View className="flex-1">
              <AppText variant="caption" size="xs">
                Single food
              </AppText>
              <AppText variant="label" size="lg" className="font-bold">
                {food.name}
              </AppText>
            </View>
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Change ${mealSlotLabels[slot].toLowerCase()}`}
            onPress={pick}
            hitSlop={6}
            className="min-h-11 justify-center self-start active:opacity-60"
          >
            <AppText variant="label" color="primary" className="font-bold">
              Change
            </AppText>
          </Pressable>
        </>
      ) : own ? (
        <>
          <View className="min-h-12 flex-row items-center gap-3">
            <AppText size="2xl">🍽️</AppText>
            <View className="flex-1">
              <AppText variant="caption" size="xs">
                Your own food
              </AppText>
              <AppText variant="label" size="lg" className="font-bold">
                {own}
              </AppText>
            </View>
          </View>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Change ${mealSlotLabels[slot].toLowerCase()}`}
            onPress={pick}
            hitSlop={6}
            className="min-h-11 justify-center self-start active:opacity-60"
          >
            <AppText variant="label" color="primary" className="font-bold">
              Change
            </AppText>
          </Pressable>
        </>
      ) : recipe ? (
        <>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Baby's ${mealSlotLabels[slot].toLowerCase()}: ${recipe.title}. Opens the recipe.`}
            onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
            className="min-h-12 flex-row items-center gap-3 active:opacity-70"
          >
            <AppText size="2xl">{recipe.emoji}</AppText>
            <View className="flex-1">
              <AppText variant="caption" size="xs">
                For baby
              </AppText>
              <AppText variant="label" size="lg" className="font-bold">
                {recipe.title}
              </AppText>
            </View>
          </Pressable>
          {family ? (
            <View className="gap-1 rounded-2xl bg-surface p-3">
              <FamilyMealCard recipe={family.recipe} note={family.note} compact />
              <View className="flex-row gap-6">
                <TextAction
                  label="Choose another"
                  accessibilityLabel={`Choose another family meal for ${mealName}`}
                  onPress={pickFamily}
                />
                <TextAction
                  label="Remove"
                  accessibilityLabel={`Remove the family meal from ${mealName}`}
                  onPress={() => {
                    setFamilyMeal(date, slot, NO_FAMILY_MEAL).catch(() => {});
                  }}
                />
              </View>
            </View>
          ) : canAddFamily ? (
            <TextAction
              label="+ Add a family meal"
              accessibilityLabel={`Add a family meal to ${mealName}`}
              onPress={pickFamily}
            />
          ) : null}
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Change ${mealSlotLabels[slot].toLowerCase()}`}
            onPress={pick}
            hitSlop={6}
            className="min-h-11 justify-center self-start active:opacity-60"
          >
            <AppText variant="label" color="primary" className="font-bold">
              Change
            </AppText>
          </Pressable>
        </>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Plan ${mealSlotLabels[slot].toLowerCase()}`}
          onPress={pick}
          className="min-h-12 justify-center active:opacity-60"
        >
          <AppText variant="label" color="primary" className="font-bold">
            + Plan {mealSlotLabels[slot].toLowerCase()}
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

/** The baby's menu for the week: pick a day, then breakfast, lunch and dinner with family meals. */
export function WeekMenu() {
  const { plan } = usePlanner();
  const now = today();
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<IsoDate>(now);
  const monday = addDays(weekStart(now), offset * 7);
  const days = weekDates(monday);
  const day = days.includes(selected) ? selected : days[0];
  const planned = days.reduce((n, d) => n + mealsPlanned(plan, d), 0);

  const moveWeek = (delta: number) => {
    setOffset((o) => o + delta);
    setSelected(addDays(weekStart(now), (offset + delta) * 7));
  };

  return (
    <Card className="gap-4">
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <AppText variant="heading">
            {offset === 0 ? "This week's menu" : offset === 1 ? "Next week's menu" : 'Menu'}
          </AppText>
          <AppText variant="caption" size="sm">
            {weekRangeLabel(monday)} · {planned} of 21 meals planned
          </AppText>
        </View>
        <RoundButton label="Previous week" glyph="‹" onPress={() => moveWeek(-1)} />
        <RoundButton label="Next week" glyph="›" onPress={() => moveWeek(1)} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2"
        accessibilityRole="tablist"
      >
        {days.map((d) => (
          <DayPill
            key={d}
            date={d}
            selected={d === day}
            isToday={d === now}
            planned={mealsPlanned(plan, d)}
            onPress={() => setSelected(d)}
          />
        ))}
      </ScrollView>

      {mealSlots.map((slot) => (
        <SlotCard key={slot} date={day} slot={slot} />
      ))}
    </Card>
  );
}
