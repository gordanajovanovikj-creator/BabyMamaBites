import { router } from 'expo-router';
import { View } from 'react-native';

import { safetyNotice } from '@/content/copy';
import { splitReviewMarker } from '@/content/schemas';
import type { SafetyNoticeId } from '@/domain/safety-notices';
import { Button, Notice } from '@/ui';

import { HelplineButtons } from './helpline-buttons';

/** Notices about emergencies: red, with a one-tap 911 button. */
const urgent: SafetyNoticeId[] = ['choking-emergency', 'allergy-safety'];

/** A safety notice from src/content/copy/safety-notices.json, styled by how urgent it is. */
export function SafetyNotice({ id, className }: { id: SafetyNoticeId; className?: string }) {
  const block = safetyNotice(id);
  const body = splitReviewMarker(block.body).text;
  if (!urgent.includes(id)) {
    return <Notice title={block.title} body={body} className={className} />;
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
