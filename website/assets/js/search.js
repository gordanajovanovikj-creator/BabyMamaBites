// Article search on /learn/. Runs entirely in the browser from search-index.json:
// no search service, and nothing typed here is sent anywhere.
(function () {
  const form = document.getElementById('search');
  const input = form && form.querySelector('input');
  const results = document.querySelector('.search-results');
  if (!input || !results) return;
  const heading = results.querySelector('h2');
  const grid = results.querySelector('.article-grid');
  const browse = document.querySelectorAll('.chips, .learn-group');
  let index = null;
  // Paths in the index are from the site root, which is two folders up from this script.
  const root = new URL('../../', document.currentScript.src);
  const at = (path) => new URL(path, root).href;

  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
    );
  const fold = (s) =>
    s
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[’']/g, '');

  function score(item, terms) {
    const title = fold(item.title);
    const headings = fold(item.headings);
    const text = fold(item.text);
    let total = 0;
    for (const t of terms) {
      // Match the start of a word, so "egg" finds "eggs" but not "veggie".
      const re = new RegExp('\\b' + t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'));
      const s = (re.test(title) ? 6 : 0) + (re.test(headings) ? 3 : 0) + (re.test(text) ? 1 : 0);
      if (!s) return 0;
      total += s;
    }
    return total;
  }

  function card(item) {
    return (
      '<a class="article-card tone-' +
      esc(item.categoryId) +
      (item.photo ? ' has-photo' : '') +
      '" href="' +
      esc(at(item.url)) +
      '">' +
      (item.photo
        ? '<img src="' +
          esc(at(item.photo)) +
          '" alt="" width="1200" height="800" loading="lazy" />'
        : '') +
      '<span class="body"><span class="eyebrow">' +
      esc(item.category) +
      '</span>' +
      '<h3>' +
      esc(item.title) +
      '</h3>' +
      '<span class="read">' +
      item.minutes +
      ' min read</span></span></a>'
    );
  }

  function show(query) {
    const terms = fold(query)
      .split(/\s+/)
      .filter((t) => t.length > 1);
    const searching = terms.length > 0;
    results.hidden = !searching;
    browse.forEach((el) => (el.hidden = searching));
    if (!searching || !index) return;
    const hits = index
      .map((item) => ({ item, s: score(item, terms) }))
      .filter((h) => h.s > 0)
      .sort((a, b) => b.s - a.s)
      .map((h) => h.item);
    heading.textContent = hits.length
      ? hits.length + (hits.length === 1 ? ' article' : ' articles') + ' for “' + query.trim() + '”'
      : 'No articles for “' +
        query.trim() +
        '” yet. Try another word, like solids, allergens or sleep.';
    grid.innerHTML = hits.map(card).join('');
  }

  function update() {
    const q = input.value;
    const url = new URL(window.location.href);
    if (q.trim()) url.searchParams.set('q', q);
    else url.searchParams.delete('q');
    history.replaceState(null, '', url);
    show(q);
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    update();
  });
  input.addEventListener('input', update);

  fetch(at('assets/search-index.json'))
    .then((r) => r.json())
    .then((data) => {
      index = data;
      const q = new URLSearchParams(window.location.search).get('q');
      if (q) {
        input.value = q;
        show(q);
      }
    })
    .catch(() => {});

  const focusOnHash = () => window.location.hash === '#search' && input.focus();
  window.addEventListener('hashchange', focusOnHash);
  if (document.readyState === 'complete') focusOnHash();
  else window.addEventListener('load', focusOnHash);
})();
