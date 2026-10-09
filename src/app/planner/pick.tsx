import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, View } from 'react-native';

import { babyRecipeCategories, babyRecipes } from '@/content/recipes';
import { fromIsoDate, isIsoDate, today } from '@/domain/dates';
import { isMealSlot, mealSlotLabels, planKey } from '@/domain/planner';
import { babyCollectionsFor, isAheadOfAge, suitsHousehold } from '@/domain/recipes';
import { babyAge } from '@/domain/stage';
import { usePlanner } from '@/features/planner/planner-context';
import { useProfile } from '@/features/profile/profile-context';
import { useHousehold } from '@/features/profile/use-household';
import { AppText, Button, cn, Screen, SymbolIcon, toneBackground } from '@/ui';

export default function PickMealScreen() {
  const { date, slot } = useLocalSearchParams<{ date: string; slot: string }>();
  const { profile } = useProfile();
  const household = useHousehold();
  const { plan, setMeal } = usePlanner();

  if (!date || !isIsoDate(date) || !slot || !isMealSlot(slot)) {
    return (
      <Screen>
        <AppText variant="title">Day not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const ageMonths = profile ? babyAge(profile, today()).months : 6;
  const { ordered, current } = babyCollectionsFor(babyRecipeCategories, ageMonths);
  const heading = fromIsoDate(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  const choose = (recipeId: string | null) => {
    setMeal(date, slot, recipeId)
      .then(() => router.back())
      .catch(() => {});
  };

  return (
    <Screen>
      <View className="gap-1">
        <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
          {mealSlotLabels[slot]}
        </AppText>
        <AppText variant="title">{heading}</AppText>
      </View>
      {plan[planKey(date, slot)] ? (
        <Button
          variant="secondary"
          label={`Clear ${mealSlotLabels[slot].toLowerCase()}`}
          onPress={() => choose(null)}
        />
      ) : null}

      {ordered.map((group) => {
        const items = babyRecipes.filter(
          (r) => r.categories.includes(group.id) && suitsHousehold(r, household),
        );
        if (!items.length) return null;
        return (
          <View key={group.id} className="gap-1">
            <AppText variant="heading">
              {group.label}
              {group.id === current ? ' · now' : ''}
            </AppText>
            <AppText variant="caption" size="sm">
              From {group.fromMonths} months
            </AppText>
            {items.map((r) => {
              const ahead = isAheadOfAge(r, ageMonths);
              const selected = plan[planKey(date, slot)] === r.id;
              return (
                <Pressable
                  key={r.id}
                  accessibilityRole="radio"
                  accessibilityState={{ selected }}
                  accessibilityLabel={`${r.title}${ahead ? ', for an older baby' : ''}`}
                  onPress={() => choose(r.id)}
                  className={cn(
                    'min-h-16 flex-row items-center gap-3 border-b border-border py-2 active:opacity-70',
                    ahead && 'opacity-60',
                  )}
                >
                  <View
                    className={cn(
                      'h-12 w-12 items-center justify-center rounded-2xl',
                      toneBackground(r.tone),
                    )}
                  >
                    <SymbolIcon icon={r.icon} emoji={r.emoji} size={24} />
                  </View>
                  <View className="flex-1">
                    <AppText variant="label" size="lg">
                      {r.title}
                    </AppText>
                    {ahead ? (
                      <AppText variant="caption" size="sm">
                        For babies from {r.fromMonths} months
                      </AppText>
                    ) : null}
                  </View>
                  {selected ? (
                    <AppText variant="label" color="primary" className="font-bold">
                      ✓
                    </AppText>
                  ) : null}
                </Pressable>
              );
            })}
          </View>
        );
      })}
    </Screen>
  );
}
