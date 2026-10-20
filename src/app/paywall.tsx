import { router } from 'expo-router';

import { PaywallView } from '@/features/subscription/paywall-view';
import { AppText, Screen } from '@/ui';

/** Opened from a locked screen or Settings. */
export default function PaywallScreen() {
  return (
    <Screen>
      <PaywallView
        header={
          <AppText variant="title" accessibilityRole="header">
            Unlock all of Mama & Baby Bites
          </AppText>
        }
        onSubscribed={() => router.back()}
        skipLabel="Not now"
        onSkip={() => router.back()}
      />
    </Screen>
  );
}
