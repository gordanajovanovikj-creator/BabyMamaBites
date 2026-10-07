import { Stack } from 'expo-router';

import { DraftProvider, draftFromProfile } from '@/features/onboarding/draft-context';
import { useProfile } from '@/features/profile/profile-context';

export default function OnboardingLayout() {
  const { profile } = useProfile();

  return (
    <DraftProvider initial={draftFromProfile(profile)}>
      <Stack
        screenOptions={{
          title: '',
          headerShadowVisible: false,
          headerBackButtonDisplayMode: 'minimal',
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
      </Stack>
    </DraftProvider>
  );
}
