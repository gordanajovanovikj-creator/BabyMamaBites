// Builds the website's text pages from the app's own content, so they never drift apart:
// Privacy Policy and Terms of Use (src/content/copy/legal.json), photo credits
// (src/content/photo-credits.json), the emergency numbers on the Support page
// (src/content/emergency-resources.json) and the articles in /learn/
// (src/content/solids-articles.json). The home page (website/index.html) is written by hand,
// apart from its footer.
// Usage: npm run website:build
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'website');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const SUPPORT_EMAIL = 'support@mamababybites.com';

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

/** Escapes text, then links the support email and our support page where they appear. */
const linkify = (s) =>
  esc(s)
    .replace(
      new RegExp(SUPPORT_EMAIL.replace('.', '\\.'), 'g'),
      `<a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>`,
    )
    .replace(
      /mamababybites\.com\/support/g,
      '<a href="support.html">mamababybites.com/support</a>',
    );

// Footer columns of article links, like a magazine footer. Each lists a few articles by id.
const footerColumns = [
  {
    title: 'Starting solids',
    category: 'starting-solids',
    ids: [
      'ready',
      'first-foods',
      'purees-vs-finger-foods',
      'allergens',
      'solids-purees-first',
      'learning-to-chew',
    ],
  },
  {
    title: 'Safety first',
    category: 'safety',
    ids: [
      'gagging-vs-choking',
      'foods-to-avoid',
      'allergic-reaction-signs',
      'food-prep-textures',
      'high-chair',
    ],
  },
  {
    title: 'Happy eaters',
    category: 'happy-eaters',
    ids: [
      'hunger-cues',
      'food-refusal',
      'toddler-picky-phases',
      'cups-and-drinks',
      'cows-milk',
      'spoon-skills',
    ],
  },
  {
    title: 'For mama',
    category: 'nourishing-you',
    ids: [
      'postpartum-recovery',
      'newborn-meal-help',
      'newborn-snack-basket',
      'mom-hacks',
      'cluster-feeding',
    ],
  },
];

// Every page links from the site root, so pages in /learn/ work too.
const header = `
    <a class="skip" href="#main">Skip to content</a>
    <header class="site-header">
      <nav class="nav" aria-label="Main">
        <a class="brand" href="/" aria-label="Mama &amp; Baby Bites home">
          <img class="mark" src="/assets/img/logo-mark.webp" alt="" width="40" height="40" />
          <img class="word" src="/assets/img/wordmark.webp" alt="" width="640" height="167" />
        </a>
        <ul class="nav-links">
          <li class="optional"><a href="/#features">Features</a></li>
          <li class="optional"><a href="/learn/">Articles</a></li>
          <li class="optional"><a href="/#pricing">Pricing</a></li>
          <li><a href="/support.html">Support</a></li>
          <li><a class="btn btn-primary btn-sm" href="/#get">Get the app</a></li>
        </ul>
      </nav>
    </header>`;

function footerHtml(articles) {
  const byId = new Map(articles.map((a) => [a.id, a]));
  const columns = footerColumns
    .map((col) => {
      const links = col.ids
        .map((id) => {
          const a = byId.get(id);
          if (!a) throw new Error(`Footer links to a missing article: ${id}`);
          return `              <li><a href="/learn/${a.id}.html">${esc(a.title)}</a></li>`;
        })
        .join('\n');
      return `          <div>
            <h4>${esc(col.title)}</h4>
            <ul>
${links}
              <li><a class="more" href="/learn/#${col.category}">See all</a></li>
            </ul>
          </div>`;
    })
    .join('\n');
  return `<footer class="site-footer">
      <div class="wrap">
        <div class="footer-top">
          <a class="footer-logo" href="/" aria-label="Mama &amp; Baby Bites home">
            <img src="/assets/img/logo-full.webp" alt="" width="640" height="449" loading="lazy" />
          </a>
          <a class="btn btn-light" href="/learn/">Browse all articles</a>
        </div>
        <div class="footer-grid">
          <div>
            <h4>Mama &amp; Baby Bites</h4>
            <ul>
              <li><a href="/#features">About the app</a></li>
              <li><a href="/#pricing">Pricing</a></li>
              <li><a href="/#faq">FAQ</a></li>
              <li><a href="/learn/">All articles</a></li>
            </ul>
          </div>
${columns}
          <div>
            <h4>Help &amp; legal</h4>
            <ul>
              <li><a href="/support.html">Support</a></li>
              <li><a href="mailto:${SUPPORT_EMAIL}">Contact us</a></li>
              <li><a href="/privacy.html">Privacy Policy</a></li>
              <li><a href="/terms.html">Terms of Use</a></li>
              <li><a href="/credits.html">Photo credits</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>`;
}

