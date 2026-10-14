import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { ScrollView, View } from 'react-native';

import { foodCategoryLabels, getFood, type ChokingRisk } from '@/content/foods';
import { splitReviewMarker } from '@/content/schemas';
import { babyRecipes } from '@/content/recipes';
import { solidsSourcesFor } from '@/content/solids-plan';
import { fromIsoDate } from '@/domain/dates';
import { foodHadReaction, foodTriedOn, recipesWithFood } from '@/domain/foods';
import { findRecipes } from '@/domain/recipes';
import { foodFavoriteId } from '@/domain/favorites';
import { allergenLabels } from '@/domain/profile-labels';
import { useFavorites } from '@/features/favorites/favorites-context';
import { foodPhoto } from '@/features/foods/food-photos';
import { useHousehold } from '@/features/profile/use-household';
import { HeroTopBar, PictureHero } from '@/features/recipes/picture-hero';
import { RECIPE_TILE_WIDTH, RecipeTile } from '@/features/recipes/recipe-tile';
import { DetailHeader } from '@/features/shared/detail-header';
import { HealthDisclaimerNote } from '@/features/shared/health-disclaimer-note';
import { SourceLinks } from '@/features/shared/source-links';
import { useFoodLog } from '@/features/solids/food-log-context';
import { AppText, Button, Card, Chip, HeartButton, Notice, Screen } from '@/ui';

type Section = 'serve' | 'choking' | 'allergens' | 'tips';

const riskLabels: Record<ChokingRisk, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
};

function FactRow({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View
      className={`min-h-12 flex-row items-center justify-between gap-3 py-2 ${last ? '' : 'border-b border-border'}`}
    >
      <AppText color="muted">{label}</AppText>
      <AppText variant="label" className="font-bold">
        {value}
      </AppText>
    </View>
  );
}

