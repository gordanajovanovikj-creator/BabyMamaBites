import type { AndroidSymbol, SFSymbol, SymbolViewProps } from 'expo-symbols';

/**
 * The Material Symbol shown on Android for each SF Symbol the app uses. Icons missing here
 * show their emoji or text fallback on Android instead.
 */
const material: Record<string, AndroidSymbol> = {
  'alarm.fill': 'alarm',
  'basket.fill': 'shopping_basket',
  'birthday.cake.fill': 'cake',
  'bolt.heart.fill': 'ecg_heart',
  book: 'menu_book',
  'book.fill': 'menu_book',
  'books.vertical.fill': 'menu_book',
  'bubble.left': 'chat_bubble',
  'bubble.left.fill': 'chat_bubble',
  'bubble.left.and.bubble.right.fill': 'forum',
  calendar: 'calendar_today',
  'calendar.badge.clock': 'event_upcoming',
  'carrot.fill': 'nutrition',
  'cart.fill': 'shopping_cart',
  'chair.fill': 'chair',
  checklist: 'checklist',
  'checkmark.circle.fill': 'check_circle',
  'chevron.left': 'chevron_left',
  'chevron.right': 'chevron_right',
  'circle.grid.2x2.fill': 'grid_view',
  'circle.grid.3x3.fill': 'apps',
  'cross.case.fill': 'medical_services',
  'cup.and.saucer.fill': 'coffee',
  'drop.fill': 'water_drop',
  'dumbbell.fill': 'fitness_center',
  'exclamationmark.triangle.fill': 'warning',
  'face.smiling': 'sentiment_satisfied',
  'face.smiling.fill': 'sentiment_satisfied',
  'figure.2.and.child.holdinghands': 'family_restroom',
  'figure.and.child.holdinghands': 'escalator_warning',
  'figure.seated.side': 'airline_seat_recline_normal',
  'fish.fill': 'set_meal',
  'flame.fill': 'local_fire_department',
  'fork.knife': 'restaurant',
  'fork.knife.circle.fill': 'restaurant',
  'frying.pan.fill': 'skillet',
  'hand.raised.fill': 'back_hand',
  'hand.wave.fill': 'waving_hand',
  'hands.and.sparkles.fill': 'clean_hands',
  heart: 'favorite',
  'heart.fill': 'favorite',
  'heart.text.square.fill': 'volunteer_activism',
  leaf: 'eco',
  'leaf.fill': 'eco',
  lightbulb: 'lightbulb',
  'list.bullet.clipboard': 'assignment',
  magnifyingglass: 'search',
  'moon.stars.fill': 'bedtime',
  'moon.zzz.fill': 'bedtime',
  'mouth.fill': 'mood',
  'mug.fill': 'local_cafe',
  'oven.fill': 'oven_gen',
  'party.popper.fill': 'celebration',
  'person.crop.circle': 'account_circle',
  'person.crop.circle.fill': 'account_circle',
  'ruler.fill': 'straighten',
  safari: 'explore',
  'shield.lefthalf.filled': 'shield',
  'shippingbox.fill': 'inventory_2',
  snowflake: 'ac_unit',
  sparkles: 'auto_awesome',
  'sun.max': 'sunny',
  'sun.max.fill': 'sunny',
  'takeoutbag.and.cup.and.straw.fill': 'takeout_dining',
  timer: 'timer',
  xmark: 'close',
  'xmark.octagon.fill': 'block',
};

/** SymbolView's name for an SF Symbol: the SF Symbol on iOS, its Material Symbol on Android. */
export function symbolName(sf: string): SymbolViewProps['name'] {
  const android = material[sf];
  return android ? { ios: sf as SFSymbol, android } : (sf as SFSymbol);
}

/** Whether an SF Symbol has an Android icon (for tests). */
export function hasAndroidSymbol(sf: string): boolean {
  return sf in material;
}
