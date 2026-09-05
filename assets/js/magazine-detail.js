(() => {
  const root = document.querySelector('[data-magazine-detail-root]');
  if (!root) return;

  const data = window.NW_MAGAZINE_ARTICLES || {};
  const list = Array.isArray(window.NW_MAGAZINE) ? window.NW_MAGAZINE : [];
  const params = new URLSearchParams(window.location.search);
  const id = (params.get('article') || '').replace(/[^a-z0-9-]/gi, '');
  const article = data[id];
  const labels = { strategy: 'Brand Strategy', story: 'Brand Story', experience: 'Retail & Experience' };

  const escapeHTML = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const renderNotFound = () => {
    root.innerHTML = `<section class="portfolio-not-found"><p class="eyebrow">Design Articles</p><h1>Article not found.</h1><a class="text-link" href="magazine.html">BACK TO DESIGN ARTICLES <span>↗</span></a></section>`;
  };

  const renderBlock = (block, imagePriority = 'lazy') => {
    if (!block) return '';
    if (block.type === 'text') {
      const paragraphs = (block.paragraphs || []).filter(Boolean).map((text) => `<p>${escapeHTML(text)}</p>`).join('');
      return paragraphs ? `<div class="magazine-detail-block magazine-detail-copy">${paragraphs}</div>` : '';
    }
    if (block.type === 'images') {
      const figures = (block.images || []).filter(Boolean).map((src, index) => `<figure><img src="${escapeHTML(src)}" alt="${escapeHTML(article.title)} visual ${index + 1}" loading="${imagePriority}"></figure>`).join('');
      return figures ? `<div class="magazine-detail-block magazine-detail-images">${figures}</div>` : '';
    }
    if (block.type === 'note') {
      const paragraphs = (block.paragraphs || []).filter(Boolean).map((text) => `<p>${escapeHTML(text)}</p>`).join('');
      return `<aside class="magazine-detail-block magazine-detail-note">${block.title ? `<h3>${escapeHTML(block.title)}</h3>` : ''}${paragraphs}</aside>`;
    }
    return '';
  };

  if (!article) return renderNotFound();

  document.title = `${article.title} — NINEWORKS Design Articles`;
  const description = document.querySelector('meta[name="description"]');
  if (description) description.content = article.subtitle || article.summary || article.title;

  const sections = Array.isArray(article.sections) ? article.sections : [];
  const category = labels[article.category] || article.category || 'Design Article';
  const indexHTML = sections.map((section, index) => `<a href="#work-section-${index + 1}"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHTML(section.title || section.label || `Chapter ${index + 1}`)}</a>`).join('');

  const introHTML = (article.intro || []).map((block, index) => renderBlock(block, index < 2 ? 'eager' : 'lazy')).join('');
  const sectionsHTML = sections.map((section, index) => {
    const blocks = (section.blocks || []).map((block) => renderBlock(block)).join('');
    return `<section class="portfolio-scroll-section" id="work-section-${index + 1}">
      <header class="portfolio-scroll-section__head">
        <div class="portfolio-scroll-section__meta"><span class="portfolio-scroll-section__index">${String(index + 1).padStart(2, '0')}</span><span class="portfolio-scroll-section__label">${escapeHTML(section.label || `Chapter ${index + 1}`)}</span></div>
        <h2>${escapeHTML(section.title || `Chapter ${index + 1}`)}</h2>
      </header>
      ${blocks}
    </section>`;
  }).join('');

  const currentIndex = list.findIndex((item) => item.id === id);
  const previous = currentIndex > 0 ? list[currentIndex - 1] : null;
  const next = currentIndex >= 0 && currentIndex < list.length - 1 ? list[currentIndex + 1] : null;
  const endHTML = (previous || next) ? `<nav class="magazine-detail-end" aria-label="다른 디자인 아티클">
    ${previous ? `<a href="magazine-detail.html?article=${encodeURIComponent(previous.id)}"><span>Previous</span><strong>${escapeHTML(previous.title)}</strong></a>` : '<span></span>'}
    ${next ? `<a href="magazine-detail.html?article=${encodeURIComponent(next.id)}"><span>Next</span><strong>${escapeHTML(next.title)}</strong></a>` : ''}
  </nav>` : '';

  root.className = 'portfolio-split-detail';
  root.innerHTML = `<aside class="portfolio-detail-sidebar"><div class="portfolio-detail-sidebar__inner">
    <div class="portfolio-detail-sidebar__top">
      <p class="portfolio-detail-kicker">Design Article / ${escapeHTML(category)}</p>
      <h1>${escapeHTML(article.title)}</h1>
      <p class="portfolio-detail-scope">${escapeHTML(article.subtitle || '')}</p>
    </div>
    <div class="portfolio-detail-story"><p class="portfolio-detail-story__summary">${escapeHTML(article.summary || '')}</p></div>
    <dl class="portfolio-detail-facts">
      <div><dt>Category</dt><dd>${escapeHTML(category)}</dd></div>
      <div><dt>Archive</dt><dd>NINEWORKS Design Articles</dd></div>
    </dl>
    ${indexHTML ? `<nav class="portfolio-detail-index" aria-label="아티클 챕터">${indexHTML}</nav>` : ''}
    <a class="portfolio-detail-back" href="magazine.html">← Back to Design Articles</a>
  </div></aside>
  <article class="portfolio-detail-scroll">
    ${introHTML ? `<section class="magazine-detail-intro">${introHTML}</section>` : ''}
    ${sectionsHTML}
    ${endHTML}
  </article>`;

  window.dispatchEvent(new Event('resize'));
})();