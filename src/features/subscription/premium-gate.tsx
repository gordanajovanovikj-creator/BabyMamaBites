import { router } from 'expo-router';
import type { ComponentType, ReactNode } from 'react';
import { View } from 'react-native';

import { premiumFeatureCopy, TRIAL_DAYS, type PremiumFeature } from '@/domain/subscription';
import { AppText, Button, Card, Screen } from '@/ui';

import { useSubscription } from './subscription-context';

function LockedScreen({ feature }: { feature: PremiumFeature }) {
  const { canPurchase, trialEligible } = useSubscription();
  const copy = premiumFeatureCopy[feature];
  const offerTrial = trialEligible || !canPurchase;
  return (
    <Screen className="flex-grow justify-center">
      <Card className="items-center gap-3 py-8">
        <AppText size="5xl" accessibilityElementsHidden importantForAccessibility="no">
          {copy.emoji}
        </AppText>
        <AppText variant="label" size="sm" color="primary" className="font-bold uppercase">
          Premium
        </AppText>
        <AppText variant="title" size="2xl" className="text-center" accessibilityRole="header">
          {copy.title}
        </AppText>
        <AppText color="muted" className="text-center">
          {copy.detail}
        </AppText>
      </Card>
      <View className="gap-2">
        <Button
          label={offerTrial ? `Start ${TRIAL_DAYS}-day free trial` : 'See plans'}
          onPress={() => router.push('/paywall')}
        />
        <AppText variant="caption" size="sm" className="text-center">
          The monthly guides, food guide and every safety page stay free.
        </AppText>
      </View>
    </Screen>
  );
}

export type PremiumGateProps = {
  feature: PremiumFeature;
  children: ReactNode;
  /** Let this one through without a subscription (e.g. a safety article). */
  free?: boolean;
};

/** Shows its children to subscribers, and a friendly locked screen to everyone else. */
export function PremiumGate({ feature, children, free = false }: PremiumGateProps) {
  const { loading, premium } = useSubscription();
  if (free || premium) return <>{children}</>;
  // A moment of blank screen beats a locked screen flashing past a subscriber.
  if (loading) return <Screen>{null}</Screen>;
  return <LockedScreen feature={feature} />;
}

/** Wraps a whole screen in a PremiumGate. */
export function withPremium<P extends object>(feature: PremiumFeature, Inner: ComponentType<P>) {
  function Gated(props: P) {
    return (
      <PremiumGate feature={feature}>
        <Inner {...props} />
      </PremiumGate>
    );
  }
  Gated.displayName = `withPremium(${Inner.displayName ?? Inner.name ?? 'Screen'})`;
  return Gated;
}
