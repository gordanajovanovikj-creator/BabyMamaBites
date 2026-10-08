import { router } from 'expo-router';
import { View } from 'react-native';

import type { Recipe } from '@/content/recipes';
import { splitReviewMarker } from '@/content/schemas';
import { allergenLabels } from '@/domain/profile-labels';
import { energyLabels } from '@/domain/recipe-labels';
import { formatMinutes } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { AppText, Card, cn, HeartButton, SymbolIcon, toneBackground } from '@/ui';

export type RecipeCardProps = {
  recipe: Recipe;
  fitsTime: boolean;
};

export function RecipeCard({ recipe, fitsTime }: RecipeCardProps) {
  const { isFavorite, toggle } = useFavorites();
  const summary = splitReviewMarker(recipe.summary).text;
  const contains = recipe.allergens.map((a) => allergenLabels[a]).join(', ');
  const meta = `${formatMinutes(recipe.activeMinutes)} hands-on · ${energyLabels[recipe.energy]}`;

  return (
    <View>
      <Card
        onPress={() => router.push({ pathname: '/recipe/[id]', params: { id: recipe.id } })}
        accessibilityLabel={`${recipe.title}. ${summary} ${meta}.${contains ? ` Contains ${contains}.` : ''}${fitsTime ? ' Fits your time.' : ''}`}
        className="flex-row gap-4 p-4"
      >
        <View
          className={cn(
            'h-20 w-20 items-center justify-center rounded-2xl',
            toneBackground(recipe.tone),
          )}
        >
          <SymbolIcon icon={recipe.icon} emoji={recipe.emoji} size={34} />
        </View>
        <View className="flex-1 gap-1 pr-8">
          <AppText variant="label" size="lg" className="font-bold leading-6">
            {recipe.title}
          </AppText>
          <AppText variant="caption" size="sm" numberOfLines={2}>
            {summary}
          </AppText>
          <AppText variant="caption" size="sm" color="ink" className="font-semibold">
            {meta}
          </AppText>
          <View className="flex-row flex-wrap gap-2 pt-1">
            {fitsTime ? (
              <View className="rounded-full bg-accent px-3 py-1">
                <AppText variant="label" size="xs" color="on-accent">
                  Fits your time
                </AppText>
              </View>
            ) : null}
            {contains ? (
              <View className="rounded-full bg-surface-muted px-3 py-1">
                <AppText variant="label" size="xs">
                  Contains {contains.toLowerCase()}
                </AppText>
              </View>
            ) : null}
          </View>
        </View>
      </Card>
      <HeartButton
        saved={isFavorite(recipe.id)}
        onPress={() => toggle(recipe.id)}
        label={recipe.title}
        className="absolute right-2 top-2 bg-transparent"
      />
    </View>
  );
}
