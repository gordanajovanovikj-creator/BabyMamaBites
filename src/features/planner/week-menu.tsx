import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, ScrollView, View } from 'react-native';

import { allRecipes, getRecipe } from '@/content/recipes';
import { addDays, today, type IsoDate } from '@/domain/dates';
import {
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
import { familyMealFor } from '@/domain/recipes';
import { useHousehold } from '@/features/profile/use-household';
import { AppText, Card, cn } from '@/ui';

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

function DayPill({
  date,
  selected,
  isToday,
  planned,
  onPress,
}: {
  date: IsoDate;
  selected: boolean;
  isToday: boolean;
  planned: number;
  onPress(): void;
}) {
  const { weekday, day } = dayLabel(date);
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected }}
      accessibilityLabel={`${weekday} ${day}${isToday ? ', today' : ''}, ${planned} of 3 meals planned`}
      onPress={onPress}
      className={cn(
        'min-h-16 w-14 items-center justify-center gap-0.5 rounded-2xl active:opacity-80',
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

function SlotCard({ date, slot }: { date: IsoDate; slot: MealSlot }) {
  const { plan } = usePlanner();
  const household = useHousehold();
  const id = plan[planKey(date, slot)];
  const recipe = id ? getRecipe(id) : undefined;
  const family = recipe ? familyMealFor(recipe, allRecipes, household) : null;
  const pick = () => router.push({ pathname: '/planner/pick', params: { date, slot } });

  return (
    <View className="gap-2 rounded-3xl bg-surface-muted p-4">
      <AppText variant="caption" size="xs" className="font-bold uppercase tracking-wider">
        {mealSlotLabels[slot]}
      </AppText>
      {recipe ? (
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
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Family meal: ${family.recipe.title}. ${family.note} Opens the recipe.`}
              onPress={() =>
                router.push({ pathname: '/recipe/[id]', params: { id: family.recipe.id } })
              }
              className="min-h-12 gap-1 rounded-2xl bg-surface p-3 active:opacity-70"
            >
              <View className="flex-row items-center gap-3">
                <AppText size="2xl">{family.recipe.emoji}</AppText>
                <View className="flex-1">
                  <AppText variant="caption" size="xs">
                    Family meal
                  </AppText>
                  <AppText variant="label" className="font-bold">
                    {family.recipe.title}
                  </AppText>
                </View>
              </View>
              <AppText variant="caption" size="sm">
                {family.note}
              </AppText>
            </Pressable>
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
