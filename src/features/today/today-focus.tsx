import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { quickFoods, type PlanWeek } from '@/content/solids-plan';
import { shadows } from '@/theme/colors';
import { AppText } from '@/ui';

/**
 * "Today's focus": this week's step from the solids plan, right under the guide. An
 * allergen week gets a "Log it" button that opens Log a food with the allergen picked.
 */
export function TodayFocus({ planWeek }: { planWeek: PlanWeek }) {
  const allergen = planWeek.allergen;
  const emoji = (allergen && quickFoods.find((f) => f.allergen === allergen.id)?.emoji) ?? '🥄';
  const headline = allergen ? `Try ${allergen.label.toLowerCase()} today` : planWeek.title;
  const openWeek = () =>
    router.push({ pathname: '/solids/week/[n]', params: { n: String(planWeek.week) } });

  return (
    <View className="px-5">
      <View
        className="flex-row items-center gap-3 rounded-3xl border border-border bg-surface p-3"
        style={{ boxShadow: shadows.card }}
      >
        <Pressable
          accessibilityRole="link"
          accessibilityLabel={`Today's focus, week ${planWeek.week} of solids: ${headline}. Opens week ${planWeek.week}.`}
          onPress={openWeek}
          className="min-h-12 flex-1 flex-row items-center gap-3 active:opacity-70"
        >
          <View className="h-12 w-12 items-center justify-center rounded-full bg-accent">
            <AppText size="2xl">{emoji}</AppText>
          </View>
          <View className="flex-1">
            <AppText variant="caption" size="xs" className="font-bold uppercase tracking-wider">
              {`Week ${planWeek.week} of solids`}
            </AppText>
            <AppText variant="heading" numberOfLines={2}>
              {headline}
            </AppText>
          </View>
        </Pressable>
        {allergen ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`Log ${allergen.label.toLowerCase()}`}
            onPress={() => router.push({ pathname: '/solids/log', params: { allergen: allergen.id } })}
            className="min-h-12 items-center justify-center rounded-full bg-primary px-5 active:opacity-80"
          >
            <AppText variant="label" color="on-primary" className="font-bold">
              Log it
            </AppText>
          </Pressable>
        ) : (
          <AppText variant="heading" color="muted" className="pr-2">
            ›
          </AppText>
        )}
      </View>
    </View>
  );
}
