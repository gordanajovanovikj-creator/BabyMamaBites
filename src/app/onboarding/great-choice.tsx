import { router } from 'expo-router';
import { View } from 'react-native';
import { useDraft } from '@/features/onboarding/draft-context';
import { OnboardingPhoto, onboardingPhotos } from '@/features/onboarding/onboarding-photo';
import { QuestionBubble } from '@/features/onboarding/question-bubble';
import { Button, Screen } from '@/ui';

const content = {
  'baby-led': {
    photo: onboardingPhotos.babyLed,
    label: 'A baby in a high chair feeding themselves',
    title: 'Baby-led weaning is a great choice!',
    subtitle: "We'll shape recipes and tips around the way your baby likes to eat.",
  },
  spoon: {
    photo: onboardingPhotos.spoon,
    label: 'A baby in a high chair being fed puree from a soft spoon',
    title: 'Spoon feeding is a great choice!',
    subtitle: "We'll shape recipes and tips around the way your baby likes to eat.",
  },
  both: {
    photo: onboardingPhotos.both,
    label: 'A smiling mom sitting with her baby, who feeds herself with a spoon in a high chair',
    title: "We've got you, mama",
    subtitle: \"We're here to guide you every step of the way.\",
  },
  'not-sure': {
    photo: onboardingPhotos.both,
    label: 'A smiling mom sitting with her baby, who feeds herself with a spoon in a high chair',
    title: "We've got you, mama",
    subtitle: \"We're here to guide you every step of the way.\",
  },
} as const;

export default function GreatChoiceScreen() {
  const { draft } = useDraft();
  const approach = draft.solidsApproach;
  const c = approach ? content[approach] : null;

  if (!c) return null;

  return (
    <Screen className="flex-grow pt-4">
      <OnboardingPhoto source={c.photo} label={c.label} height={380} focus="top" />
      <QuestionBubble title={c.title} subtitle={c.subtitle} />
      <View className="flex-1" />
      <Button label="Continue" onPress={() => router.push('/onboarding/notifications')} />
    </Screen>
  );
}
