import * as WebBrowser from 'expo-web-browser';
import { Pressable, View } from 'react-native';

import { photoCredits, type PhotoCredit } from '@/content/photo-credits';
import { creditLine, creditsBySource, photoSourceInfo } from '@/domain/photo-credits';
import { AppText, Screen } from '@/ui';

function CreditRow({ credit }: { credit: PhotoCredit }) {
  const line = creditLine(credit);
  const body = (
    <View className="gap-0.5">
      <AppText>{credit.usedOn}</AppText>
      <AppText variant="caption" size="sm" className={credit.url ? 'underline' : undefined}>
        {line}
      </AppText>
    </View>
  );
  if (!credit.url) return <View className="min-h-11 justify-center py-1">{body}</View>;
  const url = credit.url;
  return (
    <Pressable
      accessibilityRole="link"
      accessibilityLabel={`${credit.usedOn}. Photo: ${line}. Opens the photo page.`}
      onPress={() => WebBrowser.openBrowserAsync(url)}
      className="min-h-12 justify-center py-1 active:opacity-60"
    >
      {body}
    </Pressable>
  );
}

/** Photo credits, opened from Settings. Free Magnific images require a visible credit. */
export default function CreditsScreen() {
  return (
    <Screen className="gap-6">
      <View className="gap-2">
        <AppText variant="title" accessibilityRole="header">
          Photo credits
        </AppText>
        <AppText color="muted">
          Thank you to the photographers whose work makes our recipes look so good.
        </AppText>
      </View>
      {creditsBySource(photoCredits).map((group) => {
        const info = photoSourceInfo[group.source];
        return (
          <View key={group.source} className="gap-2">
            <AppText variant="heading">{info.name}</AppText>
            <Pressable
              accessibilityRole="link"
              accessibilityLabel={`${info.note}. Opens ${info.name}.`}
              onPress={() => WebBrowser.openBrowserAsync(info.url)}
              className="min-h-12 justify-center active:opacity-60"
            >
              <AppText color="primary" className="font-bold underline">
                {info.note}
              </AppText>
            </Pressable>
            {group.credits.map((c) => (
              <CreditRow key={c.id} credit={c} />
            ))}
          </View>
        );
      })}
    </Screen>
  );
}