const scripts = `
    <script>
      const header = document.querySelector('.site-header');
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    </script>`;

// The app's starting-solids and wellbeing articles, the source registries they cite, and
// the safety notices the app shows with each one (same rules, from src/domain).
const articles = read('src/content/solids-articles.json').articles;
const sourceList = [
  ...read('src/content/solids-plan.json').sources,
  ...read('src/content/monthly-guides.json').sources,
];
const categories = read('src/content/insight-categories.json').categories;
const safetyNotices = read('src/content/copy/safety-notices.json').blocks;
const medicalDisclaimer = read('src/content/copy/medical-disclaimer.json').blocks;
let noticesFor;
try {
  ({ noticesFor } = require('../src/domain/safety-notices.ts'));
} catch (e) {
  throw new Error(
    `Couldn't load src/domain/safety-notices.ts (needs Node 22.18 or newer): ${e.message}`,
  );
}
const footer = `
    ${footerHtml(articles)}${scripts}`;

function page({ file, title, description, body, mainClass = 'doc' }) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)} · Mama &amp; Baby Bites</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="theme-color" content="#fbf6ec" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/img/favicon-32.png" />
    <link rel="apple-touch-icon" href="/assets/img/apple-touch-icon.png" />
    <link rel="stylesheet" href="/assets/css/site.css" />
  </head>
  <body>${header}
    <main id="main" class="${mainClass}">
${body}
    </main>${footer}
  </body>
</html>
`;
  fs.mkdirSync(path.dirname(path.join(out, file)), { recursive: true });
  fs.writeFileSync(path.join(out, file), html);
  console.log(`Wrote website/${file}`);
}

// The home page is written by hand; only its footer comes from here, between two markers.
{
  const file = path.join(out, 'index.html');
  const html = fs.readFileSync(file, 'utf8');
  const re = /<!-- footer:start -->[\s\S]*<!-- footer:end -->/;
  if (!re.test(html)) throw new Error('website/index.html is missing its footer markers');
  fs.writeFileSync(
    file,
    html.replace(re, `<!-- footer:start -->\n    ${footerHtml(articles)}\n    <!-- footer:end -->`),
  );
  console.log('Updated the footer in website/index.html');
}

// Privacy Policy and Terms of Use, straight from the app.
const legal = read('src/content/copy/legal.json');
for (const doc of legal.documents) {
  const sections = doc.sections
    .map((s) => {
      const paragraphs = s.paragraphs.map((p) => `      <p>${linkify(p)}</p>`).join('\n');
      const bullets = s.bullets.length
        ? `      <ul>\n${s.bullets.map((b) => `        <li>${linkify(b)}</li>`).join('\n')}\n      </ul>`
        : '';
      return [`      <h2>${esc(s.heading)}</h2>`, paragraphs, bullets].filter(Boolean).join('\n');
    })
    .join('\n');
  page({
    file: `${doc.id}.html`,
    title: doc.title,
    description: `The ${doc.title} for the Mama & Baby Bites app.`,
    body: `      <h1>${esc(doc.title)}</h1>
      <p class="updated">Last updated ${esc(doc.updated)}</p>
      <p class="intro">${linkify(doc.intro)}</p>