export default function FoodScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const food = getFood(id);
  const { entries } = useFoodLog();
  const household = useHousehold();
  const { isFavorite, toggle } = useFavorites();
  const [section, setSection] = useState<Section>('serve');

  if (!food) {
    return (
      <Screen>
        <AppText variant="title">Food not found</AppText>
        <Button label="Back" onPress={() => router.back()} />
      </Screen>
    );
  }

  const intro = splitReviewMarker(food.intro);
  const triedOn = foodTriedOn(entries, food);
  const reaction = foodHadReaction(entries, food);
  const sections: { id: Section; label: string }[] = [
    { id: 'serve', label: 'How to serve' },
    { id: 'choking', label: 'Choking' },
    ...(food.allergenNote ? [{ id: 'allergens' as const, label: 'Allergens' }] : []),
    ...(food.tips.length ? [{ id: 'tips' as const, label: 'Tips' }] : []),
  ];
  const mealIdeas = recipesWithFood(findRecipes(babyRecipes, household).recipes, food);
  const logParams = { food: food.name, ...(food.allergen ? { allergen: food.allergen } : {}) };

  return (
    <Screen
      padded={false}
      edgeToEdgeTop
      className="gap-0"
      footer={
        <>
          <Button
            label="Add to plan"
            variant="secondary"
            className="flex-1"
            onPress={() => router.push({ pathname: '/planner/add', params: { food: food.id } })}
          />
          <Button
            label={triedOn ? 'Log again' : 'Mark as tried'}
            className="flex-1"
            onPress={() => router.push({ pathname: '/solids/log', params: logParams })}
          />
        </>
      }
      overlay={
        <HeroTopBar
          right={
            <HeartButton
              saved={isFavorite(foodFavoriteId(food.id))}
              onPress={() => toggle(foodFavoriteId(food.id))}
              label={food.name}
            />
          }
        />
      }
    >
      <PictureHero tone="muted" icon="fork.knife" emoji={food.emoji} photo={foodPhoto(food.id)} />

      <DetailHeader
        kicker={`${foodCategoryLabels[food.category]} · From ${food.fromMonths} months`}
        title={food.name}
      >
        <AppText color="muted" className="pt-1">
          {intro.text}
        </AppText>
      </DetailHeader>

      <View className="gap-3 px-5 pt-5">
        <Card>
          <FactRow label="Age" value={`${food.fromMonths} months+`} />
          <FactRow
            label="Common allergen"
            value={food.allergen ? `Yes · ${allergenLabels[food.allergen]}` : 'No'}
          />
          <FactRow label="Iron-rich" value={food.ironRich ? 'Yes' : 'No'} />
          <FactRow label="Choking risk" value={riskLabels[food.chokingRisk]} last />
        </Card>

        {reaction ? (
          <Notice
            tone="caution"
            title="You logged a reaction to this food"
            body="Check with your pediatrician before offering it again. If your baby has trouble breathing, swelling of the face or lips, or repeated vomiting, call 911."
          />
        ) : null}

        <AppText variant="caption" size="sm">
          {triedOn
            ? `Tried · last logged ${fromIsoDate(triedOn).toLocaleDateString(undefined, { month: 'long', day: 'numeric' })}`
            : 'Not tried yet'}
        </AppText>
        <Button
          label="Log a reaction"
          variant="secondary"
          onPress={() =>
            router.push({ pathname: '/solids/log', params: { ...logParams, reaction: 'mild' } })
          }
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerClassName="gap-2 px-5 pb-2 pt-8"
      >
        {sections.map((s) => (
          <Chip
            key={s.id}
            label={s.label}
            selected={section === s.id}
            onPress={() => setSection(s.id)}
          />
        ))}
      </ScrollView>

      <View className="gap-4 px-5 pt-4">
        {section === 'serve'
          ? food.serving.map((s) => (
              <Card key={s.age} tone="muted" className="gap-1">
                <AppText variant="label" className="font-bold">
                  {s.age}
                </AppText>
                <AppText>{s.text}</AppText>
              </Card>
            ))
          : null}
        {section === 'choking' ? (
          <>
            <Card tone="danger" className="gap-1">
              <AppText variant="label" color="danger" className="font-bold">
                {`Choking risk: ${riskLabels[food.chokingRisk]}`}
              </AppText>
              <AppText>{food.choking}</AppText>
            </Card>
            <AppText variant="caption" size="sm">
              Always stay with your baby while they eat, and have them sit upright.
            </AppText>
            <Button
              label="Read the choking guide"
              variant="secondary"
              onPress={() => router.push('/solids/choking')}
            />
          </>
        ) : null}
        {section === 'allergens' && food.allergenNote ? (
          <Card tone="accent" className="gap-1">
            <AppText variant="label" className="font-bold">
              {food.allergen ? `Common allergen: ${allergenLabels[food.allergen]}` : 'Allergens'}
            </AppText>
            <AppText>{food.allergenNote}</AppText>
          </Card>
        ) : null}
        {section === 'tips' ? food.tips.map((t) => <AppText key={t}>• {t}</AppText>) : null}
      </View>

      {mealIdeas.length ? (
        <View className="gap-3 pt-10">
          <View className="px-5">
            <AppText variant="heading" size="2xl">
              Meal ideas with this ingredient
            </AppText>
            <AppText variant="caption" size="sm">
              From the baby menu
            </AppText>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            decelerationRate="fast"
            snapToInterval={RECIPE_TILE_WIDTH + 16}
            contentContainerClassName="gap-4 px-5"
          >
            {mealIdeas.map((r) => (
              <RecipeTile key={r.id} recipe={r} />
            ))}
          </ScrollView>
        </View>
      ) : null}

      <View className="gap-3 px-5 pb-6 pt-8">
        <SourceLinks sources={solidsSourcesFor(food.sources)} />
        <AppText variant="caption" size="sm">
          {intro.isDraft
            ? `Draft guide, awaiting review by a ${food.reviewer}.`
            : `Reviewed by a ${food.reviewer}.`}
        </AppText>
        <HealthDisclaimerNote />
      </View>
    </Screen>
  );
}
