/** Words that make a tip about choking or allergies, so it's always shown, never tucked away. */
const SAFETY = /\b(chok\w*|gag\w*|allerg\w*|reaction\w*|anaphyla\w*|epinephrine|hives|swelling)\b/i;

export function isSafetyTip(tip: string): boolean {
  return SAFETY.test(tip);
}

/**
 * Splits tips into safety tips (choking, allergens), shown in full on every visit, and
 * the rest, which go in the swipeable tip carousel. Keeps each group's order.
 */
export function splitTips(tips: readonly string[]): { safety: string[]; other: string[] } {
  return {
    safety: tips.filter(isSafetyTip),
    other: tips.filter((t) => !isSafetyTip(t)),
  };
}
