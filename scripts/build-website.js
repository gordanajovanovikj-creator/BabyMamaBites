// Builds the website's text pages from the app's own content, so they never drift apart:
// Privacy Policy and Terms of Use (src/content/copy/legal.json), photo credits
// (src/content/photo-credits.json) and the emergency numbers on the Support page
// (src/content/emergency-resources.json). The home page (website/index.html) is written by hand.
// Usage: npm run website:build
const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const out = path.join(root, 'website');
const read = (file) => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const SUPPORT_EMAIL = 'support@mamababybites.com';
const COMPANY = 'Culman Brothers LLC';

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

const header = `
    <a class="skip" href="#main">Skip to content</a>
    <header class="site-header">
      <nav class="nav" aria-label="Main">
        <a class="brand" href="/" aria-label="Mama &amp; Baby Bites home">
          <img class="mark" src="assets/img/logo-mark.webp" alt="" width="40" height="40" />
          <img class="word" src="assets/img/wordmark.webp" alt="" width="640" height="167" />
        </a>
        <ul class="nav-links">
          <li class="optional"><a href="/#features">Features</a></li>
          <li class="optional"><a href="/#pricing">Pricing</a></li>
          <li class="optional"><a href="/#faq">FAQ</a></li>
          <li><a href="support.html">Support</a></li>
          <li><a class="btn btn-primary btn-sm" href="/#get">Get the app</a></li>
        </ul>
      </nav>
    </header>`;

const footer = `
    <footer class="site-footer">
      <div class="wrap">
        <div class="footer-grid">
          <div class="footer-about">
            <a class="brand" href="/" aria-label="Mama &amp; Baby Bites home">
              <img class="mark" src="assets/img/logo-mark.webp" alt="" width="40" height="40" />
              <img class="word" src="assets/img/wordmark.webp" alt="" width="640" height="167" />
            </a>
            <p>
              Mama &amp; Baby Bites shares general information, not medical advice. Always talk to
              your pediatrician or doctor about your family's health. In an emergency, call 911.
            </p>
          </div>
          <div>
            <h4>App</h4>
            <ul>
              <li><a href="/#features">Features</a></li>
              <li><a href="/#pricing">Pricing</a></li>
              <li><a href="/#faq">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h4>Help &amp; legal</h4>
            <ul>
              <li><a href="support.html">Support</a></li>
              <li><a href="privacy.html">Privacy Policy</a></li>
              <li><a href="terms.html">Terms of Use</a></li>
              <li><a href="credits.html">Photo credits</a></li>
            </ul>
          </div>
        </div>
        <div class="footer-bottom">
          <span>© ${new Date().getFullYear()} ${COMPANY}. All rights reserved.</span>
          <a href="mailto:${SUPPORT_EMAIL}">${SUPPORT_EMAIL}</a>
        </div>
      </div>
    </footer>
    <script>
      const header = document.querySelector('.site-header');
      const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
      window.addEventListener('scroll', onScroll, { passive: true });
      onScroll();
    </script>`;

function page({ file, title, description, body }) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${esc(title)} · Mama &amp; Baby Bites</title>
    <meta name="description" content="${esc(description)}" />
    <meta name="theme-color" content="#fbf6ec" />
    <link rel="icon" type="image/png" sizes="32x32" href="assets/img/favicon-32.png" />
    <link rel="apple-touch-icon" href="assets/img/apple-touch-icon.png" />
    <link rel="stylesheet" href="assets/css/site.css" />
  </head>
  <body>${header}
    <main id="main" class="doc">
${body}
    </main>${footer}
  </body>
</html>
`;
  fs.writeFileSync(path.join(out, file), html);
  console.log(`Wrote website/${file}`);
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

// Not found.
page({
  file: '404.html',
  title: 'Page not found',
  description: 'This page could not be found.',
  body: `      <h1>We couldn't find that page</h1>
      <p class="intro">It may have moved. Let's get you back to something tasty.</p>
      <a class="btn btn-primary" href="/">Go to the home page</a>`,
});
