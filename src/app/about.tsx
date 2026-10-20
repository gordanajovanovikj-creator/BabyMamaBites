import { router } from 'expo-router';

import { COMPANY_NAME } from '@/content/contact';
import { disclaimers, safetyNotice } from '@/content/copy';
import { AppText, Button, Notice, Screen } from '@/ui';

export default function AboutScreen() {
  const guidance = safetyNotice('our-guidance');
  return (
    <Screen>
      <AppText variant="caption">
        Your information stays on this phone. We don&apos;t create accounts or track you.
      </AppText>
      <Notice title={guidance.title} body={guidance.body} />
      {disclaimers.map((block) => (
        <Notice
          key={block.id}
          title={block.title}
          body={block.body}
          tone={block.id === 'worried' ? 'caution' : 'info'}
        />
      ))}
      <Button label="Emergency & resources" onPress={() => router.push('/emergency')} />
      <Button
        label="Disclaimers & terms"
        variant="secondary"
        onPress={() => router.push('/disclaimer')}
      />
      <AppText variant="caption" size="sm" className="pt-2 text-center">
        {`Mama & Baby Bites · © ${new Date().getFullYear()} ${COMPANY_NAME}`}
      </AppText>
    </Screen>
  );
}
