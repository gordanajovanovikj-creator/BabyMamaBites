import { router } from 'expo-router';
import { View } from 'react-native';

import { allergens, diets, toggle } from '@/domain/profile';
import { allergenLabels, dietLabels } from '@/domain/profile-labels';
import { useDraft } from '@/features/onboarding/draft-context';
import { StepScreen } from '@/features/onboarding/step-screen';
import { AppText, Chip } from '@/ui';

export default function FoodStep() {
  const { draft, update } = useDraft();
  const nothingPicked = draft.allergens.length === 0 && draft.diets.length === 0;

  return (
    <StepScreen
      step={3}
      title="Anything you avoid?"
      subtitle="Tap any that apply to your household. We'll leave these out of suggestions."
      continueLabel={nothingPicked ? 'None of these' : 'Continue'}
      canContinue
      onContinue={() => router.push('/onboarding/time')}
    >
      <AppText variant="heading">Allergies</AppText>
      <View className="flex-row flex-wrap gap-2">
        {allergens.map((a) => (
          <Chip
            key={a}
            label={allergenLabels[a]}
            selected={draft.allergens.includes(a)}
            onPress={() => update({ allergens: toggle(draft.allergens, a) })}
          />
        ))}
      </View>
      <AppText variant="heading" className="pt-2">
        Way of eating
      </AppText>
      <View className="flex-row flex-wrap gap-2">
        {diets.map((d) => (
          <Chip
            key={d}
            label={dietLabels[d]}
            selected={draft.diets.includes(d)}
            onPress={() => update({ diets: toggle(draft.diets, d) })}
          />
        ))}
      </View>
    </StepScreen>
  );
}
