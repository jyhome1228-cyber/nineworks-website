import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection, doc, onSnapshot, serverTimestamp, setDoc, updateDoc } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
const PARTNERS = [
  { name: '서동원', email: 'seodw100@naver.com' },
  { name: '신민용', email: 's.nninyong@gmail.com' },
  { name: '박상혁', email: 'daytuio0329@naver.com' }
];

let inquiryCache = [];
let unsubscribe = null;
let started = false;
let syncTimer = null;
const lastDetailSignature = new Map();

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
const workspaceKey = (email = '') => encodeURIComponent(normalizeEmail(email));
const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
const normalizeStatus = (value = '') => ['new', 'open', 'done'].includes(value) ? value : 'new';
const isRecruit = (item) => {
  const service = String(item?.service || '').toUpperCase();
  const source = String(item?.source || '').toLowerCase();
  return service.includes('RECRUIT') || source.includes('/recruit');
};
const isTrashed = (item) => Boolean(item?.trashedAt);
const timestampMs = (value) => {
  if (!value) return 0;
  if (typeof value.toMillis === 'function') return value.toMillis();
  if (typeof value.toDate === 'function') return value.toDate().getTime();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? 0 : date.getTime();
};
const formatDate = (value) => {
  const ms = timestampMs(value);
  if (!ms) return '-';
  return new Intl.DateTimeFormat('ko-KR', {
    timeZone: 'Asia/Seoul', year: '2-digit', month: '2-digit', day: '2-digit',
    hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date(ms));
};

const detailsValue = (details = '', keys = []) => {
  const lines = String(details || '').split(/\r?\n/);
  for (const line of lines) {
    const index = line.indexOf(':');
    if (index < 0) continue;
    const key = line.slice(0, index).trim().toLowerCase();
    if (keys.some((candidate) => key === candidate.toLowerCase())) return line.slice(index + 1).trim();
  }
  return '';
};

const sanitizeInquiryText = (item) => {
  const blocked = /^(이메일|연락처|담당자명|담당자|email|phone|name|개인정보|privacy)\s*:/i;
  const lines = String(item.details || '')
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => !blocked.test(line));

  const message = String(item.message || '').trim();
  if (message && !lines.some((line) => line.includes(message.slice(0, 80)))) {
    lines.unshift(`요청 내용: ${message}`);
  }
  if (item.projectType && !lines.some((line) => line.toLowerCase().startsWith('작업 유형:'))) {
    lines.unshift(`작업 유형: ${String(item.projectType).trim()}`);
  }
  return lines.join('\n').slice(0, 9000);
};

