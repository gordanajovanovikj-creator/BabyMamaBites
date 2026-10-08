import { router } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';

import type { PlanWeek } from '@/content/solids-plan';
import { AppText, cn } from '@/ui';

export type WeekStripProps = {
  weeks: PlanWeek[];
  /** Highlighted week, or null before the plan starts. */
  current: number | null;
};

/** Horizontally scrolling week numbers; any week can be opened to read ahead or look back. */
export function WeekStrip({ weeks, current }: WeekStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerClassName="gap-2 px-5"
    >
      {weeks.map((w) => {
        const active = w.week === current;
        return (
          <Pressable
            key={w.week}
            accessibilityRole="button"
            accessibilityState={{ selected: active }}
            accessibilityLabel={`Week ${w.week}: ${w.title}${active ? ', this week' : ''}`}
            onPress={() =>
              router.push({ pathname: '/solids/week/[n]', params: { n: String(w.week) } })
            }
            className={cn(
              'min-h-14 min-w-14 items-center justify-center rounded-2xl px-3 active:opacity-80',
              active ? 'bg-primary' : 'bg-surface',
            )}
          >
            <AppText variant="caption" size="xs" color={active ? 'on-primary' : 'muted'}>
              Week
            </AppText>
            <AppText
              variant="label"
              size="lg"
              color={active ? 'on-primary' : 'ink'}
              className="font-bold"
            >
              {w.week}
            </AppText>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
