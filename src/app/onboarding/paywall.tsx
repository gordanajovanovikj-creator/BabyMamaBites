import { TRIAL_DAYS } from '@/domain/subscription';
import { QuestionHeader } from '@/features/onboarding/question-header';
import { useFinishOnboarding } from '@/features/onboarding/use-finish';
import { PaywallView } from '@/features/subscription/paywall-view';
import { Notice, Screen } from '@/ui';

/** The last onboarding step: offer the free trial, or carry on with the free app. */
export default function OnboardingPaywallScreen() {
  const { saving, failed, finish } = useFinishOnboarding();
  return (
    <Screen className="flex-grow pt-8">
      <PaywallView
        header={
          <>
            <QuestionHeader
              title={`Try Mama & Baby Bites free for ${TRIAL_DAYS} days`}
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
