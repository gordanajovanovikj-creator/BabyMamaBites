import { QuestionHeader } from '@/features/onboarding/question-header';
import { useFinishOnboarding } from '@/features/onboarding/use-finish';
import { PaywallView } from '@/features/subscription/paywall-view';
import { useSubscription } from '@/features/subscription/subscription-context';
import { Notice, Screen } from '@/ui';

/** The last onboarding step: offer the free trial, or carry on with the free app. */
export default function OnboardingPaywallScreen() {
  const { saving, failed, finish } = useFinishOnboarding();
  const { trialDays } = useSubscription();
  return (
    <Screen className="flex-grow pt-8">
      <PaywallView
        header={
          <>
            <QuestionHeader
              title={
                trialDays
                  ? `Try Mama & Baby Bites free for ${trialDays} days`
                  : 'Unlock all of Mama & Baby Bites'
              }
              subtitle="Everything you need to feed your baby and yourself well, in one calm place."
            />
            {failed ? (
              <Notice
                tone="caution"
                body="Sorry, we couldn't save your answers. Please try again."
              />
            ) : null}
          </>
        }
        busy={saving}
        onSubscribed={finish}
        skipLabel="Continue with the free version"
        onSkip={finish}
      />
    </Screen>
  );
}
