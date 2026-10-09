import { router } from 'expo-router';

import { solidsApproaches } from '@/domain/profile';
import { solidsApproachLabels } from '@/domain/profile-labels';
import { useDraft } from '@/features/onboarding/draft-context';
import { StepScreen } from '@/features/onboarding/step-screen';
import { useFinishOnboarding } from '@/features/onboarding/use-finish';
import { Notice, OptionCard } from '@/ui';

const details: Partial<Record<(typeof solidsApproaches)[number], string>> = {
  'baby-led': 'Your baby feeds themselves soft finger foods',
  spoon: 'You offer purees and mashes from a spoon',
  both: 'A mix of finger foods and spoon feeding',
};

export default function ApproachStep() {
  const { draft, update, isNew } = useDraft();
  const { saving, failed, finish } = useFinishOnboarding();
  const approach = draft.solidsApproach;

  const next = () => {
    // Editing from Settings: save here and skip the welcome extras.
    if (!isNew) return finish();
    router.push('/onboarding/great-choice');
  };

  return (
    <StepScreen
      step={7}
      title="Which way of starting solids appeals to you?"
      subtitle="There's no wrong answer, and you can change your mind any time."
      continueLabel={!isNew ? (saving ? 'Saving…' : 'Finish') : 'Continue'}
      canContinue={!!approach && !saving}
      onContinue={next}
    >
      {solidsApproaches.map((a) => (
        <OptionCard
          key={a}
          title={solidsApproachLabels[a]}
          detail={details[a]}
          selected={approach === a}
          onPress={() => update({ solidsApproach: a })}
        />
      ))}
      {failed ? (
        <Notice tone="caution" body="Sorry, we couldn't save that. Please try again." />
      ) : null}
    </StepScreen>
  );
}
