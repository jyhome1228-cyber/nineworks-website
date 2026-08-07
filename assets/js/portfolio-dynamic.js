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

  const render = (work) => {
    if (!work) return renderNotFound();
    document.title = `${work.title} — NINEWORKS`;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = `${work.title} ${work.subtitle || ''} — NINEWORKS`;

    const facts = [['Client', work.client], ['Scope', work.scope], ['Category', work.category], ['Role', work.role], ['Year', work.year]].filter(([, value]) => value);
    const sections = Array.isArray(work.sections) ? work.sections : [];
    const indexHTML = sections.map((section, index) => `<a href="#work-section-${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHTML(section.label || `Section ${index + 1}`)}</a>`).join('');

    const sectionsHTML = sections.map((section, index) => {
      const paragraphs = (section.paragraphs || []).map((text) => `<p>${escapeHTML(text)}</p>`).join('');
      const images = (section.images || []).map((src, imageIndex) => `<figure class="portfolio-scroll-media reveal"><img src="${escapeHTML(src)}" alt="${escapeHTML(work.title)} ${escapeHTML(section.label || '')} ${imageIndex + 1}" loading="lazy"></figure>`).join('');
      return `<section class="portfolio-scroll-section" id="work-section-${index + 1}">
        <header class="portfolio-scroll-section__head">
          <div class="portfolio-scroll-section__meta"><span class="portfolio-scroll-section__index">${String(index + 1).padStart(2, '0')}</span><span class="portfolio-scroll-section__label">${escapeHTML(section.label || 'Project Detail')}</span></div>
          <h2>${escapeHTML(section.title || section.label || `Section ${index + 1}`)}</h2>
          ${section.subtitle ? `<p class="portfolio-scroll-section__sub">${escapeHTML(section.subtitle)}</p>` : ''}
        </header>
        ${paragraphs ? `<div class="portfolio-scroll-copy">${paragraphs}</div>` : ''}
        <div class="portfolio-scroll-stack">${images}</div>
      </section>`;
    }).join('');

    root.className = 'portfolio-split-detail';
    root.innerHTML = `<aside class="portfolio-detail-sidebar"><div class="portfolio-detail-sidebar__inner">
      <div class="portfolio-detail-sidebar__top"><p class="portfolio-detail-kicker">Portfolio / Selected Work</p><h1>${escapeHTML(work.title)}</h1><p class="portfolio-detail-scope">${escapeHTML(work.subtitle || work.scope || '')}</p></div>
      <div class="portfolio-detail-story">${work.lead ? `<p class="portfolio-detail-story__lead">${escapeHTML(work.lead)}</p>` : ''}${work.summary ? `<p class="portfolio-detail-story__summary">${escapeHTML(work.summary)}</p>` : ''}</div>
      <dl class="portfolio-detail-facts">${facts.map(([key, value]) => `<div><dt>${escapeHTML(key)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl>
      <nav class="portfolio-detail-index" aria-label="프로젝트 섹션">${indexHTML}</nav>
      <a class="portfolio-detail-back" href="portfolio.html">← Back to Portfolio</a>
    </div></aside>
    <article class="portfolio-detail-scroll">${work.thumbnail ? `<figure class="portfolio-scroll-media portfolio-scroll-media--hero reveal"><img src="${escapeHTML(work.thumbnail)}" alt="${escapeHTML(work.title)} main visual"></figure>` : ''}${sectionsHTML}<section class="portfolio-scroll-credit"><p>Project Credit</p><dl>${facts.slice(0,4).map(([key, value]) => `<div><dt>${escapeHTML(key)}</dt><dd>${escapeHTML(value)}</dd></div>`).join('')}</dl></section></article>`;

    const revealItems = root.querySelectorAll('.reveal');
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('is-visible'); observer.unobserve(entry.target); } }), { threshold: 0.05, rootMargin: '0px 0px -20px' });
      revealItems.forEach((item) => observer.observe(item));
    } else revealItems.forEach((item) => item.classList.add('is-visible'));
  };

  if (!id) return renderNotFound();
  const script = document.createElement('script');
  script.src = `assets/js/works/${id}.js`;
  script.onload = () => render(window.NW_WORK);
  script.onerror = renderNotFound;
  document.body.appendChild(script);
})();