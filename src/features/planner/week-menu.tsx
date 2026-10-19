import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import type { Food } from '@/content/foods';
import { allRecipes, getRecipe, recipes } from '@/content/recipes';
import { mealsPerDayGuide } from '@/content/solids-plan';
import { addDays, today, type IsoDate } from '@/domain/dates';
import { familyMealOptions, plannedFamilyMeal } from '@/domain/family-meals';
import {
  customMealName,
  dayLabel,
  mealSlotLabels,
  mealSlots,
  mealsPlanned,
  planKey,
  visibleMealSlots,
  weekDates,
  weekRangeLabel,
  weekStart,
  type MealSlot,
} from '@/domain/planner';
import { foodPhoto } from '@/features/foods/food-photos';
import { useHousehold } from '@/features/profile/use-household';
import { RecipeImage } from '@/features/recipes/recipe-image';
import { AppText, Card, cn } from '@/ui';

import { plannedMeal } from './planned-meal';
import { useMealsPerDay } from './use-meals-per-day';
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
  total = 3,
  onPress,
  compact = false,
}: {
  date: IsoDate;
  selected: boolean;
  isToday: boolean;
  planned: number;
  /** Meals a day to show dots for (more if more are planned). */
  total?: number;
  onPress(): void;
  /** Shares a fixed-width row (Home) instead of scrolling. */
  compact?: boolean;
}) {
  const { weekday, day } = dayLabel(date);
  const dots = Math.max(total, planned);
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${weekday} ${day}${isToday ? ', today' : ''}, ${planned} of ${dots} meals planned`}
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
        {Array.from({ length: dots }, (_, i) => (
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

/** A small green text button, such as "Change", beside a meal. */
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
      className="min-h-12 justify-center px-1 active:opacity-60"
    >
      <AppText variant="label" color="primary" className="font-bold">
        {label}
      </AppText>
    </Pressable>
  );
}

/** One planned item: a picture, its name and what it is, opening its page when tapped. */
function MealLine({
  picture,
  kicker,
  title,
  accessibilityLabel,
  onPress,
}: {
  picture: ReactNode;
  kicker: string;
  title: string;
  accessibilityLabel: string;
  onPress?: () => void;
}) {
  const body = (
    <>
      {picture}
      <View className="flex-1">
        <AppText variant="caption" size="xs">
          {kicker}
        </AppText>
        <AppText variant="label" className="font-bold leading-5">
          {title}
        </AppText>
      </View>
    </>
  );
  if (!onPress) {
    return (
      <View
        className="min-h-12 flex-1 flex-row items-center gap-3"
        accessible
        accessibilityLabel={accessibilityLabel}
      >
        {body}
      </View>
    );
  }
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="min-h-12 flex-1 flex-row items-center gap-3 active:opacity-70"
    >
      {body}
    </Pressable>
  );
}

/**
 * One meal of the day as a flat row: the baby's meal with "Change", and under it the
 * family meal (or a way to add one).
 */
function SlotRow({ date, slot }: { date: IsoDate; slot: MealSlot }) {
  const { plan, family: familyPlan } = usePlanner();
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

  let baby: ReactNode = null;
  if (food) {
    baby = (
      <MealLine
        picture={<FoodThumb food={food} />}
        kicker="Single food"
        title={food.name}
        accessibilityLabel={`Baby's ${mealName}: ${food.name}. Opens the food guide.`}
        onPress={() => router.push({ pathname: '/food/[id]', params: { id: food.id } })}
      />
    );
  } else if (own) {
    baby = (
      <MealLine
        picture={
          <View className="h-12 w-12 items-center justify-center rounded-xl bg-surface-muted">
            <AppText size="2xl">🍽️</AppText>
          </View>
        }
        kicker="Your own food"
        title={own}
        accessibilityLabel={`Baby's ${mealName}: ${own}, your own food.`}
      />
    );
  } else if (recipe) {
    baby = (
      <MealLine
        picture={<RecipeImage recipe={recipe} className="h-12 w-12 rounded-xl" iconSize={22} />}
        kicker="For baby"
        title={recipe.title}
        accessibilityLabel={`Baby's ${mealName}: ${recipe.title}. Opens the recipe.`}
        onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
      />
    );
  }

  return (
    <View className="gap-1 border-t border-border pt-3">
      <AppText variant="caption" size="xs" className="font-bold uppercase tracking-wider">
        {mealSlotLabels[slot]}
      </AppText>
      {baby ? (
        <View className="flex-row items-center gap-2">
          {baby}
          <TextAction
            label="Change"
            accessibilityLabel={`Change baby's ${mealName}`}
            onPress={pick}
          />
        </View>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Plan ${mealName}`}
          onPress={pick}
          className="min-h-12 justify-center active:opacity-60"
        >
          <AppText variant="label" color="primary" className="font-bold">
            + Plan {mealName}
          </AppText>
        </Pressable>
      )}

      {family ? (
        <View className="ml-4 gap-1 border-l-2 border-border pl-3">
          <View className="flex-row items-center gap-2">
            <MealLine
              picture={
                <RecipeImage
                  recipe={family.recipe}
                  className="h-10 w-10 rounded-lg"
                  iconSize={18}
                />
              }
              kicker="For the family"
              title={family.recipe.title}
              accessibilityLabel={`Family meal: ${family.recipe.title}. Opens the recipe.`}
              onPress={() =>
                router.push({ pathname: '/recipe/[id]', params: { id: family.recipe.id } })
              }
            />
            <TextAction
              label="Change"
              accessibilityLabel={`Change or remove the family meal for ${mealName}`}
              onPress={pickFamily}
            />
          </View>
          {family.note ? (
            <AppText variant="caption" size="sm">
              {family.note}
            </AppText>
          ) : null}
        </View>
      ) : canAddFamily ? (
        <View className="ml-4 border-l-2 border-border pl-3">
          <TextAction
            label="+ Add a family meal"
            accessibilityLabel={`Add a family meal to ${mealName}`}
            onPress={pickFamily}
          />
        </View>
      ) : null}
    </View>
  );
}

/**
 * The baby's menu for the week: pick a day, then its meals with family meals. Shows as
 * many meals a day as suit the baby's stage (1, then 2, then 3), plus any planned.
 */
export function WeekMenu() {
  const { plan } = usePlanner();
  const now = today();
  const [offset, setOffset] = useState(0);
  const [selected, setSelected] = useState<IsoDate>(now);
  const [extra, setExtra] = useState(0);
  const monday = addDays(weekStart(now), offset * 7);
  const days = weekDates(monday);
  const day = days.includes(selected) ? selected : days[0];
  const planned = days.reduce((n, d) => n + mealsPlanned(plan, d), 0);
  const perDay = useMealsPerDay(day);
  const slots = visibleMealSlots(plan, day, Math.min(mealSlots.length, perDay + extra));
  const mealsWord = planned === 1 ? 'meal' : 'meals';

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
            {`${weekRangeLabel(monday)} · ${planned} ${mealsWord} planned`}
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
            total={Math.min(mealSlots.length, perDay + extra)}
            onPress={() => setSelected(d)}
          />
        ))}
      </ScrollView>

      {slots.map((slot) => (
        <SlotRow key={slot} date={day} slot={slot} />
      ))}

      <View className="gap-1 border-t border-border pt-3">
        {slots.length < mealSlots.length ? (
          <TextAction
            label="+ Add another meal"
            accessibilityLabel="Add another meal to each day"
            onPress={() => setExtra((e) => e + 1)}
          />
        ) : null}
        <AppText variant="caption" size="sm">
          {mealsPerDayGuide.note}
        </AppText>
      </View>
    </Card>
  );
}
