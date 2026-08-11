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

  const rawVisualArchive = Array.isArray(window.NW_PORTFOLIO_ARCHIVE)
    ? window.NW_PORTFOLIO_ARCHIVE
    : [];
  const rawDetailArchive = Array.isArray(window.NW_DETAILPAGE_ARCHIVE)
    ? window.NW_DETAILPAGE_ARCHIVE
    : [];

  const getSourceOrder = (item) => {
    const explicit = Number(item.order ?? item.sourceOrder ?? item.index);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const match = String(item.id || '').match(/(\d+)(?!.*\d)/);
    return match ? Number(match[1]) : 0;
  };

  const getPackagePriority = (item) => {
    const text = `${item.title || ''} ${item.subtitle || ''}`.toLowerCase();
    if (/hollys|할리스/.test(text)) return 300;
    if (/yonsei|연세|kids\s?ten|키즈텐|healthd|헬씨드/.test(text)) return 200;
    if (/gong\s?cha|공차/.test(text)) return 100;
    return 0;
  };

  const visualArchive = rawVisualArchive
    .map((item, originalIndex) => ({ ...item, __originalIndex: originalIndex }))
    .sort((a, b) => {
      const aPackage = (a.filters || []).includes('package');
      const bPackage = (b.filters || []).includes('package');
      if (aPackage && bPackage) {
        const priorityDiff = getPackagePriority(b) - getPackagePriority(a);
        if (priorityDiff) return priorityDiff;
        const orderDiff = getSourceOrder(b) - getSourceOrder(a);
        if (orderDiff) return orderDiff;
      }
      return a.__originalIndex - b.__originalIndex;
    })
    .map(({ __originalIndex, ...item }) => ({ ...item, archive: true }));

  // 상세페이지는 원본 목록의 뒤쪽을 최근 작업으로 간주한다.
  const detailArchive = [...rawDetailArchive]
    .sort((a, b) => getSourceOrder(b) - getSourceOrder(a))
    .map((item) => ({ ...item, archive: true, popupType: 'gallery' }));

  const allArchives = [...visualArchive, ...detailArchive];
  const allWorks = [...caseStudies, ...visualArchive, ...detailArchive];

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const categoryCopy = {
    all: {
      title: 'All Works',
      copy: '브랜딩 케이스스터디와 패키지·에디토리얼·IR/PPT·상세페이지 제작물 아카이브를 함께 모았습니다. 케이스스터디는 상세 페이지로, 단일 제작물은 Quick View로 확인할 수 있습니다.'
    },
    branding: {
      title: 'Branding',
      copy: '브랜드의 방향과 아이덴티티를 중심으로 패키지, 화면, 콘텐츠와 운영 접점까지 확장한 프로젝트 케이스입니다.'
    },
    package: {
      title: 'Package Design',
      copy: '최근 작업과 주요 브랜드 프로젝트를 우선으로, 식품·건강기능식품·뷰티·리빙·소비재 패키지 디자인을 정리했습니다.'
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
      copy: '제품 정보와 핵심 소구 포인트를 구매 흐름에 맞게 설계한 상세페이지 작업입니다. 카드를 누르면 전체 이미지를 간단한 갤러리 팝업으로 확인할 수 있습니다.'
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
    const thumbnail = escapeHTML(project.thumbnail || project.image || (project.images || [])[0] || '');

    if (project.archive) {
      const quickLabel = (project.filters || []).includes('detailpage') ? 'VIEW DETAIL' : 'QUICK VIEW';
      return `
        <article class="portfolio-card portfolio-card--archive portfolio-filter-item is-visible" data-category="${categories}">
          <a class="portfolio-card__link" href="#quick-view" data-archive-id="${escapeHTML(project.id)}" aria-label="${title} 이미지 크게 보기">
            <div class="portfolio-card__media" data-quick-label="${quickLabel}"><img src="${thumbnail}" alt="${title}" loading="lazy"></div>
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
      <div class="portfolio-quickview__heading">
        <span class="portfolio-quickview__label" data-quickview-label>NINEWORKS / Visual Archive</span>
        <h2 class="portfolio-quickview__head-title" data-quickview-head-title></h2>
      </div>
      <button class="portfolio-quickview__close" type="button" data-quickview-close><span>CLOSE</span><i aria-hidden="true"></i></button>
    </div>
    <div class="portfolio-quickview__stage" data-quickview-stage></div>
    <div class="portfolio-quickview__foot">
      <span class="portfolio-quickview__category" data-quickview-category></span>
      <span class="portfolio-quickview__counter" data-quickview-counter></span>
    </div>`;
  document.body.appendChild(modal);

  const modalStage = modal.querySelector('[data-quickview-stage]');
  const modalHeadTitle = modal.querySelector('[data-quickview-head-title]');
  const modalLabel = modal.querySelector('[data-quickview-label]');
  const modalCategory = modal.querySelector('[data-quickview-category]');
  const modalCounter = modal.querySelector('[data-quickview-counter]');

  const closeQuickView = () => {
    modal.classList.remove('is-open', 'is-gallery');
    modal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('is-portfolio-quickview-open');
    modalStage.innerHTML = '';
  };

  const openQuickView = (project) => {
    if (!project) return;
    const images = Array.isArray(project.images) && project.images.length
      ? project.images
      : [project.image || project.thumbnail].filter(Boolean);
    const isDetail = (project.filters || []).includes('detailpage');
    const isGallery = images.length > 1 || isDetail;

    modal.classList.toggle('is-gallery', isGallery);
    modalHeadTitle.textContent = project.title || 'Project';
    modalLabel.textContent = isDetail ? 'NINEWORKS / DETAIL PAGE' : 'NINEWORKS / VISUAL ARCHIVE';
    modalCategory.textContent = project.subtitle || project.category || 'Visual Archive';
    modalCounter.textContent = images.length > 1 ? `${String(images.length).padStart(2, '0')} IMAGES` : '01 IMAGE';
    modalStage.innerHTML = images.map((src, index) => `
      <figure class="portfolio-quickview__image-wrap">
        <img src="${escapeHTML(src)}" alt="${escapeHTML(project.title)} ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}">
      </figure>`).join('');

    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('is-portfolio-quickview-open');
    modalStage.scrollTop = 0;
  };

  grid.addEventListener('click', (event) => {
    const trigger = event.target.closest('[data-archive-id]');
    if (!trigger) return;
    event.preventDefault();
    const project = allArchives.find((item) => item.id === trigger.dataset.archiveId);
    openQuickView(project);
  });

  modal.querySelector('[data-quickview-close]')?.addEventListener('click', closeQuickView);
  modal.addEventListener('click', (event) => {
    if (event.target === modal) closeQuickView();
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