import { disclaimers } from '@/content/copy';
import { AppText, Notice, Screen } from '@/ui';

export default function AboutScreen() {
  return (
    <Screen>
      <AppText variant="caption">
        Your information stays on this phone. We don&apos;t create accounts or track you.
      </AppText>
      {disclaimers.map((block) => (
        <Notice
          key={block.id}
          title={block.title}
          body={block.body}
          tone={block.id === 'worried' ? 'caution' : 'info'}
        />
      ))}
    </Screen>
  );
}
