(() => {
  const root = document.getElementById('develop-static-root');
  if (!root) return;

  const esc = (value = '') => String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  const work = window.NW_WORK;
  const fallbackTitle = root.dataset.fallbackTitle || 'Develop Project';
  const fallbackSubtitle = root.dataset.fallbackSubtitle || 'NINEWORKS Digital System Project';
  const fallbackLive = root.dataset.fallbackLive || '';

  if (!work || !work.id) {
    root.className = 'portfolio-split-detail';
    root.innerHTML = `<aside class="portfolio-detail-sidebar"><div class="portfolio-detail-sidebar__inner">
      <div class="portfolio-detail-sidebar__top"><p class="portfolio-detail-kicker">Develop / Digital System</p><h1>${esc(fallbackTitle)}</h1><p class="portfolio-detail-scope">${esc(fallbackSubtitle)}</p>${fallbackLive ? `<a class="portfolio-detail-live" href="${esc(fallbackLive)}" target="_blank" rel="noopener noreferrer"><span>VIEW LIVE SITE</span><span>↗</span></a>` : ''}</div>
      <div class="portfolio-detail-story"><p class="portfolio-detail-story__lead">프로젝트 기본 정보는 정상적으로 열렸습니다.</p><p class="portfolio-detail-story__summary">상세 데이터 파일을 불러오지 못했습니다. 포트폴리오 목록으로 돌아가거나 라이브 사이트를 확인해주세요.</p></div>
      <a class="portfolio-detail-back" href="portfolio.html?category=develop">← Back to Portfolio</a>
    </div></aside><article class="portfolio-detail-scroll"><section class="portfolio-scroll-section"><header class="portfolio-scroll-section__head"><div class="portfolio-scroll-section__meta"><span class="portfolio-scroll-section__index">01</span><span class="portfolio-scroll-section__label">Develop Project</span></div><h2>${esc(fallbackSubtitle)}</h2></header></section></article>`;
    return;
  }

  document.title = `${work.title} — NINEWORKS`;
  const meta = document.querySelector('meta[name="description"]');
  if (meta) meta.content = `${work.title} ${work.subtitle || ''} — NINEWORKS`;

  const facts = [
    ['Client', work.client],
    ['Scope', work.scope],
    ['Category', work.category],
    ['Role', work.role],
    ['Year', work.year]
  ].filter(([, value]) => value);

  const sections = Array.isArray(work.sections) ? work.sections : [];
  const dev = work.develop || {};

  const stats = Array.isArray(dev.stats) ? dev.stats.map((item) => `<article class="dev-case-stat"><span class="dev-case-stat__label">${esc(item.label)}</span><strong>${esc(item.value)}</strong>${item.copy ? `<p>${esc(item.copy)}</p>` : ''}</article>`).join('') : '';

  const block = (label, title, copy, items, itemRenderer) => {
    if (!Array.isArray(items) || !items.length) return '';
    return `<div class="dev-case-heading"><span>${esc(label)}</span><h3>${esc(title)}</h3>${copy ? `<p>${esc(copy)}</p>` : ''}</div>${itemRenderer(items)}`;
  };

  const planning = block('01 / PLANNING LAYER', '기획을 화면보다 먼저 설계했습니다.', dev.planningCopy, dev.planning, (items) => `<div class="dev-planning-grid">${items.map((item) => `<article class="dev-planning-card"><span>${esc(item.no)}</span><h4>${esc(item.title)}</h4><p>${esc(item.copy)}</p></article>`).join('')}</div>`);
  const architecture = block('02 / SYSTEM ARCHITECTURE', '서비스 구조를 하나의 흐름으로 연결했습니다.', dev.architectureCopy, dev.architecture, (items) => `<div class="dev-architecture">${items.map((item) => `<article class="dev-architecture__node"><small>${esc(item.no)}</small><strong>${esc(item.title)}</strong><p>${esc(item.copy)}</p></article>`).join('')}</div>`);
  const stack = block('03 / DEVELOPMENT STACK', '구축에 사용한 기술과 역할입니다.', dev.stackCopy, dev.stack, (items) => `<div class="dev-stack-grid">${items.map((item) => `<article class="dev-stack-card"><small>${esc(item.no)}</small><strong>${esc(item.title)}</strong><p>${esc(item.copy)}</p></article>`).join('')}</div>`);
  const sitemap = block('04 / INFORMATION ARCHITECTURE', '정보와 기능을 목적별로 정리했습니다.', dev.sitemapCopy, dev.sitemap, (items) => `<div class="dev-sitemap">${items.map((group) => `<article class="dev-sitemap__group"><span>${esc(group.no)}</span><h4>${esc(group.title)}</h4><ul>${(group.items || []).map((item) => `<li>${esc(item)}</li>`).join('')}</ul></article>`).join('')}</div>`);
  const dataFlow = block('05 / DATA FLOW', '사용자의 행동이 실제 운영 흐름으로 이어집니다.', dev.dataFlowCopy, dev.dataFlow, (items) => `<div class="dev-data-flow">${items.map((item) => `<article class="dev-data-flow__step"><small>${esc(item.no)}</small><strong>${esc(item.title)}</strong><p>${esc(item.copy)}</p></article>`).join('')}</div>`);
  const codeMap = block('06 / CODE STRUCTURE', '핵심 기능을 역할별 구조로 정리했습니다.', dev.codeMapCopy, dev.codeMap, (items) => `<div class="dev-code-map">${items.map((item) => `<article class="dev-code-card"><div class="dev-code-card__head"><span>${esc(item.label)}</span><span>${esc(item.file || '')}</span></div><code>${esc(item.code || '')}</code>${item.copy ? `<p>${esc(item.copy)}</p>` : ''}</article>`).join('')}</div>`);
  const deployment = block('07 / DEPLOYMENT & OPERATION', '배포 이후 운영까지 고려했습니다.', dev.deploymentCopy, dev.deployment, (items) => `<div class="dev-deployment">${items.map((item) => `<div class="dev-deployment__row"><span>${esc(item.label)}</span><strong>${esc(item.value)}</strong></div>`).join('')}</div>`);

  const devSystem = (stats || planning || architecture || stack || sitemap || dataFlow || codeMap || deployment) ? `<section class="dev-case-system" id="develop-system"><div class="dev-case-system__eyebrow"><span>NINEWORKS / DEVELOP SYSTEM CASE</span><span>${esc(dev.version || 'BUILD 2026')}</span></div><h2 class="dev-case-system__title">${esc(dev.title || 'From planning to a working digital system.')}</h2>${stats ? `<div class="dev-case-stats">${stats}</div>` : ''}${planning}${architecture}${stack}${sitemap}${dataFlow}${codeMap}${deployment}</section>` : '';

  const sectionHTML = sections.map((section, index) => {
    const paragraphs = (section.paragraphs || []).filter(Boolean).map((text) => `<p>${esc(text)}</p>`).join('');
    const images = (section.images || []).filter(Boolean).map((src, imageIndex) => `<figure class="portfolio-scroll-media"><img src="${esc(src)}" alt="${esc(work.title)} ${esc(section.label || '')} ${imageIndex + 1}" loading="lazy"></figure>`).join('');
    return `<section class="portfolio-scroll-section" id="work-section-${index + 1}"><header class="portfolio-scroll-section__head"><div class="portfolio-scroll-section__meta"><span class="portfolio-scroll-section__index">${String(index + 1).padStart(2, '0')}</span><span class="portfolio-scroll-section__label">${esc(section.label || 'Project Detail')}</span></div><h2>${esc(section.title || section.label || '')}</h2></header>${paragraphs ? `<div class="portfolio-scroll-copy">${paragraphs}</div>` : ''}${images ? `<div class="portfolio-scroll-stack">${images}</div>` : ''}</section>`;
  }).join('');

  const indexHTML = `${devSystem ? '<a href="#develop-system"><span>00</span>System Architecture</a>' : ''}${sections.map((section, index) => `<a href="#work-section-${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span>${esc(section.label || `Section ${index + 1}`)}</a>`).join('')}`;
  const liveUrl = work.liveUrl || fallbackLive;

  root.className = 'portfolio-split-detail';
  root.innerHTML = `<aside class="portfolio-detail-sidebar"><div class="portfolio-detail-sidebar__inner"><div class="portfolio-detail-sidebar__top"><p class="portfolio-detail-kicker">Develop / Digital System</p><h1>${esc(work.title)}</h1><p class="portfolio-detail-scope">${esc(work.subtitle || work.scope || '')}</p>${liveUrl ? `<a class="portfolio-detail-live" href="${esc(liveUrl)}" target="_blank" rel="noopener noreferrer"><span>VIEW LIVE SITE</span><span>↗</span></a>` : ''}</div><div class="portfolio-detail-story">${work.lead ? `<p class="portfolio-detail-story__lead">${esc(work.lead)}</p>` : ''}${work.summary ? `<p class="portfolio-detail-story__summary">${esc(work.summary)}</p>` : ''}</div><dl class="portfolio-detail-facts">${facts.map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl>${indexHTML ? `<nav class="portfolio-detail-index" aria-label="프로젝트 섹션">${indexHTML}</nav>` : ''}<a class="portfolio-detail-back" href="portfolio.html?category=develop">← Back to Portfolio</a></div></aside><article class="portfolio-detail-scroll">${work.thumbnail ? `<figure class="portfolio-scroll-media portfolio-scroll-media--hero"><img src="${esc(work.thumbnail)}" alt="${esc(work.title)} main visual"></figure>` : ''}${devSystem}${sectionHTML}<section class="portfolio-scroll-credit"><p>Project Credit</p><dl>${facts.slice(0, 4).map(([key, value]) => `<div><dt>${esc(key)}</dt><dd>${esc(value)}</dd></div>`).join('')}</dl></section></article>`;

  window.NW_WORK = null;
})();
