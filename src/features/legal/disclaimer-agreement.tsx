import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { safetyNotice } from '@/content/copy';
import { AppText, Button, Screen } from '@/ui';

import { useDisclaimer } from './disclaimer-context';

/**
 * The medical and nutritional disclaimer people must accept before using the app:
 * in onboarding, and once for anyone who set up the app before it existed.
 */
export function DisclaimerAgreement({ onAccepted }: { onAccepted(): void }) {
  const { accept } = useDisclaimer();
  const block = safetyNotice('onboarding');
  return (
    <Screen
      className="gap-5 pt-8"
      footer={
        <Button
          label="I understand and agree"
          className="flex-1"
          onPress={async () => {
            await accept();
            onAccepted();
          }}
        />
      }
    >
      <View className="gap-2">
        <AppText variant="title" accessibilityRole="header">
          Before you start
        </AppText>
        <AppText color="muted">Please read this carefully. It matters for your family.</AppText>
      </View>
      <View className="gap-3 rounded-3xl bg-surface-muted p-5">
        <AppText variant="heading">{block.title}</AppText>
        <AppText>{block.body}</AppText>
      </View>
      <View className="gap-3 rounded-3xl bg-danger-bg p-5" accessibilityRole="alert">
        <AppText variant="heading" color="danger">
          In an emergency
        </AppText>
        <AppText color="danger">
          If your baby is choking, can&apos;t breathe or shows signs of a severe allergic reaction,
          call 911. If you&apos;re in crisis, call or text 988.
        </AppText>
      </View>
      <View className="gap-1">
        {[
          { label: 'Read the full disclaimer', go: () => router.push('/disclaimer') },
          {
            label: 'Terms of Use',
            go: () => router.push({ pathname: '/legal/[doc]', params: { doc: 'terms' } }),
          },
          {
            label: 'Privacy Policy',
            go: () => router.push({ pathname: '/legal/[doc]', params: { doc: 'privacy' } }),
          },
        ].map((l) => (
          <Pressable
            key={l.label}
            accessibilityRole="link"
            accessibilityLabel={l.label}
            onPress={l.go}
            className="min-h-12 justify-center active:opacity-60"
          >
            <AppText variant="label" color="primary" className="font-bold">
              {`${l.label} ›`}
            </AppText>
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}
