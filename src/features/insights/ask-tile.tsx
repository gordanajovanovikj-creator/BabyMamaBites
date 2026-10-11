import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { LIBRARY_TILE_WIDTH } from '@/features/library/library-tile';
import { AppText } from '@/ui';

/** First tile in the row: a quick way into Ask for a meal idea, shaped like the photo cards. */
export function AskTile() {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Meal idea from what's in your fridge. Opens Ask."
      onPress={() =>
        router.navigate({
          pathname: '/ask',
          params: { q: 'What can I make with what I have? I have ' },
        })
      }
      style={{ width: LIBRARY_TILE_WIDTH }}
      className="gap-2 active:opacity-80"
    >
      <View
        className="items-center justify-center rounded-xl bg-sky"
        style={{ height: LIBRARY_TILE_WIDTH }}
      >
        <View className="h-16 w-16 items-center justify-center rounded-full bg-primary">
          <AppText variant="title" color="on-primary" className="leading-9">
            +
          </AppText>
        </View>
      </View>
      <View className="gap-0.5 pr-1">
        <AppText variant="heading" size="lg" className="leading-6">
          Meal idea from your fridge
        </AppText>
        <AppText variant="caption" size="sm">
          Ask · Quick idea
        </AppText>
      </View>
    </Pressable>
  );
}
