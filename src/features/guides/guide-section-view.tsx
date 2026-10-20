import type { GuideSection } from '@/content/monthly-guides';
import { AppText, BulletList, Card, Notice } from '@/ui';

/** One section of a monthly guide: text, bullets and a "guidance differs" note (sources close the page). */
export function GuideSectionView({ section }: { section: GuideSection }) {
  const urgent = section.id === 'when-to-call';

  return (
    <Card tone={urgent ? 'muted' : 'surface'} className="gap-3">
      <AppText variant="heading" color={urgent ? 'danger' : 'ink'}>
        {section.title}
      </AppText>
      {section.paragraphs.map((p) => (
        <AppText key={p}>{p}</AppText>
      ))}
      {section.bullets.length ? (
        <BulletList items={section.bullets} color={urgent ? 'danger' : undefined} />
      ) : null}
      {section.note ? <Notice title="Where guidance differs" body={section.note} /> : null}
    </Card>
  );
}
