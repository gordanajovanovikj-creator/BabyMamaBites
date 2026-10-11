import { insights } from '@/content/insights';
import { monthlyGuides } from '@/content/monthly-guides';
import { babyRecipes } from '@/content/recipes';
import { solidsArticles } from '@/content/solids-articles';
import { today } from '@/domain/dates';
import { pickDailyInsights } from '@/domain/insights';
import { todayRow } from '@/domain/library';
import { guideForMonths } from '@/domain/monthly-guides';
import { foodsToTryToday } from '@/domain/recipes';
import { babyAge, babyStage } from '@/domain/stage';
import { InsightsRow } from '@/features/insights/insights-row';
import { useProfile } from '@/features/profile/profile-context';
import { useHousehold } from '@/features/profile/use-household';
import { AgeHero } from '@/features/today/age-hero';
import { FoodsToTry } from '@/features/today/foods-to-try';
import { Screen } from '@/ui';

export default function TodayScreen() {
  const { profile } = useProfile();
  const household = useHousehold();
  if (!profile) return null;

  const now = today();
  const stage = babyStage(profile, now);
  const daily = pickDailyInsights(insights, stage, profile.allergens, now);
  const ageMonths = babyAge(profile, now).months;
  const guide = guideForMonths(monthlyGuides, ageMonths);
  const row = todayRow(daily, solidsArticles, ageMonths);
  const foods = foodsToTryToday(babyRecipes, ageMonths, household, now);

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-7">
      <AgeHero profile={profile} guide={guide} />
      <FoodsToTry babyName={profile.babyName} recipes={foods.recipes} readAhead={foods.readAhead} />
      <InsightsRow items={row} ageMonths={ageMonths} />
    </Screen>
  );
}
