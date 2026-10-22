import { Alert, Pressable, View } from 'react-native';

import { useFoodLog } from '@/features/solids/food-log-context';
import { LogEntryRow } from '@/features/solids/log-entry-row';
import { useShareFoodLog } from '@/features/solids/share-food-log';
import { AppText, Button, Card, Screen } from '@/ui';
import { withPremium } from '@/features/subscription/premium-gate';

function FoodHistoryScreen() {
  const { entries, remove } = useFoodLog();
  const report = useShareFoodLog();

  function confirmRemove(id: string, food: string) {
    Alert.alert('Delete this entry?', food, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id).catch(() => {}) },
    ]);
  }

  return (
    <Screen>
      {report.available ? (
        <Button
          label={report.label}
          variant="secondary"
          disabled={report.sharing}
          accessibilityHint="Makes a PDF of the food log to send, print or save"
          onPress={report.share}
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
