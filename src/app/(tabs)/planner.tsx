import { ComingSoon } from '@/features/shared/coming-soon';

export default function PlannerScreen() {
  return (
    <ComingSoon
      title="Planner"
      intro="Plan the week, and make a little prep go a long way."
      upcoming={[
        'Weekly plan for baby, mom and family meals',
        'Make-ahead baby food: a few hours of prep can stock your freezer for weeks',
        'Freezer inventory',
      ]}
    />
  );
}
