import { View } from 'react-native';

import { shadows } from '@/theme/colors';
import { AppText, cn } from '@/ui';

/**
 * "Allergen" pill shown over a baby recipe's picture. Decorative: the card's
 * VoiceOver label names the allergens.
 */
export function AllergenBadge({ compact, className }: { compact?: boolean; className?: string }) {
  return (
    <View
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      className={cn(
        'flex-row items-center gap-1.5 rounded-full bg-surface',
        compact ? 'p-1' : 'py-1.5 pl-1.5 pr-3',
        className,
      )}
      style={{ boxShadow: shadows.floatTight }}
    >
      <View className="h-6 w-6 items-center justify-center rounded-full bg-deep">
        <AppText variant="label" size="sm" color="on-deep" className="font-extrabold leading-4">
          !
        </AppText>
      </View>
      {compact ? null : (
        <AppText variant="label" size="sm">
          Allergen
        </AppText>
      )}
    </View>
  );
}
