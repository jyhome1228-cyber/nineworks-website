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
