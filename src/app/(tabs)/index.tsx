import { router } from 'expo-router';

import { getDisclaimer } from '@/content/copy';
import { AppText, Button, Card, Notice, Screen } from '@/ui';

export default function TodayScreen() {
  const general = getDisclaimer('general');

  return (
    <Screen>
      <AppText variant="display">Hello, mama</AppText>
      <AppText variant="caption">
        Gentle ideas for feeding yourself and your little one, one day at a time.
      </AppText>

      <Card className="gap-3">
        <AppText variant="heading">Let&apos;s get to know you</AppText>
        <AppText>
          A few quick taps about your baby and your kitchen, and we&apos;ll tailor everything to
          you.
        </AppText>
        <Button label="Start (coming next)" disabled />
      </Card>

      {general ? <Notice title={general.title} body={general.body} /> : null}

      <Button label="About & safety" variant="secondary" onPress={() => router.push('/about')} />
    </Screen>
  );
}
