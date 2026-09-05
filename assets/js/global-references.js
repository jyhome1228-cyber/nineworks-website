(() => {
  const source = Array.isArray(window.NW_MAGAZINE) ? window.NW_MAGAZINE : [];
  const grid = document.querySelector('[data-reference-grid]');
  const filters = document.querySelectorAll('[data-reference-filter]');
  if (!grid || !source.length) return;

  const referenceMeta = {
    'maison-margiela': { field: 'identity', label: 'IDENTITY / FASHION', origin: 'EUROPE' },
    'byredo': { field: 'identity', label: 'IDENTITY / FRAGRANCE', origin: 'EUROPE' },
    'acqua-di-parma': { field: 'heritage', label: 'HERITAGE / FRAGRANCE', origin: 'EUROPE' },
    'officine-buly': { field: 'retail', label: 'RETAIL / HERITAGE', origin: 'EUROPE' },
    'starbucks': { field: 'strategy', label: 'STRATEGY / RETAIL', origin: 'GLOBAL' },
    'hay': { field: 'identity', label: 'IDENTITY / LIFESTYLE', origin: 'EUROPE' },
    'loewe-fragrance': { field: 'identity', label: 'ART DIRECTION / FRAGRANCE', origin: 'EUROPE' },
    'bacha-coffee': { field: 'retail', label: 'RETAIL / PACKAGING', origin: 'GLOBAL' }
  };

  const references = Object.entries(referenceMeta).map(([id, meta]) => {
    const article = source.find((item) => item.id === id);
    return article ? { ...article, ...meta } : null;
  }).filter(Boolean);

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  grid.innerHTML = references.map((item, index) => `
    <article class="reference-card" data-reference-field="${escapeHTML(item.field)}">
      <a class="reference-card__link" href="magazine-detail.html?article=${encodeURIComponent(item.id)}" aria-label="${escapeHTML(item.title)} 레퍼런스 보기">
        <figure class="reference-card__media">
          <img src="${escapeHTML(item.thumbnail)}" alt="${escapeHTML(item.title)}" loading="${index < 6 ? 'eager' : 'lazy'}">
          <span class="reference-card__badge">${escapeHTML(item.origin)}</span>
        </figure>
        <div class="reference-card__meta">
          <span>${String(index + 1).padStart(2, '0')}</span>
          <span>${escapeHTML(item.label)}</span>
        </div>
        <h3>${escapeHTML(item.title)}</h3>
        <p class="reference-card__summary">${escapeHTML(item.subtitle)}</p>
        <span class="reference-card__status">View Reference ↗</span>
      </a>
    </article>`).join('');

  const applyFilter = (filter) => {
    filters.forEach((button) => button.classList.toggle('is-active', button.dataset.referenceFilter === filter));
    grid.querySelectorAll('.reference-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.referenceField !== filter;
    });
  };

  filters.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.referenceFilter || 'all')));
  applyFilter('all');
})();
