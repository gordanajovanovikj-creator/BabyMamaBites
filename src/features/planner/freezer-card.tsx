import { router } from 'expo-router';
import { Alert, Pressable, View } from 'react-native';

import { fromIsoDate, today } from '@/domain/dates';
import {
  freezerStatus,
  sortFreezer,
  totalCubes,
  bestBefore,
  type FreezerItem,
  type FreezerStatus,
} from '@/domain/planner';
import { AppText, Button, Card, cn } from '@/ui';

import { usePlanner } from './planner-context';

const statusText: Record<FreezerStatus, string> = {
  ok: '',
  'use-soon': 'Use soon',
  past: 'Past 3 months',
  'used-up': 'Used up',
};

function shortDate(date: string): string {
  return fromIsoDate(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function Row({ item }: { item: FreezerItem }) {
  const { saveFreezerItem, removeFreezerItem } = usePlanner();
  const status = freezerStatus(item, today());
  const flagged = status === 'use-soon' || status === 'past';

  const remove = () =>
    Alert.alert('Remove from freezer?', item.name, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: () => removeFreezerItem(item.id).catch(() => {}),
      },
    ]);

  return (
    <View className="min-h-16 flex-row items-center gap-3 border-b border-border py-3">
      <View className="flex-1 gap-0.5" accessible>
        <AppText variant="label" size="lg">
          {item.name}
        </AppText>
        <AppText variant="caption" size="sm">
          {item.cubes} {item.cubes === 1 ? 'cube' : 'cubes'} · frozen {shortDate(item.frozenOn)} ·
          use by {shortDate(bestBefore(item))}
        </AppText>
        {statusText[status] ? (
          <AppText
            variant="caption"
            size="sm"
            color={flagged ? 'danger' : 'muted'}
            className={cn(flagged && 'font-bold')}
          >
            {statusText[status]}
          </AppText>
        ) : null}
      </View>
      {item.cubes > 0 && status !== 'past' ? (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Use one cube of ${item.name}`}
          onPress={() => saveFreezerItem({ ...item, cubes: item.cubes - 1 }).catch(() => {})}
          hitSlop={4}
          className="min-h-12 items-center justify-center rounded-full bg-surface-muted px-4 active:opacity-70"
        >
          <AppText variant="label" color="primary" className="font-bold">
            Use 1
          </AppText>
        </Pressable>
      ) : (
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Remove ${item.name}`}
          onPress={remove}
          hitSlop={4}
          className="min-h-12 items-center justify-center rounded-full px-4 active:opacity-70"
        >
          <AppText variant="label" color="muted">
            Remove
          </AppText>
        </Pressable>
      )}
    </View>
  );
}

/** What's in the freezer, soonest use-by first. Freezer cubes keep up to 3 months. */
export function FreezerCard() {
  const { freezer } = usePlanner();
  const items = sortFreezer(freezer);

  return (
    <Card className="gap-1">
      <View className="flex-row items-baseline justify-between">
        <AppText variant="heading">Freezer</AppText>
        <AppText variant="caption">{totalCubes(items)} cubes</AppText>
      </View>
      {items.length ? (
        items.map((item) => <Row key={item.id} item={item} />)
      ) : (
        <AppText variant="caption" className="py-2">
          Batch-made purees will show up here, with a reminder to use them within 3 months.
        </AppText>
      )}
      <Button
        variant="secondary"
        label="+ Add to freezer"
        className="mt-3"
        onPress={() => router.push('/planner/freezer-add')}
      />
      <AppText variant="caption" size="sm" className="pt-1">
        Saved on this phone only.
      </AppText>
    </Card>
  );
}
