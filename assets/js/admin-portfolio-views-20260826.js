import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection, onSnapshot, query, where } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const VIEW_SERVICE = 'PORTFOLIO VIEW';
let viewCache = [];
let searchTerm = '';
let unsubscribe = null;
let started = false;

const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#039;');

const asDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};

const timestampMs = (value) => asDate(value)?.getTime() || 0;

const koreaDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const recentDateKeys = (days = 7) => {
  const keys = [];
  const now = new Date();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    keys.push(koreaDateKey(new Date(now.getTime() - offset * 86400000)));
  }
  return keys;
};

const formatDateTime = (value) => {
  const date = asDate(value);
  if (!date) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul',
    year: 'numeric', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
};

const loadStyle = () => {
  if (document.querySelector('link[data-admin-portfolio-view-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-portfolio-views-20260826.css?v=20260826-1';
  link.dataset.adminPortfolioViewStyle = 'true';
  document.head.appendChild(link);
};

const renumberNav = () => {
  const buttons = Array.from(document.querySelectorAll('.admin-nav > .admin-nav__item'));
  buttons.forEach((button, index) => {
    const number = button.querySelector('span');
    const next = String(index + 1).padStart(2, '0');
    if (number && number.textContent !== next) number.textContent = next;
  });
};

const injectUI = () => {
  const nav = document.querySelector('.admin-nav');
  if (nav && !nav.querySelector('[data-portfolio-view-tab]')) {
    const button = document.createElement('button');
    button.className = 'admin-nav__item';
    button.type = 'button';
    button.dataset.portfolioViewTab = 'true';
    button.innerHTML = '<span>05</span>Portfolio Views';

    const trash = nav.querySelector('[data-admin-tab="trash"]');
    if (trash) nav.insertBefore(button, trash);
    else nav.appendChild(button);
  }

  if (!document.querySelector('[data-portfolio-view-panel]')) {
    const panel = document.createElement('section');
    panel.className = 'admin-panel admin-portfolio-view-panel';
    panel.dataset.portfolioViewPanel = 'true';
    panel.innerHTML = `
      <div class="admin-section-head">
        <div><span class="admin-label">Portfolio Access Log</span><h2>Portfolio Views</h2><p>메이저 포트폴리오 열람 전에 입력한 성함과 소속, 열람 시점을 확인합니다.</p></div>
      </div>
      <div class="admin-stat-grid admin-portfolio-view-stats">
        <article class="admin-stat"><span>Today</span><strong data-portfolio-view-stat="today">0</strong><p>오늘 열람 기록</p></article>
        <article class="admin-stat"><span>7 Days</span><strong data-portfolio-view-stat="seven">0</strong><p>최근 7일 열람 기록</p></article>
        <article class="admin-stat"><span>Total Views</span><strong data-portfolio-view-stat="total">0</strong><p>전체 누적 열람 기록</p></article>
        <article class="admin-stat"><span>Organizations</span><strong data-portfolio-view-stat="organizations">0</strong><p>확인된 소속 수</p></article>
      </div>
      <div class="admin-filter-panel admin-portfolio-view-filter">
        <div class="admin-search-row"><input type="search" placeholder="성함 또는 소속 검색" data-portfolio-view-search><span data-portfolio-view-total>0 VIEWS</span></div>
      </div>
      <section class="admin-block admin-portfolio-view-log">
        <div class="admin-block__head"><div><span class="admin-label">Access Log</span><h3>최근 열람자</h3></div><span>RECENT FIRST / KST</span></div>
        <div class="admin-portfolio-view-table">
          <div class="admin-portfolio-view-table__head"><span>NAME</span><span>ORGANIZATION</span><span style="text-align:right">VIEWED AT</span></div>
          <div data-portfolio-view-list><div class="admin-portfolio-view-empty">열람 기록을 불러오는 중입니다.</div></div>
        </div>
      </section>`;

    const trashPanel = document.querySelector('[data-admin-panel="trash"]');
    if (trashPanel?.parentElement) trashPanel.parentElement.insertBefore(panel, trashPanel);
    else document.querySelector('.admin-main')?.appendChild(panel);
  }

  renumberNav();
  window.setTimeout(renumberNav, 300);
  window.setTimeout(renumberNav, 1000);
};

const openPortfolioViews = () => {
  document.querySelectorAll('[data-admin-tab]').forEach((tab) => tab.classList.remove('is-active'));
  document.querySelectorAll('[data-admin-panel]').forEach((panel) => panel.classList.remove('is-active'));
  document.querySelector('[data-portfolio-view-tab]')?.classList.add('is-active');
  document.querySelector('[data-portfolio-view-panel]')?.classList.add('is-active');
  const title = document.querySelector('[data-admin-title]');
  if (title) title.textContent = 'Portfolio Views';
  if (history.replaceState) history.replaceState(null, '', '#portfolioViews');
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const bindNavigation = () => {
  document.addEventListener('click', (event) => {
    if (event.target.closest('[data-portfolio-view-tab]')) {
      openPortfolioViews();
      return;
    }
    if (event.target.closest('[data-admin-tab]')) {
      document.querySelector('[data-portfolio-view-tab]')?.classList.remove('is-active');
      document.querySelector('[data-portfolio-view-panel]')?.classList.remove('is-active');
    }
  });

  const nav = document.querySelector('.admin-nav');
  if (nav) {
    const observer = new MutationObserver(() => renumberNav());
    observer.observe(nav, { childList: true, subtree: true, characterData: true });
  }
};

const filteredViews = () => {
  if (!searchTerm) return viewCache;
  return viewCache.filter((item) => [item.contactName, item.company].join(' ').toLowerCase().includes(searchTerm));
};

const renderStats = () => {
  const today = koreaDateKey();
  const seven = new Set(recentDateKeys(7));
  const organizations = new Set();
  let todayCount = 0;
  let sevenCount = 0;

  viewCache.forEach((item) => {
    const date = asDate(item.createdAt);
    if (date) {
      const key = koreaDateKey(date);
      if (key === today) todayCount += 1;
      if (seven.has(key)) sevenCount += 1;
    }
    const organization = String(item.company || '').trim().toLowerCase();
    if (organization) organizations.add(organization);
  });

  const stats = {
    today: todayCount,
    seven: sevenCount,
    total: viewCache.length,
    organizations: organizations.size
  };
  Object.entries(stats).forEach(([key, value]) => {
    const node = document.querySelector(`[data-portfolio-view-stat="${key}"]`);
    if (node) node.textContent = String(value);
  });
};

const renderList = () => {
  renderStats();
  const items = filteredViews();
  const total = document.querySelector('[data-portfolio-view-total]');
  const list = document.querySelector('[data-portfolio-view-list]');
  if (total) total.textContent = `${items.length} VIEWS`;
  if (!list) return;

  if (!items.length) {
    list.innerHTML = `<div class="admin-portfolio-view-empty">${searchTerm ? '검색 조건에 맞는 열람 기록이 없습니다.' : '아직 메이저 포트폴리오 열람 기록이 없습니다.'}</div>`;
    return;
  }

  list.innerHTML = items.map((item) => `
    <article class="admin-portfolio-view-row">
      <div class="admin-portfolio-view-row__name"><strong>${escapeHTML(item.contactName || '이름 미입력')}</strong><span>VIEWER</span></div>
      <div class="admin-portfolio-view-row__org"><strong>${escapeHTML(item.company || '소속 미입력')}</strong><span>MAJOR PORTFOLIO</span></div>
      <div class="admin-portfolio-view-row__date"><strong>${escapeHTML(formatDateTime(item.createdAt))}</strong><span>KST</span></div>
    </article>`).join('');
};

const startStream = () => {
  if (unsubscribe || !db) return;
  const viewsQuery = query(collection(db, 'inquiries'), where('service', '==', VIEW_SERVICE));
  unsubscribe = onSnapshot(viewsQuery, (snapshot) => {
    viewCache = snapshot.docs
      .map((docItem) => ({ id: docItem.id, ...docItem.data() }))
      .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
    renderList();
  }, (error) => {
    console.error('[NINEWORKS Admin] portfolio view stream failed', error);
    const list = document.querySelector('[data-portfolio-view-list]');
    if (list) list.innerHTML = '<div class="admin-portfolio-view-empty">열람 기록을 불러오지 못했습니다.</div>';
  });
};

const stopStream = () => {
  if (unsubscribe) unsubscribe();
  unsubscribe = null;
  viewCache = [];
  renderList();
};

const init = () => {
  if (started) return;
  started = true;
  loadStyle();
  injectUI();
  bindNavigation();

  document.querySelector('[data-portfolio-view-search]')?.addEventListener('input', (event) => {
    searchTerm = String(event.target.value || '').trim().toLowerCase();
    renderList();
  });

  if (location.hash === '#portfolioViews') {
    window.setTimeout(() => {
      if (location.hash === '#portfolioViews' || location.hash === '#dashboard') openPortfolioViews();
    }, 1200);
  }

  if (!firebaseConfigReady || firebaseInitError || !auth || !db) {
    const list = document.querySelector('[data-portfolio-view-list]');
    if (list) list.innerHTML = '<div class="admin-portfolio-view-empty">Firebase 연결 설정을 확인해 주세요.</div>';
    return;
  }

  onAuthStateChanged(auth, (user) => {
    const isAdmin = String(user?.email || '').toLowerCase() === ADMIN_EMAIL;
    if (isAdmin) startStream();
    else stopStream();
  });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init, { once: true });
else init();
