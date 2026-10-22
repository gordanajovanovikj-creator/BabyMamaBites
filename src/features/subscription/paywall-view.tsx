import { router } from 'expo-router';
import { useState, type ReactNode } from 'react';
import { Alert, Platform, View } from 'react-native';

import {
  featuredPlan,
  formatUsd,
  monthlyEquivalentCents,
  plans,
  premiumFeatureCopy,
  yearlySavingsPercent,
  type PlanId,
  type PremiumFeature,
} from '@/domain/subscription';
import { AppText, Button, Card, IconBadge, Notice } from '@/ui';
import { platformWords } from '@/features/shared/platform-words';

import { PlanCard } from './plan-card';
import { useSubscription } from './subscription-context';

/** What the paywall lists, most useful first. */
const highlights: PremiumFeature[] = ['solids-plan', 'recipes', 'planner', 'food-log', 'ask'];

const monthly = plans.monthly;
const yearly = plans.yearly;
const savings = yearlySavingsPercent(monthly, yearly);

function say(title: string, body: string) {
  // react-native-web has no Alert, so the browser preview uses the built-in one.
  if (Platform.OS === 'web') globalThis.alert?.(`${title}\n\n${body}`);
  else Alert.alert(title, body);
}

export type PaywallViewProps = {
  /** Shown above the plans; the screen supplies its own heading. */
  header: ReactNode;
  /** Called after a purchase or restore succeeds. */
  onSubscribed(): void;
  skipLabel: string;
  onSkip(): void;
  /** Disables the buttons while the screen is busy (e.g. saving onboarding). */
  busy?: boolean;
};

/**
 * Plans, free trial and the stores' required wording. Prices come from the App Store or
 * Google Play when it's reachable (localized); the free trial is offered only to accounts
 * that can still get it.
 */
export function PaywallView({
  header,
  onSubscribed,
  skipLabel,
  onSkip,
  busy = false,
}: PaywallViewProps) {
  const sub = useSubscription();
  const [working, setWorking] = useState(false);
  const [selected, setSelected] = useState<PlanId>(featuredPlan);
  const priceOf = (id: PlanId) => sub.products[id]?.displayPrice ?? formatUsd(plans[id].priceCents);
  const plan = plans[selected];
  const storeTrial = sub.products[selected]?.trialDays ?? 0;
  // Without a store (development preview) show the trial as it's set up for launch.
  const trialDays = sub.canPurchase ? (sub.trialEligible ? storeTrial : 0) : plan.trialDays;
  // The "per month" and "save" math uses our US prices, so it only shows next to US prices.
  const usdPrices = Object.values(sub.products).every((p) => p.currency === 'USD');
  const billed = `${priceOf(selected)} per ${plan.period}`;
  const disabled = busy || working;

  const purchase = async () => {
    if (!sub.canPurchase) {
      say(
        'Subscriptions need the app store',
        Platform.OS === 'web'
          ? 'Subscriptions are available in the Mama & Baby Bites app for iPhone and Android.'
          : `Purchases work in a test or ${platformWords.store} build, not in Expo Go.`,
      );
      return;
    }
    setWorking(true);
    const result = await sub.subscribe(selected).catch(() => ({ status: 'failed' as const }));
    setWorking(false);
    if (result.status === 'subscribed') onSubscribed();
    else if (result.status === 'pending') {
      say(
        'Waiting for approval',
        'Your request was sent for approval. Premium unlocks as soon as it’s approved.',
      );
    } else if (result.status === 'failed') {
      say("That didn't go through", "You haven't been charged. Please try again in a moment.");
    }
  };

  const restore = async () => {
    if (!sub.canPurchase) {
      say('Nothing to restore here', 'Restore your subscription in the app on your phone.');
      return;
    }
    setWorking(true);
    const found = await sub.restore().catch(() => false);
    setWorking(false);
    if (found) onSubscribed();
    else
      say(
        'No subscription found',
        `We couldn’t find an active subscription for this ${platformWords.account}.`,
      );
  };

  return (
    <>
      {header}
      <Card tone="muted" className="gap-5">
        {highlights.map((id) => {
          const f = premiumFeatureCopy[id];
          return (
            <View key={id} className="flex-row gap-3">
              <IconBadge icon={f.icon} emoji={f.emoji} size={40} tone="surface" />
              <View className="flex-1 gap-0.5">
                <AppText variant="heading" size="lg">
                  {f.title}
                </AppText>
                <AppText variant="body" color="muted">
                  {f.detail}
                </AppText>
              </View>
            </View>
          );
        })}
      </Card>
      <View className="flex-row gap-3 pt-3" accessibilityRole="radiogroup">
        <PlanCard
          name="Monthly"
          price={`${priceOf('monthly')}/month`}
          detail="Billed monthly"
          selected={selected === 'monthly'}
          onPress={() => setSelected('monthly')}
        />
        <PlanCard
          name="Yearly"
          price={`${priceOf('yearly')}/year`}
          detail={
            usdPrices ? `Just ${formatUsd(monthlyEquivalentCents(yearly))}/month` : 'Billed yearly'
          }
          highlight={usdPrices ? `Save ${savings}%` : undefined}
          badge="Most popular"
          selected={selected === 'yearly'}
          onPress={() => setSelected('yearly')}
        />
      </View>
      {!sub.canPurchase && Platform.OS === 'web' ? (
        <Notice body="Subscriptions are available in the Mama & Baby Bites app for iPhone and Android." />
      ) : null}
      <View className="gap-2">
        <Button
          label={
            disabled
              ? 'One moment…'
              : trialDays
                ? `Start ${trialDays}-day free trial`
                : `Subscribe for ${billed}`
          }
          disabled={disabled}
          onPress={purchase}
        />
        <Button label={skipLabel} variant="quiet" disabled={disabled} onPress={onSkip} />
      </View>
      <AppText variant="caption" className="text-center">
        {trialDays
          ? `No charge today. After ${trialDays} days your subscription renews automatically at ${billed} until you cancel.`
          : `Your subscription renews automatically at ${billed} until you cancel.`}{' '}
        Cancel any time in {platformWords.cancelIn} at least 24 hours before{' '}
        {trialDays ? 'the trial or a renewal ends.' : 'a renewal.'}
      </AppText>
      <Button label="Restore purchases" variant="quiet" disabled={disabled} onPress={restore} />
      <View className="flex-row justify-center gap-6">
        <Button
          label="Terms of Use"
          variant="quiet"
          size="compact"
          onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'terms' } })}
        />
        <Button
          label="Privacy Policy"
          variant="quiet"
          size="compact"
          onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'privacy' } })}
        />
      </View>
    </>
  );
}
