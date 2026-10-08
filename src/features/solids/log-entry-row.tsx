import { View } from 'react-native';

import { fromIsoDate } from '@/domain/dates';
import type { FoodLogEntry, Reaction } from '@/domain/food-log';
import { allergenLabels } from '@/domain/profile-labels';
import { AppText, cn } from '@/ui';

const reactionText: Record<Reaction, string> = {
  none: 'No reaction',
  mild: 'Mild reaction',
  concerning: 'Concerning reaction',
};

function formatShort(date: string): string {
  return fromIsoDate(date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
}

export type LogEntryRowProps = {
  entry: FoodLogEntry;
  /** Optional trailing control (e.g. a delete button). */
  action?: React.ReactNode;
};

/** One logged food: name, date, allergen, first-time and reaction labels. */
export function LogEntryRow({ entry, action }: LogEntryRowProps) {
  const flagged = entry.reaction !== 'none';
  const details = [
    formatShort(entry.date),
    entry.isNew ? 'First time' : null,
    entry.allergen ? allergenLabels[entry.allergen] : null,
  ].filter(Boolean);

  return (
    <View className="min-h-16 flex-row items-center gap-3 border-b border-border py-3">
      <View className="flex-1 gap-0.5" accessible>
        <AppText variant="label" size="lg">
          {entry.food}
        </AppText>
        <AppText variant="caption" size="sm">
          {details.join(' · ')}
        </AppText>
        <AppText
          variant="caption"
          size="sm"
          color={flagged ? 'danger' : 'muted'}
          className={cn(flagged && 'font-bold')}
        >
          {reactionText[entry.reaction]}
          {entry.notes ? ` · ${entry.notes}` : ''}
        </AppText>
      </View>
      {action}
    </View>
  );
}
