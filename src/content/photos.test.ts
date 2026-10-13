import { foods } from '@/content/foods';
import { insightCategories } from '@/content/insight-categories';
import { insights } from '@/content/insights';
import { monthlyGuides } from '@/content/monthly-guides';
import { allRecipes, babyRecipeCategories, recipeCategories } from '@/content/recipes';
import { solidsArticles } from '@/content/solids-articles';
import { foodPhoto } from '@/features/foods/food-photos';
import { guidePhoto } from '@/features/guides/guide-photos';
import { libraryPhoto } from '@/features/library/library-photos';
import { categoryCoverIds, categoryPhoto, recipePhoto } from '@/features/recipes/recipe-photos';

// Every recipe, article, tip and monthly guide opens with a photo.
describe('content photos', () => {
  it('every recipe has a photo', () => {
    expect(allRecipes.filter((r) => !recipePhoto(r.id)).map((r) => r.id)).toEqual([]);
  });
  it('every article and tip has a photo', () => {
    const ids = [...solidsArticles.map((a) => a.id), ...insights.map((i) => i.id)];
    expect(ids.filter((id) => !libraryPhoto(id))).toEqual([]);
    expect(insightCategories.length).toBeGreaterThan(0);
  });
  it('every collection has a cover photo from one of its own recipes', () => {
    for (const c of [...recipeCategories, ...babyRecipeCategories]) {
      expect({ id: c.id, photo: !!categoryPhoto(c.id, allRecipes) }).toEqual({
        id: c.id,
        photo: true,
      });
    }
    for (const [categoryId, recipeId] of Object.entries(categoryCoverIds)) {
      expect(allRecipes.find((r) => r.id === recipeId)?.categories).toContain(categoryId);
    }
  });
  it('every food in the food guide has a photo', () => {
    expect(foods.filter((f) => !foodPhoto(f.id)).map((f) => f.id)).toEqual([]);
  });
  it('every monthly guide has a photo', () => {
    expect(monthlyGuides.filter((g) => !guidePhoto(g.id)).map((g) => g.id)).toEqual([]);
  });
});
