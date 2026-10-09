import { router } from 'expo-router';

import { BABY_NAME_MAX } from '@/domain/profile';
import { useDraft } from '@/features/onboarding/draft-context';
import { StepScreen } from '@/features/onboarding/step-screen';
import { TextField } from '@/ui';

export default function NameStep() {
  const { draft, update } = useDraft();
  const next = () => router.push('/onboarding/born');
  const hasName = draft.babyName.trim().length > 0;

  return (
    <StepScreen
      step={1}
      title="What's your baby's name?"
      subtitle="We'll use it to make the app feel like yours. It never leaves this phone."
      canContinue={hasName}
      onContinue={next}
      secondary={{
        label: 'Skip for now',
        onPress: () => {
          update({ babyName: '' });
          next();
        },
      }}
    >
      <TextField
        label="Baby's name"
        value={draft.babyName}
        onChangeText={(text) => update({ babyName: text })}
        placeholder="First name or nickname"
        maxLength={BABY_NAME_MAX}
        autoCapitalize="words"
        autoCorrect={false}
        returnKeyType="done"
        onSubmitEditing={hasName ? next : undefined}
      />
    </StepScreen>
  );
}
