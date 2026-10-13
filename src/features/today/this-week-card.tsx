import { Image } from 'expo-image';
import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { quickFoods, type PlanWeek } from '@/content/solids-plan';
import { formatTime, nextEvent } from '@/domain/calendar';
import { addDays, fromIsoDate, type IsoDate } from '@/domain/dates';
import {
  bestBefore,
  mealSlotLabels,
  mealSlots,
  mealsPlanned,
  planKey,
  useSoonItems,
  weekDates,
  weekStart,
  type MealSlot,
} from '@/domain/planner';
import { useCalendar } from '@/features/calendar/calendar-context';
import { foodPhoto } from '@/features/foods/food-photos';
import { plannedMeal } from '@/features/planner/planned-meal';
import { usePlanner } from '@/features/planner/planner-context';
import { DayPill } from '@/features/planner/week-menu';
import { RecipeImage } from '@/features/recipes/recipe-image';
import { shadows } from '@/theme/colors';
import { AppText, cn } from '@/ui';

/** How far ahead "coming up" looks for a calendar event. */
const EVENT_DAYS = 7;

function shortDay(date: IsoDate, now: IsoDate): string {
  if (date === now) return 'Today';
  if (date === addDays(now, 1)) return 'Tomorrow';
  return fromIsoDate(date).toLocaleDateString('en-US', { weekday: 'short' });
}

function monthDay(date: IsoDate): string {
  return fromIsoDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/** One meal of the selected day: its photo and name, or "+ Plan" when empty. */
function MealTile({ date, slot }: { date: IsoDate; slot: MealSlot }) {
  const { plan } = usePlanner();
  const meal = plannedMeal(plan[planKey(date, slot)]);
  const label = mealSlotLabels[slot];
  const pick = () => router.push({ pathname: '/planner/pick', params: { date, slot } });

  if (!meal) {
    return (
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Plan ${label.toLowerCase()}`}
        onPress={pick}
        className="min-h-36 flex-1 gap-1 rounded-2xl border border-dashed border-border bg-surface p-2 active:opacity-70"
      >
        <AppText variant="label" size="xs" color="on-accent" className="font-bold uppercase">
          {label}
        </AppText>
        <View className="flex-1 items-center justify-center">
          <AppText variant="label" color="primary" className="font-bold">
            + Plan
          </AppText>
        </View>
      </Pressable>
    );
  }

  const open = () => {
    if (meal.kind === 'recipe') {
      router.push({ pathname: '/recipe/[id]', params: { id: meal.recipe.id } });
    } else if (meal.kind === 'food') {
      router.push({ pathname: '/food/[id]', params: { id: meal.food.id } });
    } else {
      pick();
    }
  };
  const photo = meal.kind === 'food' ? foodPhoto(meal.food.id) : undefined;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}: ${meal.title}`}
      onPress={open}
      className="min-h-36 flex-1 gap-1 rounded-2xl bg-surface-muted p-2 active:opacity-70"
    >
      <AppText variant="label" size="xs" color="on-accent" className="font-bold uppercase">
        {label}
      </AppText>
      {meal.kind === 'recipe' ? (
        <RecipeImage recipe={meal.recipe} className="h-16 rounded-xl" iconSize={28} />
      ) : (
        <View
          className="h-16 items-center justify-center overflow-hidden rounded-xl bg-surface"
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
            <AppText size="2xl">{meal.kind === 'food' ? meal.food.emoji : '🍽️'}</AppText>
          )}
        </View>
      )}
      <AppText variant="label" size="sm" className="font-bold leading-5" numberOfLines={2}>
        {meal.title}
      </AppText>
    </Pressable>
  );
}

/** A soft one-line reminder under the meals (calendar event or freezer item). */
function ComingUp({
  emoji,
  strong,
  text,
  tone,
  onPress,
  label,
}: {
  emoji: string;
  strong: string;
  text: string;
  tone: 'sky' | 'accent';
  onPress(): void;
  label: string;
}) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      className={cn(
        'min-h-12 flex-row items-center gap-3 rounded-2xl px-3 py-2 active:opacity-70',
        tone === 'sky' ? 'bg-sky' : 'bg-accent',
      )}
    >
      <AppText size="xl">{emoji}</AppText>
      <AppText size="sm" className="flex-1" numberOfLines={2}>
        <AppText size="sm" className="font-bold">
          {strong}
        </AppText>
        {` · ${text}`}
      </AppText>
    </Pressable>
  );
}

