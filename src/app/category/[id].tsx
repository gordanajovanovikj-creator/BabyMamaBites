import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { getCategory, recipes, recipeTags, type RecipeTag } from '@/content/recipes';
import { toggle } from '@/domain/profile';
import { recipeTagLabels } from '@/domain/recipe-labels';
import { findRecipes, fitsCookingTime } from '@/domain/recipes';
import { useHousehold } from '@/features/profile/use-household';
import { HouseholdNote } from '@/features/recipes/household-note';
import { PictureHero } from '@/features/recipes/picture-hero';
import { RecipeRow } from '@/features/recipes/recipe-row';
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
    <Screen padded={false} edgeToEdgeTop className="gap-0">
      <PictureHero tone={category.tone} icon={category.icon} emoji={category.emoji} />

      <View className="gap-2 px-5 pb-4 pt-8">
        <AppText
          variant="label"
          size="xs"
          color="on-accent"
          className="font-bold uppercase tracking-wider"
        >
          Collection
        </AppText>
        <AppText variant="display">{category.label}</AppText>
        <AppText color="muted">{category.description}</AppText>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-5 pb-3"
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

      <View className="px-5 pb-2">
        <HouseholdNote household={household} hidden={results.hiddenForSafety} />
      </View>

      <View className="border-t border-border">
        {results.recipes.map((r) => (
          <RecipeRow key={r.id} recipe={r} fitsTime={fitsCookingTime(r, household.cookingTime)} />
        ))}
      </View>

      {results.recipes.length === 0 ? (
        <View className="px-5 pt-4">
          <Notice
            title="Nothing matches just yet"
            body="Try removing a filter. More recipes are on the way."
          />
        </View>
      ) : null}
    </Screen>
  );
}
