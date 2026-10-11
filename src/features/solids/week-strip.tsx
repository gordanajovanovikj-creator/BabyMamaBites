import { router } from 'expo-router';
import { Pressable, ScrollView } from 'react-native';

import type { PlanWeek } from '@/content/solids-plan';
import { shadows } from '@/theme/colors';
import { AppText, cn } from '@/ui';

export type WeekStripProps = {
  weeks: PlanWeek[];
  /** Highlighted week, or null before the plan starts. */
  current: number | null;
};

/**
 * Horizontally scrolling week numbers as white floating tiles (this week in green);
 * any week can be opened to read ahead or look back.
 */
export function WeekStrip({ weeks, current }: WeekStripProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      // Room above and below so the shadows aren't clipped.
      contentContainerClassName="gap-3 px-5 pb-6 pt-3"
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
              'min-h-16 min-w-16 items-center justify-center rounded-2xl px-3 active:opacity-80',
              active ? 'bg-primary' : 'bg-surface',
            )}
            style={{ borderCurve: 'continuous', boxShadow: shadows.floatTight }}
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
