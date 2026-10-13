import { useEffect, useRef } from 'react';
import { Pressable, ScrollView } from 'react-native';

import { monthChoices } from '@/domain/stage';
import { shadows } from '@/theme/colors';
import { AppText, cn } from '@/ui';

const BUBBLE_WIDTH = 116;
const GAP = 10;

export type MonthBubblesProps = {
  /** The highlighted bubble, or undefined when none is chosen yet. */
  selected?: number;
  /** The bubble that matches the baby's age; marked "Now". */
  current?: number;
  onSelect(months: number): void;
};

/** Sideways row of month pills (6 months … 24+ months) at the top of Today. */
export function MonthBubbles({ selected, current, onSelect }: MonthBubblesProps) {
  const scroller = useRef<ScrollView>(null);
  const choices = monthChoices();
  const index = choices.findIndex((c) => c.months === selected);

  // Bring the selected month into view, slightly in from the left edge.
  useEffect(() => {
    if (index < 0) return;
    const x = Math.max(0, index * (BUBBLE_WIDTH + GAP) - BUBBLE_WIDTH / 2);
    const t = setTimeout(() => scroller.current?.scrollTo({ x, animated: false }), 0);
    return () => clearTimeout(t);
  }, [index]);

  return (
    <ScrollView
      ref={scroller}
      horizontal
      showsHorizontalScrollIndicator={false}
      // Room around the pills so their shadows aren't clipped.
      contentContainerClassName="px-5 pb-3 pt-1"
      contentContainerStyle={{ gap: GAP }}
      className="-mx-5"
    >
      {choices.map((c) => {
        const on = c.months === selected;
        const now = c.months === current;
        return (
          <Pressable
            key={c.months}
            accessibilityRole="button"
            accessibilityState={{ selected: on }}
            accessibilityLabel={`${c.label}${now ? ', your baby’s age now' : ''}`}
            onPress={() => onSelect(c.months)}
            style={{ width: BUBBLE_WIDTH, boxShadow: on ? undefined : shadows.chip }}
            className={cn(
              'min-h-14 items-center justify-center rounded-full px-3 py-1.5 active:opacity-80',
              on ? 'bg-primary' : 'bg-surface',
            )}
          >
            <AppText variant="label" color={on ? 'on-primary' : 'ink'} className="font-bold">
              {c.label}
            </AppText>
            {now ? (
              <AppText variant="caption" size="xs" color={on ? 'on-primary' : 'primary'}>
                Now
              </AppText>
            ) : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}
