(() => {
  const grid = document.querySelector('[data-project-grid]');
  const filterBar = document.querySelector('[data-project-filter]');
  if (!grid || !Array.isArray(window.NW_PORTFOLIO)) return;

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const developDetailPages = {
    fineb: 'portfolio-fineb.html?v=20260812-10',
    'tne-epc': 'portfolio-tne-epc.html?v=20260812-10',
    relim: 'portfolio-relim.html?v=20260812-10',
    aesost: 'portfolio-aesost.html?v=20260812-10',
    kekomi: 'portfolio-kekomi.html?v=20260812-10',
    'the-petrichor': 'portfolio-the-petrichor.html?v=20260812-10'
  };

  const detailHref = (project) => developDetailPages[project.id]
    || `portfolio-detail.html?work=${encodeURIComponent(project.id)}`;

  const seen = new Set();
  const allProjects = window.NW_PORTFOLIO.filter((project) => {
    const key = `${project.client}|${project.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return Boolean(project.id && project.thumbnail);
  });

  const shuffle = (items) => {
    const copy = [...items];
    for (let i = copy.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  };

  const render = (filter = 'all') => {
    const pool = filter === 'all'
      ? allProjects
      : allProjects.filter((project) => (project.filters || []).includes(filter));

    const selected = shuffle(pool).slice(0, 12);

    grid.innerHTML = selected.map((project, index) => `
      <article class="project-card project-filter-item is-visible" data-category="${escapeHTML((project.filters || []).join(' '))}" style="--random-index:${index}">
        <a class="project-card__link" href="${detailHref(project)}" aria-label="${escapeHTML(project.title)} 프로젝트 상세 보기">
          <div class="project-card__visual project-visual project-random-media">
            <img src="${escapeHTML(project.thumbnail)}" alt="${escapeHTML(project.title)}" loading="lazy">
            <span class="project-random-index">${String(index + 1).padStart(2, '0')}</span>
          </div>
          <div class="project-card__meta project-random-meta">
            <div class="project-random-copy">
              <strong>${escapeHTML(project.title)}</strong>
              <span>${escapeHTML(project.subtitle || '')}</span>
            </div>
            <span class="project-card__category">${escapeHTML(project.scope || '')}</span>
          </div>
        </a>
      </article>`).join('');

    const count = document.querySelector('[data-project-count]');
    if (count) count.textContent = `${selected.length} / ${pool.length}`;
  };

  filterBar?.querySelectorAll('[data-project-filter-value]').forEach((button) => {
    button.addEventListener('click', () => {
      const filter = button.dataset.projectFilterValue || 'all';
      filterBar.querySelectorAll('[data-project-filter-value]').forEach((item) => item.classList.toggle('is-active', item === button));
      render(filter);
    });
  });

  document.querySelector('[data-project-shuffle]')?.addEventListener('click', () => {
    const active = filterBar?.querySelector('[data-project-filter-value].is-active');
    render(active?.dataset.projectFilterValue || 'all');
  });

  render('all');
})();
