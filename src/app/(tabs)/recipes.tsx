import { useMemo, useState } from 'react';
import { ScrollView, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import {
  getCategory,
  recipeCategories,
  recipes,
  recipeTags,
  type RecipeTag,
} from '@/content/recipes';
import { allergenLabels, dietLabels } from '@/domain/profile-labels';
import { recipeTagLabels } from '@/domain/recipe-labels';
import { findRecipes, fitsCookingTime } from '@/domain/recipes';
import { toggle } from '@/domain/profile';
import { useProfile } from '@/features/profile/profile-context';
import { CategoryRow } from '@/features/recipes/category-row';
import { RecipeCard } from '@/features/recipes/recipe-card';
import { AppText, Chip, Notice, Screen } from '@/ui';

export default function RecipesScreen() {
  const { profile } = useProfile();
  const insets = useSafeAreaInsets();
  const [categoryId, setCategoryId] = useState<string | null>(null);
  const [tags, setTags] = useState<RecipeTag[]>([]);
  const [lowEnergy, setLowEnergy] = useState(false);

  const household = useMemo(
    () => ({
      allergens: profile?.allergens ?? [],
      diets: profile?.diets ?? [],
      cookingTime: profile?.cookingTime ?? ('flexible' as const),
    }),
    [profile],
  );

  const results = findRecipes(recipes, household, {
    categoryId,
    tags,
    maxEnergy: lowEnergy ? 'low' : null,
  });
  const category = categoryId ? getCategory(categoryId) : undefined;
  const householdNote = [
    household.allergens.length
      ? `no ${household.allergens.map((a) => allergenLabels[a].toLowerCase()).join(', ')}`
      : null,
    ...household.diets.map((d) => dietLabels[d].toLowerCase()),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Screen padded={false} edgeToEdgeTop className="gap-5">
      <View className="gap-1 px-5" style={{ paddingTop: insets.top + 16 }}>
        <AppText variant="display">Recipes</AppText>
        <AppText variant="caption">Nourishing food that fits your day.</AppText>
      </View>

      <CategoryRow categories={recipeCategories} selectedId={categoryId} onSelect={setCategoryId} />

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
        {category ? (
          <View className="gap-1">
            <AppText variant="heading">{category.label}</AppText>
            <AppText variant="caption">{category.description}</AppText>
          </View>
        ) : null}

        {householdNote ? (
          <AppText variant="caption" size="sm">
            Matched to your household: {householdNote}.
            {results.hiddenForSafety ? ` ${results.hiddenForSafety} hidden.` : ''}
          </AppText>
        ) : null}

        {results.recipes.map((r) => (
          <RecipeCard key={r.id} recipe={r} fitsTime={fitsCookingTime(r, household.cookingTime)} />
        ))}

        {results.recipes.length === 0 ? (
          <Notice
            title="Nothing matches just yet"
            body="Try removing a filter or picking another category. More recipes are on the way."
          />
        ) : null}
      </View>
    </Screen>
  );
}
