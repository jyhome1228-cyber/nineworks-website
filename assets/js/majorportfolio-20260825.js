(() => {
  if (!document.querySelector('link[href*="majorportfolio-majorworks-20260825.css"]')) {
    const styleLink = document.createElement('link');
    styleLink.rel = 'stylesheet';
    styleLink.href = '/assets/css/majorportfolio-majorworks-20260825.css?v=20260825-1';
    document.head.appendChild(styleLink);
  }

  const onboarding = document.querySelector('[data-major-onboarding]');
  const enterButton = document.querySelector('[data-major-enter]');
  const sessionKey = 'nineworks-majorportfolio-entered';

  const hideOnboarding = (instant = false) => {
    if (!onboarding) return;
    document.body.classList.remove('is-onboarding');
    if (instant) {
      onboarding.hidden = true;
      return;
    }
    onboarding.classList.add('is-hidden');
    try { sessionStorage.setItem(sessionKey, '1'); } catch (_) {}
    window.setTimeout(() => { onboarding.hidden = true; }, 460);
  };

  if (onboarding) {
    let alreadyEntered = false;
    try { alreadyEntered = sessionStorage.getItem(sessionKey) === '1'; } catch (_) {}
    if (alreadyEntered) hideOnboarding(true);
    else document.body.classList.add('is-onboarding');
    enterButton?.addEventListener('click', () => hideOnboarding(false));
  }

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const renderMajorWorks = () => {
    const grid = document.querySelector('[data-major-works-grid]');
    if (!grid || !Array.isArray(window.NW_PORTFOLIO)) return;

    const seen = new Set();
    const works = window.NW_PORTFOLIO.filter((project) => {
      const key = `${project.client || ''}|${project.title || ''}`.toLowerCase();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    }).slice(0, 8);

    grid.innerHTML = works.map((project, index) => {
      const title = escapeHTML(project.title || 'Project');
      const subtitle = escapeHTML(project.subtitle || '');
      const scope = escapeHTML(project.scope || '');
      const thumbnail = escapeHTML(project.thumbnail || project.image || '');
      const href = `/portfolio-detail.html?work=${encodeURIComponent(project.id || '')}`;
      return `
        <article class="major-work-card">
          <a href="${href}" aria-label="${title} 포트폴리오 상세 보기">
            <figure class="major-work-card__media"><img src="${thumbnail}" alt="${title}" loading="${index < 2 ? 'eager' : 'lazy'}" decoding="async"></figure>
            <div class="major-work-card__info">
              <div><strong>${title}</strong><span>${subtitle}</span></div>
              <em>${scope}</em>
            </div>
          </a>
        </article>`;
    }).join('');
  };

  const normalizeCardLinks = (card) => {
    card.querySelectorAll('a[href]').forEach((anchor) => {
      const href = anchor.getAttribute('href') || '';
      if (!href || /^(?:https?:|mailto:|tel:|#|\/)/i.test(href)) return;
      anchor.setAttribute('href', `/${href.replace(/^\.?\//, '')}`);
    });
  };

  const hasDetailPage = (card) => {
    return [...card.querySelectorAll('a[href]')].some((anchor) => {
      const href = (anchor.getAttribute('href') || '').trim();
      if (!href || href === '#' || /^javascript:/i.test(href)) return false;
      return /(?:portfolio|project)[^?#]*\.html(?:[?#].*)?$/i.test(href);
    });
  };

  const isCoventryCard = (card) => {
    const href = card.querySelector('a[href]')?.getAttribute('href') || '';
    const text = card.textContent || '';
    return /coventry/i.test(href) || /coventry city/i.test(text);
  };

  const loadMainProjects = async () => {
    const grid = document.querySelector('[data-major-project-grid]');
    const note = document.querySelector('[data-major-project-note]');
    if (!grid) return;

    try {
      const response = await fetch('/project.html', { cache: 'no-store' });
      if (!response.ok) throw new Error(`project.html ${response.status}`);
      const html = await response.text();
      const doc = new DOMParser().parseFromString(html, 'text/html');

      const detailed = [...doc.querySelectorAll('.project-gallery__grid > .project-card')].filter(hasDetailPage);
      if (!detailed.length) throw new Error('No detailed project cards found');

      const coventry = detailed.find(isCoventryCard);
      let ordered = detailed.filter((card) => card !== coventry);
      if (coventry) ordered.splice(Math.min(5, ordered.length), 0, coventry);
      ordered = ordered.slice(0, 8);

      const fragment = document.createDocumentFragment();
      ordered.forEach((source, index) => {
        const card = source.cloneNode(true);
        normalizeCardLinks(card);
        card.querySelectorAll('img').forEach((image) => {
          image.decoding = 'async';
          image.loading = index < 2 ? 'eager' : 'lazy';
        });
        fragment.appendChild(card);
      });
      grid.replaceChildren(fragment);
      if (note) note.hidden = true;
    } catch (error) {
      console.warn('[NINEWORKS majorportfolio] branding portfolio load failed', error);
      if (note) {
        note.textContent = '브랜딩 프로젝트를 불러오지 못했습니다. 전체 포트폴리오에서 확인해 주세요.';
        note.classList.add('is-error');
      }
    }
  };

  const parseQuotedStrings = (source) => {
    const values = [];
    const regex = /'((?:\\'|[^'])*)'/g;
    let match;
    while ((match = regex.exec(source))) values.push(match[1].replace(/\\'/g, "'"));
    return values;
  };

  const extractArray = (source, constantName) => {
    const pattern = new RegExp(`const\\s+${constantName}\\s*=\\s*\\[([\\s\\S]*?)\\];`);
    const match = source.match(pattern);
    return match ? parseQuotedStrings(match[1]) : [];
  };

  const loadClientLogos = async () => {
    const grid = document.querySelector('[data-major-client-grid]');
    if (!grid || grid.children.length) return;

    try {
      const response = await fetch('/assets/js/client-logos-20260821.js', { cache: 'no-store' });
      if (!response.ok) throw new Error(`client data ${response.status}`);
      const source = await response.text();
      const logos = extractArray(source, 'CLIENT_LOGOS');
      const names = extractArray(source, 'CLIENT_NAMES');
      if (!logos.length) throw new Error('No client logos found');

      const fragment = document.createDocumentFragment();
      logos.forEach((src, index) => {
        const item = document.createElement('div');
        item.className = 'nw-logo-card';

        const image = document.createElement('img');
        const name = names[index] || '';
        image.src = src;
        image.alt = name ? `${name} 로고` : `나인웍스와 함께한 기업 로고 ${String(index + 1).padStart(2, '0')}`;
        image.loading = 'lazy';
        image.decoding = 'async';
        item.appendChild(image);

        if (name) {
          const caption = document.createElement('span');
          caption.className = 'nw-logo-card__name';
          caption.textContent = name;
          item.appendChild(caption);
          item.title = name;
        }
        fragment.appendChild(item);
      });
      grid.appendChild(fragment);
    } catch (error) {
      console.warn('[NINEWORKS majorportfolio] client data load failed', error);
      grid.innerHTML = '<p class="major-client-error">함께한 기업 데이터를 불러오지 못했습니다.</p>';
    }
  };

  const init = () => {
    renderMajorWorks();
    loadMainProjects();
    loadClientLogos();
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
  else init();
})();
