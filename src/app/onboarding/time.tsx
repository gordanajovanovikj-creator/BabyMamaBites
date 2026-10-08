import { router } from 'expo-router';
import { useState } from 'react';

import { cookingTimes } from '@/domain/profile';
import { cookingTimeLabels } from '@/domain/profile-labels';
import { draftToProfile, useDraft } from '@/features/onboarding/draft-context';
import { StepScreen } from '@/features/onboarding/step-screen';
import { useProfile } from '@/features/profile/profile-context';
import { Notice, OptionCard } from '@/ui';

export default function TimeStep() {
  const { draft, update } = useDraft();
  const { saveProfile } = useProfile();
  const [saving, setSaving] = useState(false);
  const [failed, setFailed] = useState(false);
  const profile = draftToProfile(draft);

  const finish = async () => {
    if (!profile) return;
    setSaving(true);
    setFailed(false);
    try {
      await saveProfile(profile);
      router.dismissTo('/');
    } catch {
      setFailed(true);
      setSaving(false);
    }
  };

  return (
    <StepScreen
      step={4}
      title="How much time do you usually have to cook?"
      subtitle="No judgment. Some days it's a spoon and a banana."
      continueLabel={saving ? 'Saving…' : 'Finish'}
      canContinue={!!profile && !saving}
      onContinue={finish}
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
      {failed ? (
        <Notice tone="caution" body="Sorry, we couldn't save that. Please try again." />
      ) : null}
    </StepScreen>
  );
}
