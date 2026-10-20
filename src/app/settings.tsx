import { router } from 'expo-router';
import { Alert, Linking, Pressable, View } from 'react-native';

import { SUPPORT_EMAIL } from '@/content/contact';
import { logTimes, type ReminderSettings } from '@/domain/reminders';
import { notificationsSupported } from '@/features/reminders/notifications';
import { useReminders } from '@/features/reminders/reminders-context';
import {
  premiumUnlockedForDevelopment,
  useSubscription,
} from '@/features/subscription/subscription-context';
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

/** Plan status, manage and restore; in development builds, a switch to preview the free app. */
function SubscriptionSection() {
  const sub = useSubscription();
  const restore = async () => {
    const found = await sub.restore().catch(() => false);
    Alert.alert(
      found ? 'Subscription restored' : 'No subscription found',
      found
        ? 'Welcome back! Everything is unlocked.'
        : 'We couldn’t find an active subscription for this Apple ID.',
    );
  };
  return (
    <>
      <AppText variant="heading" size="2xl" className="pt-4">
        Subscription
      </AppText>
      {sub.premium ? (
        sub.canPurchase ? (
          <LinkRow
            label="Premium"
            detail="Manage or cancel in the App Store"
            onPress={() => sub.manage().catch(() => {})}
          />
        ) : (
          // Nothing to manage without the App Store (development preview).
          <Card className="gap-0.5">
            <AppText variant="label" size="lg">
              Premium
            </AppText>
            <AppText variant="caption">Unlocked</AppText>
          </Card>
        )
      ) : (
        <LinkRow
          label="Free version"
          detail="Start a free trial to unlock everything"
          onPress={() => router.push('/paywall')}
        />
      )}
      {sub.canPurchase && !sub.premium ? (
        <LinkRow
          label="Restore purchases"
          detail="Already subscribed on another phone?"
          onPress={restore}
        />
      ) : null}
      {premiumUnlockedForDevelopment ? (
        <SwitchRow
          label="Preview the free version"
          detail="Development only: Premium is unlocked without the App Store"
          value={sub.previewFree}
          onChange={sub.setPreviewFree}
        />
      ) : null}
    </>
  );
}

export default function SettingsScreen() {
  const { settings, update } = useReminders();

  const save = async (next: ReminderSettings) => {
    const ok = await update(next).catch(() => false);
    if (!ok) {
      Alert.alert(
        'Notifications are turned off',
        'To get reminders, allow notifications for Mama & Baby Bites in your iPhone Settings.',
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
        label="Photo credits"
        detail="The photographers behind our food photos"
        onPress={() => router.push('/credits')}
      />

      <SubscriptionSection />

      <AppText variant="heading" size="2xl" className="pt-4">
        Safety and legal
      </AppText>
      <LinkRow
        label="Emergency & resources"
        detail="911, Poison Control, crisis and support lines"
        onPress={() => router.push('/emergency')}
      />
      <LinkRow
        label="Disclaimers & terms"
        detail="Educational information only, not medical advice"
        onPress={() => router.push('/disclaimer')}
      />
      <LinkRow
        label="About & safety"
        detail="Where our guidance comes from, and when to call for help"
        onPress={() => router.push('/about')}
      />
      <LinkRow
        label="Terms of Use"
        detail="The rules for using the app and subscriptions"
        onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'terms' } })}
      />
      <LinkRow
        label="Privacy Policy"
        detail="Your details stay on this phone"
        onPress={() => router.push({ pathname: '/legal/[doc]', params: { doc: 'privacy' } })}
      />
      <LinkRow
        label="Contact us"
        detail={SUPPORT_EMAIL}
        onPress={() => Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() => {})}
      />
    </Screen>
  );
}
