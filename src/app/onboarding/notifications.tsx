import { router } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';

import { QuestionBubble } from '@/features/onboarding/question-bubble';
import { useReminders } from '@/features/reminders/reminders-context';
import { AppText, Button, Card, Notice, Screen, SymbolIcon } from '@/ui';

const perks = [
  { icon: 'calendar', emoji: '🗓️', text: "A weekly nudge to plan your baby's meals" },
  { icon: 'leaf', emoji: '🌱', text: 'A heads-up when a new week of the solids plan starts' },
] as const;

export default function NotificationsScreen() {
  const { settings, update } = useReminders();
  const [busy, setBusy] = useState(false);
  const [blocked, setBlocked] = useState(false);
  const next = () => router.push('/onboarding/paywall');

  const enable = async () => {
    setBusy(true);
    const ok = await update({
      ...settings,
      weeklyPlan: { enabled: true },
      solidsWeek: { enabled: true },
    }).catch(() => false);
    setBusy(false);
    if (ok) next();
    else setBlocked(true);
  };

  return (
    <Screen className="flex-grow pt-8">
      <QuestionBubble
        title="Stay on track, gently"
        subtitle="Turn on reminders and we'll give you a quiet tap when it helps. No spam, ever."
      />
      <Card tone="muted" className="gap-4">
        {perks.map((p) => (
          <View key={p.icon} className="flex-row items-center gap-3">
            <SymbolIcon icon={p.icon} emoji={p.emoji} />
            <AppText variant="body" className="flex-1">
              {p.text}
            </AppText>
          </View>
        ))}
      </Card>
      <AppText variant="caption" className="text-center">
        You can change these any time in Settings.
      </AppText>
      <View className="flex-1" />
      {blocked ? (
        <Notice
          tone="caution"
          body="Notifications are turned off for MamaBabyBites. You can allow them later in your iPhone Settings."
        />
      ) : null}
      <View className="gap-2">
        <Button
          label={busy ? 'One moment…' : blocked ? 'Continue' : 'Turn on reminders'}
          disabled={busy}
          onPress={blocked ? next : enable}
        />
        {!blocked ? <Button label="Not now" variant="quiet" onPress={next} /> : null}
      </View>
    </Screen>
  );
}
