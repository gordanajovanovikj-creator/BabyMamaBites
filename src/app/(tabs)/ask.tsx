import { ComingSoon } from '@/features/shared/coming-soon';

export default function AskScreen() {
  return (
    <ComingSoon
      title="Ask"
      intro="Tips and meal ideas from what you already have in the kitchen."
      upcoming={[
        'Meal ideas from the ingredients you have right now',
        'Gentle tips, with a nudge to a professional whenever something needs one',
      ]}
    />
  );
}