${sections}`,
  });
}

// Support: how to reach us, common questions, and the app's emergency numbers.
const emergency = read('src/content/emergency-resources.json');
const help = emergency.groups
  .map(
    (g) => `      <div class="panel${g.urgent ? ' danger' : ''}">
        <h2 style="margin-top: 0">${esc(g.title)}</h2>
        <p>${esc(g.body)}</p>
      </div>`,
  )
  .join('\n');
page({
  file: 'support.html',
  title: 'Support',
  description:
    'Help with the Mama & Baby Bites app: contact us, subscriptions, privacy and emergency numbers.',
  body: `      <h1>Support</h1>
      <p class="intro">
        We're here to help with anything about the Mama &amp; Baby Bites app. Email us at
        <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a> and we'll get back to you as soon as
        we can.
      </p>
      <a class="btn btn-primary" href="mailto:${SUPPORT_EMAIL}">Email support</a>

      <h2>Common questions</h2>
      <h3>How do I manage or cancel my subscription?</h3>
      <p>
        On your iPhone, open Settings, tap your name, then Subscriptions, and choose Mama &amp; Baby
        Bites. You can also open it from the app: Settings, then Subscription. Cancel at least 24
        hours before the trial or a renewal ends to avoid being charged. Deleting the app doesn't
        cancel a subscription.
      </p>
      <h3>I got a new phone. How do I get Premium back?</h3>
      <p>
        Sign in with the same Apple ID, open the app, and tap Restore purchases in Settings or on
        the subscription screen.
      </p>
      <h3>How do I get a refund?</h3>
      <p>
        Purchases are handled by Apple, so refunds are too. Request one at
        <a href="https://reportaproblem.apple.com">reportaproblem.apple.com</a>.
      </p>
      <h3>How do I delete my information?</h3>
      <p>
        Your details are stored only on your phone, so deleting the app removes everything it
        saved. You can also change your details any time in the app's Settings. See our
        <a href="privacy.html">Privacy Policy</a>.
      </p>
      <h3>Reminders aren't showing up</h3>
      <p>
        Check that the reminder is turned on in the app's Settings, and that notifications are
        allowed for Mama &amp; Baby Bites in your iPhone Settings, under Notifications.
      </p>

      <h2>Medical questions and emergencies</h2>
      <p>
        We can't give medical advice. For questions about your baby's or your own health, please
        talk to your pediatrician, doctor or another qualified professional.
      </p>
${help}`,
});

// Photo credits, grouped by where the photos come from.
const sourceNames = {
  magnific: 'Magnific (Freepik)',
  pixabay: 'Pixabay',
  dreamstime: 'Dreamstime',
  pexels: 'Pexels',
};
const credits = read('src/content/photo-credits.json').credits;
const bySource = Object.keys(sourceNames)
  .map((source) => ({ source, items: credits.filter((c) => c.source === source) }))
  .filter((g) => g.items.length);
page({
  file: 'credits.html',
  title: 'Photo credits',
  description: 'The photographers behind the food photos in the Mama & Baby Bites app.',
  body: `      <h1>Photo credits</h1>
      <p class="intro">
        Thank you to the photographers whose work appears in the app and on this site. Photos are
        used under each provider's license.
      </p>
${bySource
  .map(
    (g) => `      <h2>${esc(sourceNames[g.source])}</h2>
      <table class="credits">
        <thead><tr><th scope="col">Used on</th><th scope="col">Photographer</th></tr></thead>
        <tbody>
${g.items
  .slice()
  .sort((a, b) => a.usedOn.localeCompare(b.usedOn))
  .map((c) => {
    const who = c.author ? esc(c.author) : 'Unknown';
    const credit = c.url ? `<a href="${esc(c.url)}" rel="noopener">${who}</a>` : who;
    return `          <tr><td>${esc(c.usedOn)}</td><td>${credit}</td></tr>`;
  })
  .join('\n')}
        </tbody>
      </table>`,
  )
  .join('\n')}`,
});

// Articles: a page for each one, and a page listing them all by category.
/** Links the US emergency and crisis numbers so they can be tapped on a phone. */
const linkPhones = (html) =>
  html.replace(/\b(1-8\d\d-(?:[A-Z]{3}-[A-Z]{4}|\d{3}-\d{4})|911|988)\b/g, (n) => {
    const keypad = { ABC: 2, DEF: 3, GHI: 4, JKL: 5, MNO: 6, PQRS: 7, TUV: 8, WXYZ: 9 };
    const digits = n.replace(
      /[A-Z]/g,
      (c) => Object.entries(keypad).find(([k]) => k.includes(c))[1],
    );
    return `<a href="tel:${digits.replace(/-/g, '')}">${n}</a>`;
  });
const text = (s) => linkPhones(esc(s));
const categoryLabel = (id) => categories.find((c) => c.id === id)?.label ?? id;
const noticeBlock = (id) => {
  const n = safetyNotices.find((b) => b.id === id);
  if (!n) throw new Error(`Unknown safety notice: ${id}`);
  const urgent = id === 'choking-emergency';
  return `      <div class="panel${urgent ? ' danger' : ''}">
        <h2>${esc(n.title)}</h2>
        <p>${text(n.body)}</p>
      </div>`;
};
const articleCard = (
  a,
) => `        <a class="article-card tone-${esc(a.category)}" href="/learn/${a.id}.html">
          <span class="eyebrow">${esc(categoryLabel(a.category))}</span>
          <h3>${esc(a.title)}</h3>
          <p>${esc(a.summary)}</p>
          <span class="read">${a.readMinutes} min read</span>
        </a>`;

for (const a of articles) {
  const notices = noticesFor(a);
  const sections = a.sections
    .map((sec) => {
      const inner = [
        `        <h2>${esc(sec.heading)}</h2>`,
        ...sec.paragraphs.map((p) => `        <p>${text(p)}</p>`),
        sec.bullets.length
          ? `        <ul>\n${sec.bullets.map((b) => `          <li>${text(b)}</li>`).join('\n')}\n        </ul>`
          : '',
      ]
        .filter(Boolean)
        .join('\n');
      const cls =
        sec.callout === 'urgent'
          ? 'panel danger'
          : sec.callout === 'support'
            ? 'panel support'
            : 'section-block';
      return `      <section class="${cls}">\n${inner}\n      </section>`;
    })
    .join('\n');
  const sources = a.sources.map((id) => {
    const src = sourceList.find((x) => x.id === id);
    if (!src) throw new Error(`Article ${a.id} cites a missing source: ${id}`);
    return `          <li><a href="${esc(src.url)}" rel="noopener">${esc(src.title)}</a> · ${esc(src.publisher)}</li>`;
  });
  const related = articles.filter((x) => x.category === a.category && x.id !== a.id).slice(0, 3);
  page({
    file: `learn/${a.id}.html`,
    title: a.title,
    description: a.summary,
    mainClass: 'doc article',
    body: `      <nav class="crumbs" aria-label="Breadcrumb">
        <a href="/learn/">Articles</a> <span aria-hidden="true">›</span>
        <a href="/learn/#${esc(a.category)}">${esc(categoryLabel(a.category))}</a>
      </nav>
      <h1>${esc(a.title)}</h1>
      <p class="intro">${esc(a.summary)}</p>
      <p class="updated">${a.readMinutes} min read</p>
