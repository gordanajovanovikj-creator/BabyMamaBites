import { router } from 'expo-router';
import { View } from 'react-native';

import { safetyNotice } from '@/content/copy';
import { splitReviewMarker } from '@/content/schemas';
import type { SafetyNoticeId } from '@/domain/safety-notices';
import { AppText, Button, cn, Notice } from '@/ui';

import { HelplineButtons } from './helpline-buttons';

/** Notices about emergencies: red, with a one-tap 911 button. */
const urgent: SafetyNoticeId[] = ['choking-emergency', 'allergy-safety'];

/**
 * A safety notice from src/content/copy/safety-notices.json: emergencies in a red card with
 * a 911 button, everything else as pale fine print.
 */
export function SafetyNotice({
  id,
  className,
  hideTitle = false,
}: {
  id: SafetyNoticeId;
  className?: string;
  /** Show only the text, without the notice's title. */
  hideTitle?: boolean;
}) {
  const block = safetyNotice(id);
  const body = splitReviewMarker(block.body).text;
  if (!urgent.includes(id)) {
    // Disclaimers read as pale fine print, set apart from the page's actual content.
    return (
      <View className={cn('gap-1', className)}>
        {hideTitle ? null : (
          <AppText variant="caption" size="sm" className="font-semibold">
            {block.title}
          </AppText>
        )}
        <AppText variant="caption" size="sm">
          {body}
        </AppText>
      </View>
    );
  }
  return (
    <View className={className}>
      <Notice tone="urgent" title={`⚠️ ${block.title}`} body={body} />
      <HelplineButtons lines={['911']} />
      <Button
        label="Emergency & resources"
        variant="quiet"
        onPress={() => router.push('/emergency')}
      />
    </View>
  );
}

/** Several notices stacked, e.g. the ones `noticesFor` picks for an article. */
export function SafetyNotices({ ids }: { ids: SafetyNoticeId[] }) {
  if (!ids.length) return null;
  return (
    <View className="gap-3">
      {ids.map((id) => (
        <SafetyNotice key={id} id={id} />
      ))}
    </View>
  );
}
