import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import {
  firebaseConfigReady,
  firebaseInitError,
  auth,
  db
} from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const topStatus = document.querySelector('.admin-status');
const topbarMeta = document.querySelector('.admin-topbar__meta');

const SERVICE_META = [
  ['CONTACT', '메인 컨택', '일반 프로젝트 문의'],
  ['EDITORIAL PRINT', '인쇄물 제작', '브로셔 · 카탈로그 · 리플렛'],
  ['PACKAGE PRODUCTION', '패키지 양산', '박스 · 쇼핑백 · 패키지 제작'],
  ['PACKAGE SAMPLE', '샘플 제작', '패키지 소량 샘플'],
  ['PRINT PARTNER', '파트너 요청', '인쇄 · 제조 협력사 등록'],
  ['MEMBERSHIP', '멤버십', '월간 디자인 운영 문의'],
  ['DEVELOP', '웹 · 개발', '사이트 · 시스템 개발 문의'],
  ['CLIENT REGISTRATION', '클라이언트 등록', '예비 · 기존 클라이언트 등록'],
  ['PROJECT', '프로젝트 문의', '프로젝트 시작 문의'],
  ['OTHER', '기타', '기타 문의']
];
const SERVICE_MAP = new Map(SERVICE_META.map(([key, label, desc]) => [key, { key, label, desc }]));

let inquiryCache = [];
let visitorCache = [];
let unsubscribers = [];
let activeService = 'ALL';
let activeStatus = 'all';
let searchTerm = '';

const setTopStatus = (label, online = false) => {
  if (!topStatus) return;
  topStatus.innerHTML = `<i></i> ${label}`;
  topStatus.dataset.online = online ? 'true' : 'false';
};

const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;')
  .replace(/'/g, '&#039;');

const normalizeStatus = (status) => ['new', 'open', 'done'].includes(status) ? status : 'new';

const isMemberSignupFallback = (item) => {
  const source = String(item?.source || '').toLowerCase();
  return source.includes('join.html') || source.includes('register.html');
};

const isTrashed = (item) => Boolean(item?.trashedAt);

const isRecruit = (item) => {
  const service = String(item?.service || '').toUpperCase();
  const source = String(item?.source || '').toLowerCase();
  return service.includes('RECRUIT') || source.includes('/recruit');
};

const isPortfolioView = (item) => String(item?.service || '').trim().toUpperCase() === 'PORTFOLIO VIEW';

const koreaDateKey = (date = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit'
  }).formatToParts(date).reduce((acc, part) => {
    if (part.type !== 'literal') acc[part.type] = part.value;
    return acc;
  }, {});
  return `${parts.year}-${parts.month}-${parts.day}`;
};

const recentDateKeys = (days = 30) => {
  const result = [];
  const now = new Date();
  for (let offset = days - 1; offset >= 0; offset -= 1) {
    result.push(koreaDateKey(new Date(now.getTime() - offset * 86400000)));
  }
  return result;
};

const formatDateTime = (timestamp) => {
  if (!timestamp) return '-';
  const date = typeof timestamp.toDate === 'function' ? timestamp.toDate() : new Date(timestamp);
  if (Number.isNaN(date.getTime())) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(date);
};

const serviceKeyFor = (item) => {
  const raw = String(item.service || '').trim().toUpperCase();
  if (SERVICE_MAP.has(raw)) return raw;
  const source = String(item.source || '').toLowerCase();
  if (source.includes('print-partner')) return 'PRINT PARTNER';
  if (source.includes('package-sample')) return 'PACKAGE SAMPLE';
  if (source.includes('package-production')) return 'PACKAGE PRODUCTION';
  if (source.includes('print-editorial')) return 'EDITORIAL PRINT';
  if (source.includes('membership')) return 'MEMBERSHIP';
  if (source.includes('client-register')) return 'CLIENT REGISTRATION';
  if (source.includes('develop')) return 'DEVELOP';
  if (source.includes('contact')) return 'CONTACT';
  return 'OTHER';
};

