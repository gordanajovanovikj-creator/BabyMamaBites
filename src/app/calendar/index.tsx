import { router } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { getRecipe } from '@/content/recipes';
import {
  calendarKindLabels,
  entriesOn,
  formatTime,
  monthGrid,
  monthStart,
} from '@/domain/calendar';
import { addMonths, fromIsoDate, today, type IsoDate } from '@/domain/dates';
import { mealSlotLabels, mealSlots, mealsPlanned, planKey } from '@/domain/planner';
import { useCalendar } from '@/features/calendar/calendar-context';
import { usePlanner } from '@/features/planner/planner-context';
import { AppText, Button, Card, cn, Screen } from '@/ui';

const WEEKDAYS = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

function longDate(date: IsoDate): string {
  return fromIsoDate(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });
}

function MonthButton({ label, glyph, onPress }: { label: string; glyph: string; onPress(): void }) {
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

/** Mom's calendar: a month view, then the chosen day's baby meals, events and notes. */
export default function CalendarScreen() {
  const now = today();
  const { entries, remove } = useCalendar();
  const { plan } = usePlanner();
  const [selected, setSelected] = useState<IsoDate>(now);
  const [month, setMonth] = useState<IsoDate>(monthStart(now));

  const weeks = monthGrid(month);
  const dayEntries = entriesOn(entries, selected);
  const monthLabel = fromIsoDate(month).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  });

  const hasSomething = (date: IsoDate) =>
    mealsPlanned(plan, date) > 0 || entries.some((e) => e.date === date);

  return (
    <Screen>
      <View className="flex-row items-center justify-between">
        <MonthButton
          label="Previous month"
          glyph="‹"
          onPress={() => setMonth(addMonths(month, -1))}
        />
        <AppText variant="heading" size="xl" accessibilityRole="header">
          {monthLabel}
        </AppText>
        <MonthButton label="Next month" glyph="›" onPress={() => setMonth(addMonths(month, 1))} />
      </View>

      <View className="gap-1">
        <View className="flex-row">
          {WEEKDAYS.map((d, i) => (
            <AppText
              key={i}
              variant="caption"
              size="sm"
              className="flex-1 text-center font-bold"
              accessible={false}
            >
              {d}
            </AppText>
          ))}
        </View>
        {weeks.map((week) => (
          <View key={week[0]} className="flex-row">
            {week.map((date) => {
              const inMonth = date.slice(0, 7) === month.slice(0, 7);
              const isSelected = date === selected;
              const isToday = date === now;
              const marked = hasSomething(date);
              return (
                <Pressable
                  key={date}
                  accessibilityRole="button"
                  accessibilityState={{ selected: isSelected }}
                  accessibilityLabel={`${longDate(date)}${isToday ? ', today' : ''}${marked ? ', has plans' : ''}`}
                  onPress={() => {
                    setSelected(date);
                    if (!inMonth) setMonth(monthStart(date));
                  }}
                  className="h-12 flex-1 items-center justify-center active:opacity-70"
                >
                  <View
                    className={cn(
                      'h-10 w-10 items-center justify-center rounded-full',
                      isSelected ? 'bg-primary' : isToday ? 'border-2 border-primary' : '',
                    )}
                  >
                    <AppText
                      variant="label"
                      color={isSelected ? 'on-primary' : inMonth ? 'ink' : 'muted'}
                      className={cn(!inMonth && 'opacity-50')}
                    >
                      {String(Number(date.slice(8)))}
                    </AppText>
                  </View>
                  {marked && !isSelected ? (
                    <View className="absolute bottom-0.5 h-1.5 w-1.5 rounded-full bg-primary" />
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        ))}
      </View>

      <AppText variant="title" size="2xl" className="pt-2">
        {longDate(selected)}
      </AppText>

      <Card className="gap-1">
        <AppText variant="heading">Baby&apos;s meals</AppText>
        {mealSlots.map((slot) => {
          const id = plan[planKey(selected, slot)];
          const recipe = id ? getRecipe(id) : undefined;
          return (
            <Pressable
              key={slot}
              accessibilityRole="button"
              accessibilityLabel={`${mealSlotLabels[slot]}: ${recipe ? recipe.title : 'not planned'}. Tap to ${recipe ? 'change' : 'plan'}.`}
              onPress={() =>
                router.push({ pathname: '/planner/pick', params: { date: selected, slot } })
              }
              className="min-h-14 flex-row items-center justify-between gap-3 border-b border-border py-2 active:opacity-70"
            >
              <View className="flex-1">
                <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
                  {mealSlotLabels[slot]}
                </AppText>
                <AppText variant="label" size="lg" color={recipe ? 'ink' : 'muted'}>
                  {recipe ? recipe.title : 'Plan a meal'}
                </AppText>
              </View>
              <AppText variant="heading" color="primary">
                {recipe ? '›' : '+'}
              </AppText>
            </Pressable>
          );
        })}
      </Card>

      <Card className="gap-2">
        <AppText variant="heading">Events and notes</AppText>
        {dayEntries.length ? (
          dayEntries.map((e) => (
            <View key={e.id} className="flex-row items-start gap-3 border-b border-border py-2">
              <View className="flex-1 gap-0.5">
                <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
                  {e.kind === 'event'
                    ? e.time
                      ? formatTime(e.time)
                      : 'All day'
                    : calendarKindLabels.note}
                </AppText>
                <AppText variant="body">{e.text}</AppText>
              </View>
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={`Delete ${calendarKindLabels[e.kind].toLowerCase()}: ${e.text}`}
                onPress={() => remove(e.id).catch(() => {})}
                hitSlop={8}
                className="h-11 w-11 items-center justify-center rounded-full active:opacity-70"
              >
                <AppText variant="label" color="muted" size="lg">
                  ✕
                </AppText>
              </Pressable>
            </View>
          ))
        ) : (
          <AppText variant="caption">
            Nothing here yet. Add a doctor visit, a reminder, or a note about how the day went.
          </AppText>
        )}
      </Card>

      <View className="flex-row gap-3">
        <Button
          label="Add event"
          className="flex-1"
          onPress={() =>
            router.push({ pathname: '/calendar/add', params: { date: selected, kind: 'event' } })
          }
        />
        <Button
          label="Add note"
          variant="secondary"
          className="flex-1"
          onPress={() =>
            router.push({ pathname: '/calendar/add', params: { date: selected, kind: 'note' } })
          }
        />
      </View>
      <AppText variant="caption" size="sm" className="text-center">
        Your calendar is saved on this phone only.
      </AppText>
    </Screen>
  );
}
