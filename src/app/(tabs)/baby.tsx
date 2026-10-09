import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { splitReviewMarker } from '@/content/schemas';
import { getPlanWeek, planWeeks, readiness, solidsSourcesFor } from '@/content/solids-plan';
import { fromIsoDate, today } from '@/domain/dates';
import { allergenProgress, foodsTriedCount, planWeekFor } from '@/domain/food-log';
import { babyAge, solidsStartDate, solidsWeek } from '@/domain/stage';
import { FreezerCard } from '@/features/planner/freezer-card';
import { WeekMenu } from '@/features/planner/week-menu';
import { useProfile } from '@/features/profile/profile-context';
import { SourceLinks } from '@/features/shared/source-links';
import { AllergenTracker } from '@/features/solids/allergen-tracker';
import { ArticlesRow } from '@/features/solids/articles-row';
import { BabyRecipesView } from '@/features/solids/baby-recipes-view';
import { useFoodLog } from '@/features/solids/food-log-context';
import { LogEntryRow } from '@/features/solids/log-entry-row';
import { WeekCard } from '@/features/solids/week-card';
import { WeekStrip } from '@/features/solids/week-strip';
import { AppText, Button, Card, Notice, Screen, SearchButton, SegmentedTabs } from '@/ui';

const RECENT = 5;

type Tab = 'plan' | 'recipes';

export default function BabyScreen() {
  const insets = useSafeAreaInsets();
  const { profile } = useProfile();
  const { entries } = useFoodLog();
  const [tab, setTab] = useState<Tab>('recipes');
  const [searchOpen, setSearchOpen] = useState(false);
  if (!profile) return null;

  const now = today();
  const rawWeek = solidsWeek(profile, now);
  const current = planWeekFor(rawWeek, planWeeks.length);
  const week = current ? getPlanWeek(current) : undefined;
  const finished = rawWeek !== null && rawWeek > planWeeks.length;
  const name = profile.babyName ?? 'Your baby';
  const startsOn = fromIsoDate(solidsStartDate(profile, now)).toLocaleDateString(undefined, {
    month: 'long',
    day: 'numeric',
  });

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-6">
      <View className="gap-1 px-5" style={{ paddingTop: insets.top + 16 }}>
        <View className="flex-row items-center justify-between gap-3">
          <AppText variant="display">Baby</AppText>
          {tab === 'recipes' ? (
            <SearchButton
              open={searchOpen}
              onPress={() => setSearchOpen((open) => !open)}
              subject="baby recipes"
            />
          ) : null}
        </View>
        <AppText variant="caption">
          {current === null
            ? `${name}'s starting-solids plan begins around ${startsOn}.`
            : `${name}'s week-by-week plan, at your baby's own pace.`}
        </AppText>
        <SegmentedTabs<Tab>
          tabs={[
            { id: 'recipes', label: 'Recipes' },
            { id: 'plan', label: 'Plan' },
          ]}
          selected={tab}
          onSelect={setTab}
        />
      </View>

      {tab === 'recipes' ? (
        <BabyRecipesView
          babyName={profile.babyName}
          ageMonths={babyAge(profile, now).months}
          searchOpen={searchOpen}
        />
      ) : (
        <>
          <View className="gap-4 px-5">
            {current === null ? (
              <Card tone="accent" className="gap-3">
                <AppText variant="heading" color="on-accent">
                  Getting ready for solids
                </AppText>
                <AppText color="on-accent">{splitReviewMarker(readiness.intro).text}</AppText>
                {readiness.signs.map((sign) => (
                  <View key={sign} className="flex-row gap-3">
                    <AppText color="on-accent" className="font-bold">
                      •
                    </AppText>
                    <AppText color="on-accent" className="flex-1">
                      {sign}
                    </AppText>
                  </View>
                ))}
                <AppText variant="caption" color="on-accent">
                  Talk to your pediatrician about when to start, especially if your baby was born
                  early.
                </AppText>
                <SourceLinks sources={solidsSourcesFor(readiness.sources)} />
              </Card>
            ) : null}

            {finished ? (
              <Notice
                title="You've finished the 26-week plan"
                body="Keep offering a variety of foods, including the allergens your baby already tolerates. The monthly guides on Today keep growing with your toddler."
              />
            ) : null}

            {week ? <WeekCard week={week} totalWeeks={planWeeks.length} /> : null}
          </View>

          <View className="gap-2">
            <AppText variant="heading" className="px-5">
              {current === null ? 'Read ahead' : 'All weeks'}
            </AppText>
            <WeekStrip weeks={planWeeks} current={current} />
          </View>

          <ArticlesRow />

          <View className="gap-4 px-5">
            <Button label="Log a food" onPress={() => router.push('/solids/log')} />

            <AllergenTracker progress={allergenProgress(entries)} />

            <Card className="gap-1">
              <View className="flex-row items-baseline justify-between">
                <AppText variant="heading">Food log</AppText>
                <AppText variant="caption">{foodsTriedCount(entries)} foods tried</AppText>
              </View>
              {entries.length ? (
                entries.slice(0, RECENT).map((e) => <LogEntryRow key={e.id} entry={e} />)
              ) : (
                <AppText variant="caption" className="py-2">
                  Nothing logged yet. Logging each new food makes it easier to spot a reaction.
                </AppText>
              )}
              {entries.length > RECENT ? (
                <Button
                  variant="quiet"
                  label={`See all ${entries.length}`}
                  onPress={() => router.push('/solids/history')}
                />
              ) : null}
              {entries.length ? (
                <AppText variant="caption" size="sm">
                  Your log is saved on this phone only.
                </AppText>
              ) : null}
            </Card>

            <View className="gap-1 pt-2">
              <AppText variant="heading" size="2xl">
                Planner
              </AppText>
              <AppText variant="caption">
                Plan {name === 'Your baby' ? "your baby's" : `${name}'s`} meals and keep track of
                the freezer.
              </AppText>
            </View>

            <WeekMenu />

            <FreezerCard />

            <Card
              tone="accent"
              className="gap-1"
              onPress={() =>
                router.push({
                  pathname: '/solids/article/[id]',
                  params: { id: 'homemade-baby-food' },
                })
              }
              accessibilityLabel="Make-ahead baby food: a few hours of prep can stock your freezer for weeks. Opens the guide."
            >
              <AppText variant="heading" color="on-accent">
                Make-ahead baby food
              </AppText>
              <AppText color="on-accent">
                A few hours of prep can stock your freezer for weeks. See how ›
              </AppText>
            </Card>

            <Card
              tone="muted"
              className="gap-1"
              onPress={() => router.push('/solids/choking')}
              accessibilityLabel="Choking and gagging: what to know. Opens the safety guide."
            >
              <AppText variant="heading">Choking and gagging</AppText>
              <AppText variant="caption">
                Foods to avoid or change by age, and how to tell gagging from choking.
              </AppText>
            </Card>

            <Notice
              tone="caution"
              title="Draft from official sources"
              body="This plan is summarized from CDC and AAP guidance and hasn't been reviewed by a health professional yet. It's not medical advice: follow your pediatrician's advice, and call 911 in an emergency."
            />
          </View>
        </>
      )}
    </Screen>
  );
}
