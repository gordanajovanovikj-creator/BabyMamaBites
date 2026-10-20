import { router } from 'expo-router';
import { View } from 'react-native';

import { safetyNotice } from '@/content/copy';
import type { SafetyNoticeId } from '@/domain/safety-notices';
import { AppText, Button, Card, cn } from '@/ui';

import { HelplineButtons } from './helpline-buttons';

/** Notices about emergencies: red, with a one-tap 911 button. */
const urgent: SafetyNoticeId[] = ['choking-emergency', 'allergy-safety'];

/**
 * A safety notice from src/content/copy/safety-notices.json: emergencies as one red card with
 * the 911 button inside, everything else as pale fine print (text only, no title).
 */
export function SafetyNotice({ id, className }: { id: SafetyNoticeId; className?: string }) {
  const block = safetyNotice(id);
  const body = block.body;
  if (!urgent.includes(id)) {
    // Disclaimers read as pale fine print, set apart from the page's actual content.
    return (
      <View className={cn('gap-1', className)}>
        <AppText variant="caption" size="sm">
          {body}
        </AppText>
      </View>
    );
  }
  // One red card with its call button inside, like the urgent sections of an article.
  return (
    <Card tone="danger" className={cn('gap-3', className)} accessibilityRole="alert">
      <AppText variant="heading" size="2xl" color="danger">
        {`⚠️ ${block.title}`}
      </AppText>
      <AppText color="danger">{body}</AppText>
      <HelplineButtons lines={['911']} />
      <Button
        label="Emergency & resources"
        variant="quiet"
        onPress={() => router.push('/emergency')}
      />
    </Card>
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
