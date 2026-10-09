import { useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import { formatUsd, monthlyEquivalentCents, yearlyPlan } from '@/domain/subscription';
import { QuestionBubble } from '@/features/onboarding/question-bubble';
import { useFinishOnboarding } from '@/features/onboarding/use-finish';
import { restorePurchases, startYearlyTrial } from '@/features/subscription/purchases';
import { AppText, Button, Card, Notice, Screen, SymbolIcon } from '@/ui';

const yearly = formatUsd(yearlyPlan.yearlyPriceCents);
const monthly = formatUsd(monthlyEquivalentCents(yearlyPlan.yearlyPriceCents));

const features = [
  {
    icon: 'fork.knife',
    emoji: '🍽️',
    text: 'Recipes for your baby, for you, and for the whole family',
  },
  { icon: 'calendar', emoji: '🗓️', text: 'A week-by-week plan for starting solids' },
  {
    icon: 'list.bullet.clipboard',
    emoji: '📋',
    text: 'Meal planner, freezer tracker and food log',
  },
] as const;

export default function PaywallScreen() {
  const { saving, failed, finish } = useFinishOnboarding();
  const [busy, setBusy] = useState(false);

  const notConnected = () =>
    new Promise<void>((resolve) => {
      const title = 'Subscriptions are coming soon';
      const body =
        "You haven't been charged. Enjoy the app for free while we finish setting this up.";
      // react-native-web has no Alert, so the browser preview uses the built-in one.
      if (Platform.OS === 'web') {
        globalThis.alert?.(`${title}\n\n${body}`);
        resolve();
        return;
      }
      Alert.alert(title, body, [{ text: 'OK', onPress: () => resolve() }]);
    });

  const run = async (action: typeof startYearlyTrial) => {
    setBusy(true);
    const result = await action().catch(() => ({ status: 'cancelled' as const }));
    setBusy(false);
    if (result.status === 'cancelled') return;
    if (result.status === 'unavailable') await notConnected();
    await finish();
  };

  const disabled = busy || saving;

  return (
    <Screen className="flex-grow pt-8">
      <QuestionBubble
        title={`Try MamaBabyBites free for ${yearlyPlan.trialDays} days`}
        subtitle="Everything you need to feed your baby and yourself well, in one calm place."
      />
      <Card tone="muted" className="gap-4">
        {features.map((f) => (
          <View key={f.icon} className="flex-row items-center gap-3">
            <SymbolIcon icon={f.icon} emoji={f.emoji} />
            <AppText variant="body" className="flex-1">
              {f.text}
            </AppText>
          </View>
        ))}
      </Card>
      <Card className="items-center gap-1">
        <AppText variant="label" color="primary">
          Yearly plan
        </AppText>
        <AppText variant="title" className="text-center">
          {yearlyPlan.trialDays} days free, then {yearly}/year
        </AppText>
        <AppText variant="caption" className="text-center">
          That&apos;s just {monthly} a month, billed once a year.
        </AppText>
      </Card>
      {failed ? (
        <Notice tone="caution" body="Sorry, we couldn't save your answers. Please try again." />
      ) : null}
      <View className="gap-2">
        <Button
          label={busy || saving ? 'One moment…' : 'Start my free trial'}
          disabled={disabled}
          onPress={() => run(startYearlyTrial)}
        />
        <Button label="Not now" variant="quiet" disabled={disabled} onPress={finish} />
      </View>
      <AppText variant="caption" className="text-center">
        No charge today. After {yearlyPlan.trialDays} days your subscription renews automatically at{' '}
        {yearly} per year until you cancel. Cancel any time in your iPhone Settings at least 24
        hours before the trial or a renewal ends.
      </AppText>
      <Button
        label="Restore purchases"
        variant="quiet"
        disabled={disabled}
        onPress={() => run(restorePurchases)}
      />
    </Screen>
  );
}
