import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { getRecipe } from '@/content/recipes';
import { addDays, today } from '@/domain/dates';
import { dayLabel, weekDates, weekRangeLabel, weekStart } from '@/domain/planner';
import { AppText, Card, cn } from '@/ui';

import { usePlanner } from './planner-context';

function WeekArrow({ label, glyph, onPress }: { label: string; glyph: string; onPress(): void }) {
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

/** This week's baby menu: one recipe per day, tap a day to plan or change it. */
export function WeekMenu() {
  const { plan } = usePlanner();
  const now = today();
  const [offset, setOffset] = useState(0);
  const monday = addDays(weekStart(now), offset * 7);
  const planned = weekDates(monday).filter((d) => plan[d]).length;

  return (
    <Card className="gap-3">
      <View className="flex-row items-center gap-2">
        <View className="flex-1">
          <AppText variant="heading">
            {offset === 0 ? "This week's menu" : offset === 1 ? "Next week's menu" : 'Menu'}
          </AppText>
          <AppText variant="caption" size="sm">
            {weekRangeLabel(monday)} · {planned} of 7 days planned
          </AppText>
        </View>
        <WeekArrow label="Previous week" glyph="‹" onPress={() => setOffset((o) => o - 1)} />
        <WeekArrow label="Next week" glyph="›" onPress={() => setOffset((o) => o + 1)} />
      </View>

      {weekDates(monday).map((date) => {
        const recipe = plan[date] ? getRecipe(plan[date]) : undefined;
        const { weekday, day } = dayLabel(date);
        const isToday = date === now;
        return (
          <Pressable
            key={date}
            accessibilityRole="button"
            accessibilityLabel={`${weekday} ${day}${isToday ? ', today' : ''}: ${recipe ? recipe.title : 'nothing planned'}. ${recipe ? 'Change' : 'Plan a meal'}.`}
            onPress={() => router.push({ pathname: '/planner/pick', params: { date } })}
            className="min-h-14 flex-row items-center gap-3 rounded-2xl active:bg-surface-muted"
          >
            <View
              className={cn(
                'h-12 w-12 items-center justify-center rounded-2xl',
                isToday ? 'bg-primary' : 'bg-surface-muted',
              )}
            >
              <AppText variant="caption" size="xs" color={isToday ? 'on-primary' : 'muted'}>
                {weekday}
              </AppText>
              <AppText variant="label" className="font-bold" color={isToday ? 'on-primary' : 'ink'}>
                {day}
              </AppText>
            </View>
            <View className="flex-1">
              {recipe ? (
                <AppText variant="label" size="lg" numberOfLines={2}>
                  {recipe.emoji} {recipe.title}
                </AppText>
              ) : (
                <AppText variant="label" color="muted">
                  + Plan a meal
                </AppText>
              )}
            </View>
          </Pressable>
        );
      })}
    </Card>
  );
}
