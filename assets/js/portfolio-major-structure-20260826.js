(() => {
  const grid = document.querySelector('[data-portfolio-grid]');
  const group = document.querySelector('.portfolio-filter[data-filter-group]');
  if (!grid || !group) return;

  const caseCards = Array.from(grid.querySelectorAll('.portfolio-card:not(.portfolio-card--archive)'));
  const cutoffIndex = caseCards.findIndex((card) => {
    const title = card.querySelector('.portfolio-card__info strong')?.textContent?.trim().toUpperCase();
    return title === 'VAQUER';
  });

  if (cutoffIndex >= 0) {
    caseCards.forEach((card, index) => {
      const categories = new Set((card.dataset.category || '').split(/\s+/).filter(Boolean));
      if (index <= cutoffIndex) categories.add('major');
      else categories.delete('major');
      card.dataset.category = [...categories].join(' ');
    });
  }

  const removeMajorLoadMore = () => {
    document.querySelectorAll('.portfolio-load-more').forEach((node) => node.remove());
  };

  const showAllMajor = () => {
    const activeButton = group.querySelector('[data-filter].is-active');
    if ((activeButton?.dataset.filter || '') !== 'major') return;

    const cards = Array.from(grid.querySelectorAll('.portfolio-filter-item'));
    let count = 0;
    cards.forEach((card) => {
      const categories = (card.dataset.category || '').split(/\s+/).filter(Boolean);
      const matches = categories.includes('major');
      card.hidden = !matches;
      if (matches) count += 1;
    });

    const countEl = document.querySelector('[data-portfolio-index-count]');
    if (countEl) countEl.textContent = `${String(count).padStart(2, '0')} WORKS`;
    removeMajorLoadMore();
  };

  removeMajorLoadMore();

  group.addEventListener('click', (event) => {
    const button = event.target.closest('[data-filter]');
    if (!button) return;
    if (button.dataset.filter === 'major') {
      window.requestAnimationFrame(showAllMajor);
    } else {
      window.requestAnimationFrame(removeMajorLoadMore);
    }
  });

  window.requestAnimationFrame(() => {
    removeMajorLoadMore();
    showAllMajor();
  });
})();
