import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  orderBy,
  query
} from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { getDownloadURL, ref as storageRef } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js';
import { db, storage, firebaseConfigReady, firebaseInitError } from './firebase-client.js';

const CATEGORY_LABELS = {
  contract: '계약서', proposal: '제안서', report: '보고서', deliverable: '산출물', reference: '참고자료', other: '기타'
};
const CONTRACT_STATUS = {
  draft: '계약 준비', sent: '계약서 전달', signed: '계약 완료', active: '진행중', ended: '종료'
};
const PROJECT_STATUS = { prospect: '계약 준비', client: '진행중', ended: '종료' };

let files = [];
let activeCategory = 'all';
let portalKey = '';
let unsubscribeFiles = null;

const escapeHTML = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#039;');

const asDate = (value) => {
  if (!value) return null;
  if (typeof value.toDate === 'function') return value.toDate();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
};
const formatDate = (value) => {
  const date = asDate(value);
  if (!date) return '-';
  return new Intl.DateTimeFormat('ko-KR', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(date);
};
const formatBytes = (bytes = 0) => {
  const value = Number(bytes || 0);
  if (value < 1024 * 1024) return `${Math.max(1, Math.round(value / 1024))} KB`;
  return `${(value / 1024 / 1024).toFixed(value >= 100 * 1024 * 1024 ? 0 : 1)} MB`;
};
const setText = (selector, value) => { const node = document.querySelector(selector); if (node) node.textContent = value || '-'; };

const showError = () => {
  document.querySelector('[data-portal-loading]')?.setAttribute('hidden', '');
  document.querySelector('[data-portal-content]')?.setAttribute('hidden', '');
  document.querySelector('[data-portal-error]')?.removeAttribute('hidden');
};

const renderPortal = (data) => {
  document.querySelector('[data-portal-loading]')?.setAttribute('hidden', '');
  document.querySelector('[data-portal-error]')?.setAttribute('hidden', '');
  document.querySelector('[data-portal-content]')?.removeAttribute('hidden');
  document.title = `${data.company || 'Client'} — NINEWORKS Client Portal`;
  setText('[data-portal-company]', data.company || 'Client');
  setText('[data-portal-project]', data.projectName || 'Project');
  setText('[data-portal-status]', PROJECT_STATUS[data.clientStage] || '진행중');
  setText('[data-portal-updated]', `UPDATED ${formatDate(data.updatedAt)}`);
  setText('[data-overview-company]', data.company || '-');
  setText('[data-overview-project]', data.projectName || '-');
  setText('[data-overview-contract-type]', data.contractType || '-');
  setText('[data-overview-period]', (data.contractStart || data.contractEnd) ? `${data.contractStart || '-'} — ${data.contractEnd || '-'}` : '-');
  setText('[data-contract-status]', CONTRACT_STATUS[data.contractStatus] || '-');
  setText('[data-contract-start]', data.contractStart || '-');
  setText('[data-contract-end]', data.contractEnd || '-');
  setText('[data-contract-amount]', data.contractAmount || '-');
  setText('[data-contract-payment]', data.paymentTerms || '-');
  const noticeWrap = document.querySelector('[data-portal-notice-wrap]');
  if (noticeWrap) noticeWrap.hidden = !data.portalMessage;
  setText('[data-portal-message]', data.portalMessage || '');
  const scopeWrap = document.querySelector('[data-scope-wrap]');
  if (scopeWrap) scopeWrap.hidden = !data.scope;
  setText('[data-portal-scope]', data.scope || '');
};

const renderFilters = () => {
  const node = document.querySelector('[data-portal-file-filter]');
  if (!node) return;
  const available = Array.from(new Set(files.map((file) => file.category || 'other')));
  if (!files.length) { node.innerHTML = ''; return; }
  node.innerHTML = [
    `<button type="button" class="${activeCategory === 'all' ? 'is-active' : ''}" data-file-category="all">전체 ${files.length}</button>`,
    ...available.map((category) => {
      const count = files.filter((file) => (file.category || 'other') === category).length;
      return `<button type="button" class="${activeCategory === category ? 'is-active' : ''}" data-file-category="${escapeHTML(category)}">${escapeHTML(CATEGORY_LABELS[category] || '기타')} ${count}</button>`;
    })
  ].join('');
};

const fileRow = (file) => `<article class="client-portal__file-row"><div class="client-portal__file-row__type"><span>${escapeHTML(CATEGORY_LABELS[file.category] || '기타')}</span></div><div class="client-portal__file-row__name"><strong>${escapeHTML(file.title || file.originalName || 'Document')}</strong><p>${escapeHTML(file.originalName || '-')} · ${formatBytes(file.size || 0)} · ${escapeHTML(formatDate(file.createdAt))}</p></div><button type="button" data-file-open="${escapeHTML(file.id)}">OPEN ↗</button></article>`;

const renderFiles = () => {
  renderFilters();
  const node = document.querySelector('[data-portal-files]');
  if (!node) return;
  const filtered = activeCategory === 'all' ? files : files.filter((file) => (file.category || 'other') === activeCategory);
  node.innerHTML = filtered.length ? filtered.map(fileRow).join('') : '<div class="client-portal__empty">등록된 공개 자료가 없습니다.</div>';
};

const openFile = async (id, button) => {
  const file = files.find((item) => item.id === id);
  if (!file?.storagePath || !storage) return;
  try {
    if (button) { button.disabled = true; button.textContent = 'OPENING...'; }
    const url = await getDownloadURL(storageRef(storage, file.storagePath));
    window.open(url, '_blank', 'noopener');
  } catch (error) {
    console.error('[NINEWORKS Client Portal] file open failed', error);
    alert('파일을 열 수 없습니다. 링크가 만료되었거나 공개가 중지되었습니다.');
  } finally {
    if (button) { button.disabled = false; button.textContent = 'OPEN ↗'; }
  }
};

const startFileStream = () => {
  if (!db || !portalKey) return;
  const filesQuery = query(collection(db, 'clientPortals', portalKey, 'files'), orderBy('createdAt', 'desc'));
  unsubscribeFiles = onSnapshot(filesQuery, (snapshot) => {
    files = snapshot.docs.map((item) => ({ id: item.id, ...item.data() }));
    renderFiles();
  }, (error) => {
    console.warn('[NINEWORKS Client Portal] file stream failed', error);
    files = [];
    renderFiles();
  });
};

const boot = async () => {
  portalKey = new URLSearchParams(location.search).get('key') || '';
  if (!portalKey || !firebaseConfigReady || firebaseInitError || !db) { showError(); return; }
  try {
    const snapshot = await getDoc(doc(db, 'clientPortals', portalKey));
    if (!snapshot.exists() || snapshot.data().enabled !== true) { showError(); return; }
    renderPortal({ id: snapshot.id, ...snapshot.data() });
    startFileStream();
  } catch (error) {
    console.error('[NINEWORKS Client Portal] boot failed', error);
    showError();
  }
};

document.addEventListener('click', (event) => {
  const categoryButton = event.target.closest('[data-file-category]');
  if (categoryButton) { activeCategory = categoryButton.dataset.fileCategory; renderFiles(); return; }
  const openButton = event.target.closest('[data-file-open]');
  if (openButton) openFile(openButton.dataset.fileOpen, openButton);
});
window.addEventListener('pagehide', () => { if (unsubscribeFiles) unsubscribeFiles(); });
boot();
