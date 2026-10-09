import { router } from 'expo-router';

import { helpTopics, toggle } from '@/domain/profile';
import { helpTopicLabels } from '@/domain/profile-labels';
import { useDraft } from '@/features/onboarding/draft-context';
import { StepScreen } from '@/features/onboarding/step-screen';
import { OptionCard } from '@/ui';

export default function HelpStep() {
  const { draft, update } = useDraft();

  return (
    <StepScreen
      step={5}
      title="Where do you need the most help?"
      subtitle="Pick as many as you like. We'll put these first for you."
      canContinue={draft.helpTopics.length > 0}
      onContinue={() => router.push('/onboarding/time')}
    >
      {helpTopics.map((topic) => (
        <OptionCard
          key={topic}
          kind="checkbox"
          title={helpTopicLabels[topic]}
          selected={draft.helpTopics.includes(topic)}
          onPress={() => update({ helpTopics: toggle(draft.helpTopics, topic) })}
        />
      ))}
    </StepScreen>
  );
}