${notices.top.map(noticeBlock).join('\n')}
${
  a.keyPoints
    ? `      <div class="in-short">
        <h2>In short</h2>
        <ul>
${a.keyPoints.map((k) => `          <li>${text(k)}</li>`).join('\n')}
        </ul>
      </div>`
    : ''
}
${sections}
${notices.afterBody.map(noticeBlock).join('\n')}
      <div class="article-cta">
        <img src="/assets/img/logo-mark.webp" alt="" width="56" height="56" />
        <div>
          <h2>Plan it, cook it, track it</h2>
          <p>Week-by-week plans, recipes and a food log in the Mama &amp; Baby Bites app. Coming soon to iPhone.</p>
        </div>
      </div>
${notices.bottom.map(noticeBlock).join('\n')}
      <div class="article-foot">
        <h2>Sources</h2>
        <ul class="sources">
${sources.join('\n')}
        </ul>
        <p class="disclaimer">${esc(medicalDisclaimer.find((b) => b.id === 'educational').body)} In an emergency, call <a href="tel:911">911</a>.</p>
      </div>
${
  related.length
    ? `      <h2 class="related-title">Keep reading</h2>
      <div class="article-grid">
${related.map(articleCard).join('\n')}
      </div>`
    : ''
}`,
  });
}

page({
  file: 'learn/index.html',
  title: 'Articles',
  description:
    'Friendly, practical articles on starting solids, feeding safety, happy eaters and caring for yourself, based on official US guidance.',
  mainClass: 'doc learn',
  body: `      <h1>Articles</h1>
      <p class="intro">
        Practical, friendly reads on starting solids, safety, happy eaters and looking after
        yourself, from the Mama &amp; Baby Bites app.
      </p>
      <nav class="chips" aria-label="Categories">
${categories
  .filter((c) => articles.some((a) => a.category === c.id))
  .map((c) => `        <a href="#${c.id}">${esc(c.label)}</a>`)
  .join('\n')}
      </nav>
${categories
  .filter((c) => articles.some((a) => a.category === c.id))
  .map(
    (c) => `      <section id="${c.id}" class="learn-group">
        <h2>${esc(c.label)}</h2>
        <p>${esc(c.description)}</p>
        <div class="article-grid">
${articles
  .filter((a) => a.category === c.id)
  .map(articleCard)
  .join('\n')}
        </div>
      </section>`,
  )
  .join('\n')}
      <p class="disclaimer">${esc(medicalDisclaimer.find((b) => b.id === 'educational').body)} In an emergency, call <a href="tel:911">911</a>.</p>`,
});

// Not found.
page({
  file: '404.html',
  title: 'Page not found',
  description: 'This page could not be found.',
  body: `      <h1>We couldn't find that page</h1>
      <p class="intro">It may have moved. Let's get you back to something tasty.</p>
      <a class="btn btn-primary" href="/">Go to the home page</a>`,
});
