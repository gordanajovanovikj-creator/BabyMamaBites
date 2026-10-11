import { Image } from 'expo-image';
import { View, type StyleProp, type ViewStyle } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { cn, SymbolIcon, toneBackground } from '@/ui';

import { recipePhoto } from './recipe-photos';

export type RecipeImageProps = {
  recipe: Recipe;
  /** Size and corner classes, e.g. "h-44 rounded-3xl". */
  className: string;
  iconSize: number;
  /** Extra layout, e.g. an exact height. */
  style?: StyleProp<ViewStyle>;
};

/** The recipe's photo when there is one; otherwise its color block and icon. Decorative. */
export function RecipeImage({ recipe, className, iconSize, style }: RecipeImageProps) {
  const photo = recipePhoto(recipe.id);
  return (
    <View
      style={style}
      importantForAccessibility="no-hide-descendants"
      accessibilityElementsHidden
      className={cn(
        'items-center justify-center overflow-hidden',
        photo ? 'bg-surface-muted' : toneBackground(recipe.tone),
        className,
      )}
    >
      {photo ? (
        <Image
          source={photo}
          contentFit="cover"
          transition={150}
          style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}
        />
      ) : (
        <SymbolIcon icon={recipe.icon} emoji={recipe.emoji} size={iconSize} />
      )}
    </View>
  );
}
