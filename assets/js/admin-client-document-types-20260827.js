import { collection, onSnapshot } from 'https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js';
import { db, firebaseConfigReady } from './firebase-client.js';

const DOCUMENT_TYPES = [
  ['quotation', '견적서'],
  ['contract', '계약서'],
  ['proposal', '제안서'],
  ['business-registration', '사업자등록증'],
  ['bank-account', '통장사본'],
  ['report', '보고서'],
  ['deliverable', '산출물'],
  ['reference', '참고자료'],
  ['other', '기타']
];

const LABELS = Object.fromEntries(DOCUMENT_TYPES);
let activeClientId = '';
let fileCategories = new Map();
let unsubscribeFiles = null;
let scheduled = false;

const ensureTypeOptions = () => {
  const select = document.querySelector('[data-client-upload-category]');
  if (!select) return;

  const current = select.value || 'quotation';
  const signature = DOCUMENT_TYPES.map(([value]) => value).join('|');
  if (select.dataset.documentTypeSignature !== signature) {
    select.innerHTML = DOCUMENT_TYPES
      .map(([value, label]) => `<option value="${value}">${label}</option>`)
      .join('');
    select.dataset.documentTypeSignature = signature;
  }

  if (DOCUMENT_TYPES.some(([value]) => value === current)) select.value = current;
  else select.value = 'quotation';
};

const polishDocumentCopy = () => {
  const help = document.querySelector('.admin-client-help');
  if (help) help.innerHTML = '견적서, 계약서, 제안서, 사업자등록증, 통장사본, 보고서 등 프로젝트 관련 문서를 <b>Documents</b>에서 한곳에 관리합니다. 공개가 필요한 파일만 Client Portal에 연결할 수 있습니다.';

  const portalNote = document.querySelector('.admin-client-portal-note p');
  if (portalNote) portalNote.textContent = '회사명, 프로젝트명, 계약 정보, 프로젝트 범위, Dashboard Message와 Documents에서 PORTAL ON으로 공개한 파일만 표시됩니다. 담당자 연락처와 내부 메모는 공개되지 않습니다.';

  const titleInput = document.querySelector('[data-client-upload-title]');
  if (titleInput && titleInput.placeholder !== '예: 2026.08 견적서 / 사업자등록증 사본') {
    titleInput.placeholder = '예: 2026.08 견적서 / 사업자등록증 사본';
  }
};

const decorateRows = () => {
  document.querySelectorAll('[data-client-file-id]').forEach((row) => {
    const id = row.dataset.clientFileId;
    const category = fileCategories.get(id);
    const label = LABELS[category];
    const type = row.querySelector('.admin-client-file-row__type > span');
    if (type && label && type.textContent !== label) type.textContent = label;
  });
};

const subscribeClientFiles = (clientId) => {
  if (!firebaseConfigReady || !db || !clientId || clientId === activeClientId) return;
  if (unsubscribeFiles) unsubscribeFiles();
  activeClientId = clientId;
  fileCategories = new Map();
  unsubscribeFiles = onSnapshot(collection(db, 'clients', clientId, 'files'), (snapshot) => {
    fileCategories = new Map(snapshot.docs.map((item) => [item.id, item.data()?.category || 'other']));
    decorateRows();
  }, (error) => {
    console.warn('[NINEWORKS Admin] document type label sync failed', error);
  });
};

const syncCurrentClient = () => {
  ensureTypeOptions();
  polishDocumentCopy();
  const id = String(document.querySelector('[data-client-form] input[name="clientId"]')?.value || '').trim();
  if (id) subscribeClientFiles(id);
  decorateRows();
};

const scheduleSync = () => {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(() => {
    scheduled = false;
    syncCurrentClient();
  });
};

const start = () => {
  scheduleSync();
  const observer = new MutationObserver(scheduleSync);
  observer.observe(document.body, { childList: true, subtree: true });
  document.addEventListener('click', () => setTimeout(scheduleSync, 0), true);
  document.addEventListener('change', scheduleSync, true);
  window.addEventListener('nw-admin-panel', scheduleSync);
  window.addEventListener('pagehide', () => {
    if (unsubscribeFiles) unsubscribeFiles();
  });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
