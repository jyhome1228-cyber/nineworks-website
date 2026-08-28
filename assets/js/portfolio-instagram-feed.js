(() => {
  const items = Array.isArray(window.NW_INSTAGRAM_ARCHIVE) ? window.NW_INSTAGRAM_ARCHIVE : [];
  const grid = document.querySelector('[data-portfolio-grid]');
  const group = document.querySelector('.portfolio-filter[data-filter-group]');
  if (!items.length || !grid || !group) return;

  const displayTitles = {
    'instagram-feed-01': '더ㅇㅇ 헬스케어 피드',
    'instagram-feed-02': '더ㅇㅇ 라이프스타일 피드',
    'instagram-feed-04': '라ㅇㅇ 코스메틱 피드',
    'instagram-feed-05': '리ㅇㅇ 뷰티케어 피드',
    'instagram-feed-06': '명ㅇㅇ 라이프케어 피드',
    'instagram-feed-07': '블ㅇㅇ 푸드 피드',
    'instagram-feed-08': '스ㅇㅇ 헬스케어 피드',
    'instagram-feed-09': '아ㅇㅇ 뷰티 피드',
    'instagram-feed-10': '윗ㅇㅇ 라이프스타일 피드',
    'instagram-feed-11': '찐ㅇㅇ 푸드 피드',
    'instagram-feed-12': '청ㅇㅇ 프리미엄 헬스케어 피드',
    'instagram-feed-13': '톡ㅇㅇ 커머스 프로모션 피드',
    'instagram-feed-14': '효ㅇㅇ 헬스케어 프로모션 피드',
    'instagram-feed-15': 'Dㅇㅇ 헬스케어 피드',
    'instagram-feed-16': '귀ㅇㅇ 두유 피드',
    'instagram-feed-17': '뉴ㅇㅇ 브랜드 피드',
    'instagram-feed-18': '먹ㅇㅇ 스낵 피드',
    'instagram-feed-19': '옥ㅇㅇ 푸드 피드'
  };

  items.forEach((item) => {
    if (displayTitles[item.id]) item.title = displayTitles[item.id];
  });

  const syncCardLabels = () => {
    items.forEach((item) => {
      const trigger = grid.querySelector(`[data-archive-id="${item.id}"]`);
      if (!trigger) return;
      const card = trigger.closest('.portfolio-card');
      const title = card?.querySelector('.portfolio-card__info strong');
      const subtitle = card?.querySelector('.portfolio-card__info div > span');
      const thumb = card?.querySelector('.portfolio-card__media img');
      if (title) title.textContent = item.title;
      if (subtitle) subtitle.textContent = 'Instagram Feed';
      if (thumb) thumb.alt = item.title;
      trigger.setAttribute('aria-label', `${item.title} 이미지 피드 보기`);
    });
  };
  syncCardLabels();

  let shuffled = false;
  const shuffleInstagramCards = () => {
    if (shuffled) return;
    const cards = items
      .map((item) => grid.querySelector(`[data-archive-id="${item.id}"]`)?.closest('.portfolio-card'))
      .filter(Boolean);
    for (let i = cards.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      [cards[i], cards[j]] = [cards[j], cards[i]];
    }
    cards.forEach((card) => grid.appendChild(card));
    shuffled = true;
  };

  const titleEl = document.querySelector('[data-portfolio-index-title]');
  const copyEl = document.querySelector('[data-portfolio-index-copy]');
  const countEl = document.querySelector('[data-portfolio-index-count]');
  const instagramButton = group.querySelector('[data-filter="instagram"]');

  const requestedFilter = () => String(new URLSearchParams(window.location.search).get('filter') || '').toLowerCase();
  const isInstagramActive = () => instagramButton?.classList.contains('is-active') || requestedFilter() === 'instagram';

  const setInstagramState = () => {
    const active = isInstagramActive();
    grid.classList.toggle('is-instagram-feed', !!active);
    if (!active) return;

    shuffleInstagramCards();

    const instagramIds = new Set(items.map((item) => item.id));
    grid.querySelectorAll('.portfolio-filter-item').forEach((card) => {
      const trigger = card.querySelector('[data-archive-id]');
      if (!trigger) return;
      if (instagramIds.has(trigger.dataset.archiveId)) card.hidden = false;
      else if (!(card.dataset.category || '').split(/\s+/).includes('instagram')) card.hidden = true;
    });

    syncCardLabels();
    if (titleEl) titleEl.textContent = 'Instagram Feed';
    if (copyEl) copyEl.textContent = 'SNS 운영 과정에서 제작한 인스타그램 피드 디자인을 작업 단위로 정리했습니다. 각 카드는 서로 다른 프로젝트이며, 새로고침할 때마다 작업 순서가 무작위로 노출됩니다.';
    if (countEl) countEl.textContent = `${String(items.length).padStart(2, '0')} WORKS`;
  };

  group.querySelectorAll('[data-filter]').forEach((button) => {
    button.addEventListener('click', () => {
      window.requestAnimationFrame(setInstagramState);
      setTimeout(setInstagramState, 30);
    });
  });

  setInstagramState();
  window.requestAnimationFrame(setInstagramState);
  setTimeout(setInstagramState, 80);
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
    <div class="instagram-feed-viewer__stage" data-instagram-stage>
      <button class="instagram-feed-viewer__nav instagram-feed-viewer__nav--prev" type="button" data-instagram-prev aria-label="이전 이미지">←</button>
      <img class="instagram-feed-viewer__image" data-instagram-image alt="">
      <button class="instagram-feed-viewer__nav instagram-feed-viewer__nav--next" type="button" data-instagram-next aria-label="다음 이미지">→</button>
    </div>
    <div class="instagram-feed-viewer__foot">
      <span data-instagram-total></span>
      <span data-instagram-counter></span>
    </div>`;
  document.body.appendChild(viewer);

  const stage = viewer.querySelector('[data-instagram-stage]');
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

    [1, -1].forEach((offset) => {
      const preloadSrc = images[(index + offset + images.length) % images.length];
      if (!preloadSrc) return;
      const preload = new Image();
      preload.src = preloadSrc;
    });
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

  viewer.querySelector('[data-instagram-prev]')?.addEventListener('click', (event) => {
    event.stopPropagation();
    move(-1);
  });
  viewer.querySelector('[data-instagram-next]')?.addEventListener('click', (event) => {
    event.stopPropagation();
    move(1);
  });
  viewer.querySelector('[data-instagram-close]')?.addEventListener('click', closeViewer);
  imageEl?.addEventListener('click', (event) => event.stopPropagation());
  stage?.addEventListener('click', (event) => {
    if (event.target === stage) closeViewer();
  });

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