/** Single source of truth for the bottom tabs, shared by the native and web tab bars. */
export const appTabs = [
  { name: 'index', label: 'Today', sf: 'sun.max', sfSelected: 'sun.max.fill', md: 'wb_sunny' },
  {
    name: 'mom',
    label: 'Mom',
    sf: 'person.crop.circle',
    sfSelected: 'person.crop.circle.fill',
    md: 'face',
  },
  { name: 'baby', label: 'Baby', sf: 'heart', sfSelected: 'heart.fill', md: 'child_care' },
  {
    name: 'insights',
    label: 'Insights',
    sf: 'book',
    sfSelected: 'book.fill',
    md: 'menu_book',
  },
  { name: 'ask', label: 'Ask', sf: 'bubble.left', sfSelected: 'bubble.left.fill', md: 'chat' },
] as const;
