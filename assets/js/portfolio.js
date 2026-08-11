(() => {
  const grid = document.querySelector('[data-portfolio-grid]');
  if (!grid || !Array.isArray(window.NW_PORTFOLIO)) return;

  const seen = new Set();
  const caseStudies = window.NW_PORTFOLIO.filter((project) => {
    const key = `${project.client}|${project.title}`.toLowerCase();
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).map((project) => ({ ...project, archive: false }));

  const visualArchive = Array.isArray(window.NW_PORTFOLIO_ARCHIVE)
    ? window.NW_PORTFOLIO_ARCHIVE
    : [];

  const allWorks = [...caseStudies, ...visualArchive];
  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const categoryCopy = {
    all: {
      title: 'All Works',
      copy: '브랜딩 케이스스터디와 패키지·에디토리얼·IR/PPT 단일 제작물 아카이브를 함께 모았습니다. 케이스스터디는 상세 페이지로, 단일 제작물은 Quick View로 확인할 수 있습니다.'
    },
    branding: {
      title: 'Branding',
      copy: '브랜드의 방향과 아이덴티티를 중심으로 패키지, 화면, 콘텐츠와 운영 접점까지 확장한 프로젝트 케이스입니다.'
    },
    package: {
      title: 'Package Design',
      copy: '식품, 건강기능식품, 뷰티, 리빙과 소비재를 중심으로 실제 제작한 패키지 디자인을 단일 이미지 아카이브로 정리했습니다.'
    },
    editorial: {
      title: 'Editorial Design',
      copy: '브로셔, 카탈로그, 리플렛, 회사소개서, 전시 인쇄물과 교육 자료 등 정보 구조와 편집 디자인 작업을 모았습니다.'
    },
    ir: {
      title: 'IR / PPT',
      copy: '스타트업과 기업의 사업계획, 투자제안, 서비스 소개와 발표를 위한 IR·PPT·프레젠테이션 디자인 아카이브입니다.'
    },
    detailpage: {
      title: 'Detail Page',
      copy: '제품의 기능, 소구 포인트와 브랜드 메시지를 구매 흐름에 맞춰 구조화한 상세페이지 및 디지털 커머스 디자인입니다.'
    },
    event: {
      title: 'Event Design',
      copy: '행사, 전시, 팝업과 데모데이처럼 일정한 기간과 공간 안에서 브랜드 경험을 만드는 이벤트 비주얼 프로젝트입니다.'
    }
  };

  const cardMarkup = (project) => {
    const categories = escapeHTML((project.filters || []).join(' '));
    const title = escapeHTML(project.title);
    const subtitle = escapeHTML(project.subtitle || '');
    const scope = escapeHTML(project.scope || '');
    const thumbnail = escapeHTML(project.thumbnail || project.image || '');

    if (project.archive) {
      return `
        <article class="portfolio-card portfolio-card--archive portfolio-filter-item is-visible" data-category="${categories}">
          <a class="portfolio-card__link" href="#quick-view" data-archive-id="${escapeHTML(project.id)}" aria-label="${title} 이미지 크게 보기">
            <div class="portfolio-card__media"><img src="${thumbnail}" alt="${title}" loading="lazy"></div>
            <div class="portfolio-card__info">
              <div><strong>${title}</strong><span>${subtitle}</span></div>
              <span class="portfolio-card__scope">${scope}</span>
            </div>
          </a>
        </article>`;
    }

    const href = `portfolio-detail.html?work=${encodeURIComponent(project.id)}`;
    return `
      <article class="portfolio-card portfolio-filter-item reveal" data-category="${categories}">
        <a class="portfolio-card__link" href="${href}" aria-label="${title} 포트폴리오 상세 보기">
          <div class="portfolio-card__media"><img src="${thumbnail}" alt="${title}" loading="lazy"></div>
          <div class="portfolio-card__info">
            <div><strong>${title}</strong><span>${subtitle}</span></div>
            <span class="portfolio-card__scope">${scope}</span>
          </div>
        </a>
      </article>`;
  };

  grid.innerHTML = allWorks.map(cardMarkup).join('');

  const modal = document.createElement('div');
  modal.className = 'portfolio-quickview';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `
    <div class="portfolio-quickview__head">
      <span class="portfolio-quickview__label">NINEWORKS / Visual Archive</span>
      <button class="portfolio-quickview__close" type="button" data-quickview-close>CLOSE</button>
    </div>
    <div class="portfolio-quickview__stage"><img alt="" data-quickview-image></div>
    <div class="portfolio-quickview__foot">
      <h2 class="portfolio-quickview__title" data-quickview-title></h2>
      <span class="portfolio-quickview__category" data-quickview-category></span>
    </div>`;
  document.body.appendChild(modal);

  const modalImage = modal.querySelector('[data-quickview-image]');
  const modalTitle = modal.querySelector('[data-quickview-title]');
  const modalCategory = modal.querySelector('[data-quickview-category]');

  const closeQuickView = () => {
    modal.classList.remove('is-open');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-portfolio-quickview-open');
  };

  const openQuickView = (project) => {
    if (!project) return;
    modalImage.src = project.image || project.thumbnail;
    modalImage.alt = project.title;
    modalTitle.textContent = project.title;
    modalCategory.textContent = project.subtitle || project.category || 'Visual Archive';
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-portfolio-quickview-open');
  };

  grid.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-archive-id]');
    if (!trigger) return;
    event.preventDefault();
    const project = visualArchive.find((item) => item.id === trigger.dataset.archiveId);
    openQuickView(project);
  });

  modal.querySelector('[data-quickview-close]')?.addEventListener('click', closeQuickView);
  modal.addEventListener('click', (event) => {
    if (event.target === modal || event.target.classList.contains('portfolio-quickview__stage')) closeQuickView();
  });
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && modal.classList.contains('is-open')) closeQuickView();
  });

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
  } else revealItems.forEach((item) => item.classList.add('is-visible'));

  const titleEl = document.querySelector('[data-portfolio-index-title]');
  const copyEl = document.querySelector('[data-portfolio-index-copy]');
  const countEl = document.querySelector('[data-portfolio-index-count]');

  const updateArchiveHead = (filter) => {
    const meta = categoryCopy[filter] || categoryCopy.all;
    const count = filter === 'all'
      ? allWorks.length
      : allWorks.filter((item) => (item.filters || []).includes(filter)).length;
    if (titleEl) titleEl.textContent = meta.title;
    if (copyEl) copyEl.textContent = meta.copy;
    if (countEl) countEl.textContent = `${String(count).padStart(2, '0')} WORKS`;
  };

  const group = document.querySelector('.portfolio-filter[data-filter-group]');
  if (group) {
    const buttons = group.querySelectorAll('[data-filter]');
    buttons.forEach((button) => button.addEventListener('click', () => {
      const filter = button.dataset.filter;
      buttons.forEach((item) => item.classList.toggle('is-active', item === button));
      grid.querySelectorAll('.portfolio-filter-item').forEach((item) => {
        const categories = (item.dataset.category || '').split(' ');
        item.hidden = filter !== 'all' && !categories.includes(filter);
      });
      updateArchiveHead(filter);
    }));
  }

  updateArchiveHead('all');
})();