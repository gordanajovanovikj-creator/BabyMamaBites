import { router } from 'expo-router';
import { Pressable, View } from 'react-native';

import { articleDisclaimerNote } from '@/content/copy';
import { splitReviewMarker } from '@/content/schemas';
import { AppText } from '@/ui';

export type HealthDisclaimerNoteProps = {
  /** Who still needs to review this content, e.g. "pediatrician". Shows a draft line when set. */
  draftReviewer?: string;
  /**
   * Leave out the general disclaimer text (keeping the draft line and the link) when the
   * page already ends with a more specific safety notice, so it never shows two.
   */
  short?: boolean;
};

/**
 * Short italic disclaimer at the bottom of health-related pages, with a link to
 * the full text. For unreviewed content it also says it's a draft.
 */
export function HealthDisclaimerNote({ draftReviewer, short = false }: HealthDisclaimerNoteProps) {
  return (
    <View className="gap-2 border-t border-border pt-4">
      {draftReviewer ? (
        <AppText variant="caption" size="sm" className="italic">
          <AppText variant="caption" size="sm" className="font-bold italic">
            Draft:{' '}
          </AppText>
          Summarized from official US guidance and not yet reviewed by a {draftReviewer}.
        </AppText>
      ) : null}
      {short ? null : (
        <AppText variant="caption" size="sm" className="italic">
          <AppText variant="caption" size="sm" className="font-bold italic">
            {articleDisclaimerNote.title}:{' '}
          </AppText>
          {splitReviewMarker(articleDisclaimerNote.body).text}
        </AppText>
      )}
      <Pressable
        accessibilityRole="link"
        accessibilityLabel="Read the full medical disclaimer"
        onPress={() => router.push('/disclaimer')}
        hitSlop={8}
        className="min-h-11 justify-center self-start active:opacity-60"
      >
        <AppText variant="label" size="sm" color="primary" className="font-bold">
          Read the full disclaimer ›
        </AppText>
      </Pressable>
    </View>
  );
}
