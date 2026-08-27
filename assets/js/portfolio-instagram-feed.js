(() => {
  const items = Array.isArray(window.NW_INSTAGRAM_ARCHIVE) ? window.NW_INSTAGRAM_ARCHIVE : [];
  const grid = document.querySelector('[data-portfolio-grid]');
  const group = document.querySelector('.portfolio-filter[data-filter-group]');
  if (!items.length || !grid || !group) return;

  const titleEl = document.querySelector('[data-portfolio-index-title]');
  const copyEl = document.querySelector('[data-portfolio-index-copy]');
  const countEl = document.querySelector('[data-portfolio-index-count]');
  const instagramButton = group.querySelector('[data-filter="instagram"]');

  const setInstagramState = () => {
    const active = instagramButton?.classList.contains('is-active');
    grid.classList.toggle('is-instagram-feed', !!active);
    if (!active) return;
    if (titleEl) titleEl.textContent = 'Instagram Feed';
    if (copyEl) copyEl.textContent = '브랜드별 인스타그램 피드 디자인을 프로젝트 단위로 정리한 아카이브입니다. 카드를 누르면 해당 프로젝트의 피드만 순서대로 넘겨볼 수 있습니다.';
    if (countEl) countEl.textContent = `${String(items.length).padStart(2, '0')} WORKS`;
  };

  group.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => setTimeout(setInstagramState, 0));
  });
  setInstagramState();
  window.addEventListener('popstate', () => setTimeout(setInstagramState, 0));

  const viewer = document.createElement('div');
  viewer.className = 'instagram-feed-viewer';
  viewer.setAttribute('aria-hidden', 'true');
  viewer.innerHTML = `
    <div class="instagram-feed-viewer__head">
      <div>
        <span class="instagram-feed-viewer__eyebrow">NINEWORKS / INSTAGRAM FEED</span>
        <h2 data-instagram-title></h2>
      </div>
      <button class="instagram-feed-viewer__close" type="button" data-instagram-close>CLOSE</button>
    </div>
    <div class="instagram-feed-viewer__stage">
      <button class="instagram-feed-viewer__nav instagram-feed-viewer__nav--prev" type="button" data-instagram-prev aria-label="이전 이미지">←</button>
      <img class="instagram-feed-viewer__image" data-instagram-image alt="">
      <button class="instagram-feed-viewer__nav instagram-feed-viewer__nav--next" type="button" data-instagram-next aria-label="다음 이미지">→</button>
    </div>
    <div class="instagram-feed-viewer__foot">
      <span data-instagram-total></span>
      <span data-instagram-counter></span>
    </div>`;
  document.body.appendChild(viewer);

  const imageEl = viewer.querySelector('[data-instagram-image]');
  const viewerTitle = viewer.querySelector('[data-instagram-title]');
  const counterEl = viewer.querySelector('[data-instagram-counter]');
  const totalEl = viewer.querySelector('[data-instagram-total]');
  let current = null;
  let index = 0;
  let touchStartX = 0;

  const render = () => {
    if (!current) return;
    const images = Array.isArray(current.images) ? current.images : [];
    if (!images.length) return;
    imageEl.src = images[index];
    imageEl.alt = `${current.title} ${index + 1}`;
    viewerTitle.textContent = current.title || 'Instagram Feed';
    counterEl.textContent = `${String(index + 1).padStart(2, '0')} / ${String(images.length).padStart(2, '0')}`;
    totalEl.textContent = `${images.length} FEEDS`;

    const nextSrc = images[(index + 1) % images.length];
    if (nextSrc) {
      const preload = new Image();
      preload.src = nextSrc;
    }
  };

  const openViewer = (project) => {
    if (!project || !Array.isArray(project.images) || !project.images.length) return;
    current = project;
    index = 0;
    render();
    viewer.classList.add('is-open');
    viewer.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-instagram-feed-viewer-open');
  };

  const closeViewer = () => {
    viewer.classList.remove('is-open');
    viewer.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-instagram-feed-viewer-open');
    imageEl.removeAttribute('src');
    current = null;
    index = 0;
  };

  const move = (direction) => {
    if (!current || !current.images.length) return;
    index = (index + direction + current.images.length) % current.images.length;
    render();
  };

  grid.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-archive-id^="instagram-feed-"]');
    if (!trigger) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    const project = items.find((item) => item.id === trigger.dataset.archiveId);
    if (project) openViewer(project);
  }, true);

  viewer.querySelector('[data-instagram-prev]')?.addEventListener('click', () => move(-1));
  viewer.querySelector('[data-instagram-next]')?.addEventListener('click', () => move(1));
  viewer.querySelector('[data-instagram-close]')?.addEventListener('click', closeViewer);

  document.addEventListener('keydown', (event) => {
    if (!viewer.classList.contains('is-open')) return;
    if (event.key === 'Escape') closeViewer();
    if (event.key === 'ArrowLeft') move(-1);
    if (event.key === 'ArrowRight') move(1);
  });

  viewer.addEventListener('touchstart', (event) => {
    touchStartX = event.changedTouches[0]?.clientX || 0;
  }, { passive: true });
  viewer.addEventListener('touchend', (event) => {
    const endX = event.changedTouches[0]?.clientX || 0;
    const deltaX = endX - touchStartX;
    if (Math.abs(deltaX) > 45) move(deltaX > 0 ? -1 : 1);
  }, { passive: true });
})();