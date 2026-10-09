import disclaimers from './copy/disclaimers.json';
import ageRules from './config/age-rules.json';
import insights from './insights.json';
import guides from './monthly-guides.json';
import reactions from './reactions.json';
import babyRecipes from './baby-recipes.json';
import recipes from './recipes.json';
import solidsArticles from './solids-articles.json';
import solidsPlan from './solids-plan.json';

/** The app is US-based: bundled copy uses US English and US health-system terms. */
const UK_TERMS = [
  /\bmums?\b/i,
  /\bnapp(y|ies)\b/i,
  /health visitor/i,
  /\bGP\b/,
  /\bdumm(y|ies)\b/i,
  /\bcolour/i,
  /\bflavour/i,
  /\bfavourite/i,
  /\blabell(ed|ing)\b/i,
  /\byoghurt/i,
  /\bfibre\b/i,
  /\bpaediatric/i,
  /\banaemia/i,
  /\bdiarrhoea/i,
  /\bmould/i,
  /\bpractise\b/i,
  /\bNHS\b/,
  /\b(116 123|999|111)\b/,
];

const bundles = {
  disclaimers,
  ageRules,
  insights,
  guides,
  solidsPlan,
  reactions,
  recipes,
  babyRecipes,
  solidsArticles,
};

describe('US English content', () => {
  for (const [name, content] of Object.entries(bundles)) {
    it(`${name} uses US terms`, () => {
      const text = JSON.stringify(content);
      for (const term of UK_TERMS) expect(text).not.toMatch(term);
    });
  }

  it('points emergencies to 911', () => {
    expect(JSON.stringify(disclaimers)).toContain('911');
    expect(JSON.stringify(guides)).toContain('911');
  });
});
