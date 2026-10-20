import { router, useLocalSearchParams } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, View } from 'react-native';

import { allRecipes, getRecipe } from '@/content/recipes';
import { today } from '@/domain/dates';
import { weekDates, weekStart } from '@/domain/planner';
import { ingredientPicks, plannedRecipes } from '@/domain/shopping';
import { usePlanner } from '@/features/planner/planner-context';
import { useHousehold } from '@/features/profile/use-household';
import { CheckRow } from '@/features/shopping/check-row';
import { useShopping } from '@/features/shopping/shopping-context';
import { AppText, Button, haptics, Notice, Screen } from '@/ui';

/**
 * Picks ingredients to add to the shopping list, from one recipe or from this week's
 * meal plan. Everything starts ticked except water and what's already on the list.
 */
export default function AddToShoppingScreen() {
  const params = useLocalSearchParams<{ recipe?: string; week?: string }>();
  const { items, add } = useShopping();
  const { plan, family } = usePlanner();
  const household = useHousehold();
  const [saving, setSaving] = useState(false);

  const recipes = useMemo(() => {
    if (params.recipe) {
      const r = getRecipe(params.recipe);
      return r ? [r] : [];
    }
    if (params.week) {
      return plannedRecipes(plan, family, weekDates(weekStart(today())), allRecipes, household);
    }
    return [];
    // The list is worked out once when the sheet opens, so ticks don't jump around.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.recipe, params.week]);

  const groups = useMemo(
    () => ingredientPicks(recipes, items),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [recipes],
  );
  const [picked, setPicked] = useState<Set<string>>(
    () =>
      new Set(
        groups.flatMap((g) => g.lines.filter((l) => l.picked).map((l) => l.key)),
      ),
  );

  const toggle = (key: string) => {
    haptics.select();
    setPicked((current) => {
      const next = new Set(current);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  async function save() {
    setSaving(true);
    try {
      const lines = groups.flatMap((g) => g.lines.filter((l) => picked.has(l.key)));
      await add(lines.map(({ text, recipeTitle }) => ({ text, recipeTitle })));
      haptics.success();
      router.back();
    } catch {
      Alert.alert('Could not save', 'Please try again.');
      setSaving(false);
    }
  }

  if (!groups.length) {
    return (
      <Screen>
        <Notice
          title={params.week ? 'No recipes planned this week' : 'Recipe not found'}
          body={
            params.week
              ? 'Plan some meals in the Baby tab, then come back to add their ingredients. Single foods and meals you typed in have no ingredient list.'
              : 'Please go back and try again.'
          }
        />
        <Button label="Back" variant="secondary" onPress={() => router.back()} />
      </Screen>
    );
  }

  const count = picked.size;
  return (
    <Screen
      padded={false}
      className="gap-0 pt-4"
      footer={
        <Button
          label={count ? `Add ${count} ${count === 1 ? 'item' : 'items'} to list` : 'Nothing picked'}
          disabled={!count || saving}
          onPress={save}
        />
      }
    >
      <AppText variant="caption" size="sm" className="px-5">
        Untick anything you already have at home.
      </AppText>
      {groups.map((g) => (
        <View key={g.recipeId}>
          {groups.length > 1 ? (
            <AppText variant="heading" accessibilityRole="header" className="px-5 pb-1 pt-6">
              {g.title}
            </AppText>
          ) : null}
          {g.lines.map((l) => (
            <CheckRow
              key={l.key}
              text={l.text}
              detail={l.onList ? 'Already on your list' : null}
              checked={picked.has(l.key)}
              onPress={() => toggle(l.key)}
            />
          ))}
        </View>
      ))}
    </Screen>
  );
}
