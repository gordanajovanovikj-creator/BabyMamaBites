import type {
  Allergen,
  CookingTime,
  Diet,
  FeedingStatus,
  HelpTopic,
  SolidsApproach,
} from './profile';

export const feedingLabels: Record<FeedingStatus, string> = {
  breast: 'Breastfeeding',
  formula: 'Formula feeding',
  mixed: 'A bit of both',
  pumping: 'Pumping',
  'prefer-not-to-say': "I'd rather not say",
};

export const allergenLabels: Record<Allergen, string> = {
  milk: 'Milk',
  egg: 'Egg',
  peanut: 'Peanut',
  'tree-nuts': 'Tree nuts',
  sesame: 'Sesame',
  soy: 'Soy',
  wheat: 'Wheat',
  fish: 'Fish',
  shellfish: 'Shellfish',
};

export const dietLabels: Record<Diet, string> = {
  vegetarian: 'Vegetarian',
  vegan: 'Vegan',
  pescatarian: 'Pescatarian',
  halal: 'Halal',
  kosher: 'Kosher',
  'gluten-free': 'Gluten-free',
};

export const cookingTimeLabels: Record<CookingTime, { title: string; detail: string }> = {
  minimal: { title: 'Barely any', detail: 'About 5 minutes, often one-handed' },
  short: { title: 'A little', detail: 'Around 15 minutes' },
  relaxed: { title: 'I have time', detail: '30 minutes or more, or batch cooking' },
  flexible: { title: "I'm flexible", detail: 'It changes from day to day' },
};

export const helpTopicLabels: Record<HelpTopic, string> = {
  'getting-started': 'Knowing how to start',
  'introducing-foods': 'Introducing foods',
  nutrition: 'Learning about nutrition',
  'baby-meal-planning': 'Meal planning for baby',
  'mom-food': 'Nourishing food for mom',
  'family-recipes': 'Family recipe ideas',
};

export const solidsApproachLabels: Record<SolidsApproach, string> = {
  'baby-led': 'Baby-led weaning',
  spoon: 'Spoon feeding',
  both: 'A bit of both',
  'not-sure': "I'm not sure yet",
};
