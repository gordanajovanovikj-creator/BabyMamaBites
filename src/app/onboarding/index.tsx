import { router } from 'expo-router';
import { View } from 'react-native';

import { useDraft } from '@/features/onboarding/draft-context';
import { OnboardingPhoto, onboardingPhotos } from '@/features/onboarding/onboarding-photo';
import { AppText, Button, Card, Screen } from '@/ui';

export default function WelcomeScreen() {
  const { isNew } = useDraft();

  return (
    <Screen className="flex-grow justify-center pt-12">
      <OnboardingPhoto
        source={onboardingPhotos.welcome}
        label="A smiling mom cuddling her happy baby"
        height={isNew ? 360 : 200}
        focus="top"
      />
      <View className="gap-3">
        <AppText variant="display">{isNew ? 'Welcome, mama' : 'Update your details'}</AppText>
        <AppText variant="body" color="muted">
          {isNew
            ? "A few quick questions, mostly taps, so we can suggest food that fits your baby's age and your day."
            : 'Change anything that has moved on. It only takes a moment.'}
        </AppText>
      </View>
      <Card tone="muted" className="gap-1">
        <AppText variant="label">Your answers stay on this phone</AppText>
        <AppText variant="caption">
          No account, no tracking. You can change or delete them any time.
        </AppText>
      </Card>
      <Button
        label={isNew ? "Let's begin" : 'Start'}
        onPress={() => router.push('/onboarding/name')}
      />
      {!isNew ? <Button label="Cancel" variant="quiet" onPress={() => router.back()} /> : null}
    </Screen>
  );
}
