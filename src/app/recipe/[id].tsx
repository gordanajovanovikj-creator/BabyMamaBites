import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { getRecipe } from '@/content/recipes';
import { splitReviewMarker } from '@/content/schemas';
import { allergenLabels, dietLabels } from '@/domain/profile-labels';
import { energyLabels, recipeTagLabels } from '@/domain/recipe-labels';
import { recipeKicker, recipeTimings } from '@/domain/recipes';
import { useFavorites } from '@/features/favorites/favorites-context';
import { useProfile } from '@/features/profile/profile-context';
import { PictureHero } from '@/features/recipes/picture-hero';
import { AppText, Button, cn, HeartButton, Notice, Screen } from '@/ui';

function SectionTitle({ children }: { children: string }) {
  return (
    <AppText variant="heading" size="2xl" className="px-5 pb-1 pt-8">
      {children}
    </AppText>
  );
}

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = getRecipe(id);
  const { profile } = useProfile();
  const { isFavorite, toggle } = useFavorites();
  const [checked, setChecked] = useState<number[]>([]);

  if (!recipe) {
    return (
      <Screen>
        <AppText variant="title">Recipe not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const summary = splitReviewMarker(recipe.summary);
  const clashes = recipe.allergens.filter((a) => profile?.allergens.includes(a));
  const toggleIngredient = (i: number) =>
    setChecked((c) => (c.includes(i) ? c.filter((x) => x !== i) : [...c, i]));
  const tags = [energyLabels[recipe.energy], ...recipe.tags.map((t) => recipeTagLabels[t])];

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-0">
      <PictureHero
        tone={recipe.tone}
        icon={recipe.icon}
        emoji={recipe.emoji}
        height={260}
        right={
          <HeartButton
            saved={isFavorite(recipe.id)}
            onPress={() => toggle(recipe.id)}
            label={recipe.title}
          />
        }
      />

      <View className="gap-2 px-5 pt-6">
        <AppText
          variant="label"
          size="xs"
          color="on-accent"
          className="font-bold uppercase tracking-wider"
        >
          {recipeKicker(recipe)}
        </AppText>
        <AppText variant="title">{recipe.title}</AppText>
        <AppText variant="caption">{recipeTimings(recipe)}</AppText>
        <AppText color="muted" className="pt-1">
          {summary.text}
        </AppText>
        <View className="flex-row flex-wrap gap-2 pt-2">
          {tags.map((t) => (
            <View key={t} className="rounded-full bg-surface-muted px-3 py-1.5">
              <AppText variant="label" size="sm">
                {t}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      <View className="gap-3 px-5 pt-5">
        {clashes.length ? (
          <Notice
            tone="urgent"
            title="Heads up"
            body={`This recipe contains ${clashes.map((a) => allergenLabels[a].toLowerCase()).join(' and ')}, which you told us your household avoids.`}
          />
        ) : null}
        <AppText variant="caption" size="sm">
          {recipe.allergens.length
            ? `Contains: ${recipe.allergens.map((a) => allergenLabels[a]).join(', ')}. `
            : 'No major allergens listed. '}
          {recipe.diets.length
            ? `Suits: ${recipe.diets.map((d) => dietLabels[d]).join(', ')}. `
            : ''}
          Always check the labels on packaged ingredients.
        </AppText>
      </View>

      <SectionTitle>Ingredients</SectionTitle>
      <View>
        {recipe.ingredients.map((item, i) => {
          const done = checked.includes(i);
          return (
            <Pressable
              key={item}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              accessibilityLabel={item}
              onPress={() => toggleIngredient(i)}
              className="min-h-14 flex-row items-center gap-3 border-b border-border px-5 py-3 active:bg-surface-muted"
            >
              <AppText
                color={done ? 'muted' : 'ink'}
                className={cn('flex-1', done && 'line-through')}
              >
                {item}
              </AppText>
              <View
                className={cn(
                  'h-6 w-6 items-center justify-center rounded-full border-2',
                  done ? 'border-primary bg-primary' : 'border-border',
                )}
              >
                {done ? (
                  <AppText variant="label" size="xs" color="on-primary">
                    ✓
                  </AppText>
                ) : null}
              </View>
            </Pressable>
          );
        })}
      </View>
      <AppText variant="caption" size="sm" className="px-5 pt-2">
        Tap an ingredient to tick it off.
      </AppText>

      <SectionTitle>Method</SectionTitle>
      <View className="gap-4 px-5 pt-2">
        {recipe.steps.map((step, i) => (
          <View key={step} className="flex-row gap-3">
            <AppText className="w-6 font-bold">{`${i + 1}.`}</AppText>
            <AppText className="flex-1">{step}</AppText>
          </View>
        ))}
      </View>

      {recipe.tips.length ? (
        <>
          <SectionTitle>Tips</SectionTitle>
          <View className="gap-2 px-5 pt-2">
            {recipe.tips.map((t) => (
              <AppText key={t}>• {t}</AppText>
            ))}
          </View>
        </>
      ) : null}

      <SectionTitle>Review</SectionTitle>
      <View className="gap-2 px-5 pb-6 pt-2">
        <AppText variant="label">
          {summary.isDraft
            ? 'Draft recipe, awaiting review by a registered dietitian.'
            : `Reviewed by a ${recipe.reviewer}.`}
        </AppText>
        <AppText variant="caption" size="sm">
          This recipe is for general information only and isn&apos;t health or nutrition advice.
          Nutrition information will be added once it has been calculated and reviewed.
        </AppText>
      </View>
    </Screen>
  );
}
