(() => {
  const deck = document.querySelector('[data-company-profile-deck]');
  if (!deck) return;

  const works = window.NW_WORKS || {};
  const summaries = window.NW_SUMMARY_ARCHIVE || {};
  const portfolio = Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO : [];

  const esc = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const unique = (items) => [...new Set(items.filter(Boolean))];
  const trimText = (text, max = 150) => {
    const raw = String(text || '').trim();
    return raw.length > max ? `${raw.slice(0, max).trim()}…` : raw;
  };

  const getIdFromPage = (page) => {
    const href = page.querySelector('.major-media')?.getAttribute('href') || '';
    const match = href.match(/[?&]work=([^&#]+)/);
    if (match) return decodeURIComponent(match[1]);
    const title = page.querySelector('.major-copy h2')?.textContent?.trim() || '';
    return portfolio.find((item) => String(item.title || '').trim() === title)?.id || '';
  };

  const getProject = (page) => {
    const id = getIdFromPage(page);
    const listed = portfolio.find((item) => item?.id === id) || {};
    const work = works[id] || {};
    const summary = summaries[id] || [];
    const oldMain = page.querySelector('.major-media img')?.getAttribute('src') || listed.thumbnail || work.thumbnail || '';
    const sectionImages = Array.isArray(work.sections)
      ? work.sections.flatMap((section) => Array.isArray(section.images) ? section.images : [])
      : [];
    const images = unique([oldMain, work.thumbnail, listed.thumbnail, ...sectionImages]);
    while (images.length < 4) images.push(oldMain || listed.thumbnail || work.thumbnail || '');

    return {
      id,
      title: work.title || listed.title || page.querySelector('.major-copy h2')?.textContent?.trim() || 'Project',
      client: work.client || listed.client || 'NINEWORKS PROJECT',
      subtitle: work.lead || summary[0] || listed.subtitle || page.querySelector('.major-copy .subtitle')?.textContent?.trim() || '',
      description: work.summary || summary[1] || '',
      scope: work.scope || listed.scope || page.querySelector('.major-copy .scope')?.textContent?.trim() || '',
      category: work.category || (listed.filters || []).join(' · ') || 'SELECTED WORK',
      images: images.slice(0,4)
    };
  };

  const majorPages = [...deck.querySelectorAll('.major-page')];
  majorPages.forEach((page, index) => {
    const p = getProject(page);
    const [main, sub1, sub2, sub3] = p.images;
    page.classList.remove('is-reverse');
    page.innerHTML = `
      <div class="page-inner">
        <div class="major-onepage-head">
          <div>
            <p class="page-kicker">SELECTED WORK / ${esc(p.client)}</p>
            <h2>${esc(p.title)}</h2>
          </div>
          <div class="major-onepage-meta">
            <span>MAJOR / ${String(index + 1).padStart(2,'0')} — ${String(majorPages.length).padStart(2,'0')}</span>
            <span>${esc(p.category)}</span>
          </div>
        </div>

        <div class="major-onepage-visuals">
          <figure class="major-onepage-main"><img src="${esc(main)}" alt="${esc(p.title)} main visual" loading="lazy"></figure>
          <div class="major-onepage-subgrid">
            <figure><img src="${esc(sub1)}" alt="${esc(p.title)} sub visual 1" loading="lazy"></figure>
            <figure><img src="${esc(sub2)}" alt="${esc(p.title)} sub visual 2" loading="lazy"></figure>
            <figure><img src="${esc(sub3)}" alt="${esc(p.title)} sub visual 3" loading="lazy"></figure>
          </div>
        </div>

        <div class="major-onepage-foot">
          <div class="major-onepage-copy"><strong>${esc(p.subtitle)}</strong><p>${esc(trimText(p.description, 180))}</p></div>
          <div class="major-onepage-scope"><span>SCOPE</span><p>${esc(p.scope)}</p></div>
        </div>
      </div>
      <span class="page-brand">NINEWORKS</span>
      <span class="page-number"></span>`;
  });

  const overviewText = [...deck.querySelectorAll('.archive-stat p')].find((node) => node.textContent.includes('project'));
  if (overviewText) overviewText.textContent = '1 project / page · 1 main + 3 sub';

  const pages = [...deck.querySelectorAll('.profile-page')];
  const totalText = String(pages.length).padStart(3, '0');
  pages.forEach((page, index) => {
    page.dataset.page = String(index + 1);
    const num = page.querySelector('.page-number');
    if (num) num.textContent = `${String(index + 1).padStart(3, '0')} / ${totalText}`;
  });

  const currentEl = document.querySelector('[data-current-page]');
  const totalEl = document.querySelector('[data-total-pages]');
  if (totalEl) totalEl.textContent = totalText;

  let current = 0;
  const updateCurrent = (index) => {
    current = Math.max(0, Math.min(index, pages.length - 1));
    if (currentEl) currentEl.textContent = String(current + 1).padStart(3, '0');
  };
  const go = (index) => {
    updateCurrent(index);
    pages[current]?.scrollIntoView({ behavior:'smooth', block:'start' });
  };

  const replaceButton = (selector, handler) => {
    const old = document.querySelector(selector);
    if (!old) return;
    const fresh = old.cloneNode(true);
    old.replaceWith(fresh);
    fresh.addEventListener('click', handler);
  };
  replaceButton('[data-prev-page]', () => go(current - 1));
  replaceButton('[data-next-page]', () => go(current + 1));
  replaceButton('[data-print-profile]', () => window.print());

  window.addEventListener('keydown', (event) => {
    if (!['ArrowRight','ArrowLeft','PageDown','PageUp','Home','End'].includes(event.key)) return;
    event.preventDefault();
    event.stopImmediatePropagation();
    if (event.key === 'ArrowRight' || event.key === 'PageDown') go(current + 1);
    if (event.key === 'ArrowLeft' || event.key === 'PageUp') go(current - 1);
    if (event.key === 'Home') go(0);
    if (event.key === 'End') go(pages.length - 1);
  }, true);

  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = pages.indexOf(visible.target);
    if (index >= 0) updateCurrent(index);
  }, { threshold:[.3,.5,.7] });
  pages.forEach((page) => observer.observe(page));

  updateCurrent(0);
})();