const serviceMetaFor = (item) => SERVICE_MAP.get(serviceKeyFor(item)) || SERVICE_MAP.get('OTHER');

const cleanup = () => {
  unsubscribers.forEach((unsubscribe) => { try { unsubscribe(); } catch {} });
  unsubscribers = [];
  inquiryCache = [];
  visitorCache = [];
};

const ensureGate = () => {
  let gate = document.querySelector('.firebase-admin-gate');
  if (gate) return gate;
  gate = document.createElement('div');
  gate.className = 'firebase-admin-gate';
  gate.innerHTML = `
    <form class="firebase-admin-gate__box" data-firebase-login>
      <span class="firebase-admin-gate__eyebrow">NINEWORKS / ADMIN ACCESS</span>
      <h2>Administrator Login</h2>
      <p>Firebase Authentication에 등록된 나인웍스 관리자 계정으로 로그인합니다.</p>
      <label>EMAIL</label>
      <input type="email" name="email" autocomplete="username" value="${ADMIN_EMAIL}" required>
      <label>PASSWORD</label>
      <input type="password" name="password" autocomplete="current-password" required>
      <button type="submit"><span>LOGIN</span><span>↗</span></button>
      <p class="firebase-admin-gate__error" data-firebase-login-error></p>
    </form>`;
  document.body.appendChild(gate);
  return gate;
};

const hideGate = () => {
  const gate = document.querySelector('.firebase-admin-gate');
  if (gate) gate.hidden = true;
};

const showGateMessage = (message = '') => {
  const gate = ensureGate();
  gate.hidden = false;
  const error = gate.querySelector('[data-firebase-login-error]');
  if (error) error.textContent = message;
};

const ensureSignOut = () => {
  if (!topbarMeta || topbarMeta.querySelector('.admin-firebase-signout')) return;
  const button = document.createElement('button');
  button.className = 'admin-firebase-signout';
  button.type = 'button';
  button.textContent = 'LOGOUT';
  button.addEventListener('click', () => signOut(auth));
  topbarMeta.appendChild(button);
};

const countByService = () => {
  const result = new Map();
  SERVICE_META.forEach(([key]) => result.set(key, { total: 0, newCount: 0 }));
  inquiryCache.forEach((item) => {
    const key = serviceKeyFor(item);
    if (!result.has(key)) result.set(key, { total: 0, newCount: 0 });
    const value = result.get(key);
    value.total += 1;
    if (normalizeStatus(item.status) === 'new') value.newCount += 1;
  });
  return result;
};

const inquiryRowHTML = (item, showStatus = true) => {
  const meta = serviceMetaFor(item);
  const status = normalizeStatus(item.status);
  const company = item.company || item.projectName || '회사명 미입력';
  const contact = item.contactName || '담당자 미입력';
  const detail = item.details || item.message || '상세 내용 없음';
  return `<article class="admin-inquiry-row">
    <div class="admin-inquiry-row__top">
      <div class="admin-inquiry-row__name"><strong>${escapeHTML(company)}</strong><span>${escapeHTML(contact)} · ${escapeHTML(formatDateTime(item.createdAt))}</span></div>
      <div class="admin-inquiry-row__service"><span class="admin-service-badge">${escapeHTML(meta.label)}</span><span>${escapeHTML(item.source || '-')}</span></div>
      <div class="admin-inquiry-row__contact">${escapeHTML(item.email || '-')}<br>${escapeHTML(item.phone || '-')}</div>
      ${showStatus ? `<select class="admin-inquiry-status" data-inquiry-status="${escapeHTML(item.id)}" aria-label="문의 상태"><option value="new"${status === 'new' ? ' selected' : ''}>NEW / 신규</option><option value="open"${status === 'open' ? ' selected' : ''}>OPEN / 진행</option><option value="done"${status === 'done' ? ' selected' : ''}>DONE / 완료</option></select>` : `<span class="admin-service-badge">${status.toUpperCase()}</span>`}
    </div>
    <details><summary>문의 상세 내용 보기</summary><pre>${escapeHTML(detail)}</pre></details>
  </article>`;
};

