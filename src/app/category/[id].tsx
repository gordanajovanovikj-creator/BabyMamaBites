import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { getCategory, recipes, recipeTags, type RecipeTag } from '@/content/recipes';
import { toggle } from '@/domain/profile';
import { recipeTagLabels } from '@/domain/recipe-labels';
import { findRecipes, fitsCookingTime } from '@/domain/recipes';
import { useHousehold } from '@/features/profile/use-household';
import { HouseholdNote } from '@/features/recipes/household-note';
import { RecipeCard } from '@/features/recipes/recipe-card';
import { AppText, Button, Chip, Notice, Screen } from '@/ui';

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const category = getCategory(id);
  const household = useHousehold();
  const [tags, setTags] = useState<RecipeTag[]>([]);
  const [lowEnergy, setLowEnergy] = useState(false);

  if (!category) {
    return (
      <Screen>
        <AppText variant="title">Category not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const results = findRecipes(recipes, household, {
    categoryId: category.id,
    tags,
    maxEnergy: lowEnergy ? 'low' : null,
  });

  return (
    <Screen padded={false} className="gap-4 pt-4">
      <Stack.Screen options={{ title: category.label }} />
      <View className="gap-1 px-5">
        <AppText variant="title">{category.label}</AppText>
        <AppText variant="caption">{category.description}</AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-5"
      >
        <Chip label="Low energy" selected={lowEnergy} onPress={() => setLowEnergy((v) => !v)} />
        {recipeTags.map((t) => (
          <Chip
            key={t}
            label={recipeTagLabels[t]}
            selected={tags.includes(t)}
            onPress={() => setTags((current) => toggle(current, t))}
          />
        ))}
      </ScrollView>

      <View className="gap-3 px-5">
        <HouseholdNote household={household} hidden={results.hiddenForSafety} />
        {results.recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} fitsTime={fitsCookingTime(r, household.cookingTime)} />
        ))}
        {results.recipes.length === 0 ? (
          <Notice
            title="Nothing matches just yet"
            body="Try removing a filter. More recipes are on the way."
          />
        ) : null}
      </View>
    </Screen>
  );
}
