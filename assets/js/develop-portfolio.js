(() => {
  const grid = document.querySelector('[data-develop-work-grid]');
  if (!grid || !Array.isArray(window.NW_PORTFOLIO)) return;

  // The DEVELOP page reads directly from the shared portfolio dataset.
  // New DEVELOP cases appended to any portfolio list automatically appear here,
  // with the newest appended case shown first. No project ID maintenance is needed.
  const projects = window.NW_PORTFOLIO
    .filter((project) => Array.isArray(project.filters) && project.filters.includes('develop'))
    .slice()
    .reverse();

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const detailHref = (project) => project.detailUrl || `portfolio-detail.html?work=${encodeURIComponent(project.id)}`;

  grid.innerHTML = projects.map((project) => `
    <article class="develop-work-card">
      <a class="develop-work-card__link" href="${escapeHTML(detailHref(project))}">
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
