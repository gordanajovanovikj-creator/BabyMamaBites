import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, Button, Screen } from '@/ui';

export const ONBOARDING_STEPS = 4;

export type StepScreenProps = {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  continueLabel?: string;
  canContinue: boolean;
  onContinue(): void;
  /** Optional quiet secondary action, e.g. "Skip for now". */
  secondary?: { label: string; onPress(): void };
};

/** Shared layout for each onboarding question: progress, question, answers, continue. */
export function StepScreen({
  step,
  title,
  subtitle,
  children,
  continueLabel = 'Continue',
  canContinue,
  onContinue,
  secondary,
}: StepScreenProps) {
  return (
    <Screen>
      <View
        className="flex-row gap-2"
        accessible
        accessibilityLabel={`Step ${step} of ${ONBOARDING_STEPS}`}
      >
        {Array.from({ length: ONBOARDING_STEPS }, (_, i) => (
          <View
            key={i}
            className={
              i < step
                ? 'h-1.5 flex-1 rounded-full bg-primary'
                : 'h-1.5 flex-1 rounded-full bg-border'
            }
          />
        ))}
      </View>
      <View className="gap-2 pt-2">
        <AppText variant="title">{title}</AppText>
        {subtitle ? <AppText variant="caption">{subtitle}</AppText> : null}
      </View>
      <View className="gap-3">{children}</View>
      <View className="gap-2 pt-2">
        <Button label={continueLabel} disabled={!canContinue} onPress={onContinue} />
        {secondary ? (
          <Button label={secondary.label} variant="quiet" onPress={secondary.onPress} />
        ) : null}
      </View>
    </Screen>
  );
}
