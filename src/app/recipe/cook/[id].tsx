import { useKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { getRecipe } from '@/content/recipes';
import { AppText, Button, haptics, RoundIconButton, Screen } from '@/ui';

/**
 * Cook mode: one step at a time in large text, with the screen kept awake so it
 * doesn't lock while hands are busy. Big buttons sit at the bottom, in thumb reach.
 */
export default function CookModeScreen() {
  // If the wake lock never turned on (Low Power Mode, browsers), leaving must not throw.
  useKeepAwake(undefined, { suppressDeactivateWarnings: true });
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = getRecipe(id);
  const [step, setStep] = useState(0);
  const insets = useSafeAreaInsets();

  if (!recipe) {
    return (
      <Screen>
        <AppText variant="title">Recipe not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const total = recipe.steps.length;
  const last = step === total - 1;

  return (
    <Screen
      footer={
        <>
          <Button
            label="Previous"
            variant="secondary"
            className="flex-1"
            disabled={step === 0}
            onPress={() => setStep((s) => Math.max(0, s - 1))}
          />
          <Button
            label={last ? 'Done' : 'Next step'}
            className="flex-1"
            onPress={() => {
              if (last) {
                haptics.success();
                router.back();
              } else {
                haptics.tap();
                setStep((s) => s + 1);
              }
            }}
          />
        </>
      }
    >
      <View className="flex-row items-start gap-3" style={{ paddingTop: insets.top }}>
        <View className="flex-1 gap-1">
          <AppText variant="caption" size="sm" className="font-bold uppercase tracking-wider">
            {recipe.title}
          </AppText>
          <AppText variant="label" color="primary" accessibilityRole="header">
            {`Step ${step + 1} of ${total}`}
          </AppText>
        </View>
        <RoundIconButton
          symbol="xmark"
          fallback="✕"
          accessibilityLabel="Close cook mode"
          onPress={() => router.back()}
        />
      </View>

      <View
        className="flex-row gap-1.5"
        importantForAccessibility="no-hide-descendants"
        accessibilityElementsHidden
      >
        {recipe.steps.map((_, i) => (
          <View
            key={i}
            className={
              i <= step
                ? 'h-1.5 flex-1 rounded-full bg-primary'
                : 'h-1.5 flex-1 rounded-full bg-surface-muted'
            }
          />
        ))}
      </View>

      <AppText
        size="3xl"
        className="pt-4 font-semibold leading-tight"
        accessibilityLiveRegion="polite"
      >
        {recipe.steps[step]}
      </AppText>

      <AppText variant="caption" size="sm" className="pt-6">
        The screen stays on while cook mode is open.
      </AppText>
    </Screen>
  );
}
