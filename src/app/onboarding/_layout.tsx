import { Stack } from 'expo-router';

import { headerBackButton } from '@/features/navigation/header-back-button';
import { DraftProvider, draftFromProfile } from '@/features/onboarding/draft-context';
import { useProfile } from '@/features/profile/profile-context';

export default function OnboardingLayout() {
  const { profile } = useProfile();

  return (
    <DraftProvider initial={draftFromProfile(profile)} isNew={!profile}>
      <Stack
        screenOptions={{
          title: '',
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
          headerLeft: headerBackButton,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="great-choice" options={{ headerShown: false }} />
      </Stack>
    </DraftProvider>
  );
}