const renderDashboard = () => {
  const today = koreaDateKey();
  const sevenKeys = recentDateKeys(7);
  const daily = visitorCache.reduce((acc, item) => {
    const key = String(item.date || '');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const values = {
    'today-visitors': daily[today] || 0,
    'seven-visitors': sevenKeys.reduce((sum, key) => sum + (daily[key] || 0), 0),
    'new-inquiries': inquiryCache.filter((item) => normalizeStatus(item.status) === 'new').length,
    'total-inquiries': inquiryCache.length
  };
  Object.entries(values).forEach(([key, value]) => {
    const node = document.querySelector(`[data-stat="${key}"]`);
    if (node) node.textContent = String(value);
  });

  const categoryGrid = document.querySelector('[data-dashboard-categories]');
  if (categoryGrid) {
    const counts = countByService();
    const primary = SERVICE_META.filter(([key]) => key !== 'PROJECT' && key !== 'OTHER');
    const extraTotal = (counts.get('PROJECT')?.total || 0) + (counts.get('OTHER')?.total || 0);
    const cards = primary.map(([key, label, desc]) => {
      const value = counts.get(key) || { total: 0, newCount: 0 };
      return `<button class="admin-category-card" type="button" data-dashboard-service="${escapeHTML(key)}"><span>${escapeHTML(label)}</span><strong>${value.total}</strong><p>${value.newCount ? `신규 ${value.newCount}건` : desc}</p></button>`;
    });
    if (extraTotal) {
      cards.push(`<button class="admin-category-card" type="button" data-dashboard-service="OTHER"><span>기타 문의</span><strong>${extraTotal}</strong><p>기타 / 프로젝트 문의</p></button>`);
    }
    categoryGrid.innerHTML = cards.join('');
  }

  const recent = document.querySelector('[data-dashboard-recent]');
  const recentCount = document.querySelector('[data-dashboard-recent-count]');
  const items = inquiryCache.slice(0, 5);
  if (recentCount) recentCount.textContent = `${items.length} ITEMS`;
  if (recent) {
    recent.innerHTML = items.length
      ? items.map((item) => inquiryRowHTML(item, false)).join('')
      : '<div class="admin-empty-live">아직 접수된 문의가 없습니다.</div>';
  }
};

const renderStatusSummary = () => {
  const counts = inquiryCache.reduce((acc, item) => {
    acc[normalizeStatus(item.status)] += 1;
    return acc;
  }, { new: 0, open: 0, done: 0 });
  document.querySelectorAll('[data-status-summary]').forEach((card) => {
    const key = card.dataset.statusSummary;
    const strong = card.querySelector('strong');
    if (strong) strong.textContent = String(counts[key] || 0);
  });
};

const renderServiceFilters = () => {
  const container = document.querySelector('[data-inquiry-service-filters]');
  if (!container) return;
  const counts = countByService();
  const available = SERVICE_META.filter(([key]) => (counts.get(key)?.total || 0) > 0 || !['PROJECT', 'OTHER'].includes(key));
  container.innerHTML = [
    `<button type="button" class="${activeService === 'ALL' ? 'is-active' : ''}" data-inquiry-service-filter="ALL">전체 <b>${inquiryCache.length}</b></button>`,
    ...available.map(([key, label]) => `<button type="button" class="${activeService === key ? 'is-active' : ''}" data-inquiry-service-filter="${escapeHTML(key)}">${escapeHTML(label)} <b>${counts.get(key)?.total || 0}</b></button>`)
  ].join('');
};

const filteredInquiries = () => inquiryCache.filter((item) => {
  const serviceMatch = activeService === 'ALL'
    || serviceKeyFor(item) === activeService
    || (activeService === 'OTHER' && ['OTHER', 'PROJECT'].includes(serviceKeyFor(item)));
  const statusMatch = activeStatus === 'all' || normalizeStatus(item.status) === activeStatus;
  if (!serviceMatch || !statusMatch) return false;
  if (!searchTerm) return true;
  const haystack = [
    item.company, item.contactName, item.email, item.phone, item.projectName,
    item.projectType, item.message, item.details, item.source, serviceMetaFor(item).label
  ].join(' ').toLowerCase();
  return haystack.includes(searchTerm);
});

const renderInquiryList = () => {
  renderStatusSummary();
  renderServiceFilters();
  document.querySelectorAll('[data-inquiry-status-filter]').forEach((button) => {
    button.classList.toggle('is-active', button.dataset.inquiryStatusFilter === activeStatus);
  });
  const items = filteredInquiries();
  const total = document.querySelector('[data-inquiry-filter-total]');
  const list = document.querySelector('[data-inquiry-list]');
  if (total) total.textContent = `${items.length} ITEMS`;
  if (list) {
    list.innerHTML = items.length
      ? items.map((item) => inquiryRowHTML(item, true)).join('')
      : '<div class="admin-empty-live">조건에 맞는 문의가 없습니다.</div>';
  }
};

const rankingHTML = (map) => {
  const rows = Array.from(map.entries()).sort((a, b) => b[1] - a[1]).slice(0, 8);
  if (!rows.length) return '<div class="admin-ranking-empty">아직 데이터가 없습니다.</div>';
  return rows.map(([label, count], index) => `<div class="admin-ranking-row"><span>${String(index + 1).padStart(2, '0')}</span><strong title="${escapeHTML(label)}">${escapeHTML(label)}</strong><span>${count}</span></div>`).join('');
};

const renderVisitors = () => {
  const keys30 = recentDateKeys(30);
  const keys7 = keys30.slice(-7);
  const today = keys30[keys30.length - 1];
  const daily = visitorCache.reduce((acc, item) => {
    const key = String(item.date || '');
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const stats = {
    today: daily[today] || 0,
    seven: keys7.reduce((sum, key) => sum + (daily[key] || 0), 0),
    thirty: keys30.reduce((sum, key) => sum + (daily[key] || 0), 0)
  };
  Object.entries(stats).forEach(([key, value]) => {
    const node = document.querySelector(`[data-visitor-stat="${key}"]`);
    if (node) node.textContent = String(value);
  });

  const days = document.querySelector('[data-visitor-days]');
  if (days) {
    days.innerHTML = keys30.map((key) => `<div class="admin-visitor-day"><span>${key.slice(5).replace('-', '.')}</span><strong>${daily[key] || 0}</strong></div>`).join('');
  }

  const paths = new Map();
  const refs = new Map();
  visitorCache.forEach((item) => {
    const path = String(item.firstPath || '/');
    const ref = String(item.referrer || '').trim() || 'Direct / 직접 방문';
    paths.set(path, (paths.get(path) || 0) + 1);
    refs.set(ref, (refs.get(ref) || 0) + 1);
  });
  const pathBox = document.querySelector('[data-visitor-paths]');
  const refBox = document.querySelector('[data-visitor-referrers]');
  if (pathBox) pathBox.innerHTML = rankingHTML(paths);
  if (refBox) refBox.innerHTML = rankingHTML(refs);
};

const renderAll = () => {
  renderDashboard();
  renderInquiryList();
  renderVisitors();
};

const bindControls = () => {
  document.addEventListener('click', (event) => {
    const serviceButton = event.target.closest('[data-inquiry-service-filter]');
    if (serviceButton) {
      activeService = serviceButton.dataset.inquiryServiceFilter || 'ALL';
      renderInquiryList();
      return;
    }

    const statusButton = event.target.closest('[data-inquiry-status-filter], [data-status-summary]');
    if (statusButton) {
      activeStatus = statusButton.dataset.inquiryStatusFilter || statusButton.dataset.statusSummary || 'all';
      document.querySelector('[data-admin-tab="inquiry"]')?.click();
      renderInquiryList();
      return;
    }

    const dashboardService = event.target.closest('[data-dashboard-service]');
    if (dashboardService) {
      activeService = dashboardService.dataset.dashboardService || 'ALL';
      activeStatus = 'all';
      document.querySelector('[data-admin-tab="inquiry"]')?.click();
      renderInquiryList();
    }
  });

  document.querySelector('[data-inquiry-search]')?.addEventListener('input', (event) => {
    searchTerm = String(event.target.value || '').trim().toLowerCase();
    renderInquiryList();
  });

  document.addEventListener('change', async (event) => {
    const select = event.target.closest('[data-inquiry-status]');
    if (!select || !db) return;
    select.disabled = true;
    try {
      await updateDoc(doc(db, 'inquiries', select.dataset.inquiryStatus), {
        status: normalizeStatus(select.value),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('[NINEWORKS Admin] status update failed', error);
      window.alert('문의 상태 변경에 실패했습니다.');
    } finally {
      select.disabled = false;
    }
  });
};

const startAdminData = () => {
  cleanup();

  const inquiriesQuery = query(collection(db, 'inquiries'), orderBy('createdAt', 'desc'));
  unsubscribers.push(onSnapshot(inquiriesQuery, (snapshot) => {
    inquiryCache = snapshot.docs
      .map((item) => ({ id: item.id, ...item.data() }))
      .filter((item) => !isMemberSignupFallback(item) && !isTrashed(item) && !isRecruit(item) && !isPortfolioView(item));
    renderAll();
  }, (error) => {
    console.error('[NINEWORKS Admin] inquiry stream failed', error);
    const list = document.querySelector('[data-inquiry-list]');
    if (list) list.innerHTML = '<div class="admin-empty-live">문의 데이터를 불러오지 못했습니다.</div>';
  }));

  const startDate = recentDateKeys(30)[0];
  const visitorsQuery = query(collection(db, 'dailyVisitors'), where('date', '>=', startDate), orderBy('date', 'desc'));
  unsubscribers.push(onSnapshot(visitorsQuery, (snapshot) => {
    visitorCache = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderDashboard();
    renderVisitors();
  }, (error) => console.error('[NINEWORKS Admin] visitor stream failed', error)));
};

bindControls();

if (!firebaseConfigReady || firebaseInitError || !auth || !db) {
  setTopStatus('FIREBASE ERROR');
  showGateMessage('Firebase 연결 설정을 확인해 주세요.');
} else {
  const gate = ensureGate();
  const form = gate.querySelector('[data-firebase-login]');
  form?.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const email = String(data.get('email') || '').trim();
    const password = String(data.get('password') || '');
    const errorBox = form.querySelector('[data-firebase-login-error]');
    const button = form.querySelector('button[type="submit"]');
    if (errorBox) errorBox.textContent = '';
    if (button) button.disabled = true;
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      console.error('[NINEWORKS Admin] login failed', error);
      if (errorBox) errorBox.textContent = '로그인 정보를 확인해 주세요.';
    } finally {
      if (button) button.disabled = false;
    }
  });

  onAuthStateChanged(auth, async (user) => {
    if (!user) {
      cleanup();
      setTopStatus('LOGIN REQUIRED');
      showGateMessage('');
      return;
    }
    if (String(user.email || '').toLowerCase() !== ADMIN_EMAIL) {
      cleanup();
      setTopStatus('ACCESS DENIED');
      await signOut(auth);
      showGateMessage('허용되지 않은 관리자 계정입니다.');
      return;
    }
    hideGate();
    ensureSignOut();
    setTopStatus('ADMIN ONLINE', true);
    startAdminData();
  });
}
