import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { ScrollView, useWindowDimensions, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ArrowButton } from '@/features/onboarding/arrow-button';
import { useDraft } from '@/features/onboarding/draft-context';
import { onboardingPhotos } from '@/features/onboarding/onboarding-photo';
import { usePalette } from '@/theme/use-palette';
import { AppText, Button } from '@/ui';

export default function WelcomeScreen() {
  const { isNew } = useDraft();
  const { height } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const palette = usePalette();
  // The photo fills the top of the screen and fades into white behind the text.
  const photoHeight = Math.round(height * (isNew ? 0.68 : 0.45));
  const fade = Math.round(photoHeight * 0.45);

  return (
    <View className="flex-1 bg-canvas">
      <View
        accessible
        accessibilityRole="image"
        accessibilityLabel="A smiling mom cuddling her happy baby"
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: photoHeight }}
      >
        <Image
          source={onboardingPhotos.welcome}
          contentFit="cover"
          contentPosition="top"
          transition={150}
          accessible={false}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <LinearGradient
          colors={[`${palette.canvas}00`, palette.canvas]}
          style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: fade }}
        />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="flex-grow justify-end gap-6 px-6"
        contentContainerStyle={{
          paddingTop: photoHeight - fade,
          paddingBottom: insets.bottom + 24,
        }}
        bounces={false}
      >
        <View className="gap-3">
          <AppText variant="display" className="text-center" accessibilityRole="header">
            {isNew ? 'Good Food for Mama and Baby' : 'Update your details'}
          </AppText>
          <AppText variant="body" color="muted" className="text-center">
            {isNew
              ? 'Recipes for every age, a week-by-week starting-solids plan and quick meals for you, all in one place.'
              : 'Change anything that has moved on. It only takes a moment.'}
          </AppText>
        </View>
        <View className="gap-3">
          <ArrowButton
            label={isNew ? 'Get Started' : 'Start'}
            onPress={() => router.push('/onboarding/name')}
          />
          <AppText variant="caption" size="sm" className="text-center">
            Your answers stay on this phone. No account, no tracking.
          </AppText>
          {!isNew ? <Button label="Cancel" variant="quiet" onPress={() => router.back()} /> : null}
        </View>
      </ScrollView>
    </View>
  );
}
