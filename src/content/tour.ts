/**
 * The app tour: a quick look at what's in each tab, shown once after setup and any time
 * from Settings. `tab` names the bottom tab a step is about (see features/navigation/tabs).
 */
export type TourStep = {
  id: string;
  /** SF Symbol (iOS) with an emoji fallback for Android and web. */
  icon: string;
  emoji: string;
  title: string;
  body: string;
  /** A small "how to get there" hint under the text. */
  tip?: string;
  tab?: 'index' | 'mom' | 'baby' | 'insights' | 'ask';
};

export const tourSteps: TourStep[] = [
  {
    id: 'welcome',
    icon: 'hand.wave.fill',
    emoji: '👋',
    title: 'Here’s your way around',
    body: 'Everything lives in five tabs along the bottom of the screen. Here’s a quick look at each one.',
  },
  {
    id: 'today',
    icon: 'sun.max.fill',
    emoji: '☀️',
    title: 'Today',
    body: 'Your day at a glance: your baby’s age, this week’s focus, upcoming plans, your shopping list and foods to try.',
    tip: 'Tap the date for your calendar, and the round letter for settings and reminders.',
    tab: 'index',
  },
  {
    id: 'mom',
    icon: 'person.crop.circle.fill',
    emoji: '🍲',
    title: 'Mom',
    body: 'Recipes to keep you nourished, matched to the time you have. Search, filter, and tap the heart to save favorites.',
    tab: 'mom',
  },
  {
    id: 'baby',
    icon: 'heart.fill',
    emoji: '🥕',
    title: 'Baby',
    body: 'Baby recipes and a first-foods guide, plus the Plan tab: the week-by-week solids plan, meal planner, food log and allergen tracker.',
    tip: 'Log each new food from the Plan tab.',
    tab: 'baby',
  },
  {
    id: 'insights',
    icon: 'book.fill',
    emoji: '📖',
    title: 'Insights',
    body: 'Short articles and tips for you and your baby, chosen by age. Search any topic.',
    tab: 'insights',
  },
  {
    id: 'ask',
    icon: 'bubble.left.fill',
    emoji: '💬',
    title: 'Ask',
    body: 'Ask for meal ideas, textures or freezing tips. Suggested dishes can go straight to your shopping list.',
    tip: 'For health worries, call your pediatrician or doctor.',
    tab: 'ask',
  },
  {
    id: 'shopping',
    icon: 'cart.fill',
    emoji: '🛒',
    title: 'Your shopping list',
    body: 'Add a recipe’s ingredients or your whole week’s plan in one tap. The list is sorted by store section.',
    tip: 'Find it on Today. You can see this tour again in Settings.',
  },
];
