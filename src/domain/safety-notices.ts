/** The safety notices in src/content/copy/safety-notices.json that pages can show. */
export type SafetyNoticeId =
  | 'feeding-safety'
  | 'age-guidelines'
  | 'food-safety'
  | 'family-nutrition'
  | 'maternal-health'
  | 'allergy-safety'
  | 'choking-emergency'
  | 'dental-care'
  | 'feeding-behavior'
  | 'milk-juice'
  | 'development';

export type NoticePlacement = { top: SafetyNoticeId[]; bottom: SafetyNoticeId[] };

/** Shown before the article body: things a worried parent must see first. */
const topById: Record<string, SafetyNoticeId[]> = {
  allergens: ['allergy-safety'],
  'allergic-reaction-signs': ['allergy-safety'],
  'gagging-vs-choking': ['choking-emergency'],
  'solids-choking': ['choking-emergency'],
  'cows-milk': ['milk-juice'],
  'cups-and-drinks': ['milk-juice'],
};

/** Shown after the article body: who to ask for advice that fits your child. */
const bottomById: Record<string, SafetyNoticeId[]> = {
  allergens: ['allergy-safety'],
  'allergic-reaction-signs': ['allergy-safety'],
  'brushing-baby-teeth': ['dental-care'],
  'toddler-picky-phases': ['feeding-behavior'],
  'food-refusal': ['feeding-behavior'],
  'purees-vs-finger-foods': ['feeding-behavior'],
  'hunger-cues': ['feeding-behavior'],
  'spoon-skills': ['feeding-behavior'],
  'learning-to-chew': ['development'],
  'first-foods': ['development'],
  ready: ['age-guidelines'],
  'solids-purees-first': ['age-guidelines'],
  'food-prep-textures': ['food-safety'],
  'foods-to-avoid': ['food-safety'],
};

/** Every article and tip in these categories is about mom's own health. */
const bottomByCategory: Record<string, SafetyNoticeId[]> = {
  'your-wellbeing': ['maternal-health'],
  'nourishing-you': ['maternal-health'],
};

/** Which safety notices an article or tip shows above and below its content. */
export function noticesFor(item: { id: string; category: string }): NoticePlacement {
  return {
    top: topById[item.id] ?? [],
    bottom: [...(bottomById[item.id] ?? []), ...(bottomByCategory[item.category] ?? [])],
  };
}
