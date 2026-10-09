import { router } from 'expo-router';

import { feedingStatuses } from '@/domain/profile';
import { feedingLabels } from '@/domain/profile-labels';
import { useDraft } from '@/features/onboarding/draft-context';
import { StepScreen } from '@/features/onboarding/step-screen';
import { OptionCard } from '@/ui';

export default function FeedingStep() {
  const { draft, update } = useDraft();

  return (
    <StepScreen
      step={3}
      title="How are you feeding your baby?"
      subtitle="Every way of feeding is a good one. This just helps us pick relevant ideas for you."
      canContinue={!!draft.feeding}
      onContinue={() => router.push('/onboarding/food')}
    >
      {feedingStatuses.map((status) => (
        <OptionCard
          key={status}
          title={feedingLabels[status]}
          selected={draft.feeding === status}
          onPress={() => update({ feeding: status })}
        />
      ))}
    </StepScreen>
  );
}
