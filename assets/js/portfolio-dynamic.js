(() => {
  const root = document.querySelector('[data-portfolio-detail-root]');
  if (!root) return;

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const params = new URLSearchParams(window.location.search);
  const id = (params.get('work') || '').replace(/[^a-z0-9-]/gi, '');

  const renderNotFound = () => {
    root.innerHTML = `<section class="portfolio-not-found"><p class="eyebrow">Portfolio</p><h1>Project not found.</h1><a class="text-link" href="portfolio.html">BACK TO PORTFOLIO <span>↗</span></a></section>`;
  };

  const listedProject = () => Array.isArray(window.NW_PORTFOLIO)
    ? window.NW_PORTFOLIO.find((project) => project.id === id)
    : null;

  const expandArchiveUrl = (value = '') => {
    const archive = window.NW_IMAGE_ARCHIVE;
    if (!value || !archive) return value;
    if (value.startsWith('@B')) return `${archive.b}${value.slice(2)}`;
    if (value.startsWith('@U')) return value.slice(2);
    if (/^https?:\/\//i.test(value)) return value;
    return `${archive.p}${value}`;
  };

  const projectFromArchive = (project) => {
    if (!project) return null;
    const archive = window.NW_IMAGE_ARCHIVE?.w?.[project.id];
    const sourceSummary = window.NW_SUMMARY_ARCHIVE?.[project.id];
    const category = Array.isArray(project.filters)
      ? project.filters.map((item) => item.charAt(0).toUpperCase() + item.slice(1)).join(' · ')
      : '';
    const overview = sourceSummary?.[1] || `${project.title} 프로젝트는 ${project.subtitle || project.scope || '브랜드의 시각적 경험'}을 중심으로 진행한 나인웍스의 디자인 작업입니다. 브랜드의 핵심 인상이 실제 사용 환경과 다양한 접점에서 일관되게 이어지도록 아이덴티티, 이미지, 정보 구조와 응용 디자인을 함께 정리했습니다.`;
    const lead = sourceSummary?.[0] || project.subtitle || project.scope;

    const archiveSections = Array.isArray(archive?.[1]) ? archive[1] : [];
    const sections = archiveSections.map(([title, images], index) => ({
      label: title || `Visual Archive ${String(index + 1).padStart(2, '0')}`,
      title: title || `Visual Archive ${String(index + 1).padStart(2, '0')}`,
      paragraphs: [
        index === 0
          ? overview
          : `${project.title} 프로젝트에서 ${title || '주요 비주얼'}을 중심으로 전개한 작업입니다. 결과물이 개별 이미지로 분리되어 보이기보다 하나의 브랜드 경험으로 연결되도록 시각적 톤과 적용 방식을 일관된 흐름으로 구성했습니다.`
      ],
      images: Array.isArray(images) ? images.map(expandArchiveUrl) : []
    }));

    return {
      id: project.id,
      title: project.title,
      subtitle: project.subtitle,
      lead,
      summary: overview,
      client: project.client,
      scope: project.scope,
      category,
      role: 'Design Direction · NINEWORKS',
      thumbnail: expandArchiveUrl(archive?.[0]) || project.thumbnail,
      sections: sections.length ? sections : [{ label: 'Project Overview', title: project.title, paragraphs: [overview], images: [] }]
    };
  };

  const heading = (index, title, copy = '') => `
    <div class="dev-case-heading">
      <span>${escapeHTML(index)}</span>
      <h3>${escapeHTML(title)}</h3>
      ${copy ? `<p>${escapeHTML(copy)}</p>` : ''}
    </div>`;

  const renderDevelopCase = (work) => {
    const dev = work.develop;
    if (!dev) return '';

    const stats = (dev.stats || []).map((item) => `
      <article class="dev-case-stat">
        <span class="dev-case-stat__label">${escapeHTML(item.label)}</span>
        <strong>${escapeHTML(item.value)}</strong>
        ${item.copy ? `<p>${escapeHTML(item.copy)}</p>` : ''}
      </article>`).join('');

    const planning = (dev.planning || []).map((item) => `
      <article class="dev-planning-card">
        <span>${escapeHTML(item.no)}</span>
        <h4>${escapeHTML(item.title)}</h4>
        <p>${escapeHTML(item.copy)}</p>
      </article>`).join('');

    const architecture = (dev.architecture || []).map((item) => `
      <article class="dev-architecture__node">
        <small>${escapeHTML(item.no)}</small>
        <strong>${escapeHTML(item.title)}</strong>
        <p>${escapeHTML(item.copy)}</p>
      </article>`).join('');

    const stack = (dev.stack || []).map((item) => `
      <article class="dev-stack-card">
        <small>${escapeHTML(item.no)}</small>
        <strong>${escapeHTML(item.title)}</strong>
        <p>${escapeHTML(item.copy)}</p>
      </article>`).join('');

    const sitemap = (dev.sitemap || []).map((group) => `
      <article class="dev-sitemap__group">
        <span>${escapeHTML(group.no)}</span>
        <h4>${escapeHTML(group.title)}</h4>
        <ul>${(group.items || []).map((item) => `<li>${escapeHTML(item)}</li>`).join('')}</ul>
      </article>`).join('');

    const dataFlow = (dev.dataFlow || []).map((item) => `
      <article class="dev-data-flow__step">
        <small>${escapeHTML(item.no)}</small>
        <strong>${escapeHTML(item.title)}</strong>
        <p>${escapeHTML(item.copy)}</p>
      </article>`).join('');

    const codeMap = (dev.codeMap || []).map((item) => `
      <article class="dev-code-card">
        <div class="dev-code-card__head"><span>${escapeHTML(item.label)}</span><span>${escapeHTML(item.file || '')}</span></div>
        <code>${escapeHTML(item.code)}</code>
        ${item.copy ? `<p>${escapeHTML(item.copy)}</p>` : ''}
      </article>`).join('');

    const deployment = (dev.deployment || []).map((item) => `
      <div class="dev-deployment__row"><span>${escapeHTML(item.label)}</span><strong>${escapeHTML(item.value)}</strong></div>`).join('');

    return `<section class="dev-case-system" id="develop-system">
      <div class="dev-case-system__eyebrow"><span>NINEWORKS / DEVELOP SYSTEM CASE</span><span>${escapeHTML(dev.version || 'BUILD 01')}</span></div>
      <h2 class="dev-case-system__title">${escapeHTML(dev.title || 'From planning to a working digital system.')}</h2>
      ${stats ? `<div class="dev-case-stats">${stats}</div>` : ''}
      ${planning ? `${heading('01 / PLANNING LAYER', '기획을 화면보다 먼저 설계했습니다.', dev.planningCopy || '')}<div class="dev-planning-grid">${planning}</div>` : ''}
      ${architecture ? `${heading('02 / SYSTEM ARCHITECTURE', '고객 화면과 운영 데이터를 하나의 흐름으로 연결했습니다.', dev.architectureCopy || '')}<div class="dev-architecture">${architecture}</div>` : ''}
      ${stack ? `${heading('03 / DEVELOPMENT STACK', '실제 구축에 사용한 기술과 역할입니다.', dev.stackCopy || '')}<div class="dev-stack-grid">${stack}</div>` : ''}
      ${sitemap ? `${heading('04 / INFORMATION ARCHITECTURE', '사용자 메뉴와 운영 기능을 목적별로 분리했습니다.', dev.sitemapCopy || '')}<div class="dev-sitemap">${sitemap}</div>` : ''}
      ${dataFlow ? `${heading('05 / DATA FLOW', '견적 입력부터 관리자 처리까지 데이터 흐름을 설계했습니다.', dev.dataFlowCopy || '')}<div class="dev-data-flow">${dataFlow}</div>` : ''}
      ${codeMap ? `${heading('06 / CODE STRUCTURE', '기능을 구성하는 실제 코드 단위를 포트폴리오 관점에서 정리했습니다.', dev.codeMapCopy || '')}<div class="dev-code-map">${codeMap}</div>` : ''}
      ${deployment ? `${heading('07 / DEPLOYMENT & OPERATION', '배포 이후 운영과 수정까지 이어질 수 있는 구조로 구축했습니다.', dev.deploymentCopy || '')}<div class="dev-deployment">${deployment}</div>` : ''}
    </section>`;
  };

  const render = (work) => {
    if (!work) return renderNotFound();
    document.title = `${work.title} — NINEWORKS`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `${work.title} ${work.subtitle || ''} — NINEWORKS`;

    document.body.classList.toggle('portfolio-develop-mode', Boolean(work.develop));

    const facts = [['Client', work.client], ['Scope', work.scope], ['Category', work.category], ['Role', work.role], ['Year', work.year]].filter(([, value]) => value);
    const sections = Array.isArray(work.sections) && work.sections.length ? work.sections : [];
    const devIndex = work.develop ? `<a href="#develop-system"><span>00</span>System Architecture</a>` : '';
    const indexHTML = devIndex + sections.map((section, index) => `<a href="#work-section-${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHTML(section.label || `Section ${index + 1}`)}</a>`).join('');

    const sectionsHTML = sections.map((section, index) => {
      const paragraphs = (section.paragraphs || []).filter(Boolean).map((text) => `<p>${escapeHTML(text)}</p>`).join('');
      const images = (section.images || []).filter(Boolean).map((src, imageIndex) => `<figure class="portfolio-scroll-media reveal"><img src="${escapeHTML(src)}" alt="${escapeHTML(work.title)} ${escapeHTML(section.label || '')} ${imageIndex + 1}" loading="lazy"></figure>`).join('');
      return `<section class="portfolio-scroll-section" id="work-section-${index + 1}">
        <header class="portfolio-scroll-section__head">
          <div class="portfolio-scroll-section__meta"><span class="portfolio-scroll-section__index">${String(index + 1).padStart(2, '0')}</span><span class="portfolio-scroll-section__label">${escapeHTML(section.label || 'Project Detail')}</span></div>
          <h2>${escapeHTML(section.title || section.label || `Section ${index + 1}`)}</h2>
          ${section.subtitle ? `<p class="portfolio-scroll-section__sub">${escapeHTML(section.subtitle)}</p>` : ''}
        </header>
        ${paragraphs ? `<div class="portfolio-scroll-copy">${paragraphs}</div>` : ''}
        ${images ? `<div class="portfolio-scroll-stack">${images}</div>` : ''}
      </section>`;
    }).join('');

    const liveLink = work.liveUrl
      ? `<a class="portfolio-detail-live" href="${escapeHTML(work.liveUrl)}" target="_blank" rel="noreferrer"><span>VIEW LIVE SITE</span><span>↗</span></a>`
      : '';

    root.className = 'portfolio-split-detail';
    root.innerHTML = `<aside class="portfolio-detail-sidebar"><div class="portfolio-detail-sidebar__inner">
      <div class="portfolio-detail-sidebar__top"><p class="portfolio-detail-kicker">${work.develop ? 'Develop / Digital System' : 'Portfolio / Selected Work'}</p><h1>${escapeHTML(work.title)}</h1><p class="portfolio-detail-scope">${escapeHTML(work.subtitle || work.scope || '')}</p>${liveLink}</div>
      <div class="portfolio-detail-story">${work.lead ? `<p class="portfolio-detail-story__lead">${escapeHTML(work.lead)}</p>` : ''}${work.summary ? `<p class="portfolio-detail-story__summary">${escapeHTML(work.summary)}</p>` : ''}</div>
      <dl class="portfolio-detail-facts">${facts.map(([key, value]) => `<div><dt>${escapeHTML(key)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl>
      ${indexHTML ? `<nav class="portfolio-detail-index" aria-label="프로젝트 섹션">${indexHTML}</nav>` : ''}
      <a class="portfolio-detail-back" href="portfolio.html">← Back to Portfolio</a>
    </div></aside>
    <article class="portfolio-detail-scroll">${work.thumbnail ? `<figure class="portfolio-scroll-media portfolio-scroll-media--hero reveal"><img src="${escapeHTML(work.thumbnail)}" alt="${escapeHTML(work.title)} main visual"></figure>` : ''}${renderDevelopCase(work)}${sectionsHTML}<section class="portfolio-scroll-credit"><p>Project Credit</p><dl>${facts.slice(0,4).map(([key, value]) => `<div><dt>${escapeHTML(key)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl></section></article>`;

    const revealItems = root.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      }), { threshold: 0.05, rootMargin: '0px 0px -20px' });
      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add('is-visible'));
    }

    window.dispatchEvent(new Event('resize'));
  };

  if (!id) return renderNotFound();

  const bundled = window.NW_WORKS && window.NW_WORKS[id];
  if (bundled) {
    render(bundled);
    return;
  }

  const project = listedProject();
  const archiveFallback = projectFromArchive(project);
  if (!archiveFallback) return renderNotFound();

  const legacyScript = document.createElement('script');
  legacyScript.src = `assets/js/works/${id}.js?v=20260811-2`;
  legacyScript.onload = () => render(window.NW_WORK || archiveFallback);
  legacyScript.onerror = () => render(archiveFallback);
  document.body.appendChild(legacyScript);
})();
