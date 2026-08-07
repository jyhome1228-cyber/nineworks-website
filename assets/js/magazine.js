(() => {
  const data = Array.isArray(window.NW_MAGAZINE) ? window.NW_MAGAZINE : [];
  const featured = document.querySelector('[data-magazine-feature]');
  const grid = document.querySelector('[data-magazine-grid]');
  const filters = document.querySelectorAll('[data-magazine-filter]');
  if (!data.length || !featured || !grid) return;

  const label = { strategy:'Brand Strategy', story:'Brand Story', experience:'Retail & Experience' };
  const escapeHTML = (value='') => String(value).replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;').replaceAll("'",'&#039;');

  const first = data[0];
  featured.id = `mag-${first.id}`;
  featured.dataset.category = first.category;
  featured.innerHTML = `
    <figure class="magazine-feature__media"><img src="${escapeHTML(first.thumbnail)}" alt="${escapeHTML(first.title)}"></figure>
    <div class="magazine-feature__copy">
      <div class="magazine-feature__meta"><span>Featured</span><span>${escapeHTML(label[first.category] || first.category)}</span></div>
      <h2>${escapeHTML(first.title)}</h2>
      <p>${escapeHTML(first.subtitle)}</p>
      <span class="magazine-card__status">Magazine Archive · 01</span>
    </div>`;

  grid.innerHTML = data.slice(1).map((article,index) => `
    <article class="magazine-card" id="mag-${escapeHTML(article.id)}" data-category="${escapeHTML(article.category)}">
      <figure class="magazine-card__media"><img src="${escapeHTML(article.thumbnail)}" alt="${escapeHTML(article.title)}" loading="lazy"></figure>
      <div class="magazine-card__meta"><span>${String(index+2).padStart(2,'0')}</span><span>${escapeHTML(label[article.category] || article.category)}</span></div>
      <h3>${escapeHTML(article.title)}</h3>
      <p class="magazine-card__summary">${escapeHTML(article.subtitle)}</p>
      <span class="magazine-card__status">Reading Note</span>
    </article>`).join('');

  const applyFilter = (filter) => {
    filters.forEach((button) => button.classList.toggle('is-active', button.dataset.magazineFilter === filter));
    featured.hidden = filter !== 'all' && featured.dataset.category !== filter;
    grid.querySelectorAll('.magazine-card').forEach((card) => {
      card.hidden = filter !== 'all' && card.dataset.category !== filter;
    });
  };

  filters.forEach((button) => button.addEventListener('click', () => applyFilter(button.dataset.magazineFilter)));
})();