const loadStyle = () => {
  if (document.querySelector('link[data-admin-recruit-final-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-recruits-final-20260824.css?v=20260824-1';
  link.dataset.adminRecruitFinalStyle = 'true';
  document.head.appendChild(link);
};

const renumberNav = () => {
  const order = ['dashboard', 'inquiry', 'recruits', 'members', 'partners', 'visitors'];
  order.forEach((key, index) => {
    const button = document.querySelector(`[data-admin-tab="${key}"]`);
    const number = button?.querySelector('span');
    if (number) number.textContent = String(index + 1).padStart(2, '0');
  });
};

const injectRecruitUI = () => {
  const nav = document.querySelector('.admin-nav');
  if (nav && !nav.querySelector('[data-admin-tab="recruits"]')) {
    const members = nav.querySelector('[data-admin-tab="members"]');
    const button = document.createElement('button');
    button.className = 'admin-nav__item';
    button.type = 'button';
    button.dataset.adminTab = 'recruits';
    button.innerHTML = '<span>03</span>Recruits';
    if (members) nav.insertBefore(button, members);
    else nav.appendChild(button);
  }

  if (!document.querySelector('[data-admin-panel="recruits"]')) {
    const panel = document.createElement('section');
    panel.className = 'admin-panel admin-recruit-panel';
    panel.dataset.adminPanel = 'recruits';
    panel.innerHTML = `
      <div class="admin-section-head">
        <div><span class="admin-label">Freelancer Recruit</span><h2>Recruits</h2><p>RECRUIT 페이지에서 접수된 예비 디자이너 신청만 별도로 확인합니다.</p></div>
      </div>
      <div class="admin-recruit-stat-grid">
        <article><span>TOTAL</span><strong data-recruit-stat="total">0</strong><p>전체 지원</p></article>
        <article><span>NEW</span><strong data-recruit-stat="new">0</strong><p>확인 전</p></article>
        <article><span>OPEN</span><strong data-recruit-stat="open">0</strong><p>검토 중</p></article>
        <article><span>DONE</span><strong data-recruit-stat="done">0</strong><p>검토 완료</p></article>
      </div>
      <div class="admin-recruit-list" data-admin-recruit-list><div class="admin-recruit-empty">지원 데이터를 불러오는 중입니다.</div></div>`;
    const membersPanel = document.querySelector('[data-admin-panel="members"]');
    if (membersPanel?.parentElement) membersPanel.parentElement.insertBefore(panel, membersPanel);
    else document.querySelector('.admin-main')?.appendChild(panel);
  }

  renumberNav();
  window.setTimeout(renumberNav, 250);
  window.setTimeout(renumberNav, 900);
};

const openRecruits = () => {
  document.querySelectorAll('[data-admin-tab]').forEach((tab) => tab.classList.toggle('is-active', tab.dataset.adminTab === 'recruits'));
  document.querySelectorAll('[data-admin-panel]').forEach((panel) => panel.classList.toggle('is-active', panel.dataset.adminPanel === 'recruits'));
  const title = document.querySelector('[data-admin-title]');
  if (title) title.textContent = 'Recruits';
  if (history.replaceState) history.replaceState(null, '', '#recruits');
  window.scrollTo({ top: 0, behavior: 'auto' });
};

const bindNavigation = () => {
  document.addEventListener('click', (event) => {
    const recruitTab = event.target.closest('[data-admin-tab="recruits"]');
    if (recruitTab) {
      openRecruits();
      return;
    }
    const otherTab = event.target.closest('[data-admin-tab]');
    if (otherTab && otherTab.dataset.adminTab !== 'recruits') {
      document.querySelector('[data-admin-tab="recruits"]')?.classList.remove('is-active');
      document.querySelector('[data-admin-panel="recruits"]')?.classList.remove('is-active');
    }
  });
};

const renderRecruitStats = (items) => {
  const counts = items.reduce((acc, item) => {
    acc.total += 1;
    acc[normalizeStatus(item.status)] += 1;
    return acc;
  }, { total: 0, new: 0, open: 0, done: 0 });
  Object.entries(counts).forEach(([key, value]) => {
    const node = document.querySelector(`[data-recruit-stat="${key}"]`);
    if (node) node.textContent = String(value);
  });
};

const renderRecruits = () => {
  const items = inquiryCache
    .filter((item) => isRecruit(item) && !isTrashed(item))
    .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
  renderRecruitStats(items);
  const box = document.querySelector('[data-admin-recruit-list]');
  if (!box) return;
  if (!items.length) {
    box.innerHTML = '<div class="admin-recruit-empty">아직 접수된 프리랜서 지원이 없습니다.</div>';
    return;
  }

  box.innerHTML = items.map((item) => {
    const role = detailsValue(item.details, ['currentRole', '현재 상태']) || '-';
    const strengths = detailsValue(item.details, ['strengths', '자신 있는 분야']) || '-';
    const tools = detailsValue(item.details, ['tools', '사용 가능한 툴']) || '-';
    const challenge = detailsValue(item.details, ['challenge', '해보고 싶은 일']) || '-';
    const availability = detailsValue(item.details, ['availability', '참여 가능 일정']) || '-';
    const portfolio = detailsValue(item.details, ['홈페이지 / 포트폴리오', 'website', '포트폴리오 링크']);
    const status = normalizeStatus(item.status);
    return `<article class="admin-recruit-card">
      <div class="admin-recruit-card__head">
        <div><span>${escapeHTML(formatDate(item.createdAt))} · ${escapeHTML(role)}</span><strong>${escapeHTML(item.contactName || '이름 미입력')}</strong><p>${escapeHTML(item.email || '-')} · ${escapeHTML(item.phone || '-')}</p></div>
        <select data-recruit-status="${escapeHTML(item.id)}" aria-label="지원자 검토 상태"><option value="new"${status === 'new' ? ' selected' : ''}>NEW / 확인 전</option><option value="open"${status === 'open' ? ' selected' : ''}>OPEN / 검토 중</option><option value="done"${status === 'done' ? ' selected' : ''}>DONE / 검토 완료</option></select>
      </div>
      <div class="admin-recruit-card__grid">
        <div><span>자신 있는 분야</span><b>${escapeHTML(strengths)}</b></div>
        <div><span>사용 툴</span><b>${escapeHTML(tools)}</b></div>
        <div><span>참여 가능 일정</span><b>${escapeHTML(availability)}</b></div>
        <div><span>포트폴리오</span>${portfolio ? `<a href="${escapeHTML(portfolio)}" target="_blank" rel="noopener">OPEN ↗</a>` : '<b>-</b>'}</div>
      </div>
      <div class="admin-recruit-card__copy"><span>자기소개</span><p>${escapeHTML(item.message || '-')}</p></div>
      <div class="admin-recruit-card__copy"><span>해보고 싶은 일</span><p>${escapeHTML(challenge)}</p></div>
      <details><summary>전체 신청 내용 보기</summary><pre>${escapeHTML(item.details || '')}</pre></details>
    </article>`;
  }).join('');
};

const partnerInquiryDetails = (partnerEmail) => inquiryCache
  .filter((item) => !isTrashed(item) && !isRecruit(item) && normalizeEmail(item.assignedPartnerEmail) === partnerEmail)
  .map((item) => ({
    id: item.id,
    company: String(item.company || '').slice(0, 200),
    projectName: String(item.projectName || '').slice(0, 200),
    projectType: String(item.projectType || '').slice(0, 500),
    status: normalizeStatus(item.status),
    inquiryText: sanitizeInquiryText(item)
  }));

const syncApprovedInquiryDetails = async () => {
  for (const partner of PARTNERS) {
    const items = partnerInquiryDetails(partner.email);
    const signature = JSON.stringify(items);
    if (lastDetailSignature.get(partner.email) === signature) continue;
    try {
      await setDoc(doc(db, 'partnerWorkspaces', workspaceKey(partner.email)), {
        name: partner.name,
        email: partner.email,
        approvedInquiryDetails: items,
        approvedInquiryUpdatedAt: serverTimestamp()
      }, { merge: true });
      lastDetailSignature.set(partner.email, signature);
    } catch (error) {
      console.warn('[NINEWORKS Admin] approved inquiry detail sync failed', error);
    }
  }
};

const queueSync = () => {
  window.clearTimeout(syncTimer);
  syncTimer = window.setTimeout(syncApprovedInquiryDetails, 220);
};

const bindRecruitStatus = () => {
  document.addEventListener('change', async (event) => {
    const select = event.target.closest('[data-recruit-status]');
    if (!select || !db) return;
    select.disabled = true;
    try {
      await updateDoc(doc(db, 'inquiries', select.dataset.recruitStatus), {
        status: normalizeStatus(select.value),
        updatedAt: serverTimestamp()
      });
    } catch (error) {
      console.error('[NINEWORKS Admin] recruit status update failed', error);
      window.alert('지원자 상태 변경에 실패했습니다.');
    } finally {
      select.disabled = false;
    }
  });
};

const start = () => {
  if (started) return;
  started = true;
  loadStyle();
  injectRecruitUI();
  bindNavigation();
  bindRecruitStatus();

  unsubscribe?.();
  unsubscribe = onSnapshot(collection(db, 'inquiries'), (snapshot) => {
    inquiryCache = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderRecruits();
    queueSync();
    renumberNav();
  }, (error) => console.error('[NINEWORKS Admin] recruit/partner final stream failed', error));
};

if (firebaseConfigReady && auth && db) {
  onAuthStateChanged(auth, (user) => {
    if (normalizeEmail(user?.email) === ADMIN_EMAIL) start();
  });
}
