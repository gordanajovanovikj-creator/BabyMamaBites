import { insightCategories } from '@/content/insight-categories';
import { insights } from '@/content/insights';
import { monthlyGuides } from '@/content/monthly-guides';
import { allRecipes } from '@/content/recipes';
import { solidsArticles } from '@/content/solids-articles';
import { guidePhoto } from '@/features/guides/guide-photos';
import { libraryPhoto } from '@/features/library/library-photos';
import { recipePhoto } from '@/features/recipes/recipe-photos';

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
  it('every monthly guide has a photo', () => {
    expect(monthlyGuides.filter((g) => !guidePhoto(g.id)).map((g) => g.id)).toEqual([]);
  });
});
