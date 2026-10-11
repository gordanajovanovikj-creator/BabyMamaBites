import { View } from 'react-native';

import { AppText } from '@/ui';

export type QuestionHeaderProps = {
  title: string;
  /** Optional line under the title, e.g. why we ask. */
  subtitle?: string;
  /** Small green line above the title, e.g. "Step 3 of 7". */
  kicker?: string;
};

/** The onboarding question: a large, left-aligned bold title with a quiet line under it. */
export function QuestionHeader({ title, subtitle, kicker }: QuestionHeaderProps) {
  return (
    <View className="gap-2 pt-4">
      {kicker ? (
        <AppText
          variant="label"
          size="sm"
          color="primary"
          className="font-bold uppercase tracking-wider"
        >
          {kicker}
        </AppText>
      ) : null}
      <AppText variant="title" size="3xl" accessibilityRole="header">
        {title}
      </AppText>
      {subtitle ? (
        <AppText variant="body" color="muted">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}
