(() => {
  const grid = document.querySelector('.projects-page .project-gallery__grid');
  if (!grid) return;

  const normalize = (value = '') => String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9가-힣]/g, '');

  const cards = () => Array.from(grid.querySelectorAll(':scope > .project-card'));
  const titleOf = (card) => card.querySelector('h2')?.textContent.trim() || '';

  // Remove archived project and previously confirmed duplicate cards.
  cards().forEach((card) => {
    if (titleOf(card) === '드림팜') card.remove();
  });

  const onePlanCards = cards().filter((card) => normalize(titleOf(card)) === '1plan');
  onePlanCards.slice(1).forEach((card) => card.remove());

  // Keep the white-background Denovo Pharm. application card and remove the red duplicate.
  cards().forEach((card) => {
    if (normalize(titleOf(card)) !== 'denovopharm') return;
    const src = card.querySelector('img')?.getAttribute('src') || '';
    if (src.includes('1cfd2970b5c01.jpg')) card.remove();
  });

  // Keep the completed AESOST branding case in the selected project archive.
  if (!cards().some((card) => normalize(titleOf(card)) === 'aesost')) {
    const aesostCard = document.createElement('article');
    aesostCard.className = 'project-card';
    aesostCard.innerHTML = '<a href="portfolio-aesost-branding.html" aria-label="AESOST brand identity case study" style="display:block;color:inherit;text-decoration:none"><figure class="project-card__media"><img src="https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/4bbcadd1371fd.jpg" alt="AESOST brand identity project" loading="eager"></figure><div class="project-card__meta"><span>EDUCATION BRAND IDENTITY</span></div><h2>AESOST</h2><p>새로운 관점과 가능성을 퍼플 컬러와 유연한 심볼 시스템으로 구축한 브랜드 아이덴티티.</p></a>';
    grid.prepend(aesostCard);
  }

  const dedicatedLinks = {
    laff: 'portfolio-laff.html',
    taepyung: 'portfolio-taepyung.html'
  };

  const completedVisuals = {
    taepyung: {
      image: 'https://cdn.imweb.me/upload/S20251008dcc1c9d70e3ac/d462dbeb406c4.jpg',
      alt: 'Taepyung Paper corporate identity project',
      meta: 'CORPORATE IDENTITY',
      description: '1977년부터 이어온 제조 기업의 역사와 현장성을 로고, 공장, 패키지와 에디토리얼까지 하나의 시스템으로 정리한 프로젝트.'
    }
  };

  const applyCompletedVisual = (card) => {
    const data = completedVisuals[normalize(titleOf(card))];
    if (!data) return;
    const image = card.querySelector('img');
    if (image) {
      image.src = data.image;
      image.alt = data.alt;
    }
    const meta = card.querySelector('.project-card__meta span');
    if (meta) meta.textContent = data.meta;
    const description = card.querySelector('p');
    if (description) description.textContent = data.description;
  };

  const setCardLink = (card, href, label) => {
    if (!card || !href) return;

    const existingAnchor = card.querySelector(':scope > a[href]');
    if (existingAnchor) {
      card.dataset.completed = 'true';
      card.dataset.projectLink = existingAnchor.getAttribute('href') || href;
      card.classList.add('project-card--linked');
      return;
    }

    card.dataset.completed = 'true';
    card.dataset.projectLink = href;
    card.classList.add('project-card--linked');
    card.setAttribute('role', 'link');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', label || `${titleOf(card)} 포트폴리오 상세 보기`);
    card.style.cursor = 'pointer';

    const open = () => { window.location.href = href; };
    card.addEventListener('click', (event) => {
      if (event.target.closest('a, button, input, select, textarea')) return;
      open();
    });
    card.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        open();
      }
    });
  };

  cards().forEach((card) => {
    applyCompletedVisual(card);

    const existingAnchor = card.querySelector(':scope > a[href]');
    if (existingAnchor && /portfolio/i.test(existingAnchor.getAttribute('href') || '')) {
      card.dataset.completed = 'true';
      card.dataset.projectLink = existingAnchor.getAttribute('href') || '';
      card.classList.add('project-card--linked');
    }

    const manual = dedicatedLinks[normalize(titleOf(card))];
    if (manual) setCardLink(card, manual);
  });

  const portfolioScripts = [
    'assets/js/portfolio-list-1.js?v=20260810-2',
    'assets/js/portfolio-list-2.js?v=20260810-2',
    'assets/js/portfolio-list-3.js?v=20260810-2',
    'assets/js/portfolio-list-4.js?v=20260812-10',
    'assets/js/portfolio-list-5.js?v=20260812-2'
  ];

  const loadScript = (src) => new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.async = false;
    script.onload = resolve;
    script.onerror = resolve;
    document.head.appendChild(script);
  });

  const scoreMatch = (projectKey, candidate) => {
    const id = normalize(candidate?.id || '');
    const title = normalize(candidate?.title || '');
    const client = normalize(candidate?.client || '');
    const values = [id, title, client].filter(Boolean);

    if (values.includes(projectKey)) return 100;
    if (projectKey.length < 5) return 0;

    let score = 0;
    values.forEach((value) => {
      if (value.startsWith(projectKey) || value.endsWith(projectKey)) score = Math.max(score, 85);
      else if (projectKey.startsWith(value) || projectKey.endsWith(value)) score = Math.max(score, 82);
      else if (value.includes(projectKey) || projectKey.includes(value)) score = Math.max(score, 72);
    });
    return score;
  };

  const findPortfolioMatch = (card) => {
    if (!Array.isArray(window.NW_PORTFOLIO)) return null;
    const key = normalize(titleOf(card));
    if (!key) return null;

    return window.NW_PORTFOLIO
      .map((project) => ({ project, score: scoreMatch(key, project) }))
      .filter((item) => item.score > 0)
      .sort((a, b) => b.score - a.score || normalize(a.project.title).length - normalize(b.project.title).length)[0]?.project || null;
  };

  const arrangeCompletedFirst = () => {
    const current = cards();
    const completed = current.filter((card) => card.dataset.completed === 'true');
    const remaining = current.filter((card) => card.dataset.completed !== 'true');
    const fragment = document.createDocumentFragment();

    // Completed / portfolio-connected cases are always shown first.
    [...completed, ...remaining].forEach((card, index) => {
      const image = card.querySelector('img');
      if (image) image.loading = index < 6 ? 'eager' : 'lazy';
      fragment.appendChild(card);
    });
    grid.appendChild(fragment);

    const count = document.querySelector('.project-gallery__count');
    if (count) count.textContent = `${current.length} PROJECTS`;
  };

  const connectPortfolio = () => {
    cards().forEach((card) => {
      if (card.dataset.completed === 'true') return;
      const project = findPortfolioMatch(card);
      if (!project) return;
      const href = project.detailUrl || `portfolio-detail.html?work=${encodeURIComponent(project.id)}`;
      setCardLink(card, href, `${titleOf(card)} 포트폴리오 상세 보기`);
    });
    arrangeCompletedFirst();
  };

  if (Array.isArray(window.NW_PORTFOLIO) && window.NW_PORTFOLIO.length) {
    connectPortfolio();
  } else {
    Promise.all(portfolioScripts.map(loadScript)).then(connectPortfolio);
  }
})();