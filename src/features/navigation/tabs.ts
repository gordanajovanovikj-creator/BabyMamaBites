/** Single source of truth for the bottom tabs, shared by the native and web tab bars. */
export const appTabs = [
  { name: 'index', label: 'Today', sf: 'sun.max', sfSelected: 'sun.max.fill', md: 'wb_sunny' },
  {
    name: 'recipes',
    label: 'Food',
    sf: 'fork.knife',
    sfSelected: 'fork.knife',
    md: 'restaurant',
  },
  { name: 'baby', label: 'Baby', sf: 'heart', sfSelected: 'heart.fill', md: 'child_care' },
  {
    name: 'planner',
    label: 'Planner',
    sf: 'calendar',
    sfSelected: 'calendar',
    md: 'calendar_month',
  },
  { name: 'ask', label: 'Ask', sf: 'bubble.left', sfSelected: 'bubble.left.fill', md: 'chat' },
] as const;
