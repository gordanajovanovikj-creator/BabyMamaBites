import type { ImageContentPosition, ImageSource } from 'expo-image';
import { router } from 'expo-router';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import type { SolidsApproach } from '@/domain/profile';
import { useDraft } from '@/features/onboarding/draft-context';
import { FadePhoto, fadeHeight } from '@/features/onboarding/fade-photo';
import { onboardingPhotos } from '@/features/onboarding/onboarding-photo';
import { QuestionHeader } from '@/features/onboarding/question-header';
import { Button, RoundIconButton } from '@/ui';

type Choice = {
  photo: ImageSource;
  label: string;
  position: ImageContentPosition;
  title: string;
  subtitle: string;
};

const content: Record<SolidsApproach, Choice> = {
  'baby-led': {
    photo: onboardingPhotos.babyLed,
    label: 'A smiling baby in a high chair with soft finger foods on the tray',
    position: 'center',
    title: 'Baby-led weaning is a great choice!',
    subtitle: "We'll shape recipes and tips around the way your baby likes to eat.",
  },
  spoon: {
    photo: onboardingPhotos.spoon,
    label: 'A baby in a high chair being fed puree from a soft spoon',
    position: 'bottom',
    title: 'Spoon feeding is a great choice!',
    subtitle: "We'll shape recipes and tips around the way your baby likes to eat.",
  },
  both: {
    photo: onboardingPhotos.family,
    label: 'Mom and dad in the kitchen watching their baby eat in a high chair',
    position: 'center',
    title: "We've got you, mama",
    subtitle: "We're here to guide you every step of the way.",
  },
  'not-sure': {
    photo: onboardingPhotos.family,
    label: 'Mom and dad in the kitchen watching their baby eat in a high chair',
    position: 'center',
    title: "We've got you, mama",
    subtitle: "We're here to guide you every step of the way.",
  },
};

const FADE = 0.2;

export default function GreatChoiceScreen() {
  const { draft } = useDraft();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const approach = draft.solidsApproach;
  const c = approach ? content[approach] : null;

  if (!c) return null;

  // The photo fills the top of the screen, high chair and all, and fades into the text.
  const photoHeight = Math.round(height * 0.68);
  // A short fade keeps the high chair tray in view.
  const fade = fadeHeight(photoHeight, FADE);

  return (
    <View className="flex-1 bg-canvas">
      <FadePhoto
        source={c.photo}
        label={c.label}
        height={photoHeight}
        position={c.position}
        fade={FADE}
      />

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-end gap-6 px-5"
        contentContainerStyle={{
          paddingTop: photoHeight - fade,
          paddingBottom: insets.bottom + 24,
        }}
        bounces={false}
      >
        <QuestionHeader title={c.title} subtitle={c.subtitle} />
        <Button label="Continue" onPress={() => router.push('/onboarding/notifications')} />
      </ScrollView>

      <View className="absolute left-5" style={{ top: insets.top + 8 }}>
        <RoundIconButton
          symbol="chevron.left"
          fallback="‹"
          accessibilityLabel="Back"
          onPress={() => router.back()}
        />
      </View>
    </View>
  );
}
