import { useState } from 'react';

import { insightCategories } from '@/content/insight-categories';
import { insights } from '@/content/insights';
import { monthlyGuides } from '@/content/monthly-guides';
import { babyRecipeCategories, babyRecipes } from '@/content/recipes';
import { solidsArticles } from '@/content/solids-articles';
import { getPlanWeek, planWeeks } from '@/content/solids-plan';
import { today } from '@/domain/dates';
import { allergenProgress } from '@/domain/food-log';
import { pickDailyInsights } from '@/domain/insights';
import { forMom, libraryItems, pickedForAge, todayRow } from '@/domain/library';
import { guideForMonths } from '@/domain/monthly-guides';
import { babyOnlyRecipes, foodsToTryToday } from '@/domain/recipes';
import { babyAge, babyStage, currentMonthChoice, monthChoices, solidsWeek } from '@/domain/stage';
import { InsightsRow } from '@/features/insights/insights-row';
import { useProfile } from '@/features/profile/profile-context';
import { useHousehold } from '@/features/profile/use-household';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { AllergenTracker } from '@/features/solids/allergen-tracker';
import { useFoodLog } from '@/features/solids/food-log-context';
import { AgeHero } from '@/features/today/age-hero';
import { FoodsToTry } from '@/features/today/foods-to-try';
import { HelpCard } from '@/features/today/help-card';
import { ThisWeekCard } from '@/features/today/this-week-card';
import { TodayFocus } from '@/features/today/today-focus';
import { View } from 'react-native';

import { Screen } from '@/ui';

export default function TodayScreen() {
  const { profile } = useProfile();
  const household = useHousehold();
  const { entries } = useFoodLog();
  // The month bubble the parent tapped; until then, the baby's own age.
  const [picked, setPicked] = useState<number | undefined>(undefined);
  if (!profile) return null;

  const now = today();
  const stage = babyStage(profile, now);
  const daily = pickDailyInsights(insights, stage, profile.allergens, now);
  const ageMonths = babyAge(profile, now).months;
  // This week's focus from the solids plan, only while the baby is in it.
  const rawWeek = solidsWeek(profile, now);
  const planWeek =
    rawWeek !== null && rawWeek >= 1 && rawWeek <= planWeeks.length
      ? getPlanWeek(rawWeek)
      : undefined;
  const currentMonth = currentMonthChoice(ageMonths);
  const viewMonth = picked ?? currentMonth;
  const browsing = viewMonth !== undefined && viewMonth !== currentMonth;
  // Under 6 months nothing is picked yet, so the guide and foods follow the baby's real age.
  const guide = guideForMonths(monthlyGuides, viewMonth ?? ageMonths);
  const library = libraryItems(solidsArticles, insights, profile.allergens);
  const momItems = forMom(library, insightCategories);
  // Home's daily row stays about the baby, so mom-focused items are left out.
  const momIds = new Set(momItems.map((i) => i.id));
  // What used to be "Picked for your baby's age" on Insights now lives in this row.
  const row = todayRow(daily, pickedForAge(library, ageMonths)).filter((i) => !momIds.has(i.id));
  // Baby meals only; the family one-pot meals stay in their own collection.
  const foods = foodsToTryToday(
    babyOnlyRecipes(babyRecipes, babyRecipeCategories),
    viewMonth ?? ageMonths,
    household,
    now,
  );

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-7">
      <AgeHero
        profile={profile}
        guide={guide}
        selectedMonth={viewMonth}
        currentMonth={currentMonth}
        onSelectMonth={setPicked}
      />
      {planWeek ? <TodayFocus planWeek={planWeek} /> : null}
      <ThisWeekCard now={now} />
      {/* Allergens matter once solids start (or once any is logged). */}
      {rawWeek !== null || entries.some((e) => e.allergen) ? (
        <AllergenTracker progress={allergenProgress(entries)} linkToPlan padded compact />
      ) : null}
      <FoodsToTry
        babyName={profile.babyName}
        recipes={foods.recipes}
        readAhead={foods.readAhead}
        browsingLabel={
          browsing ? monthChoices().find((c) => c.months === viewMonth)?.label : undefined
        }
      />
      <InsightsRow items={row} ageMonths={ageMonths} />
      <HelpCard />
      <View className="px-5">
        <HealthDisclaimerNote />
      </View>
    </Screen>
  );
}
