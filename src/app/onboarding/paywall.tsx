import { useState } from 'react';
import { Alert, Platform, View } from 'react-native';

import {
  featuredPlan,
  formatUsd,
  monthlyEquivalentCents,
  plans,
  TRIAL_DAYS,
  yearlySavingsPercent,
  type PlanId,
} from '@/domain/subscription';
import { QuestionBubble } from '@/features/onboarding/question-bubble';
import { useFinishOnboarding } from '@/features/onboarding/use-finish';
import { PlanCard } from '@/features/subscription/plan-card';
import {
  restorePurchases,
  startTrial,
  type PurchaseResult,
} from '@/features/subscription/purchases';
import { AppText, Button, Card, Notice, Screen, SymbolIcon } from '@/ui';

const features = [
  {
    icon: 'safari',
    emoji: '🧭',
    title: 'A guided start to solids',
    detail: 'A week-by-week plan, so you always know what to try next.',
  },
  {
    icon: 'fork.knife',
    emoji: '🍽️',
    title: 'Recipes for baby and you',
    detail: 'Purees and finger foods for baby, plus nourishing meals for mom and the family.',
  },
  {
    icon: 'calendar',
    emoji: '🗓️',
    title: 'Planner and food log',
    detail: 'Plan meals, keep track of the freezer, and log every new food.',
  },
] as const;

const monthly = plans.monthly;
const yearly = plans.yearly;
const savings = yearlySavingsPercent(monthly, yearly);

export default function PaywallScreen() {
  const { saving, failed, finish } = useFinishOnboarding();
  const [busy, setBusy] = useState(false);
  const [selected, setSelected] = useState<PlanId>(featuredPlan);
  const plan = plans[selected];
  const billed = `${formatUsd(plan.priceCents)} per ${plan.period}`;

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

  const run = async (action: () => Promise<PurchaseResult>) => {
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
        title={`Try MamaBabyBites free for ${TRIAL_DAYS} days`}
        subtitle="Everything you need to feed your baby and yourself well, in one calm place."
      />
      <Card tone="muted" className="gap-5">
        {features.map((f) => (
          <View key={f.icon} className="flex-row gap-3">
            <SymbolIcon icon={f.icon} emoji={f.emoji} />
            <View className="flex-1 gap-0.5">
              <AppText variant="heading" size="lg">
                {f.title}
              </AppText>
              <AppText variant="body" color="muted">
                {f.detail}
              </AppText>
            </View>
          </View>
        ))}
      </Card>
      <View className="flex-row gap-3 pt-3" accessibilityRole="radiogroup">
        <PlanCard
          name="Monthly"
          price={`${formatUsd(monthly.priceCents)}/month`}
          detail="Billed monthly"
          selected={selected === 'monthly'}
          onPress={() => setSelected('monthly')}
        />
        <PlanCard
          name="Yearly"
          price={`${formatUsd(yearly.priceCents)}/year`}
          detail={`Just ${formatUsd(monthlyEquivalentCents(yearly))}/month`}
          highlight={`Save ${savings}%`}
          badge="Most popular"
          selected={selected === 'yearly'}
          onPress={() => setSelected('yearly')}
        />
      </View>
      {failed ? (
        <Notice tone="caution" body="Sorry, we couldn't save your answers. Please try again." />
      ) : null}
      <View className="gap-2">
        <Button
          label={busy || saving ? 'One moment…' : `Start ${plan.trialDays}-day free trial`}
          disabled={disabled}
          onPress={() => run(() => startTrial(plan))}
        />
        <Button label="Not now" variant="quiet" disabled={disabled} onPress={finish} />
      </View>
      <AppText variant="caption" className="text-center">
        No charge today. After {plan.trialDays} days your subscription renews automatically at{' '}
        {billed} until you cancel. Cancel any time in your iPhone Settings at least 24 hours before
        the trial or a renewal ends.
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
