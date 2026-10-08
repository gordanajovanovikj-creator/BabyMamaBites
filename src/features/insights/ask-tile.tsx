import { router } from 'expo-router';
import { View } from 'react-native';

import { AppText, Card } from '@/ui';

import { TILE_WIDTH } from './insight-tile';

/** First tile in the row: a quick way into Ask for a meal idea. */
export function AskTile() {
  return (
    <Card
      onPress={() => router.navigate('/ask')}
      accessibilityLabel="Meal idea from what's in your fridge. Opens Ask."
      className="min-h-56 items-center justify-between gap-3 py-6"
      style={{ width: TILE_WIDTH }}
    >
      <AppText variant="heading" size="lg" className="text-center leading-6">
        Meal idea from your fridge
      </AppText>
      <View className="h-14 w-14 items-center justify-center rounded-full bg-primary">
        <AppText variant="title" color="on-primary" className="leading-9">
          +
        </AppText>
      </View>
    </Card>
  );
}
