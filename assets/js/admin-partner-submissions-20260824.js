import { onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js';
import { collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { auth, db, firebaseConfigReady } from './firebase-client.js';

const ADMIN_EMAIL = 'info@9works.kr';
let accountCache = [];
let feedbackCache = [];
let unsubAccount = null;
let unsubFeedback = null;
let started = false;

const normalizeEmail = (value = '') => String(value || '').trim().toLowerCase();
const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
  .replace(/\"/g, '&quot;').replace(/'/g, '&#039;');
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
    timeZone: 'Asia/Seoul', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hour12: false
  }).format(new Date(ms));
};

const loadStyle = () => {
  if (document.querySelector('link[data-admin-partner-submissions-style]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-partner-submissions-20260824.css?v=20260824-1';
  link.dataset.adminPartnerSubmissionsStyle = 'true';
  document.head.appendChild(link);
};

const ensureSections = () => {
  const panel = document.querySelector('[data-admin-panel="partners"]');
  if (!panel) return false;
  if (panel.querySelector('[data-admin-partner-submission-grid]')) return true;
  const grid = document.createElement('div');
  grid.className = 'admin-partner-submission-grid';
  grid.dataset.adminPartnerSubmissionGrid = 'true';
  grid.innerHTML = `
    <section class="admin-partner-submission-block">
      <div class="admin-partner-submission-head"><span>PAYMENT INFORMATION</span><strong>파트너 계좌정보</strong></div>
      <div class="admin-partner-submission-list" data-admin-partner-bank-list><div class="admin-partner-submission-empty">등록된 계좌정보가 없습니다.</div></div>
    </section>
    <section class="admin-partner-submission-block">
      <div class="admin-partner-submission-head"><span>PROPOSAL FEEDBACK</span><strong>제안서 의견</strong></div>
      <div class="admin-partner-submission-list" data-admin-partner-feedback-list><div class="admin-partner-submission-empty">등록된 의견이 없습니다.</div></div>
    </section>`;
  panel.appendChild(grid);
  return true;
};

const renderAccounts = () => {
  if (!ensureSections()) return;
  const box = document.querySelector('[data-admin-partner-bank-list]');
  if (!box) return;
  const sorted = [...accountCache].sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt));
  const latestByEmail = new Map();
  sorted.forEach((item) => {
    const email = normalizeEmail(item.partnerEmail);
    if (email && !latestByEmail.has(email)) latestByEmail.set(email, item);
  });
  const items = Array.from(latestByEmail.values());
  box.innerHTML = items.length ? items.map((item) => `
    <article class="admin-partner-submission-row">
      <div class="admin-partner-submission-row__head"><strong>${escapeHTML(item.partnerName || item.partnerEmail || 'Partner')}</strong><time>${escapeHTML(formatDate(item.createdAt))}</time></div>
      <p>${escapeHTML(item.partnerEmail || '')}</p>
      <div class="admin-partner-submission-meta">
        <div><span>예금주</span><b>${escapeHTML(item.accountHolder || '-')}</b></div>
        <div><span>은행</span><b>${escapeHTML(item.bank || '-')}</b></div>
        <div><span>계좌번호</span><b>${escapeHTML(item.accountNumber || '-')}</b></div>
      </div>
    </article>`).join('') : '<div class="admin-partner-submission-empty">등록된 계좌정보가 없습니다.</div>';
};

const renderFeedback = () => {
  if (!ensureSections()) return;
  const box = document.querySelector('[data-admin-partner-feedback-list]');
  if (!box) return;
  const items = [...feedbackCache]
    .sort((a, b) => timestampMs(b.createdAt) - timestampMs(a.createdAt))
    .slice(0, 30);
  box.innerHTML = items.length ? items.map((item) => `
    <article class="admin-partner-submission-row">
      <div class="admin-partner-submission-row__head"><strong>${escapeHTML(item.partnerName || item.partnerEmail || 'Partner')} · ${escapeHTML(item.projectName || item.company || 'Project')}</strong><time>${escapeHTML(formatDate(item.createdAt))}</time></div>
      <p>${escapeHTML(item.message || '')}</p>
      ${item.proposalUrl ? `<a href="${escapeHTML(item.proposalUrl)}" target="_blank" rel="noopener">제안서 열기 ↗</a>` : ''}
    </article>`).join('') : '<div class="admin-partner-submission-empty">등록된 의견이 없습니다.</div>';
};

const waitForPanel = (attempt = 0) => {
  if (ensureSections()) {
    renderAccounts();
    renderFeedback();
    return;
  }
  if (attempt < 30) window.setTimeout(() => waitForPanel(attempt + 1), 120);
};

const start = () => {
  if (started) return;
  started = true;
  loadStyle();
  waitForPanel();
  unsubAccount?.();
  unsubFeedback?.();
  unsubAccount = onSnapshot(collection(db, 'partnerAccountSubmissions'), (snapshot) => {
    accountCache = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderAccounts();
  }, (error) => console.warn('[NINEWORKS Admin] partner account stream failed', error));
  unsubFeedback = onSnapshot(collection(db, 'partnerProposalFeedback'), (snapshot) => {
    feedbackCache = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderFeedback();
  }, (error) => console.warn('[NINEWORKS Admin] partner feedback stream failed', error));
};

if (firebaseConfigReady && auth && db) {
  onAuthStateChanged(auth, (user) => {
    if (normalizeEmail(user?.email) === ADMIN_EMAIL) start();
  });
}
