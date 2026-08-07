(() => {
  const data = Array.isArray(window.NW_MAGAZINE) ? window.NW_MAGAZINE : [];
  const grid = document.querySelector('[data-magazine-grid]');
  const filters = document.querySelectorAll('[data-magazine-filter]');
  if (!data.length || !grid) return;

  const label = {
    strategy: 'Brand Strategy',
    story: 'Brand Story',
    experience: 'Retail & Experience'
  };

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  grid.innerHTML = data.map((article, index) => `
    <article class="magazine-card" id="mag-${escapeHTML(article.id)}" data-category="${escapeHTML(article.category)}">
      <a class="magazine-card__link" href="#mag-${escapeHTML(article.id)}" aria-label="${escapeHTML(article.title)}">
        <figure class="magazine-card__media">
          <img src="${escapeHTML(article.thumbnail)}" alt="${escapeHTML(article.title)}" loading="${index < 6 ? 'eager' : 'lazy'}">
        </figure>
        <div class="magazine-card__meta">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <span>${escapeHTML(label[article.category] || article.category)}</span>
        </div>
        <h3>${escapeHTML(article.title)}</h3>
        <p class="magazine-card__summary">${escapeHTML(article.subtitle)}</p>
        <span class="magazine-card__status">Reading Note</span>
      </a>
    </article>`).join('');

  const applyFilter = (filter) => {
    filters.forEach((button) => {
      button.classList.toggle('is-active', button.dataset.magazineFilter === filter);
    });

    grid.querySelectorAll('.magazine-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  };

  filters.forEach((button) => {
    button.addEventListener('click', () => applyFilter(button.dataset.magazineFilter));
  });

  applyFilter('all');
})();
