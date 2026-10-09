import { router } from 'expo-router';
import { View } from 'react-native';

import { useDraft } from '@/features/onboarding/draft-context';
import { OnboardingPhoto, onboardingPhotos } from '@/features/onboarding/onboarding-photo';
import { AppText, Button, Screen } from '@/ui';

const content = {
  'baby-led': {
    photo: onboardingPhotos.babyLed,
    label: 'A baby in a high chair feeding themselves soft pieces of fruit',
    title: 'Baby-led weaning is a great choice!',
  },
  spoon: {
    photo: onboardingPhotos.spoon,
    label: 'A mom spoon-feeding her baby in a high chair',
    title: 'Spoon feeding is a great choice!',
  },
  both: {
    photo: onboardingPhotos.spoon,
    label: 'A mom spoon-feeding her baby, who holds a spoon of their own',
    title: 'Mixing both is a great choice!',
  },
} as const;

export default function GreatChoiceScreen() {
  const { draft } = useDraft();
  const approach = draft.solidsApproach;
  const c = approach && approach !== 'not-sure' ? content[approach] : null;

  if (!c) return null;

  return (
    <Screen className="flex-grow justify-center pt-4">
      <OnboardingPhoto source={c.photo} label={c.label} height={380} focus="top" />
      <View className="gap-3">
        <AppText variant="display">{c.title}</AppText>
        <AppText variant="body" color="muted">
          We&apos;ll shape recipes and tips around the way your baby likes to eat.
        </AppText>
      </View>
      <Button label="Continue" onPress={() => router.push('/onboarding/notifications')} />
    </Screen>
  );
}
