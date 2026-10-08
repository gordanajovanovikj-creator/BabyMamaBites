import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';

import { getRecipe } from '@/content/recipes';
import { splitReviewMarker } from '@/content/schemas';
import { allergenLabels, dietLabels } from '@/domain/profile-labels';
import { energyLabels, recipeTagLabels } from '@/domain/recipe-labels';
import { formatMinutes } from '@/domain/recipes';
import { useProfile } from '@/features/profile/profile-context';
import { AppText, Button, Card, cn, Notice, Screen, SymbolIcon, toneBackground } from '@/ui';

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <View className="min-w-24 flex-1 items-center gap-0.5 rounded-2xl bg-surface px-3 py-3">
      <AppText variant="label" size="lg" className="font-bold">
        {value}
      </AppText>
      <AppText variant="caption" size="xs">
        {label}
      </AppText>
    </View>
  );
}

export default function RecipeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const recipe = getRecipe(id);
  const { profile } = useProfile();
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

  return (
    <Screen>
      <View
        className={cn('h-40 items-center justify-center rounded-3xl', toneBackground(recipe.tone))}
      >
        <SymbolIcon icon={recipe.icon} emoji={recipe.emoji} size={72} />
      </View>

      <View className="gap-2">
        <AppText variant="title">{recipe.title}</AppText>
        <AppText color="muted">{summary.text}</AppText>
      </View>

      {clashes.length ? (
        <Notice
          tone="urgent"
          title="Heads up"
          body={`This recipe contains ${clashes.map((a) => allergenLabels[a].toLowerCase()).join(' and ')}, which you told us your household avoids.`}
        />
      ) : null}

      <View className="flex-row flex-wrap gap-2">
        <Fact label="hands-on" value={formatMinutes(recipe.activeMinutes)} />
        <Fact label="total" value={formatMinutes(recipe.totalMinutes)} />
        <Fact
          label={recipe.servings === 1 ? 'serving' : 'servings'}
          value={String(recipe.servings)}
        />
      </View>

      <View className="flex-row flex-wrap gap-2">
        {[energyLabels[recipe.energy], ...recipe.tags.map((t) => recipeTagLabels[t])].map((t) => (
          <View key={t} className="rounded-full bg-surface-muted px-3 py-1.5">
            <AppText variant="label" size="sm">
              {t}
            </AppText>
          </View>
        ))}
      </View>

      <Card className="gap-1">
        <AppText variant="label">
          {recipe.allergens.length
            ? `Contains: ${recipe.allergens.map((a) => allergenLabels[a]).join(', ')}`
            : 'No major allergens listed'}
        </AppText>
        {recipe.diets.length ? (
          <AppText variant="caption" size="sm">
            Suits: {recipe.diets.map((d) => dietLabels[d]).join(', ')}
          </AppText>
        ) : null}
        <AppText variant="caption" size="sm">
          Always check the labels on packaged ingredients.
        </AppText>
      </Card>

      <View className="gap-2">
        <AppText variant="heading">Ingredients</AppText>
        {recipe.ingredients.map((item, i) => {
          const done = checked.includes(i);
          return (
            <Pressable
              key={item}
              accessibilityRole="checkbox"
              accessibilityState={{ checked: done }}
              accessibilityLabel={item}
              onPress={() => toggleIngredient(i)}
              className="min-h-12 flex-row items-center gap-3 rounded-2xl bg-surface px-4 py-3 active:opacity-70"
            >
              <View
                className={cn(
                  'h-6 w-6 items-center justify-center rounded-md border-2',
                  done ? 'border-primary bg-primary' : 'border-ink-muted',
                )}
              >
                {done ? (
                  <AppText variant="label" size="xs" color="on-primary">
                    ✓
                  </AppText>
                ) : null}
              </View>
              <AppText
                color={done ? 'muted' : 'ink'}
                className={cn('flex-1', done && 'line-through')}
              >
                {item}
              </AppText>
            </Pressable>
          );
        })}
      </View>

      <View className="gap-3">
        <AppText variant="heading">Steps</AppText>
        {recipe.steps.map((step, i) => (
          <View key={step} className="flex-row gap-4">
            <View className="h-9 w-9 items-center justify-center rounded-full bg-primary">
              <AppText variant="label" color="on-primary" className="font-bold">
                {i + 1}
              </AppText>
            </View>
            <AppText className="flex-1 pt-1">{step}</AppText>
          </View>
        ))}
      </View>

      {recipe.tips.length ? (
        <Card tone="muted" className="gap-2">
          <AppText variant="heading">Tips</AppText>
          {recipe.tips.map((t) => (
            <AppText key={t}>• {t}</AppText>
          ))}
        </Card>
      ) : null}

      {summary.isDraft ? (
        <Notice
          tone="caution"
          title="Draft recipe"
          body="This recipe hasn't been reviewed by a registered dietitian yet."
        />
      ) : null}
    </Screen>
  );
}
