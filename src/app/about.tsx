import { disclaimers } from '@/content/copy';
import { splitReviewMarker } from '@/content/schemas';
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
          body={splitReviewMarker(block.body).text}
          tone={block.id === 'worried' ? 'caution' : 'info'}
        />
      ))}
    </Screen>
  );
}
