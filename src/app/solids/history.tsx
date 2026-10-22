import { useState } from 'react';
import { Alert, Platform, Pressable, View } from 'react-native';

import { today } from '@/domain/dates';
import { buildReport, reportPeriodLabels, reportPeriods } from '@/domain/pediatrician-report';
import { useProfile } from '@/features/profile/profile-context';
import { useFoodLog } from '@/features/solids/food-log-context';
import { LogEntryRow } from '@/features/solids/log-entry-row';
import { shareFoodLogReport } from '@/features/solids/share-food-log';
import { AppText, Button, Card, Screen } from '@/ui';
import { withPremium } from '@/features/subscription/premium-gate';

function FoodHistoryScreen() {
  const { entries, remove } = useFoodLog();
  const { profile } = useProfile();
  const [sharing, setSharing] = useState(false);

  function confirmRemove(id: string, food: string) {
    Alert.alert('Delete this entry?', food, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id).catch(() => {}) },
    ]);
  }

  function chooseReport() {
    if (!profile) return;
    Alert.alert(
      'Share with your pediatrician',
      'Make a PDF of foods, allergens and any reactions to email, print or show at your next visit.',
      [
        ...reportPeriods.map((period) => ({
          text: reportPeriodLabels[period],
          onPress: () => {
            setSharing(true);
            shareFoodLogReport(buildReport(profile, entries, period, today()))
              .catch(() => Alert.alert("Couldn't make the PDF", 'Please try again.'))
              .finally(() => setSharing(false));
          },
        })),
        { text: 'Cancel', style: 'cancel' as const },
      ],
    );
  }

  return (
    <Screen>
      {entries.length && profile && Platform.OS !== 'web' ? (
        <Button
          label={sharing ? 'Making your PDF…' : 'Share with your pediatrician'}
          variant="secondary"
          disabled={sharing}
          accessibilityHint="Makes a PDF of the food log to send, print or save"
          onPress={chooseReport}
        />
      ) : null}
      <AppText variant="caption">Saved on this phone only. Newest first.</AppText>
      <Card className="gap-0 px-5 py-2">
        {entries.length ? (
          entries.map((e) => (
            <LogEntryRow
              key={e.id}
              entry={e}
              action={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Delete ${e.food}`}
                  onPress={() => confirmRemove(e.id, e.food)}
                  hitSlop={8}
                  className="min-h-12 min-w-12 items-center justify-center rounded-full active:opacity-60"
                >
                  <AppText variant="label" color="muted">
                    Delete
                  </AppText>
                </Pressable>
              }
            />
          ))
        ) : (
          <View className="py-6">
            <AppText variant="caption" className="text-center">
              Nothing logged yet.
            </AppText>
          </View>
        )}
      </Card>
    </Screen>
  );
}

export default withPremium('food-log', FoodHistoryScreen);
