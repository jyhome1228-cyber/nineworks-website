(() => {
  const deck = document.querySelector('[data-company-profile-deck]');
  if (!deck) return;

  const works = window.NW_WORKS || {};
  const summaries = window.NW_SUMMARY_ARCHIVE || {};

  const esc = (value = '') => String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');

  const unique = (items) => [...new Set(items.filter(Boolean))];

  const getProjectData = (majorPage) => {
    const title = majorPage.querySelector('.major-copy h2')?.textContent?.trim() || 'Project';
    const meta = majorPage.querySelector('.major-copy .meta')?.textContent?.trim() || '';
    const scope = majorPage.querySelector('.major-copy .scope')?.textContent?.trim() || '';
    const subtitle = majorPage.querySelector('.major-copy .subtitle')?.textContent?.trim() || '';
    const mainImage = majorPage.querySelector('.major-media img')?.getAttribute('src') || '';
    const href = majorPage.querySelector('.major-media')?.getAttribute('href') || '';
    const match = href.match(/[?&]work=([^&#]+)/);
    let id = match ? decodeURIComponent(match[1]) : '';
    if (!id) {
      const portfolio = Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO : [];
      const found = portfolio.find((item) => String(item.title || '').trim() === title);
      id = found?.id || '';
    }

    const work = works[id] || {};
    const sectionImages = Array.isArray(work.sections)
      ? work.sections.flatMap((section) => Array.isArray(section.images) ? section.images : [])
      : [];
    const images = unique([mainImage, work.thumbnail, ...sectionImages]);
    const summary = summaries[id] || [];
    const lead = work.lead || summary[0] || subtitle;
    const description = work.summary || summary[1] || subtitle;
    const category = work.category || meta.split('·')[0]?.trim() || 'Selected Project';
    const role = work.role || scope;

    return { id, title, subtitle, scope, meta, mainImage, images, lead, description, category, role, work };
  };

  const pick = (images, index, fallback) => images[index] || images[index % Math.max(images.length, 1)] || fallback;
  const trimText = (text, max = 260) => {
    const raw = String(text || '').trim();
    return raw.length > max ? `${raw.slice(0, max).trim()}…` : raw;
  };

  const supportShell = (project, index, body, className) => {
    const section = document.createElement('section');
    section.className = `profile-page major-support ${className}`;
    section.dataset.majorProject = project.id || project.title;
    section.innerHTML = `
      <div class="page-inner">
        <p class="page-kicker">SELECTED WORK / ${esc(project.title)}</p>
        <div class="major-support-head">
          <h2>${esc(project.title)}</h2>
          <p>MAJOR CASE / SUPPORT ${String(index).padStart(2,'0')} OF 03</p>
        </div>
        ${body}
      </div>
      <span class="page-brand">NINEWORKS</span>
      <span class="page-number"></span>`;
    return section;
  };

  const makeSupportPages = (majorPage) => {
    const p = getProjectData(majorPage);
    const imgs = p.images.length ? p.images : [p.mainImage];
    const img1 = pick(imgs, 1, p.mainImage);
    const img2 = pick(imgs, 2, p.mainImage);
    const img3 = pick(imgs, 3, p.mainImage);
    const img4 = pick(imgs, 4, p.mainImage);
    const img5 = pick(imgs, 5, p.mainImage);
    const img6 = pick(imgs, 6, p.mainImage);

    const page1 = supportShell(p, 1, `
      <div class="support-layout">
        <figure class="support-main"><img src="${esc(img1)}" alt="${esc(p.title)} project visual 1" loading="lazy"></figure>
        <div class="support-side">
          <figure><img src="${esc(img2)}" alt="${esc(p.title)} project visual 2" loading="lazy"></figure>
          <div class="major-support-copy"><strong>${esc(p.lead || p.subtitle)}</strong>${esc(trimText(p.description, 250))}</div>
        </div>
      </div>`, 'major-support--01');

    const firstSection = Array.isArray(p.work.sections) ? p.work.sections[0] : null;
    const secondSection = Array.isArray(p.work.sections) ? p.work.sections[1] : null;
    const page2 = supportShell(p, 2, `
      <div class="support-layout">
        <figure><img src="${esc(img3)}" alt="${esc(p.title)} project visual 3" loading="lazy"></figure>
        <figure><img src="${esc(img4)}" alt="${esc(p.title)} project visual 4" loading="lazy"></figure>
      </div>
      <div class="support-caption">
        <div><strong>${esc(firstSection?.label || p.category)}</strong><br>${esc(trimText(firstSection?.title || p.lead, 120))}</div>
        <div><strong>${esc(secondSection?.label || 'DESIGN SYSTEM')}</strong><br>${esc(trimText(secondSection?.title || p.scope, 120))}</div>
      </div>`, 'major-support--02');

    const thirdSection = Array.isArray(p.work.sections) ? p.work.sections[2] : null;
    const page3 = supportShell(p, 3, `
      <div class="support-layout">
        <figure><img src="${esc(img5)}" alt="${esc(p.title)} project visual 5" loading="lazy"></figure>
        <figure><img src="${esc(img6)}" alt="${esc(p.title)} project visual 6" loading="lazy"></figure>
        <figure><img src="${esc(img2)}" alt="${esc(p.title)} project visual 7" loading="lazy"></figure>
      </div>
      <div class="support-note">
        <strong>${esc(thirdSection?.label || 'PROJECT SCOPE')}</strong>
        <p>${esc(trimText(thirdSection?.title || p.role || p.scope, 150))}</p>
      </div>`, 'major-support--03');

    return [page1, page2, page3];
  };

  const majorPages = [...deck.querySelectorAll('.major-page')];
  majorPages.forEach((majorPage) => {
    const supportPages = makeSupportPages(majorPage);
    let anchor = majorPage;
    supportPages.forEach((supportPage) => {
      anchor.insertAdjacentElement('afterend', supportPage);
      anchor = supportPage;
    });
  });

  const overviewText = [...deck.querySelectorAll('.archive-stat p')].find((node) => node.textContent.includes('1 project / page'));
  if (overviewText) overviewText.textContent = '4 pages / project';

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
    const visible = entries
      .filter((entry) => entry.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    const index = pages.indexOf(visible.target);
    if (index >= 0) updateCurrent(index);
  }, { threshold:[.3,.5,.7] });
  pages.forEach((page) => observer.observe(page));

  updateCurrent(0);
})();