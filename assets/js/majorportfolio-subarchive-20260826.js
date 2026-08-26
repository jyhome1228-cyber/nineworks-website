(() => {
  const SESSION_KEY = 'nineworks-majorportfolio-view-access-v6';
  const type = document.body?.dataset.majorSubarchive || '';
  const SUPPORTED = ['package','detailpage','website','editorial','ir','event'];
  if (!SUPPORTED.includes(type)) return;

  try {
    if (sessionStorage.getItem(SESSION_KEY) !== '1') {
      location.replace('./');
      return;
    }
  } catch (_) {
    location.replace('./');
    return;
  }

  const grid = document.querySelector('[data-major-subarchive-grid]');
  const countEl = document.querySelector('[data-major-subarchive-count]');
  const moreBox = document.querySelector('[data-major-subarchive-more]');
  const PAGE_SIZE = 18;
  let visibleLimit = PAGE_SIZE;

  const LABELS = {
    package: 'PACKAGE',
    detailpage: 'DETAIL PAGE',
    website: 'WEBSITE',
    editorial: 'EDITORIAL',
    ir: 'IR / PPT',
    event: 'EVENT'
  };
  const label = LABELS[type] || 'PORTFOLIO';

  const escapeHTML = (value = '') => String(value)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');

  const sourceOrder = (item) => {
    const explicit = Number(item?.order ?? item?.sourceOrder ?? item?.index);
    if (Number.isFinite(explicit) && explicit > 0) return explicit;
    const match = String(item?.id || '').match(/(\d+)(?!.*\d)/);
    return match ? Number(match[1]) : 0;
  };

  const packagePriority = (item) => {
    const text = `${item?.title || ''} ${item?.subtitle || ''}`.toLowerCase();
    if (/hollys|할리스/.test(text)) return 300;
    if (/yonsei|연세|kids\s?ten|키즈텐|healthd|헬씨드/.test(text)) return 200;
    if (/gong\s?cha|공차/.test(text)) return 100;
    return 0;
  };

  const cases = [];
  const seen = new Set();
  (Array.isArray(window.NW_PORTFOLIO) ? window.NW_PORTFOLIO : []).forEach((project) => {
    if (!project || !(project.filters || []).includes(type)) return;
    const key = `${project.client || ''}|${project.title || ''}`.toLowerCase();
    if (seen.has(key)) return;
    seen.add(key);
    cases.push({ ...project, archive: false });
  });

  let archives = [];
  if (type === 'detailpage') {
    archives = (Array.isArray(window.NW_DETAILPAGE_ARCHIVE) ? window.NW_DETAILPAGE_ARCHIVE : [])
      .slice().sort((a, b) => sourceOrder(b) - sourceOrder(a))
      .map((item) => ({ ...item, archive: true, filters: [...new Set(['detailpage', ...(item.filters || [])])] }));
  } else {
    archives = (Array.isArray(window.NW_PORTFOLIO_ARCHIVE) ? window.NW_PORTFOLIO_ARCHIVE : [])
      .filter((item) => (item.filters || []).includes(type))
      .map((item, index) => ({ ...item, archive: true, __index: index }))
      .sort((a, b) => {
        if (type === 'package') {
          const priority = packagePriority(b) - packagePriority(a);
          if (priority) return priority;
          const order = sourceOrder(b) - sourceOrder(a);
          if (order) return order;
        }
        return a.__index - b.__index;
      })
      .map(({ __index, ...item }) => item);
  }

  const works = [...cases, ...archives];

  const detailMap = {
    fineb: '/portfolio-fineb.html','tne-epc':'/portfolio-tne-epc.html',relim:'/portfolio-relim.html',aesost:'/portfolio-aesost.html',kekomi:'/portfolio-kekomi.html',
    'the-petrichor':'/portfolio-the-petrichor.html',thomastone:'/portfolio-thomastone.html',recelleclore:'/portfolio-recelleclore.html'
  };
  const caseHref = (item) => {
    if (detailMap[item.id]) return detailMap[item.id];
    const explicit = String(item.detailUrl || '').trim();
    if (explicit) return /^https?:\/\//i.test(explicit) || explicit.startsWith('/') ? explicit : `/${explicit}`;
    return `/portfolio-detail.html?work=${encodeURIComponent(item.id || '')}`;
  };
  const thumb = (item) => item.thumbnail || item.image || (Array.isArray(item.images) ? item.images[0] : '') || '';

  const cardMarkup = (item) => {
    const title = escapeHTML(item.title || 'Project');
    const subtitle = escapeHTML(item.client || item.subtitle || item.scope || '');
    const image = escapeHTML(thumb(item));
    if (item.archive) {
      return `<article class="major-subarchive-card" data-major-subarchive-card="${escapeHTML(item.id || '')}"><a href="#view" data-major-subarchive-open="${escapeHTML(item.id || '')}">
        <figure class="major-subarchive-card__media"><img src="${image}" alt="${title}" loading="lazy"></figure>
        <div class="major-subarchive-card__info"><div><strong>${title}</strong><p>${subtitle}</p></div><span>${label}</span></div>
      </a></article>`;
    }
    return `<article class="major-subarchive-card" data-major-subarchive-card="${escapeHTML(item.id || '')}"><a href="${escapeHTML(caseHref(item))}">
      <figure class="major-subarchive-card__media"><img src="${image}" alt="${title}" loading="lazy"></figure>
      <div class="major-subarchive-card__info"><div><strong>${title}</strong><p>${subtitle}</p></div><span>${label}</span></div>
    </a></article>`;
  };

  const render = () => {
    const visible = works.slice(0, visibleLimit);
    if (countEl) countEl.textContent = `${String(works.length).padStart(2, '0')} WORKS`;
    if (grid) grid.innerHTML = visible.length ? visible.map(cardMarkup).join('') : '<div class="major-subarchive-empty">등록된 작업이 없습니다.</div>';
    if (moreBox) {
      const remaining = Math.max(0, works.length - visibleLimit);
      moreBox.hidden = remaining === 0;
      const button = moreBox.querySelector('button');
      if (button) button.textContent = remaining ? `MORE WORKS · ${Math.min(PAGE_SIZE, remaining)}개 더보기` : 'MORE WORKS';
    }
  };

  const modal = document.createElement('div');
  modal.className = 'major-subarchive-modal';
  modal.setAttribute('aria-hidden', 'true');
  modal.innerHTML = `<div class="major-subarchive-modal__head"><div><span>NINEWORKS / ${label}</span><h2 data-major-subarchive-modal-title></h2></div><button class="major-subarchive-modal__close" type="button" data-major-subarchive-close>×</button></div><div class="major-subarchive-modal__stage" data-major-subarchive-stage></div><div class="major-subarchive-modal__foot"><span>${label}</span><span data-major-subarchive-modal-count>01 IMAGE</span></div>`;
  document.body.appendChild(modal);

  const openItem = (item) => {
    if (!item) return;
    const images = Array.isArray(item.images) && item.images.length ? item.images : [item.image || item.thumbnail].filter(Boolean);
    modal.querySelector('[data-major-subarchive-modal-title]').textContent = item.title || 'Project';
    modal.querySelector('[data-major-subarchive-modal-count]').textContent = `${String(images.length).padStart(2, '0')} IMAGE${images.length > 1 ? 'S' : ''}`;
    modal.querySelector('[data-major-subarchive-stage]').innerHTML = images.map((src, index) => `<figure><img src="${escapeHTML(src)}" alt="${escapeHTML(item.title || 'Project')} ${index + 1}" loading="${index === 0 ? 'eager' : 'lazy'}"></figure>`).join('');
    modal.classList.add('is-open');
    modal.setAttribute('aria-hidden', 'false');
    modal.querySelector('[data-major-subarchive-stage]').scrollTop = 0;
  };
  const closeItem = () => { modal.classList.remove('is-open'); modal.setAttribute('aria-hidden', 'true'); };

  const inquiry = document.createElement('div');
  inquiry.className = 'major-subarchive-inquiry';
  inquiry.innerHTML = `<div class="major-subarchive-inquiry__dialog"><button class="major-subarchive-inquiry__close" type="button" data-major-inquiry-close>×</button><p class="eyebrow">NINEWORKS / PROJECT INQUIRY</p><h2>프로젝트 문의</h2><p class="major-subarchive-inquiry__intro">프로젝트 관련 문의나 필요한 포트폴리오 자료가 있다면 아래 방법으로 편하게 연락해 주세요.</p><div class="major-subarchive-inquiry__options"><a href="sms:01054225650"><span>MESSAGE</span><div><strong>010-5422-5650</strong><p>빠른 확인이 필요하시면 문자로 문의해 주세요.</p></div><b>→</b></a><a href="mailto:info@9works.kr?subject=NINEWORKS%20프로젝트%20문의"><span>EMAIL</span><div><strong>info@9works.kr</strong><p>프로젝트 내용과 필요한 자료를 메일로 보내주세요.</p></div><b>→</b></a></div></div>`;
  document.body.appendChild(inquiry);

  document.addEventListener('click', (event) => {
    const open = event.target.closest('[data-major-subarchive-open]');
    if (open) {
      event.preventDefault();
      openItem(works.find((item) => String(item.id) === String(open.dataset.majorSubarchiveOpen)));
      return;
    }
    const inquiryOpen = event.target.closest('[data-major-inquiry-open]');
    if (inquiryOpen) {
      event.preventDefault();
      inquiry.classList.add('is-open');
    }
  });
  modal.querySelector('[data-major-subarchive-close]')?.addEventListener('click', closeItem);
  modal.addEventListener('click', (event) => { if (event.target === modal) closeItem(); });
  moreBox?.querySelector('button')?.addEventListener('click', () => { visibleLimit += PAGE_SIZE; render(); });
  inquiry.querySelector('[data-major-inquiry-close]')?.addEventListener('click', () => inquiry.classList.remove('is-open'));
  inquiry.addEventListener('click', (event) => { if (event.target === inquiry) inquiry.classList.remove('is-open'); });
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') { closeItem(); inquiry.classList.remove('is-open'); } });

  render();

  const targetId = new URLSearchParams(location.search).get('work');
  if (targetId) {
    const item = works.find((work) => String(work.id) === String(targetId));
    if (item?.archive) window.setTimeout(() => openItem(item), 120);
    else if (item) window.setTimeout(() => document.querySelector(`[data-major-subarchive-card="${CSS.escape(targetId)}"]`)?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 120);
  }
})();
