import { View } from 'react-native';

import { AppText } from '@/ui';

export type QuestionBubbleProps = {
  title: string;
  /** Optional line under the bubble, e.g. why we ask. */
  subtitle?: string;
};

/** The onboarding question, centered in a soft sage speech bubble. */
export function QuestionBubble({ title, subtitle }: QuestionBubbleProps) {
  return (
    <View className="gap-4 pt-2">
      <View className="items-center">
        <View className="w-full rounded-3xl bg-sky px-6 py-5">
          <AppText
            variant="title"
            size="2xl"
            color="on-sky"
            className="text-center"
            accessibilityRole="header"
          >
            {title}
          </AppText>
        </View>
        {/* Speech-bubble tail. */}
        <View className="-mt-2.5 h-5 w-5 rotate-45 rounded-sm bg-sky" />
      </View>
      {subtitle ? (
        <AppText variant="body" color="muted" className="text-center">
          {subtitle}
        </AppText>
      ) : null}
    </View>
  );
}
