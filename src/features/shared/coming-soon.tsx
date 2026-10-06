import { AppText, Card, Screen } from '@/ui';

export type ComingSoonProps = {
  title: string;
  intro: string;
  upcoming: string[];
};

/** Temporary tab content while slices are being built. */
export function ComingSoon({ title, intro, upcoming }: ComingSoonProps) {
  return (
    <Screen>
      <AppText variant="display">{title}</AppText>
      <AppText variant="caption">{intro}</AppText>
      <Card className="gap-2">
        <AppText variant="label">Coming soon</AppText>
        {upcoming.map((item) => (
          <AppText key={item}>• {item}</AppText>
        ))}
      </Card>
    </Screen>
  );
}
