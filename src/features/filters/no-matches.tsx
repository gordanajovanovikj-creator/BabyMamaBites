import { View } from 'react-native';

import { AppText, Button } from '@/ui';

/** Shown when a search or the filters leave nothing, with a way back to everything. */
export function NoMatches({ query, onReset }: { query: string; onReset(): void }) {
  const q = query.trim();
  return (
    <View className="gap-2 px-5 py-6">
      <AppText variant="heading" className="text-center">
        {q ? `Nothing matches “${q}”` : 'Nothing matches these filters'}
      </AppText>
      <AppText variant="caption" className="text-center">
        Try a simpler word or fewer filters.
      </AppText>
      <Button label="Clear search and filters" variant="quiet" onPress={onReset} />
    </View>
  );
}
