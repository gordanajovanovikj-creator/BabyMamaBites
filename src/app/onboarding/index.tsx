import { router } from 'expo-router';
import { useWindowDimensions, View } from 'react-native';

import { useDraft } from '@/features/onboarding/draft-context';
import { OnboardingPhoto, onboardingPhotos } from '@/features/onboarding/onboarding-photo';
import { AppText, Button, Screen } from '@/ui';

export default function WelcomeScreen() {
  const { isNew } = useDraft();
  const { height } = useWindowDimensions();
  // The photo leads: about 60% of the screen for a first run.
  const photoHeight = Math.round(height * (isNew ? 0.6 : 0.35));

  return (
    <Screen className="flex-grow pt-12">
      <OnboardingPhoto
        source={onboardingPhotos.welcome}
        label="A smiling mom cuddling her happy baby"
        height={photoHeight}
        focus="top"
      />
      <View className="gap-2">
        <AppText variant="display" size="5xl" className="text-center" accessibilityRole="header">
          {isNew ? 'Welcome, mama' : 'Update your details'}
        </AppText>
        <AppText variant="body" color="muted" className="text-center">
          {isNew
            ? "A few quick taps so we can suggest food that fits your baby's age and your day."
            : 'Change anything that has moved on. It only takes a moment.'}
        </AppText>
      </View>
      <View className="flex-1" />
      <View className="gap-2">
        <Button
          label={isNew ? "Let's begin" : 'Start'}
          onPress={() => router.push('/onboarding/name')}
        />
        <AppText variant="caption" className="text-center">
          Your answers stay on this phone. No account, no tracking.
        </AppText>
        {!isNew ? <Button label="Cancel" variant="quiet" onPress={() => router.back()} /> : null}
      </View>
    </Screen>
  );
}
