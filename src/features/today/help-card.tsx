import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { AppText, SymbolIcon } from '@/ui';

/** "We're here to help": opens Ask, with a reminder to call a professional when it matters. */
export function HelpCard() {
  return (
    <View className="px-5">
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="We're here to help. Ask us anything in the chat. Opens Ask."
        onPress={() => router.navigate('/ask')}
        className="flex-row items-center gap-4 overflow-hidden rounded-3xl bg-accent p-5 active:opacity-90"
      >
        <View className="h-14 w-14 items-center justify-center rounded-full bg-surface">
          <SymbolIcon icon="bubble.left.and.bubble.right.fill" emoji="💬" size={26} />
        </View>
        <View className="flex-1 gap-1">
          <AppText variant="heading" color="on-accent">
            We&apos;re here to help
          </AppText>
          <AppText variant="body" color="on-accent">
            Ask us anything in our chat.
          </AppText>
          <AppText variant="caption" size="sm" color="on-accent">
            For anything urgent, call your doctor or 911.
          </AppText>
        </View>
        <AppText variant="heading" color="on-accent">
          ›
        </AppText>
      </Pressable>
    </View>
  );
}
