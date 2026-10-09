import { router } from 'expo-router';

import { cookingTimes } from '@/domain/profile';
import { cookingTimeLabels } from '@/domain/profile-labels';
import { useDraft } from '@/features/onboarding/draft-context';
import { StepScreen } from '@/features/onboarding/step-screen';
import { OptionCard } from '@/ui';

export default function TimeStep() {
  const { draft, update } = useDraft();

  return (
    <StepScreen
      step={6}
      title="How much time do you usually have to cook?"
      subtitle="No judgment. Some days it's a spoon and a banana."
      canContinue={!!draft.cookingTime}
      onContinue={() => router.push('/onboarding/approach')}
    >
      {cookingTimes.map((time) => (
        <OptionCard
          key={time}
          title={cookingTimeLabels[time].title}
          detail={cookingTimeLabels[time].detail}
          selected={draft.cookingTime === time}
          onPress={() => update({ cookingTime: time })}
        />
      ))}
    </StepScreen>
  );
}
