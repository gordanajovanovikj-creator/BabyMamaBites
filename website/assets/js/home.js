// The home page's "try it" tools: switching weeks of the solids plan, and the first-foods
// lookup. Everything runs in the browser from the app's own content; nothing is sent anywhere.
(function () {
  // Week tabs (arrow keys move between them, as tabs should).
  const tabs = Array.from(document.querySelectorAll('.week-tabs [role="tab"]'));
  const select = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
      document.getElementById(t.getAttribute('aria-controls')).hidden = !on;
    });
  };
  tabs.forEach((tab, i) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', (e) => {
      const step = e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0;
      if (!step) return;
      const next = tabs[(i + step + tabs.length) % tabs.length];
      select(next);
      next.focus();
    });
  });

  // Demo clips play only while on screen. With reduced motion they stay still and get
  // controls, so playing them is the visitor's choice.
  const videos = document.querySelectorAll('.demo video');
  if (matchMedia('(prefers-reduced-motion: reduce)').matches || !('IntersectionObserver' in window)) {
    videos.forEach((v) => {
      v.controls = true;
      v.preload = 'metadata';
    });
  } else {
    const seen = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.play().catch(() => {});
          else e.target.pause();
        }),
      { threshold: 0.4 },
    );
    videos.forEach((v) => seen.observe(v));
  }

  // Food lookup.
  const input = document.getElementById('food-q');
  const answer = document.querySelector('.food-answer');
  if (!input || !answer) return;
  const root = new URL('../../', document.currentScript.src);
  let foods = [];
  const esc = (s) =>
    String(s).replace(
      /[&<>"]/g,
      (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c],
    );
  const risk = { low: 'Low', medium: 'Medium', high: 'High' };

  function show(query) {
    const q = query.trim().toLowerCase();
    if (!q) {
      answer.innerHTML = '';
      return;
    }
    const food =
      foods.find((f) => f.name.toLowerCase() === q) ||
      foods.find((f) => f.name.toLowerCase().startsWith(q)) ||
      foods.find((f) => f.name.toLowerCase().includes(q));
    if (!food) {
      answer.innerHTML =
        '<p class="food-none">That one isn’t in our first-foods guide yet. Try another food, like banana or lentils.</p>';
      return;
    }
    answer.innerHTML =
      '<div class="food-card">' +
      '<p class="food-head"><span aria-hidden="true">' +
      esc(food.emoji) +
      '</span> <strong>' +
      esc(food.name) +
      '</strong> · from about ' +
      food.fromMonths +
      ' months</p>' +
      '<p>' +
      esc(food.intro) +
      '</p>' +
      '<ul class="food-serving">' +
      food.serving
        .map((s) => '<li><strong>' + esc(s.age) + ':</strong> ' + esc(s.text) + '</li>')
        .join('') +
      '</ul>' +
      '<p class="food-risk risk-' +
      esc(food.chokingRisk) +
      '"><strong>Choking risk: ' +
      (risk[food.chokingRisk] || '') +
      '.</strong> ' +
      esc(food.choking) +
      '</p>' +
      (food.allergenNote ? '<p class="food-allergen">' + esc(food.allergenNote) + '</p>' : '') +
      '</div>';
  }

  fetch(new URL('assets/foods-index.json', root))
    .then((r) => r.json())
    .then((data) => {
      foods = data;
      if (input.value) show(input.value);
    })
    .catch(() => {});
  input.addEventListener('input', () => show(input.value));
  document.querySelectorAll('.food-chips [data-food]').forEach((b) =>
    b.addEventListener('click', () => {
      input.value = b.dataset.food;
      show(input.value);
    }),
  );
})();
