import { ComingSoon } from '@/features/shared/coming-soon';

export default function BabyScreen() {
  return (
    <ComingSoon
      title="Baby"
      intro="Starting solids, week by week, at your baby's pace."
      upcoming={[
        'Weekly plan from about 6 months, starting with purées',
        'Texture progression and allergen introduction reminders',
        'A simple log for new foods and any reactions',
        'Choking-hazard guidance by age',
      ]}
    />
  );
}
