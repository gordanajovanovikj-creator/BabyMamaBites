import { View } from 'react-native';

import { AppText } from './app-text';
import { cn } from './cn';

type Tone = 'info' | 'caution' | 'urgent';

const toneClasses: Record<Tone, { box: string; text: string }> = {
  info: { box: 'bg-surface-muted', text: 'text-ink' },
  caution: { box: 'bg-caution-bg', text: 'text-caution-ink' },
  urgent: { box: 'bg-danger-bg', text: 'text-danger-ink' },
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
        <AppText variant="label" className={t.text}>
          {title}
        </AppText>
      ) : null}
      <AppText variant="body" className={cn('text-base', t.text)}>
        {body}
      </AppText>
    </View>
  );
}
