(() => {
  const grid = document.querySelector('[data-portfolio-grid]');
  if (!grid || !Array.isArray(window.NW_PORTFOLIO)) return;

  const seen = new Set();
  const projects = window.NW_PORTFOLIO.filter((project) => {
    const key = `${project.client}|${project.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  grid.innerHTML = projects.map((project) => {
    const href = `portfolio-detail.html?work=${encodeURIComponent(project.id)}`;
    return `
      <article class="portfolio-card portfolio-filter-item reveal" data-category="${escapeHTML(project.filters.join(' '))}">
        <a class="portfolio-card__link" href="${href}" aria-label="${escapeHTML(project.title)} 포트폴리오 상세 보기">
          <div class="portfolio-card__media"><img src="${escapeHTML(project.thumbnail)}" alt="${escapeHTML(project.title)}" loading="lazy"></div>
          <div class="portfolio-card__info">
            <div><strong>${escapeHTML(project.title)}</strong><span>${escapeHTML(project.subtitle)}</span></div>
            <span class="portfolio-card__scope">${escapeHTML(project.scope)}</span>
          </div>
        </a>
      </article>`;
  }).join('');

  const revealItems = grid.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -20px' });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  }

  const group = document.querySelector('.portfolio-filter[data-filter-group]');
  if (group) {
    const buttons = group.querySelectorAll('[data-filter]');
    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        const filter = button.dataset.filter;
        buttons.forEach((item) => item.classList.toggle('is-active', item === button));
        grid.querySelectorAll('.portfolio-filter-item').forEach((item) => {
          const categories = (item.dataset.category || '').split(' ');
          item.hidden = filter !== 'all' && !categories.includes(filter);
        });
      });
    });
  }
})();