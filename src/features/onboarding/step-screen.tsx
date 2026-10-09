import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText, Button, Screen } from '@/ui';

import { QuestionBubble } from './question-bubble';

export const ONBOARDING_STEPS = 7;

export type StepScreenProps = {
  step: number;
  title: string;
  subtitle?: string;
  children: ReactNode;
  /** Short line just above the button, e.g. "Mila is 6 months old". */
  footnote?: string;
  continueLabel?: string;
  canContinue: boolean;
  onContinue(): void;
  /** Optional quiet secondary action, e.g. "Skip for now". */
  secondary?: { label: string; onPress(): void };
};

/** Shared layout for each onboarding question: progress, question bubble, answers, continue. */
export function StepScreen({
  step,
  title,
  subtitle,
  children,
  footnote,
  continueLabel = 'Continue',
  canContinue,
  onContinue,
  secondary,
}: StepScreenProps) {
  return (
    <Screen className="flex-grow">
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
      <QuestionBubble title={title} subtitle={subtitle} />
      <View className="gap-3">{children}</View>
      {/* Pushes the buttons to the bottom on short screens. */}
      <View className="flex-1" />
      <View className="gap-2 pt-2">
        {footnote ? (
          <AppText variant="label" size="lg" className="pb-1 text-center">
            {footnote}
          </AppText>
        ) : null}
        <Button label={continueLabel} disabled={!canContinue} onPress={onContinue} />
        {secondary ? (
          <Button label={secondary.label} variant="quiet" onPress={secondary.onPress} />
        ) : null}
      </View>
    </Screen>
  );
}
