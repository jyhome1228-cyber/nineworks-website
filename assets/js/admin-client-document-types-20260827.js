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

const loadStyle = () => {
  if (document.querySelector('link[data-admin-client-common-docs]')) return;
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = 'assets/css/admin-client-common-docs-20260827.css?v=20260827-1';
  link.dataset.adminClientCommonDocs = 'true';
  document.head.appendChild(link);
};

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

const quotationURL = () => {
  const form = document.querySelector('[data-client-form]');
  const value = (name) => String(form?.elements.namedItem(name)?.value || '').trim();
  const params = new URLSearchParams();
  if (value('company')) params.set('company', value('company'));
  if (value('contactName')) params.set('contact', value('contactName'));
  if (value('projectName')) params.set('project', value('projectName'));
  if (value('contractStart')) params.set('start', value('contractStart'));
  if (value('contractEnd')) params.set('end', value('contractEnd'));
  const amount = value('contractAmount').replace(/[^0-9]/g, '');
  if (amount) params.set('amount', amount);
  return `client/quotation.html${params.toString() ? `?${params}` : ''}`;
};

const injectCommonDocuments = () => {
  const pane = document.querySelector('[data-client-pane="documents"]');
  if (!pane || pane.querySelector('[data-client-common-docs]')) return;
  const upload = pane.querySelector('.admin-client-upload');
  const section = document.createElement('section');
  section.className = 'admin-client-common-docs';
  section.dataset.clientCommonDocs = 'true';
  section.innerHTML = `
    <div class="admin-client-common-docs__head">
      <div><span class="admin-label">NINEWORKS Common Documents</span><h4>공통 문서</h4></div>
      <p>모든 클라이언트에 동일하게 제공됩니다.</p>
    </div>
    <div class="admin-client-common-docs__grid">
      <a class="admin-client-common-doc admin-client-common-doc--quote" href="client/quotation.html" target="_blank" rel="noopener" data-client-quotation-link>
        <span>QUOTATION TEMPLATE</span><strong>견적서 작성</strong><p>알피바이오 견적서 형식으로 기본 정보가 자동 입력됩니다.</p><b>CREATE ↗</b>
      </a>
      <a class="admin-client-common-doc" href="client/common/business-registration.html" target="_blank" rel="noopener">
        <span>COMMON / AUTO</span><strong>사업자등록 정보</strong><p>나인웍스 최신 사업자등록 내용을 공통 제공</p><b>OPEN ↗</b>
      </a>
      <a class="admin-client-common-doc" href="client/common/bank-account.html" target="_blank" rel="noopener">
        <span>COMMON / AUTO</span><strong>통장사본</strong><p>나인웍스 정산용 사업자 계좌 정보를 공통 제공</p><b>OPEN ↗</b>
      </a>
    </div>`;
  if (upload) pane.insertBefore(section, upload);
  else pane.prepend(section);
};

const syncQuotationLink = () => {
  const link = document.querySelector('[data-client-quotation-link]');
  if (link) link.href = quotationURL();
};

const polishDocumentCopy = () => {
  const help = document.querySelector('.admin-client-help');
  if (help) help.innerHTML = '견적서, 계약서, 제안서, 보고서 등 프로젝트별 문서는 <b>Documents</b>에서 관리합니다. 사업자등록 정보와 통장사본은 나인웍스 공통 문서로 자동 제공되므로 클라이언트마다 다시 업로드할 필요가 없습니다.';

  const portalNote = document.querySelector('.admin-client-portal-note p');
  if (portalNote) portalNote.textContent = '회사명, 프로젝트명, 계약 정보, 프로젝트 범위, Dashboard Message와 Documents에서 PORTAL ON으로 공개한 파일이 표시됩니다. 사업자등록 정보와 통장사본은 나인웍스 공통 문서로 자동 제공됩니다. 담당자 연락처와 내부 메모는 공개되지 않습니다.';

  const titleInput = document.querySelector('[data-client-upload-title]');
  if (titleInput && titleInput.placeholder !== '예: 2026.08 견적서 / 계약서 / 보고서') {
    titleInput.placeholder = '예: 2026.08 견적서 / 계약서 / 보고서';
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
  loadStyle();
  ensureTypeOptions();
  injectCommonDocuments();
  polishDocumentCopy();
  syncQuotationLink();
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
  document.addEventListener('input', scheduleSync, true);
  window.addEventListener('nw-admin-panel', scheduleSync);
  window.addEventListener('pagehide', () => {
    if (unsubscribeFiles) unsubscribeFiles();
  });
};

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
else start();
