import { useState } from 'react';

import { insightCategories } from '@/content/insight-categories';
import { insights } from '@/content/insights';
import { monthlyGuides } from '@/content/monthly-guides';
import { babyRecipes } from '@/content/recipes';
import { solidsArticles } from '@/content/solids-articles';
import { today } from '@/domain/dates';
import { pickDailyInsights } from '@/domain/insights';
import { forMom, libraryItems, todayRow } from '@/domain/library';
import { guideForMonths } from '@/domain/monthly-guides';
import { mealSlotLabels, plannedMeals } from '@/domain/planner';
import { foodsToTryToday } from '@/domain/recipes';
import { babyAge, babyStage, currentMonthChoice, monthChoices } from '@/domain/stage';
import { InsightsRow } from '@/features/insights/insights-row';
import { plannedMeal } from '@/features/planner/planned-meal';
import { usePlanner } from '@/features/planner/planner-context';
import { useProfile } from '@/features/profile/profile-context';
import { useHousehold } from '@/features/profile/use-household';
import { AgeHero } from '@/features/today/age-hero';
import { FoodsToTry, type PlannedFood } from '@/features/today/foods-to-try';
import { HelpCard } from '@/features/today/help-card';
import { Screen } from '@/ui';

export default function TodayScreen() {
  const { profile } = useProfile();
  const household = useHousehold();
  const { plan } = usePlanner();
  // The month bubble the parent tapped; until then, the baby's own age.
  const [picked, setPicked] = useState<number | undefined>(undefined);
  if (!profile) return null;

  const now = today();
  const stage = babyStage(profile, now);
  const daily = pickDailyInsights(insights, stage, profile.allergens, now);
  const ageMonths = babyAge(profile, now).months;
  const currentMonth = currentMonthChoice(ageMonths);
  const viewMonth = picked ?? currentMonth;
  const browsing = viewMonth !== undefined && viewMonth !== currentMonth;
  // Under 6 months nothing is picked yet, so the guide and foods follow the baby's real age.
  const guide = guideForMonths(monthlyGuides, viewMonth ?? ageMonths);
  const momItems = forMom(
    libraryItems(solidsArticles, insights, profile.allergens),
    insightCategories,
  );
  // Home's daily row stays about the baby, so mom-focused items are left out.
  const momIds = new Set(momItems.map((i) => i.id));
  const row = todayRow(daily, solidsArticles, ageMonths).filter((i) => !momIds.has(i.id));
  const foods = foodsToTryToday(babyRecipes, viewMonth ?? ageMonths, household, now);
  // Today's planned meals only make sense for the baby's own age.
  const planned = browsing
    ? []
    : plannedMeals(plan, now).flatMap(({ slot, recipeId }): PlannedFood[] => {
        const label = mealSlotLabels[slot];
        const meal = plannedMeal(recipeId);
        if (!meal) return [];
        if (meal.kind === 'recipe') return [{ label, recipe: meal.recipe }];
        if (meal.kind === 'food') return [{ label, food: meal.food }];
        return [{ label, own: meal.title }];
      });

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-7">
      <AgeHero
        profile={profile}
        guide={guide}
        selectedMonth={viewMonth}
        currentMonth={currentMonth}
        onSelectMonth={setPicked}
      />
      <FoodsToTry
        babyName={profile.babyName}
        recipes={foods.recipes}
        readAhead={foods.readAhead}
        planned={planned}
        browsingLabel={
          browsing ? monthChoices().find((c) => c.months === viewMonth)?.label : undefined
        }
      />
      <InsightsRow items={row} ageMonths={ageMonths} />
      <HelpCard />
    </Screen>
  );
}
