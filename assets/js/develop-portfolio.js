(() => {
  const grid = document.querySelector('[data-develop-work-grid]');
  if (!grid || !Array.isArray(window.NW_PORTFOLIO)) return;

  const preferredOrder = ['the-petrichor', 'kekomi', 'aesost', 'relim', 'tne-epc', 'fineb'];
  const orderIndex = new Map(preferredOrder.map((id, index) => [id, index]));
  const projects = window.NW_PORTFOLIO
    .filter((project) => Array.isArray(project.filters) && project.filters.includes('develop'))
    .sort((a, b) => (orderIndex.get(a.id) ?? 999) - (orderIndex.get(b.id) ?? 999));

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  grid.innerHTML = projects.map((project) => `
    <article class="develop-work-card">
      <a class="develop-work-card__link" href="portfolio-detail.html?work=${encodeURIComponent(project.id)}">
        <div class="develop-work-card__media">
          <img src="${escapeHTML(project.thumbnail || '')}" alt="${escapeHTML(project.title)} develop project" loading="lazy">
        </div>
        <div class="develop-work-card__meta">
          <div>
            <h3 class="develop-work-card__title">${escapeHTML(project.title)}</h3>
            <p class="develop-work-card__copy">${escapeHTML(project.subtitle || project.scope || '')}</p>
          </div>
          <span class="develop-work-card__tag">Develop Case ↗</span>
        </div>
      </a>
    </article>`).join('');
})();
