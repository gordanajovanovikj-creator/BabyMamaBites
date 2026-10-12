import { Image, type ImageSource } from 'expo-image';
import { Pressable, View } from 'react-native';

import { shadows } from '@/theme/colors';
import { AppText } from '@/ui';

export type PhotoLinkCardProps = {
  photo: ImageSource;
  title: string;
  body: string;
  /** Link text under the body. */
  cta?: string;
  /** Read by VoiceOver, e.g. "Make-ahead baby food. Opens the guide." */
  accessibilityLabel: string;
  onPress(): void;
};

/** Wide photo with a title, a line of text and a link underneath; opens a guide. */
export function PhotoLinkCard({
  photo,
  title,
  body,
  cta = 'See how',
  accessibilityLabel,
  onPress,
}: PhotoLinkCardProps) {
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
      onPress={onPress}
      className="gap-3 active:opacity-90"
    >
      <View className="rounded-xl bg-surface" style={{ height: 220, boxShadow: shadows.card }}>
        <Image
          source={photo}
          contentFit="cover"
          transition={150}
          accessible={false}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12 }}
        />
      </View>
      <View className="gap-1">
        <AppText variant="heading" size="xl">
          {title}
        </AppText>
        <AppText color="muted">{body}</AppText>
        <AppText variant="label" color="primary" className="pt-1 font-bold">
          {cta} ›
        </AppText>
      </View>
    </Pressable>
  );
}
