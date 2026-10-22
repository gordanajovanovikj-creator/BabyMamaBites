import { router } from 'expo-router';
import { useEffect, useRef, useState } from 'react';
import {
  AccessibilityInfo,
  Pressable,
  ScrollView,
  useWindowDimensions,
  View,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { tourSteps, type TourStep } from '@/content/tour';
import { useSettingsStore } from '@/data/stores-context';
import { today } from '@/domain/dates';
import { appTabs } from '@/features/navigation/tabs';
import { AppText, Button, cn, IconBadge, SymbolIcon } from '@/ui';

/** A small copy of the tab bar with the step's tab picked out, so it's easy to find. */
function TabBarHint({ tab }: { tab: NonNullable<TourStep['tab']> }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="flex-row justify-between rounded-full border border-border bg-surface px-2 py-2"
    >
      {appTabs.map((t) => {
        const on = t.name === tab;
        return (
          <View
            key={t.name}
            className={cn(
              'flex-1 items-center gap-0.5 rounded-full py-1.5',
              on ? 'bg-accent' : 'opacity-40',
            )}
          >
            <SymbolIcon
              icon={on ? t.sfSelected : t.sf}
              emoji={tourSteps.find((s) => s.tab === t.name)?.emoji ?? '•'}
              size={20}
            />
            <AppText variant="label" size="xs" color={on ? 'primary' : 'muted'}>
              {t.label}
            </AppText>
          </View>
        );
      })}
    </View>
  );
}

function Step({ step, width, height }: { step: TourStep; width: number; height: number }) {
  return (
    <View style={{ width, minHeight: height }} className="justify-center gap-6 px-6">
      <View className="items-center">
        <IconBadge icon={step.icon} emoji={step.emoji} size={112} />
      </View>
      <View className="gap-3">
        <AppText variant="title" className="text-center">
          {step.title}
        </AppText>
        <AppText className="text-center">{step.body}</AppText>
      </View>
      {step.tab ? <TabBarHint tab={step.tab} /> : null}
      {step.tip ? (
        <View className="rounded-2xl bg-surface-muted p-4">
          <AppText variant="caption" className="text-center">
            {step.tip}
          </AppText>
        </View>
      ) : null}
    </View>
  );
}

/** A quick look at what's in each tab. Opens once after setup, and from Settings. */
export default function TourScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const store = useSettingsStore();
  const pager = useRef<ScrollView>(null);
  const [index, setIndex] = useState(0);
  const [pageHeight, setPageHeight] = useState(0);
  const last = index === tourSteps.length - 1;

  // Seen once it opens, so it doesn't come back however it's closed.
  useEffect(() => {
    store.saveTourSeen(today()).catch(() => {});
  }, [store]);

  const close = () => (router.canGoBack() ? router.back() : router.replace('/'));

  const goTo = (i: number) => {
    setIndex(i);
    pager.current?.scrollTo({ x: i * width, animated: true });
    AccessibilityInfo.announceForAccessibility(
      `${tourSteps[i].title}. Step ${i + 1} of ${tourSteps.length}.`,
    );
  };

  const onSwipe = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const i = Math.round(e.nativeEvent.contentOffset.x / width);
    if (i !== index && i >= 0 && i < tourSteps.length) setIndex(i);
  };

  return (
    <View className="flex-1 bg-canvas" style={{ paddingTop: insets.top + 8 }}>
      <View className="h-12 flex-row items-center justify-end px-4">
        {last ? null : (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Skip the tour"
            onPress={close}
            hitSlop={8}
            className="min-h-12 min-w-12 items-center justify-center px-3 active:opacity-70"
          >
            <AppText variant="label" size="lg" color="primary">
              Skip
            </AppText>
          </Pressable>
        )}
      </View>

      <ScrollView
        ref={pager}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onSwipe}
        onScroll={onSwipe}
        scrollEventThrottle={64}
        className="flex-1"
        onLayout={(e) => setPageHeight(e.nativeEvent.layout.height)}
      >
        {tourSteps.map((s) => (
          <Step key={s.id} step={s} width={width} height={pageHeight} />
        ))}
      </ScrollView>

      <View className="gap-5 px-6" style={{ paddingBottom: insets.bottom + 20 }}>
        <View
          className="flex-row justify-center gap-2"
          accessibilityLabel={`Step ${index + 1} of ${tourSteps.length}`}
        >
          {tourSteps.map((s, i) => (
            <View
              key={s.id}
              className={cn('h-2 rounded-full', i === index ? 'w-6 bg-primary' : 'w-2 bg-border')}
            />
          ))}
        </View>
        <View className="flex-row gap-3">
          {index > 0 ? (
            <View className="flex-1">
              <Button label="Back" variant="secondary" onPress={() => goTo(index - 1)} />
            </View>
          ) : null}
          <View className="flex-1">
            <Button
              label={last ? 'Let’s go' : 'Next'}
              onPress={() => (last ? close() : goTo(index + 1))}
            />
          </View>
        </View>
      </View>
    </View>
  );
}
