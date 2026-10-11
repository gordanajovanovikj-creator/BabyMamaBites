import type { ReactNode } from 'react';
import { View } from 'react-native';

import { AppText } from '@/ui';

export type DetailHeaderProps = {
  /** Small uppercase line above the title (age, kind, read time). */
  kicker: string;
  title: string;
  summary?: string;
  /** Extra lines under the title, e.g. recipe timings or tags. */
  children?: ReactNode;
};

/** Title block under the photo on recipe, article, tip and guide pages. */
export function DetailHeader({ kicker, title, summary, children }: DetailHeaderProps) {
  return (
    <View className="gap-2 px-5 pt-6">
      <AppText
        variant="label"
        size="xs"
        color="on-accent"
        className="font-bold uppercase tracking-wider"
      >
        {kicker}
      </AppText>
      <AppText variant="title">{title}</AppText>
      {summary ? <AppText color="muted">{summary}</AppText> : null}
      {children}
    </View>
  );
}
