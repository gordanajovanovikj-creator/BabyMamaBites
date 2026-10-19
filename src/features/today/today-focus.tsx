import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { allergenFocusCopy, planWeeks, quickFoods, type PlanWeek } from '@/content/solids-plan';
import { today } from '@/domain/dates';
import { todayFocusState } from '@/domain/food-log';
import { useFoodLog } from '@/features/solids/food-log-context';
import { AppText, cn } from '@/ui';

/**
 * "Today's focus": this week's step from the solids plan, right under the guide. It
 * follows the food log: an allergen to try (with "Log it"), a short wait between new
 * allergens, a missed allergen to catch up on, a done state once logged, or a reaction
 * escalated to the pediatrician.
 */
export function TodayFocus({ planWeek }: { planWeek: PlanWeek }) {
  const { entries } = useFoodLog();
  const state = todayFocusState(planWeek, planWeeks, entries, today());
  const openWeek = () =>
    router.push({ pathname: '/solids/week/[n]', params: { n: String(planWeek.week) } });
  const weekLabel = `Week ${planWeek.week} of solids`;
  const emojiFor = (id: string) => quickFoods.find((f) => f.allergen === id)?.emoji ?? '🥄';

  let kicker = weekLabel;
  let headline = planWeek.title;
  let detail: string | null = null;
  let badge = '🥄';
  let onPress = openWeek;
  let danger = false;
  let logAllergen: { id: string; label: string } | null = null;

  if (state.kind === 'try') {
    const name = state.allergen.label.toLowerCase();
    kicker = state.catchUp ? `Catch up · ${weekLabel.toLowerCase()}` : weekLabel;
    headline = `Try ${name} today`;
    badge = emojiFor(state.allergen.id);
    logAllergen = state.allergen;
  } else if (state.kind === 'wait') {
    headline = `Try ${state.allergen.label.toLowerCase()} in ${state.days} ${state.days === 1 ? 'day' : 'days'}`;
    detail = allergenFocusCopy.wait;
    badge = emojiFor(state.allergen.id);
  } else if (state.kind === 'done') {
    headline = `${state.allergen.label} logged`;
    detail = allergenFocusCopy.done;
    badge = '✓';
  } else if (state.kind === 'reaction') {
    const name = state.allergen.label.toLowerCase();
    kicker = 'Reaction logged';
    headline = `Talk to your pediatrician before offering ${name} again`;
    detail = allergenFocusCopy.reaction;
    badge = '!';
    danger = true;
    onPress = () => router.push('/emergency');
  }

  const opens = danger ? 'Opens emergency and resources.' : `Opens week ${planWeek.week}.`;

  return (
    <View className="px-5">
      <View
        className={cn(
          'flex-row items-center gap-3 rounded-3xl p-3',
          danger ? 'bg-danger-bg' : 'border border-border bg-surface',
        )}
      >
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Today's focus. ${kicker}: ${headline}. ${detail ?? ''} ${opens}`}
          onPress={onPress}
          className="min-h-12 flex-1 flex-row items-center gap-3 active:opacity-70"
        >
          <View
            className={cn(
              'h-12 w-12 items-center justify-center rounded-full',
              danger ? 'bg-danger-ink' : state.kind === 'done' ? 'bg-primary' : 'bg-accent',
            )}
          >
            <AppText
              size="2xl"
              color={danger ? 'on-deep' : state.kind === 'done' ? 'on-primary' : undefined}
              className={danger || state.kind === 'done' ? 'font-bold' : undefined}
            >
              {badge}
            </AppText>
          </View>
          <View className="flex-1 gap-0.5">
            <AppText
              variant="caption"
              size="xs"
              color={danger ? 'danger' : undefined}
              className="font-bold uppercase tracking-wider"
            >
              {kicker}
            </AppText>
            <AppText variant="heading" color={danger ? 'danger' : undefined} numberOfLines={3}>
              {headline}
            </AppText>
            {detail ? (
              <AppText variant="caption" size="sm" color={danger ? 'danger' : undefined}>
                {detail}
              </AppText>
            ) : null}
          </View>
        </Pressable>
        {logAllergen ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Log ${logAllergen.label.toLowerCase()}`}
            onPress={() =>
              router.push({ pathname: '/solids/log', params: { allergen: logAllergen.id } })
            }
            className="min-h-12 items-center justify-center rounded-full bg-primary px-5 active:opacity-80"
          >
            <AppText variant="label" color="on-primary" className="font-bold">
              Log it
            </AppText>
          </Pressable>
        ) : (
          <AppText variant="heading" color={danger ? 'danger' : 'muted'} className="pr-2">
            ›
          </AppText>
        )}
      </View>
    </View>
  );
}
