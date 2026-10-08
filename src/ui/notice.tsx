import { View } from 'react-native';

import { AppText, type TextColor } from './app-text';
import { cn } from './cn';

type Tone = 'info' | 'caution' | 'urgent';

const toneClasses: Record<Tone, { box: string; text: TextColor }> = {
  info: { box: 'bg-surface-muted', text: 'ink' },
  caution: { box: 'bg-caution-bg', text: 'caution' },
  urgent: { box: 'bg-danger-bg', text: 'danger' },
};

export type NoticeProps = {
  title?: string;
  body: string;
  tone?: Tone;
  className?: string;
};

/** Calm inline banner for disclaimers, safety notes and "talk to a professional" prompts. */
export function Notice({ title, body, tone = 'info', className }: NoticeProps) {
  const t = toneClasses[tone];
  return (
    <View
      accessible
      accessibilityRole={tone === 'urgent' ? 'alert' : undefined}
      className={cn('gap-1 rounded-2xl p-4', t.box, className)}
    >
      {title ? (
        <AppText variant="label" color={t.text}>
          {title}
        </AppText>
      ) : null}
      <AppText variant="body" color={t.text} size="base">
        {body}
      </AppText>
    </View>
  );
}
