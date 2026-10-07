import { router } from 'expo-router';
import { View } from 'react-native';

import { useProfile } from '@/features/profile/profile-context';
import { AppText, Button, Card, Screen } from '@/ui';

export default function WelcomeScreen() {
  const { profile } = useProfile();
  const editing = !!profile;

  return (
    <Screen className="flex-grow justify-center pt-16">
      <View className="gap-3">
        <AppText variant="display">{editing ? 'Update your details' : 'Welcome, mama'}</AppText>
        <AppText variant="body" color="muted">
          {editing
            ? 'Change anything that has moved on. It only takes a moment.'
            : "Four quick questions, mostly taps, so we can suggest food that fits your baby's age and your day."}
        </AppText>
      </View>
      <Card tone="muted" className="gap-1">
        <AppText variant="label">Your answers stay on this phone</AppText>
        <AppText variant="caption">
          No account, no tracking. You can change or delete them any time.
        </AppText>
      </Card>
      <Button
        label={editing ? 'Start' : "Let's begin"}
        onPress={() => router.push('/onboarding/baby')}
      />
      {editing ? <Button label="Cancel" variant="quiet" onPress={() => router.back()} /> : null}
    </Screen>
  );
}
