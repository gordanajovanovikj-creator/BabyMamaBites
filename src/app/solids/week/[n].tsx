import { router, useLocalSearchParams } from 'expo-router';
import { View } from 'react-native';

import { getPlanWeek, getStageInfo, planWeeks, solidsSourcesFor } from '@/content/solids-plan';
import { tryFoodsHeading } from '@/domain/food-log';
import { allergenLabels } from '@/domain/profile-labels';
import { useProfile } from '@/features/profile/profile-context';
import { SourceLinks } from '@/features/shared/source-links';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { TipCard } from '@/features/shared/tip-card';
import { AppText, Button, Card, Notice, Screen } from '@/ui';

function Bullets({ items }: { items: string[] }) {
  return (
    <View className="gap-2">
      {items.map((item) => (
        <View key={item} className="flex-row gap-3">
          <AppText color="primary" className="font-bold">
            •
          </AppText>
          <AppText className="flex-1">{item}</AppText>
        </View>
      ))}
    </View>
  );
}

export default function PlanWeekScreen() {
  const { n } = useLocalSearchParams<{ n: string }>();
  const { profile } = useProfile();
  const week = getPlanWeek(Number(n));

  if (!week) {
    return (
      <Screen>
        <AppText variant="title">Not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const stage = getStageInfo(week.stage);
  const foodsHeading = tryFoodsHeading(week.week);
  const previous = getPlanWeek(week.week - 1);
  const next = getPlanWeek(week.week + 1);
  const householdAvoids = week.allergen && profile?.allergens.includes(week.allergen.id);

  return (
    <Screen key={week.week}>
      <View className="gap-1">
        <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
          Week {week.week} of {planWeeks.length}
        </AppText>
        <AppText variant="title">{week.title}</AppText>
      </View>

      <Card className="gap-3">
        {week.focus.map((p) => (
          <AppText key={p}>{p}</AppText>
        ))}
      </Card>

      {stage ? (
        <Card tone="sky" className="gap-1">
          <AppText
            variant="caption"
            color="on-sky"
            size="xs"
            className="font-bold uppercase tracking-wider"
          >
            Texture
          </AppText>
          <AppText variant="heading" color="on-sky">
            {stage.label}
          </AppText>
          <AppText color="on-sky">{stage.description}</AppText>
        </Card>
      ) : null}

      <Card className="gap-3">
        <View className="gap-1">
          <AppText variant="heading">{foodsHeading.title}</AppText>
          {foodsHeading.detail ? <AppText variant="caption">{foodsHeading.detail}</AppText> : null}
        </View>
        <Bullets items={week.tryFoods} />
        {week.allergen ? (
          <AppText variant="caption">
            Plus this week&apos;s allergen, below, on its own day.
          </AppText>
        ) : null}
      </Card>

      {week.allergen ? (
        <Card tone="accent" className="gap-2">
          <AppText
            variant="caption"
            color="on-accent"
            size="xs"
            className="font-bold uppercase tracking-wider"
          >
            Allergen of the week
          </AppText>
          <AppText variant="heading" color="on-accent">
            {week.allergen.label}
          </AppText>
          <AppText color="on-accent">{week.allergen.howTo}</AppText>
        </Card>
      ) : null}

      {householdAvoids && week.allergen ? (
        <Notice
          tone="caution"
          title={`Your household avoids ${allergenLabels[week.allergen.id].toLowerCase()}`}
          body="Ask your pediatrician whether and how to introduce it before you offer it to your baby."
        />
      ) : null}

      {week.tips.length ? <TipCard tips={week.tips} /> : null}

      <Button
        label="Log a food"
        onPress={() =>
          router.push({
            pathname: '/solids/log',
            params: week.allergen ? { allergen: week.allergen.id } : {},
          })
        }
      />

      <SourceLinks sources={solidsSourcesFor(week.sources)} />

      <View className="flex-row gap-3">
        {previous ? (
          <Button
            className="flex-1"
            variant="secondary"
            label={`‹ Week ${previous.week}`}
            accessibilityLabel={`Previous: week ${previous.week}, ${previous.title}`}
            onPress={() => router.setParams({ n: String(previous.week) })}
          />
        ) : null}
        {next ? (
          <Button
            className="flex-1"
            variant="secondary"
            label={`Week ${next.week} ›`}
            accessibilityLabel={`Next: week ${next.week}, ${next.title}`}
            onPress={() => router.setParams({ n: String(next.week) })}
          />
        ) : null}
      </View>
      <Button
        label="Choking and gagging"
        variant="quiet"
        onPress={() => router.push('/solids/choking')}
      />
      <HealthDisclaimerNote />
    </Screen>
  );
}
