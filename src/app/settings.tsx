import { router } from 'expo-router';
import { Alert, Linking, Pressable, View } from 'react-native';

import { logTimes, type ReminderSettings } from '@/domain/reminders';
import { notificationsSupported } from '@/features/reminders/notifications';
import { useReminders } from '@/features/reminders/reminders-context';
import { AppText, Card, Chip, Notice, Screen, SwitchRow } from '@/ui';

function formatTime({ hour, minute }: { hour: number; minute: number }): string {
  const d = new Date(2026, 0, 1, hour, minute);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function LinkRow({ label, detail, onPress }: { label: string; detail: string; onPress(): void }) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${label}. ${detail}`}
      onPress={onPress}
      className="min-h-16 flex-row items-center gap-3 rounded-2xl border border-border bg-surface px-5 py-3 active:opacity-80"
    >
      <View className="flex-1 gap-0.5">
        <AppText variant="label" size="lg">
          {label}
        </AppText>
        <AppText variant="caption">{detail}</AppText>
      </View>
      <AppText variant="heading" color="muted">
        ›
      </AppText>
    </Pressable>
  );
}

export default function SettingsScreen() {
  const { settings, update } = useReminders();

  const save = async (next: ReminderSettings) => {
    const ok = await update(next).catch(() => false);
    if (!ok) {
      Alert.alert(
        'Notifications are turned off',
        'To get reminders, allow notifications for MamaBabyBites in your iPhone Settings.',
        [
          { text: 'Not now', style: 'cancel' },
          { text: 'Open Settings', onPress: () => Linking.openSettings().catch(() => {}) },
        ],
      );
    }
  };

  return (
    <Screen>
      <View className="gap-1">
        <AppText variant="heading" size="2xl">
          Gentle reminders
        </AppText>
        <AppText variant="caption">
          All off unless you turn them on. They&apos;re scheduled on this phone and never show your
          baby&apos;s name.
        </AppText>
      </View>

      {!notificationsSupported ? (
        <Notice body="Reminders work on iPhone. In this web preview your choices are saved, but no notifications are sent." />
      ) : null}

      <SwitchRow
        label="New food check-in"
        detail="A daily nudge to log anything new your baby tried"
        value={settings.foodLog.enabled}
        onChange={(enabled) => save({ ...settings, foodLog: { ...settings.foodLog, enabled } })}
      />
      {settings.foodLog.enabled ? (
        <Card tone="muted" className="gap-2">
          <AppText variant="label">Remind me at</AppText>
          <View className="flex-row flex-wrap gap-2">
            {logTimes.map((t) => (
              <Chip
                key={`${t.hour}:${t.minute}`}
                label={formatTime(t)}
                selected={
                  settings.foodLog.time.hour === t.hour && settings.foodLog.time.minute === t.minute
                }
                onPress={() => save({ ...settings, foodLog: { enabled: true, time: { ...t } } })}
              />
            ))}
          </View>
        </Card>
      ) : null}

      <SwitchRow
        label="Plan the week"
        detail="Sunday at 10:00 AM, to fill in next week's menu"
        value={settings.weeklyPlan.enabled}
        onChange={(enabled) => save({ ...settings, weeklyPlan: { enabled } })}
      />
      <SwitchRow
        label="Freezer check"
        detail="A week before a frozen puree is best used by"
        value={settings.freezer.enabled}
        onChange={(enabled) => save({ ...settings, freezer: { enabled } })}
      />
      <SwitchRow
        label="New week of first foods"
        detail="When a new week of the starting-solids plan begins"
        value={settings.solidsWeek.enabled}
        onChange={(enabled) => save({ ...settings, solidsWeek: { enabled } })}
      />

      <AppText variant="heading" size="2xl" className="pt-4">
        You and your baby
      </AppText>
      <LinkRow
        label="Update details"
        detail="Baby's name, birthday, feeding, allergies and time"
        onPress={() => router.push('/onboarding')}
      />
      <LinkRow
        label="About & safety"
        detail="How we use guidance, and when to call for help"
        onPress={() => router.push('/about')}
      />
    </Screen>
  );
}