export type ThisWeekCardProps = {
  now: IsoDate;
  /** The solids plan week the baby is on, or undefined before solids or after the plan. */
  planWeek?: PlanWeek;
};

/**
 * Home's planner snapshot: this week's days with meal dots, the chosen day's
 * three meals, the next calendar event, a freezer item to use soon, and this
 * week's focus from the solids plan.
 */
export function ThisWeekCard({ now, planWeek }: ThisWeekCardProps) {
  const { plan, freezer } = usePlanner();
  const { entries } = useCalendar();
  const [selected, setSelected] = useState<IsoDate>(now);
  const days = weekDates(weekStart(now));
  const day = days.includes(selected) ? selected : now;
  const planned = days.reduce((n, d) => n + mealsPlanned(plan, d), 0);
  const event = nextEvent(entries, now, EVENT_DAYS);
  const freezerItem = useSoonItems(freezer, now)[0];
  const openPlanner = () =>
    router.navigate({ pathname: '/baby', params: { tab: 'plan', at: String(Date.now()) } });
  const focus = planWeek
    ? planWeek.allergen
      ? `Week ${planWeek.week} of solids: try ${planWeek.allergen.label.toLowerCase()}`
      : `Week ${planWeek.week} of solids: ${planWeek.title.toLowerCase()}`
    : null;
  const focusEmoji =
    (planWeek?.allergen && quickFoods.find((f) => f.allergen === planWeek.allergen?.id)?.emoji) ??
    '🥄';
  const cubes = (n: number) => `${n} ${n === 1 ? 'cube' : 'cubes'}`;

  return (
    <View className="gap-3 px-5">
      <View className="flex-row items-end justify-between">
        <View className="flex-1">
          <AppText variant="heading" size="2xl">
            This week
          </AppText>
          <AppText variant="caption" size="sm">
            {`${planned} of 21 meals planned`}
          </AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Open the meal planner"
          onPress={openPlanner}
          hitSlop={8}
          className="min-h-11 justify-center pl-3 active:opacity-60"
        >
          <AppText variant="label" color="muted" className="font-bold">
            Plan ›
          </AppText>
        </Pressable>
      </View>

      <View
        className="gap-3 rounded-3xl border border-border bg-surface p-2.5"
        style={{ boxShadow: shadows.card }}
      >
        <View className="flex-row gap-1" accessibilityRole="tablist">
          {days.map((d) => (
            <DayPill
              key={d}
              date={d}
              selected={d === day}
              isToday={d === now}
              planned={mealsPlanned(plan, d)}
              onPress={() => setSelected(d)}
              compact
            />
          ))}
        </View>
        <View className="flex-row gap-2">
          {mealSlots.map((slot) => (
            <MealTile key={slot} date={day} slot={slot} />
          ))}
        </View>
        {event ? (
          <ComingUp
            emoji="📅"
            tone="sky"
            strong={shortDay(event.date, now)}
            text={event.time ? `${event.text}, ${formatTime(event.time)}` : event.text}
            label={`Coming up ${shortDay(event.date, now)}: ${event.text}. Opens the calendar.`}
            onPress={() => router.push('/calendar')}
          />
        ) : null}
        {freezerItem ? (
          <ComingUp
            emoji="🧊"
            tone="accent"
            strong={freezerItem.name}
            text={`use ${cubes(freezerItem.cubes)} by ${monthDay(bestBefore(freezerItem))}`}
            label={`${freezerItem.name}: use ${cubes(freezerItem.cubes)} by ${monthDay(bestBefore(freezerItem))}. Opens the freezer.`}
            onPress={openPlanner}
          />
        ) : null}
      </View>

      {focus && planWeek ? (
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`${focus}. Opens week ${planWeek.week}.`}
          onPress={() =>
            router.push({ pathname: '/solids/week/[n]', params: { n: String(planWeek.week) } })
          }
          className="min-h-12 flex-row items-center gap-2 self-start rounded-full bg-sky px-4 py-2 active:opacity-70"
        >
          <AppText size="lg">{focusEmoji}</AppText>
          <AppText variant="label" color="on-sky" className="font-bold">
            {`${focus} ›`}
          </AppText>
        </Pressable>
      ) : null}
    </View>
  );
}
